// By Joel Isotalo


// This code adds an event listener to the DOM which executes the "getPopular()" function when the DOM content has been fully loaded.
document.addEventListener("DOMContentLoaded", function() {
    getPopular();
  });


// Add an event listener to the "popular" element for a click event
// Execute the "getPopular()" function when the element is clicked
document.getElementById('popular').addEventListener("click",getPopular);

// Add an event listener to the "upcoming" element for a click event
// Execute the "getUpcoming()" function when the element is clicked
document.getElementById('upcoming').addEventListener("click",getUpcoming);


// Add an event listener to the "top" element for a click event
// Execute the "getTopRated()" function when the element is clicked
document.getElementById('top').addEventListener("click",getTopRated);


// Add an event listener to the "submitbutton" element for a click event
// Execute the "isSearchEmpty()" function when the element is clicked
document.getElementById('submitbutton').addEventListener("click",isSearchEmpty);


// Add an event listener to the window for a click event
// Execute the "outsideClick()" function when the window is clicked
window.addEventListener('click', outsideClick);

// This code adds an event listener to the 'close-button' element and will run the 'closeModal' function when clicked.
// It also adds an event listener to the document and will run the 'isSearchEmpty' function if the 'Enter' key is pressed.
document.getElementById('close-button').addEventListener('click', closeModal);
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    // Do something
    isSearchEmpty();
  }
});


// This function checks if the search field is empty. 
// If not, it calls the searchMovie() function and sets the border color to an empty string. 
// If it is empty, the border color is set to red.
function isSearchEmpty() {

    if (document.getElementById("search").value !== "")  {
      searchMovie();
      document.getElementById("search").style.borderColor = "";
    } else {
      document.getElementById("search").style.borderColor = "red";
    }


}

  
//The following function first clear the page display, then uses two different fetch calls to get both the "Now playing" movies as well as well the list of credit objects for each of the movies
function getPopular() {
    document.getElementById("search").value = "";
    document.getElementById("display1").innerHTML = "";
    
    fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=f9529df55c21297befabf884ef67bc77&language=en-US')
        .then(response => response.json())
            .then(data => {
    
    
    // Log the response from the API
    console.log(data);

  

    // Loop through the data and create a card for each movie
    data.results.forEach(movie => {
        
        
        
        //Create a div element for each of the corresponding movies and selected, relevant information for each

        let featuredMovie = document.createElement('div');
        featuredMovie.innerHTML = `
        <img id="poster" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" />
          <h1>${movie.title}</h1>
          <div class="divinfo">Audience score:</div>
          <p class="info" id="score">${movie.vote_average}</p>
          <p class="info"><b>Release date</b><br><br> ${movie.release_date}</p>
          <p class="info"><b>Synopsis</b><br><br>${movie.overview}</p>

          
          
      `;
        //Execute another API call to receive credits data for each of the displayed movies using their individual IDs
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`)
         .then (response => response.json())
         .then (creditsData => {

            console.log(creditsData.cast);
            featuredMovie.innerHTML += `<p class="info"><b>Cast</b><br><br>${creditsData.cast[0].name}, ${creditsData.cast[1].name}, ${creditsData.cast[2].name}, ${creditsData.cast[3].name}, ${creditsData.cast[4].name}</p>` + '<hr id="line">';

         });


      //Add an eventlistener to each movie div element that activates when an user clicks on it
      featuredMovie.addEventListener('click', () => {
        //Use Promise.all() function to execute asynchronous API calls to fetch all the relevant movie info for the modal view
        Promise.all([fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=f9529df55c21297befabf884ef67bc77`),fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`),fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`)])    
          .then(responses => {

            return Promise.all(responses.map(function (response) {
              return response.json();
            }));
          }).then(data => {

            // Log the response from the API
            console.log(data);

            //Add the data to the modal view one by one
            document.getElementById("modal-title").innerHTML = `${data[0].title}`;
            document.getElementById("modal-tagline").innerHTML = `${data[0].tagline}`;
            document.getElementById("modal-body1").innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${data[0].poster_path}" alt="${data[0].title}" />`;
            document.getElementById("modal-body2").innerHTML = `${data[0].overview}`;
            document.getElementById("modal-body3").innerHTML = `${movie.vote_average}`;
            document.getElementById("modal-body4").innerHTML = '<b>Cast:</b><br>';
            
            //Get the top 10 billed cast members and their corresponding characters
            for (var i = 0; i < 10; i++) {

              //Use try and catch exception handler to make sure that code is successfully run in the event that there's less than 10 cast members for a movie
              try {

                document.getElementById("modal-body4").innerHTML += `${data[1].cast[i].name}`+ "&nbsp;&nbsp;-&nbsp;&nbsp;" + `${data[1].cast[i].character}` + "<br>";
              } catch (e) {

                break; 
              }            
            }

            if (`${data[0].budget}` > 1) {
              document.getElementById("modal-body5").innerHTML = '<b>Budget: </b><br> ' + "$" + `${data[0].budget}`;
            }

            document.getElementById("modal-body6").innerHTML = '<b>Genres:</b><br>';
            for (var i = 0; i < 3; i++) {

              //Use try and catch exception handler to make sure that code is successfully run in the event that there's less than 3 genres for a movie
              try {


                document.getElementById("modal-body6").innerHTML += `${data[2].genres[i].name}` + "&nbsp&nbsp&nbsp";
                
              } catch (e) {

                break; 
              }            
            }
            document.getElementById("modal-body7").innerHTML = '<b>Box office:</b><br>';

            if (`${data[2].revenue}` > 0) {
              document.getElementById("modal-body7").innerHTML += "$" + `${data[2].revenue}`
            } else {
              document.getElementById("modal-body7").innerHTML += "Box office unknown.";
            }

            document.getElementById("modal-body8").innerHTML = '<b>Homepage:</b><br>';
            document.getElementById("modal-body8").innerHTML += `<a href="${data[2].homepage}" target="_blank">${data[2].homepage}</a>`
            document.getElementById("modal").style.display = "block";
            
            
          });
      });
      //Add the div element to the screen
      document.getElementById("display1").appendChild(featuredMovie);
    });
  });
}




