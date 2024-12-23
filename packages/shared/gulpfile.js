const gulp = require('gulp');

function copyLessFiles() {
  return gulp.src(['src/**/*.less'], { src: 'src' }).pipe(gulp.dest('dist'));
}

exports.default = gulp.series(copyLessFiles);
