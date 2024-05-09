"use strict";

import { api_key, imageBaseUrl, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];
  for (const { name } of genreList) newGenreList.push(name);
  return newGenreList.join(", ");
};

const getCasts = function (casts) {
  const newCastList = [];
  for (let i = 0, len = casts.length; i < len && i < 10; i++) {
    const { name } = casts[i];
    newCastList.push(name);
  }
  return newCastList.join(", ");
};

const getDirectors = function (crew) {
  const directors = crew.filter(({ job }) => job === "Director");
  const directosList = [];
  for (const { name } of directors) directosList.push(name);
  return directosList.join(", ");
};

const filteredVideos = function (videos) {
  return videos.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

const movieId = window.localStorage.getItem("movieId");

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=casts%2Cvideos%2Cimages%2Creleases&language=en-US&api_key=${api_key}`,
  (movie) => {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      releases: {
        countries: [{ certification }],
      },
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;
    document.title = `${title} - ShowFlix`;

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");
    movieDetail.innerHTML = `
      <div
        class="backdrop-image"
        style="background-image: url('${imageBaseUrl}${"w1280" || "original"}${
      backdrop_path || poster_path
    }')"
      ></div>
      <figure class="poster-box movie-poster">
        <img
          src="${imageBaseUrl}w342${poster_path}"
          alt="${title} poster"
          class="image-cover"
        />
      </figure>
      <div class="detail-box">
        <div class="detail-content">
          <h1 class="heading">${title}</h1>
          <div class="meta-list">
            <div class="meta-item">
              <img
                src="./assets/images/star.png"
                alt="rating"
                width="20"
                height="20"
              />
              <span class="span">${vote_average.toFixed(1)}</span>
            </div>
            <div class="separator"></div>
            <div class="meta-item">${runtime}</div>
            <div class="separator"></div>
            <div class="meta-item">${release_date.split("-")[0]}</div>
            <div class="meta-item card-badge">${certification}</div>
          </div>
          <p class="genre">${getGenres(genres)}</p>
          <p class="overview">${overview}</p>
          <ul class="detail-list">
            <div class="list-item">
              <p class="list-name">Starring</p>
              <p>${getCasts(cast)}</p>
            </div>
            <div class="list-item">
              <p class="list-name">Directed By</p>
              <p>${getDirectors(crew)}</p>
            </div>
          </ul>
        </div>
        <div class="title-wrapper">
          <h3 class="title-large">Trailers and Clips</h3>
        </div>
        <div class="slider-list">
          <div class="slider-inner"></div>
        </div>
      </div>
    `;

    for (const { key, name } of filteredVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");
      videoCard.innerHTML = `
        <iframe
          width="500"
          height="300"
          src="https://www.youtube.com/embed/${key}?theme=dark&color=white&rel=0"
          frameborder="0"
          allowfullscreen="1"
          title="${title}"
          class="image-cover"
          loading="lazy"
        ></iframe>
      `;
      movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }

    pageContent.appendChild(movieDetail);

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}`,
      ({ results: moviesList }) => {
        const movieListEle = document.createElement("section");
        movieListEle.classList.add("movie-list");
        movieListEle.ariaLabel = "Recommendations";
        movieListEle.innerHTML = `
      <div class="title-wrapper">
        <h3 class="title-large">You May Also Like</h3>
      </div>
      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    `;
        for (const movie of moviesList) {
          const movieCard = createMovieCard(movie);
          movieListEle.querySelector(".slider-inner").appendChild(movieCard);
        }
        pageContent.appendChild(movieListEle);
      }
    );
  }
);

search();
