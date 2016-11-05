function getWeather() {
  //var url = 'http://api.wunderground.com/api/' + apiKeys.wundergroundKey + '/forecast/lang:EN/q/autoip.json';
  var url = 'http://api.wunderground.com/api/4de3fe19b2ee5db3/forecast/lang:EN/q/autoip.json';
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(){
      var json = JSON.parse(xhr.responseText);
      console.log(json);
      processWeatherObject(json);
    });
    xhr.open('GET', url, true);
    xhr.send();
}

function processWeatherObject(obj) {
  var yourLocationRaw = obj.forecast.simpleforecast.forecastday[0].date.tz_long;
  var yourLocation = yourLocationRaw.replace(/\w+\//, '');
  var conditions = obj.forecast.simpleforecast.forecastday[0].conditions;
  conditions = conditions.toLowerCase();
  var topTemp = obj.forecast.simpleforecast.forecastday[0].high.celsius;
  var weatherString = "The weather in " + yourLocation + " today is " + conditions + " with a high of " + topTemp + ". Arrrr"
    console.log('processWeatherObject was called and the following weather string was built: ' + weatherString);
  getPirateObj(weatherString);
}

function getPirateObj(string) {
  var url = 'http://api.funtranslations.com/translate/pirate.json';
  var params = 'text=' + string;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(){
      if(xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        processPirateObj(json);
      }
      processPirateObj({contents:{translated:'Oh yar, there seems to be a problem, I\'ve got smoke coming out of my ears!'}})
    });
    xhr.open('POST', url, true);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}

function processPirateObj(obj) {
  var pirateString = obj.contents.translated;
  var domElement = document.getElementById('js_piratestring');
  domElement.innerHTML = pirateString;
}

getWeather();
