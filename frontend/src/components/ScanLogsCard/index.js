import React from "react";
import TextVertival from "../TextVertical";
import Link from "../../Assets/link.svg";
import { NavLink, useNavigate } from "react-router-dom";
import Title from "antd/lib/skeleton/Title";

import "./index.css";

const ScanLogsCard = (props) => {

    const navigate = useNavigate();

    return (
        <div
            className={`frame-box shadow ${props.className}`}
            style={{ width: props.width }}
        >
            <div className="flex">
                <div className="pad-x1">
                    <div className="pad-y1">
                        <h1>Myntra.com</h1>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default ScanLogsCard;
