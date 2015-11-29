'use strict';

let angular = require('angular');

angular.module('Player.Controllers', [])
  .controller('SongsController', require('./songs.cnt'))
  .controller('PlayerController', reqiore('./player.cnt'));
