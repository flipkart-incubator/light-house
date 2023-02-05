import {Button, Tooltip} from "antd";
import React from "react";
import {isContentEditable} from "@testing-library/user-event/dist/utils";


// The Spaces are added so that they get rendered correctly


const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
};

const subdomainColumns = [
    {
        title: "Subdomain Name",
        dataIndex: "subdomainName",
        align: "left",
    },
];

const portScanColumns = [
    {
        title: "S. No.",
        dataIndex: "key",
    },
    {
        title: "Host Name",
        dataIndex: "hostName",
        align: "center",
    },
    {
        title: "IP",
        dataIndex: "ip",
        align: "center",
    },
    {
        title: "Port",
        dataIndex: "port",
        align: "center",
    },
];

const testCOlumns = [
    {
        title: "S. No.",
        dataIndex: "key",
    },
    {
        title: "Host",
        dataIndex: "host",
        align: "left",
    },
];

const nucleiScanColumns = [
    {
        title: "S. No.",
        dataIndex: "key",
    },
    {
        title: "Host",
        dataIndex: "host",
        align: "left",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Severity",
        dataIndex: "severity",
        align: "center",
    },
]

const Fuzzingcolumns = [
    {
        title: "S. No.",
        dataIndex: "key",
    },
    {
        title: "URL",
        dataIndex: "url",
    },
    {
        title: "Results",
        dataIndex: "results",
    },
];



const ScreenShotColumns = [
    {
        title: "Host Name",
        dataIndex: "hostName",
        align: "center",
        render: (text,record) => {
            return (
                <a href={record.hostName} target="_blank">{record.hostName}</a>
            )
        }
    },
    {
        title: 'Screenshot',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
            return (
                <div className="flex">
                <img src={record.thumbnailPath}/>
                </div>
            );},
    },
]

const SSLColumns = [
    {
        title: "S. No.",
        dataIndex: "key",
    },
    {
        title: "Host",
        dataIndex: "host",
        align: "left",
    },
    {
        title: "Certificate Expiry",
        dataIndex: "cert_exp",
    },
    {
        title: "Days Left",
        dataIndex: "days_left",
    },
]

const makeTooltip = (val) => (
    <span>
    <ul>
      {val.map((each, id) => (
          <li>{each}</li>
      ))}
    </ul>
  </span>
);

const ProcessSubdomainData = (res) =>{
    let data = []
    for (let i=0 ; i< Object.keys(res[0].domains).length ;i ++) {
        let obj = {
            "subdomainName":res[0].domains[i]
        }
        data.push(obj)
    }
    return data
}

const ProcessPortScanData = (res) => {
    const data = [];
    let t = 1;

    for (let i = 0; i < (Object.keys(res).length-1); i++) {
        let each = {
            key: t,
            hostName: res[i].host,
            ip: res[i].ip,
            port: res[i].port,
        };
        data.push(each);
        t += 1;
    }
    return data
}

const ProcessNucleiScanData = (res) => {
    console.log(res)
    const data = [];
    let t = 1;
    console.log("This is the lenght "+Object.keys(res).length)
    console.log(res[0].info.severity)
    for (let i = 0; i < (Object.keys(res).length-1); i++) {
        console.log(res[i].host)
        let each = {
            key: t,
            host: res[i].host,
            severity: res[i].info.severity,
            name:res[i].info.name
        };
        data.push(each);
        t += 1;
    }
    return data
}

const ProcessFuzzingScanData = (res) => {
    console.log(res)
    let data = []
    let t = 1;
    console.log(res[3])
    for (let i = 0; i < (Object.keys(res).length - 1); i++) {
        let each = {
            key: t,
            url: res[i].url,
            results: res[i].status,
        };
        data.push(each);
        t += 1;
    }
    return data
}


const ProcessSSLScanData = (res) => {
    console.log("Hello its me")
    console.log(Object.keys(res[0]))
    const data = [];
    let t = 1;
    for (let i = 0; i < (Object.keys(res).length - 1); i++) {
        if ((Object.keys(res[i])).length !== 0) {
            let each = {
                key: t,
                host: res[i][Object.keys(res[i])]["host"],
                cert_exp: String(res[i][Object.keys(res[i])]["cert_exp"]),
                days_left: res[i][Object.keys(res[i])]["days_left"],
            };
            console.log(each)
            data.push(each);
            t += 1;
        }
    }
    return data
}
const ProcessScreenshotData = (res) => {
    const data = [];
    let t = 1;
    console.log(res)
    for (let i = 0; i < (Object.keys(res[0].pages).length - 1); i++) {
        let subdomain = Object.keys(res[0].pages)[i];
        let each = {
            hostName: res[0].pages[subdomain].url,
            thumbnailPath: res[0].pages[subdomain].thumbnailPath,
            screenshotPath: res[0].pages[subdomain].screenshotPath,
            bodyPath: res[0].pages[subdomain].bodyPath,
        };
        data.push(each);
        t += 1;
    }
    return data
}

const ProcessTechStackData = (res) => {
    const data = [];
    let t = 1;
    for (let i = 0; i < Object.keys(res).length -1; i++) {
        let each = {
            key: t,
            host: res[i].url,
            input: res[i].input,
            technologies: res[i].technologies,
        };
        data.push(each);
        t += 1;
    }
}

const scanColumns = {
    ScreenShotColumns,
    Fuzzingcolumns,
    nucleiScanColumns,
    portScanColumns,
    subdomainColumns,
    SSLColumns,
    testCOlumns,
}

const Processors = {
    ProcessPortScanData,
    ProcessNucleiScanData,
    ProcessFuzzingScanData,
    ProcessScreenshotData,
    ProcessSSLScanData,
    ProcessSubdomainData,
    ProcessTechStackData
}

const ScanTypeMapping = {
    "tech_stack_scan" :
        {
            "Name" : "Tech Stack Scan ",
            "TableType":"tech_stack_table",
            "Processor":Processors.ProcessTechStackData
        },
    "nuclei_scan":
        {
            "Name":"Nuclei Scan ",
            "TableType":scanColumns.nucleiScanColumns,
            "Processor":Processors.ProcessNucleiScanData,
        },
    "ssl_scan":
        {
            "Name":"SSL Scan ",
            "TableType":scanColumns.SSLColumns,
            "Processor":Processors.ProcessSSLScanData,
        },
    "web_fuzzing":
        {
            "Name":"Web Fuzzing ",
            "TableType":scanColumns.Fuzzingcolumns,
            "Processor":Processors.ProcessFuzzingScanData,
        },
    "screenshots":
        {
            "Name":"Screenshots Scan ",
            "TableType": scanColumns.ScreenShotColumns,
            "Processor":Processors.ProcessScreenshotData
        },
    "subdomain_enumeration":
        {
            "Name":"Subdomain Enumeration ",
            "TableType":scanColumns.subdomainColumns,
            "Processor":Processors.ProcessSubdomainData
        },
    "port_scan":
        {
            "Name": "Port Scan ",
            "TableType":scanColumns.portScanColumns,
            "Processor":Processors.ProcessPortScanData
        },
}

export {
    Processors,
    scanColumns,
    downloadFile,
    ScanTypeMapping
}