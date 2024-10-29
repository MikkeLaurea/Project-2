// Funktio elokuvien hakemiseksi valitun teatterin perusteella
document.addEventListener('DOMContentLoaded', function() {
  // Etsitään HTML elementit
  const theaterSelect = document.getElementById('theaterSelect');
  const movieDisplay = document.getElementById('movieDisplay');
  const movieSearch = document.getElementById('movieSearch');

  // Alustetaan teatterilista, kutsutaan API ja täytetään teatterilista
  fetchTheaters();

  // Käsittelijä dropdownin muutokselle
  theaterSelect.addEventListener('change', fetchMovies);

  // Käsittelijä hakuun input-kentässä
  movieSearch.addEventListener('input', filterMovies);

  let movies = []; // Muuttuja tallentamaan elokuvat

  // Funktio hakee teatterit proxy-endpointin kautta
  function fetchTheaters() {
    // Tehdään AJAX-pyyntö teattereille
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/.netlify/functions/getTheatreAreas', true); // Päivitetty endpoint
    xhr.onload = function() {
      if (xhr.status === 200) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
        const areas = xmlDoc.getElementsByTagName('TheatreArea');
        
        // Käydään läpi ja lisätään teatterit pudotusvalikkoon
        for (let i = 0; i < areas.length; i++) {
          const option = document.createElement('option');
          option.value = areas[i].getElementsByTagName('ID')[0].textContent;
          option.textContent = areas[i].getElementsByTagName('Name')[0].textContent;
          theaterSelect.appendChild(option);
        }
      }
    };
    xhr.send();
  }

 // Funktio hakee elokuvat valitusta teatterista
 function fetchMovies() {
  // Tyhjennetään vanhat elokuvan tiedot
  movieDisplay.innerHTML = '';

  // Haetaan valitun teatterin ID
  const theaterId = theaterSelect.value;
  if (!theaterId) return;

  // Tehdään AJAX-pyyntö elokuville proxy-endpointin kautta
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/.netlify/functions/getSchedule?area=${theaterId}`, true); // Päivitetty endpoint
  xhr.onload = function() {
    if (xhr.status === 200) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
      const shows = xmlDoc.getElementsByTagName('Show');
      
      movies = []; // Tyhjennetään vanhat elokuvat ennen uusien hakemista
      
      // Käydään läpi jokainen elokuva ja lisätään se movies-listaan
      for (let i = 0; i < shows.length; i++) {
        const title = shows[i].getElementsByTagName('Title')[0].textContent;
        const imgSrc = shows[i].getElementsByTagName('EventSmallImagePortrait')[0].textContent;
        const showTimeRaw = shows[i].getElementsByTagName('dttmShowStart')[0].textContent;
        
        // Kutsutaan muotoilufunktiota, joka tekee päiväyksestä luettavamman
        const showTime = formatShowTime(showTimeRaw);

        const movie = { title, imgSrc, showTime };
        movies.push(movie);
      }

      // Näytetään elokuvat
      displayMovies(movies);
    }
  };
  xhr.send();
}

// Funktio muotoilee ajan näyttämisen selkeämmäksi
function formatShowTime(dateString) {
  const date = new Date(dateString);
  const options = { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('fi-FI', options);
}

  // Funktio näyttää elokuvat
  function displayMovies(movies) {
    movieDisplay.innerHTML = ''; // Tyhjennetään elokuvanäyttö

    // Käydään läpi elokuvat ja luodaan HTML-rakenne jokaiselle
    movies.forEach(movie => {
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
        <img src="${movie.imgSrc}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>Showtime: ${movie.showTime}</p>
      `;
      movieDisplay.appendChild(movieEl);
    });
  }

  // Funktio suodattaa elokuvat hakukentän perusteella
  function filterMovies() {
    const searchText = movieSearch.value.toLowerCase();
    const filteredMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchText)
    );
    displayMovies(filteredMovies);
  }
});
