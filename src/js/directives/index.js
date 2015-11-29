'use strict';

let angular = require('angular');

angular.module('Player.Directives', [])
  .directive('song', require('./song.dir'))
  .directive('player', require('./player.dir'))
  .directive('visualizer', require('./visualizer.dir'));
