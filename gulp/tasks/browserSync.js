'use strict';

let gulp        = require('gulp');
let browserSync = require('browser-sync');

gulp.task('browserSync', function(){
  browserSync.init({
    proxy: 'localhost:8083'
  });
});
