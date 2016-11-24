var location_from_IP, getWeatherData, forecastDays, dailyTempsLow, dailyTempsHigh, forecastIcons,updateUI, onSwitchClick, setIcons;

location_from_IP = function() {
  $.get('http://ip-api.com/json', function(locationData) {
    $('#city').html(locationData.city);
    getWeatherData(locationData.lat, locationData.lon);
  });
};
getWeatherData = function(lat, lon) {
  var dark_sky_API, daysOfWeek, tempsHigh, tempsLow;
  dark_sky_API = 'https://api.darksky.net/forecast/' +
    '7dc8837ee8fffb4dd1848760bdbb98ab/' +
    lat + ',' + lon + '?callback=?';
  $.getJSON(dark_sky_API, function(weatherData) {
    setIcons(weatherData);
    daysOfWeek = forecastDays(weatherData);
    tempsHigh = dailyTempsHigh(weatherData);
    tempsLow = dailyTempsLow(weatherData);
    updateUI(weatherData, daysOfWeek, tempsHigh, tempsLow);
  });
};
forecastDays = function(data) {
  var dayMap = {
    0: "sun.",
    1: "mon.",
    2: "tue.",
    3: "wed.",
    4: "thur.",
    5: "fri.",
    6: "sat."
  };
  var dayOfWeekArr = [1, 2, 3].map(function(val) {
    var dateVal = data.daily.data[val].time;
    var newDate = new Date(dateVal * 1000);
    var newDate1 = newDate.getDay();
    return dayMap[newDate1];
  });
  return dayOfWeekArr;
};
dailyTempsLow = function(data) {
  var tempLowArr = [1, 2, 3].map(function(val) {
    return data.daily.data[val].temperatureMin;
  });
  return tempLowArr;
};
dailyTempsHigh = function(data) {
  var tempHighArr = [1, 2, 3].map(function(val) {
    return data.daily.data[val].temperatureMax;
  });
  return tempHighArr;
};
forecastIcons = function(data) {
  var iconArr = [1, 2, 3].map(function(val) {
    return data.daily.data[val].icon;
  });
  return iconArr;
};
updateUI = function(data, daysOfWeek, highTemps, lowTemps) {
  var tempNow = Math.round(data.currently.temperature);
  var summary = data.currently.summary;
  var setDay1 = Math.round(lowTemps[0]) + "/" + Math.round(highTemps[0]) + "&deg";
  var setDay2 = Math.round(lowTemps[1]) + "/" + Math.round(highTemps[1]) + "&deg";
  var setDay3 = Math.round(lowTemps[2]) + "/" + Math.round(highTemps[2]) + "&deg";
  $("#currentTempUI").html(tempNow + "&deg");
  $("#currentDescription").html(summary);
  $("#day1").html(daysOfWeek[0]);
  $("#day2").html(daysOfWeek[1]);
  $("#day3").html(daysOfWeek[2]);
  $("#dailyTemps1").html(setDay1);
  $("#dailyTemps2").html(setDay2);
  $("#dailyTemps3").html(setDay3);
  var toCelsius = function(num) {
    return Math.round((num - 32) * (5 / 9));
  };
  var setDay1Celsius = toCelsius(lowTemps[0]) + "/" + toCelsius(highTemps[0]) + "&deg";
  var setDay2Celsius = toCelsius(lowTemps[1]) + "/" + toCelsius(highTemps[1]) + "&deg";
  var setDay3Celsius = toCelsius(lowTemps[2]) + "/" + toCelsius(highTemps[2]) + "&deg";

  onSwitchClick = function(slide) {
    if (slide.classList.contains('off')) {
      $("#currentTempUI").html(tempNow + "&deg");
      $("#dailyTemps1").html(setDay1);
      $("#dailyTemps2").html(setDay2);
      $("#dailyTemps3").html(setDay3);
      slide.classList.remove('off');
    } else {
      slide.classList.add('off');
      $("#currentTempUI").html(toCelsius(tempNow) + "&deg");
      $("#dailyTemps1").html(setDay1Celsius);
      $("#dailyTemps2").html(setDay2Celsius);
      $("#dailyTemps3").html(setDay3Celsius);
    }
  };
};

setIcons = function(data) {
  var iconNow = data.currently.icon;
  var iconArray = forecastIcons(data);
  skycons = new Skycons({
    "color": "#565656"
  });
  skycons.play();
  skycons.set("weatherIcon", iconNow);
  skycons.set("icon1", iconArray[0]);
  skycons.set("icon2", iconArray[1]);
  skycons.set("icon3", iconArray[2]);
};
$(document).ready(function() {
  location_from_IP();
});