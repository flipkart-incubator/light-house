import React, {useEffect, useRef, useState} from "react";
import manageNucleiScan from "../../Services/nucleiScan";
import {Button, Input, Steps, Table, Space, Typography, Tooltip, Switch, Modal} from "antd";
import { useFilePicker } from "use-file-picker";

import {
  ScanOutlined,
  FileDoneOutlined,
  Loading3QuartersOutlined,
  DatabaseOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
import nucleiScan from "../../Services/nucleiScan";
import {Processors,scanColumns} from "../../utils/utils";
import axios from "axios";
import {comment} from "postcss";
const { Step } = Steps;
const { Title } = Typography;

const NucleiScan = () => {
  const columns = scanColumns.nucleiScanColumns

  const [tableData, setTableData] = useState([]);
  const [file, setFile] = useState();
  const inputFile = useRef(null)
  const inputRef = useRef()

  const fetchedData = (res) => {
    setScanCompleted("finish");
    setFetchingData("process");
    const data = Processors.ProcessNucleiScanData(res)
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
  const [enumSubdomains, setenumSubdomains] = useState("false")
  const [scanButtonText, setscanButtonText] = useState("Start Scan")
  const [templateModalVisible, settemplateModalVisible] = useState(false)
  const [scanning, setScanning] = useState("wait");
  const [scanCompleted, setScanCompleted] = useState("wait");
  const [fetchingData, setFetchingData] = useState("wait");
  const [displayingFetchedData, setDisplayingFetchedData] = useState("wait");
  const [nucleiTemplates, setnucleiTemplates] = useState()
  const [enabledTemplates, updateenabledTemplates] = useState([])

  const templatePageColumns = [
    {
      title: 'Name of Template',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title : 'Enable/Disable',
      dataIndex: 'switch',
      key:'switch-id',
      render: (text,record) => {
        return (
            <Switch id={record.name} onChange={(state,event) => onTemplateEnabled(event,state)}></Switch>
        )
      }

    },
  ]

  const onTemplateEnabled = (event,state) => {
    if (state === true) {
      console.log("Adding to the list")
      console.log(event.currentTarget.id)
      const templates = enabledTemplates
      templates.push(event.currentTarget.id)
      updateenabledTemplates(templates)
    }
    if (state === false) {
      console.log("Removing from the list")
      console.log(event.currentTarget.id)
      const newtemplates = enabledTemplates.filter(e => e !== event.currentTarget.id)
      updateenabledTemplates(newtemplates)

    }
    //console.log(state)
    //console.log(event.currentTarget.id)

  }

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
  const onChange = (checked) => {
    setenumSubdomains(checked)
  };
  useEffect(() => {}, [disabled, hostValue]);

  const fetchNucleiTemplates = () => {
    manageNucleiScan.getNucleiTemplates().then((res) => {
        console.log("Setting table data" + res)
        setNucleTemplateData(res)
    })
  }

  const setNucleTemplateData = (res) => {
    const data = []
    let t = 1;
    for (let i = 0 ; i < res.length; i++) {
        let each = {
          name: res[i]
        };
        data.push(each);
        t += 1;
    }
    console.log(data)
    setnucleiTemplates(data)
  }

  const fetchNucleiData = () => {
    setScanning("process");
    manageNucleiScan.getNucleiScan(hostValue,scanButtonText,enumSubdomains,enabledTemplates).then((res) => {
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

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
   //console.log(file)
    fetchNucleiTemplates()
    console.log("Fetching templates again")
  };
  const onChangeFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    console.log(file);
    setFile({file});
    let formData = new FormData();
    formData.append("file", file);
    
    axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(response => console.log(response));
    fetchNucleiTemplates()
  }
  const OpenNucleiTemplateModal = () => {
    settemplateModalVisible(true)
    fetchNucleiTemplates()
  }
  const handleOk = () => {
    settemplateModalVisible(false);
  };

  const handleCancel = () => {
    settemplateModalVisible(false);
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
                  onClick={fetchNucleiData}
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
                <Modal
                  visible={templateModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={[
                    <Button key="back" onClick={handleCancel}>
                      Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                      Ok
                    </Button>,
                    <Button
                        type="primary"
                        onClick={onButtonClick}
                    >
                      Upload Template
                    </Button>,
                  ]}
                >
                  <Table dataSource={nucleiTemplates} columns={templatePageColumns}>

                  </Table>
                </Modal>
                {/*<Button onClick={onButtonClick}>Manage Templates</Button>*/}
                <Button onClick={OpenNucleiTemplateModal}>Manage Templates</Button>
                <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={onChangeFile.bind(this)} accept=".yaml,.yml"/>
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
            </Space><div className="flex">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{ defaultPageSize: 20 }}
              style={{ width: "100%" }}
            /></div>

          </div>
        )}
      </div>
    </div>
  );
};

export default NucleiScan;
