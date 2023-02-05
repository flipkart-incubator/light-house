import React, { useState,useEffect } from "react";
import PieChart from "../../components/PieChart";
import TextVertical from "../../components/TextVertical";
import Frame from "../../components/Frame";
import { UploadOutlined } from "@ant-design/icons";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Space,
  Table,
  Input,
  Button,
  Drawer,
  Form,
  Select,
  Upload,
} from "antd";
import Error_Banner from "../../components/Error-Banner";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const Dashboard = () => {
  const onSearch = (value) => console.log(value);
  const { Search } = Input;
    function fetchData() {
    fetch("http://localhost:8095/healthcheck")
      .then((response) =>{
        console.log(response)
        if (response.status !== 200) {

          response.json().then(
              (data) => {
                console.log(data.detail[0])
                showErrorBanner(data.detail)
              }
          )
        }
      });
  }
  useEffect(() => {
    fetchData()
  }, [""]);


  const [ visible, setVisible] = useState(false);
  const [errorBannerVisible, seterrorBannerVisible] = useState("false")
  const [errorBannerDescription, seterrorBannerDescription] = useState("true")

  const showDrawer = () => {
    console.log("showing drawer")
   toast.error('🦄 Wow so easy!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
   });
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const showErrorBanner  = (description) => {
    seterrorBannerVisible("true")
    var final_description = ""
    for (let i = 0; i < description.length; i++) {
      final_description = final_description + " " +description[i]
    }
    console.log(final_description)
    seterrorBannerDescription(final_description + " not found in path. Please install them before beginning scans")
  }

  let formRef = React.createRef();

  const [showUpload, setShowUpload] = useState(false);

  const onTypeChange = (val) => {
    if (val === "variantScanning") setShowUpload(true);
    else setShowUpload(false);
  };

  const onReset = () => {
    formRef.current.resetFields();
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const columns = [
    {
      title: "Assets Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <Button type="primary" onClick={showDrawer}>
            Create Scan Profile
          </Button>
        </Space>
      ),
      align: "right",
    },
  ];
  const tableData = [
    {
      key: "1",
      name: "flipkart.com",
      status: "Approved",
    },
    {
      key: "2",
      name: "flipkart.com",
      status: "Approved",
    },
    {
      key: "3",
      name: "flipkart.com",
      status: "Approved",
    },
  ];

  return (
    <div className="main-content">
      <div className="flex" >
        <Error_Banner
          width="100%"
          isVisible={errorBannerVisible}
          errorDescription={errorBannerDescription}
          title={{ heading:"testing heading",value1: "Error"}}
        >
          <TextVertical
            val1="0"
            val2="Critical (New)"
            className1="ft-wg-500 text-head2 text-red1"
            className2="ft-wg-500"
          ></TextVertical>
        </Error_Banner></div>
      <div className="flex">
        <Frame
          url="/findings"
          width="52%"
          title={{ value1: "0", value2: "Open Findings" }}
        >
          <TextVertical
            val1="0"
            val2="Critical (New)"
            className1="ft-wg-500 text-head2 text-red1"
            className2="ft-wg-500"
          ></TextVertical>
          <TextVertical
            val1="6"
            val2="High (New)"
            className1="ft-wg-500 text-head2 text-red2"
            className2="ft-wg-500"
          ></TextVertical>
          <TextVertical
            val1="5"
            val2="Medium (New)"
            className1="ft-wg-500 text-head2 text-red3"
            className2="ft-wg-500"
          ></TextVertical>
          <TextVertical
            val1="9"
            val2="Low (New)"
            className1="ft-wg-500 text-head2 text-red4"
            className2="ft-wg-500"
          ></TextVertical>
        </Frame>
        <Frame
          url="/domains"
          width="44%"
          title={{ value1: "0", value2: "Domains" }}
        >
          <TextVertical
            val1="0"
            val2="Resolved Count"
            className1="ft-wg-500 text-head2 text-light"
            className2="ft-wg-500"
          ></TextVertical>
          <TextVertical
            val1="0"
            val2="Unresolved Count"
            className1="ft-wg-500 text-head2 text-light"
            className2="ft-wg-500"
          ></TextVertical>
          <TextVertical
            val1="0"
            val2="Subdomains"
            className1="ft-wg-500 text-head2 text-light"
            className2="ft-wg-500"
          ></TextVertical>
        </Frame>
      </div>
      <Frame url="/domainOverview" heading="Assets">
        <div className="width-100">
          <Search
            placeholder="Search for Assets"
            allowClear
            onSearch={onSearch}
            className="width-100 pad-b pad-x1"
          />
          <Table
            className="width-100"
            columns={columns}
            pagination={{ hideOnSinglePage: true }}
            dataSource={tableData}
          />
        </div>
      </Frame>

    </div>
  );
};

export default Dashboard;
