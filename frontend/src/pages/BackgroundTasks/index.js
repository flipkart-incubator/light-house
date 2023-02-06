import React, { useEffect, useState } from "react";
import {Processors, subdomainColumns, portScanColumns, scanColumns} from "../../utils/utils";
import {
    Table,
    Steps,
    Modal,
    Space,
    Typography,
    Tooltip,
    Switch,
    DatePicker,
    Card,
    Button,
    Menu,
    Dropdown,
    Input
} from "antd";

import type { DatePickerProps } from 'antd';
import {ScanTypeMapping} from "../../utils/utils";
import axios from "axios";
import {DownOutlined, GlobalOutlined} from "@ant-design/icons";
import {type} from "@testing-library/user-event/dist/type";
const { Title } = Typography;

const BackgroundTasks = () => {
    const [backgroundtaskResponse, setbackgroundtaskResponse] = useState("Select Date to view logs");
    const [typeofScan, settypeofScan] = useState("")
    const [scanName,setscanName] = useState("Select type of scan")
    const [hostValue,sethostValue] = useState("")
    const [domainValue,setdomainValue] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enumSubdomains, setenumSubdomains] = useState("false")
    const [disabled, setSwitchdisabled] = useState(false)

    const handleOk = () => {
        const url = `${process.env.REACT_APP_API_URL}/tasks/${domainValue}/${typeofScan}/${hostValue}`;

        const response = axios.get(url,{ params: { enum:enumSubdomains}}).then((resp) =>
            console.log(resp)
        )
        console.log(response)
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const fetchBackgroundTasks = async() => {
        const url = `${process.env.REACT_APP_API_URL}/background_tasks`;
        const response = await axios.get(url)

        renderList(response.data)
        return response.data
    }

    const renderList = (result) => {

        let cards = result.map( row =>
            <div className="pad-1">
            <Card
                title={ScanTypeMapping[row.definition.name]["Name"]}
        >
                Last run at {row.meta.last_run_at.hour}:{row.meta.last_run_at.minute}:{row.meta.last_run_at.second} GMT <br/>
                <br/>
                Scheduled to run every {row.definition.schedule.every} seconds
            </Card>
            </div>
        )
        setbackgroundtaskResponse(cards)
        return cards
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleMenuClick = ({key}) => {
        if (key === "subdomain_enumeration"){
            setSwitchdisabled(true)
        }
        else {
            setSwitchdisabled(false)
        }
        settypeofScan(key)
        setscanName(ScanTypeMapping[key]["Name"])
    }
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="subdomain_enumeration">Subdomain Enumeration</Menu.Item>
            <Menu.Item key="port_scan">Port Scan</Menu.Item>
            <Menu.Item key="tech_stack_scan">Tech Stack Scan</Menu.Item>
            <Menu.Item key="nuclei_scan">Nuclei Scan</Menu.Item>
            <Menu.Item key="ssl_scan">SSL Scan</Menu.Item>
        </Menu>
    );
    const onInputChange = (e) => {
        sethostValue(e.target.value);
    }

    const onDomainChange = (e) => {
        setdomainValue(e.target.value)
    }
    const onSwitchChange = (checked) => {
        setenumSubdomains(checked)
    };
    const OpenModal = () => {
        setIsModalOpen("true")
    }
    useEffect(() => {
        fetchBackgroundTasks()
    }, [""]);
    return (
        <div className="main-content">
            <div className="pad-x1">
                <div className="pad-y1">
                    <div className="flex-col flex-wrap">
                        <div className="pad-1">
                            <div className="flex-between">
                                <Button
                                    type="primary"
                                    onClick={OpenModal}
                                > Create Background Task</Button>

                                <Modal
                                        title="Setup a new background task"
                                        visible={isModalOpen}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                    >
                                        <div className={"flex-col"}>
                                            <div className="flex flex-row">

                                            <Dropdown overlay={menu} trigger={["click"]}>
                                                <a
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    {scanName} <DownOutlined />
                                                </a>
                                            </Dropdown>
                                            <div className="pad-x1"></div>
                                                <div className="pad-x1"></div>
                                            <Switch
                                                checkedChildren="Subdomain Scan"
                                                unCheckedChildren="RootDomain Scan"
                                                onChange={onSwitchChange}
                                                disabled={disabled}

                                            /></div>

                                           <div className="pad-y1">
                                               <p>
                                                   Enter Duration of when the scan should be repeated(in seconds)
                                               </p>
                                            <Input
                                                allowClear
                                                style={{ width: "30rem", border: "0.75px solid #000" }}
                                                className="pad-x1"
                                                onChange={onInputChange}
                                            /></div>
                                            <div className="pad-y1">
                                                <p>
                                                    Domain / Asset for the Scan
                                                </p>
                                                <Input
                                                    allowClear
                                                    style={{ width: "30rem", border: "0.75px solid #000" }}
                                                    className="pad-x1"
                                                    onChange={onDomainChange}
                                                /></div>
                                        </div>
                                    </Modal>
                            </div>
                        </div>
                        <div className="divide"></div>
                        <Steps current={1} style={{ padding: "0.75rem 0rem" }}>
                        </Steps>
                        <Space direction="vertical">
                        </Space>
                        {backgroundtaskResponse}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundTasks;
