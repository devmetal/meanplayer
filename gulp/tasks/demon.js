'use strict';

let gulp = require('gulp');
let nodemon = require('gulp-nodemon');

gulp.task('demon', function(){
  nodemon({
    script: 'bin/www',
    watch:[
      'routes/**/*.js',
      'views/**/*.*',
      'app.js',
      'bin/**/*.*'
    ]
  });
});
