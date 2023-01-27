// Use the [5 Day Weather Forecast](https://openweathermap.org/forecast5)
// The base URL for your API calls should look like the following: 
// `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`
// take city and send of request to get lat lon and then request weather
// initialise the page with the geolocal
// 

// Grab divs from html
searchBoxText = $("#search-input").val();
searchButton = $("#search-button");

var queryURL_1 = "https://openweathermap.org/api/geocoding-api"
// define the API call components for call deux
var queryURL_2 = `https://api.openweathermap.org/data/2.5/forecast?lat=` + lat + `&lon=` + `&appid=` + API_Key;
var API_Key = "4fdb63abdc22d25a9f11e91d3ffc862a";
var lat = lat;
var lon = lon;

// from w3 schools to get the current location of the user to display on page load
function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition();
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

// listen for the button click event
// then go look up the lat lon with the city name
$("#run-search").on("click", function(event) {

// write the ajax call to get the lat lon
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(weatherPayload);




  // test the ajax reponse in console
console.log(weatherPayload);
});


