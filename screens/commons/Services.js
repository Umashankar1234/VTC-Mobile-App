const APIURL = 'https://virtualtourcafe.com/admin/api/';
// const APIURL = 'http://139.59.28.82/vtc/api/';
const APIAUTHKEY = 'abcd123XYZ';
export const fetchRecords = url => {
  return new Promise((resolve, reject) => {
    fetch(APIURL + url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const fetchRecordsById = (url, id) => {
  return new Promise((resolve, reject) => {
    fetch(APIURL + url + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const postMethod = (url, data) => {
  data.authenticate_key = APIAUTHKEY;
  return new Promise((resolve, reject) => {
    fetch(APIURL + url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};

export const deleteMethod = (url, id) => {
  return new Promise((resolve, reject) => {
    fetch(APIURL + url + id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};

export const fileUploadMethod = (url, data) => {
  return new Promise((resolve, reject) => {
    fetch(APIURL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data;',
      },
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        resolve(json);
      })
      .catch(error => reject(error));
    // .finally(() => );
  });
};
export const getTimeAMPMFormat = date => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0' + hours : hours;
  // appending zero in the start if hours less than 10
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
};
function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
