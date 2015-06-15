var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var notify       = require('gulp-notify');
var server       = require('gulp-develop-server');
var jshint       = require('gulp-jshint');
var jscs         = require('gulp-jscs');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');

// Task to compile Sass into CSS
gulp.task('sass', function() {
  return gulp.src('./lib/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(
      autoprefixer(
        'last 2 version',
        'safari 5',
        'ie 8',
        'ie 9',
        'opera 12.1',
        'ios 6',
        'android 4'
      )
    )
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./public/stylesheets'))
  .pipe(notify({message: 'Sass has been compiled'}));
});

// Task to lint the code
gulp.task('lint', function() {
  return gulp.src(['./routes/*.js', './*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(require('jshint-stylish-ex')));
});

// Task to check that coding style guidelines are met
gulp.task('style', function() {
  return gulp.src(['./routes/*.js', './*.js'])
    .pipe(jscs());
});

// Task to restart the server
gulp.task('server-restart', function() {
  server.restart();
});

// Task to start the server and watch for JS changes
gulp.task('back-js-watch', function() {
  server.listen({path: 'bin/www'});
  gulp.watch('./routes/*.js', ['server-restart', 'lint', 'style']);
  gulp.watch('./*.js', ['server-restart', 'lint', 'style']);
  gulp.watch('./bin/www', ['server-restart']);
});

// Task to wath for Sass changes
gulp.task('sass-watch', function() {
  gulp.watch('./lib/scss/*.scss', ['sass']);
});

// Task to compile frontend JS
gulp.task('front-js', function() {
  return gulp.src('./lib/js/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(notify({message: 'Frontend JS has been compiled'}))
  .pipe(gulp.dest('./public/scripts'));
});

// Task to watch for frontend JS changes
gulp.task('front-js-watch', function() {
  gulp.watch('./lib/js/*.js', ['front-js']);
});

// Main development task, starts the server and watches for Sass and JS changes
gulp.task('dev', function() {
  gulp.start(['sass-watch', 'back-js-watch', 'front-js-watch']);
});

// Default task, just runs dev
gulp.task('default', function() {
  gulp.start(['dev']);
});
