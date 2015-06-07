var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	watch = require('gulp-watch'),
	notify = require('gulp-notify');

gulp.task('sass', function() {
	return gulp.src('./lib/scss/style.scss')
		.pipe(sass({'outputStyle': 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(gulp.dest('./public/stylesheets'))
	.pipe(notify({ message: 'Sass has been compiled' }));
});

gulp.task('watch', function() {
	gulp.watch('./lib/scss/*.scss', ['sass']);
});

gulp.task('default', function() {
	gulp.start(['watch']);
})