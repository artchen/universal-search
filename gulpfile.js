var gulp = require('gulp');
var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var fs = require('fs');

var path = {
  LESS: [
    'src/universal-search.less',
    'src/icomoon/style.css'
  ],
  IMG: 'src/img/*',
  JS: [
    'src/*.js',
    'src/services/*.js'
  ],
  FONTS: 'src/icomoon/fonts/*',
  DEMO: 'demo',
  DIST: 'dist'
};

var all_tasks = ['lint', 'less', 'js', 'img', 'fonts'];

gulp.task('demo', function() {
	connect.server({
		root: path.DEMO,
		port: 4000
	});
});

gulp.task('clean', function() {
  gulp.src(path.DIST + "/*")
		.pipe(clean());
});

gulp.task('lint', function() {
  return gulp.src(path.JS)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('fonts', function() {
  gulp.src(path.FONTS)
    .pipe(gulp.dest(path.DIST + "/fonts"))
    .pipe(gulp.dest(path.DEMO + "/fonts"));
});

gulp.task('js', function() {
  // create an all-in-one bundle for demo
  gulp.src(path.JS)
    .pipe(concat('universal-search-all.js'))
    .pipe(gulp.dest(path.DIST))
    .pipe(gulp.dest(path.DEMO))
    .pipe(concat('universal-search-all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.DIST));
  // create per service bundles
  var dirname = 'src/services/';
  fs.readdir(dirname, function(err, filenames) {
    if (err) return;
    filenames.forEach(function(filename) {
      var paths = ['src/*.js', dirname+filename];
      var service = filename.split('-')[0];
      gulp.src(paths)
        .pipe(concat('universal-search-' +service+ '.js'))
        .pipe(gulp.dest(path.DIST))
        .pipe(concat('universal-search-' +service+ '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.DIST));
    });
  });
});

gulp.task('less', function () {
  gulp.src(path.LESS)
    .pipe(concat('universal-search.css'))
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest(path.DIST))
    .pipe(gulp.dest(path.DEMO));
});

gulp.task('img', function(){
  gulp.src(path.IMG)
    .pipe(imagemin())
    .pipe(gulp.dest(path.DIST + '/img'))
    .pipe(gulp.dest(path.DEMO + '/img'));
});

gulp.task('watch', function () {
  gulp.watch(path.LESS, ['less']);
  gulp.watch(path.JS, ['lint', 'js']);
  gulp.watch(path.IMG, ['img']);
});

gulp.task('default', function() {
  gulp.start(all_tasks);
});
