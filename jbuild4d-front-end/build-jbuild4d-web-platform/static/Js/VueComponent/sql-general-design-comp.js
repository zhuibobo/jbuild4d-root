/*SQL编辑控件*/
Vue.component("sql-general-design-comp", {
    props:["sqlDesignerHeight","value"],
    data:function(){
        return {
            sqlText:"",
            selectedItemValue:"说明",
            selfTableFields:[],
            parentTableFields:[]
        }
    },
    watch: {
        sqlText: function (newVal) {
            // 必须是input
            this.$emit('input', newVal)
        },
        value:function (newVal) {
            this.sqlText=newVal;
            //this.setValue(newVal);
        }
    },
    mounted:function(){
        this.sqlCodeMirror = CodeMirror.fromTextArea($("#TextAreaSQLEditor")[0], {
            mode: "text/x-sql",
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            theme: "monokai"
        });
        this.sqlCodeMirror.setSize("100%", this.sqlDesignerHeight);
        var _self=this;
        this.sqlCodeMirror.on("change",function (cMirror) {
            console.log(cMirror.getValue());
            _self.sqlText=cMirror.getValue();
        });
        //this.sqlCodeMirror.setValue("123123");
    },
    methods:{
        getValue:function () {
            this.sqlCodeMirror.getValue();
        },
        setValue:function (value) {
            this.sqlCodeMirror.setValue(value);
        },
        setAboutTableFields:function(selfTableFields,parentTableFields){
            this.selfTableFields=selfTableFields;
            this.parentTableFields=parentTableFields;
        },
        insertEnvToEditor:function (code) {
            this.insertCodeAtCursor(code);
        },
        insertFieldToEditor:function(sourceType,event){
            var sourceFields=null;
            if(sourceType=="selfTableFields"){
                sourceFields=this.selfTableFields;
            }
            else{
                sourceFields=this.parentTableFields;
            }
            for(var i=0;i<sourceFields.length;i++){
                if(sourceFields[i].fieldName==event){
                    this.insertCodeAtCursor(sourceFields[i].tableName+"."+sourceFields[i].fieldName);
                }
            }
        },
        insertCodeAtCursor:function(code){
            var doc = this.sqlCodeMirror.getDoc();
            var cursor = doc.getCursor();
            doc.replaceRange(code, cursor);
        }
    },
    template:'<div>\
                <textarea id="TextAreaSQLEditor"></textarea>\
                <div style="text-align: right;margin-top: 8px">\
                    <ButtonGroup size="small">\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户所在组织ID}\')">组织Id</Button>\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户所在组织名称}\')">组织名称</Button>\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户ID}\')">用户Id</Button>\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户名称}\')">用户名称</Button>\
                        <Button @click="insertEnvToEditor(\'#{DateTime.年年年年-月月-日日}\')">yyyy-MM-dd</Button>\
                        <Button>说明</Button>\
                    </ButtonGroup>\
                </div>\
                <div style="margin-top: 8px">\
                    <div style="float: left;margin: 4px 10px">本表字段</div>\
                    <div style="float: left">\
                        <i-select placeholder="默认使用Id字段" size="small" style="width:175px" @on-change="insertFieldToEditor(\'selfTableFields\',$event)">\
                            <i-option v-for="item in selfTableFields" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>\
                        </i-select>\
                    </div>\
                    <div style="float: left;margin: 4px 10px">父表字段</div>\
                    <div style="float: left">\
                        <i-select placeholder="默认使用Id字段" size="small" style="width:177px" @on-change="insertFieldToEditor(\'parentTableFields\',$event)">\
                            <i-option v-for="item in parentTableFields" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>\
                        </i-select>\
                    </div>\
                </div>\
              </div>'
});
