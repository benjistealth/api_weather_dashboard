
// Grab divs from html
var today = $("#today");
var searchButton = $(".search-button");
var forecastEl = $("#forecast");
var historyEl = $("#history");
var API_Key = "4fdb63abdc22d25a9f11e91d3ffc862a"; // my API key

// user click event - history button
historyEl.on("click", "button", function (event) {
    var buttonText = $(this).text();
    $("#search-input").val(buttonText);
    searchButton.trigger("click");
});

// user click event - search button
searchButton.click(function (event) {
    event.preventDefault();
    // remove existing weather data if a new search is triggered
    $(".five-day").remove();
    $(".today-box").remove();
    $(".today-date").remove();
    buildQuery();
    createSearchButtons();
    function buildQuery() {
        searchText = recallSave();
        var latLonSearch = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchText + "&limit=1&appid=" + API_Key;
        $.getJSON(latLonSearch, parseLocation);
    }

    function parseLocation(json) {
        var lat = json[0].lat;
        var lon = json[0].lon;
        // need to handle failed search ideally
        var weatherQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
        $.getJSON(weatherQuery, parseWeather);
        localStorage.setItem("weatherQuery", weatherQuery);
    }

    var parseWeather = function (json) {
        unixTime = json.list[0].dt;//unix time stamp to convert
        var todayDate = convertUNIX(unixTime);
        var todayBox = $("<div>").addClass("today-box");
        // create a box for today weather 
        today.append(todayBox);
        // use zero in the list array as today is always first day
        var todayimageDiv = $("<img>");
        var todayimageLink = "https://openweathermap.org/img/w/" + json.list[0].weather[0].icon + ".png";
        todayimageDiv.attr("src", todayimageLink).addClass("today-icon");
        var todayDatePlace = $("<h2>").addClass("today-date");
        var todayTempEl = $("<div>");
        var todayWindEl = $("<div>");
        var todayHumEl = $("<div>");
        todayDatePlace.text(json.city.name + " " + todayDate + "  ");
        todayTempEl.text("Temp: " + (json.list[0].main.temp - 273.15).toFixed());
        todayWindEl.text("Wind: " + json.list[0].wind.speed + " KPH");
        todayHumEl.text("Humidity: " + json.list[0].main.humidity + " %");
        today.append(todayDatePlace);
        todayDatePlace.append(todayimageDiv);
        todayBox.append(todayTempEl, todayWindEl, todayHumEl);

        // creating weather element containers
        var fiveDayDiv = $("<div>").addClass("five-day");
        forecastEl.append(fiveDayDiv);

        // add 8 each time so that we get one result from each of the 5 days
        for (let i = 0; i < json.list.length; i = i + 8) {
            // create a div for each day
            var dayDiv = $("<div>").addClass("day");
            // creating weather data
            var date = $("<div>");
            var icon = $("<img>");
            var wind = $("<div>");
            var temp = $("<div>");
            var humidity = $("<div>");
            datetext = convertUNIX((json.list[i].dt));
            date.text(datetext);
            var iconurl = "https://openweathermap.org/img/w/" + json.list[i].weather[0].icon + ".png";
            temp.text("Temp: " + (json.list[i].main.temp - 273.15).toFixed()) + "9\xB0" + "C";
            wind.text("Wind: " + json.list[i].wind.speed + " KPH");
            humidity.text("Humidity: " + json.list[i].main.humidity + " %");
            icon.attr("src", iconurl);

            // Adding elements to page        
            fiveDayDiv.append(dayDiv);
            dayDiv.append(date, icon, temp, wind, humidity);
        }
    };
})

function convertUNIX(unixTime) {
    const date = moment.unix(unixTime).format("DD/MM/YYYY");
    return date;
}

function createSearchButtons() {
    // if there is storage, build buttons from it
    if (JSON.parse(localStorage.getItem("searches"))) {
        var buttonArr = JSON.parse(localStorage.getItem("searches"));
        // remove any existing buttons before rebuilding them
        $(".button-box").remove();
        // create a div to store buttons so that they can be removed easily
        var buttonbox = $("<div>").addClass("button-box");
        historyEl.append(buttonbox);
        for (let i = 0; i < buttonArr.length; i++) {
            var btn = $("<button>").text(buttonArr[i]).addClass("btn button btn-secondary");
            buttonbox.append(btn);
        }
    }
    else {
        return;
    }
}

function recallSave() {
    // grab searchbox text
    searchBoxText = $("#search-input").val();
    // check something is present
    if (searchBoxText) {
        // if searchbox text exists but storage doesnt, create storage
        if (localStorage.getItem("searches") == null) {
            var searchArr = [searchBoxText];
            localStorage.setItem("searches", JSON.stringify(searchArr));
            return searchBoxText;
        }
        else {

            // if search text exists and storage exists - add to existing storage
            var recalledArr = JSON.parse(localStorage.getItem("searches"));
            // stop duplicate search from adding to storage array
            console.log(recalledArr);
            if( $.inArray(searchBoxText, recalledArr) > -1) { return searchBoxText;}
            recalledArr.push(searchBoxText);
            localStorage.setItem("searches", JSON.stringify(recalledArr));
            console.log(recalledArr);
            // // set searchbox text to last item
            searchBoxText = recalledArr[(recalledArr.length - 1)]; // probably going to be the same thing anyway
            return searchBoxText;
        }
    }
    // searchbox was empty so return "london"
    return "london";
}
