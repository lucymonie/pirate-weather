const request = require('request');
const env = require('env2')('./config.env');

module.exports.get = (location, callback) => {
  console.log('Weather.get function was called, location is: ', location);
  var url = `http://api.wunderground.com/api/4de3fe19b2ee5db3/forecast/lang:EN/q/${location.country}/${location.city}.json`;
  console.log('Url built for wunderground is: ', url);
  request(url, (err, response, body) => {
    if (err || response.statusCode !== 200) {
      console.log("Had a problem getting the weather from wunderground");
      callback({weather:"We\'ve rammed the server, arr! Something is wrong in the back end"});
    } else {
      let data = JSON.parse(body);
      if(!data.forecast.simpleforecast.forecastday[0].conditions) {
        callback({weather: "Listen up my hearties, I\'ve a snipe in my bucket and a toad in the road"});
      } else {
        console.log('The weather that\'s come back is: ', data);
        let weatherObj = process(data);
        console.log('Weather object, processed, is: ', weatherObj);
        callback(weatherObj);
      }
    }
  })
}

let process = (data) => {
  console.log('Weather process was called');
  var yourLocationRaw = data.forecast.simpleforecast.forecastday[0].date.tz_long;
  var yourLocation = yourLocationRaw.replace(/\w+\//, '');
  console.log('According to Wundergournd, your location is: ', yourLocation);
  var conditions = data.forecast.simpleforecast.forecastday[0].conditions;
  conditions = conditions.toLowerCase();
  console.log('Conditions in your location are: ', conditions);
  var topTemp = data.forecast.simpleforecast.forecastday[0].high.celsius;
  let weatherString = `The weather in ${yourLocation} today is ${conditions} with a high of ${topTemp}`;
  let context = {}
  context.weather = weatherString;
  return context;
}

module.exports.translate = (context, callback) => {
  console.log('weather string passed to translator: ', context.weather);
  let weather = encodeURI(context.weather);
  console.log('Encoded weather string: ', weather);
  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     'http://api.funtranslations.com/translate/pirate.json?',
    body:    'text=' + weather
  }, function(err, response, body) {
    if(err || response.statusCode !== 200) {
      console.log(callback);
      callback({weather: "That dang server flipt us t\'bird. Try back again in an hour m'hearties"});
    } else {
      console.log('Translation success');
      let data = JSON.parse(body);
      console.log('Raw data from pirate speak api is: ', data);
      let str = data.contents.translated;
      let capStr = str.slice(0,1).toUpperCase().concat(str.slice(1));
      let context = {};
      context.weather = capStr;
      return context;
    }
  });
}
