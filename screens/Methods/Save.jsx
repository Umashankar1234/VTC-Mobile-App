import axios from "axios";
const headers = {
  "Content-type": "application/json",
};
export const axiosPost = (
  url,
  data,
  header = "'Accept': 'application/json'",
  payload,
  files
) => {
  var formdata = new FormData();
  if (data) {
    Object.entries(data).forEach((entry) => {
      const [key, value] = entry;
      formdata.append(key, value);
    });
  }
  if (files && files.length > 0) {
    for (let file of files) {
      formdata.append("attachment[]", file);
    }
  }
  if (payload) formdata = payload;
  return axios({
    method: "post",
    url: url,
    data: formdata,
    headers: {
      Authorization: "Bearer NOPLAN@12345!",
      Accept: "application/json",
    },
  });
};
export const axiosGet = (url, data = {}) => {
  var config = {
    method: "get",
    url: url,
    headers: {
      Authorization: "Bearer NOPLAN@12345!",
    },
  };

  return axios(config);
};
