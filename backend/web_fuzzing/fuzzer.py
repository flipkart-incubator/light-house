import json
import logging
import subprocess
from shutil import which

from subdomain_enumeration import enumerator
from utils import db_utils, constants, exceptions


def fuzz_site(log_id, domain, enum_sub):
    root_domain = domain
    domains = [domain]
    if enum_sub:
        result = db_utils.check(domain, constants.SUBDOMAIN_COLLECTION_NAME)
        if result:
            sub_log_id = db_utils.create_scan_log(constants.SUBDOMAIN_SCAN_TYPE, domain,
                                                  constants.ON_DEMAND_SCAN_SCHEDULE)
            domains = enumerator.enumerate_subdomains(sub_log_id, domain)
        else:
            db_name = domain.split('.')[0]
            db = db_utils.client[str(db_name)]
            subdomain_collection = db["subdomains"]
            cursor = list(subdomain_collection.find())
            if cursor:
                domains = list(cursor[0]['domains'].values())

    for domain in domains:
        db_utils.update_scan_log_status(log_id, constants.RUNNING_SCAN_LOGS_STATUS)
        ffuf(root_domain, domain)

    output = db_utils.fetch_from_db(root_domain, constants.FUZZ_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)


def ffuf(root_domain, domain, rerun=0):
    if which('ffuf'):
        print("\n\nRunning ffuf \n")
        # domain_file = "{}_httpx.txt".format(domain)

        try:
            proc = subprocess.check_output(['ffuf', '-w', 
                                                          './wordlist.txt', '-u', "https://" + domain + "/FUZZ", '--json'])
        except subprocess.CalledProcessError:
            logging.error("Error running fuzzer")
            raise exceptions.ffufFailedException

        scan_result = proc.decode("utf-8")
        scan_result_segmented = scan_result.split("\n")
        db_name = root_domain.split('.')[0]
        db = db_utils.client[str(db_name)]

        fuzz_collection = db[constants.FUZZ_COLLECTION_NAME]

        for scan_result in scan_result_segmented:
            if scan_result != '':
                try:
                    json_result = json.loads(scan_result)
                    fuzz_collection.insert_one(json_result)
                except json.decoder.JSONDecodeError:
                    print(scan_result)

        return scan_result_segmented
