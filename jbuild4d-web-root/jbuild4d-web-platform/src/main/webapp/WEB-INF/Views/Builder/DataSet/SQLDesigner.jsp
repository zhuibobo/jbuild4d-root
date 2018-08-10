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
    <style>
        .CodeMirror{
            height: 100px;
        }
    </style>
</head>
<body>
<div id="sqlDesignerForm" v-cloak>
    <div class="list-2column">
        <div style="height: 120px">
            请输入SQL语句
            <textarea style="width: 100%;height: 100px" id="TextAreaJsEidtor"></textarea>
        </div>
        <div>
            <tabs value="Tables">
                <tab-pane label="表" name="Tables">
                    <ul id="tableZTreeUL" class="ztree"></ul>
                </tab-pane>
                <tab-pane label="API变量" name="ApiVar">
                    <ul id="envVarZTreeUL" class="ztree"></ul>
                </tab-pane>
                <tab-pane label="日期时间" name="DateTime">
                    <ul id="datetimeZTreeUL" class="ztree"></ul>
                </tab-pane>
            </tabs>
        </div>
    </div>
    <div style="position: absolute;bottom: 0px;width: 100%;text-align: center">
        <i-button type="primary" @click="saveEditTable()"> 保 存</i-button>
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
                envVarTreeSetting:{},
                envVarTreeData:${envVarTreeData}
            }
        },
        mounted:function () {
            var myCodeMirror = CodeMirror.fromTextArea($("#TextAreaJsEidtor")[0], {
                mode: "text/x-sql",
                lineNumbers: true,
                lineWrapping: true,
                foldGutter: true,
                theme: "monokai"
            });
        },
        methods:{

        }
    });
</script>
</body>
</html>
