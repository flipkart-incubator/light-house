import React, { useEffect, useState } from "react";
import {Processors, subdomainColumns, portScanColumns, scanColumns} from "../../utils/utils";
import {Table, Steps, Modal, Space,Typography, Tooltip, Switch, DatePicker,Card, Button} from "antd";
import type { DatePickerProps } from 'antd';
import {ScanTypeMapping} from "../../utils/utils";
import manageScanLogs from "../../Services/scanLogs";
import managePortScan from "../../Services/portScan";

const { Title } = Typography;


const ScanScheduleMapping = {
    "on_demand":"On Demand ",
    "scheduled":"Recurring "
}

const ScanLogs = () => {
    const [scanLogsResponse, setscanLogsResponse] = useState("Select Date to view logs");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableType, setTableType] = useState();
    const [tableData, setTableData] = useState();
    const [date,setDate] = useState();
    const ShowModal = (value,output,status) => {
        if (status === "complete"){
            setTableData(ScanTypeMapping[value]["Processor"](output))
            setTableType(ScanTypeMapping[value]["TableType"])
            setIsModalOpen(true);
            }
    };
    const dateOnChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDate(dateString)
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const renderList = (result) => {
        let listItems = []
        Object.keys(result).forEach( (key, index) => {
                let cardTitle = ScanScheduleMapping[result[index].schedule]+ScanTypeMapping[result[index].type]["Name"]+"on "+result[index].domain
                let item =
                    <div className="pad-1">
                        <Card
                            hoverable={(result[index].status === "complete") ? true:false}
                            title={cardTitle}
                            style={{ width: "100%" }}
                            onClick={ShowModal.bind(this,result[index].type, result[index].output, result[index].status)}
                        ><div className="flex">
                            <div><b>Status</b>: {result[index].status}</div>
                        </div>
                        </Card><
                    /div>
                listItems.push(item)
        })
        setscanLogsResponse(listItems)
    }
  const fetchScanLogs = async() => {
        console.log("In here")
      let res = await manageScanLogs.getScanLogs(date)
      console.log(res)
         if (Object.keys(res).length === 0) {
             setscanLogsResponse("No data found")
             return res
         }
        renderList(res)
        return res
    }

    return (
        <div className="main-content">
            <div className="pad-x1">
                <div className="pad-y1">
                    <div className="flex-col flex-wrap">
                        <Modal
                            title="Title"
                            visible={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            <Table
                                dataSource={tableData}
                                columns={tableType}
                            >
                            </Table>
                        </Modal>
                        <div className="pad-1">
                        <div className="flex-between">
                            <DatePicker onChange={dateOnChange} />
                            <Button
                                type="primary"
                                onClick={fetchScanLogs}
                            >
                                Fetch Logs
                            </Button>
                        </div>
                        </div>
                        <div className="divide"></div>
                        <Steps current={1} style={{ padding: "0.75rem 0rem" }}>
                        </Steps>
                        <Space direction="vertical">
                        </Space>
                        {scanLogsResponse}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanLogs;
