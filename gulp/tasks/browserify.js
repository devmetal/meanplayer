'use strict';

let gulp        = require('gulp');
let util        = require('gulp-util');
let browserify  = require('browserify');
let babelify    = require('babelify');
let source      = require('vinyl-source-stream');
let buffer      = require('vinyl-buffer');
let browserSync = require('browser-sync');

gulp.task('browserify', function(){
	return browserify({
		entries: ['src/js/main.js'],
		debug: true
	})
	.transform(babelify)
	.bundle()
	.on('error', function(err) {
        util.log(util.colors.red('Error'), err.message);
        this.emit('end');
  })
	.pipe(source('main.js'))
	.pipe(buffer())
	.pipe(gulp.dest('public/javascripts/'))
	.pipe(browserSync.reload({stream:true, one:true}));
});
