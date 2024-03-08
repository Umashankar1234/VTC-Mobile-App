import axios from 'axios';
export const APIURL = 'https://virtualtourcafe.com/admin/api/';
const headers = {
  'Content-type': 'application/json',
};
export const axiosPost = (
  url,
  data,
  header = "'Accept': 'application/json'",
  payload,
  files,
) => {
  var formdata = new FormData();
  if (data) {
    Object.entries(data).forEach(entry => {
      const [key, value] = entry;
      formdata.append(key, value);
    });
  }
  formdata.append('authenticate_key', 'abcd123XYZ');

  if (files && files.length > 0) {
    for (let file of files) {
      formdata.append('picture[]', file);
    }
  }
  if (payload) formdata = payload;
  return axios({
    method: 'post',
    url: APIURL + url,
    data: formdata,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const axiosGet = (url, data = {}) => {
  var config = {
    method: 'get',
    url: APIURL + url,
    headers: {
      Authorization: 'Bearer NOPLAN@12345!',
    },
  };

  return axios(config);
};
const onSubmit = async () => {
  setLoading(true);
  var data1 = {};
  data1.agent_id = userData.agent_id;
  data1.virtualtourservice = isvirtualtourservice ? 1 : 0;
  data1.flyerservice = isflyerservice ? 1 : 0;
  data1.videoservice = isvideoservice ? 1 : 0;
  data1.caption = '12';
  const formdt = new FormData();
  Object.keys(data1).forEach(key => formdt.append(key, data1[key]));
  for (let file of pictureFiles) {
    // var fname = file.uri.replace(/^.*[\\\/]/, '');
    var obj = {
      uri: file.uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    };
    formdt.append('picture[]', obj);
  }
  // formdt.append('picture[]', {
  //   uri: pictureFiles[0].uri,
  //   name: 'image.jpg',
  //   type: 'image/jpeg',
  // });
  formdt.append('authenticate_key', 'abcd123XYZ');

  const response = await fetch(
    'https://virtualtourcafe.com/admin/api/agent-save-imageset',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdt,
    },
  );

  const data = await response.json();
  // for (let file of pictureFiles) {
  //   var fname = file.uri.replace(/^.*[\\\/]/, '');
  //   var obj = {
  //     uri: file.uri,
  //     name: fname,
  //     type: file.type,
  //   };
  //   formdt.append('picture[]', obj);
  // }
  // for (let file of videoFiles) {
  //   var fname = file.path.replace(/^.*[\\\/]/, '');
  //   var obj = {
  //     uri: file.uri,
  //     name: fname,
  //     type: file.type,
  //   };
  //   formdt.append('video[]', obj);
  // }
  // for (let file of panoramaFiles) {
  //   var fname = file.path.replace(/^.*[\\\/]/, '');
  //   var obj = {
  //     uri: file.uri,
  //     name: fname,
  //     type: file.type,
  //   };
  //   formdt.append('panorama[]', obj);
  // }
  // formdt.append('authenticate_key', 'abcd123XYZ');
  // fileUploadMethod('agent-save-imageset', formdt)
  //   .then(res => {
  //     if (res.length > 0) {
  //       if (res[0].response.status === 'error') {
  //         ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
  //       } else {
  //         ToastAndroid.show(res[0].response.message, ToastAndroid.SHORT);
  //         setLoading(false);
  //         resetControls();
  //       }
  //     }
  //   })
  //   .catch(error => {
  //     setLoading(false);
  //   });
};
