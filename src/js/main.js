'use strict';

let angular = require('angular');

let Player = angular.module('Player', []);

Player.controller('HelloWorld', function($scope){
  $scope.name = "Metál Ádám";
});

Window.Player = Player;