function getUpcoming() {

    document.getElementById("search").value = "";
    document.getElementById("display1").innerHTML = "";
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=f9529df55c21297befabf884ef67bc77&primary_release_date.gte=${new Date().toISOString().slice(0, 10)}`)
        .then(response => response.json())
            .then(data => {
    // Log the response from the API
    console.log(data);

    // Create a variable to store the HTML output


    //Create a div element for each of the corresponding movies and selected, relevant information for each

    data.results.forEach(movie => {
      let featuredMovie = document.createElement('div');
      featuredMovie.innerHTML = `
      <img id="poster" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" />
        <h1>${movie.title}</h1>
        <p class="info"><b>Release date</b><br><br> ${movie.release_date}</p>
        <p class="info"><b>Synopsis</b><br><br>${movie.overview}</p>

        
        
    `;

      fetch (`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`)
       .then (response => response.json())
       .then (creditsData => {

          console.log(creditsData.cast);
          featuredMovie.innerHTML += `<p class="info"><b>Cast</b><br><br>${creditsData.cast[0].name}, ${creditsData.cast[1].name}, ${creditsData.cast[2].name}, ${creditsData.cast[3].name}, ${creditsData.cast[4].name}</p>` + '<hr id="line">';

       });
       //Add an eventlistener to each movie div element that activates when an user clicks on it
       featuredMovie.addEventListener('click', () => {
        //Use Promise.all() function to execute asynchronous API calls to fetch all the relevant movie info for the modal view
        Promise.all([fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=f9529df55c21297befabf884ef67bc77`),fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`),fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`)])    
          .then(responses => {

            return Promise.all(responses.map(function (response) {
              return response.json();
            }));
          }).then(data => {

            console.log(data);

            //Add the data to the modal view one by one
            document.getElementById("modal-title").innerHTML = `${data[0].title}`;
            document.getElementById("modal-tagline").innerHTML = `${data[0].tagline}`;
            document.getElementById("modal-body1").innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${data[0].poster_path}" alt="${data[0].title}" />`;
            document.getElementById("modal-body2").innerHTML = `${data[0].overview}`;
            document.getElementById("modal-body3").innerHTML = `${movie.vote_average}`;
            document.getElementById("modal-body4").innerHTML = '<b>Cast:</b><br>';
            for (var i = 0; i < 10; i++) {
              try {
                // code that throws the error
                document.getElementById("modal-body4").innerHTML += `${data[1].cast[i].name}`+ "&nbsp;&nbsp;-&nbsp;&nbsp;" + `${data[1].cast[i].character}` + "<br>";
              } catch (e) {
                // exit the loop
                break; 
              }            
            }

            if (`${data[0].budget}` > 1) {
              document.getElementById("modal-body5").innerHTML = '<b>Budget: </b><br> ' + "$" + `${data[0].budget}`;
            }

            document.getElementById("modal-body6").innerHTML = '<b>Genres:</b><br>';
            for (var i = 0; i < 3; i++) {
              try {
                // code that throws the error

                document.getElementById("modal-body6").innerHTML += `${data[2].genres[i].name}` + "&nbsp&nbsp&nbsp";
                
              } catch (e) {
                // exit the loop
                break; 
              }            
            }
            document.getElementById("modal-body7").innerHTML = '<b>Box office:</b><br>';

            if (`${data[2].revenue}` > 0) {
              document.getElementById("modal-body7").innerHTML += "$" + `${data[2].revenue}`
            } else {
              document.getElementById("modal-body7").innerHTML += "Box office unknown.";
            }

            document.getElementById("modal-body8").innerHTML = '<b>Homepage:</b><br>';
            document.getElementById("modal-body8").innerHTML += `<a href="${data[2].homepage}" target="_blank">${data[2].homepage}</a>`
            document.getElementById("modal").style.display = "block";
            
            
          });
      });
      //Add the div element to the screen
      document.getElementById("display1").appendChild(featuredMovie);
    });
  });
}

