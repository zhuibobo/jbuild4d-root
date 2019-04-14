/*查询字段绑定的Vue组件*/
Vue.component("list-search-control-bind-to", {
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
            },
            tempData:{
                defaultDisplayText:""
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
            if(!StringUtility.IsNullOrEmpty(this.defaultValue.defaultType)){
                this.tempData.defaultDisplayText=JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType,this.defaultValue.defaultText);
            }
        },
        validateRulesProp:function (newValue) {
            this.validateRules=newValue;
        }
    },
    mounted:function(){
        this.bindToField=this.bindToFieldProp;
        //var dataset=window.parent.listDesign.getDataSet();
    },
    methods:{
        setCompleted:function(){
            this.$emit('on-set-completed', this.bindToField,this.defaultValue,this.validateRules)
        },
        /*绑定字段*/
        selectBindFieldView:function () {
            //JBuild4DSelectView.SelectBindToField.beginSelectInFrame(window,"_SelectBindObj",{});
            //将当前对象附着到window上,提供给子窗体使用
            window._SelectBindObj = this;
            window.parent.appForm.selectBindToSingleFieldDialogBegin(window,this.getSelectFieldResultValue());
        },
        setSelectFieldResultValue:function (result) {
            //debugger;
            this.bindToField={};
            if(result!=null){
                this.bindToField.fieldName=result.fieldName;
                this.bindToField.tableId=result.tableId;
                this.bindToField.tableName=result.tableName;
                this.bindToField.tableCaption=result.tableCaption;
                this.bindToField.fieldCaption=result.fieldCaption;
                this.bindToField.fieldDataType=result.fieldDataType;
                this.bindToField.fieldLength=result.fieldLength;
            }
            else {
                this.bindToField.fieldName = "";
                this.bindToField.tableId = "";
                this.bindToField.tableName = "";
                this.bindToField.tableCaption = "";
                this.bindToField.fieldCaption = "";
                this.bindToField.fieldDataType = "";
                this.bindToField.fieldLength = "";
            }

            this.setCompleted();
            //alert(result);
        },
        getSelectFieldResultValue:function () {
            //debugger;
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
            if(result!=null) {
                this.defaultValue.defaultType = result.Type;
                this.defaultValue.defaultValue = result.Value;
                this.defaultValue.defaultText = result.Text;
                this.tempData.defaultDisplayText = JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
            }
            else {
                this.defaultValue.defaultType = "";
                this.defaultValue.defaultValue = "";
                this.defaultValue.defaultText = "";
                this.tempData.defaultDisplayText = "";
            }
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
    template: `<table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                    <colgroup>
                        <col style="width: 100px" />
                        <col style="width: 280px" />
                        <col />
                    </colgroup>
                    <tr>
                        <td>
                            标题：
                        </td>
                        <td>
                            <input type="text" />
                        </td>
                        <td rowspan="6">
                        
                        </td>
                    </tr>
                    <tr>
                        <td>
                            绑定字段：
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            字段名称：
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            运算符：
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            默认值：
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            备注：
                        </td>
                        <td>
                            <textarea rows="15"></textarea>
                        </td>
                    </tr>
                </table>`
});
