'use strict';

let angular = require('angular');

function Drawer(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
}

Drawer.prototype.setWidth = function(w) {
  this.context.canvas.width  = w;
}

Drawer.prototype.setHeight = function(h) {
  this.context.canvas.height = h;
}

Drawer.prototype.draw = function(freq) {
  let w = this.context.canvas.width;
  let h = this.context.canvas.height;

  context.clearRect(0, 0, w, h);
  context.fillStyle = '#00585F';

  barWidth = w / 64;

  for (i = 0; i<freq.length; i+=2) {
    var val = freq[i] * 0.15;
    context.fillRect(i * barWidth, h - val, barWidth, val);
  }
}

Drawer.prototype.clear = function() {
  context.clearRect(0, 0, w, h);
}

var visualizer = function($window) {
  return {
    scope:{},
    require: '^player',
    restrict: 'E',
    template: "<canvas></canvas>",
    link: function(scope, element, attrs, player) {
      let parent = element.parent()[0],
          canvas = element.find('canvas')[0]
          audioContext = new AudioContext(),
          drawer = new Drawer(canvas),
          w = angular.element($window),
          audioSrc = null,
          analyzer = null,
          animation = null,

      player.setVisualizer(scope);

      drawer.setHeight(40);
      drawer.setWidth(parent.offsetWidth);

      scope.$watch(() => w.width(), () => {
        drawer.setWidth(parent.offsetWidth);
      });

      scope.resetVisualizer = function() {
        cancelAnimationFrame(animation);
        if (audioSrc) audioSrc.disconnect();
        audioSrc = null;
        drawer.clear();
      };

      scope.startVisualize = function(audio) {
        analyzer = (analyzer || audioContext.createAnalyser());
        analyser.smoothingTimeConstant = 0.8;
        analyzer.fftSize = 128;
        audioSrc = audioContext.createMediaElementSource(audio);
        audioSrc.connect(analyzer);
        audioSrc.connect(audioContext.destination);
        draw();
      };

      function draw() {
        var freq = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freq);
        animation = requestAnimationFrame(draw);
        drawer.draw(freq);
      }
    }
  }
}

module.exports = ['$window', visualizer];
