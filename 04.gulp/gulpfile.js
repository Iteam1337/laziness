var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglifyjs');

gulp.task('compile', function () {
  gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify('all.min.js', { outSourceMap: true }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch('js/**/*.js', [ 'compile' ]);
})

gulp.task('default', [ 'compile', 'watch' ]);