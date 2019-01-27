class JsEditorUtility{

    static _JsEditorInst=null;

    static _GetNewFormJsString(){
        return "<script>var FormPageObjectInstance={" +
            "data:{" +
            "userEntity:{}," +
            "formEntity:[]," +
            "config:[]" +
            "}," +
            "pageReady:function(){}," +
            "bindRecordDataReady:function(){}," +
            "validateEveryFromControl:function(controlObj){}" +
            "}</script>";

    }

    static GetJsEditorInst () {
        return this._JsEditorInst;
    }

    static SetJsEditorJs (js) {
        this.GetJsEditorInst().setValue(js);
    }

    static GetJsEditorJs () {
        return this.GetJsEditorInst().getValue();
    }

    static InitializeJsCodeDesign (status) {
        this._JsEditorInst=CodeMirror.fromTextArea($("#TextAreaJsEditor")[0], {
            //mode: "javascript",
            mode: "application/ld+json",
            lineNumbers: true,
            lineWrapping: true,
            extraKeys: {
                "Ctrl-Q": function (cm) {
                    cm.foldCode(cm.getCursor());
                }
            },
            foldGutter: true,
            smartIndent:true,
            matchBrackets: true,
            theme: "monokai",
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
        this._JsEditorInst.setSize("100%",PageStyleUtility.GetWindowHeight()-85);
        if(status=="add"){
            this.SetJsEditorJs(this._GetNewFormJsString());
            CodeMirror.commands["selectAll"](this.GetJsEditorInst());
            var range = { from: this.GetJsEditorInst().getCursor(true), to: this.GetJsEditorInst().getCursor(false) };
            this.GetJsEditorInst().autoFormatRange(range.from, range.to);
        }
    }
}