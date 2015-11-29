'use strict';

let angular = require('angular');

angular.module('Player')
.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/songs');

  $stateProvider
    .state('songs', {
      url: '/songs',
      templateUrl: 'songs.html',
      controller: 'SongsController'
    })
    .state('upload', {
      url: '/upload',
      templateUrl: 'upload.html',
      controller: 'UploadController'
    });
}]);
