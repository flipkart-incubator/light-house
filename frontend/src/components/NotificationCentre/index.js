import React from "react";
import TextVertival from "../TextVertical";
import Link from "../../Assets/link.svg";
import { NavLink, useNavigate } from "react-router-dom";


import {Drawer} from "antd";
import Frame from "../Frame";
import TextVertical from "../TextVertical";
import NotificationCard from "../NotificationCard";

const NotificationCentre = (props) => {

  return (
      <Drawer
        title="Notification Centre"
        placement="right"
        visible={props.isVisible}
        onClose={props.onClose}
        width={480}
      >
        <div className="flex t9">
            <NotificationCard
          width="100%"
          heading="Testing "
          title={{ value1: "20", value2: "Open Findings" }}
        >

        </NotificationCard>
         </div>
      </Drawer>
  );
};

export default NotificationCentre;
