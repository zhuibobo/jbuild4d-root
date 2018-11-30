/*字段绑定的Vue组件*/
Vue.component("fd-control-bind-to", {
    props:["bindToFieldProp","defaultValueProp","validateRulesProp"],
    data: function () {
        return {
            bindToField:{
                tableId: "",
                tableName: "",
                tableCaption: "",
                fieldName: "",
                fieldCaption: "",
                fieldDataType: "",
                fieldLength:""
            },
            validateRules:{
                msg:"",
                rules:[]
            },
            defaultValue: {
                defaultType: "",
                defaultValue: "",
                defaultText: "",
                text:""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        bindToProp :function(newValue) {
            console.log(newValue);
        },
        bindToFieldProp:function (newValue) {
            this.bindToField=newValue;
        },
        defaultValueProp:function (newValue) {
            this.defaultValue=newValue;
        },
        validateRulesProp:function (newValue) {
            this.validateRules=newValue;
        }
    },
    mounted:function(){
        this.bindToField=this.bindToFieldProp;
    },
    methods:{
        setCompleted:function(){
            this.$emit('on-set-completed', this.bindToField,this.defaultValue,this.validateRules)
        },
        /*绑定字段*/
        selectBindFieldView:function () {
            /*var url = BaseUtility.BuildAction("/PlatForm/SelectView/SelectBindToTableField/Select", {instanceName: "_SelectBindObj"});
            window.parent.JBuild4D.FormDesign.Dialog.ShowIframeDialogInDesignPage(window, url, {
                modal: true,
                title: "选择绑定字段"
            });*/
            JBuild4DSelectView.SelectBindToField.beginSelectInFrame(window,"_SelectBindObj",{});
            //将当前对象附着到window上,提供给子窗体使用
            window._SelectBindObj = this;
        },
        setSelectFieldResultValue:function (result) {
            //debugger;
            this.bindToField={};
            this.bindToField.fieldName=result.fieldName;
            this.bindToField.tableId=result.tableId;
            this.bindToField.tableName=result.tableName;
            this.bindToField.tableCaption=result.tableCaption;
            this.bindToField.fieldCaption=result.fieldCaption;
            this.bindToField.fieldDataType=result.fieldDataType;
            this.bindToField.fieldLength=result.fieldLength;
            this.setCompleted();
            //alert(result);
        },
        getSelectFieldResultValue:function () {
            return JsonUtility.CloneSimple(this.bindToField);
            //return this.bindTo;
        },
        /*绑定默认值*/
        selectDefaultValueView:function () {
            //var url = BaseUtility.BuildAction("/PlatForm/SelectView/SelectEnvVariable/Select", {instanceName: "_SelectBindObj"});
            //window.parent.JBuild4D.FormDesign.Dialog.ShowIframeDialogInDesignPage(window, url, {
            //    modal: true,
            //    title: "选择默认值"
            //});
            JBuild4DSelectView.SelectEnvVariable.beginSelectInFrame(window,"_SelectBindObj",{});
            //将当前对象附着到window上,提供给子窗体使用
            window._SelectBindObj = this;
        },
        setSelectEnvVariableResultValue:function(result){
            this.defaultValue.defaultType=result.Type;
            this.defaultValue.defaultValue=result.Value;
            this.defaultValue.defaultText=result.Text;
            this.defaultValue.text=JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType,this.defaultValue.defaultText);
            this.setCompleted();
        },
        /*绑定验证规则*/
        selectValidateRuleView:function () {
            JBuild4DSelectView.SelectValidateRule.beginSelectInFrame(window,"_SelectBindObj",{});
            //将当前对象附着到window上,提供给子窗体使用
            window._SelectBindObj = this;
        },
        setSelectValidateRuleResultValue:function (result) {
            if(result!=null){
                this.validateRules=result;
                this.setCompleted();
            }
            else{
                this.validateRules.msg="";
                this.validateRules.rules=[];
            }
        },
        getSelectValidateRuleResultValue:function () {
            return this.validateRules;
        }
    },
    template: '<table cellpadding="0" cellspacing="0" border="0" class="dialog-table-wraper">' +
                    '<colgroup>' +
                        '<col style="width: 100px" />' +
                        '<col style="width: 280px" />' +
                        '<col style="width: 100px" />' +
                        '<col />' +
                    '</colgroup>' +
                    '<tr>' +
                        '<td colspan="4">' +
                        '    绑定到表<button class="btn-select fright" v-on:click="selectBindFieldView">...</button>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>'+
                        '<td>表编号：</td>' +
                        '<td colspan="3">{{bindToField.tableId}}</td>' +
                    '</tr>'+
                    '<tr>' +
                        '<td>表名：</td>' +
                        '<td>{{bindToField.tableName}}</td>' +
                        '<td>表标题：</td>' +
                        '<td>{{bindToField.tableCaption}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>字段名：</td>' +
                        '<td>{{bindToField.fieldName}}</td>' +
                        '<td>字段标题：</td>' +
                        '<td>{{bindToField.fieldCaption}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>类型：</td>' +
                        '<td>{{bindToField.fieldDataType}}</td>' +
                        '<td>长度：</td>' +
                        '<td>{{bindToField.fieldLength}}</td>' +
                    '</tr>' +
                    '<tr>'+
                        '<td colspan="4">默认值<button class="btn-select fright" v-on:click="selectDefaultValueView">...</button></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="4" style="background-color: #ffffff">' +
                            '{{defaultValue.text}}'+
                        '</td>'+
                    '</tr>'+
                    '<tr>' +
                        '<td colspan="4">' +
                        '    校验规则<button class="btn-select fright" v-on:click="selectValidateRuleView">...</button>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td colspan="4" style="background-color: #ffffff">' +
                            '<table class="dialog-table-wraper">' +
                                '<colgroup>' +
                                    '<col style="width: 100px" />' +
                                    '<col />' +
                                '</colgroup>' +
                                '<tr>' +
                                    '<td style="text-align: center;">提示消息：</td>' +
                                    '<td>{{validateRules.msg}}</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td style="text-align: center;">验证类型</td>'+
                                    '<td style="background: #e8eaec;text-align: center;">参数</td>'+
                                '</tr>'+
                                '<tr v-for="ruleItem in validateRules.rules">' +
                                    '<td style="background: #ffffff;text-align: center;color: #ad9361">{{ruleItem.validateType}}</td>'+
                                    '<td style="background: #ffffff;text-align: center;"><p v-if="ruleItem.validateParas === \'\'">无参数</p><p v-else>{{ruleItem.validateParas}}</p></td>'+
                                '</tr>'+
                            '</table>' +
                        '</td>' +
                    '</tr>' +
                '</table>'
});

/*绑定一般信息的Vue组件*/
Vue.component("fd-control-base-info", {
    props:["baseInfoProp"],
    data: function () {
        return {
            baseInfo:{
                id:"",
                serialize:"",
                name:"",
                className:"",
                placeholder:"",
                readonly:"",
                disabled:"",
                style:"",
                desc:""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        baseInfo: function (newVal) {
            // 必须是input
            this.$emit('input', newVal)
        }
    },
    mounted:function(){
        this.baseInfo=this.baseInfoProp;
    },
    methods:{

    },
    template: '<table class="dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">' +
                    '<colgroup>' +
                        '<col style="width: 100px" />' +
                        '<col style="width: 280px" />' +
                        '<col style="width: 90px" />' +
                        '<col style="width: 110px" />' +
                        '<col style="width: 90px" />' +
                        '<col />' +
                    '</colgroup>' +
                    '<tr>' +
                        '<td>ID：</td>' +
                        '<td>' +
                            '<input type="text" v-model="baseInfo.id" />' +
                        '</td>' +
                        '<td>Serialize：</td>' +
                        '<td colspan="3">' +
                            '<radio-group type="button" style="margin: auto" v-model="baseInfo.serialize">' +
                                '<radio label="true">是</radio>' +
                                '<radio label="false">否</radio>' +
                            '</radio-group>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>Name：</td>' +
                        '<td><input type="text" v-model="baseInfo.name" /></td>' +
                        '<td>ClassName：</td>' +
                        '<td colspan="3"><input type="text" v-model="baseInfo.placeholder" /></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>Placeholder</td>' +
                        '<td><input type="text" v-model="baseInfo.className" /></td>' +
                        '<td>Readonly：</td>' +
                        '<td style="text-align: center">' +
                            '<radio-group type="button" style="margin: auto" v-model="baseInfo.readonly">' +
                                '<radio label="true">是</radio>' +
                                '<radio label="false">否</radio>' +
                            '</radio-group>' +
                        '</td>' +
                        '<td>Disabled：</td>' +
                        '<td style="text-align: center">' +
                            '<radio-group type="button" style="margin: auto" v-model="baseInfo.disabled">' +
                                '<radio label="true">是</radio>' +
                                '<radio label="false">否</radio>' +
                            '</radio-group>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>样式：</td>' +
                        '<td colspan="5">' +
                            '<textarea rows="7" v-model="baseInfo.style"></textarea>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>备注：</td>' +
                        '<td colspan="5">' +
                            '<textarea rows="8" v-model="baseInfo.desc"></textarea>' +
                        '</td>' +
                    '</tr>' +
        '</table>'
});
