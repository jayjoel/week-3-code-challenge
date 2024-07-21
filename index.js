const movieItem = document.getElementsByClassName("movie-item")[0];
const listMovies = document.getElementById("films");
const BASE_URL = "http://localhost:4000";

const displayMovieDetails = async (movie) => {
  try {
    // let res
    movieItem.innerHTML = ""; // Clear previous movie details

    const item = document.createElement("div");
    item.classList.add("item");

    // Poster
    const img = document.createElement("img");
    img.src = movie.poster;
    img.classList.add("poster");
    item.appendChild(img);
    movieItem.appendChild(item);

    const metadata = document.createElement("div");
    metadata.classList.add("metadata");
    item.appendChild(metadata);

    // Title
    const h2 = document.createElement("h2");
    h2.innerText = movie.title;
    metadata.appendChild(h2);

    // Runtime
    const h4 = document.createElement("h4");
    h4.innerText = `${movie.runtime} minutes`;
    metadata.appendChild(h4);

    // Showtime
    const p = document.createElement("p");
    p.innerText = movie.showtime;
    metadata.appendChild(p);

    // Available tickets
    const availableTickets = Math.max(movie.capacity - movie.tickets_sold, 0);
    const h3 = document.createElement("h3");
    h3.innerText = `Available tickets: ${availableTickets}`;
    metadata.appendChild(h3);

    // Buy Ticket Button
    const buyTicket = document.createElement("button");
    buyTicket.innerText = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
    buyTicket.classList.add("buy-ticket");
    buyTicket.disabled = availableTickets === 0;

    buyTicket.addEventListener("click", async () => {
      if (availableTickets > 0) {
        movie.tickets_sold += 1;

        const response = await fetch(`${BASE_URL}/films/${movie.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tickets_sold: movie.tickets_sold }),
        });

        if (response.ok) {
          displayMovieDetails(movie);
          updateMoviesList();
        } else {
          console.log("Something went wrong!");
        }
      }
    });

    metadata.appendChild(buyTicket);
  } catch (error) {
    alert("error occured!");
  }
};

const getSingleMovie = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/films/${id}`);
    if (res.ok) {
      const movie = await res.json();
      console.log("Fetched movie:", movie); // Debugging log
      displayMovieDetails(movie);
    } else {
      console.log("Failed to fetch movie details.");
    }
  } catch (err) {
    console.log("Something went wrong!", err);
  }
};

const updateMoviesList = async () => {
  try {
    const allMovies = await fetch(`${BASE_URL}/films`);
    if (allMovies.ok) {
      const movies = await allMovies.json();
      console.log("Fetched movies:", movies); // Debugging log
      listMovies.innerHTML = "";
      movies.forEach((movie) => {
        const li = document.createElement("li");
        li.innerText = movie.title;
        li.classList.add("film", "item");

        if (movie.capacity - movie.tickets_sold === 0) {
          li.classList.add("sold-out");
        }

        li.addEventListener("click", () => {
          getSingleMovie(movie.id);
        });

        listMovies.appendChild(li);
      });
    } else {
      console.log("Failed to fetch movies list.");
    }
  } catch (error) {
    console.log("Something went wrong!", error);
  }
};

// Call functions to fetch data
getSingleMovie(1);
updateMoviesList();