"use strict";

import { sidebar } from "./sidebar.js";
import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

sidebar();

let currentPage = 1;
let totalPages = 0;

const gerneName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");
const pageContent = document.querySelector("[page-content]");
const fetchUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&sort_by=popularity.desc&api_key=${api_key}&${urlParam}&page=${currentPage}`;

fetchDataFromServer(fetchUrl, ({ results: moviesList, total_pages }) => {
  totalPages = total_pages;
  document.title = "${gerneName} - ShowFlix";

  const movieListEle = document.createElement("section");
  movieListEle.classList.add("movie-list", "genre-list");
  movieListEle.ariaLabel = `${gerneName} Movies`;
  movieListEle.innerHTML = `
      <div class="title-wrapper">
        <h1 class="heading">All ${gerneName} Movies</h1>
      </div>
      <div class="grid-list"></div>
      <button class="btn load-more" load-more>Load More</button>
    `;
  for (const movie of moviesList) {
    const movieCard = createMovieCard(movie);
    movieListEle.querySelector(".grid-list").appendChild(movieCard);
  }
  pageContent.appendChild(movieListEle);

  document.querySelector("[load-more]").addEventListener("click", (e) => {
    if (currentPage > totalPages) {
      e.target.style.display = "none"; // Fix: "none" should be a string
      return;
    }
    currentPage++;
    e.target.classList.add("loading");
    const nextPageUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&sort_by=popularity.desc&api_key=${api_key}&${urlParam}&page=${currentPage}`; // Dynamically generate URL
    fetchDataFromServer(nextPageUrl, ({ results: moviesList }) => {
      // Use nextPageUrl
      console.log(nextPageUrl);
      e.target.classList.remove("loading");
      for (const movie of moviesList) {
        const movieCard = createMovieCard(movie);
        movieListEle.querySelector(".grid-list").appendChild(movieCard);
      }
    });
  });
});

search();
