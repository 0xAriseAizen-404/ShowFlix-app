"use strict";

import { api_key, fetchDataFromServer } from "./api.js";

export function sidebar() {
  const genreList = {};
  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`,
    ({ genres }) => {
      for (const { id, name } of genres) genreList[id] = name;
      genreLink();
    }
  );
  const sideBarInner = document.createElement("div");
  sideBarInner.classList.add("sidebar-inner");
  sideBarInner.innerHTML = `
<div class="sidebar-list">
    <p class="title">Genre</p>
</div>
<div class="sidebar-list">
    <p class="title">Language</p>
    <a href="./movie-list.html" class="sidebar-link" onclick="getMovieList('with_original_language=en', 'English')" menu-close>English</a>
<a href="./movie-list.html" class="sidebar-link" onclick="getMovieList('with_original_language=te', 'Telugu')" menu-close>Telugu</a>
<a href="./movie-list.html" class="sidebar-link" onclick="getMovieList('with_original_language=hi', 'Hindi')" menu-close>Hindi</a>

</div>
<div class="sidebar-footer">
    <p class="copyright">
        Copyright 2024
        <a href="https://github.com/arise-aizen-404">arise-aizen-404</a>
    </p>
    <img src="./assets/images/tmdb-logo.svg" width="130" height="17" alt="the movie database logo" />
</div>`;

  const genreLink = () => {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("siderbar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute(
        "onclick",
        `getMovieList("with_genres=${genreId}", "${genreName}")`
      );
      link.textContent = genreName;
      sideBarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }
    const sidebar = document.querySelector(".sidebar");
    sidebar.appendChild(sideBarInner);
    toggleSidebar(sidebar);
  };
  const toggleSidebar = function (sidebar) {
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");
    addEventOnElements(sidebarTogglers, "click", () => {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });
    addEventOnElements(sidebarClose, "click", () => {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  };
}
