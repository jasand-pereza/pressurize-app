// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var coffee = require('gulp-coffee');

// Lint Task
gulp.task('lint', function() {
  return gulp.src('assets/js/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('assets/scss/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('assets/js/*.js')
  .pipe(concat('all.js'))
  .pipe(gulp.dest('assets/dist'))
  .pipe(rename('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('assets/dist'));
});

gulp.task('coffee', function() {
  gulp.src('./asses/js/src/coffee/*.coffee')
  .pipe(coffee({bare: true}))
  .pipe(gulp.dest('./assets/js/compiled/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('assets/js/*.js', ['lint', 'scripts']);
  gulp.watch('assets/scss/*.scss', ['sass']);
  gulp.watch('assets/js/src/coffee/*.coffee', ['coffee']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'coffee', 'watch']);