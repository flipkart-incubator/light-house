import os
import pathlib

from . import db_utils, constants


def generate_subdomain_file(domains, root_domain, enum_sub):
    domain_file_path = constants.BASE_PATH + "/subdomain_file/"
    domain_file = constants.BASE_PATH + "/subdomain_file/" + "{}_subdomains.txt".format(root_domain)
    p = pathlib.Path(domain_file)
    if not p.exists():
        os.makedirs(domain_file_path, exist_ok=True)

    result = db_utils.check(root_domain, "subdomains")
    if enum_sub:
        with open(domain_file, "w+") as f:
            for domain in domains:
                f.write("https://" + domain + "\n")
    else:
        with open(domain_file, "w+") as f:
            f.write("https://" + root_domain)

    return domain_file
