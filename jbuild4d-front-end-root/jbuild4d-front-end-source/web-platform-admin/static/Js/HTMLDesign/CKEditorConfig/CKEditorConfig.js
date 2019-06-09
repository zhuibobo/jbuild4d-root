/**
 * Created by zhuangrb on 2016/1/20.
 */
CKEDITOR.editorConfig = function(config) {
    //config.language = 'zh-cn';
    /*config.plugins = 'iframedialog,dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,' +
        'bidi,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,' +
        'templates,menu,contextmenu,div,resize,toolbar,elementspath,enterkey,entities,popup,' +
        'filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,format,' +
        'horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,' +
        'justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,' +
        'pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,' +
        'specialchar,scayt,stylescombo,tab,table,tabletools,undo,wsc';*/
    config.plugins = 'iframedialog,dialogui,dialog,dialogadvtab,basicstyles,' +
        'blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,' +
        'templates,menu,contextmenu,div,resize,toolbar,elementspath,enterkey,entities,popup,' +
        'find,fakeobjects,floatingspace,listblock,richcombo,font,format,' +
        'horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,' +
        'justify,menubutton,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,' +
        'pastefromword,removeformat,save,selectall,showblocks,showborders,sourcearea,' +
        'specialchar,scayt,stylescombo,tab,table,tabletools,undo,wsc';
    config.skin = 'moono-lisa';
    //config.uiColor = '#F7B42C';
    config.toolbarGroups = [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'forms', groups: [ 'forms' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'LC_Template', groups: [] },
        { name: 'LC_Container', groups: [] },
        '/',
        { name: 'LC_Simple_G1', groups: [] },
        { name: 'LC_Simple_G2', groups: [] },
        { name: 'LC_Simple_G3', groups: [] }
    ];
    config.height=jQuery(".form-design-wraper").height()-112;
    config.fillEmptyBlocks = false;
    //去掉回车添加p标签,使用br
    config.enterMode = CKEDITOR.ENTER_BR ;
    config.shiftEnterMode =CKEDITOR.ENTER_BR;
    //config.autoParagraph = false;
    //取消内容过滤
    config.allowedContent = true;
    config.stylesSet = false;
    //config.autoParagraph = false;

    var themeVo=CKEditorUtility.GetThemeVo();
    //console.log(CKEditorUtility.GetThemeVo());
    var inputCssArray=[];
    /*inputCssArray.push(BaseUtility.GetRootPath()+"/static/Themes/Default/Css/HTMLDesignWysiwygForPlugins.css");*/
    //inputCssArray.push(BaseUtility.GetRootPath()+"/static/Themes/Default/Css/HTMLDesignRuntimeMain.css");

    for(var i=0;i<themeVo.refs.length;i++){
        var ref=themeVo.refs[i];
        if(ref.type=="css"){
            inputCssArray.push(ref.path.replace("${BasePath}",BaseUtility.GetRootPath()));
        }
    }

    inputCssArray.push(BaseUtility.GetRootPath()+"/static/Themes/Default/Css/HTMLDesignWysiwygMain.css");
    config.contentsCss = inputCssArray;//['','../../../Themes/Default/Css/HTMLDesignWysiwyg.css','../../../Themes/Default/Css/Jbuild4dPlatform.css'];
    //config.contentsCss =
    //,Source
    config.removeButtons = 'Maximize,Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,' +
        'Replace,Find,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Bold,Italic,' +
        'Underline,Strike,Subscript,Superscript,RemoveFormat,NumberedList,BulletedList,Indent,Outdent,Blockquote,CreateDiv,' +
        'JustifyBlock,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Flash,HorizontalRule,Smiley,SpecialChar,' +
        'PageBreak,Iframe,FontSize,Font,Format,Styles,BGColor,About,ShowBlocks';
};