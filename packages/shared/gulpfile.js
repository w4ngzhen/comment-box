const gulp = require('gulp');

function copyLessFiles() {
  return gulp
    .src(['src/**/*.less'], { src: 'src' }) // 排除 Less 文件
    .pipe(gulp.dest('dist'));
}

exports.default = gulp.series(copyLessFiles);
