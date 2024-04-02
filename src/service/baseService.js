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
    return new Promise((resolve, reject) => {
      http({
        url,
        params,
        headers,
        method: 'GET'
      }).then(resolve)
        .catch((error) => {
          if (error !== "-999") {
            reject(error);
          }
        });
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