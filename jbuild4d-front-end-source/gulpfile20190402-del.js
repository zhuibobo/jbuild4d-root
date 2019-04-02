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

/*编译工程相关的JS*/
gulp.task('JS-Custom-ALL', gulp.series('JS-VueEXComponent','JS-Utility','JS-UIComponent'));






/*编译表单设计器的相关文件*/
gulp.task('HTMLDesign-ALL', gulp.series('HTMLDesign-Utility','HTMLDesign-CKEditorConfig','HTMLDesign-Plugins','HTMLDesign-HTML'));

/*编译所有的文件*/
gulp.task('ALL', gulp.series('JS-Custom-ALL','Less','HTMLTemplates','HTMLDesign-ALL','LessImages','FrameV1'));

/*监控文件更新*/
gulp.task('watch', function() {
    let watcherFrameV1=gulp.watch(srcPlatformStaticPath+"/FrameV1/**/*", gulp.series('FrameV1'));
    let watcherJs=gulp.watch(srcPlatformStaticPath + '/Js/**/*.js', gulp.series('JS-Custom-ALL'));
    let watcherLess=gulp.watch(srcPlatformStaticPath+"/Themes/Default/Less/*.less", gulp.series('Less'));
    let watcherLessImages=gulp.watch(srcPlatformStaticPath+"/Themes/Default/Less/Images/**/*", gulp.series('LessImages'));
    let watcherHTMLTemplates=gulp.watch("build-jbuild4d-web-platform/static/HTML/**/*", gulp.series('HTMLTemplates'));
    let watcherFormDesign=gulp.watch([
        srcPlatformStaticPath + "/Js/HTMLDesign/**/*.js",
        srcPlatformStaticPath + "/Js/HTMLDesign/**/*.css",
        srcPlatformStaticPath + "/Js/HTMLDesign/**/*.png",
        srcPlatformStaticPath + "/Js/HTMLDesign/**/*.html"], gulp.series('HTMLDesign-ALL'));
    let watcherPluginLess=gulp.watch(srcPlatformStaticPath+"/Js/**/*.less", gulp.series('Less'));
});

/*默认启动文件监控*/
gulp.task('default', gulp.series('watch'));

