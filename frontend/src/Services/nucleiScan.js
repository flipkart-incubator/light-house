import axios from "axios";
import qs from "qs";
const API_URL = "http://127.0.0.1:5000/";

async function getNucleiScan(targetDomain, scanButtontext,enumSubdomains,templates) {
  const url = `${process.env.REACT_APP_API_URL}/nuclei/${targetDomain}`;
  let forceval = false
  if (scanButtontext === "Force Scan"){
    forceval = true
  }
  console.log("Idhar andar aaghya")
  console.log(templates)
  const response = await axios.get(url, { params:
        { force: forceval , enum:enumSubdomains, enabled_templates:templates},
    paramsSerializer: params => {
      return qs.stringify(params, {arrayFormat: 'repeat'})
    }
  });
  return response.data;
}

async function getNucleiTemplates() {
  const url = `${process.env.REACT_APP_API_URL}/nuclei_templates`;
  const response = await axios.get(url)
  return response.data
}


const manageNucleiScan = {
  getNucleiScan,
  getNucleiTemplates
};

export default manageNucleiScan;
