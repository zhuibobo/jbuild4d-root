class HTMLEditorUtility{
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
            var range = { from: this.GetHTMLEditorInst().getCursor(true), to: this.GetHTMLEditorInst().getCursor(false)};;
            this.GetHTMLEditorInst().autoFormatRange(range.from, range.to);

            var a1 = {line: 0, ch: 2 };
            //var a2 = {line: 3, ch: 5 };
            //var b1 = {line: 5, ch: 0 };
            //var b2 = {line: 7, ch: 0 };
            //var c = [{ 'anchor': a1, 'head': a2}];
            //var c = [{'anchor': a1}];
            //this.GetHTMLEditorInst().getDoc().setSelections(c);
            this.GetHTMLEditorInst().getDoc().eachLine(function (line) {
                //debugger;
                //console.log(line);
                //console.log(index);
            });

            //尝试获取CKEditor编辑器中选中的元素
            var selectedElem=CKEditorUtility.GetSelectedElem();
            var searchHTML="";
            if(selectedElem) {
                searchHTML=selectedElem.outerHTML().split(">")[0];
                //alert(searchHTML);
            }
            console.log("-------------------------------");
            var cursor=this.GetHTMLEditorInst().getSearchCursor(searchHTML);
            cursor.findNext();
            console.log(cursor);
            console.log(cursor.from()+"|"+cursor.to());
            if(cursor.from()&&cursor.to()) {
                this.GetHTMLEditorInst().getDoc().setSelection(cursor.from(), cursor.to());
            }
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