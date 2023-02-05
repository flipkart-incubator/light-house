import React, {UseEffect} from "react";
import TextVertical from "../TextVertical";

import "./style.css";

const Error_Banner = (props) => {


  let display = "none"
  if (props.isVisible === "true") {
      display = "block"
  }
  return (
    <div
      className={`error-box shadow ${props.className}`}
      style={{ display:display, width: props.width }}
    >
      <div className="frame-top border-bottom">
        {props.heading ? (
          <div className="ft-wg-500 breadcrum-text">{props.heading}</div>
        ) : (
          <div>
            <TextVertical
              val1={props.title.value1}
              val2={props.errorDescription}
              className1="text-dark ft-wg-600 text-head1"
              className2="text-dark ft-wg-600 breadcrum-text"
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default Error_Banner;
