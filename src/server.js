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
    layout: 'default'
  });

  server.route([
  {
    path: '/',
    method: 'GET',
    handler: (req, reply) => {
      reply.view('index', {initial: 'Getting your weather... arr'});
    }
  },
  {
    path: '/location',
    method: 'POST',
    handler: (req, reply) => {
      let location = {
        city: req.payload.city,
        country: req.payload.country
      };

      console.log('Location object: ', location);
      reply.view('weather', location);
    }
  },
  {
    path:'/weather',
    method: 'GET',
    handler: (req, reply) => {
      console.log('Request.query is: ', req.query);
      let location = {
        city: req.query.city,
        country: req.query.country
      }

      let callback = function(context) {
        console.log('received context in callback, and it is: ', context);
        let content = {};
        content.weather = context.weather;
        reply.view(`weather`, content);
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
    path:'/{file*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  })
});

module.exports = server;