function getTopRated() {

    document.getElementById("search").value = "";
    document.getElementById("display1").innerHTML = "";
    fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=f9529df55c21297befabf884ef67bc77&language=en-US')
    .then(response => response.json())
    .then(data => {
// Log the response from the API
    console.log(data);

// Create a variable to store the HTML output


//Create a div element for each of the corresponding movies and selected, relevant information for each

    data.results.forEach(movie => {
        let featuredMovie = document.createElement('div');
        featuredMovie.innerHTML = `
        <img id="poster" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" />
        <h1>${movie.title}</h1>
        <div class="divinfo">Audience score:</div>
        <p class="info" id="score">${movie.vote_average}</p>
        <p class="info"><b>Release date</b><br><br> ${movie.release_date}</p>
        <p class="info"><b>Synopsis</b><br><br>${movie.overview}</p>`;

        fetch (`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`)
        .then (response => response.json())
          .then (creditsData => {

          console.log(creditsData.cast);
          featuredMovie.innerHTML += `<p class="info"><b>Cast</b><br><br>${creditsData.cast[0].name}, ${creditsData.cast[1].name}, ${creditsData.cast[2].name}, ${creditsData.cast[3].name}, ${creditsData.cast[4].name}</p>` + '<hr id="line">';

         });
         //Add an eventlistener to each movie div element that activates when an user clicks on it
         featuredMovie.addEventListener('click', () => {
          //Use Promise.all() function to execute asynchronous API calls to fetch all the relevant movie info for the modal view
          Promise.all([fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=f9529df55c21297befabf884ef67bc77`),fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`),fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`)])    
            .then(responses => {
  
              return Promise.all(responses.map(function (response) {
                return response.json();
              }));
            }).then(data => {
  
              console.log(data);
  
              //Add the data to the modal view one by one
              document.getElementById("modal-title").innerHTML = `${data[0].title}`;
              document.getElementById("modal-tagline").innerHTML = `${data[0].tagline}`;
              document.getElementById("modal-body1").innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${data[0].poster_path}" alt="${data[0].title}" />`;
              document.getElementById("modal-body2").innerHTML = `${data[0].overview}`;
              document.getElementById("modal-body3").innerHTML = `${movie.vote_average}`;
              document.getElementById("modal-body4").innerHTML = '<b>Cast:</b><br>';
              for (var i = 0; i < 10; i++) {
                try {
                  // code that throws the error
                  document.getElementById("modal-body4").innerHTML += `${data[1].cast[i].name}`+ "&nbsp;&nbsp;-&nbsp;&nbsp;" + `${data[1].cast[i].character}` + "<br>";
                } catch (e) {
                  // exit the loop
                  break; 
                }            
              }
  
              if (`${data[0].budget}` > 1) {
                document.getElementById("modal-body5").innerHTML = '<b>Budget: </b><br> ' + "$" + `${data[0].budget}`;
              }
  
              document.getElementById("modal-body6").innerHTML = '<b>Genres:</b><br>';
              for (var i = 0; i < 3; i++) {
                try {
                  // code that throws the error
  
                  document.getElementById("modal-body6").innerHTML += `${data[2].genres[i].name}` + "&nbsp&nbsp&nbsp";
                  
                } catch (e) {
                  // exit the loop
                  break; 
                }            
              }
              document.getElementById("modal-body7").innerHTML = '<b>Box office:</b><br>';

            if (`${data[2].revenue}` > 0) {
              document.getElementById("modal-body7").innerHTML += "$" + `${data[2].revenue}`
            } else {
              document.getElementById("modal-body7").innerHTML += "Box office unknown.";
            }

            document.getElementById("modal-body8").innerHTML = '<b>Homepage:</b><br>';
            document.getElementById("modal-body8").innerHTML += `<a href="${data[2].homepage}" target="_blank">${data[2].homepage}</a>`
            document.getElementById("modal").style.display = "block";
              
              
            });
        });
        //Add the div element to the screen
    document.getElementById("display1").appendChild(featuredMovie);
    });
  });
}


