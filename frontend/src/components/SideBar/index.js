import "./style.css";
import User from "../../Assets/user.svg";
import Bar from "../../Assets/bar.svg";
import Notepad from "../../Assets/notepad.svg";
import SubDomain from "../../Assets/multiple.svg";
import Domain from "../../Assets/browser.svg";
import Overview from "../../Assets/view.svg";
import Key from "../../Assets/key.svg";
import Table from "../../Assets/table.svg";
import List from "../../Assets/list.svg";
import ClipboardCheck from "../../Assets/clipboardCheck.svg";
import Globe from "../../Assets/globe.svg";
import SearchCircle from "../../Assets/searchCircle.svg";
import Photograph from "../../Assets/photograph.svg";
import Terminal from "../../Assets/terminal.svg";
import Code from "../../Assets/code.svg";
import CubeTransparent from "../../Assets/cubeTransparent.svg";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Result } from "antd";

const links = [
  {
    url: "/domains",
    text: "All Domains",
    icon: Domain,
  },
  {
    url: "/subdomainEnumeration",
    text: "Subdomain Enumeration",
    icon: Globe,
  },
  {
    url: "/portScan",
    text: "Port Scan",
    icon: CubeTransparent,
  },
  {
    url: "/webinfoTechStack",
    text: "Web-info / Tech Stack",
    icon: Terminal,
  },
  {
    url: "/nucleiScan",
    text: "Nuclei Scan",
    icon: SearchCircle,
  },
  {
    url: "/sslResult",
    text: "SSL Result",
    icon: ClipboardCheck,
  },
  {
    url: "/scanlogs",
    text: "Scan Logs",
    icon: Notepad,
  },
  {
    url: "/backgroundtasks",
    text: "CAST Scan",
    icon: User,
  },
];

const paths = {
  "/domains": "Domains",
  "/subdomainEnumeration": "Subdomain Enumeration",
  "/portScan": "Port Scan",
  "/webinfoTechStack": "Web-info / Tech Stack",
  "/nucleiScan": "Nuclei Scan",
  "/sslResult": "SSL Result",
  "/scanlogs": "Scan Logs",
  "/backgroundtasks":"Background Tasks",
};

const SideBar = (props) => {
  const [currentSelection, setCurrentSelection] = useState("Subdomain Enumeration");
  let location = useLocation();

  useEffect(() => {
    setCurrentSelection(paths[location.pathname]);
  }, [location]);

  useEffect(() => {
    props.onClick(currentSelection);
  }, [currentSelection]);

  return (
    <div className="sidebar open">
      <div className="sidebar-items">
        {links.map((value, index) => (
          <NavLink
            to={value.url}
            key={index}
            className={`sidebar-item ${
              value.url === location.pathname ? "active-link" : ""
            } ${value.text === "User Preferences" ? "footer" : ""}`}
            onClick={() => setCurrentSelection(value.text)}
          >
            <img
              src={value.icon}
              alt={value.text + "icon"}
              className="icon-sm"
            />
            <div className="sidebar-item-text">{value.text}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
