'use strict';

let gulp        = require('gulp');
let merge       = require('merge-stream');
let template    = require('gulp-angular-templatecache');
let browserSync = require('browser-sync');

gulp.task('views', function(){
  let views = gulp.src('src/views/**/*.html')
    .pipe(template({
      standalone: true
    }))
    .pipe(gulp.dest('src/js'));

  return views.pipe(browserSync.reload({stream:true, one:true}));
});
