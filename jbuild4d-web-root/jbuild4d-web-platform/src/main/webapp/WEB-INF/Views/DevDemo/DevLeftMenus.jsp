<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/15
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/Views/TagLibs/TagLib.jsp" %>
<html>
<head>
    <title>MYWebApp</title>
    <%@ include file="/WEB-INF/Views/TagLibs/GeneralLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/IViewLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/JQueryUILib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ZTreeLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
    <script>
        var zTreeObj;
        // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
        var setting = {
            callback:{
                onClick: function zTreeOnClick(event, treeId, treeNode) {
                    //alert(treeNode.tId + ", " + treeNode.name);
                    window.parent.app.contentIframeUrl=treeNode.contentUrl;
                }
            }
        };
        // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
        var zNodes = [{
            name: "开发示例",
            open: true,
            children: [{
                name: "通用列表",
                contentUrl:BaseUtility.BuildUrl("/PlatForm/DevDemo/DevDemoGenList/List.do")
            }, {
                name: "test1_2"
            }]
        }];
        $(document).ready(function () {
            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        });
    </script>
</head>
<body>
<div>
    <ul id="treeDemo" class="ztree"></ul>
</div>
</body>
</html>
