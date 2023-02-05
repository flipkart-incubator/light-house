import axios from "axios";

async function getScanLogs(date) {
    console.log("IN here")
    const url = `${process.env.REACT_APP_API_URL}/scan_logs/${date}`;
    const response = await axios.get(url);
    console.log()
    console.log(response)
    return response.data;
}

const manageScanLogs = {
    getScanLogs,
};

export default manageScanLogs;
