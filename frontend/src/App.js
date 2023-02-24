import React, {FC} from "react";
import {BrowserRouter, Navigate} from "react-router-dom";
import {Outlet, Route, Routes} from "react-router";
import 'react-toastify/dist/ReactToastify.css';
import "antd/dist/antd.css";

import "./App.css";
import WithNav from "./WithNav";
import Domain from "./pages/Domain";
import SubdomainEnumeration from "./pages/SubdomainEnumeration";
import PortScan from "./pages/PortScan";
import WebinfoTechStack from "./pages/WebinfoTechStack";
import NucleiScan from "./pages/NucleiScan";
import SSLResult from "./pages/SSLResult";
import ScanLogs from "./pages/ScanLogs";
import BackgroundTasks from "./pages/BackgroundTasks";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import axios from "axios";
const App = () => {
  const [path, setPath] = React.useState("SubdomainEnumeration");
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
                    <Route exact path="/domains" element={<Domain />} />
                    <Route
                        exact
                        path="/subdomainEnumeration"
                        element={<SubdomainEnumeration />}
                    />
                    <Route exact path="/portScan" element={<PortScan />} />
                    <Route exact path="/webinfoTechStack" element={<WebinfoTechStack />} />
                    <Route exact path="/nucleiScan" element={<NucleiScan />} />
                    <Route exact path="/sslResult" element={<SSLResult />} />
                    <Route exact path="/scanlogs" element={<ScanLogs/>}/>
                    <Route exact path="/backgroundtasks" element={<BackgroundTasks/>}/>
                </Route>
            </Routes>
      </div>

    </BrowserRouter>
  );
};

export default App;
