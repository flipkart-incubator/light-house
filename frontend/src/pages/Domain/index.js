import React, { useState } from "react";
import TextVertical from "../../components/TextVertical";
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
} from "antd";
import DotVer from "../../Assets/dotVer.svg";
import { flipkartDomains } from "../../Data/flipkartDomains";

const Domain = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);

  const showModal = () => {
    setVisibleModal(true);
  };

  const handleCancel = () => {
    setVisibleModal(false);
  };

  const columns = [
    {
      title: "Testing Status",
      dataIndex: "testingStatus",
      align: "center",
    },
    {
      title: "Domain",
      dataIndex: "domain",
      width: 400,
      render: (text) => (
          <div onClick={showModal} className="pad-1 link">
            {text}
          </div>
      ),
    },
    {
      title: "Registrar",
      dataIndex: "registrar",
    },
    {
      title: "Expiry",
      dataIndex: "expiry",
    },
    {
      title: "#Subdomains",
      dataIndex: "subdomains",
      align: "center",
    },
    {
      title: "Asset Status",
      dataIndex: "assetStatus",
    },
    {
      title: "Source",
      dataIndex: "source",
    },
  ];

  const data = [];

  for (let i = 0; i < flipkartDomains.length; i++) {
    let each = {
      key: i,
      domain: flipkartDomains[i]["Domain"],
      testingStatus: `${
        flipkartDomains[i]["Testing Status"] === "Active" ? "🟢" : "⚫"
      }`,
      registrar: flipkartDomains[i]["Registrar"],
      expiry: flipkartDomains[i]["Expiry"],
      assetStatus: flipkartDomains[i]["Asset Status"],
      source: flipkartDomains[i]["Source"],
      subdomains: flipkartDomains[i]["Subdomains"],
    };
    data.push(each);
  }

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

  const showDrawer = () => {
    setVisible(true);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const onClose = () => {
    setVisible(false);
  };

  const onChange = (e) => {
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

  const rootSubmenuKeys = ["head1", "head2", "head3", "head4"];

  const items = [
    getItem("BY ASSET STATUS", "head1", <></>, [
      getItem(<Checkbox onChange={onChange}>Approved</Checkbox>, "1"),
      getItem(<Checkbox onChange={onChange}>Need Approval</Checkbox>, "2"),
    ]),
    getItem("BY EXPIRY", "head2", <></>, [
      getItem(<Radio onChange={onChange}>Expired</Radio>, "3"),
      getItem(<Radio onChange={onChange}>Within 30 Days</Radio>, "4"),
      getItem(<Radio onChange={onChange}>Within 90 Days</Radio>, "5"),
      getItem(<Radio onChange={onChange}>Within 365 Days</Radio>, "6"),
    ]),
    getItem("TOP LEVEL DOMAIN", "head3", <></>, [
      getItem(<Radio onChange={onChange}>ae</Radio>, "3"),
      getItem(<Radio onChange={onChange}>ai</Radio>, "4"),
      getItem(<Radio onChange={onChange}>ap-south-1.elb.cin</Radio>, "5"),
      getItem(<Radio onChange={onChange}>app</Radio>, "6"),
      getItem(<Radio onChange={onChange}>asia</Radio>, "7"),
      getItem(<Radio onChange={onChange}>biz</Radio>, "8"),
      getItem(<Radio onChange={onChange}>buzz</Radio>, "9"),
      getItem(<Radio onChange={onChange}>careers</Radio>, "10"),
      getItem(<Radio onChange={onChange}>cc</Radio>, "11"),
      getItem(<Radio onChange={onChange}>centrailindia.aksapp.io</Radio>, "12"),
      getItem(<Radio onChange={onChange}>cloud</Radio>, "13"),
      getItem(<Radio onChange={onChange}>club</Radio>, "14"),
      getItem(<Radio onChange={onChange}>co</Radio>, "15"),
      getItem(<Radio onChange={onChange}>co.in</Radio>, "16"),
      getItem(<Radio onChange={onChange}>co.za</Radio>, "17"),
      getItem(<Radio onChange={onChange}>com</Radio>, "18"),
      getItem(<Radio onChange={onChange}>com.kw</Radio>, "19"),
    ]),
    getItem("BY DATE IDENTIFIED", "head4", <></>, [
      getItem(<Radio onChange={onChange}>All</Radio>, "20"),
      getItem(<Radio onChange={onChange}>Last 30 Days</Radio>, "21"),
      getItem(<Radio onChange={onChange}>Last 90 Days</Radio>, "22"),
      getItem(<Radio onChange={onChange}>Last 365 Days</Radio>, "23"),
    ]),
  ];

  const tld = [
    "ae",
    "ai",
    "ap-south-1.elb.cin",
    "app",
    "asia",
    "biz",
    "buzz",
    "careers",
    "cc",
    "centrailindia.aksapp.io",
    "cloud",
    "club",
    "co",
    "co.in",
    "co.za",
    "com",
    "com.kw",
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
          label: "Review",
          key: "0",
        },
        {
          label: "Candidate",
          key: "1",
        },
        {
          label: "Approved",
          key: "2",
        },
        {
          label: "Not-Approved",
          key: "3",
        },
        {
          label: "Retired",
          key: "4",
        },
      ]}
    />
  );

  return (
    <div className="main-content">
      <div className="pad-1">
        <TextVertical
          val1={numberWithCommas(flipkartDomains.length)}
          val2="Domains"
          className1="text-dark ft-wg-500 text-head1"
          className2="text-dark breadcrum-text"
          className="pad-b"
        />
        <div className="divide"></div>

        <div className="pad-y1">
          {!hasSelected ? (
            <div className="flex-between">
              <Search
                placeholder="Search by Domain"
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
                  ASSET STATUS
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
      <Modal visible={visibleModal} onCancel={handleCancel} footer="">
        <div className="pad-1">
          <img
            className=""
            alt="domain img"
            src="http://source.unsplash.com/featured/?{nature}"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Domain;
