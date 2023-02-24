import base64
import binascii
import json
import os
import pathlib
import pickle
import secrets
import string
import time
from shutil import which
from typing import List

import redis
import jwt
import re

import requests
from celery import Celery
from celery import schedules

from fastapi import FastAPI, Request, Response, Query
from fastapi import status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from redbeat import RedBeatSchedulerEntry
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi import File, UploadFile

from nuclei_scanner import nuclei_scan
from port_scan import port_scanner
from ssl_checker.ssl_check import SSLChecker
from subdomain_enumeration import enumerator
from utils import db_utils, constants, aquatone_utils, exceptions
from web_fuzzing import fuzzer
from web_info import fetch_info

from fastapi.openapi.utils import get_openapi

tags_metadata = [
    {
        "name": "Scans",
        "description": "Operations with Scans. Initiate new types of scans using these endpoints",
    },
    {
        "name": "admin",
        "description": "General Administration stuff , this is where the login and auth logic lives",
    },
    {
        "name": "healthcheck",
        "description": "Healthcheck endpoint for ensuring all the tools are installed before running the scans"
    },
    {
        "name": "scheduler",
        "description": "Interface with the scheduler, fetch and add more recurring tasks"
    },
]

app = FastAPI(openapi_tags=tags_metadata)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def custom_openapi():
    # Cache the Schema if you can
    if app.openapi_schema:
        return app.openapi_schema
    # Setup general things
    openapi_schema = get_openapi(
        title="Lighthouse",
        version="v1",
        description="CAST and ON-Demand Scanning",
        routes=app.routes,
        tags=tags_metadata
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "http://localhost:3000/favicon.ico"
    }
    app.openapi_schema = openapi_schema
    app.openapi_tags = tags_metadata
    return app.openapi_schema


app.openapi = custom_openapi
app.openapi_tags = tags_metadata

r = redis.Redis(host='localhost', port=6379, db=0)

celery = Celery(
    __name__,
    broker="redis://localhost:6379/",
    backend="redis://localhost:6379/",
    redbeat_redis_url="redis://localhost:6379",
    redbeat_key_prefix='redbeat',
    beat_scheduler='redbeat.RedBeatScheduler',
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
def upload(file: UploadFile = File(...)):
    try:
        text_path = "./nuclei_templates/"
        path = pathlib.Path(text_path)
        if not path.exists():
            os.makedirs(path, exist_ok=True)
        with open("./nuclei_templates/custom/" + file.filename, 'wb') as f:
            while contents := file.file.read(1024 * 1024):
                f.write(contents)
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        file.file.close()

    return {"message": f"Successfully uploaded {file.filename}"}


@app.get("/nuclei_templates")
async def fetch_templates():
    path = "./nuclei_templates/custom"
    dir_list = os.listdir(path)
    dir_list.append("default")
    return dir_list


@app.get("/")
async def root():
    return {"message": "It works"}


@app.get("/subdomains/{site}", tags=["Scans"])
async def enum_subdomains(site: str, force=False):
    stale = True
    log_id = None
    if force == 'false':
        force_scan = False
    else:
        force_scan = True
    result = db_utils.check(site, collection_name="subdomains")
    if result or force_scan:
        stale = False
        #result = enumerator.enumerate_subdomains("1",str(site))
        try:
           result = subdomains_async(str(site), constants.ON_DEMAND_SCAN_SCHEDULE)
        except exceptions.SubfinderFailedException:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=exceptions.SubfinderFailedException.return_text
            )
        except exceptions.AmassFailedException:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Running Amass Failed"
            )
        except exceptions.FileOpeningException:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error Opening file"
            )

    output = db_utils.fetch_from_db(site, constants.SUBDOMAIN_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)
    output["stale"] = stale
    return output


@app.get("/domains/")
async def all_subdomains():
    output = db_utils.fetch_all_from_db(constants.ALL_SUBDOMAIN_COLLECTION_NAME)
    with open("../frontend/src/Data/flipkartDomains.js","w") as f:
        f.write(str("export const flipkartDomains = ["))
        f.write(str(output))
        f.write("]")
    f.close

