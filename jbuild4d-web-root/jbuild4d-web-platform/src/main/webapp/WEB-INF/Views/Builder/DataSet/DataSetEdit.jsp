<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/8/7
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/Views/TagLibs/TagLib.jsp" %>
<html>
<head>
    <title>Title</title>
    <%@ include file="/WEB-INF/Views/TagLibs/GeneralLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/IViewLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/JQueryUILib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ZTreeLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/EditTable.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
</head>
<body>
<div id="appForm" v-cloak>
    <div class="list-2column">
        <div class="left-outer-wrap-c" style="bottom: 50px;width: 335px;">
            <divider orientation="left" :dashed="true" style="font-size: 12px;padding: 10px">表信息</divider>
            <i-form :model="tableEntity" :label-width="90" style="margin-right: 10px">
                <form-item label="标题：" prop="">
                    <i-input v-model="tableEntity.tableCaption"></i-input>
                </form-item>
                <form-item label="表名：" prop="">
                    <i-input v-model="tableEntity.tableName"></i-input>
                </form-item>
                <form-item label="创建时间：">
                    <date-picker type="date" placeholder="选择创建时间" v-model="tableEntity.tableCreateTime" disabled
                                 readonly style="width: 100%"></date-picker>
                </form-item>
                <form-item label="创建人：">
                    <i-input v-model="tableEntity.tableCreater"></i-input>
                </form-item>
                <form-item label="修改时间：">
                    <date-picker type="date" placeholder="选择创建时间" v-model="tableEntity.tableUpdateTime" disabled
                                 readonly style="width: 100%"></date-picker>
                </form-item>
                <form-item label="修改人：">
                    <i-input v-model="tableEntity.tableUpdater"></i-input>
                </form-item>
                <form-item label="系统表：">
                    <i-input v-model="tableEntity.tableIssystem" readonly></i-input>
                </form-item>
                <form-item label="备注：">
                    <i-input v-model="tableEntity.tableDesc" type="textarea" :autosize="{minRows: 10,maxRows: 10}"></i-input>
                </form-item>
            </i-form>
        </div>
        <div class="right-outer-wrap-c" style="bottom: 50px;left: 350px;padding: 10px">
            <tabs value="Const">
                <tab-pane label="SQL数据集" name="Const" >
                    <div style="width: 100%;height: 60px">
                        <div style="float:left;width: 85%;border: red 1px solid;border-radius: 4px;height: 50px">
                            SQL语句
                        </div>
                        <div @click="designSQL" style="float: left;width: 6%;border: red 1px solid;border-radius: 4px;height: 50px;text-align: center;line-height: 50px;margin-left: 10px;cursor: pointer">
                            编辑
                        </div>
                        <div style="float: left;width: 6%;border: red 1px solid;border-radius: 4px;height: 50px;text-align: center;line-height: 50px;margin-left: 10px;cursor: pointer">
                            解析
                        </div>
                    </div>
                </tab-pane>
                <tab-pane label="API数据集" name="DateTime">
                </tab-pane>
                <tab-pane label="REST数据集" name="ApiVar">
                </tab-pane>
                <tab-pane label="自定义数据集" name="Cust">
                </tab-pane>
            </tabs>
            <div style="width: 100%">
                <div style="float: right;margin-bottom: 8px">
                    <button-group>
                        <i-button size="small" type="success" icon="md-add" @click="addField"></i-button>
                        <i-button size="small" type="primary" icon="md-close" @click="removeField"></i-button>
                        <i-button size="small" type="primary" icon="ios-arrow-up" @click="moveField('up')"></i-button>
                        <i-button size="small" type="primary" icon="ios-arrow-down" @click="moveField('down')"></i-button>
                    </button-group>
                </div>
                <div style="clear: bottom"></div>
            </div>
            <div id="divEditTable" class="edit-table-wrap" style="height: 100px;overflow: auto;width: 100%"></div>
        </div>
    </div>
    <div style="position: absolute;bottom: 0px;width: 100%;text-align: center">
        <i-button type="primary" @click="saveEditTable()"> 保 存</i-button>
        <i-button style="margin-left: 8px" @click="handleClose()">关 闭</i-button>
    </div>
