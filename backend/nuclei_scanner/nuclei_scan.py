import json
import logging
import subprocess
import traceback
from shutil import which

from subdomain_enumeration import enumerator
from utils import db_utils, constants, exceptions


def nuclei_scanner(log_id, domain, enum_sub, templates):
    domains = [domain]
    root_domain = domain
    if enum_sub:
        result = db_utils.check(domain, "subdomains")

        if result:
            try:
                sub_log_id = db_utils.create_scan_log(constants.SUBDOMAIN_SCAN_TYPE, domain,
                                                      constants.ON_DEMAND_SCAN_SCHEDULE)
                domains = enumerator.enumerate_subdomains(sub_log_id, domain)
            except:
                logging.error("Error enumerating subdomains")
                traceback.print_exc()

        else:
            db_name = domain.split('.')[0]
            db = db_utils.client[str(db_name)]
            subdomain_collection = db[constants.SUBDOMAIN_COLLECTION_NAME]
            cursor = list(subdomain_collection.find())
            print(cursor[0])
            domains = list(cursor[0]['domains'].values())
    for domain in domains:
        db_utils.update_scan_log_status(log_id, constants.RUNNING_SCAN_LOGS_STATUS)
        scan(root_domain, domain, templates)

    output = db_utils.fetch_from_db(root_domain, constants.NUCLEI_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)


def scan(root_domain, domain, templates):
    if which("nuclei"):
        output_base = "./nuclei-output/{}".format(domain)
        print("\n\nRunning nuclei \n")
        command = ['nuclei']
        try:
            for template in templates:
                if template == 'default':
                    command.append("-t")
                    command.append("./nuclei_templates/default")
                    continue
                command.append("-t")
                command.append("./nuclei_templates/custom/"+template)
            #command.append('-u', domain, '-json')
            command.append('-u')
            command.append(domain)
            command.append('-json')
            proc = subprocess.check_output(command)
        except subprocess.CalledProcessError:
            logging.error("Error running fuzzer")
            raise exceptions.nucleiFailedException

        scan_result = proc.decode("utf-8")
        scan_result_segmented = scan_result.split("\n")
        db_name = root_domain.split('.')[0]
        db = db_utils.client[str(db_name)]

        ports_collection = db[constants.NUCLEI_COLLECTION_NAME]
        ports_collection.drop()

        for scan_result in scan_result_segmented:
            if scan_result != '':
                json_result = json.loads(scan_result)
                ports_collection.insert_one(json_result)
                db_utils.all_nuclei.insert_one(json_result)

        return scan_result_segmented
