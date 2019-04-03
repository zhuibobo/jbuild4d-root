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

const jarFromResourcePath = "web-front-end-jar/static";
const jarToResourcePath = "../jbuild4d-web-root/jbuild4d-web-front-end/src/main/resources/static";

//region 基础Jar包相关的编译
gulp.task('Jar-JS-T3P',()=>{
    return gulp.src(jarFromResourcePath+"/Js/T3P/**/*", {base:jarFromResourcePath+"/Js/T3P"}).pipe(gulp.dest(jarToResourcePath+"/Js/T3P"));
});

gulp.task('Jar-Themes-ALL',()=>{
    return gulp.src(jarFromResourcePath+"/Themes/**/*", {base:jarFromResourcePath+"/Themes"}).pipe(gulp.dest(jarToResourcePath+"/Themes"));
});

/*编译Vue的扩展插件*/
gulp.task('Jar-JS-VueEXComponent',()=>{
    return gulp.src([jarFromResourcePath + '/Js/VueComponent/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        //.pipe(sourcemaps.identityMap())
        .pipe(concat('VueEXComponent.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jarToResourcePath + "/Js"));
});

/*编译工程的工具类JS*/
gulp.task('Jar-JS-Utility',()=>{
    return gulp.src([jarFromResourcePath + '/Js/Utility/*.js'])
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
        .pipe(gulp.dest(jarToResourcePath + "/Js"));
});

/*编译旧的UI的组件*/
gulp.task('Jar-JS-UIComponent',()=>{
    return gulp.src([jarFromResourcePath + '/Js/EditTable/**/*.js',jarFromResourcePath + '/Js/TreeTable/**/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('UIEXComponent.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jarToResourcePath + "/Js"));
});

/*编译工程相关的Less文件*/
gulp.task('Jar-Themes-Less',()=>{
    return gulp.src(jarFromResourcePath+"/Themes/Default/Css/*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jarToResourcePath+'/Themes/Default/Css'));
});

/*编译Less相关的Images文件*/
gulp.task('Jar-Themes-Less-Images',()=>{
    return gulp.src(jarFromResourcePath+"/Themes/Default/Less/Images/**/*", {base: jarFromResourcePath+"/Themes/Default/Less/Images"})
        .pipe(gulp.dest(jarToResourcePath+"/Themes/Default/Css/Images"));
});

/*编译工程相关的JS*/
gulp.task('Jar-JS-Custom-ALL', gulp.series('Jar-JS-VueEXComponent','Jar-JS-Utility','Jar-JS-UIComponent'));
//endregion

//region 管理后端的相关的编译

const adminFromResourcePath = "web-platform-admin/static";
const adminToResourcePath = "../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/static";
/*编译管理端框架的资源文件*/
gulp.task('Admin-FrameV1',()=>{
    return gulp.src(adminFromResourcePath+"/HTML/FrameV1/**/*", {base: adminFromResourcePath+"/HTML/FrameV1"})
        .pipe(gulp.dest(adminToResourcePath+"/HTML/FrameV1"));
});

/*编译工程相关的前端模版*/
gulp.task('Admin-HTMLTemplates',()=>{
    return copyAndResolveHtml(adminFromResourcePath + "/HTML/**/*.html",adminFromResourcePath + "/HTML",adminToResourcePath + "/HTML");
    /*拷贝HTML文件*/
    /*return gulp.src("build-jbuild4d-web-platform/templates/!**!/!*", {base: "build-jbuild4d-web-platform/templates"})
        //.pipe(htmlclean({
        //    protect: /<\!--%fooTemplate\b.*?%-->/g,
        //    edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
        //}))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false
        }))
        .pipe(gulp.dest("../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/templates"));*/
});

/*HTML设计的基础的工具类*/
gulp.task('Admin-HTMLDesign-Utility',()=> {
    return gulp.src([
        adminFromResourcePath + "/Js/HTMLDesign/*.js"
    ])
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(concat('HTMLDesignUtility.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(adminToResourcePath + "/Js/HTMLDesign"));
});

/*CKEditor的配置文件*/
gulp.task('Admin-HTMLDesign-CKEditorConfig',()=> {
    return gulp.src([
        adminFromResourcePath + "/Js/HTMLDesign/CKEditorConfig/*.js"
    ])
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(concat('CKEditorConfig.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(adminToResourcePath + "/Js/HTMLDesign/CKEditorConfig"));
});

/*WebForm相关的插件*/
gulp.task('Admin-HTMLDesign-Plugins',()=>{
    return gulp.src([
        adminFromResourcePath + "/Js/HTMLDesign/**/Plugins/**/*.js",
        adminFromResourcePath + "/Js/HTMLDesign/**/Plugins/**/*.css",
        adminFromResourcePath + "/Js/HTMLDesign/**/Plugins/**/*.png"
    ], {base: adminFromResourcePath+"/Js/HTMLDesign/**/Plugins"}).
    pipe(gulp.dest(adminToResourcePath + "/Js/HTMLDesign/**/Plugins"));
});

/*编译表单设计器的相关的HTML文件*/
gulp.task('Admin-HTMLDesign-HTML',()=>{
    return copyAndResolveHtml(adminFromResourcePath + "/Js/HTMLDesign/**/*.html",adminFromResourcePath + "/Js/HTMLDesign",adminToResourcePath + "/Js/HTMLDesign");
});

/*编译表单设计器的相关文件*/
gulp.task('Admin-HTMLDesign-ALL', gulp.series('Admin-HTMLDesign-Utility','Admin-HTMLDesign-CKEditorConfig','Admin-HTMLDesign-Plugins','Admin-HTMLDesign-HTML'));

/*编译工程相关的Less文件*/
gulp.task('Admin-Themes-Less',()=>{
    return gulp.src(adminFromResourcePath+"/Themes/Default/Css/*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(adminToResourcePath+'/Themes/Default/Css'));
});

/*自动监测文件并进行更新*/
gulp.task('Admin-Watch', function() {
    let watcherFrameV1=gulp.watch(adminFromResourcePath+"/HTML/FrameV1/**/*", gulp.series('Admin-FrameV1'));
    let watcherJs=gulp.watch(jarFromResourcePath + '/Js/**/*.js', gulp.series('Jar-JS-Custom-ALL'));
    let watcherLess=gulp.watch(jarFromResourcePath+"/Themes/Default/Less/*.less", gulp.series('Jar-Themes-Less'));
    let watcherLessImages=gulp.watch(jarFromResourcePath+"/Themes/Default/Less/Images/**/*", gulp.series('Jar-Themes-Less-Images'));
    let watcherHTMLTemplates=gulp.watch(adminFromResourcePath+"/HTML/**/*", gulp.series('Admin-HTMLTemplates'));
    let watcherFormDesign=gulp.watch([
        adminFromResourcePath + "/Js/HTMLDesign/**/*.js",
        adminFromResourcePath + "/Js/HTMLDesign/**/*.css",
        adminFromResourcePath + "/Js/HTMLDesign/**/*.png",
        adminFromResourcePath + "/Js/HTMLDesign/**/*.html"], gulp.series('Admin-HTMLDesign-ALL'));
    let admin_watcherLess=gulp.watch(adminFromResourcePath+"/Js/HTMLDesign/**/*.less", gulp.series('Admin-Themes-Less'));
    //let watcherPluginLess=gulp.watch(srcPlatformStaticPath+"/Js/**/*.less", gulp.series('Less'));
});

//endregion

//region 管理前端的相关的编译

//endregion

function copyAndResolveHtml(sourcePath,base,toPath) {
    /*拷贝HTML文件*/
    return gulp.src(sourcePath, {base: base})
        .pipe(replacecust(replaceBlockObj.replaceBlock('GeneralLib'), replaceBlockObj.replaceGeneralLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('CodeMirrorLib'), replaceBlockObj.replaceCodeMirrorLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FormDesignLib'), replaceBlockObj.replaceFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('JBuild4DFormDesignLib'), replaceBlockObj.replaceJBuild4DFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ZTreeExtendLib'), replaceBlockObj.replaceZTreeExtendLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ThemesLib'), replaceBlockObj.replaceThemesLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('BootStrap4Lib'), replaceBlockObj.replaceBootStrap4Lib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FrameV1Lib'), replaceBlockObj.replaceFrameV1Lib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('GoJsLib'), replaceBlockObj.replaceGoJsLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('Webix'), replaceBlockObj.replaceWebixLib))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false
        }))
        /*.pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS:true,
            minifyJS:false
        }))*/
        //.pipe(htmlclean({
        //    protect: /<\!--%fooTemplate\b.*?%-->/g,
        //    edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
        //}))
        .pipe(gulp.dest(toPath));
}