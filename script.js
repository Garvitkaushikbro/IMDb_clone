// https://www.omdbapi.com/?i=tt3896198&apikey=74986d14
const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const slideTracker = document.querySelector(".slide-tracker");
const slideContainer = document.querySelector(".slide-container");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
let position = 0;
const mts = document.querySelectorAll(".movie-grid-item");
const overlay = document.querySelector(".overlay");
const showcase = document.querySelector(".showcase");

const removeModal = function () {
  overlay.classList.add("hidden");
  showcase.classList.add("hidden");
  showcase.innerHTML = "";
};

overlay.addEventListener("click", removeModal);

slideTracker.addEventListener("click", async function (e) {
  if (e.target.tagName === "IMG") {
    overlay.classList.remove("hidden");
    showcase.classList.remove("hidden");
    showcase.innerHTML = "";
    const id = e.target.closest("div").dataset.id;
    const URL = `https://omdbapi.com/?i=${id}&apikey=2e0ef59`;
    // const URL = "http://www.omdbapi.com/?i=tt3896198&apikey=2e0ef59";
    console.log(URL);
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") {
      const details = data;
      showcase.innerHTML = `
      <div class = "movie-poster">
          <img src = "${
            details.Poster != "N/A" ? details.Poster : "image_not_found.png"
          }" alt = "movie poster">
      </div>
      <div class = "movie-info">
          <h3 class = "movie-title">${details.Title}</h3>
          <ul class = "movie-misc-info">
              <li class = "year">Year: ${details.Year}</li>
              <li class = "rated">Ratings: ${details.Rated}</li>
              <li class = "released">Released: ${details.Released}</li>
          </ul>
          <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
          <p class = "actors"><b>Actors: </b>${details.Actors}</p>
          <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
          <p class = "language"><b>Language:</b> ${details.Language}</p>
          <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
            details.Awards
          }</p>
      </div>
      `;
    }
  }
});

function findMovies(event) {
  if (event.key !== "Enter") return;
  position = 0;
  let searchTerm = movieSearchBox.value.trim();
  slideTracker.innerHTML = "";
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

// load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=2e0ef59`;
  console.log(URL);
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") {
    const totalResults = parseInt(data.totalResults);
    const resultsPerPage = data.Search ? data.Search.length : 0;

    // Calculate the total number of pages
    const totalPages =
      resultsPerPage === 0 ? 0 : Math.ceil(totalResults / resultsPerPage);
    console.log(totalPages);
    // Fetch and add movie data for each page separately
    for (let i = 1; i <= totalPages; i++) {
      await addMoviesToSlider(searchTerm, i);
    }
  }
}

// Function to fetch and add movie data for a specific page
async function addMoviesToSlider(searchTerm, page) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=${page}&apikey=2e0ef59`;
  const res = await fetch(`${URL}`);
  const data = await res.json();

  let movieGrid = document.createElement("div");
  movieGrid.classList.add("movie-grid");
  movieGrid.dataset.id = page; // setting page number of the grid
  const movies = [...data.Search];

  // setting grid items in moviegrid
  for (let idx = 0; idx < data.Search.length; idx++) {
    let movieGridItem = document.createElement("div");
    movieGridItem.dataset.id = movies[idx].imdbID; // setting movie id in data-id
    movieGridItem.classList.add("movie-grid-Item");
    let title =
      movies[idx].Title.length > 24
        ? movies[idx].Title.slice(0, 21) + "..."
        : movies[idx].Title;
    let moviePoster;
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "image_not_found.png";
    movieGridItem.innerHTML = `
      <div class="movie-grid-item-thumbnail" data-id=${movies[idx].imdbID}>
          <img src="${moviePoster}">
      </div>
      <div class="movie-grid-item-info">
          <h3>${title}</h3>
          <p>${movies[idx].Year}</p>
      </div>
    `;

    movieGrid.appendChild(movieGridItem);
  }
  slideTracker.appendChild(movieGrid);
}

function slide() {
  slideTracker.style.transform = `translateX(${position}px)`;
}

leftArrow.addEventListener("click", () => {
  position += 910; // Width of slide + margin-right
  slide();
});

rightArrow.addEventListener("click", () => {
  position -= 910; // Width of slide + margin-right
  slide();
});

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
