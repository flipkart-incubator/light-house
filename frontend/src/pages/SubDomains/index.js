import React from "react";
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
  Tooltip,
} from "antd";
import DotVer from "../../Assets/dotVer.svg";
import { flipkartSubdomains } from "../../Data/flipkartSubdomains";

const makeTooltip = (val) => (
  <span>
    <ul>
      {val.map((each, id) => (
        <li>{each}</li>
      ))}
    </ul>
  </span>
);

const SubDomain = () => {
  const columns = [
    {
      title: "Testing Status",
      dataIndex: "testingStatus",
      align: "center",
      width: 100,
    },
    {
      title: "Subdomain",
      dataIndex: "subDomain",
      width: 300,
    },
    {
      title: "Abandoned",
      dataIndex: "abandoned",
      align: "center",
      width: 100,
    },
    {
      title: "Last CNAME",
      dataIndex: "cname",
      width: 350,
    },
    {
      title: "#Targets",
      dataIndex: "target",
      align: "center",
      width: 100,
    },
    {
      title: "Total IP's",
      dataIndex: "ip",
      align: "center",
      render: (text) => (
        <Tooltip placement="top" title={makeTooltip(text)}>
          <Button>{text.length}</Button>
        </Tooltip>
      ),
    },
    {
      title: "IPv6",
      dataIndex: "IPv6",
      align: "center",
    },
    {
      title: "TTL",
      dataIndex: "ttl",
    },
    {
      title: "Source",
      dataIndex: "source",
    },
  ];

  const data = [];

  for (let i = 0; i < flipkartSubdomains.length; i++) {
    let each = {
      key: i,
      subDomain: flipkartSubdomains[i]["Subdomain"],
      source: flipkartSubdomains[i]["Source"],
      testingStatus: `${
        flipkartSubdomains[i]["Testing Status"] === "Active" ? "🟢" : "⚫"
      }`,
      target: flipkartSubdomains[i]["#Targets"],
      ip: flipkartSubdomains[i]["IP's"],
      ttl: flipkartSubdomains[i]["TTL"],
      cname: flipkartSubdomains[i]["Last CNAME"],
      abandoned: `${flipkartSubdomains[i]["Abandoned"] ? "⚫" : ""}`,
      IPv6: `${flipkartSubdomains[i]["IPv6"] || 0}`,
    };
    data.push(each);
  }

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

  const rootSubmenuKeys = ["head1", "head2"];

  const items = [
    getItem("CNAME", "head1", <></>, [
      getItem(<Checkbox onChange={onChange}>Approved</Checkbox>, "1"),
    ]),
    getItem("BY DATE IDENTIFIED", "head2", <></>, [
      getItem(<Radio onChange={onChange}>All</Radio>, "2"),
      getItem(<Radio onChange={onChange}>Today</Radio>, "3"),
      getItem(<Radio onChange={onChange}>Last 7 Days</Radio>, "4"),
      getItem(<Radio onChange={onChange}>Last 30 Days</Radio>, "5"),
      getItem(<Radio onChange={onChange}>Last 90 Days</Radio>, "6"),
      getItem(<Radio onChange={onChange}>Last 365 Days</Radio>, "7"),
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

  return (
    <div className="main-content">
      <div className="pad-1">
        <TextVertical
          val1={numberWithCommas(flipkartSubdomains.length)}
          val2="Subdomains"
          className1="text-dark ft-wg-500 text-head1"
          className2="text-dark breadcrum-text"
          className="pad-b"
        />
        <div className="divide"></div>
        <div className="pad-y1">
          <div className="flex-between">
            <Search
              placeholder="Search by Subdomain or IP"
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
        </div>
        <div className="divide"></div>
        <Table
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
    </div>
  );
};

export default SubDomain;
