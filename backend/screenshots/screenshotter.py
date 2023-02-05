from shutil import which
import subprocess

import utils.aquatone_utils
from utils import db_utils, subdomain_utils, constants
from subdomain_enumeration import enumerator


def screenshot_scan(log_id, enum_sub, domain):
    root_domain = domain
    domains = [domain]

    if enum_sub:
        result = db_utils.check(domain, "subdomains")
        if result:
            log_id = db_utils.create_scan_log(constants.SUBDOMAIN_SCAN_TYPE, domain, constants.ON_DEMAND_SCAN_SCHEDULE)
            domains = enumerator.enumerate_subdomains(log_id, domain)
        else:
            db_name = domain.split('.')[0]
            db = db_utils.client[str(db_name)]
            subdomain_collection = db["subdomains"]
            cursor = list(subdomain_collection.find())
            print(cursor[0])
            domains = list(cursor[0]['domains'].values())
    domain_file = subdomain_utils.generate_subdomain_file(domains, root_domain, enum_sub)
    db_utils.update_scan_log_status(log_id, constants.RUNNING_SCAN_LOGS_STATUS)
    aquatone(root_domain, domain_file)

    output = db_utils.fetch_from_db(domain, constants.SCREENSHOT_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)


def aquatone(root_domain, domain_file):
    pass