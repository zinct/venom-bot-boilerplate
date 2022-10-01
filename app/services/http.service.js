const axios = require("axios");

axios.defaults.baseURL = process.env.API_URL;

function setBaseURL(newUrl) {
  axios.defaults.baseURL = newUrl;
}

function get(url, options) {
  return axios.get(url, options);
}

function post(url, data, options = {}) {
  return axios.post(url, data, options);
}

function put(url, data) {
  return axios.put(url, data);
}

function del(url) {
  return axios.delete(url);
}

module.exports = {
  get,
  post,
  put,
  del,
  setBaseURL,
};
