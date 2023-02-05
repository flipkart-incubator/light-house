import React, { useState } from "react";
import {
  Button,
  Drawer,
  Input,
  Table,
  Form,
  Select,
  Space,
  Upload,
} from "antd";
import { flipkartDomains } from "../../Data/flipkartDomains";
import { UploadOutlined, SettingOutlined } from "@ant-design/icons";

const SecurityScans = () => {
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Endpoint",
      dataIndex: "endpoint",
    },
    {
      title: "Scan Type",
      dataIndex: "scanType",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: () => (
        <Space size="middle">
          <Button>Start</Button>
          <Button icon={<SettingOutlined />} onClick={showDrawer}></Button>
        </Space>
      ),
    },
  ];

  const data = [];

  for (let i = 0; i < flipkartDomains.length; i++) {
    let each = {
      key: i,
      name: flipkartDomains[i].Domain,
      endpoint: flipkartDomains[i].Domain,
      scanType: flipkartDomains[i].Domain,
      actions: flipkartDomains[i].Domain,
    };
    data.push(each);
  }

  const onSearch = (value) => console.log(value);
  const { Search } = Input;

  const [visible, setVisible] = React.useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

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

  return (
    <div className="main-content">
      <div className="pad-x1">
        <div className="pad-y1">
          <div className="flex-between">
            <Search
              placeholder="Search"
              allowClear
              onSearch={onSearch}
              style={{ width: "30rem" }}
              className="pad-x1"
            />
            <div className="flex">
              <Button onClick={showDrawer} type="primary">
                CREATE SCAN PROFILE
              </Button>
            </div>
          </div>
        </div>
        <div className="divide"></div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ defaultPageSize: 20 }}
        />
      </div>
      <Drawer
        title="Create Scan Profile"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={480}
      >
        <Form
          ref={formRef}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Asset Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter Asset Name!",
              },
            ]}
          >
            <Input placeholder="Enter Asset Name" />
          </Form.Item>

          <Form.Item
            label="Endpoint"
            name="endpoint"
            rules={[
              {
                required: true,
                message: "Please enter Endpoint!",
              },
            ]}
          >
            <Input placeholder="Enter Endpoint" />
          </Form.Item>
          <Form.Item
            label="Scan Type"
            name="scanType"
            rules={[
              {
                required: true,
                message: "Please select Scan Type!",
              },
            ]}
          >
            <Select
              placeholder="Select Scan Type"
              allowClear
              onChange={onTypeChange}
            >
              <Select.Option value="nucleiScan">Nuclei Scan</Select.Option>
              <Select.Option value="portScan">Port Scan</Select.Option>
              <Select.Option value="variantScanning">
                Variant Scanning
              </Select.Option>
            </Select>
          </Form.Item>
          {showUpload && (
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please upload a Nuclei Template!",
                },
              ]}
              name="upload"
            >
              <Upload>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          )}
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default SecurityScans;
