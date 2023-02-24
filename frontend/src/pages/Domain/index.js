import React, { useState } from "react";
import manageAllSubdomains from "../../Services/all_subdomains";
import TextVertical from "../../components/TextVertical";
import {
  ScanOutlined,
  FileDoneOutlined,
  Loading3QuartersOutlined,
  DatabaseOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "./index.css";

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

manageAllSubdomains.getSubdomains()

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
      title: "S.No.",
      dataIndex: "id",
      width: 400,
    },
    {
      title: "Domain",
      dataIndex: "domain",
      width: 400,
    },
  ];

  const data = [];
  let each = {}

  const fd = flipkartDomains[0];
  var number_of_domains=0
  var sub_index = 1
  for(var i = 0; i < Object.keys(fd).length; i++) {
      var domainObject = fd[i].domains;
      for(var j = 0; j < Object.keys(domainObject).length; j++) {
          var domain = domainObject[j];
          each = {
            id:sub_index,
            domain:domain,
          };
          sub_index = sub_index + 1
          number_of_domains = number_of_domains + 1
          data.push(each);
          // your code
      }
  }

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
          val1={numberWithCommas(number_of_domains)}
          val2="Domains"
          className1="text-dark ft-wg-500 text-head1"
          className2="text-dark breadcrum-text"
          className="pad-b"
        />
        <div className="divide"></div>
        <div className="divide"></div>
        <Table
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={{ defaultPageSize: 20 }}
        />
      </div>
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
