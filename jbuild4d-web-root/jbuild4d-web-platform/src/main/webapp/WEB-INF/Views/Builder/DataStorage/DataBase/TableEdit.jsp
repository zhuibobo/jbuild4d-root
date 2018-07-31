<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/30
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
    <div id="appForm">
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
                <divider orientation="left" :dashed="true" style="font-size: 12px">表字段</divider>
                <div style="width: 100%">
                    <div style="float: right;margin-bottom: 8px">
                        <i-select v-model="model2" size="small" style="width:100px">
                            <i-option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                        </i-select>
                        <button-group>
                            <i-button size="small" type="primary" icon="md-add" @click="addField"></i-button>
                            <i-button size="small" type="primary" icon="md-close"></i-button>
                        </button-group>
                    </div>
                    <div style="clear: bottom"></div>
                </div>
                <div id="divEditTable" class="edit-table-wrap" style="height: 100px;overflow: auto;width: 100%"></div>
            </div>
        </div>
        <div style="position: absolute;bottom: 0px;width: 100%;text-align: center">
            <i-button type="primary"> 保 存</i-button>
            <i-button style="margin-left: 8px">关 闭</i-button>
        </div>
    </div>
    <script>
        var appForm = new Vue({
            el:"#appForm",
            data:{
                tableEntity:{
                    tableId:'${tableEntity.tableId}',
                    tableCaption:'${tableEntity.tableCaption}',
                    tableName:'${tableEntity.tableName}',
                    tableCreateTime:'<fmt:formatDate value="${tableEntity.tableCreateTime}" pattern="yyyy-MM-dd" />' == '' ? DateUtility.GetCurrentDataString("-") : '<fmt:formatDate value="${tableEntity.tableCreateTime}" pattern="yyyy-MM-dd" />',
                    tableCreater:'${tableEntity.tableCreater}',
                    tableUpdateTime:'<fmt:formatDate value="${tableEntity.tableCreateTime}" pattern="yyyy-MM-dd" />' == '' ? DateUtility.GetCurrentDataString("-") : '<fmt:formatDate value="${tableEntity.tableCreateTime}" pattern="yyyy-MM-dd" />',
                    tableUpdater:'${tableEntity.tableUpdater}',
                    tableType:"",
                    tableIssystem:'${tableEntity.tableIssystem}' == '' ? '否' : '${tableEntity.tableIssystem}',
                    tableDesc: '${tableEntity.tableDesc}',
                    tableGroupId:'${tableEntity.tableGroupId}' == '' ? StringUtility.QueryString("groupId") : '${tableEntity.tableGroupId}'
                },
                editTableObj:null,
                editTableConfig:{
                    Status:"Edit",//状态 编辑 Edit 浏览 View
                    DataField:"fieldName",
                    //AddAfterRowEvent:TableDetailUtil.AfterInitEvent,
                    Templates:[
                        {
                            Title:"字段ID",
                            BindName:"fieldFieldId",
                            Renderer:"EditTable_Lable",
                            TitleCellClassName:"TitleCell",
                            DefaultValue:{
                                Type:"Const",
                                Value:0//默认值0
                            },
                            Hidden:true
                        },
                        {
                            Title:"字段标题",
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
                            Title:"字段名称",
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
                            Title:"字段类型",
                            BindName:"fieldDataType",
                            Renderer:"EditTable_SelectFieldType",
                            Hidden:false,
                            Style:{
                                width:100,
                                textAlign:"center"
                            },
                            ClientDataSource:[{"Text": "之前", "Value": "之前"}, {"Text": "之后", "Value": "之后"}]
                        },{
                            Title:"字段长度",
                            BindName:"fieldDataLength",
                            Renderer:"EditTable_TextBox",
                            DefaultValue:{
                                Type:"Const",
                                Value:"50"
                            },
                            Style:{
                                width:80,
                                textAlign:"center"
                            },
                            Hidden:false
                        },{
                            Title:"小数位数",
                            BindName:"fieldDecimalLength",
                            Renderer:"EditTable_TextBox",
                            DefaultValue:{
                                Type:"Const",
                                Value:"0"
                            },
                            Style:{
                                width:80,
                                textAlign:"center"
                            },
                            Hidden:false
                        },{
                            Title:"是否主键",
                            BindName:"fieldIsPk",
                            Renderer:"EditTable_CheckBox",
                            DefaultValue:{
                                Type:"Const",
                                Value:"否"
                            },
                            Style:{
                                width:80,
                                textAlign:"center"
                            },
                            Hidden:false
                        },{
                            Title:"允许为空",
                            BindName:"fieldAllowNull",
                            Renderer:"EditTable_CheckBox",
                            Hidden:false,
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
                tableFieldsData:[]
            },
            mounted:function () {
                this.editTableObj=Object.create(EditTable);
                this.editTableObj.Initialization(this.editTableConfig);
                /*for(var i=0;i<100;i++){
                    this.tableFieldsData.push({fieldCaption:"你",fieldName:"d"});
                }*/
                this.editTableObj.LoadJsonData(this.tableFieldsData);
                $("#divEditTable").height($(".right-outer-wrap-c").height()-85);
            },
            methods:{
                addField:function(){
                    this.editTableObj.AddEditingRowByTemplate();
                }
            }
        });
    </script>
</body>

</html>
