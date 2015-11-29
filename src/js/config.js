'use strict';

let angular = require('angular');

angular.module('Player')
.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/player');

  $stateProvider
    .state('player', {
      url: '/player',
      templateUrl: 'player.html',
      controller: 'PlayerController as pc'
    })
    .state('upload', {
      url: '/upload',
      templateUrl: 'upload.html',
      controller: 'UploadController'
    });
}]);
