"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchWrapper = document.querySelector("[search-wrapper]");
  const searchField = document.querySelector("[search-field]");

  const searchModalResult = document.createElement("div");
  searchModalResult.classList.add("search-modal");
  document.querySelector("main").appendChild(searchModalResult);

  let searchTimeout;

  searchField.addEventListener("input", () => {
    if (!searchField.value.trim()) {
      searchModalResult.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
      return;
    }
    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=${api_key}&query=${searchField.value}`,
        ({ results: moviesList }) => {
          searchWrapper.classList.remove("searching");
          searchModalResult.classList.add("active");
          searchModalResult.innerHTML = ""; // remove old data
          searchModalResult.innerHTML = `
            <p class="label">Results for</p>
            <h1 class="heading">${searchField.value}</h1>
            <div class="movie-list">
              <div class="grid-list"></div>
            </div>
          `;
          for (const movie of moviesList) {
            const movieCard = createMovieCard(movie);
            searchModalResult
              .querySelector(".grid-list")
              .appendChild(movieCard);
          }
        }
      );
    }, 500);
  });
}
