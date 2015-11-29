'use strict';

let angular = require('angular');

angular.module('Player.Controllers', [])
  .controller('UploadController', require('./upload.cnt'))
  .controller('PlayerController', require('./player.cnt'));
