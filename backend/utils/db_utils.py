import pymongo
import datetime
from . import constants
from uuid import uuid4
import base64
import pickle

client = pymongo.MongoClient("mongodb://localhost:27017/")

dblist = client.list_database_names()

all_db = client[str("all_db")]
all_nuclei = all_db["all_nuclei"]
all_subdomains = all_db["all_subdomains"]
all_ports = all_db["all_ports"]
all_screenshots = all_db["all_screenshots"]
all_webinfo = all_db["all_webinfo"]
all_fuzz = all_db["all_fuzz"]
all_ssl = all_db["all_ssl"]
all_ssl_domains = all_db["all_ssl_domains"]
all_count = all_db["all_count"]


def check(targetName, collection_name):
    db_check = targetName.split('.')[0]
    print(db_check)
    if str(db_check) not in dblist:
        return True
    if str(db_check) in dblist:
        db_temp = client[str(db_check)]
        db_temp_collection_list = db_temp.list_collection_names()
        if collection_name not in db_temp_collection_list:
            return True
    if str(db_check) in dblist:
        db_temp = client[str(db_check)]
        db_temp_collection_list = db_temp.list_collection_names()
        if collection_name in db_temp_collection_list:
            return False


def update_scan_log_status(log_id, status):
    db = client.get_database(constants.SCAN_LOGS_DB_NAME)
    collection = db[datetime.date.today().isoformat()]
    query = {"log_id": log_id}
    updated_value = {"$set": {"status": status}}
    collection.update_one(query, updated_value)


def add_output_to_scan_log(log_id, output):
    db_name = constants.SCAN_LOGS_DB_NAME
    db = client.get_database(str(db_name))
    collection = db[datetime.date.today().isoformat()]
    query = {"log_id": log_id}
    updated_value = {"$set": {"output": output}}
    collection.update_one(query, updated_value)


def create_scan_log(scan_type, domain, schedule):
    scan_id = str(uuid4())
    scan_log = {
        "type": scan_type,
        "domain": domain,
        "status": constants.INITIAL_SCAN_LOGS_STATUS,
        "log_id": scan_id,
        "output": "",
        "schedule": schedule,
    }
    db_name = constants.SCAN_LOGS_DB_NAME
    db = client.get_database(str(db_name))
    day_collection = db[datetime.date.today().isoformat()]
    day_collection.insert_one(scan_log)
    return scan_id


def update_scan_logs(output, status, log_id):
    if log_id is not None:
        update_scan_log_status(log_id, status)
        if output is not None:
            b64op = base64.b64encode(pickle.dumps(output))
            add_output_to_scan_log(log_id, b64op)


def fetch_from_db(site_name: str, collection_name: str):
    db_formatted = site_name.split('.')[0]
    db = client.get_database(str(db_formatted))
    t = db[collection_name]
    query = t.find()
    output = {}
    i = 0
    for x in query:
        output[i] = x
        output[i].pop('_id')
        i += 1
    return output

def fetch_all_from_db(collection_name: str):
    db_formatted = "all_db"
    db = client.get_database(str(db_formatted))
    t = db[collection_name]
    query = t.find()
    output = {}
    i = 0
    for x in query:
        output[i] = x
        output[i].pop('_id')
        i += 1
    return output
