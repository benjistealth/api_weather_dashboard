// Use the [5 Day Weather Forecast](https://openweathermap.org/forecast5)
// The base URL for your API calls should look like the following: 
// `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`
// take city and send of request to get lat lon and then request weather
// initialise the page with the geolocal
// 

// Grab divs from html
today = $("#today");
searchButton = $(".search-button");
forecastEl = $("#forecast");

// initial API query to get the lat lon on page load
var queryURL_1 = "https://openweathermap.org/api/geocoding-api"
// define the API query components for call deux
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
var API_Key = "4fdb63abdc22d25a9f11e91d3ffc862a"; // my API key
// Use London as start value 51.507359, -0.136439.
var lat = 51.50;
var lon = -0.13;
var searchArr = [];


searchButton.click(function (event) {
    event.preventDefault();
    // remove existing weather data if a new search is triggered
    $(".five-day").remove();
    searchBoxText = $("#search-input").val();


    // grab user search term or default to London
    if (searchBoxText) {
        searchArr.push(searchBoxText);
        localStorage.setItem("searches", searchArr);
        getLatlon();
        createSearchButtons(searchArr);
        var weatherPayLoad = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
    } else {
        // use London lat lon as default
        var weatherPayLoad = "https://api.openweathermap.org/data/2.5/forecast?lat=51.50&lon=-0.13&appid=" + API_Key;
        searchArr.push(searchBoxText);
    }
    // console.log(weatherPayLoad);
    $.getJSON(weatherPayLoad, function (json) {
        console.log("time :" + json.list[0].dt);
        console.log("wind :" + json.list[0].wind.speed);
        console.log("temp :" + (json.list[0].main.temp - 273.15).toFixed()); //kelvin temp
        console.log("humidity : " + json.list[0].main.humidity);

        unixTime = json.list[0].dt;//unix time stamp to convert
        var date = convertUNIX(unixTime);
        console.log("date : " + date);
        //format location and date
        today.html(json.city.name + " " + date);
        // add  icon from openweatherAPI
        var todayimageDiv = $("<img>");
        // use zero in the array as always first day
        var todayimageLink = "http://openweathermap.org/img/w/" + json.list[0].weather[0].icon + ".png";
        todayimageDiv.attr("src", todayimageLink);
        today.append(todayimageDiv);
        // creating weather element containers
        var fiveDayDiv = $("<div>").addClass("five-day");
        forecastEl.append(fiveDayDiv);


        for (let i = 0; i < json.list.length; i = i + 8) {
            // create a div for each day
            var dayDiv = $("<div>").addClass("dayDiv");
            // creating weather data
            var icon = $("<img>");
            var wind = $("<div>");
            var temp = $("<div>");
            var humidity = $("<div>");
            var iconurl = "http://openweathermap.org/img/w/" + json.list[i].weather[0].icon + ".png";
            temp.text("Temp: " + (json.list[i].main.temp - 273.15).toFixed()) + "9\xB0" + "C";
            wind.text("Wind: " + json.list[i].wind.speed + " KPH");
            humidity.text("humidity: " + json.list[i].main.humidity + " %");
            icon.attr("src", iconurl);

            // Adding elements to page        
            fiveDayDiv.append(dayDiv);
            dayDiv.append(date, icon, temp, wind, humidity);
        }
    });
})

function convertUNIX(unixTime) {
    const date = moment.unix(unixTime).format("DD/MM/YYYY");
    return date;
}

function getLatlon() {
    var latLonSearch = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchBoxText + "&limit=1&appid=" + API_Key;
    // need to handle failed search
    if (latLonSearch) {
        $.getJSON(latLonSearch, function (json) {
            lat = json[0].lat;
            lon = json[0].lon;
            return;
        })
    }
    return;
}

function createSearchButtons(searchArr) {

}