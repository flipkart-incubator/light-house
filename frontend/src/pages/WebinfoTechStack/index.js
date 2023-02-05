import React, { useEffect, useState } from "react";
import manageWebInfoTechStack from "../../Services/webInfoTechStack";
import {Button, Input, Steps, Table, Space, Typography, Tooltip, Switch} from "antd";
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

const makeTooltip = (val) => (
  <span>
    <ul>
      {val?.map((each, id) => (
        <li>{each}</li>
      ))}
    </ul>
  </span>
);

const WebinfoTechStack = () => {
  const columns = [
    {
      title: "S. No.",
      dataIndex: "key",
    },
    {
      title: "Host",
      dataIndex: "host",
      align: "center",
    },
    {
      title: "Input",
      dataIndex: "input",
      align: "right",
    },
    {
      title: "Technologies",
      dataIndex: "technologies",
      align: "center",
      render: (text) => (
        <Tooltip placement="top" title={makeTooltip(text)}>
          <Button>{String(text).length}</Button>
        </Tooltip>
      ),
    },
  ];
  const [tableData, setTableData] = useState([]);

  const fetchedData = (res) => {
    setScanCompleted("finish");
    setFetchingData("process");
    console.log(Object.keys(res))
    console.log(res[0])
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
    setFetchingData("finish");
    setDisplayingFetchedData("process");
    setTableData(data);
    setVisible(true);
    setExportDisabled(false);
  };

  const [visible, setVisible] = useState(false);

  const [disabled, setDisabled] = useState(true);
  const [hostValue, setHostValue] = useState("");
  const [exportDisabled, setExportDisabled] = useState(true);
  const [scanButtonText, setscanButtonText] = useState("Start Scan")
  const [enumSubdomains, setenumSubdomains] = useState("false")

  const [scanning, setScanning] = useState("wait");
  const [scanCompleted, setScanCompleted] = useState("wait");
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

  const fetchWebinfo = () => {
    setScanning("process");
    manageWebInfoTechStack.getWebInfoTechStack(hostValue,scanButtonText, enumSubdomains).then((res) => {
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
  const onChange = (checked) => {
    console.log(checked)
    setenumSubdomains(checked)
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
                    checkedChildren="Subdomain Scan"
                    unCheckedChildren="RootDomain Scan"
                    onChange={onChange}
                    disabled={disabled}/>
                <Button
                  type="primary"
                  disabled={disabled}
                  onClick={fetchWebinfo}
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

export default WebinfoTechStack;
