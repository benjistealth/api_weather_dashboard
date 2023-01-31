
// Grab divs from html
todayBox = $("<div>").addClass("today-box");
today = $("#today");
searchButton = $(".search-button");
forecastEl = $("#forecast");
historyEl = $("#history");
var API_Key = "4fdb63abdc22d25a9f11e91d3ffc862a"; // my API key

// user click event
searchButton.click(function (event) {
    event.preventDefault();
    // remove existing weather data if a new search is triggered
    $(".five-day").remove();
    $(".today-box").remove();
    
    buildQuery();
    createSearchButtons();
    // wait for API call to complete before continue
    setTimeout(function () {
        console.log("waiting..... ");
      }, 800);
    var userWeatherQuery = localStorage.getItem("weatherQuery");
    console.log(userWeatherQuery);
    // }
    $.getJSON(userWeatherQuery, function (json) {
        unixTime = json.list[0].dt;//unix time stamp to convert
        var todayDate = convertUNIX(unixTime);
        // create a box for today weather 
        today.append(todayBox);        
        // use zero in the list array as today is always first day
        var todayimageDiv = $("<img>");
        var todayimageLink = "http://openweathermap.org/img/w/" + json.list[0].weather[0].icon + ".png";
        todayimageDiv.attr("src", todayimageLink);
        var todayDatePlace = $("<h2>");
        
        var todayTempEl = $("<div>");
        var todayWindEl = $("<div>");
        var todayHumEl = $("<div>");
        todayDatePlace.text(json.city.name + " " + todayDate);
        todayTempEl.text("Temp: " + (json.list[0].main.temp - 273.15).toFixed());
        todayWindEl.text("Wind: " + json.list[0].wind.speed + " KPH");
        todayHumEl.text("Humidity: " + json.list[0].main.humidity + " %");
        todayBox.append(todayDatePlace, todayimageDiv, todayTempEl, todayWindEl, todayHumEl);

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

function buildQuery() {
    searchText = recallSave();
    // alert("search_text: " + searchText);
    var latLonSearch = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchText + "&limit=1&appid=" + API_Key;
    // need to handle failed search ideally
        $.getJSON(latLonSearch, function (json) {
            var lat = json[0].lat;
            var lon = json[0].lon;
            console.log(lat + " " + lon);
            var weatherQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
            localStorage.setItem("weatherQuery", weatherQuery);
            console.log(weatherQuery);
        })
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
        // alert("recalled: " + buttonArr);
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
        if (JSON.parse(localStorage.getItem("searches")) == null) {
            var searchArr = [searchBoxText];
            localStorage.setItem("searches", JSON.stringify(searchArr));
            // searchBoxText = "london";
            // alert("recalledArr: " + recalledArr);
        }
        else {
            // if search text exists and storage exists - add to existing storage
            var recalledArr = JSON.parse(localStorage.getItem("searches"));
            recalledArr.push(searchBoxText);
            // alert("recallsave array to store" + recalledArr);
            localStorage.setItem("searches", JSON.stringify(recalledArr));
            // alert("recalledArr: " + recalledArr);
            // set searchbox text to last item
            searchBoxText = recalledArr[(recalledArr.length - 1)];
            return searchBoxText;
        }
    }
    searchBoxText = "london";
    return searchBoxText;

}
