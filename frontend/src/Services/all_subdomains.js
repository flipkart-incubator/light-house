import axios from "axios";
//const API_URL = "http://127.0.0.1:8080/";

async function getSubdomains() {
  let url = `${process.env.REACT_APP_API_URL}/domains/`;
  const response = await axios.get(url);
  return response.data;
}

const manageAllSubdomains = {
  getSubdomains,
};

export default manageAllSubdomains;
