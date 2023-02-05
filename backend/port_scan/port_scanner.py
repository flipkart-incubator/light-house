import logging
from csv import reader
from datetime import datetime
from io import StringIO

import ipcalc
import nmap

from subdomain_enumeration import enumerator
from utils import db_utils, constants


def scan_ports(log_id, domain, enum_sub, type_of_host):
    db_name = domain.split('.')[0]
    db = db_utils.client[str(db_name)]

    ports_collection = db["ports"]
    ports_collection.drop()
    domains = [domain]
    root_domain = domain
    ips = []
    if type_of_host == "cidr":
        # domain = domain.split('.')[-1]
        for x in ipcalc.Network(domain):
            scan(log_id, domain, x, type_of_host)

        return

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
    for domain in domains:
        scan(log_id, root_domain, str(domain), type_of_host)

    output = db_utils.fetch_from_db(domain, constants.PORTS_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)


def scan(log_id, root_domain, domain, type_of_host):
    db_utils.update_scan_log_status(log_id, constants.RUNNING_SCAN_LOGS_STATUS)
    print("Scanning ports on host " + str(domain))

    nm = nmap.PortScanner()
    if type_of_host == "cidr":
        db_name = root_domain.replace('.', '').split("/")[0]
        scan_domain = domain.dq
    else:
        db_name = root_domain.split('.')[0]
        scan_domain = domain

    nm.scan(scan_domain)
    logging.info("Scanning complete , dumping results in mongodb")
    # Convert CSV to a file object
    f = StringIO(nm.csv())

    # Read that file object
    new_reader = reader(f, delimiter=';')
    final_dict = {}


    db = db_utils.client[str(db_name)]

    ports_collection = db[constants.PORTS_COLLECTION_NAME]

    for i, line in enumerate(new_reader):
        if i != 0:
            new_dict = dict(host=line[1], ip=line[0], port=line[4], timestamp=datetime.now())
            ports_collection.insert_one(new_dict)
            db_utils.all_ports.insert_one(new_dict)
            final_dict[str(i)] = new_dict

    return final_dict
