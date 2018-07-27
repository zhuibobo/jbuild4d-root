<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/25
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
    <%@ include file="/WEB-INF/Views/TagLibs/TreeTableLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
</head>
<body>
<div id="appList" class="list-2column">
    <div class="left-outer-wrap-c" style="width: 435px;">
        <div class="left-page-c" style="padding: 10px">
            <div class="list-simple-search-wrap" id="list-simple-search-wrap" style="border-width:0px ">
                <table class="ls-table">
                    <colgroup>
                        <col style="">
                        <col style="width: 80px">
                    </colgroup>
                    <tr class="ls-table-row">
                        <td>
                            <i-input v-model="searchCondition.tableName.value" placeholder=""></i-input>
                        </td>
                        <td><i-button type="primary" @click="search"><Icon type="android-search"></Icon> 查询 </i-button></td>
                    </tr>
                </table>
            </div>
            <div id="list-button-wrap" class="list-button-outer-wrap">
                <div style="clear: both"></div>
            </div>
            <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
                     class="iv-list-table" :highlight-row="true"
                     @on-selection-change="selectionChange"></i-table>
            <div style="float: right;" id="list-pager-wrap">
                <page @on-change="changePage" :current.sync="pageNum" :page-size="pageSize" show-total
                      :total="pageTotal"></page>
            </div>
        </div>
    </div>
    <div class="right-outer-wrap-c" style="padding: 10px;left: 450px;">
        <card :bordered="false" style="margin-bottom: 10px">
            <p slot="title">参数设置</p>
            <row>
                <i-col span="21">
                    <row>
                        <i-col span="2" style="text-align: center;padding-top: 6px">表名：</i-col>
                        <i-col span="10">
                            <i-input v-model="formValidate.tableName"></i-input>
                        </i-col>
                        <i-col span="3" style="text-align: center;padding-top: 6px">包名类型：</i-col>
                        <i-col span="9">
                            <radio-group v-model="formValidate.packageType" vertical>
                                <radio label="JBuild4D-PlatForm">
                                    <span>JBuild4D-PlatForm</span>
                                </radio>
                                <radio label="JBuild4D-Project">
                                    <span>JBuild4D-Project</span>
                                </radio>
                            </radio-group>
                        </i-col>
                    </row>
                    <row>
                        <i-col span="2" style="text-align: center;padding-top: 6px">排序字段：</i-col>
                        <i-col span="10">
                            <i-input v-model="formValidate.orderFieldName"></i-input>
                        </i-col>
                        <i-col span="3" style="text-align: center;padding-top: 6px">状态字段：</i-col>
                        <i-col span="9">
                            <i-input v-model="formValidate.statusFieldName"></i-input>
                        </i-col>
                    </row>
                </i-col>
                <i-col span="3" style="text-align: center">
                    <i-button type="success" @click="beginGenerateCode()"> 生 成 </i-button>
                    <i-button type="success" @click="beginGenerateCode()"> 清 空 </i-button>
                </i-col>
            </row>
        </card>
        <tabs type="card">
            <tab-pane label="Entity">
                <textarea name="txtAreaCode" id="txtAreaEntity" style="width: 100%;">{{generateCode.EntityContent}}</textarea>
            </tab-pane>
            <tab-pane label="Dao">
                <textarea name="txtAreaCode" id="txtAreaDao" style="width: 100%;">{{generateCode.DaoContent}}</textarea>
            </tab-pane>
            <tab-pane label="MapperAC">
                <textarea name="txtAreaCode" id="txtAreaMapperAC" style="width: 100%;">{{generateCode.MapperACContent}}</textarea>
            </tab-pane>
            <tab-pane label="MapperEX">
                <textarea name="txtAreaCode" id="txtAreaMapperEX" style="width: 100%;">{{generateCode.MapperEXContent}}</textarea>
            </tab-pane>
            <tab-pane label="IService">
                <textarea name="txtAreaCode" id="txtAreaIService" style="width: 100%;"></textarea>
            </tab-pane>
            <tab-pane label="ServiceImpl">
                <textarea name="txtAreaCode" id="txtAreaServiceImpl" style="width: 100%;"></textarea>
            </tab-pane>
            <tab-pane label="Bean">
                <textarea name="txtAreaCode" id="txtAreaBean" style="width: 100%;"></textarea>
            </tab-pane>
            <tab-pane label="Controller">
                <textarea name="txtAreaCode" id="txtAreaController" style="width: 100%;"></textarea>
            </tab-pane>
            <tab-pane label="ListJsp">
                <textarea name="txtAreaCode" id="txtAreaListJsp" style="width: 100%;"></textarea>
            </tab-pane>
            <tab-pane label="DetailJsp">
                <textarea name="txtAreaCode" id="txtAreaDetailJsp" style="width: 100%;"></textarea>
            </tab-pane>
        </tabs>
    </div>
