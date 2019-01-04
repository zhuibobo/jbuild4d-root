const gulp = require('gulp');
const babel = require('gulp-babel');
const gulpCopy = require('gulp-copy');

const publicResourcePath="../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources";
const srcPlatformPath="build-jbuild4d-web-platform";

gulp.task('default', done => {
    console.log('Start...................');

    /*gulp.src('build-jbuild4d-web-platform/static/Js/JBuild4DBaseLib.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('build-jbuild4d-web-platform/dist'));*/

    gulp.src(srcPlatformPath+"/templates/**/*", {base:"build-jbuild4d-web-platform/templates"})
        .pipe(gulp.dest(publicResourcePath+"/templates"));

    //console.log('End...................');
    done();
});