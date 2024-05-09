"use strict";

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseUrl, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

// Home Page Sections (Top rated, upcoming, trending)
const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming",
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated",
  },
];

const genreList = {
  // create genre string from genre_id eg: [23, 43] -> "Action, Romance"
  asString(genreIdList) {
    let newGenreList = [];
    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
    }
    return newGenreList.join(", ");
  },
};
fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`,
  ({ genres }) => {
    for (const { id, name } of genres) genreList[id] = name;
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${api_key}`,
      ({ results: moviesList }) => {
        const banner = document.createElement("section");
        banner.classList.add("banner");
        banner.ariaLabel = "Popular Movies";
        banner.innerHTML = `
          <div class="banner-slider"></div>
          <div class="slider-control">
            <div class="control-inner">
            </div>
          </div>
        `;

        let controlItemIndex = 0;
        for (const [index, movie] of moviesList.entries()) {
          const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id,
          } = movie;

          const sliderItem = document.createElement("div");
          sliderItem.classList.add("slider-item");
          sliderItem.setAttribute("slider-item", "");
          sliderItem.innerHTML = `
            <img
              src="${imageBaseUrl}w1280${backdrop_path}"
              alt="${title}"
              class="image-cover"
              loading=${index === 0 ? "eager" : "lazy"}
            />
            <div class="banner-content">
              <h2 class="heading">${title}</h2>
              <div class="meta-list">
                <div class="meta-item">${release_date.split("-")[0]}</div>
                <div class="meta-item card-badge">
                  ${vote_average.toFixed(1)}
                </div>
                <p class="genre">${genreList.asString(genre_ids)}</p>
                <p class="banner-text">${overview}</p>
                <a href="../../detail.html" class="btn" onclick="getMovieDetails(${id})">
                  <img
                    src="./assets/images/play_circle.png"
                    alt="play circle"
                    width="24"
                    height="24"
                    aria-hidden="true"
                  />
                  <span class="span">Watch Now</span>
                </a>
              </div>
            </div>
          `;
          banner.querySelector(".banner-slider").appendChild(sliderItem);

          const controlItem = document.createElement("button");
          controlItem.classList.add("poster-box", "slider-item");
          controlItem.setAttribute("slider-control", `${controlItemIndex}`);
          controlItemIndex++;
          controlItem.innerHTML = `
            <img
              src="${imageBaseUrl}w154${poster_path}"
              alt="Slide to ${title}"
              loading="lazy"
              draggable="false"
              class="image-cover"
            />
          `;
          banner.querySelector(".control-inner").appendChild(controlItem);
        }
        pageContent.appendChild(banner);

        addHeroSlider();

        // Fetching home page sections
        for (const { title, path } of homePageSections) {
          fetchDataFromServer(
            `https://api.themoviedb.org/3/${path}?api_key=${api_key}&page=1`,
            createMovieList,
            title
          );
        }
      }
    );
  }
);

const addHeroSlider = () => {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");
  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    // Change to regular function
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");
    // 'this' == slider-control
    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
  };

  addEventOnElements(sliderControls, "click", sliderStart);
};

const createMovieList = ({ results: moviesList }, title) => {
  const movieListEle = document.createElement("section");
  movieListEle.classList.add("movie-list");
  movieListEle.ariaLabel = "${title}";
  movieListEle.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
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
};

search();