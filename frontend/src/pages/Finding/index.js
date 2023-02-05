import React, { useState } from "react";
import {
  Checkbox,
  Button,
  Dropdown,
  Menu,
  Drawer,
  Input,
  Radio,
  Table,
  Modal,
  Space,
  DatePicker
} from "antd";
import DotVer from "../../Assets/dotVer.svg";
import User from "../../Assets/user.svg";
import DocumentText from "../../Assets/documentText.svg";
import { flipkartFindings } from "../../Data/flipkartFindings";
import TextVertical from "../../components/TextVertical";

const Finding = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [htmlString, setHtmlString] = React.useState('');
  const showModal = (htmlVal) => {
    setVisibleModal(true);
    setHtmlString(htmlVal)
  };

  const handleCancel = () => {
    setVisibleModal(false);
  };
  const columns = [
    {
      title: "Finding ID",
      dataIndex: "findingId",
    },
    {
      title: "Target/Asset",
      dataIndex: "targetAsset",
      render: (data) => (
        <div onClick={() => showModal(data.detail)} className="pad-1 link">
          {data.asset}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reported",
      dataIndex: "reported",
    },
    {
      title: "Severity",
      dataIndex: "severity",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Updated",
      dataIndex: "updated",
    },
    {
      title: "#Days",
      dataIndex: "days",
    },
    {
      title: "Client ID",
      dataIndex: "clientId",
      align: "center",
    },
    {
      title: "Note",
      dataIndex: "note",
      align: "center",
    },
  ];

  const data = [];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const onSearch = (value) => console.log(value);
  const { Search } = Input;

  const [visible, setVisible] = React.useState(false);

  const [visibleCustomDate, setVisibleCustomDate] = React.useState(false);

  const onChangeCustomDate = (e) => {
    setVisibleCustomDate(e.target.checked);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const [visibleClient, setVisibleClient] = React.useState(false);

  const showDrawerCLient = () => {
    setVisibleClient(true);
  };

  const onCloseClient = () => {
    setVisibleClient(false);
  };

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const onChangeClient = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const [openKeys, setOpenKeys] = React.useState(["sub1"]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }


  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
  };

  const rootSubmenuKeys = ["head1", "head2", "head3", "head4"];

  const items = [
    getItem("GROUPING", "head1", <></>, [
      getItem(<Checkbox onChange={onChange}>Enabled</Checkbox>, "1"),
    ]),
    getItem("BY SEVERITY", "head2", <></>, [
      getItem(<Checkbox onChange={onChange}>Critical</Checkbox>, "2"),
      getItem(<Checkbox onChange={onChange}>High</Checkbox>, "3"),
      getItem(<Checkbox onChange={onChange}>Medium</Checkbox>, "4"),
      getItem(<Checkbox onChange={onChange}>Low</Checkbox>, "5"),
    ]),
    getItem("BY REPORTED DATE", "head3", <></>, [
      getItem(<Checkbox onChange={onChange}>New</Checkbox>, "6"),
      getItem(<Checkbox onChange={onChange}>Acknowledged</Checkbox>, "7"),
      getItem(<Checkbox onChange={onChange}>Request Re-Test</Checkbox>, "8"),
      getItem(
        <Checkbox onChange={onChange}>Re-Test in Progress</Checkbox>,
        "9"
      ),
      getItem(<Checkbox onChange={onChange}>Re-Test Validated</Checkbox>, "10"),
      getItem(<Checkbox onChange={onChange}>Re-Test Failed</Checkbox>, "11"),
      getItem(<Checkbox onChange={onChange}>Remediated</Checkbox>, "12"),
      getItem(<Checkbox onChange={onChange}>Won't Fix</Checkbox>, "13"),
      getItem(<Checkbox onChange={onChange}>Not Applicable</Checkbox>, "14"),
    ]),
    getItem("BY DATE IDENTIFIED", "head4", <></>, [
      getItem(<Radio onChange={onChange}>All</Radio>, "15"),
      getItem(<Radio onChange={onChange}>Today</Radio>, "16"),
      getItem(<Radio onChange={onChange}>Last 7 Days</Radio>, "17"),
      getItem(<Radio onChange={onChange}>Last 30 Days</Radio>, "18"),
      getItem(<Radio onChange={onChange}>Last 365 Days</Radio>, "19"),
      getItem(
        <div className="custom-date-finding">
          <Radio onChange={onChangeCustomDate}>
            Choose Date
          </Radio>
          {visibleCustomDate && <Space direction="vertical" className="custom-date-finding-child" >
            <DatePicker onChange={onChangeDate} placeholder="Start Date" />
            <DatePicker onChange={onChangeDate} placeholder="End Date" />
          </Space>}
        </div>

        , "20"),
    ]),
  ];

  const menu = (
    <Menu
      items={[
        {
          label: "Export as CSV",
          key: "0",
        },
        {
          type: "divider",
        },
        {
          label: "Export as JSON",
          key: "2",
        },
      ]}
    />
  );

  const updateMenu = (
    <Menu
      items={[
        {
          label: "New",
          key: "0",
        },
        {
          label: "Acknowledged",
          key: "1",
        },
        {
          label: "Request Re-Test",
          key: "2",
        },
        {
          label: "Won't Fix",
          key: "3",
        },
      ]}
    />
  );

  for (let i = 0; i < flipkartFindings.length; i++) {
    let each = {
      key: i,
      findingId: flipkartFindings[i].FindingID,
      targetAsset: { asset: flipkartFindings[i].TargetAsset, detail: flipkartFindings[i].Details },
      category: flipkartFindings[i].Category,
      reported: flipkartFindings[i].Reported,
      severity: flipkartFindings[i].Severity,
      status: flipkartFindings[i].Status,
      updated: flipkartFindings[i].Updated,
      days: flipkartFindings[i].Days,
      clientId: (
        <img
          src={User}
          alt="user"
          className="icon-sm"
          onClick={showDrawerCLient}
        ></img>
      ),
      note: (
        <img
          src={DocumentText}
          alt="documentText"
          className="icon-sm"
          onClick={showDrawerCLient}
        ></img>
      ),
    };
    data.push(each);
  }

  return (
    <div className="main-content">
      <div className="pad-1">
        <div className="flex-between pad-y1">
          <div style={{ width: "75%" }}>
            <span className="text-light text-center">OPEN</span>
            <div className="divide-dark"></div>

            <div className="flex-between">
              <TextVertical
                val1="20"
                val2="NEW"
                className1="text-head2 text-light"
                className2="ft-wg-500"
              ></TextVertical>
              <TextVertical
                val1="0"
                val2="ACKNOWLEDGED"
                className1="text-head2 text-light"
                className2="ft-wg-500"
              ></TextVertical>
              <TextVertical
                val1="0"
                val2="REQUEST RE-TEST"
                className1="text-head2 text-light"
                className2="ft-wg-500"
              ></TextVertical>

              <TextVertical
                val1="3"
                val2="RE-TEST IN PROGRESS"
                className1="text-head2 text-light"
                className2="ft-wg-500"
              ></TextVertical>
              <TextVertical
                val1="0"
                val2="RE-TEST VALIDATED"
                className1="text-head2 text-light"
                className2="ft-wg-500"
              ></TextVertical>
              <TextVertical
                val1="8"
                val2="RE-TEST FAILED"
                className1="text-head2 text-light"
                className2="ft-wg-500"
              ></TextVertical>
            </div>
          </div>
          <div style={{ width: "18%" }}>
            <span className="color-128 text-center">CLOSED</span>
            <div className="divide-dark"></div>
            <div className="flex-between">
              <TextVertical
                val1="105"
                val2="REMEDIATED"
                className1="text-head2 color-128"
                className2="ft-wg-500"
              ></TextVertical>
              <TextVertical
                val1="29"
                val2="WON'T FIX"
                className1="text-head2 color-128"
                className2="ft-wg-500"
              ></TextVertical>
            </div>
          </div>
        </div>
        <div className="divide"></div>
        <div className="pad-y1">
          {!hasSelected ? (
            <div className="flex-between">
              <Search
                placeholder="Search by Target or Finding ID"
                allowClear
                onSearch={onSearch}
                style={{ width: "30rem" }}
                className="pad-x1"
              />
              <div className="flex">
                <Button onClick={showDrawer} type="primary">
                  FILTERS
                </Button>
                <Dropdown overlay={menu} trigger={["click"]}>
                  <img
                    src={DotVer}
                    className="icon-sm pointer mar-x1"
                    alt="arrow up"
                  />
                </Dropdown>
              </div>
            </div>
          ) : (
            <>
              <span
                style={{
                  marginRight: 18,
                  fontWeight: 400,
                }}
              >
                {hasSelected ? `${selectedRowKeys.length} items selected` : ""}
              </span>
              <span
                style={{
                  marginRight: 6,
                }}
              >
                UPDATE:
              </span>

              <Dropdown overlay={updateMenu} trigger={["click"]}>
                <Button type="primary" onClick={(e) => e.preventDefault()}>
                  STATUS
                </Button>
              </Dropdown>
            </>
          )}
        </div>
        <div className="divide"></div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={{ defaultPageSize: 20 }}
        />
      </div>
      <Drawer
        title="Filters"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Menu
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          className="width-100"
          items={items}
        />
      </Drawer>
      <Drawer
        title="Client Details"
        width={400}
        placement="right"
        onClose={onCloseClient}
        visible={visibleClient}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onCloseClient}>Cancel</Button>
            <Button onClick={onCloseClient} type="primary">
              Update
            </Button>
          </Space>
        }
      >
        Client ID
        <Input />
        <br />
        <br />
        Client Note
        <Input.TextArea
          showCount
          maxLength={100}
          style={{
            height: 120,
          }}
          onChange={onChangeClient}
          title="Client Note"
        />
      </Drawer>
      <Modal visible={visibleModal} onCancel={handleCancel} footer="">
        <div className="pad-1">
          <div dangerouslySetInnerHTML={{ __html: htmlString }}>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Finding;
