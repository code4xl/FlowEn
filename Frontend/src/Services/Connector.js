import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
  console.log("apicon : ", params);
  console.log("apiconBD : ", bodyData);

  const accountData = JSON.parse(localStorage.getItem('account'));
  console.log("con" + params);
  let token;

  if (accountData) {
    token = accountData.token;
  }

  headers = headers || {}; // Initialize headers as an empty object if not provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    // console.log("in");
  }
  console.log(bodyData || "no body data");

  return axiosInstance({
    method: method,
    url: url,
    data: bodyData || null,
    headers: headers,
    params: params || null,
  });
};
