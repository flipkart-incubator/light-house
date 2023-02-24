import React from "react";
import { Routes, Route } from "react-router-dom";
import Domain from "./pages/Domain";
import SubdomainEnumeration from "./pages/SubdomainEnumeration";
import PortScan from "./pages/PortScan";
import WebinfoTechStack from "./pages/WebinfoTechStack";
import NucleiScan from "./pages/NucleiScan";
import SSLResult from "./pages/SSLResult";
import ScanLogs from "./pages/ScanLogs"
import BackgroundTasks from "./pages/BackgroundTasks";
import {FC} from "react";




function Router() {
  return (
    <Routes>
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
    </Routes>
  );
}

export default Router;
