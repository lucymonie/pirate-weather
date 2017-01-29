const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const Handlebars = require('handlebars');
const request = require("request");
const weather = require("./weather");
const env = require('env2')('./config.env');

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

  server.route({
    path: '/',
    method: 'GET',
    handler: (req, reply) => {
      let context = {};
      let remoteIp = req.info.remoteAddress;

      function buildView (context) {
        context.default = "Flick a pike in your twinkles, we seem to have a problem with the server";
        reply.view('index', context);
      }

      weather.ip(remoteIp, buildView);
    }
   });
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
