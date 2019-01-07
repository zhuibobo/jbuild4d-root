const babel = require('gulp-babel');
const gulp = require('gulp');
const gulpCopy = require('gulp-copy');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const replacecust = require("./gulp-plugin/gulp-replace-cust/index.js");

const replaceBlockObj=require("./replaceBlock.js");

const publicResourcePath = "../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/static";
const srcPlatformStaticPath = "build-jbuild4d-web-platform/static";

gulp.task('default', done => {
    console.log('Start...................');
    let refVersion = Date.parse(new Date());


    /*处理工程中编写的js文件*/
    gulp.src([srcPlatformStaticPath + '/Js/Utility/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('JBuild4DPlatformLib.js'))
        .pipe(uglify())
        .pipe(gulp.dest(publicResourcePath + "/Js"));

    gulp.src([srcPlatformStaticPath + '/Js/VueComponent/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('VueEXComponent.js'))
        .pipe(uglify())
        .pipe(gulp.dest(publicResourcePath + "/Js"));

    //gulp.src('build-jbuild4d-web-platform/dist/*.js', {base:"build-jbuild4d-web-platform/dist"}).pipe(gulp.dest(publicResourcePath+"/Js"));

    copyAndResolveHtml(srcPlatformStaticPath + "/Html/**/*",srcPlatformStaticPath + "/Html",publicResourcePath + "/Html");

    //拷贝表单设计的相关的开发文件
    gulp.src([srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.js",srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.css",srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.png"], {base: "build-jbuild4d-web-platform/static/Js/HTMLDesign/FormDesign"}).
    pipe(gulp.dest(publicResourcePath + "/Js/HTMLDesign/FormDesign"));
    copyAndResolveHtml(srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign/**/*.html",srcPlatformStaticPath + "/Js/HTMLDesign/FormDesign",publicResourcePath + "/Js/HTMLDesign/FormDesign");

    //拷贝表单设计需要用到的Ckeditor-4.11.1
    //gulp.src(srcPlatformStaticPath+"/Js/HTMLDesign/Ckeditor-4.11.1/**/*", {base:"build-jbuild4d-web-platform/static/Js/HTMLDesign/Ckeditor-4.11.1"}).pipe(gulp.dest(publicResourcePath+"/Js/HTMLDesign/Ckeditor-4.11.1"));

    /*拷贝样式图片*/
    //gulp.src(srcPlatformStaticPath+"/Themes/**/*", {base:"build-jbuild4d-web-platform/static/Themes"}).pipe(gulp.dest(publicResourcePath+"/Themes"));

    /*拷贝第三方的JS库*/
    //gulp.src(srcPlatformStaticPath+"/Js/T3P/**/*", {base:"build-jbuild4d-web-platform/static/Js/T3P"}).pipe(gulp.dest(publicResourcePath+"/Js/T3P"));

    //console.log('End...................');
    done();
});

function copyAndResolveHtml(sourcePath,base,toPath) {
    /*拷贝HTML文件*/
    gulp.src(sourcePath, {base: base})
        .pipe(replacecust(replaceBlockObj.replaceBlock('GeneralLib'), replaceBlockObj.replaceGeneralLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('CodeMirrorLib'), replaceBlockObj.replaceCodeMirrorLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('FormDesignLib'), replaceBlockObj.replaceFormDesignLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ZTreeExtendLib'), replaceBlockObj.replaceZTreeExtendLib))
        .pipe(replacecust(replaceBlockObj.replaceBlock('ThemesLib'), replaceBlockObj.replaceThemesLib))
        .pipe(gulp.dest(toPath));
}