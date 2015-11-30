'use strict';

var PlayerController = function() {
  this.visualizer = null;
};

PlayerController.prototype.setVisualizer = function(vs) {
  this.visualizer = vs;
};

PlayerController.prototype.startVisualize = function(audio) {
  if (this.visualizer) {
    this.visualizer.startVisualize(audio);
  }
};

PlayerController.prototype.resetVisualizer = function() {
  if (this.visualizer) {
    this.visualizer.resetVisualizer();
  }
}

module.exports = function() {
  return {
    scope:{},
    require: ['^song', 'player'],
    restrict: 'E',
    templateUrl: 'player.html',
    controller: ['$scope', PlayerController],
    link: function(scope, element, attr, controllers) {
      let songController = controllers[0],
          url = songController.getUrl(),
          player = controllers[1];
          audio;

      scope.play = function() {
        if (audio) audio.remove();
        player.resetVisualizer();

        audio = new Audio();
        audio.src = url;
        audio.oncanplay = function() {
          scope.$emit('play', song);
          player.startVisualize(audio);
          audio.play();
        };
      };

      scope.pause = function() {
        audio.pause();
      };

      scope.stop = function() {
        this.audio.pause();
        this.audio.currentTime = 0;
        player.resetVisualizer();
      };

      scope.$on('stopAll', function(e, from){
        if (from !== scope) {
          scope.stop();
        }
      });

      scope.$on('$destroy', function() {
        if (audio) audio.remove();
        player.resetVisualizer();
      });
    }
  }
};
