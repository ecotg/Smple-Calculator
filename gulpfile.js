var gulp = require('gulp'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	jasmine = require('gulp-jasmine');

gulp.task('default', ['start','watch']);

gulp.task('start', function() {
	return gutil.log('Gulp is running!');
});

gulp.task('jshint', function() {
	return gulp.src(['*.js', 'scripts/*.js']).pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function() {
	gulp.src('spec/*.js').pipe(jasmine());
});

gulp.task('watch', function() {
	gulp.watch(['*.js','spec/*.js', 'scripts/**/*.js'], ['test']);
});
