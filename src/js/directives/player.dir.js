'use strict';

module.exports = function() {
  return {
    scope:{},
    require: '^song',
    restrict: 'E',
    templateUrl: 'player.html',
    link: function(scope, element, attr, songCt) {
      let url = songCt.getUrl(),
        song = songCt.getSong(),
        audio = element.find("audio")[0];

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

        song.current = true;
        scope.$emit('play');
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
          song.current = false;
          audio.pause();
          audio.currentTime = 0;
          audio.src = "";
          scope.playing = false;
          scope.paused = false;
          scope.started = false;
        }
      };

      scope.$on('stopAll', function(e, from){
        if (from !== scope) {
          scope.stop();
        }
      });
    }
  }
};
