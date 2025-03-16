import http from "@/utils/request";

export default {

  delete(url, data) {
    return http({
      url,
      data,
      method: 'DELETE'
    })
  },
  get(url, params, headers) {
    return http({
      url,
      params,
      headers,
      method: 'GET'
    })
  },
  put(url, data, headers) {
    return http({
      url,
      data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      method: "PUT"
    })
  },
  post(url, data, headers) {
    return http({
      url,
      data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      method: "POST"
    })
  }
}