import axios from "axios";

async function getBackgroundTasks() {
    const url = `${process.env.REACT_APP_API_URL}/background_tasks`;
    const response = await axios.get(url)
    return response.data;
}

const manageBgTasks = {
    getBackgroundTasks,
};

export default manageBgTasks;
