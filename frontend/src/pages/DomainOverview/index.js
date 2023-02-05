import React from "react";
import TextVertical from "../../components/TextVertical";
import "./style.css";
import Frame from "../../components/Frame";
import { Table } from "antd";
import PieChart from "../../components/PieChart";

const dataa = [
  { name: ".com", value: 137 },
  { name: ".in", value: 98 },
  { name: ".co.in", value: 82 },
  { name: ".net", value: 60 },
  { name: ".org", value: 31 },
  { name: ".net.in", value: 25 },
  { name: "other", value: 67 },
];

const columns = [
  {
    title: "S. No.",
    dataIndex: "key",
    key: "sno",
  },
  {
    title: "TLD Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Number",
    dataIndex: "num",
    key: "num",
  },
];
const tableData = [
  {
    key: "1",
    name: ".com",
    num: "137",
  },
  {
    key: "2",
    name: ".in",
    num: "98",
  },
  {
    key: "3",
    name: ".co.in",
    num: "82",
  },
  {
    key: "4",
    name: ".net",
    num: "60",
  },
  {
    key: "5",
    name: ".org",
    num: "31",
  },
  {
    key: "6",
    name: ".net.in",
    num: "25",
  },
  {
    key: "7",
    name: "other",
    num: "67",
  },
];

const columns1 = [
  {
    title: "Domain Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Expiry Date",
    dataIndex: "date",
    key: "date",
  },
];
const tableData1 = [
  {
    key: "1",
    name: "blink.watch",
    date: "06-30-2021",
  },
  {
    key: "2",
    name: "api-corona.com",
    date: "03-23-2021",
  },
];
const tableData2 = [
  {
    key: "1",
    name: "bigbillionday.net",
    date: "08-08-2022",
  },
];

const DomainOverview = () => {
  return (
    <div className="main-content">
      <div className="flex-between pad-1">
        <div className="bg-light overview-box">
          <TextVertical
            val1="2,816"
            val2="Domains"
            className1="text-white ft-wg-500 text-head1"
            className2="text-white breadcrum-text"
          />
        </div>
        <div className="bg-dark overview-box">
          <TextVertical
            val1="9,251"
            val2="SubDomains"
            className1="text-white ft-wg-500 text-head1"
            className2="text-white breadcrum-text"
          />
        </div>
        <div className="bg-dark overview-box">
          <TextVertical
            val1="8,587 (92.8%)"
            val2="Targetable SubDomains"
            className1="text-white ft-wg-500 text-head1"
            className2="text-white breadcrum-text"
          />
        </div>
      </div>
      <div className="flex">
        <Frame heading="Top Level Domain Found" width="31.25%" url="/domains">
          <div className="width-100" style={{ display: "block" }}>
            <PieChart data={dataa} width={400} height={400}></PieChart>
            <Table
              size="small"
              className="width-100"
              columns={columns}
              pagination={{ hideOnSinglePage: true }}
              dataSource={tableData}
            />
          </div>
        </Frame>
        <Frame heading="Expiring Domain" width="64%" url="/domains">
          <div className="flex-between width-100">
            <div className="expire-box">
              <div className="bg-shades expire-box-data">
                <TextVertical
                  val1="2"
                  val2="Expired"
                  className="margin-auto"
                  className1="text-primary ft-wg-500 text-head0 text-center"
                  className2="text-dark breadcrum-text"
                />
              </div>
              <Table
                size="small"
                className="full-width"
                columns={columns1}
                pagination={{ hideOnSinglePage: true }}
                dataSource={tableData1}
              />
            </div>
            <div className="expire-box">
              <div className="bg-shades expire-box-data">
                <TextVertical
                  val1="1"
                  val2="Expiring within 30 Days"
                  className="margin-auto"
                  className1="text-primary ft-wg-500 text-head0 text-center"
                  className2="text-dark breadcrum-text"
                />
              </div>
              <Table
                size="small"
                className="full-width"
                columns={columns1}
                pagination={{ hideOnSinglePage: true }}
                dataSource={tableData2}
              />
            </div>
          </div>
        </Frame>
      </div>
    </div>
  );
};

export default DomainOverview;
