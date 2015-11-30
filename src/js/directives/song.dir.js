'use strict';

var SongController = function(scope) {
  this.song = scope.song;
};

SongController.prototype.getSong = function() {
  return this.song;
};

SongController.prototype.getUrl = function() {
  return `/songs/play/${this.song._id}`;
};

module.exports = function(){
  return {
    scope: {
      song: '=',
      delete: '&onDelete'
    },
    restrict: 'EA',
    templateUrl: 'song.html',
    controller: ['$scope', SongController]
  }
};
