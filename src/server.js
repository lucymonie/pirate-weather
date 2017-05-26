const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const Handlebars = require('handlebars');
const request = require("request");
const weather = require("./weather");

const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 8080
});

server.register(Vision, (err) => {
  if (err) throw err;

  server.views({
    engines: {
      html: Handlebars
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'default',
  });

  server.route([
    {
    path: '/',
    method: 'GET',
    handler: (req, reply) => {
      reply.view('index', { weather: 'Getting your weather, arr'});
    }
  },
  {
    path: '/location',
    method: 'GET',
    handler: (req, reply) => {
      let location = {
        city: req.query.city,
        country: req.query.country
      };

      let callback = function(context) {
        console.log('receied context in callback, and it is: ', context);
        return reply.view('weather', context);
      }

      weather.get(location, callback);

    }
  }
  ]);
});

server.register(Inert, (err) => {
  if (err) throw err;

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  })
});

module.exports = server;
