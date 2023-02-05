import axios from "axios";
const API_URL = "http://127.0.0.1:5000/";

async function getSSLResult(targetDomain,scanButtontext,enumSubdomains) {
  const url = `${process.env.REACT_APP_API_URL}/ssl_check/${targetDomain}`;
  let forceval = false
  if (scanButtontext === "Force Scan"){
    forceval = true
  }
  const response = await axios.get(url, { params: { force: forceval , enum:enumSubdomains}});
  return response.data;
}

const manageSSLResult = {
  getSSLResult,
};

export default manageSSLResult;
