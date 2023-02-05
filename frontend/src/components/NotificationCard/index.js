import React from "react";
import TextVertival from "../TextVertical";
import Link from "../../Assets/link.svg";
import { NavLink, useNavigate } from "react-router-dom";

const NotificationCard = (props) => {

  const navigate = useNavigate();

  return (
    <div
      className={`frame-box shadow ${props.className}`}
      style={{ width: props.width }}
    >
      <div className="frame-top border-bottom">
        {props.heading ? (
          <div className="ft-wg-500 breadcrum-text">{props.heading}</div>
        ) : (
          <div>
            <TextVertival
              val1={props.title.value1}
              val2={props.title.value2}
              className1="text-dark ft-wg-600 text-head1"
              className2="text-dark ft-wg-600 breadcrum-text"
            />
          </div>
        )}
        {props.url && (
          // <NavLink to={props.url}>
            <img onClick={() => navigate(props.url)} src={Link} alt="link" className="icon-sm"></img>
          // </NavLink>
        )}
      </div>
      <div className="frame-bottom">{props.children}</div>
    </div>
  );
};

export default NotificationCard;
