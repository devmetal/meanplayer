'use strict';

let angular = require('angular');

angular.module('Player.Controllers', [])
  .controller('SongsController', require('./songs.cnt'));
