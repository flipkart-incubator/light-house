SCAN_LOGS_DB_NAME: str = "scan_logs"
INITIAL_SCAN_LOGS_STATUS: str = "init"
RUNNING_SCAN_LOGS_STATUS: str = "running"
FINISHED_SCAN_LOGS_STATUS: str = "complete"

ON_DEMAND_SCAN_SCHEDULE: str = "on_demand"
RECCURING_SCHEDULE: str = "scheduled"

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


