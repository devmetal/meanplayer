'use strict';

let gulp = require('gulp');
let less = require('gulp-less');
let util = require('gulp-util');
let browserSync = require('browser-sync');

gulp.task('less', function(){
  return gulp.src('app/less/main.less')
    .pipe(less())
    .on('error', function(err){
      util.log(util.color.red('Error'), err.message);
      this.emit('end');
    })
    .pipe(gulp.dest('./public/styles/'))
    .pipe(browserSync.reload({stream:true, one:true}));
});
