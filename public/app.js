// This request gets the user's ip address and builds the URl for the geolocation request
(function buildURL() {
  console.log('buildURL was called');
  var xhr = new XMLHttpRequest();
  var url = "http://ipinfo.io/json";
  xhr.addEventListener('load', function() {
    if(xhr.status === 200) {
      var data = {};
      var json = JSON.parse(xhr.responseText);
      data.location = json.ip;
      var compoundURL = `http://freegeoip.net/json/?q=${data.location}`;
      getUserLocation(compoundURL);
    }
  });
  xhr.open('GET', url, true);
  xhr.send();
})();

// This request takes the ip and requests the location data
function getUserLocation(url) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function() {
    if(xhr.status === 200) {
      var data = {};
      var json = JSON.parse(xhr.responseText);
      data.city = json.city;
      data.country = json.country_code;
      sendDataToServer(data.city, data.country);
    } else console.log("Nope");
  });
  xhr.open('GET', url, true);
  xhr.send();
}

// This function takes the city and country and passes them to the server
// This particular instance uses jquery just to sanity check the XMLHttpRequest below
function sendDataToServer (city, country) {
  var data = {'city':city,'country':country};
   $.ajax({
     url: '/location',
     type: 'POST',
     contentType:'application/json',
     data: JSON.stringify(data),
     dataType:'json'
   });
}
//
// function sendDataToServer(city, country) {
// var xhr = new XMLHttpRequest();
// var url = `/location?city=${city}&country=${country}`;
// xhr.open('GET', url, true);
// xhr.send();
// }