@app.get("/ports/{site:path}", tags=["Scans"])
async def port_scan(site: str, enum: bool, input_type="hostname", force=False):
    stale = True
    log_id = None
    if force == 'false':
        force_scan = False
    else:
        force_scan = True
    result = db_utils.check(site, constants.PORTS_COLLECTION_NAME)
    if result or force_scan:
        stale = False
        try:
            result = ports_async(site, enum, constants.ON_DEMAND_SCAN_SCHEDULE)
            #result = port_scanner.scan_ports("1", site, enum, input_type)
        except exceptions.SubfinderFailedException:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=exceptions.SubfinderFailedException.return_text
            )
        except exceptions.AmassFailedException:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Running Amass Failed"
            )
        except exceptions.FileOpeningException:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error Opening file"
            )
    output = db_utils.fetch_from_db(site, constants.PORTS_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)
    output["stale"] = stale
    return output


@app.get("/ssl_check/{site}", tags=["Scans"])
async def ssl_check(site: str, enum: bool, force=False):
    stale = True
    log_id = None
    if force == 'false':
        force_scan = False
    else:
        force_scan = True
    result = db_utils.check(site, constants.SSL_COLLECTION_NAME)
    if result or force_scan:
        stale = False
        #celery_result = ssl_checking(site, enum)
        try:
            celery_result = ssl_async(site, enum, constants.ON_DEMAND_SCAN_SCHEDULE)
        except exceptions.SubfinderFailedException:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=exceptions.SubfinderFailedException.return_text
            )
        except exceptions.AmassFailedException:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Running Amass Failed"
            )
        except exceptions.FileOpeningException:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error Opening file"
            )
    output = db_utils.fetch_from_db(site, constants.SSL_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)
    output["stale"] = stale
    return output


@app.get("/nuclei/{site}", tags=["Scans"])
async def nuclei(site: str, enum: bool, enabled_templates: list[str] | None = Query(default=None), force=False):
    if enabled_templates is None:
        enabled_templates = ["default"]

    stale = True
    log_id = None

    if force == 'false':
        force_scan = False
    else:
        force_scan = True
    result = db_utils.check(site, constants.NUCLEI_COLLECTION_NAME)
    if result or force_scan:
        stale = False
        nuclei_scan.nuclei_scanner(log_id, site, enum, enabled_templates)

        #result = nuclei_async.delay(site, enum, templates, constants.ON_DEMAND_SCAN_SCHEDULE)
        #result.wait()

    output = db_utils.fetch_from_db(site, constants.NUCLEI_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)
    output["stale"] = stale
    return output

@app.get("/web_scan/{site}", tags=["Scans"])
async def web_scan(site: str, enum: bool, force=False):
    stale = True
    log_id = None
    if force == 'false':
        force_scan = False
    else:
        force_scan = True
    result = db_utils.check(site, constants.WEB_SCAN_COLLECTION_NAME)
    if result or force_scan:
        stale = False
        log_id = db_utils.create_scan_log(constants.WEB_SCAN_TYPE, site, constants.ON_DEMAND_SCAN_SCHEDULE)
        #result = fetch_info.web_scan("1", enum, site)
        result = web_scan_async(site, enum, constants.ON_DEMAND_SCAN_SCHEDULE)

        # fetch_info.web_scan(log_id, enum, site)

    output = db_utils.fetch_from_db(site, constants.WEB_SCAN_COLLECTION_NAME)
    db_utils.update_scan_logs(output, constants.FINISHED_SCAN_LOGS_STATUS, log_id)
    output["stale"] = stale
    return output

@app.get("/healthcheck", tags=["healthcheck"])
async def healthcheck():
    tools = []
    if not which("amass"):
        tools.append("amass")

    if not which("subfinder"):
        tools.append("subfinder")

    if not which("nuclei"):
        tools.append("nuclei")

    if not which("aquatone"):
        tools.append("aquatone")

    if tools:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=tools
        )
    return {status.HTTP_200_OK}


