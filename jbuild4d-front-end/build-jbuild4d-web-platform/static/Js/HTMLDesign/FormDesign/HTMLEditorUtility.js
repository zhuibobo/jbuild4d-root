class JsEditorUtility{
    static _HTMLEditorInst=null
    static GetHTMLEditorInst(){
        return this._HTMLEditorInst;
    }
    static SetHTMLEditorHTML(html){
        //debugger;
        if(!StringUtility.IsNullOrEmpty(html)) {
            this.GetHTMLEditorInst().setValue(html);
            //this.GetHTMLEditorInst().commands["selectAll"](myCodeMirror);
            CodeMirror.commands["selectAll"](this.GetHTMLEditorInst());
            var range = { from: this.GetHTMLEditorInst().getCursor(true), to: this.GetHTMLEditorInst().getCursor(false) };;
            this.GetHTMLEditorInst().autoFormatRange(range.from, range.to);
        }
    }
    static GetHtmlEditorHTML(){
        return this.GetHTMLEditorInst().getValue();
    }
    static InitializeHTMLCodeDesign() {
        var mixedMode = {
            name: "htmlmixed",
            scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                mode: null},
                {matches: /(text|application)\/(x-)?vb(a|script)/i,
                    mode: "vbscript"}]
        };
        this._HTMLEditorInst = CodeMirror.fromTextArea(document.getElementById("TextAreaHTMLEditor"), {
            mode: mixedMode,
            selectionPointer: true,
            theme: "monokai",
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            lineNumbers: true,
            lineWrapping: true
        });
        this._HTMLEditorInst.setSize("100%",PageStyleUtility.GetWindowHeight()-85);
        //$(".CodeMirror").height(PageStyleUtility.GetWindowHeight()-60);
        /**/
    }
}