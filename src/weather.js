const request = require('request');
const env = require('env2')('./config.env');

const weather = {};

weather.ip = (ip, callback) => {
  var url = `http://freegeoip.net/json/?q=${ip}`;
  request(url, (err, response, body) => {
    if(err || response.statusCode !== 200) {
      callback({weather: "Oh yar, there seems to be a problem. Yer be wantin\' t'weather?"});
    } else {
      let data = JSON.parse(body);
      let location = {};
      location.city = data.city;
      location.country = data.country_code;
      weather.get(location, callback);
    }
  });
}

weather.get = (location, callback) => {
  var url = `http://api.wunderground.com/api/${process.env.WEATHER_KEY}/forecast/lang:EN/q/${location.country}/${location.city}.json`;
  request(url, (err, response, body) => {
    if (err || response.statusCode !== 200) {
      console.log("Had a problem getting the weather from wunderground");
      callback({weather:"We\'ve rammed the server, arr! Something is wrong in the back end"});
    } else {
      let data = JSON.parse(body);
      if(!data.forecast.simpleforecast.forecastday[0].conditions) {
        callback({weather: "Listen up my hearties, I\'ve a snipe in my bucket and a toad in the road"});
      } else {
        weather.process(data, callback);
      }
    }
  })
}

weather.process = (data, callback) => {
  var yourLocationRaw = data.forecast.simpleforecast.forecastday[0].date.tz_long;
  var yourLocation = yourLocationRaw.replace(/\w+\//, '');
  var conditions = data.forecast.simpleforecast.forecastday[0].conditions;
  conditions = conditions.toLowerCase();
  var topTemp = data.forecast.simpleforecast.forecastday[0].high.celsius;
  let weatherString = `The weather in ${yourLocation} today is ${conditions} with a high of ${topTemp}`;
  let context = {}
  context.weather = weatherString;
  weather.translate(context, callback);
}

weather.translate = (context, callback) => {
  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     'http://api.funtranslations.com/translate/pirate.json',
    body:    'text=' + context.weather
  }, function(err, response, body) {
    if(err || response.statusCode !== 200) {
      callback({weather: "That dang server flipt us t\'bird. Try back again in an hour m'hearties"});
    } else {
      let data = JSON.parse(body);
      let str = data.contents.translated;
      let capStr = str.slice(0,1).toUpperCase().concat(str.slice(1));
      let context = {};
      context.weather = capStr;
      callback(context);
    }
  });
}

module.exports = weather;
