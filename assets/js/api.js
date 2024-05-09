"use strick";

export const api_key = "e479879e11c27e77962b74b41fa086b0";

export const imageBaseUrl = "https://image.tmdb.org/t/p/";

export const fetchDataFromServer = (url, callback, optionalParam) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => callback(data, optionalParam));
};
