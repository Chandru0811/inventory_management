import axios from "axios"

const api = axios.create({
  baseURL : "http://13.213.208.92:7080/ecsinventory/api/"
  // baseURL: "https://hrisasia.com/ecsinventory/api/",
});

api.interceptors.request.use(
  function (config){
    const token = sessionStorage.getItem("token");
    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error){
    return Promise.reject(error);
  }
)
export default api