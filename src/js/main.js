'use strict';

let angular = require('angular');

require('ng-file-upload');

require('./controllers');
require('./services');
require('./directives');

let Player = angular.module('Player', [
  'ngFileUpload',
  'Player.Controllers',
  'Player.Directives',
  'Player.Services'
]);

window.Player = Player;
