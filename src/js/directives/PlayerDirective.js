angular.module('album.directives')
  .directive('player', function(){

    var PlayerController = function(scope) {
      this.playCallback = null;
      this.pauseCallback = null;
      this.stopCallback = null;
    };

    PlayerController.prototype.onPlay = function(cb) {
      if (cb) {
        this.playCallback = cb;
      } else if (angular.isFunction(this.playCallback)) {
        this.playCallback.apply(null);
      }
    };

    PlayerController.prototype.onPause = function(cb) {
      if (cb) {
        this.pauseCallback = cb;
      } else if (angular.isFunction(this.pauseCallback)) {
        this.pauseCallback.apply(null);
      }
    };

    PlayerController.prototype.onStop = function(cb) {
      if (cb) {
        this.stopCallback = cb;
      } else if (angular.isFunction(this.stopCallback)) {
        this.stopCallback.apply(null);
      }
    };

    return {
      scope:{},
      require: ['^song', 'player'],
      restrict: 'E',
      templateUrl: '/public/templates/player.html',
      controller: ['$scope', PlayerController],
      link: function(scope, element, attr, controllers) {
        var songController = controllers[0];
        var playerController = controllers[1];
        var audio = element.find('audio')[0];

        scope.song = songController.getSong();

        scope.play = function() {
          audio.play();
          playerController.onPlay();
          scope.$emit('play', scope.song);
        };

        scope.pause = function() {
          audio.pause();
          playerController.onPause();
        };

        scope.stop = function() {
          audio.pause();
          audio.currentTime = 0;
          playerController.onStop();
        };

        scope.$on('stopAll', function(e, from){
          if (from !== scope) {
            scope.stop();
          }
        });
      }
    }
  });
