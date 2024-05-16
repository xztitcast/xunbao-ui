import qs from "qs";
import axios from "axios";
import router from "@/router";
import app from "@/constants/app";
import { getToken } from "./cache";

const baseURL = process.env.NODE_ENV === 'production' ? app.api : "/"
const http = axios.create({
  baseURL,
  timeout: app.requestTimeout
});

/**
 * 全局loading对象
 */
var loadingInstance = null

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  config.headers["Request-Start"] = new Date().getTime();
  const token = getToken();
  if (token) {
    config.headers["token"] = token;
  }
  if (config.method?.toUpperCase() === "GET") {
    config.params = { ...config.params, _t: new Date().getTime() };
  }
  if (Object.values(config.headers).includes("application/x-www-form-urlencoded")) {
    config.data = qs.stringify(config.data);
  }
  return config;
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && (response.data.code === 401 || response.data.code === 600)) {
    router.replace("/login");
    return Promise.reject(response.data.message)
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default http
