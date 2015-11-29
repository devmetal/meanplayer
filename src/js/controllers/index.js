'use strict';

let angular = require('angular');

angular.module('Player.Controllers', [])
  .controller('UploadController', require('./upload.cnt'))
  .controller('SongsController', require('./songs.cnt'));
