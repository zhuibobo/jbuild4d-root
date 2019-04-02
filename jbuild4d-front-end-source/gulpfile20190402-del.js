'use strict';

require("@babel/polyfill");
const babel = require('gulp-babel');
const gulp = require('gulp');
const gulpCopy = require('gulp-copy');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlclean = require('gulp-htmlclean');
const less = require('gulp-less');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');

const replacecust = require("./gulp-plugin/gulp-replace-cust/index.js");

const replaceBlockObj=require("./replaceBlock.js");

const publicResourcePath = "../jbuild4d-web-root/jbuild4d-web-front-end/src/main/resources/static";
const srcPlatformStaticPath = "build-jbuild4d-web-platform/static";

/*拷贝第三方的相关文件*/

/*编译Demo的ES6-JS文件*/
gulp.task('ES6-JS-Demo',()=>{
    return gulp.src([srcPlatformStaticPath + '/ES6/*.js'])
        .pipe(babel())
        /*.pipe(babel({
            presets: ['@babel/env']
        }))*/
        /*.pipe(babel({
            plugins: ['@babel/babel-plugin-transform-runtime']        // babel-plugin-transform-runtime 在这里使用;
        }))*/
        /*.pipe(babel({
            plugins: ['@babel/transform-runtime']        // babel-plugin-transform-runtime 在这里使用;
        }))*/
        .pipe(gulp.dest(srcPlatformStaticPath + "/ES6/ES5"));
});










/*编译所有的文件*/
gulp.task('ALL', gulp.series('JS-Custom-ALL','Less','HTMLTemplates','HTMLDesign-ALL','LessImages','FrameV1'));

/*监控文件更新*/


/*默认启动文件监控*/
gulp.task('default', gulp.series('watch'));

