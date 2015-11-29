angular.module('album.directives')
  .directive('song', function(){

    var SongController = function(scope) {
      this.song = scope.song;
    }

    SongController.prototype.getSong = function() {
      return this.song;
    }

    return {
      scope: {
        song:'='
      },
      restrict: 'EA',
      templateUrl: '/public/templates/song.html',
      controller: ['$scope', SongController]
    }
  });
