/*Js编辑器代码段组件*/
Vue.component("js-design-code-fragment", {
    data: function () {
        return {
            jsEditorInstance:null
        }
    },
    mounted:function(){
    },
    methods:{
        setJSEditorInstance:function (obj) {
            this.jsEditorInstance=obj;
        },
        getJsEditorInst:function(){
            return this.jsEditorInstance;
        },
        insertJs:function(js){
            var doc = this.getJsEditorInst().getDoc();
            var cursor = doc.getCursor();
            doc.replaceRange(js, cursor);
        },
        formatJS:function () {
            CodeMirror.commands["selectAll"](this.getJsEditorInst());
            var range = { from: this.getJsEditorInst().getCursor(true), to: this.getJsEditorInst().getCursor(false) };;
            this.getJsEditorInst().autoFormatRange(range.from, range.to);
        },
        alertDesc:function () {

        },
        refScript:function () {
            var js="<script type=\"text/javascript\" src=\"${contextPath}/UIComponent/TreeTable/Js/TreeTable.js\"></script>";
            this.insertJs(js);
        },
        callServiceMethod:function () {

        }
    },
    template: '<div class="js-code-fragment-wrap">\
            <div class="js-code-fragment-item" @click="formatJS">格式化</div>\
            <div class="js-code-fragment-item">说明</div>\
            <div class="js-code-fragment-item" @click="refScript">引入脚本</div>\
            <div class="js-code-fragment-item">获取URL参数</div>\
            <div class="js-code-fragment-item">调用服务方法</div>\
            <div class="js-code-fragment-item">加载数据字典</div>\
        </div>'
});
