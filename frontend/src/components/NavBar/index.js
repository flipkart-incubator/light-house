import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import ChevronRight from "../../Assets/chevronRight.svg";
import Flipkart from "../../Assets/flipkart.svg";
import Exit from "../../Assets/exit.svg";
import ArrowDown from "../../Assets/arrowDown.svg";
import User from "../../Assets/user.svg";
import Setting from "../../Assets/setting.svg";
import {Button, Dropdown, Menu} from "antd";
import Cookies from "js-cookie";



const NavBar = (props) => {

  const menu = (
    <Menu
      items={[
        {
          label: (
            <NavLink to="/settings" key={0} className="nav-item">
              <img src={Setting} className="icon-sm" alt="breadcrum arrow" />
              <div className="nav-item-text">Account Settings</div>
            </NavLink>
          ),
          key: "0",
        },
        {
          type: "divider",
        },
        {
          label: (
            <NavLink to="/userPreferences" key={1} className="nav-item">
              <img src={User} className="icon-sm" alt="breadcrum arrow" />
              My Preferences
            </NavLink>
          ),
          key: "2",
        },
        {
          type: "divider",
        },
        {
          label: (
            <div className="signout">
              <div className="">Sign Out</div>
              <img src={Exit} className="icon-sm" alt="breadcrum arrow" />
            </div>
          ),
          key: "4",
        },
      ]}
    />
  );

  const processCookie = () => {
      let token = Cookies.get('X-Lighthouse-Token')
      console.log(token)
  }

  return (
    <div className="nav">
      <div className="nav-logo">
        <img src={Flipkart} className="logo pointer" alt="logo" />
      </div>
      <div className="divider"></div>
      <div className="nav-data">
        <div className="flex-center">
          <div className="breadcrum-text ft-wg-600">LIGHTHOUSE</div>
          <img src={ChevronRight} className="icon-sm" alt="breadcrum arrow" />
          <div className="breadcrum-text">{props.route}</div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
