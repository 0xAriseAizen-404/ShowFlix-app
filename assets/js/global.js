"use strict";

// Adding events on multiple events

const addEventOnElements = (elements, eventType, callback) => {
  for (const ele of elements) ele.addEventListener(eventType, callback);
};

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");
addEventOnElements(searchTogglers, "click", () => {
  searchBox.classList.toggle("active");
});

// storing movieId when click on a movie
const getMovieDetails = function (movieId) {
  console.log(1);
  window.localStorage.setItem("movieId", String(movieId));
};

const getMovieList = function (urlParam, genreName) {
  window.localStorage.setItem("urlParam", urlParam);
  window.localStorage.setItem("genreName", genreName);
};
