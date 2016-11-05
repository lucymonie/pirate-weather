var loading = document.querySelector(".loading");
var content = document.querySelector(".content");
var invite = document.querySelector(".invite");
var userClick = document.getElementById('getMyWeather');

userClick.addEventListener('click', function() {
  getWeather();
});

//Gets the weather from wunderground API by user IP
function getWeather() {
    var url = 'http://api.wunderground.com/api/' + apiKeys.wundergroundKey + '/forecast/lang:EN/q/autoip.json';
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(){
      if(xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        processWeatherObject(json);
      } else { ohCrap(); }
    });
    xhr.open('GET', url, true);
    xhr.send();
    //calls showLoading to hide the text box while content is fetched, and show the fa spinner instead
    showLoading();
}

//on recieipt of the object from wunderground, it gets passed to this function
function processWeatherObject(obj) {
  var yourLocationRaw = obj.forecast.simpleforecast.forecastday[0].date.tz_long;
  var yourLocation = yourLocationRaw.replace(/\w+\//, '');
  var conditions = obj.forecast.simpleforecast.forecastday[0].conditions;
  conditions = conditions.toLowerCase();
  var topTemp = obj.forecast.simpleforecast.forecastday[0].high.celsius;
  var weatherString = "The weather in " + yourLocation + " today is " + conditions + " with a high of " + topTemp
    console.log('processWeatherObject was called and the following weather string was built: ' + weatherString);
  //call to get the pirate translation using the string generated in this function
  getPirateObj(weatherString);
}

//Gets the pirate translation from funtranslations API
function getPirateObj(string) {
  var url = 'http://api.funtranslations.com/translate/pirate.json';
  var params = 'text=' + string;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(){
      if(xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        processPirateObj(json);
      } else { ohCrap(); }
      onRequestComplete();
    });
    xhr.open('POST', url, true);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}

//If a pirate translated object comes back, it will be passed to this function to process into a string
function processPirateObj(obj) {
  var pirateString = obj.contents.translated;
  pirateString = pirateString[0].toUpperCase() + pirateString.slice(1);
  displayOnScreen(pirateString);
}

//Collection of helper functions to hide and show the spinner while content is loading
  function show (selector) {
    selector.style.display = 'block';
  }

  function hide (selector) {
    selector.style.display = 'none';
  }

  function showLoading() {
    hide(invite);
    show(loading);
    hide(content);
  }

  function onRequestComplete () {
    show(content);
    hide(loading);
  }
//End of helper functions for loading wheel

function displayOnScreen(string) {
  console.log('The string passed into displayOnScreen was: ' + string)
  var domElement = document.getElementById('js_piratestring');
  domElement.innerHTML = string;
}

//If there's an error, this will generate a random pirate error message
function ohCrap() {
  var randArr = ['Oh yar, there seems to be a problem. Yer be wantin\' the weather?',
                  'Ding dang the nilly I\'ve ponged my snozzle. No weather for yar',
                  'We\'ve rammed the server, arr! Something is wrong in the back end',
                  'Listen up my hearties, I\'ve a snipe in my bucket and a toad in the road',
                  'Smokin\' a pancake in a storm. Tis that dang server flipping us t\'bird',
                  'Flick a pike in your twinkles, we seem to have a problem with the server'
                ];
  var rand = Math.floor(Math.random() * randArr.length);
  var errorMess = randArr[rand];
  console.log('An error message was generated: ' + errorMess)
  displayOnScreen(errorMess);
}
