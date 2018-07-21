<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/21
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/Views/TagLibs/TagLib.jsp" %>
<html>
<head>
    <title>JBuild4D</title>
    <%@ include file="/WEB-INF/Views/TagLibs/GeneralLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/IViewLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/JQueryUILib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
    <script>
        $(function () {
            DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请重新登陆系统",function () {
                BaseUtility.RedirectToLogin();
            });
        })
    </script>
</head>
<body>
    SessionTimeout
</body>
</html>
