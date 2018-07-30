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
            <div class="left-outer-wrap-c" style="bottom: 50px">
                <divider orientation="left" :dashed="true">表信息</divider>

            </div>
            <div class="right-outer-wrap-c" style="bottom: 50px">
                <divider orientation="left" :dashed="true">表字段</divider>
            </div>
        </div>
        <div style="position: absolute;bottom: 0px;width: 100%;text-align: center">
            <i-button type="primary"> 保 存</i-button>
            <i-button style="margin-left: 8px">关 闭</i-button>
        </div>
    </div>
    <script>
        var appForm = new Vue({
            el:"#appForm"
        });
    </script>
</body>

</html>
