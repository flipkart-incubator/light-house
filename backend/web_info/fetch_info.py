import logging
import os
import pwd
import subprocess
import time
from shutil import which
from utils import db_utils, constants, subdomain_utils, exceptions
from subdomain_enumeration import enumerator

import json

WEB_COLLECTION_NAME = "web"


def web_scan(log_id, enum_sub, domain):
    root_domain = domain
    domains = [domain]
    if enum_sub:
        result = db_utils.check(domain, constants.SUBDOMAIN_COLLECTION_NAME)
        if result:
            log_id = db_utils.create_scan_log(constants.SUBDOMAIN_SCAN_TYPE, domain, constants.ON_DEMAND_SCAN_SCHEDULE)
            domains = enumerator.enumerate_subdomains(log_id, domain)
        else:
            db_name = domain.split('.')[0]
            db = db_utils.client[str(db_name)]
            subdomain_collection = db[constants.SUBDOMAIN_COLLECTION_NAME]
            cursor = list(subdomain_collection.find())
            print(cursor[0])
            domains = list(cursor[0]['domains'].values())

    domain_file = subdomain_utils.generate_subdomain_file(domains, root_domain, enum_sub)
    db_utils.update_scan_log_status(log_id, constants.RUNNING_SCAN_LOGS_STATUS)
    httpx(root_domain, domain_file)

    output = db_utils.fetch_from_db(domain, constants.WEB_SCAN_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)

     


def httpx(root_domain, domain_file, rerun=0):
    if which("httpx"):
        user = pwd.getpwuid(os.getuid()).pw_name
        try:
            proc = subprocess.check_output(['/Users/'+str(user)+'/go/bin/httpx', '-status-code', '-title', '-tech-detect', '-l', domain_file, '-json'], stdin=subprocess.PIPE)
        except subprocess.CalledProcessError:
            logging.error("Error running fuzzer")
            raise exceptions.ffufFailedException

        scan_result = proc.decode("utf-8")
        scan_result_segmented = scan_result.split("\n")

        db_name = root_domain.split('.')[0]

        db = db_utils.client[str(db_name)]

        web_collection = db["web"]

        for scan_result in scan_result_segmented:
            if scan_result:
                json_result = json.loads(scan_result)
                web_collection.insert_one(json_result)
                db_utils.all_webinfo.insert_one(json_result)
        
                    
        
