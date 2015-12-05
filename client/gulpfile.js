var gulp = require('gulp');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var util = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var ngAnnotate = require('gulp-ng-annotate');
var minifyHTML = require('gulp-minify-html');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var del = require('del');

var dir = Object.create(null);
dir.src = Object.create(null);
dir.src.root = __dirname + '/src/';
dir.src.html = dir.src.root + 'html/';
dir.src.scss = dir.src.root + 'css/';
dir.src.js = dir.src.root + 'js/';
dir.src.lib = [
  __dirname + '/node_modules/angular/angular.js',
  __dirname + '/node_modules/angular/angular.min.js'
];
dir.src.font = dir.src.root + 'assets/font/';
dir.src.img = dir.src.root + 'assets/img/';

dir.dest = Object.create(null);
dir.dest.build = __dirname + '/build/';
dir.dest.html = dir.dest.build;
dir.dest.css = dir.dest.build;
dir.dest.js = dir.dest.build;
dir.dest.lib = dir.dest.build + 'lib/';
dir.dest.font = dir.dest.build + 'font/';
dir.dest.img = dir.dest.build + 'img/';

var ext = Object.create(null);
ext.html = '**/*.{htm,html}';
ext.css = '**/*.css';
ext.scss = '**/*.scss';
ext.js = '**/*.js';
ext.font = '**/*{ttf}';
ext.img = '**/*.{gif,jpg,jpeg,png,svg}';

var files = Object.create(null);
files.html = dir.src.html + ext.html;
files.scss = dir.src.scss + 'style.scss';
files.js = dir.src.js + ext.js;
files.font = dir.src.font = ext.font;
files.img = dir.src.img + ext.img;

var bundle = Object.create(null);
bundle.app = 'app.js';
bundle.stylesheet = 'style.scss';

gulp.task('clean', function (cb) {
  return del([dir.dest.build], cb);
});

gulp.task('copy:html', function () {
  return gulp.src([files.html])
    .pipe(plumber())
    .pipe(minifyHTML({
      conditionals: true,
      spare: true
    }))
    .pipe(gulp.dest(dir.dest.html))
    .pipe(connect.reload());
});

gulp.task('build:css', function () {
  return gulp.src([files.scss])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dir.dest.css))
    .pipe(connect.reload());
});

gulp.task('lint', function () {
  return gulp.src([files.js])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build:js:angular', function () {
  return gulp.src([files.js])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat(bundle.app))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dir.dest.js))
    .pipe(connect.reload());
});

gulp.task('copy:lib', function () {
  return gulp.src(dir.src.lib)
    .pipe(plumber())
    .pipe(gulp.dest(dir.dest.lib));
});

gulp.task('copy:font', function () {
  return gulp.src([files.font])
    .pipe(plumber())
    .pipe(gulp.dest(dir.dest.font));
});

gulp.task('copy:img', function () {
  return gulp.src([files.img])
    .pipe(plumber())
    .pipe(gulp.dest(dir.dest.img));
});

gulp.task('build', function (cb) {
  runSequence(
    'clean',
    'lint',
    ['build:css', 'build:js:angular'],
    ['copy:html', 'copy:lib', 'copy:font', 'copy:img'],
    cb
  );
});

gulp.task('connect', function () {
  connect.server({
    root: [dir.dest.build],
    port: 3000,
    livereload: true
  });
});

gulp.task('watch', ['build', 'connect'], function () {
  util.log(util.colors.yellow('Watching html, scss, js files'));
  gulp.watch(files.html, ['copy:html']);
  gulp.watch(files.scss, ['build:css']);
  gulp.watch(files.js, ['build:js:angular']);
});

gulp.task('default', ['build']);
