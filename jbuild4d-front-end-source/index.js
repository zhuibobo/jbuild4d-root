const gulp = require('gulp');
const babel = require('gulp-babel');
const gulpCopy = require('gulp-copy');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const replacecust=require("./gulp-plugin/gulp-replace-cust/index.js");

const publicResourcePath="../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/static";
const srcPlatformStaticPath="build-jbuild4d-web-platform/static";

gulp.src([srcPlatformStaticPath+'/Js/!*.js'])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('JBuild4DPlatformLib.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build-jbuild4d-web-platform/dist'));

/*处理工程中编写的js文件*/

/*拷贝HTML文件*/
gulp.src(srcPlatformStaticPath+"/Html/!**!/!*", {base:srcPlatformStaticPath+"/Html"}).pipe(replacecust('T3P', 'T3P2')).pipe(gulp.dest(publicResourcePath+"/Html"));