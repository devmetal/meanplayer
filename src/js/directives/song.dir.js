module.exports = function(){
  var SongController = function(scope) {
    this.song = scope.song;
  }

  SongController.prototype.getSong = function() {
    return this.song;
  }

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
