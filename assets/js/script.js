// Use the [5 Day Weather Forecast](https://openweathermap.org/forecast5)
// The base URL for your API calls should look like the following: 
// `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`
// take city and send of request to get lat lon and then request weather
// initialise the page with the geolocal
// 

// Grab divs from html
todayBox = $("<div>").addClass("today-box");
today = $("#today");
searchButton = $(".search-button");
forecastEl = $("#forecast");
historyEl = $("#history");

// initial API query to get the lat lon on page load
// var queryURL_1 = "https://openweathermap.org/api/geocoding-api"
// define the API query components for call deux
// var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
var API_Key = "4fdb63abdc22d25a9f11e91d3ffc862a"; // my API key
// Use London as start value 51.507359, -0.136439.
var lat = 51;
var lon = -0.14;
var searchArr = [];

// user click event
searchButton.click(function (event) {
    event.preventDefault();
    // remove existing weather data if a new search is triggered
    $(".five-day").remove();
    $(".today-box").remove();
    // rebuild today from history - with the buttons ?
    createSearchButtons(searchArr);
    // grab search input 
    searchBoxText = $("#search-input").val();
    // grab user search term or default to London
    if (searchBoxText) {
        
        getLatlon(searchBoxText);
        searchArr.push(searchBoxText);
        localStorage.setItem("searches", searchArr);

        //createSearchButtons(searchArr);//todo

        var userWeatherQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
        getLatlon(searchBoxText);
    }
    else
    {
        searchBoxText = "london";
        getLatlon(searchBoxText);
        // use London lat lon as default
        var userWeatherQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
        searchArr.push(searchBoxText);
    }
    // console.log(weatherPayLoad);
    $.getJSON(userWeatherQuery, function (json) {
        getLatlon(searchBoxText);
        unixTime = json.list[0].dt;//unix time stamp to convert
        var todayDate = convertUNIX(unixTime);
        // create a box for today weather 
        today.append(todayBox);
        //format location and date for today data
        todayBox.html(json.city.name + " " + todayDate);
        // add  icon from openweatherAPI
        var todayimageDiv = $("<img>");
        // use zero in the array as always first day
        var todayimageLink = "http://openweathermap.org/img/w/" + json.list[0].weather[0].icon + ".png";
        todayimageDiv.attr("src", todayimageLink);

        var todayTempEl = $("<div>");
        var todayWindEl = $("<div>");
        var todayHumEl = $("<div>");
        todayTempEl.text("Temp: " + (json.list[0].main.temp - 273.15).toFixed());
        todayWindEl.text("Wind: " + json.list[0].wind.speed + " KPH");
        todayHumEl.text("Humidity: " + json.list[0].main.humidity + " %");
        todayBox.append(todayimageDiv, todayTempEl, todayWindEl, todayHumEl);

        // creating weather element containers
        var fiveDayDiv = $("<div>").addClass("five-day");
        forecastEl.append(fiveDayDiv);


        for (let i = 0; i < json.list.length; i = i + 8) {
            // create a div for each day
            var dayDiv = $("<div>").addClass("dayDiv");
            // creating weather data
            var date = $("<div>");
            var icon = $("<img>");
            var wind = $("<div>");
            var temp = $("<div>");
            var humidity = $("<div>");
            datetext = convertUNIX((json.list[i].dt));
            date.text(datetext);
            var iconurl = "http://openweathermap.org/img/w/" + json.list[i].weather[0].icon + ".png";
            temp.text("Temp: " + (json.list[i].main.temp - 273.15).toFixed()) + "9\xB0" + "C";
            wind.text("Wind: " + json.list[i].wind.speed + " KPH");
            humidity.text("Humidity: " + json.list[i].main.humidity + " %");
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

function getLatlon(searchBoxText) {
    var latLonSearch = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchBoxText + "&limit=1&appid=" + API_Key;
    // need to handle failed search
    if (latLonSearch) {
        $.getJSON(latLonSearch, function (json) {
            lat = json[0].lat;
            lon = json[0].lon;
        })
    }
}

function createSearchButtons(searchArr) {
    var buttonbox = $("<ol>").addClass("button-box");
    historyEl.append(buttonbox);
    for (let i = 0; i < searchArr.length; i++) {
        var btn = $("<button>").text(searchArr[i]);
        buttonbox.append(btn);
    }
}