@app.get("/tasks/{site}/{scan_type}/{seconds_to_run}", tags=["scheduler"])
async def task_scheduler(site: str, scan_type: str, seconds_to_run: str, enum: bool):
    interval = schedules.schedule(int(seconds_to_run))
    if scan_type == constants.FUZZ_SCAN_TYPE:
        entry = RedBeatSchedulerEntry(constants.FUZZ_SCAN_TYPE, 'main.fuzzing_async', interval,
                                      args=[site, enum, constants.RECCURING_SCHEDULE], app=celery)
        entry.save()
        return {"task_type": constants.FUZZ_SCAN_TYPE}
    if scan_type == constants.SUBDOMAIN_SCAN_TYPE:
        entry = RedBeatSchedulerEntry(constants.SUBDOMAIN_SCAN_TYPE, 'main.subdomains_async', interval,
                                      args=[site, constants.RECCURING_SCHEDULE], app=celery)
        entry.save()
        return {"task_type": constants.SUBDOMAIN_SCAN_TYPE}

    if scan_type == constants.NUCLEI_SCAN_TYPE:
        entry = RedBeatSchedulerEntry(constants.NUCLEI_SCAN_TYPE, 'main.nuclei_async', interval,
                                      args=[site, enum, constants.RECCURING_SCHEDULE], app=celery)
        entry.save()
        return {"task_type": constants.NUCLEI_SCAN_TYPE}
    if scan_type == constants.PORTS_SCAN_TYPE:
        entry = RedBeatSchedulerEntry(constants.PORTS_SCAN_TYPE, 'main.ports_async', interval,
                                      args=[site, enum, constants.RECCURING_SCHEDULE], app=celery)
        entry.save()
        return {"task_type": constants.PORTS_SCAN_TYPE}
    if scan_type == constants.SCREENSHOT_SCAN_TYPE:
        entry = RedBeatSchedulerEntry(constants.SCREENSHOT_SCAN_TYPE, 'main.screenshot_scan_async', interval,
                                      args=[site, enum, constants.RECCURING_SCHEDULE], app=celery)
        entry.save()
        return {"task_type": constants.SCREENSHOT_SCAN_TYPE}


@app.get("/background_tasks", tags=["scheduler"])
async def fetch_background_tasks():
    # We need keys of the type redbeatsubdomains_async and avoid redbeat:* hence the negation
    regex = re.compile("redbeat[^:][a-z,_]*")
    keys = []
    output = []
    for key in r.scan_iter():
        keys.append(key)
    keys = [i.decode('utf-8') for i in keys]
    newlist = list(filter(regex.match, keys))
    for element in newlist:
        newdict = {}
        binary_dict = r.hgetall(element)
        newdict[list(binary_dict.keys())[0].decode('utf-8')] = json.loads(list(binary_dict.values())[0].decode('utf-8'))
        newdict[list(binary_dict.keys())[1].decode('utf-8')] = json.loads(list(binary_dict.values())[1].decode('utf-8'))
        output.append(newdict)
    return output




@app.get("/scan_logs/{date}", tags=["scheduler"])
async def fetch_scan_logs(date: str):
    db = db_utils.client.get_database(constants.SCAN_LOGS_DB_NAME)
    t = db[date]
    query = t.find()
    outputs = {}
    i = 0
    for x in query:
        outputs[i] = x
        outputs[i].pop('_id')
        i += 1

    for output in outputs:
        fully_decoded = ''
        output_val = outputs[output]["output"]
        if output_val:
            b64decoded = base64.b64decode(output_val)
            fully_decoded = pickle.loads(b64decoded)
        outputs[output]["output"] = fully_decoded

    return outputs

@celery.task
def subdomains_async(site: str, schedule_type: str):
    log_id = db_utils.create_scan_log(constants.SUBDOMAIN_SCAN_TYPE, site, schedule_type)
    enumerator.enumerate_subdomains(log_id, site)

@celery.task
def ports_async(site: str, enum_sub: bool, schedule_type: str, input_type="hostname"):
    log_id = db_utils.create_scan_log(constants.PORTS_SCAN_TYPE, site, schedule_type)
    port_scanner.scan_ports(log_id, site, enum_sub, input_type)


@celery.task
def ssl_async(site: str, enum_sub: bool, schedule_type: str):
    log_id = db_utils.create_scan_log(constants.SSL_SCAN_TYPE, site, schedule_type)
    SSLCheckerObject = SSLChecker()
    SSLCheckerObject.scan_ssl(log_id, site, enum_sub)


@celery.task
def nuclei_async(site: str, enum_sub: bool, schedule_type: str, templates: [str]):
    log_id = db_utils.create_scan_log(constants.NUCLEI_SCAN_TYPE, site, schedule_type)
    nuclei_scan.nuclei_scanner(log_id, site, enum_sub, templates)


@celery.task
def web_scan_async(site: str, enum: bool, schedule_type: str):
    log_id = db_utils.create_scan_log(constants.SCREENSHOT_SCAN_TYPE, site, schedule_type)
    fetch_info.web_scan(log_id, enum, site)

