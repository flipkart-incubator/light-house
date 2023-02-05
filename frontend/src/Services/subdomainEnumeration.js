import axios from "axios";
//const API_URL = "http://127.0.0.1:8080/";

async function getSubdomains(targetDomain, scanButtontext) {
  let url = `${process.env.REACT_APP_API_URL}/subdomains/${targetDomain}`;
  let forceval = false
  if (scanButtontext === "Force Scan"){
    forceval = true
  }

  const response = await axios.get(url, { params: { force: forceval }});
  return response.data;
}

const manageSubdomainsEnumeration = {
  getSubdomains,
};

export default manageSubdomainsEnumeration;
