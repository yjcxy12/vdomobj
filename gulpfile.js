'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');

gulp.task('watch', function() {
	livereload.listen();
	watch(['src/*js', 'example/*js'], function() {
		gulp.run(['browserify']);
	});
});

gulp.task('browserify', function() {
	gulp.src('example/index.js')
		.pipe(browserify())
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('example'))
		.pipe(livereload());
});