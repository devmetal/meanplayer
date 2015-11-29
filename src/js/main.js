'use strict';

let angular = require('angular');

require('ng-file-upload');
require('angular-ui-router');

require('./controllers');
require('./services');
require('./directives');
require('./templates');

let Player = angular.module('Player', [
  'ui.router',
  'ngFileUpload',
  'templates',
  'Player.Controllers',
  'Player.Directives',
  'Player.Services'
]);

require('./config');

window.Player = Player;
