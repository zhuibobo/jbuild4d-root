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

const publicResourcePath = "../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/static";
const srcPlatformStaticPath = "build-jbuild4d-web-platform/static";

/*编译Vue的扩展插件*/
gulp.task('JS-VueEXComponent',()=>{
    return gulp.src([srcPlatformStaticPath + '/Js/VueComponent/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        //.pipe(sourcemaps.identityMap())
        .pipe(concat('VueEXComponent.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(publicResourcePath + "/Js"));
});

/*编译工程的工具类JS*/
gulp.task('JS-Utility',()=>{
    return gulp.src([srcPlatformStaticPath + '/Js/Utility/*.js'])
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('JBuild4DPlatformLib.js'))
        /*.pipe(uglify(
            {
                compress: {drop_debugger: false}
            }
        ))*/
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(publicResourcePath + "/Js"));
});

/*编译旧的UI的组件*/
gulp.task('JS-UIComponent',()=>{
    return gulp.src([srcPlatformStaticPath + '/Js/EditTable/**/*.js',srcPlatformStaticPath + '/Js/TreeTable/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('UIEXComponent.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(publicResourcePath + "/Js"));
});

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

/*编译FrameV1-Assets的资源文件*/
gulp.task('FrameV1',()=>{
    return gulp.src(srcPlatformStaticPath+"/FrameV1/**/*", {base: srcPlatformStaticPath+"/FrameV1"})
        .pipe(gulp.dest(publicResourcePath+"/FrameV1"));
});

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

/*编译Less相关的Images文件*/
gulp.task('LessImages',()=>{
    return gulp.src(srcPlatformStaticPath+"/Themes/Default/Less/Images/**/*", {base: srcPlatformStaticPath+"/Themes/Default/Less/Images"})
        .pipe(gulp.dest(publicResourcePath+"/Themes/Default/Css/Images"));
});

/*编译工程相关的前端模版*/
gulp.task('HTMLTemplates',()=>{
    //return copyAndResolveHtml(srcPlatformStaticPath + "/Html/**/*",srcPlatformStaticPath + "/Html",publicResourcePath + "/Html");
    /*拷贝HTML文件*/
    return gulp.src("build-jbuild4d-web-platform/templates/**/*", {base: "build-jbuild4d-web-platform/templates"})
        //.pipe(htmlclean({
        //    protect: /<\!--%fooTemplate\b.*?%-->/g,
        //    edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
        //}))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false
        }))
        .pipe(gulp.dest("../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/templates"));
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

/*编译所有的文件*/
gulp.task('ALL', gulp.series('JS-Custom-ALL','Less','HTMLTemplates','FormDesign','LessImages','FrameV1'));

/*监控文件更新*/
gulp.task('watch', function() {
    let watcherFrameV1=gulp.watch(srcPlatformStaticPath+"/FrameV1/**/*", gulp.series('FrameV1'));
    let watcherJs=gulp.watch(srcPlatformStaticPath + '/Js/**/*.js', gulp.series('JS-Custom-ALL'));
    let watcherLess=gulp.watch(srcPlatformStaticPath+"/Themes/Default/Less/*.less", gulp.series('Less'));
    let watcherLessImages=gulp.watch(srcPlatformStaticPath+"/Themes/Default/Less/Images/**/*", gulp.series('LessImages'));
    let watcherHTMLTemplates=gulp.watch("build-jbuild4d-web-platform/templates/**/*", gulp.series('HTMLTemplates'));
    let watcherFormDesign=gulp.watch([
        srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.js",
        srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.css",
        srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.png",
        srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.html"], gulp.series('FormDesign'));
});

/*默认启动文件监控*/
gulp.task('default', gulp.series('watch'));

function copyAndResolveHtml(sourcePath,base,toPath) {
    /*拷贝HTML文件*/
    return gulp.src(sourcePath, {base: base})
        .pipe(replacecust(replaceBlockObj.replaceBlock('GeneralLib'), replaceBlockObj.replaceGeneralLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('CodeMirrorLib'), replaceBlockObj.replaceCodeMirrorLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FormDesignLib'), replaceBlockObj.replaceFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('JBuild4DFormDesignLib'), replaceBlockObj.replaceJBuild4DFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ZTreeExtendLib'), replaceBlockObj.replaceZTreeExtendLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ThemesLib'), replaceBlockObj.replaceThemesLib))
        //.pipe(htmlclean({
        //    protect: /<\!--%fooTemplate\b.*?%-->/g,
        //    edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
        //}))
        .pipe(gulp.dest(toPath));
}