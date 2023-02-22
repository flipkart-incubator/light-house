import React, { useEffect, useState } from "react";
import manageSSLResult from "../../Services/sslResult";
import { Button, Input, Steps, Table, Space, Typography, Switch } from "antd";
import {downloadFile, Processors} from "../../utils/utils"
import {
  ScanOutlined,
  FileDoneOutlined,
  Loading3QuartersOutlined,
  DatabaseOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
const { Step } = Steps;
const { Title } = Typography;

const SSLResult = () => {
  const columns = [
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
  ];

  const [tableData, setTableData] = useState([]);

  const [visible, setVisible] = useState(false);

  const [disabled, setDisabled] = useState(true);
  const [hostValue, setHostValue] = useState("");
  const [exportDisabled, setExportDisabled] = useState(true);
  const [scanButtonText, setscanButtonText] = useState("Start Scan")

  const [scanning, setScanning] = useState("wait");
  const [scanCompleted, setScanCompleted] = useState("wait");
  const [fetchingData, setFetchingData] = useState("wait");
  const [enumSubdomains, setenumSubdomains] = useState("false")
  const [displayingFetchedData, setDisplayingFetchedData] = useState("wait");

  useEffect(() => {}, [disabled, hostValue]);

  const fetchedData = (setScanCompleted, setFetchingData, res, setDisplayingFetchedData,setTableData,setVisible,setExportDisabled) => {
    setScanCompleted("finish");
    setFetchingData("process");
    const data = Processors.ProcessSSLScanData(res)
    setFetchingData("finish");
    setDisplayingFetchedData("process");
    setTableData(data);
    setVisible(true);
    setExportDisabled(false);
  };

  const fetchSSLResults = () => {
    setScanning("process");
    manageSSLResult.getSSLResult(hostValue,scanButtonText,enumSubdomains).then((res) => {
      setScanning("finish");
      if (res["stale"] === true) {
        setscanButtonText("Force Scan")
      }
      fetchedData(setScanCompleted,setFetchingData,res,setDisplayingFetchedData,setTableData, setVisible, setExportDisabled);
      setDisplayingFetchedData("finish");
    });
  };

  const onChange = (checked) => {
    setenumSubdomains(checked)
  };

  const exportAsJSON = (e) => {
    e.preventDefault();
    downloadFile({
      data: JSON.stringify(tableData),
      fileName: hostValue + ".json",
      fileType: "text/json",
    });
  };
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
  return (
    <div className="main-content">
      <div className="pad-x1">
        <div className="pad-y1">
          <div className="flex-between">
            <Input
              placeholder="Enter Host / Target Domain"
              style={{ width: "20rem", border: "0.75px solid #000" }}
              className="pad-x1"
              onChange={onInputChange}
              prefix={<GlobalOutlined style={{ paddingRight: "0.5rem" }} />}
            />
            <div className="flex">
              <Space>
                <Switch
                    checkedChildren="Subdomain Scan"
                    unCheckedChildren="RootDomain Scan"
                    onChange={onChange}
                    disabled={disabled}/>

                <Button
                  type="primary"
                  disabled={disabled}
                  onClick={fetchSSLResults}
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
              style={{ width: "100%" }}
            />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SSLResult;
