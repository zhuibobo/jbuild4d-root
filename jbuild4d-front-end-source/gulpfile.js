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
//endregion

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
//region 管理后端的相关的编译

const adminFromResourcePath = "web-platform-admin/static/";
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