import axios from "axios";
// const API_URL = "http://127.0.0.1:5000/";

async function getWebInfoTechStack(targetDomain,scanButtontext, enumSubdomains) {
  let url = `${process.env.REACT_APP_API_URL}/web_scan/${targetDomain}?enum=${enumSubdomains}`;
  let forceval = false
  if (scanButtontext === "Force Scan"){
    forceval = true
  }
  const response = await axios.get(url, { params: { force: forceval , enum:enumSubdomains}});
  console.log(response.data)
  return response.data;
}

const manageWebInfoTechStack = {
  getWebInfoTechStack,
};

export default manageWebInfoTechStack;



