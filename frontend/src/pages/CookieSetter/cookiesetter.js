import Cookies from 'js-cookie';
import {Navigate, useParams} from "react-router-dom";
import React from "react";

const CookieSetter = () =>
{
    const { value } = useParams();
    Cookies.set("X-Lighthouse-Token",value)
    return (<Navigate replace to="/" />)
}

export default CookieSetter