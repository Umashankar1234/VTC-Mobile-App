import axios from "axios";

export const APIURL = () => {
  return "https://noplan.maastrixdemo.com/noplan/public/api/";
  // return "http://192.168.1.39/noplan/public/api/";
};
export const APIPath = () => {
  //  return "/";
  return "/noplan";
};
// "homepage": "http://139.59.28.82/mybid_frontend/",
// yarn add final-form react-final-form
export const fetchAllRecords = (url, ctoken) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, ctoken)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
        } else {
          reject(err);
        }
      });
  });
};
export const fetchRecordByID = (url, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url + id)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
