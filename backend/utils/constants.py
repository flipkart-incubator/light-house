SCAN_LOGS_DB_NAME: str = "scan_logs"
INITIAL_SCAN_LOGS_STATUS: str = "init"
RUNNING_SCAN_LOGS_STATUS: str = "running"
FINISHED_SCAN_LOGS_STATUS: str = "complete"

ON_DEMAND_SCAN_SCHEDULE: str = "on_demand"
RECCURING_SCHEDULE: str = "scheduled"


# all_db = client[str("all_db")]
# all_nuclei = all_db["all_nuclei"]
# all_subdomains = all_db["all_subdomains"]
# all_ports = all_db["all_ports"]
# all_screenshots = all_db["all_screenshots"]
# all_webinfo = all_db["all_webinfo"]
# all_fuzz = all_db["all_fuzz"]
# all_ssl = all_db["all_ssl"]
# all_ssl_domains = all_db["all_ssl_domains"]
# all_count = all_db["all_count"]

ALL_DB_COLLECTION_NAME: str = "all_db"
ALL_SUBDOMAIN_COLLECTION_NAME: str = "all_subdomains"
ALL_PORTS_COLLECTION_NAME: str = "all_ports"
ALL_FUZZ_COLLECTION_NAME: str = "all_fuzz"
ALL_WEBINFO_COLLECTION_NAME: str= "all_webinfo"
ALL_SSL_COLLECTION_NAME: str = "all_ssl_domains"
ALL_NUCLEI_COLLECTION_NAME: str = "all_nuclei"


SUBDOMAIN_SCAN_TYPE: str = "subdomain_enumeration"
SUBDOMAIN_COLLECTION_NAME: str = "subdomains"

PORTS_COLLECTION_NAME: str = "ports"
PORTS_SCAN_TYPE: str = "port_scan"

SSL_COLLECTION_NAME: str = "ssl"
SSL_SCAN_TYPE: str = "ssl_scan"

NUCLEI_COLLECTION_NAME: str = "nuclei"
NUCLEI_SCAN_TYPE: str = "nuclei_scan"

FUZZ_COLLECTION_NAME: str = "fuzzing"
FUZZ_SCAN_TYPE: str = "web_fuzzing"

WEB_SCAN_COLLECTION_NAME: str = "web"
WEB_SCAN_TYPE = "tech_stack_scan"

SCREENSHOT_COLLECTION_NAME: str = "screenshots"
SCREENSHOT_SCAN_TYPE = "screenshots"

AMASS_FAILED_STATUS = "amass_failed"
SUBFINDER_FAILED_STATUS = "subfinder_failed"
DATABASE_FAILED_STATUS = "database_failed"
FILE_FAILED_STATUS = "file_opening_failed"
SUBDOMAIN_ENUMERATION_FAILED_STATUS = "subdomain_enumeration_failed"

BASE_PATH = "./temp"


