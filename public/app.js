var data = {};

// This request gets the user's ip address and builds the URl for the geolocation request
(function buildURL() {
  console.log('buildURL was called');
  var xhr = new XMLHttpRequest();
  var url = "http://ipinfo.io/json";
  xhr.addEventListener('load', function() {
    if(xhr.status === 200) {
      var json = JSON.parse(xhr.responseText);
      data.location = json.ip;
      var compoundURL = `http://freegeoip.net/json/?q=${data.location}`;
      getUserLocation(compoundURL);
    }
  });
  xhr.open('GET', url, false);
  xhr.send();
})();

// This request takes the ip and requests the location data
function getUserLocation(url) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function() {
    if(xhr.status === 200) {
      var json = JSON.parse(xhr.responseText);
      data.city = json.city;
      data.country = json.country_code;
      console.log("Location data: ", data.city, data.country);
      sendDataToServer(data.city, data.country);
    } else console.log("Nope");
  });
  xhr.open('GET', url, true);
  xhr.send();
}

//Send the data to the server to perform the weather API call from the back end
function sendDataToServer(city, country) {
  console.log('sendDataToServer was called');
  var xhr = new XMLHttpRequest();
  var url = `/location?city=${city}&country=${country}`;
  console.log('Url is: ', url);
  xhr.addEventListener('load', function () {
    if (xhr.status !== 200) {
      console.log('Oops, something went wrong. Please try again later');
    }
  });
  xhr.open('GET', url, true);
  xhr.send();
}