</div>
<script>
    var appForm = new Vue({
        el:"#appForm",
        data:{
            currUserEntity:${currUserEntity},
            tableEntity:{
                tableId:'${tableEntity.tableId}',
                tableCaption:'${tableEntity.tableCaption}',
                tableName:'${tableEntity.tableName}'==''?'${tablePrefix}':'${tableEntity.tableName}',
                tableCreateTime:'<fmt:formatDate value="${tableEntity.tableCreateTime}" pattern="yyyy-MM-dd" />' == '' ? DateUtility.GetCurrentDataString("-") : '<fmt:formatDate value="${tableEntity.tableCreateTime}" pattern="yyyy-MM-dd" />',
                tableCreater:'${tableEntity.tableCreater}',
                tableUpdateTime:'<fmt:formatDate value="${tableEntity.tableCreateTime}" pattern="yyyy-MM-dd" />' == '' ? DateUtility.GetCurrentDataString("-") : '<fmt:formatDate value="${tableEntity.tableCreateTime}" pattern="yyyy-MM-dd" />',
                tableUpdater:'',
                tableType:'',
                tableIssystem:'${tableEntity.tableIssystem}' == '' ? '否' : '${tableEntity.tableIssystem}',
                tableDesc: '${tableEntity.tableDesc}',
                tableGroupId:'${tableEntity.tableGroupId}'
            },
            editTableObj:null,
            editTableConfig:{
                Status:"Edit",//状态 编辑 Edit 浏览 View
                DataField:"fieldName",
                //AddAfterRowEvent:TableDetailUtil.AfterInitEvent,
                Templates:[
                    {
                        Title:"字段ID",
                        BindName:"fieldId",
                        Renderer:"EditTable_Label",
                        TitleCellClassName:"TitleCell",
                        DefaultValue:{
                            Type:"GUID",
                            Value:0
                        },
                        Hidden:true
                    },
                    {
                        Title:"名称",
                        BindName:"fieldCaption",
                        Renderer:"EditTable_TextBox",
                        TitleCellClassName:"TitleCell",
                        Validate:{
                            Type:"NotEmpty"
                        },
                        Hidden:false,
                        TitleCellAttrs:{},
                        Style:{
                            width:150
                        }
                    },{
                        Title:"标题",
                        BindName:"fieldName",
                        Renderer:"EditTable_FieldName",
                        Validate:{
                            Type:"SQLKeyWord"
                        },
                        DefaultValue:{
                            Type:"Const",
                            Value:"F_"
                        },
                        Style:{
                            width:150
                        },
                        Hidden:false
                    },{
                        Title:"备注",
                        BindName:"fieldAllowNull",
                        Renderer:"EditTable_CheckBox",
                        Hidden:false,
                        IsCNValue:true,
                        DefaultValue:{
                            Type:"Const",
                            Value:"是"
                        },
                        Style:{
                            width:80,
                            textAlign:"center"
                        }
                    },{
                        Title:"默认值",
                        BindName:"fieldDefaultEntity.fieldDefaultValue",
                        Renderer:"EditTable_SelectDefaultValue",
                        Hidden:false
                    }
                ],
                RowIdCreater:function(){

                },
                TableClass:"edit-table",
                RendererTo:"divEditTable",//div elem
                TableId:"TableFields",
                TableAttrs:{cellpadding:"1",cellspacing:"1",border:"1"}
            },
            status: '${op}'
        },
        mounted:function () {
            this.editTableObj=Object.create(EditTable);
            this.editTableObj.Initialization(this.editTableConfig);
            if(this.status=="add"){
                //this.editTableObj.LoadJsonData(this.templateFieldGroup[this.useTemplateName]);
                this.tableEntity.tableCreater=this.currUserEntity.userName;
                this.tableEntity.tableUpdater=this.currUserEntity.userName;
            }
            else {
                //this.editTableObj.LoadJsonData(this.tableFieldsData);
                this.tableEntity.tableUpdater=this.currUserEntity.userName;
            }
            $("#divEditTable").height($(".right-outer-wrap-c").height()-185);
        },
        methods:{
            addField:function(){
                this.editTableObj.AddEditingRowByTemplate();
            },
            removeField:function () {
                this.editTableObj.RemoveRow();
            },
            moveField:function (type) {
                var editRow=this.editTableObj.GetEditRow();
                if(editRow!=null){
                    var _self=this;
                    var rowId=editRow.attr("id");
                    var fieldId=this.editTableObj.GetSelectRowDataByRowId(rowId).fieldId;
                    var url = '/PlatForm/Builder/DataStorage/DataBase/Table/Move.do';
                    AjaxUtility.Post(url, {recordId: fieldId,type:type}, function (result) {
                        if (result.success) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                if(type=="down") {
                                    _self.editTableObj.MoveDown();
                                }else{
                                    _self.editTableObj.MoveUp();
                                }
                            });
                        }
                        else {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message,null);
                        }
                    }, "json");
                }
            },
            saveEditTable:function () {
                if(this.tableEntity.tableCaption.replace(/(^\s*)|(\s*$)/g, "")==""){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{}, "表标题不能为空！",null);
                    return false;
                }
                if(/^[a-zA-Z][a-zA-Z0-9_]{0,}$/.test(this.tableEntity.tableName) == false){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{}, "表名称不能为空且只能是字母、下划线、数字并以字母开头！",null);
                    return false;
                }

                if (this.editTableObj.CompletedEditingRow()) {
                    console.log(this.editTableObj.GetSerializeJson());
                    var sendData = {
                        op: this.status,
                        ignorePhysicalError:this.ignorePhysicalError,
                        tableEntityJson: encodeURIComponent(JSON.stringify(this.tableEntity)),
                        fieldVoListJson: encodeURIComponent(JSON.stringify(this.editTableObj.GetSerializeJson()))
                    };
                    //return;
                    var url = '/PlatForm/Builder/DataStorage/DataBase/Table/SaveTableEdit.do';
                    AjaxUtility.Post(url, sendData, function (result) {
                        //debugger;
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                            if (result.success) {
                                window.OpenerWindowObj.appList.reloadData();
                                DialogUtility.Frame_CloseDialog(window);
                            }
                        });
                    }, "json");
                }
            },
            handleClose: function () {
                DialogUtility.Frame_CloseDialog(window);
            },
            designSQL:function () {
                var url=BaseUtility.BuildUrl("/PlatForm/Builder/DataSet/DataSetDesign/SQLDesigner.do");
                DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "编辑SQL语句",modal:true}, 1);
            }
        }
    });
</script>
</body>
</html>
