refVersion = 1;

function calculateFilePath (file) {
    console.log(file.path);
    let repath = file.path.split('Html\\');
    console.log(repath[1]);
    let levelPathArray = repath[1].split("\\");
    console.log(levelPathArray.length);
    let levelPath = "";
    for (let i = 0; i < levelPathArray.length; i++) {
        levelPath += "../";
    }
    return levelPath;
}

function refJs(path) {
    return '<script type="text/javascript" src="' + path + '"></script>';
}

function refCss(path) {
    return '<link rel="stylesheet" type="text/css" href="' + path + '" />';
}

let replaceBlock={

    replaceBlock:function (name) {
        return '<th:block th:replace="Fragment/GeneralLib::' + name + '"></th:block>';
    },
    replaceGeneralLib:function (search, file) {
        let replaceArray = new Array();
        replaceArray.push('<title>JBuild4D</title>');
        replaceArray.push('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />');
        replaceArray.push('<meta charset="utf-8" />');
        replaceArray.push('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />');
        //判断路径后进行引入js的路径
        let levelPath = calculateFilePath(file);
        replaceArray.push(refJs(levelPath + "Js/T3P/JQuery/jquery-3.3.1.min.js"));
        replaceArray.push(refJs(levelPath + "Js/JBuild4DPlatformLib.js?refVersion=" + refVersion));
        replaceArray.push(refJs(levelPath + "Js/T3P/VUE-2.5.16/vue.js"));
        replaceArray.push(refJs(levelPath + "Js/VueEXComponent.js?refVersion=" + refVersion));
        replaceArray.push(refJs(levelPath + "Js/T3P/IView-3.X/dist/iview.min.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/JQuery-UI-1.12.1/jquery-ui.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/ZTree-V3/js/jquery.ztree.all.js"));
        return replaceArray.join("\n\t");
    },
    replaceCodeMirrorLib:function (search, file) {
        let replaceArray = new Array();
        let levelPath = calculateFilePath(file);

        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/lib/codemirror.js"));
        replaceArray.push(refCss(levelPath + 'Js/T3P/CodeMirror-5.39.2/lib/codemirror.css'));
        replaceArray.push(refCss(levelPath + 'Js/T3P/CodeMirror-5.39.2/theme/monokai.css'));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/mode/xml/xml.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/mode/javascript/javascript.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/mode/css/css.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/mode/htmlmixed/htmlmixed.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/addon/fold/foldcode.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/addon/fold/foldgutter.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/addon/fold/brace-fold.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/addon/fold/xml-fold.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/addon/fold/markdown-fold.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/addon/fold/comment-fold.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/addon/fold/brace-fold.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/CodeMirror-5.39.2/addon/util/formatting.js"));
        replaceArray.push(refCss(levelPath + 'Js/T3P/CodeMirror-5.39.2/addon/fold/foldgutter.css'));

        return replaceArray.join("\n\t");
    },
    replaceFormDesignLib:function (search, file) {
        let replaceArray = new Array();
        let levelPath = calculateFilePath(file);

        replaceArray.push(refJs(levelPath + "Js/HTMLDesign/Ckeditor-4.11.1/ckeditor.js"));
        replaceArray.push(refJs(levelPath + "Js/HTMLDesign/FormDesign/JBuild4DFormDesign.js?refVersion=" + refVersion));

        return replaceArray.join("\n\t");
    },
    replaceZTreeExtendLib:function (search, file) {
        let replaceArray = new Array();
        let levelPath = calculateFilePath(file);

        replaceArray.push(refJs(levelPath + "Js/T3P/ZTree-V3/js/jquery.ztree.exhide.js"));
        replaceArray.push(refJs(levelPath + "Js/T3P/ZTree-V3/js/fuzzysearch.js"));

        return replaceArray.join("\n\t");
    },
    replaceThemesLib:function (search, file) {
        let replaceArray = new Array();
        //判断路径后进行引入js的路径
        let levelPath = calculateFilePath(file);

        replaceArray.push(refCss(levelPath + 'Themes/Default/Css/Jbuild4dPlatform.css?refVersion=' + refVersion));
        replaceArray.push(refCss(levelPath + 'Themes/Default/IView-3.X/iview.css'));
        replaceArray.push(refCss(levelPath + 'Themes/Default/JQueryUI/jquery-ui.css'));
        replaceArray.push(refCss(levelPath + 'Themes/Default/ZTree/zTreeStyle/zTreeStyle.css'));
        return replaceArray.join("\n\t");

        replaceArray.push("<script>");
        replaceArray.push("<script>");
        replaceArray.push('\n\t\trefCssLink("' + levelPath + 'Themes/Default/Css/Jbuild4dPlatform.css?refVersion=' + refVersion + '");');
        replaceArray.push('\n\t\trefCssLink("' + levelPath + 'Themes/Default/IView-3.X/iview.css' + '");');
        replaceArray.push('\n\t\trefCssLink("' + levelPath + 'Themes/Default/JQueryUI/jquery-ui.css' + '");');
        replaceArray.push('\n\t\trefCssLink("' + levelPath + 'Themes/Default/ZTree/zTreeStyle/zTreeStyle.css' + '");');
        replaceArray.push("\n\t</script>");
        return replaceArray.join("");
    }
}

module.exports=replaceBlock;