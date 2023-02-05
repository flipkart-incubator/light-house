import axios from "axios";
const API_URL = "http://127.0.0.1:5000/";

async function getFuzzing(targetDomain, scanButtontext, enumSubdomains) {
  const url = `${process.env.REACT_APP_API_URL}/fuzz/${targetDomain}`;

  let forceval = false

  if (scanButtontext === "Force Scan"){
    forceval = true
  }

  const response = await axios.get(url, { params: { force: forceval , enum:enumSubdomains}});

  return response.data;
}

const manageFuzzing = {
  getFuzzing,
};

export default manageFuzzing;
