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
        <div style="height: 100px">
            <textarea style="width: 100%;height: 100px" id="TextAreaJsEidtor"></textarea>
        </div>
        <div>
            <tabs value="DateTime">
                <tab-pane label="日期时间" name="DateTime">
                    <ul id="datetimeZTreeUL" class="ztree"></ul>
                </tab-pane>
                <tab-pane label="API变量" name="ApiVar">
                    <ul id="envVarZTreeUL" class="ztree"></ul>
                </tab-pane>
                <tab-pane label="表" name="ApiVar">
                    <ul id="envVarZTreeUL" class="ztree"></ul>
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
        data:{},
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
