'use strict';

var fs = require('fs');
var koa = require('koa');
var mongoose = require('mongoose');
var passport = require('koa-passport');

var config = require('./config/config');

mongoose.connect(config.mongo.url);
mongoose.connection.on('error', function (err) {
  console.log(err);
});

var models_path = config.app.root + '/src/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('js')) {
    require(models_path + '/' + file);
  }
});

var app = module.exports = koa();

require('./config/passport')(passport, config);

require('./config/koa')(app, config, passport);

require('./config/routes')(app, passport);

if (!module.parent) {
  app.listen(config.app.port);
  console.log('Server started, listening on port: ' + config.app.port);
}
console.log('Environment: ' + config.app.env);
