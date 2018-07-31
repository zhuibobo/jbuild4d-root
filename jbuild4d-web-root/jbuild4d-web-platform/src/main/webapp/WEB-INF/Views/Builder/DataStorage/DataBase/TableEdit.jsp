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
    <%@ include file="/WEB-INF/Views/TagLibs/TreeTableLib.jsp" %>
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
                }
            }
        });
    </script>
</body>

</html>
