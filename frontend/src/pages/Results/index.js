import React from "react";
import { Checkbox, Button, Dropdown, Menu, Drawer, Input, Table } from "antd";
import DotVer from "../../Assets/dotVer.svg";
import { flipkartSubdomains } from "../../Data/flipkartSubdomains";

const Results = () => {
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
      title: "Status Code",
      dataIndex: "statusCode",
    },
  ];

  const data = [];

  for (let i = 0; i < flipkartSubdomains.length; i++) {
    let each = {
      key: i,
      name: flipkartSubdomains[i].Subdomain,
      endpoint: flipkartSubdomains[i].Subdomain,
      statusCode: flipkartSubdomains[i].Source,
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
    getItem("BY HOST", "head1", <></>, [
      getItem(<Checkbox onChange={onChange}>NaN</Checkbox>, "1"),
    ]),
    getItem("BY STATUS CODE", "head2", <></>, [
      getItem(<Checkbox onChange={onChange}>NaN</Checkbox>, "2"),
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

  return (
    <div className="main-content">
      <div className="pad-x1">
        <div className="pad-y1">
          <div className="flex-between">
            <Search
              placeholder="Search by Name or Endpoint"
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

export default Results;
