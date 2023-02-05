import React from 'react';
import { Outlet } from 'react-router';
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Router from "./routes";

export default () => {
    const [path, setPath] = React.useState("Dashboard");

    return (
        <>
            <NavBar route={path}/>
            <div className="container">
                <SideBar onClick={setPath} />
                <Outlet />
            </div>


        </>
    );
};