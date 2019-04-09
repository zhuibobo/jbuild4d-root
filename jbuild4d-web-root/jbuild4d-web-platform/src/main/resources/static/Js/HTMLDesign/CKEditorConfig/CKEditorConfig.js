"use strict";

CKEDITOR.editorConfig = function (config) {
  config.plugins = 'iframedialog,dialogui,dialog,dialogadvtab,basicstyles,' + 'blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,' + 'templates,menu,contextmenu,div,resize,toolbar,elementspath,enterkey,entities,popup,' + 'find,fakeobjects,floatingspace,listblock,richcombo,font,format,' + 'horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,' + 'justify,menubutton,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,' + 'pastefromword,removeformat,save,selectall,showblocks,showborders,sourcearea,' + 'specialchar,scayt,stylescombo,tab,table,tabletools,undo,wsc';
  config.skin = 'moono-lisa';
  config.toolbarGroups = [{
    name: 'document',
    groups: ['mode', 'document', 'doctools']
  }, {
    name: 'clipboard',
    groups: ['clipboard', 'undo']
  }, {
    name: 'editing',
    groups: ['find', 'selection', 'spellchecker', 'editing']
  }, {
    name: 'forms',
    groups: ['forms']
  }, {
    name: 'basicstyles',
    groups: ['basicstyles', 'cleanup']
  }, {
    name: 'paragraph',
    groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
  }, {
    name: 'links',
    groups: ['links']
  }, {
    name: 'insert',
    groups: ['insert']
  }, {
    name: 'styles',
    groups: ['styles']
  }, {
    name: 'colors',
    groups: ['colors']
  }, {
    name: 'tools',
    groups: ['tools']
  }, {
    name: 'others',
    groups: ['others']
  }, {
    name: 'LC_Template',
    groups: []
  }, {
    name: 'LC_Container',
    groups: []
  }, '/', {
    name: 'LC_Simple',
    groups: []
  }];
  config.height = jQuery(".form-design-wraper").height() - 112;
  config.fillEmptyBlocks = false;
  config.enterMode = CKEDITOR.ENTER_BR;
  config.shiftEnterMode = CKEDITOR.ENTER_BR;
  config.allowedContent = true;
  config.stylesSet = false;
  var themeVo = CKEditorUtility.GetThemeVo();
  var inputCssArray = [];
  inputCssArray.push(BaseUtility.GetRootPath() + "/static/Themes/Default/Css/HTMLDesignWysiwygForPlugins.css");
  inputCssArray.push(BaseUtility.GetRootPath() + "/static/Themes/Default/Css/HTMLDesignRuntimeMain.css");
  inputCssArray.push(BaseUtility.GetRootPath() + "/static/Themes/Default/Css/HTMLDesignWysiwygMain.css");

  for (var i = 0; i < themeVo.refs.length; i++) {
    var ref = themeVo.refs[i];

    if (ref.type == "css") {
      inputCssArray.push(ref.path.replace("${BasePath}", BaseUtility.GetRootPath()));
    }
  }

  config.contentsCss = inputCssArray;
  config.removeButtons = 'Maximize,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,' + 'Replace,Find,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Bold,Italic,' + 'Underline,Strike,Subscript,Superscript,RemoveFormat,NumberedList,BulletedList,Indent,Outdent,Blockquote,CreateDiv,' + 'JustifyBlock,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Flash,HorizontalRule,Smiley,SpecialChar,' + 'PageBreak,Iframe,FontSize,Font,Format,Styles,BGColor,About,ShowBlocks';
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiQ0tFZGl0b3JDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuQ0tFRElUT1IuZWRpdG9yQ29uZmlnID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICBjb25maWcucGx1Z2lucyA9ICdpZnJhbWVkaWFsb2csZGlhbG9ndWksZGlhbG9nLGRpYWxvZ2FkdnRhYixiYXNpY3N0eWxlcywnICsgJ2Jsb2NrcXVvdGUsY2xpcGJvYXJkLGJ1dHRvbixwYW5lbGJ1dHRvbixwYW5lbCxmbG9hdHBhbmVsLGNvbG9yYnV0dG9uLGNvbG9yZGlhbG9nLCcgKyAndGVtcGxhdGVzLG1lbnUsY29udGV4dG1lbnUsZGl2LHJlc2l6ZSx0b29sYmFyLGVsZW1lbnRzcGF0aCxlbnRlcmtleSxlbnRpdGllcyxwb3B1cCwnICsgJ2ZpbmQsZmFrZW9iamVjdHMsZmxvYXRpbmdzcGFjZSxsaXN0YmxvY2sscmljaGNvbWJvLGZvbnQsZm9ybWF0LCcgKyAnaG9yaXpvbnRhbHJ1bGUsaHRtbHdyaXRlcixpZnJhbWUsd3lzaXd5Z2FyZWEsaW1hZ2UsaW5kZW50LGluZGVudGJsb2NrLGluZGVudGxpc3Qsc21pbGV5LCcgKyAnanVzdGlmeSxtZW51YnV0dG9uLGxpbmssbGlzdCxsaXN0c3R5bGUsbWFnaWNsaW5lLG1heGltaXplLG5ld3BhZ2UscGFnZWJyZWFrLHBhc3RldGV4dCwnICsgJ3Bhc3RlZnJvbXdvcmQscmVtb3ZlZm9ybWF0LHNhdmUsc2VsZWN0YWxsLHNob3dibG9ja3Msc2hvd2JvcmRlcnMsc291cmNlYXJlYSwnICsgJ3NwZWNpYWxjaGFyLHNjYXl0LHN0eWxlc2NvbWJvLHRhYix0YWJsZSx0YWJsZXRvb2xzLHVuZG8sd3NjJztcbiAgY29uZmlnLnNraW4gPSAnbW9vbm8tbGlzYSc7XG4gIGNvbmZpZy50b29sYmFyR3JvdXBzID0gW3tcbiAgICBuYW1lOiAnZG9jdW1lbnQnLFxuICAgIGdyb3VwczogWydtb2RlJywgJ2RvY3VtZW50JywgJ2RvY3Rvb2xzJ11cbiAgfSwge1xuICAgIG5hbWU6ICdjbGlwYm9hcmQnLFxuICAgIGdyb3VwczogWydjbGlwYm9hcmQnLCAndW5kbyddXG4gIH0sIHtcbiAgICBuYW1lOiAnZWRpdGluZycsXG4gICAgZ3JvdXBzOiBbJ2ZpbmQnLCAnc2VsZWN0aW9uJywgJ3NwZWxsY2hlY2tlcicsICdlZGl0aW5nJ11cbiAgfSwge1xuICAgIG5hbWU6ICdmb3JtcycsXG4gICAgZ3JvdXBzOiBbJ2Zvcm1zJ11cbiAgfSwge1xuICAgIG5hbWU6ICdiYXNpY3N0eWxlcycsXG4gICAgZ3JvdXBzOiBbJ2Jhc2ljc3R5bGVzJywgJ2NsZWFudXAnXVxuICB9LCB7XG4gICAgbmFtZTogJ3BhcmFncmFwaCcsXG4gICAgZ3JvdXBzOiBbJ2xpc3QnLCAnaW5kZW50JywgJ2Jsb2NrcycsICdhbGlnbicsICdiaWRpJywgJ3BhcmFncmFwaCddXG4gIH0sIHtcbiAgICBuYW1lOiAnbGlua3MnLFxuICAgIGdyb3VwczogWydsaW5rcyddXG4gIH0sIHtcbiAgICBuYW1lOiAnaW5zZXJ0JyxcbiAgICBncm91cHM6IFsnaW5zZXJ0J11cbiAgfSwge1xuICAgIG5hbWU6ICdzdHlsZXMnLFxuICAgIGdyb3VwczogWydzdHlsZXMnXVxuICB9LCB7XG4gICAgbmFtZTogJ2NvbG9ycycsXG4gICAgZ3JvdXBzOiBbJ2NvbG9ycyddXG4gIH0sIHtcbiAgICBuYW1lOiAndG9vbHMnLFxuICAgIGdyb3VwczogWyd0b29scyddXG4gIH0sIHtcbiAgICBuYW1lOiAnb3RoZXJzJyxcbiAgICBncm91cHM6IFsnb3RoZXJzJ11cbiAgfSwge1xuICAgIG5hbWU6ICdMQ19UZW1wbGF0ZScsXG4gICAgZ3JvdXBzOiBbXVxuICB9LCB7XG4gICAgbmFtZTogJ0xDX0NvbnRhaW5lcicsXG4gICAgZ3JvdXBzOiBbXVxuICB9LCAnLycsIHtcbiAgICBuYW1lOiAnTENfU2ltcGxlJyxcbiAgICBncm91cHM6IFtdXG4gIH1dO1xuICBjb25maWcuaGVpZ2h0ID0galF1ZXJ5KFwiLmZvcm0tZGVzaWduLXdyYXBlclwiKS5oZWlnaHQoKSAtIDExMjtcbiAgY29uZmlnLmZpbGxFbXB0eUJsb2NrcyA9IGZhbHNlO1xuICBjb25maWcuZW50ZXJNb2RlID0gQ0tFRElUT1IuRU5URVJfQlI7XG4gIGNvbmZpZy5zaGlmdEVudGVyTW9kZSA9IENLRURJVE9SLkVOVEVSX0JSO1xuICBjb25maWcuYWxsb3dlZENvbnRlbnQgPSB0cnVlO1xuICBjb25maWcuc3R5bGVzU2V0ID0gZmFsc2U7XG4gIHZhciB0aGVtZVZvID0gQ0tFZGl0b3JVdGlsaXR5LkdldFRoZW1lVm8oKTtcbiAgdmFyIGlucHV0Q3NzQXJyYXkgPSBbXTtcbiAgaW5wdXRDc3NBcnJheS5wdXNoKEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9zdGF0aWMvVGhlbWVzL0RlZmF1bHQvQ3NzL0hUTUxEZXNpZ25XeXNpd3lnRm9yUGx1Z2lucy5jc3NcIik7XG4gIGlucHV0Q3NzQXJyYXkucHVzaChCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvc3RhdGljL1RoZW1lcy9EZWZhdWx0L0Nzcy9IVE1MRGVzaWduUnVudGltZU1haW4uY3NzXCIpO1xuICBpbnB1dENzc0FycmF5LnB1c2goQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL3N0YXRpYy9UaGVtZXMvRGVmYXVsdC9Dc3MvSFRNTERlc2lnbld5c2l3eWdNYWluLmNzc1wiKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoZW1lVm8ucmVmcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciByZWYgPSB0aGVtZVZvLnJlZnNbaV07XG5cbiAgICBpZiAocmVmLnR5cGUgPT0gXCJjc3NcIikge1xuICAgICAgaW5wdXRDc3NBcnJheS5wdXNoKHJlZi5wYXRoLnJlcGxhY2UoXCIke0Jhc2VQYXRofVwiLCBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpKSk7XG4gICAgfVxuICB9XG5cbiAgY29uZmlnLmNvbnRlbnRzQ3NzID0gaW5wdXRDc3NBcnJheTtcbiAgY29uZmlnLnJlbW92ZUJ1dHRvbnMgPSAnTWF4aW1pemUsU2F2ZSxOZXdQYWdlLFByZXZpZXcsUHJpbnQsVGVtcGxhdGVzLEN1dCxDb3B5LFBhc3RlLFBhc3RlVGV4dCxQYXN0ZUZyb21Xb3JkLFVuZG8sUmVkbywnICsgJ1JlcGxhY2UsRmluZCxTZWxlY3RBbGwsU2NheXQsRm9ybSxDaGVja2JveCxSYWRpbyxUZXh0RmllbGQsVGV4dGFyZWEsU2VsZWN0LEJ1dHRvbixJbWFnZUJ1dHRvbixIaWRkZW5GaWVsZCxCb2xkLEl0YWxpYywnICsgJ1VuZGVybGluZSxTdHJpa2UsU3Vic2NyaXB0LFN1cGVyc2NyaXB0LFJlbW92ZUZvcm1hdCxOdW1iZXJlZExpc3QsQnVsbGV0ZWRMaXN0LEluZGVudCxPdXRkZW50LEJsb2NrcXVvdGUsQ3JlYXRlRGl2LCcgKyAnSnVzdGlmeUJsb2NrLEJpZGlMdHIsQmlkaVJ0bCxMYW5ndWFnZSxMaW5rLFVubGluayxBbmNob3IsRmxhc2gsSG9yaXpvbnRhbFJ1bGUsU21pbGV5LFNwZWNpYWxDaGFyLCcgKyAnUGFnZUJyZWFrLElmcmFtZSxGb250U2l6ZSxGb250LEZvcm1hdCxTdHlsZXMsQkdDb2xvcixBYm91dCxTaG93QmxvY2tzJztcbn07Il19
