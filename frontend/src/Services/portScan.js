import axios from "axios";

async function getPorts(targetDomain, scanButtontext, enumSubdomains, input_type) {
  const urlencoded = encodeURIComponent(targetDomain)
  console.log(targetDomain)
  const url = `${process.env.REACT_APP_API_URL}/ports/${urlencoded}`;
  let forceval = false
  if (scanButtontext === "Force Scan"){
    forceval = true
  }
  let subdomains = false
  const response = await axios.get(url, { params: { force: forceval , enum:enumSubdomains, input_type}});

  return response.data;
}

const managePortScan = {
  getPorts,
};

export default managePortScan;