function searchMovie() {

    document.getElementById("display1").innerHTML = "";
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=f9529df55c21297befabf884ef67bc77&query=${document.getElementById('search').value}`)
        .then(response => response.json())
            .then(data => {
// Log the response from the API

// Create a variable to store the HTML output


// Loop through the data and create a card for each movie
data.results.forEach(movie => {
    let featuredMovie = document.createElement('div');
        featuredMovie.innerHTML = `
        <img id="poster" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" />
          <h1>${movie.title}</h1>
          <div class="divinfo">Audience score:</div>
          <p class="info" id="score">${movie.vote_average}</p>
          <p class="info"><b>Release date</b><br><br> ${movie.release_date}</p>
          <p class="info"><b>Synopsis</b><br><br>${movie.overview}</p>

          
          
      `;

        fetch (`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`)
         .then (response => response.json())
         .then (creditsData => {

            console.log(creditsData.cast);
            featuredMovie.innerHTML += `<p class="info"><b>Cast</b><br><br>${creditsData.cast[0].name}, ${creditsData.cast[1].name}, ${creditsData.cast[2].name}, ${creditsData.cast[3].name}, ${creditsData.cast[4].name}</p>` + '<hr id="line">';

         });
         //Add an eventlistener to each movie div element that activates when an user clicks on it
         featuredMovie.addEventListener('click', () => {
          //Use Promise.all() function to execute asynchronous API calls to fetch all the relevant movie info for the modal view
          Promise.all([fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=f9529df55c21297befabf884ef67bc77`),fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`),fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=f9529df55c21297befabf884ef67bc77&language=en-US`)])    
            .then(responses => {
  
              return Promise.all(responses.map(function (response) {
                return response.json();
              }));
            }).then(data => {
  
              // Log the response from the API
              console.log(data);
  
              //Add the data to the modal view one by one
              document.getElementById("modal-title").innerHTML = `${data[0].title}`;
              document.getElementById("modal-tagline").innerHTML = `${data[0].tagline}`;
              document.getElementById("modal-body1").innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${data[0].poster_path}" alt="${data[0].title}" />`;
              document.getElementById("modal-body2").innerHTML = `${data[0].overview}`;
              document.getElementById("modal-body3").innerHTML = `${movie.vote_average}`;
              document.getElementById("modal-body4").innerHTML = '<b>Cast:</b><br>';
              for (var i = 0; i < 10; i++) {
                try {
                  // code that throws the error
                  document.getElementById("modal-body4").innerHTML += `${data[1].cast[i].name}`+ "&nbsp;&nbsp;-&nbsp;&nbsp;" + `${data[1].cast[i].character}` + "<br>";
                } catch (e) {

                  break; 
                }            
              }
  
              if (`${data[0].budget}` > 1) {
                document.getElementById("modal-body5").innerHTML = '<b>Budget: </b><br> ' + "$" + `${data[0].budget}`;
              }
  
              document.getElementById("modal-body6").innerHTML = '<b>Genres:</b><br>';
              for (var i = 0; i < 3; i++) {
                try {
                  // code that throws the error
  
                  document.getElementById("modal-body6").innerHTML += `${data[2].genres[i].name}` + "&nbsp&nbsp&nbsp";
                  
                } catch (e) {
                  // exit the loop
                  break; 
                }            
              }
              document.getElementById("modal-body7").innerHTML = '<b>Box office:</b><br>';

            if (`${data[2].revenue}` > 0) {
              document.getElementById("modal-body7").innerHTML += "$" + `${data[2].revenue}`
            } else {
              document.getElementById("modal-body7").innerHTML += "Box office unknown.";
            }

            document.getElementById("modal-body8").innerHTML = '<b>Homepage:</b><br>';
            document.getElementById("modal-body8").innerHTML += `<a href="${data[2].homepage}" target="_blank">${data[2].homepage}</a>`
            document.getElementById("modal").style.display = "block";
              
              
            });
        });
        //Add the div element to the screen
    document.getElementById("display1").appendChild(featuredMovie);
    });
    });
    }




//Function that closes the modal view
function closeModal() {
    modal.style.display = 'none';
  }


  //Close the modal if the user clicks outside of its bounds
function outsideClick(e) {
    if (e.target == modal) {
      modal.style.display = 'none';
    }
  }
