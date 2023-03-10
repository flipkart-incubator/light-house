<p align="center">Light-House</p>
<p align="center"><img width="200" src="https://github.com/flipkart-incubator/light-house/blob/main/frontend/public/ligthouse.png" alt="logo">

### An In-House Application Security On-Demand and CAST Solution

Ligthouse is an amazing web based interactive UI solution, which covers all the important recon scans ( active / passive ) for your assets at a single place.

### Features :
- Subdomain Enumeration
- Nuclei Active Scanning
- CAST Scans
- Port Scans
- Website Techstack Grabber
- SSL Certificate / Expiry Check

#### To be added :
- Screenshot Grabbing
- Directory Fuzzing

### Requirements :

- Python 3.10 +
- Redis Server
- MongoDB
- Node.js v16.17.0
- Go

### Tool requirements :

- subfinder
- amass
- nuclei
- ssl-checker
- naabu
- nmap
- httpx
- aquatone
- ffuf

Above tools must be installed on the system, post successful installation of above tools we can follow light-house setting up steps below

### Setting Up the Tool :

#### Frontend Setup :

- Go to the frontend directory and run following commmand :
```
npm install
```
- node version "v16.17.0" to be already installed

#### Backend Setup :

- Run the following commands :

```shell
pip install -r requirements.txt
brew install redis
brew install mongodb
```

* Setup a virtualenv if you prefer that

 
### Running Lighthouse :

#### Frontend :

```
npm start
```

#### Backend :

- Run Services

```
redis-server
brew services restart mongodb-community
```

- In backend directory, run the following commands. ( different shell tabs respectively )

```
python3 -m uvicorn main:app --port 8080 --reload

celery -A main.celery beat -S redbeat.RedBeatScheduler
celery -A main.celery worker
```

##### Please feel free to provide your valuable feedbacks.
