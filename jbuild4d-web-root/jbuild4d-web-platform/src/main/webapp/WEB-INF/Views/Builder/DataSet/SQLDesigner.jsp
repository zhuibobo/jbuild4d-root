<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/8/9
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
    <%@ include file="/WEB-INF/Views/TagLibs/CodeMirrorSQL.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
    <script src="${ctxpath}/UIComponent/ZTree-V3/js/jquery.ztree.exhide.js" type="text/javascript"></script>
    <script src="${ctxpath}/UIComponent/ZTree-V3/js/fuzzysearch.js" type="text/javascript"></script>
    <style>
        .CodeMirror {
            height: 100px;
        }

        #TextAreaJsEditor {
            width: 100%;
            height: 100px;
        }

        .tableTreeWrap {
            float: left;height: 400px;width: 40%;border: #01a0e4 1px solid;border-radius: 4px;padding: 6px
        }

        .tableFieldWrap{
            float: left;height: 400px;width: 57%;border: #01a0e4 1px solid;border-radius: 4px;margin-left: 10px;padding: 10px
        }

        .tableName{
            color: #3b97ed;
            cursor: pointer;
        }

        .tableName:hover{
            color: red;
        }
    </style>
</head>
<body>
<div id="sqlDesignerForm" v-cloak>
    <div class="list-2column">
        <div style="height: 120px">
            请输入SQL语句
            <textarea id="TextAreaJsEditor"></textarea>
        </div>
        <div>
            <tabs value="Tables">
                <tab-pane label="表" name="Tables">
                    <div>
                        <div class="tableTreeWrap">
                            <input type="text" id="txtSearchTableTree" style="width: 100%" />
                            <ul id="tableZTreeUL" class="ztree"></ul>
                        </div>
                        <div class="tableFieldWrap">
                            表：【<span class="tableName" @click="insertTableNameToCodeMirror">{{tree.selectedTableName}}</span>】
                            <i-table size="small" height="350" stripe border :columns="tableField.columnsConfig" :data="tableField.fieldData"
                                     class="iv-list-table" :highlight-row="true"></i-table>
                        </div>
                    </div>
                </tab-pane>
                <tab-pane label="API变量" name="ApiVar">
                    <ul id="envVarZTreeUL" class="ztree"></ul>
                </tab-pane>
                <tab-pane label="日期时间" name="DateTime">
                    <ul id="datetimeZTreeUL" class="ztree"></ul>
                </tab-pane>
                <tab-pane label="参考SQL" name="EgSQL">
                </tab-pane>
            </tabs>
        </div>
    </div>
    <div style="position: absolute;bottom: 0px;width: 100%;text-align: center">
        <i-button type="primary" @click="saveEditTable()"> 校验并保存</i-button>
        <i-button type="primary" @click="saveEditTable()"> 校验</i-button>
        <i-button style="margin-left: 8px" @click="handleClose()">关 闭</i-button>
    </div>
</div>
<script>
    var sqlDesignerForm = new Vue({
        el:"#sqlDesignerForm",
        data:{
            tree:{
                datetimeTreeObj:null,
                datetimeTreeSetting:{
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    data: {
                        key: {
                            name: "text",
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {

                        },
                        onDblClick: function (event, treeId, treeNode) {

                        },
                        //成功的回调函数
                        onAsyncSuccess: function (event, treeId, treeNode, msg) {

                        }
                    }
                },
                datetimeTreeData:${datetimeTreeData},
                envVarTreeObj:null,
                envVarTreeSetting:{
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    data: {
                        key: {
                            name: "text",
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {

                        },
                        onDblClick: function (event, treeId, treeNode) {

                        },
                        //成功的回调函数
                        onAsyncSuccess: function (event, treeId, treeNode, msg) {

                        }
                    }
                },
                envVarTreeData:${envVarTreeData},
                tableTreeObj:null,
                tableTreeSetting:{
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    data: {
                        key: {
                            name: "text",
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            sqlDesignerForm.getTableFields(treeNode);
                            sqlDesignerForm.tree.selectedTableName=treeNode.value;
                        },
                        onDblClick: function (event, treeId, treeNode) {

                        },
                        //成功的回调函数
                        onAsyncSuccess: function (event, treeId, treeNode, msg) {

                        }
                    }
                },
                tableTreeData:${tableTreeData},
                selectedTableName:"无"
            },
            tableField:{
                fieldData:[],
                columnsConfig: [
                    {
                        title: '字段名称',
                        key: 'fieldName',
                        align: "center"
                    }, {
                        title: '标题',
                        key: 'fieldCaption',
                        align: "center"
                    }, {
                        title: '操作',
                        key: 'fieldId',
                        width: 120,
                        align: "center",
                        render: function (h, params) {
                            return h('div',{class: "list-row-button-wrap"},[
                                h('div', {
                                    class: "list-row-button list-row-button-listmanager",
                                    on: {
                                        click: function () {
                                            sqlDesignerForm.insertTableFieldToCodeMirror(params.row);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ]
            },
            myCodeMirror:null
        },
        mounted:function () {
            this.myCodeMirror = CodeMirror.fromTextArea($("#TextAreaJsEditor")[0], {
                mode: "text/x-sql",
                lineNumbers: true,
                lineWrapping: true,
                foldGutter: true,
                theme: "monokai"
            });
            this.tree.datetimeTreeObj=$.fn.zTree.init($("#datetimeZTreeUL"), this.tree.datetimeTreeSetting,this.tree.datetimeTreeData);
            this.tree.datetimeTreeObj.expandAll(true);
            this.tree.envVarTreeObj=$.fn.zTree.init($("#envVarZTreeUL"), this.tree.envVarTreeSetting,this.tree.envVarTreeData);
            this.tree.envVarTreeObj.expandAll(true);
            this.tree.tableTreeObj=$.fn.zTree.init($("#tableZTreeUL"), this.tree.tableTreeSetting,this.tree.tableTreeData);
            this.tree.tableTreeObj.expandAll(true);

            fuzzySearch("tableZTreeUL","#txtSearchTableTree",null,true);
        },
        methods:{
            insertCodeAtCursor:function(code){
                var doc = this.myCodeMirror.getDoc();
                var cursor = doc.getCursor();
                doc.replaceRange(code, cursor);
            },
            insertTableNameToCodeMirror:function () {
                this.insertCodeAtCursor(this.tree.selectedTableName);
            },
            insertTableFieldToCodeMirror:function (fieldJson) {
                this.insertCodeAtCursor(this.tree.selectedTableName+"."+fieldJson.fieldName);
            },
            getTableFields:function (treeNode) {
                //debugger;
                var tableId=treeNode.id;
                var _self=this;
                var url = '/PlatForm/Builder/DataSet/DataSetDesign/GetTableField.do';
                AjaxUtility.Post(url, {tableId:tableId}, function (result) {
                    if(result.success){
                        _self.tableField.fieldData=result.data;
                    }
                    else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                    }
                }, "json");
            },
            handleClose: function () {
                DialogUtility.CloseOpenIframeWindow(window,DialogUtility.DialogId);
            }
        }
    });
</script>
</body>
</html>
