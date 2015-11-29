'use strict';

let angular = require('angular');

angular.module('Player.Services', [])
  .service('PlayerService', require('./player.srv'));
