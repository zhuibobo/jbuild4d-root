Vue.component("fd-control-bind-to", {
    props:["bindToProp"],
    data: function () {
        return {
            bindTo:{
                tableId: "",
                tableName: "",
                tableCaption: "",
                fieldName: "",
                fieldCaption: "",
                fieldDataType: "",
                fieldLength:""
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
        this.bindTo=this.bindToProp;
    },
    methods:{
        selectBindFieldView:function () {
            var url = BaseUtility.BuildAction("/PlatForm/SelectView/SelectBindToTableField/Select", {instanceName: "_SelectBindObj"});
            window.parent.JBuild4D.FormDesign.Dialog.ShowIframeDialogInDesignPage(window, url, {
                modal: true,
                title: "选择绑定字段"
            });
            //将当前对象附着到window上,提供给子窗体使用
            window._SelectBindObj = this;
        },
        setSelectFieldResultValue:function (result) {
            //debugger;
            this.bindTo={};
            this.bindTo.fieldName=result.fieldName;
            this.bindTo.tableId=result.tableId;
            this.bindTo.tableName=result.tableName;
            this.bindTo.tableCaption=result.tableCaption;
            this.bindTo.fieldCaption=result.fieldCaption;
            this.bindTo.fieldDataType=result.fieldDataType;
            this.bindTo.fieldLength=result.fieldLength;
            this.$emit('on-select-field-completed', this.bindTo)
            //alert(result);
        },
        getSelectFieldResultValue:function () {
            return JsonUtility.CloneSimple(this.bindTo);
            //return this.bindTo;
        },
        selectDefaultValueView:function () {
            var url = BaseUtility.BuildAction("/PlatForm/SelectView/SelectEnvVariable/Select", {instanceName: "_SelectBindObj"});
            window.parent.JBuild4D.FormDesign.Dialog.ShowIframeDialogInDesignPage(window, url, {
                modal: true,
                title: "选择默认值"
            });
            //将当前对象附着到window上,提供给子窗体使用
            window._SelectBindObj = this;
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
                        '<td colspan="3">{{bindTo.tableId}}</td>' +
                    '</tr>'+
                    '<tr>' +
                        '<td>表名：</td>' +
                        '<td>{{bindTo.tableName}}</td>' +
                        '<td>表标题：</td>' +
                        '<td>{{bindTo.tableCaption}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>字段名：</td>' +
                        '<td>{{bindTo.fieldName}}</td>' +
                        '<td>字段标题：</td>' +
                        '<td>{{bindTo.fieldCaption}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>类型：</td>' +
                        '<td>{{bindTo.fieldDataType}}</td>' +
                        '<td>长度：</td>' +
                        '<td>{{bindTo.fieldLength}}</td>' +
                    '</tr>' +
                    '<tr>'+
                        '<td colspan="4">默认值</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="4" style="background-color: #ffffff">' +
                            '<button class="btn-select fright" v-on:click="selectDefaultValueView">...</button>'+
                        '</td>'+
                    '</tr>'+
                    '<tr>' +
                        '<td colspan="4">' +
                        '    校验规则<button class="btn-select fright">...</button>' +
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
                                    '<td>类型：</td>' +
                                    '<td></td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>设置：</td>' +
                                    '<td></td>' +
                                '</tr>' +
                            '</table>' +
                        '</td>' +
                    '</tr>' +
                '</table>'
});