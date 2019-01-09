'use strict';

const babel = require('gulp-babel');
const gulp = require('gulp');
const gulpCopy = require('gulp-copy');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlclean = require('gulp-htmlclean');
const less = require('gulp-less');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');

const replacecust = require("./gulp-plugin/gulp-replace-cust/index.js");

const replaceBlockObj=require("./replaceBlock.js");

const publicResourcePath = "../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/static";
const srcPlatformStaticPath = "build-jbuild4d-web-platform/static";

/*gulp.task('watch', function() {
    let watcherUtilityJs=gulp.watch(srcPlatformStaticPath + '/Js/Utility/!*.js', gulp.series('UtilityJs'));
});*/


/*编译Vue的扩展插件*/
gulp.task('JS-VueEXComponent',()=>{
    return gulp.src([srcPlatformStaticPath + '/Js/VueComponent/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('VueEXComponent.js'))
        .pipe(uglify())
        .pipe(gulp.dest(publicResourcePath + "/Js"));
});

/*编译工程的工具类JS*/
gulp.task('JS-Utility',()=>{
    return gulp.src([srcPlatformStaticPath + '/Js/Utility/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('JBuild4DPlatformLib.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(publicResourcePath + "/Js"));
});

/*编译工程相关的JS*/
gulp.task('JS-Custom-ALL', gulp.series('JS-VueEXComponent','JS-Utility'));

/*编译工程相关的Less文件*/
gulp.task('Less',()=>{
    return gulp.src(srcPlatformStaticPath+"/Themes/Default/Css/*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(publicResourcePath+'/Themes/Default/Css'));
});

/*编译工程相关的前端模版*/
gulp.task('HTMLTemplates',()=>{
    return copyAndResolveHtml(srcPlatformStaticPath + "/Html/**/*",srcPlatformStaticPath + "/Html",publicResourcePath + "/Html");
});

/*编译表单设计器的相关的JS文件*/
gulp.task('FormDesign-JS',()=>{
    return gulp.src([srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.js",srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.css",srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.png"], {base: "build-jbuild4d-web-platform/static/Js/HTMLDesign/FormDesign"}).
    pipe(gulp.dest(publicResourcePath + "/Js/HTMLDesign/FormDesign"));
});

/*编译表单设计器的相关的HTML文件*/
gulp.task('FormDesign-HTML',()=>{
    return copyAndResolveHtml(srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.html",srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign",publicResourcePath + "/Js/HTMLDesign/FormDesign");
});

/*编译表单设计器的相关文件*/
gulp.task('FormDesign', gulp.series('FormDesign-JS','FormDesign-HTML'));

function copyAndResolveHtml(sourcePath,base,toPath) {
    /*拷贝HTML文件*/
    return gulp.src(sourcePath, {base: base})
        .pipe(replacecust(replaceBlockObj.replaceBlock('GeneralLib'), replaceBlockObj.replaceGeneralLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('CodeMirrorLib'), replaceBlockObj.replaceCodeMirrorLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FormDesignLib'), replaceBlockObj.replaceFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ZTreeExtendLib'), replaceBlockObj.replaceZTreeExtendLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ThemesLib'), replaceBlockObj.replaceThemesLib))
        //.pipe(htmlclean({
        //    protect: /<\!--%fooTemplate\b.*?%-->/g,
        //    edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
        //}))
        .pipe(gulp.dest(toPath));
}

gulp.task('ALL', gulp.series('JS-Custom-ALL','Less','HTMLTemplates','FormDesign'));

gulp.task('default', gulp.series('ALL'));