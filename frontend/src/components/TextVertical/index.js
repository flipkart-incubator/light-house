import React from "react";

const TextVertival = (props) => {
    return (
        <div className={`vert-text ${props.className}`}> 
            <div className={`${props.className1}`}>
                {props.val1}
            </div>
            <div  className={`${props.className2}`}>
                {props.val2}
            </div>
        </div>
    )
}

export default TextVertival;