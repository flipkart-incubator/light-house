import React, {FC} from "react";
import {BrowserRouter, Navigate} from "react-router-dom";
import {Outlet, Route, Routes} from "react-router";
import 'react-toastify/dist/ReactToastify.css';
import "antd/dist/antd.css";

import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WithNav from "./WithNav";
import Finding from "./pages/Finding";
import DomainOverview from "./pages/DomainOverview";
import Domain from "./pages/Domain";
import SubDomains from "./pages/SubDomains";
import SecurityScans from "./pages/SecurityScans";
import SubdomainEnumeration from "./pages/SubdomainEnumeration";
import PortScan from "./pages/PortScan";
import WebinfoTechStack from "./pages/WebinfoTechStack";
import Screenshots from "./pages/Screenshots";
import NucleiScan from "./pages/NucleiScan";
import Fuzzing from "./pages/Fuzzing";
import SSLResult from "./pages/SSLResult";
import Results from "./pages/Results";
import Inventory from "./pages/Inventory";
import UserPreferences from "./pages/UserPreferences";
import Settings from "./pages/Settings";
import ScanLogs from "./pages/ScanLogs";
import BackgroundTasks from "./pages/BackgroundTasks";
import Cookies from 'js-cookie';

import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import CookieSetter from "./pages/CookieSetter/cookiesetter";
import axios from "axios";
const App = () => {
  const [path, setPath] = React.useState("Dashboard");
  const [notificationVisible,setNotificationCentreVisible] = React.useState(false)
    const setNCVisible = () => {
      setNotificationCentreVisible(true)
    }
    const HideNC = () => {
      setNotificationCentreVisible(false)
    }
   
  return (
    <BrowserRouter>
        <div className="app">
            <Outlet />
            <Routes>
                <Route element={<WithNav />}>
                    <Route exact path="/" element={<SubdomainEnumeration />} />
                    {/* <Route exact path="/" element={<Dashboard />} /> */}
                    {/* <Route exact path="/findings" element={<Finding />} />
                    <Route exact path="/domainOverview" element={<DomainOverview />} />
                    <Route exact path="/domains" element={<Domain />} />
                    <Route exact path="/subdomains" element={<SubDomains />} />
                    <Route exact path="/securityScans" element={<SecurityScans />} /> */}
                    <Route
                        exact
                        path="/subdomainEnumeration"
                        element={<SubdomainEnumeration />}
                    />
                    <Route exact path="/portScan" element={<PortScan />} />
                    <Route exact path="/webinfoTechStack" element={<WebinfoTechStack />} />
                    {/* <Route exact path="/screenshots" element={<Screenshots />} /> */}
                    <Route exact path="/nucleiScan" element={<NucleiScan />} />
                    <Route exact path="/fuzzing" element={<Fuzzing />} />
                    <Route exact path="/sslResult" element={<SSLResult />} />
                    {/* <Route exact path="/results" element={<Results />} /> */}
                    {/* <Route exact path="/inventory" element={<Inventory />} /> */}
                    {/* <Route exact path="/userPreferences" element={<UserPreferences />} /> */}
                    <Route exact path="/settings" element={<Settings />} />
                    <Route exact path="/scanlogs" element={<ScanLogs/>}/>
                    <Route exact path="/backgroundtasks" element={<BackgroundTasks/>}/>
                </Route>
            </Routes>

        {/*  <ToastContainer />*/}
        {/*  <NotificationCentre isVisible={notificationVisible} onClose={HideNC}></NotificationCentre>*/}
        {/*<NavBar route={path} ShowNC={setNCVisible}/>*/}
        {/*<div className="container">*/}
        {/*  <SideBar onClick={setPath} />*/}
        {/*  <Router />*/}
        {/*</div>*/}

      </div>

    </BrowserRouter>
  );
};

export default App;
