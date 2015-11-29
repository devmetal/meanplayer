module.exports = function() {
  return {
    scope:{},
    require: '^player',
    restrict: 'E',
    template: "<canvas></canvas>",
    link: function(scope, element, attrs, player) {
      var parent = element.parent();
      var audio = parent.find('audio')[0];
      var canvas = element.find('canvas')[0];
      var context = canvas.getContext("2d");
      var audioContext = null;
      var audioSrc = null;
      var analyzer = null;
      var analyzerStream = null;
      var freq = new Uint8Array(128);

      player.onPlay(function(){
        if (audioSrc !== null) {
          analyzerStream = setInterval(function(){
            analyzer.getByteFrequencyData(freq);
          },20);
          return;
        }

        audioContext = new AudioContext();
        audioSrc = audioContext.createMediaElementSource(audio);
        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;
        audioSrc.connect(analyzer);
        audioSrc.connect(audioContext.destination);

        analyzerStream = setInterval(function(){
          analyzer.getByteFrequencyData(freq);
        },20);
      });

      player.onStop(function(){
        clearInterval(analyzerStream);
        freq = new Uint8Array(128);
      });

      player.onPause(function(){
        clearInterval(analyzerStream);
      });

      function draw() {
        context.canvas.width  = parent[0].offsetWidth;
        context.canvas.height = 40;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = '#00585F';

        barWidth = context.canvas.width / 64;

        for (i = 0; i<freq.length; i+=2) {
          var val = (freq[i] + 5) * 0.15;
          context.fillRect(i * barWidth, context.canvas.height - val, barWidth, val);
        }
        requestAnimationFrame(draw);
      }

      draw();
    }
  }
};
