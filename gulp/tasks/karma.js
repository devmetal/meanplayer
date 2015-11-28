'use strict';

let gulp = require('gulp');
let Server = require('karma').Server;

gulp.task('karma', function(done){
 new Server({
 configFile: __dirname + '/../../karma.conf.js',
 },done).start();
});
