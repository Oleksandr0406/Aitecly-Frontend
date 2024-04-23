import { getToken } from "./AuthUtil";

export const getFullUrl = (url) => process.env.REACT_APP_API_HOST + url;

export const SendRequestWithToken = (url, config) => {
  const token = getToken();
  return fetch(getFullUrl(url), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const SendRequestWithToken_test = (
  url,
  config,
  resolve = () => {},
  reject = () => {}
) => {
  const token = getToken();
  fetch(getFullUrl(url), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...config,
  })
    .then(async (response) => {
      const result = await response.json();
      if (response.ok) {
        resolve(result);
      } else {
        if (response.status === 401 || response.status === 402) {
          alert(result.detail);
        } else {
          alert("Failed");
          console.log(`${response.status} error`, result.detail);
        }
        reject(result.detail);
      }
    })
    .catch((error) => {
      console.log(`request error`, error);
      reject(error);
    });
};

export const SendUploadRequestWithToken = (url, config) => {
  const token = getToken();
  return fetch(getFullUrl(url), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...config,
  });
};

export const SendUploadRequestWithToken_test = (
  url,
  config,
  resolve = () => {},
  reject = () => {}
) => {
  const token = getToken();
  fetch(getFullUrl(url), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...config,
  })
    .then(async (response) => {
      const result = await response.json();
      if (response.ok) {
        resolve(result);
      } else {
        if (response.status === 401 || response.status === 402) {
          alert(result.detail);
        } else {
          alert("Failed");
          console.log(`${response.status} error`, result.detail);
        }
        reject(result.detail);
      }
    })
    .catch((error) => {
      console.log(`request error`, error);
      reject(error);
    });
};

export const getProviders = async () => {
  let res = await fetch(getFullUrl("chatbot/get-providers"), {
    method: "POST",
  });
  res = await res.json();
  return res;
};
