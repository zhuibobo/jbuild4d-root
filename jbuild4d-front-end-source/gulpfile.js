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

const jarFromResourcePath = "web-front-end-jar/static/";
const jarToResourcePath = "../jbuild4d-web-root/jbuild4d-web-front-end/src/main/resources/static";

/*基础Jar包相关的编译*/
gulp.task('Jar-JS-T3P',()=>{
    return gulp.src(jarFromResourcePath+"/Js/T3P/**/*", {base:jarFromResourcePath+"/Js/T3P"}).pipe(gulp.dest(jarToResourcePath+"/Js/T3P"));
});


/*管理后端的相关的编译*/


/*管理前端的相关的编译*/