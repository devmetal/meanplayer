'use strict';

let gulp = require('gulp');

gulp.task('default', ['serve'], function(){
  gulp.watch('./src/js/**/*.js', ['browserify']);
  gulp.watch('./src/**/*.html', ['views']);
  gulp.watch('./public/**/*.less', ['less']);
});
