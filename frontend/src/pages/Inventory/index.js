import React from "react";
import { Dropdown, Menu, Input, Table } from "antd";
import DotVer from "../../Assets/dotVer.svg";
import { flipkartSubdomains } from "../../Data/flipkartSubdomains";

const Inventory = () => {
  const columns = [
    {
      title: "Application’s Local / Public VIP",
      dataIndex: "applicationVIP",
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
    },
    {
      title: "Email Address",
      dataIndex: "emailAddress",
    },
  ];

  const data = [];

  for (let i = 0; i < flipkartSubdomains.length; i++) {
    let each = {
      key: i,
      applicationVIP: flipkartSubdomains[i].Subdomain,
      ownerName: flipkartSubdomains[i]["Last CNAME"],
      emailAddress: flipkartSubdomains[i].Source,
    };
    data.push(each);
  }

  const onSearch = (value) => console.log(value);
  const { Search } = Input;

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
      <div className="pad-x1">
        <div className="pad-y1">
          <div className="flex-between">
            <Search
              placeholder="Search by Virtual IP"
              allowClear
              onSearch={onSearch}
              style={{ width: "30rem" }}
              className="pad-x1"
            />
            <div className="flex">
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
    </div>
  );
};

export default Inventory;