</div>
<script>
    var appList=new Vue({
        el:"#appList",
        mounted:function () {
            this.reloadData();
            window.setTimeout(function () {
                appList.listHeight=ListPageUtility.GetGeneralPageHeight(-20);
                $("[name='txtAreaCode']").css("height",appList.listHeight-160);
            },500);
        },
        data:{
            formValidate: {
                tableName: "",
                packageType: "JBuild4D-PlatForm",
                orderFieldName:"",
                statusFieldName:""
            },
            generateCode:{
                EntityContent:"",
                DaoContent:"",
                MapperACContent:"",
                MapperEXContent:""
            },
            <!--List-->
            idFieldName:"TableName",
            searchCondition:{
                tableName:{
                    value:"",
                    type:SearchUtility.SearchFieldType.StringType
                }
            },
            columnsConfig: [
                {
                    title: '表名',
                    key: 'TableName',
                    align: "center"
                },{
                    title: '操作',
                    key: 'TableName',
                    width: 80,
                    align: "center",
                    render: function (h, params) {
                        return h('div',{class: "list-row-button-wrap"},[
                            h('div', {
                                class: "list-row-button list-row-button-listmanager",
                                on: {
                                    click: function () {
                                        appList.selectedTable(params.row.TableName);
                                    }
                                }
                            })
                        ]);
                    }
                }
            ],
            tableData: [],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 12,
            pageNum: 1,
            listHeight: 300
        },
        methods:{
            beginGenerateCode:function () {
                var _self=this;
                var url = '/PlatForm/System/CodeGenerate/GetTableGenerateCode.do';
                AjaxUtility.Post(url, this.formValidate, function (result) {
                    _self.generateCode.EntityContent=result.data.EntityContent;
                    _self.generateCode.DaoContent=result.data.DaoContent;
                    _self.generateCode.MapperACContent=result.data.MapperACContent;
                    _self.generateCode.MapperEXContent=result.data.MapperEXContent;
                }, "json");
            },
            <!--List-->
            selectionChange: function (selection) {
                this.selectionRows = selection;
            },
            reloadData: function () {
                var url = '/PlatForm/System/CodeGenerate/GetListData.do';
                //debugger;
                ListPageUtility.IViewTableLoadDataSearch(url,this.pageNum,this.pageSize,this.searchCondition,this,this.idFieldName,true,null);
                //this.selectionRows=null;
            },
            selectedTable:function (tableName) {
                this.formValidate.tableName=tableName;
                var _self=this;
                var url = '/PlatForm/System/CodeGenerate/GetTableFields.do';
                AjaxUtility.Post(url, this.formValidate, function (result) {
                    if(result.success){
                        for(var i=0;i<result.data.length;i++){
                            var field=result.data[i];
                            if(field.fieldName.toUpperCase().indexOf("ORDER")>=0){
                                _self.formValidate.orderFieldName=field.fieldName;
                            }
                            if(field.fieldName.toUpperCase().indexOf("STATUS")>=0){
                                _self.formValidate.statusFieldName=field.fieldName;
                            }
                        }
                    }
                    else {
                        DialogUtility.AlertError(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                    }
                }, "json");
            },
            changePage: function (pageNum) {
                this.pageNum = pageNum;
                this.reloadData();
                this.selectionRows=null;
            },
            search:function () {
                this.pageNum=1;
                this.reloadData();
            }
        }
    });
</script>
</body>
</html>