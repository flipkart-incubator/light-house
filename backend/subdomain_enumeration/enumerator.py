import datetime
import os
import subprocess
import time
from shutil import which
import logging
import traceback
from utils import constants
from utils import db_utils, exceptions
from pathlib import Path

today = datetime.date.today()


def check_gopath(cmd, install_repo):
    if os.environ["GOPATH"]:
        execs = os.listdir(os.path.join(os.environ["GOPATH"], "bin"))

    if cmd in execs:
        print(
            "\nFound '{}' in your $GOPATH/bin folder please add this to your $PATH".format(
                cmd
            )
        )
    else:
        ans = input(
            "\n{}{} does not appear to be installed, would you like to run `go get -u -v {}`? [y/N]{}")

        if ans.lower() == "y":
            print("\nInstalling {}".format(install_repo))
            os.system("go get -u -v {}".format(install_repo))
            return True


def subfinder(domain, rerun=0):
    if which("subfinder"):
        output_base = constants.BASE_PATH + "subdomains/{}".format(domain)
        subfinderFileName = "{}_subfinder.txt".format(output_base)
        p = Path(output_base)
        if not p.exists():
            os.makedirs(p)

        logging.info("Running subfinder")
        try:
            proc = subprocess.check_output(['subfinder', '-d', domain, '-o', subfinderFileName])
        except subprocess.CalledProcessError:
            logging.error("Error running subfinder")
            traceback.print_exc()
            raise exceptions.SubfinderFailedException
        logging.info("Subfinder Complete")
    else:
        raise exceptions.SubFinderNotFoundException


def amass(domain, rerun=0):
    if which("amass"):
        output_base = constants.BASE_PATH + "subdomains/{}".format(domain)
        amassFileName = "{}_amass.txt".format(output_base)
        p = Path(output_base)
        if not p.exists():
            os.makedirs(p)
        try:
            proc = subprocess.check_output(['amass', 'enum', '-d', domain, '-o', amassFileName])
        except subprocess.CalledProcessError:
            logging.error("Error running amass")
            raise exceptions.AmassFailedException
        logging.info("\nAmas s Complete")
    else:
        raise exceptions.AmassNotFoundException


def enumerate_subdomains(log_id, domain):
    db_name = domain.split('.')[0]
    db = db_utils.client.get_database(str(db_name))
    
    db_utils.update_scan_log_status(log_id, constants.RUNNING_SCAN_LOGS_STATUS)

    #amass(domain)
    subfinder(domain)

    try:
        final_domains = remove_duplicates(domain)
    except exceptions.FileOpeningException:
        db_utils.update_scan_log_status(log_id, constants.FILE_FAILED_STATUS)

    subdomains_collection = db["subdomains"]
    

    domains = {}
    for i, domain in enumerate(final_domains):
        domains[str(i)] = domain
    subdomains_collection.drop()
    final_domain_dict = {"domains": domains}
    try:
        subdomains_collection.insert_one(final_domain_dict)
        db_utils.all_subdomains.insert_one(final_domain_dict)
        db_utils.update_scan_logs(domains, constants.FINISHED_SCAN_LOGS_STATUS, log_id)

    except:
        logging.error("Error Inserting Into database")
        traceback.print_exc()
        db_utils.update_scan_log_status(log_id, constants.DATABASE_FAILED_STATUS)

    output = db_utils.fetch_from_db(domain, constants.SUBDOMAIN_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)

    return domains


def remove_duplicates(domain):
    domain_list = []
    with open("tempsubdomains/" + domain + "_subfinder.txt") as f:
        try:
            lines = f.readlines()
        except:
            logging.error("Error opening output file")
            traceback.print_exc()
            raise exceptions.FileOpeningException
    domain_list.append(lines)
    print(domain_list[0])
    domain_list = map(lambda s: s.strip(), domain_list[0])

    final_domains = list(set(domain_list))
    return final_domains
