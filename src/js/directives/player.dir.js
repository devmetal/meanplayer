'use strict';

module.exports = function() {
  return {
    scope:{},
    restrict: 'E',
    templateUrl: 'player.html',
    link: function(scope, element, attr) {
      let url, song, audio = element.find("audio")[0];

      scope.playing = false;
      scope.paused = false;
      scope.started = false;

      scope.play = function() {
        if (scope.paused) {
          audio.play();
          scope.playing = true;
          scope.paused = false;
          return;
        }

        scope.playing = true;
        scope.started = true;
        audio.src = url;
        audio.play();
      };

      scope.pause = function() {
        audio.pause();
        scope.paused = true;
        scope.playing = false;
      };

      scope.stop = function() {
        if (scope.started) {
          audio.pause();
          audio.currentTime = 0;
          audio.src = "";
          scope.playing = false;
          scope.paused = false;
          scope.started = false;
        }
      };

      scope.$on('select', function(e, _song){
        if (song) {
          song.current = false;
        }
        song = _song;
        url = `/songs/play/${song._id}`;
        scope.stop();
        scope.play();
        song.current = true;
      });
    }
  }
};
