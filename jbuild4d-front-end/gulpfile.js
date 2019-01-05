const gulp = require('gulp');
const babel = require('gulp-babel');
const gulpCopy = require('gulp-copy');
const concat = require('gulp-concat');

const publicResourcePath="../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/static";
const srcPlatformStaticPath="build-jbuild4d-web-platform/static";

gulp.task('default', done => {
    console.log('Start...................');

    gulp.src([srcPlatformStaticPath+'/Js/JBuild4DBaseLib.js',
        srcPlatformStaticPath+'/Js/BaseUtility.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('JBuild4DPlatformLib.js'))
        .pipe(gulp.dest('build-jbuild4d-web-platform/dist'));

    /*处理工程中编写的js文件*/


    /*拷贝HTML文件*/
    //gulp.src(srcPlatformStaticPath+"/Html/**/*", {base:srcPlatformStaticPath+"/Html"}).pipe(gulp.dest(publicResourcePath+"/Html"));

    /*拷贝样式图片*/
    //gulp.src(srcPlatformStaticPath+"/Themes/**/*", {base:"build-jbuild4d-web-platform/static/Themes"}).pipe(gulp.dest(publicResourcePath+"/Themes"));

    /*拷贝第三方的JS库*/
    //gulp.src(srcPlatformStaticPath+"/Js/T3P/**/*", {base:"build-jbuild4d-web-platform/static/Js/T3P"}).pipe(gulp.dest(publicResourcePath+"/Js/T3P"));

    //console.log('End...................');
    done();
});