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

      scope.play = function() {
        if (scope.playing) {
          return scope.resume();
        }

        scope.$emit('play', song);
        scope.playing = true;
        audio.src = url;
        audio.play();
      };

      scope.pause = function() {
        audio.pause();
      };

      scope.resume = function() {
        audio.play();
      };

      scope.stop = function() {
        if (scope.playing) {
          audio.pause();
          audio.currentTime = 0;
          audio.src = "";
          scope.playing = false;
        }
      };

      scope.$on('stopAll', function(e, from){
        if (from !== scope) {
          scope.stop();
        }
      });

      scope.$on('$destroy', function() {
        if (audio) audio.remove();
      });
    }
  }
};
