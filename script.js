// https://www.omdbapi.com/?i=tt3896198&apikey=74986d14
const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
const resultContainer = document.querySelector(".result-container");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
let position = 0;

function slide() {
  sliderContainer.style.transform = `translateX(${position}px)`;
}

leftArrow.addEventListener("click", () => {
  console.log("left");
  position += 910; // Width of slide + margin-right
  slide();
});

rightArrow.addEventListener("click", () => {
  console.log("right");
  position -= 910; // Width of slide + margin-right
  slide();
});

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    resultContainer.innerHTML = "";
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

// load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=74986d14`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") {
    // displayMovieList(data.Search);
    const totalResults = parseInt(data.totalResults);
    const resultsPerPage = data.Search ? data.Search.length : 0;

    // Calculate the total number of pages
    const totalPages =
      resultsPerPage === 0 ? 0 : Math.ceil(totalResults / resultsPerPage);

    displayMoviePageGrid(totalPages, searchTerm);
  }
}

async function displayMoviePageGrid(totalPages, searchTerm) {
  resultContainer.innerHTML = "";
  for (let i = 1; i < totalPages; i++) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=${i}&apikey=74986d14`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    console.log(data.Search.length);
    let movieGrid = document.createElement("div");
    movieGrid.classList.add("movie-grid");
    movieGrid.dataset.id = i; // setting page number of the grid

    const movies = data.Search;
    // setting grid items in moviegrid
    for (let idx = 0; idx < data.Search.length; idx++) {
      let movieGridItem = document.createElement("div");
      movieGridItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
      movieGridItem.classList.add("movie-grid-Item");
      let moviePoster;
      if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
      else moviePoster = "image_not_found.png";
      movieGridItem.innerHTML = `
        <div class = "movie-grid-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "movie-grid-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
      const x = (i - 1) * 100;
      // movieGridItem.style.transform = `translate: ${x}%`;
      movieGrid.appendChild(movieGridItem);
    }
    resultContainer.appendChild(movieGrid);
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  console.log(movies.length);
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  // searchListMovies.forEach((movie) => {
  // movie.addEventListener("click", async () => {
  //   // console.log(movie.dataset.id);
  //   searchList.classList.add("hide-search-list");
  //   movieSearchBox.value = "";
  //   const result = await fetch(
  //     `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=74986d14`
  //   );
  //   const movieDetails = await result.json();
  //   // console.log(movieDetails);
  //   displayMovieDetails(movieDetails);
  // });
  // });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
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
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
          details.Awards
        }</p>
    </div>
    `;
}

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
