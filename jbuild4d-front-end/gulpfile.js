
const babel = require('gulp-babel');
const gulp = require('gulp');
const gulpCopy = require('gulp-copy');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const replacecust=require("./gulp-plugin/gulp-replace-cust/index.js");

const publicResourcePath="../jbuild4d-web-root/jbuild4d-web-platform/src/main/resources/static";
const srcPlatformStaticPath="build-jbuild4d-web-platform/static";

console.log("1111");

function calculateFilePath(file){
    console.log(file.path);
    let repath=file.path.split('Html\\');
    console.log(repath[1]);
    let levelPathArray=repath[1].split("\\");
    console.log(levelPathArray.length);
    let levelPath="";
    for(let i=0;i<levelPathArray.length;i++){
        levelPath+="../";
    }
    return levelPath;
}

function refJs(path){
    return '<script type="text/javascript" src="'+path+'"></script>';
}

gulp.task('default', done => {
    console.log('Start...................');

    /*处理工程中编写的js文件*/
    gulp.src([srcPlatformStaticPath+'/Js/*.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('JBuild4DPlatformLib.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build-jbuild4d-web-platform/dist'));

    gulp.src('build-jbuild4d-web-platform/dist/*.js', {base:"build-jbuild4d-web-platform/dist"}).pipe(gulp.dest(publicResourcePath+"/Js"));

    /*拷贝HTML文件*/
    gulp.src(srcPlatformStaticPath+"/Html/**/*", {base:srcPlatformStaticPath+"/Html"}).
    pipe(replacecust('<th:block th:replace="Fragment/GeneralLib::GeneralLib"></th:block>',function (search,file) {
        let replaceArray=new Array();
        replaceArray.push('<title>JBuild4D</title>');
        replaceArray.push('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />');
        replaceArray.push('<meta charset="utf-8" />');
        replaceArray.push('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />');
        //判断路径后进行引入js的路径
        let levelPath=calculateFilePath(file);

        let jquery=levelPath+"Js/T3P/JQuery/jquery-3.3.1.min.js";
        replaceArray.push(refJs(jquery));

        let JBuild4DBaseLib=levelPath+"Js/T3P/JQuery/Jbuild4dPlatform.js";
        replaceArray.push(refJs(JBuild4DBaseLib));

        let vue=levelPath+"Js/T3P/VUE-2.5.16/vue.js";
        replaceArray.push(refJs(vue));

        let iview=levelPath+"Js/T3P/IView-3.X/dist/iview.min.js";
        replaceArray.push(refJs(iview));

        let jqueryui=levelPath+"Js/T3P/JQuery-UI-1.12.1/jquery-ui.js";
        replaceArray.push(refJs(jqueryui));

        return replaceArray.join("\n\t");
    })).
    pipe(replacecust('<th:block th:replace="Fragment/GeneralLib::ThemesLib"></th:block>',function (search,file) {
        let replaceArray=new Array();
        //判断路径后进行引入js的路径
        let levelPath=calculateFilePath(file);

        replaceArray.push("<script>");
        replaceArray.push('createStyleSheet("'+levelPath+'Themes/Default/Css/Jbuild4dPlatform.css'+'");');
        replaceArray.push('createStyleSheet("'+levelPath+'Themes/Default/IView-3.X/iview.css'+'");');
        replaceArray.push('createStyleSheet("'+levelPath+'Themes/Default/JQueryUI/jquery-ui.css'+'");');
        replaceArray.push('createStyleSheet("'+levelPath+'Themes/Default/ZTree/zTreeStyle/zTreeStyle.css'+'");');
        replaceArray.push("</script>");
        return replaceArray.join("");
    })).
    pipe(gulp.dest(publicResourcePath+"/Html"));

    /*拷贝样式图片*/
    //gulp.src(srcPlatformStaticPath+"/Themes/**/*", {base:"build-jbuild4d-web-platform/static/Themes"}).pipe(gulp.dest(publicResourcePath+"/Themes"));

    /*拷贝第三方的JS库*/
    //gulp.src(srcPlatformStaticPath+"/Js/T3P/**/*", {base:"build-jbuild4d-web-platform/static/Js/T3P"}).pipe(gulp.dest(publicResourcePath+"/Js/T3P"));

    //console.log('End...................');
    done();
});