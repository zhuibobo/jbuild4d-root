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
  inputCssArray.push(BaseUtility.GetRootPath() + "/static/Themes/Default/Css/HTMLDesignWysiwyg.css");

  for (var i = 0; i < themeVo.refs.length; i++) {
    var ref = themeVo.refs[i];

    if (ref.type == "css") {
      inputCssArray.push(ref.path.replace("${BasePath}", BaseUtility.GetRootPath()));
    }
  }

  config.contentsCss = inputCssArray;
  config.removeButtons = 'Maximize,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,' + 'Replace,Find,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Bold,Italic,' + 'Underline,Strike,Subscript,Superscript,RemoveFormat,NumberedList,BulletedList,Indent,Outdent,Blockquote,CreateDiv,' + 'JustifyBlock,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Flash,HorizontalRule,Smiley,SpecialChar,' + 'PageBreak,Iframe,FontSize,Font,Format,Styles,BGColor,About,ShowBlocks';
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yQ29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkNLRWRpdG9yQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbkNLRURJVE9SLmVkaXRvckNvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgY29uZmlnLnBsdWdpbnMgPSAnaWZyYW1lZGlhbG9nLGRpYWxvZ3VpLGRpYWxvZyxkaWFsb2dhZHZ0YWIsYmFzaWNzdHlsZXMsJyArICdibG9ja3F1b3RlLGNsaXBib2FyZCxidXR0b24scGFuZWxidXR0b24scGFuZWwsZmxvYXRwYW5lbCxjb2xvcmJ1dHRvbixjb2xvcmRpYWxvZywnICsgJ3RlbXBsYXRlcyxtZW51LGNvbnRleHRtZW51LGRpdixyZXNpemUsdG9vbGJhcixlbGVtZW50c3BhdGgsZW50ZXJrZXksZW50aXRpZXMscG9wdXAsJyArICdmaW5kLGZha2VvYmplY3RzLGZsb2F0aW5nc3BhY2UsbGlzdGJsb2NrLHJpY2hjb21ibyxmb250LGZvcm1hdCwnICsgJ2hvcml6b250YWxydWxlLGh0bWx3cml0ZXIsaWZyYW1lLHd5c2l3eWdhcmVhLGltYWdlLGluZGVudCxpbmRlbnRibG9jayxpbmRlbnRsaXN0LHNtaWxleSwnICsgJ2p1c3RpZnksbWVudWJ1dHRvbixsaW5rLGxpc3QsbGlzdHN0eWxlLG1hZ2ljbGluZSxtYXhpbWl6ZSxuZXdwYWdlLHBhZ2VicmVhayxwYXN0ZXRleHQsJyArICdwYXN0ZWZyb213b3JkLHJlbW92ZWZvcm1hdCxzYXZlLHNlbGVjdGFsbCxzaG93YmxvY2tzLHNob3dib3JkZXJzLHNvdXJjZWFyZWEsJyArICdzcGVjaWFsY2hhcixzY2F5dCxzdHlsZXNjb21ibyx0YWIsdGFibGUsdGFibGV0b29scyx1bmRvLHdzYyc7XG4gIGNvbmZpZy5za2luID0gJ21vb25vLWxpc2EnO1xuICBjb25maWcudG9vbGJhckdyb3VwcyA9IFt7XG4gICAgbmFtZTogJ2RvY3VtZW50JyxcbiAgICBncm91cHM6IFsnbW9kZScsICdkb2N1bWVudCcsICdkb2N0b29scyddXG4gIH0sIHtcbiAgICBuYW1lOiAnY2xpcGJvYXJkJyxcbiAgICBncm91cHM6IFsnY2xpcGJvYXJkJywgJ3VuZG8nXVxuICB9LCB7XG4gICAgbmFtZTogJ2VkaXRpbmcnLFxuICAgIGdyb3VwczogWydmaW5kJywgJ3NlbGVjdGlvbicsICdzcGVsbGNoZWNrZXInLCAnZWRpdGluZyddXG4gIH0sIHtcbiAgICBuYW1lOiAnZm9ybXMnLFxuICAgIGdyb3VwczogWydmb3JtcyddXG4gIH0sIHtcbiAgICBuYW1lOiAnYmFzaWNzdHlsZXMnLFxuICAgIGdyb3VwczogWydiYXNpY3N0eWxlcycsICdjbGVhbnVwJ11cbiAgfSwge1xuICAgIG5hbWU6ICdwYXJhZ3JhcGgnLFxuICAgIGdyb3VwczogWydsaXN0JywgJ2luZGVudCcsICdibG9ja3MnLCAnYWxpZ24nLCAnYmlkaScsICdwYXJhZ3JhcGgnXVxuICB9LCB7XG4gICAgbmFtZTogJ2xpbmtzJyxcbiAgICBncm91cHM6IFsnbGlua3MnXVxuICB9LCB7XG4gICAgbmFtZTogJ2luc2VydCcsXG4gICAgZ3JvdXBzOiBbJ2luc2VydCddXG4gIH0sIHtcbiAgICBuYW1lOiAnc3R5bGVzJyxcbiAgICBncm91cHM6IFsnc3R5bGVzJ11cbiAgfSwge1xuICAgIG5hbWU6ICdjb2xvcnMnLFxuICAgIGdyb3VwczogWydjb2xvcnMnXVxuICB9LCB7XG4gICAgbmFtZTogJ3Rvb2xzJyxcbiAgICBncm91cHM6IFsndG9vbHMnXVxuICB9LCB7XG4gICAgbmFtZTogJ290aGVycycsXG4gICAgZ3JvdXBzOiBbJ290aGVycyddXG4gIH0sIHtcbiAgICBuYW1lOiAnTENfVGVtcGxhdGUnLFxuICAgIGdyb3VwczogW11cbiAgfSwge1xuICAgIG5hbWU6ICdMQ19Db250YWluZXInLFxuICAgIGdyb3VwczogW11cbiAgfSwgJy8nLCB7XG4gICAgbmFtZTogJ0xDX1NpbXBsZScsXG4gICAgZ3JvdXBzOiBbXVxuICB9XTtcbiAgY29uZmlnLmhlaWdodCA9IGpRdWVyeShcIi5mb3JtLWRlc2lnbi13cmFwZXJcIikuaGVpZ2h0KCkgLSAxMTI7XG4gIGNvbmZpZy5maWxsRW1wdHlCbG9ja3MgPSBmYWxzZTtcbiAgY29uZmlnLmVudGVyTW9kZSA9IENLRURJVE9SLkVOVEVSX0JSO1xuICBjb25maWcuc2hpZnRFbnRlck1vZGUgPSBDS0VESVRPUi5FTlRFUl9CUjtcbiAgY29uZmlnLmFsbG93ZWRDb250ZW50ID0gdHJ1ZTtcbiAgY29uZmlnLnN0eWxlc1NldCA9IGZhbHNlO1xuICB2YXIgdGhlbWVWbyA9IENLRWRpdG9yVXRpbGl0eS5HZXRUaGVtZVZvKCk7XG4gIHZhciBpbnB1dENzc0FycmF5ID0gW107XG4gIGlucHV0Q3NzQXJyYXkucHVzaChCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvc3RhdGljL1RoZW1lcy9EZWZhdWx0L0Nzcy9IVE1MRGVzaWduV3lzaXd5Z0ZvclBsdWdpbnMuY3NzXCIpO1xuICBpbnB1dENzc0FycmF5LnB1c2goQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL3N0YXRpYy9UaGVtZXMvRGVmYXVsdC9Dc3MvSFRNTERlc2lnbld5c2l3eWcuY3NzXCIpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhlbWVWby5yZWZzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHJlZiA9IHRoZW1lVm8ucmVmc1tpXTtcblxuICAgIGlmIChyZWYudHlwZSA9PSBcImNzc1wiKSB7XG4gICAgICBpbnB1dENzc0FycmF5LnB1c2gocmVmLnBhdGgucmVwbGFjZShcIiR7QmFzZVBhdGh9XCIsIEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkpKTtcbiAgICB9XG4gIH1cblxuICBjb25maWcuY29udGVudHNDc3MgPSBpbnB1dENzc0FycmF5O1xuICBjb25maWcucmVtb3ZlQnV0dG9ucyA9ICdNYXhpbWl6ZSxTYXZlLE5ld1BhZ2UsUHJldmlldyxQcmludCxUZW1wbGF0ZXMsQ3V0LENvcHksUGFzdGUsUGFzdGVUZXh0LFBhc3RlRnJvbVdvcmQsVW5kbyxSZWRvLCcgKyAnUmVwbGFjZSxGaW5kLFNlbGVjdEFsbCxTY2F5dCxGb3JtLENoZWNrYm94LFJhZGlvLFRleHRGaWVsZCxUZXh0YXJlYSxTZWxlY3QsQnV0dG9uLEltYWdlQnV0dG9uLEhpZGRlbkZpZWxkLEJvbGQsSXRhbGljLCcgKyAnVW5kZXJsaW5lLFN0cmlrZSxTdWJzY3JpcHQsU3VwZXJzY3JpcHQsUmVtb3ZlRm9ybWF0LE51bWJlcmVkTGlzdCxCdWxsZXRlZExpc3QsSW5kZW50LE91dGRlbnQsQmxvY2txdW90ZSxDcmVhdGVEaXYsJyArICdKdXN0aWZ5QmxvY2ssQmlkaUx0cixCaWRpUnRsLExhbmd1YWdlLExpbmssVW5saW5rLEFuY2hvcixGbGFzaCxIb3Jpem9udGFsUnVsZSxTbWlsZXksU3BlY2lhbENoYXIsJyArICdQYWdlQnJlYWssSWZyYW1lLEZvbnRTaXplLEZvbnQsRm9ybWF0LFN0eWxlcyxCR0NvbG9yLEFib3V0LFNob3dCbG9ja3MnO1xufTsiXX0=
