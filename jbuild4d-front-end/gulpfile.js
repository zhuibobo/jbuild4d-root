const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', done => {
    console.log('Start...................');

    gulp.src('build-jbuild4d-web-platform/static/Js/JBuild4DBaseLib.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('build-jbuild4d-web-platform/dist'))
    console.log('End...................');
    done();
});