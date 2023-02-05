import React from "react";
import { Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Finding from "./pages/Finding";
// import Domain from "./pages/Domain";
// import DomainOverview from "./pages/DomainOverview";
// import SubDomains from "./pages/SubDomains";
// import SecurityScans from "./pages/SecurityScans";
import SubdomainEnumeration from "./pages/SubdomainEnumeration";
import PortScan from "./pages/PortScan";
import WebinfoTechStack from "./pages/WebinfoTechStack";
import Screenshots from "./pages/Screenshots";
import NucleiScan from "./pages/NucleiScan";
import Fuzzing from "./pages/Fuzzing";
import SSLResult from "./pages/SSLResult";
// import Results from "./pages/Results";
// import Inventory from "./pages/Inventory";
import UserPreferences from "./pages/UserPreferences";
import Settings from "./pages/Settings";
import ScanLogs from "./pages/ScanLogs"
import BackgroundTasks from "./pages/BackgroundTasks";
import {FC} from "react";
import Login from "./pages/Login";




function Router() {
  return (
    <Routes>
      {/* <Route exact path="/" element={<Dashboard />} />

        <Route exact path="/findings" element={<Finding />} />
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
      <Route exact path="/userPreferences" element={<UserPreferences />} />
      <Route exact path="/settings" element={<Settings />} />
        <Route exact path="/scanlogs" element={<ScanLogs/>}/>
        <Route exact path="/backgroundtasks" element={<BackgroundTasks/>}/>


    </Routes>
  );
}

export default Router;
