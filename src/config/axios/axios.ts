import axios from 'axios'

export default axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}api/`,
    responseType: 'json',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})