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

    /*拷贝模本文件*/
    gulp.src(srcPlatformPath+"/templates/**/*", {base:"build-jbuild4d-web-platform/templates"})
        .pipe(gulp.dest(publicResourcePath+"/templates"));

    /*拷贝样式图片*/
    gulp.src(srcPlatformPath+"/static/Themes/**/*", {base:"build-jbuild4d-web-platform/static/Themes"})
        .pipe(gulp.dest(publicResourcePath+"/static/Themes"));

    /*拷贝第三方的JS库*/
    gulp.src(srcPlatformPath+"/static/Js/T3P/**/*", {base:"build-jbuild4d-web-platform/static/Js/T3P"})
        .pipe(gulp.dest(publicResourcePath+"/static/Js/T3P"));

    //console.log('End...................');
    done();
});