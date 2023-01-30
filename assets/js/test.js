


searchButton = $(".search-button");

forecastEl = $("#forecast");

var API_Key = "4fdb63abdc22d25a9f11e91d3ffc862a";
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + "london" + "&APPID=" + API_Key;

searchButton.on("click", "button", function (event) {
    event.preventDefault();
    searchBoxText = $("#search-input").val();

    // use that to make an AJAX call
    $.ajax({
      url: queryURL,
      dataType: "json",
      method: "GET",
      data: reponse,
    }).then(response, decodeResponse);

    function decodeResponse(response) {
     alert(response);
        var Div = $("<div>");
        console.log(reponse.main.temp);
        Div.text(reponse.main.temp + "forecast element");
        forecastEl.append(Div);
  }
})