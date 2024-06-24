import fetch from 'isomorphic-fetch'
import { LOCAL_PATH } from "../constants";
const API_URL = process.env.API_URL;
const LOGIN_URL = LOCAL_PATH.LOGIN;

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'apiKey': 'ee689dc0-2550-4a39-b937-37aa4ca19b11'
};

const headersWithAuthorization = () => {
  let acc_token = JSON.parse(localStorage.getItem('acc_token'));
 
  if (!acc_token) {
    localStorage.setItem("prevPageVisit", window.location.pathname);
    window.location = LOGIN_URL;
  } 

  return {
    ...headers,
    'Authorization': `Bearer ${acc_token.access_token}`,
    'AcceptLanguage': localStorage.lang || 'vi'
  }
}
export const objToQueryString = (obj) => {
  const keyValuePairs = [];
  for (const key in obj) {
    if (obj[key]) {
      keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }
  return keyValuePairs.join('&');
}

export default {
  postLogin(url, data) {
    let headerForm = { ...headers };
    headerForm["Content-Type"] = "application/x-www-form-urlencoded"
    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: headerForm,
      body: formBody
    })
      .then(handleResponse)
      .catch(catchAPI)
  },
  getWithoutAuthorization(url) {
    let acc_token = JSON.parse(localStorage.getItem('acc_token'));
    localStorage.removeItem('acc_token')
    return Promise.resolve(`${API_URL}${url}?token=${acc_token.token}`)
  },
  postWithoutAuthorization(url, data) {
    return fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })
      .then(handleResponse)
      .catch(catchAPI)
  },

  get(url, params) {
    const queryString = params ? objToQueryString(params) : '';
    return fetch(`${API_URL}${url}${queryString}`, {
      method: 'GET',
      headers: headersWithAuthorization()
    })
      .then(handleResponse)
      .catch(catchAPI)
  },

  patch(url, data) {
    return fetch(`${API_URL}${url}`, {
      method: 'PATCH',
      headers: headersWithAuthorization(),
      body: JSON.stringify(data)
    })
      .then(handleResponse)
      .catch(catchAPI)
  },

  put(url, data) {
    let params = {
      method: 'PUT',
      headers: headersWithAuthorization()
    };

    if (data) {
      params.body = JSON.stringify(data);
    }

    return fetch(`${API_URL}${url}`, params).then(handleResponse)
      .catch(catchAPI)
  },

  post(url, data, type) {   
    if (type === 'file') {
      let headerForm = headersWithAuthorization();

      delete headerForm['Content-Type'];

      return fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: headerForm,
        body: data
      })
        .then(handleResponse)
        .catch(catchAPI)
    }

    return fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: headersWithAuthorization(),
      body: JSON.stringify(data || {})
    })
      .then(handleResponse)
      .catch(catchAPI)
  },

  postExportFile(url, data) {
    return fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: headersWithAuthorization(),
      body: JSON.stringify(data)
    })
      .then(handleResponseFile)
      .catch(catchAPI)
  },

  delete(url, data) {
    return fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: headersWithAuthorization(),
      body: JSON.stringify(data)
    })
      .then(handleResponse)
      .catch(catchAPI)
  }
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("acc_token");
        localStorage.setItem("prevPageVisit", window.location.pathname);
        window.location = LOGIN_URL;
      }
      if (response.status === 404) {
        return Promise.reject({
          code: 404
        });
      }
      return Promise.reject(data);
    }
    return data;
  });
}

function handleResponseFile(response) {
  if (!response.ok) {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (response.status === 401) {
        localStorage.removeItem("acc_token");
        localStorage.setItem("prevPageVisit", window.location.pathname);
        window.location = LOGIN_URL;
      }
      if (response.status === 404) {
        return Promise.reject({
          code: 404
        });
      }
      return Promise.reject(data);
    })
  }
  return response.blob().then(blob => {
    return blob;
  });
}

function catchAPI(response) {
  return Promise.reject(response)
}