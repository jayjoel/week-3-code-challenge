const movieItem = document.getElementsByClassName("movie-item")[0];
const listMovies = document.getElementById("films");
const BASE_URL = "https://json-server-x11f.onrender.com";

const getSingleMovie = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/films/${id}`);

    if (res.ok) {
      const result = await res.json();
      const item = document.createElement("div");
      item.classList.add("item");

      // poster
      const img = document.createElement("img");
      img.src = result.poster;
      img.classList.add("poster");
      console.log(result);
      item.appendChild(img);
      movieItem.appendChild(item);

      const metadata = document.createElement("div");
      metadata.classList.add("metadata");
      item.appendChild(metadata);

      // title
      const h2 = document.createElement("h2");
      h2.innerText = result.title;
      metadata.appendChild(h2);

      // runtime
      const h4 = document.createElement("h4");
      h4.innerText = `${result.runtime} minutes`;
      metadata.appendChild(h4);

      const p = document.createElement("p");
      p.innerText = result.showtime;
      metadata.appendChild(p);

      const h3 = document.createElement("h3");
      h3.innerText = `Available tickets: ${Math.max(result.capacity - result.tickets_sold, 0)}`;
      metadata.appendChild(h3);

      const buyTicket = document.createElement("button");
      buyTicket.innerText = "Buy Ticket";
      buyTicket.classList.add("buy-ticket");
      buyTicket.addEventListener("click", async () => {
        try {
          let response = await fetch(`${BASE_URL}/films/${id}`);

          let movie = await response.json();
          console.log(movie);

          movie.tickets_sold += 1;

          const moviesSoldOut = result.capacity - result.tickets_sold;
          if (moviesSoldOut <= 0) {
            alert("sold out");
            return;
          }
          response = await fetch(`${BASE_URL}/films/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(movie),
          });
          window.location.reload();
        } catch (error) {
          console.log("something went wrong!");
        }
      });
      metadata.appendChild(buyTicket);
    }
  } catch (err) {
    console.log("Something went wrong!");
  }
};

getSingleMovie(1);

const getAllMovies = async () => {
  try {
    const allMovies = await fetch(`${BASE_URL}/films`);
    const result = await allMovies.json();
    result.forEach((item) => {
      const li = document.createElement("li");
      li.innerText = item.title;
      listMovies.appendChild(li);
    });
  } catch (error) {
    console.log("something went wrong");
  }
};

getAllMovies();