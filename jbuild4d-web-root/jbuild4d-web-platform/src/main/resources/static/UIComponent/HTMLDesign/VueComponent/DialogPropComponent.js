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
                defaultText: ""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        bindToProp (val) {
            //alert("1");
            console.log(val);
            //this.bindTo.tableName = val.tableName;
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
                            '{{JBuild4DSelectView.SelectEnvVariable.formatText(defaultValue.defaultType,defaultValue.defaultText)}}}'+
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
                                    '<td>提示消息：</td>' +
                                    '<td>{{validateRules.msg}}</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>验证类型</td>'+
                                    '<td>验证参数</td>'+
                                '</tr>'+
                                '<tr v-for="ruleItem in validateRules.rules">' +
                                    '<td>{{ruleItem.validateType}}</td>'+
                                    '<td>{{ruleItem.validateParas}}</td>'+
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
            bindToField:{
                tableId: "",
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        bindToProp (val) {
            //alert("1");
            console.log(val);
            //this.bindTo.tableName = val.tableName;
        }
    },
    mounted:function(){
        //this.bindToField=this.bindToFieldProp;
    },
    methods:{

    },
    template: '<table class="dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">' +
                    '<colgroup>' +
                        '<col style="width: 100px" />' +
                        '<col style="width: 280px" />' +
                        '<col style="width: 100px" />' +
                        '<col style="width: 100px" />' +
                        '<col style="width: 100px" />' +
                        '<col />' +
                    '</colgroup>' +
                    '<tr>' +
                        '<td>ID：</td>' +
                        '<td>' +
                            '<input type="text" />' +
                        '</td>' +
                        '<td>Serialize：</td>' +
                        '<td colspan="3"><!--<i-switch v-model="switch1" />--></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>Name：</td>' +
                        '<td><input type="text" /></td>' +
                        '<td>ClassName：</td>' +
                        '<td colspan="3"><input type="text" /></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>placeholder</td>' +
                        '<td><input type="text" /></td>' +
                        '<td>Readonly：</td>' +
                        '<td><!--<i-switch v-model="switch1" />--></td>' +
                        '<td>Disabled：</td>' +
                        '<td><!--<i-switch v-model="switch1" />--></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>样式：</td>' +
                        '<td colspan="5">' +
                            '<textarea rows="7"></textarea>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>备注：</td>' +
                        '<td colspan="5">' +
                            '<textarea rows="9"></textarea>' +
                        '</td>' +
                    '</tr>' +
        '</table>'
});
