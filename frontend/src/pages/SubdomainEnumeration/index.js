import React, { useEffect, useState } from "react";
import manageSubdomainsEnumeration from "../../Services/subdomainEnumeration";
import {Button, Input, Steps, Table, Space, Typography, Checkbox, Switch} from "antd";
import {Processors, scanColumns} from "../../utils/utils";
import {
  ScanOutlined,
  FileDoneOutlined,
  Loading3QuartersOutlined,
  DatabaseOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "./index.css";

import { CSVLink } from "react-csv";
const { Step } = Steps;
const { Title } = Typography;


const SubdomainEnumeration = () => {


  const [tableData, setTableData] = useState([]);

  const columns = scanColumns.subdomainColumns

  const fetchedData = (res) => {
    setScanCompleted("finish");
    setFetchingData("process");
    let data = Processors.ProcessSubdomainData(res)
    setFetchingData("finish");
    setDisplayingFetchedData("process");
    setTableData(data);
    setVisible(true);
    setExportDisabled(false);
  };

  const [visible, setVisible] = useState(true);

  const [disabled, setDisabled] = useState(true);
  const [hostValue, setHostValue] = useState("");
  const [exportDisabled, setExportDisabled] = useState(true);

  const [scanning, setScanning] = useState("wait");
  const [scanCompleted, setScanCompleted] = useState("wait");
  const [scanButtonText, setscanButtonText] = useState("Start Scan")
  const [fetchingData, setFetchingData] = useState("wait");
  const [displayingFetchedData, setDisplayingFetchedData] = useState("wait");

  const onInputChange = (e) => {
    let length = e.target.value.length;
    setHostValue(e.target.value);
    if (length > 0) setDisabled(false);
    else {
      setVisible(false);
      setDisabled(true);
      setExportDisabled(true);
      setScanning("wait");
      setScanCompleted("wait");
      setFetchingData("wait");
      setDisplayingFetchedData("wait");
    }
  };

  useEffect(() => {}, [disabled, hostValue]);

  const fetchSubdomains = () => {
    setScanning("process");
    manageSubdomainsEnumeration.getSubdomains(hostValue,scanButtonText).then((res) => {
      setScanning("finish");
      if (res["stale"] === true) {
          setscanButtonText("Force Scan")
      }
      fetchedData(res);
      setDisplayingFetchedData("finish");
    });
  };

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

  const exportAsJSON = (e) => {
    e.preventDefault();
    downloadFile({
      data: JSON.stringify(tableData),
      fileName: hostValue + ".json",
      fileType: "text/json",
    });
  };

  return (
    <div className="main-content">
      <div className="pad-x1">
        <div className="pad-y1">
          <div className="flex-between">
            <Input
              placeholder="Enter Host / Target Domain"
              allowClear
              style={{ width: "40rem", border: "0.75px solid #000" }}
              className="pad-x1"
              onChange={onInputChange}
              prefix={<GlobalOutlined style={{ paddingRight: "0.5rem" }} />}
            />
            <div className="flex">
              <Space>
                <Switch
                    defaultChecked
                    />
                <Button
                  type="primary"
                  disabled={disabled}
                  onClick={fetchSubdomains}
                >
                  {scanButtonText}
                </Button>
                <Button type="primary" disabled={exportDisabled}>
                  <CSVLink data={tableData} filename={`${hostValue}.csv`}>
                    Export as CSV
                  </CSVLink>
                </Button>
                <Button
                  type="primary"
                  disabled={exportDisabled}
                  onClick={exportAsJSON}
                >
                  Export as JSON
                </Button>
              </Space>
            </div>
          </div>
        </div>
        <div className="divide"></div>
        <Steps current={1} style={{ padding: "0.75rem 0rem" }}>
          <Step status={scanning} title="Scanning" icon={<ScanOutlined />} />
          <Step
            status={scanCompleted}
            title="Scan Completed"
            icon={<FileDoneOutlined />}
          />
          <Step
            status={fetchingData}
            title="Fetching Data"
            icon={<Loading3QuartersOutlined />}
          />
          <Step
            status={displayingFetchedData}
            title="Displaying Fetched Data"
            icon={<DatabaseOutlined />}
          />
        </Steps>
        {visible && (
          <div>
            <Space
              direction="horizontal"
              style={{ padding: "0.25rem 0 0.5rem 0" }}
            >
              <Title level={4}>Target Domain Name:</Title>
              <Title level={4} style={{ fontWeight: "400" }}>
                {hostValue}
              </Title>
            </Space>
            <div className="flex">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{ defaultPageSize: 20 }}
              style={{ width: "100%"}}
            /></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubdomainEnumeration;
