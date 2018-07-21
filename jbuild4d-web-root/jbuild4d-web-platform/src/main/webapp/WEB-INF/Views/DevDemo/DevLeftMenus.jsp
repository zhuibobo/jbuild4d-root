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
                name: "通用列表(带查询)",
                contentUrl:BaseUtility.BuildUrl("/PlatForm/DevDemo/DevDemoGenList/List.do")
            }, {
                name: "通用列表(不带查询)",
                contentUrl:BaseUtility.BuildUrl("/PlatForm/DevDemo/DevDemoGenList/ListNotSearch.do")
            }]
        }];
        $(document).ready(function () {
            zTreeObj = $.fn.zTree.init($("#ztreeUL"), setting, zNodes);
        });
    </script>
</head>
<body>
<div>
    <div class="left-page-c">
        <div class="tool-bar-c">
            <div alt="新增分类组" title="新增分类组" class="add" onclick=""></div>
            <div alt="修改分类组" title="修改分类组" class="edit" onclick=""></div>
            <div alt="删除分类组" title="删除分类组" class="del" onclick=""></div>
            <div alt="浏览分类组" title="浏览分类组" class="view" onclick=""></div>
            <div alt="上移" title="上移" class="order-up" onclick=""></div>
            <div alt="下移" title="下移" class="order-down last" onclick=""></div>
        </div>
        <div class="zTreeDemoBackground left">
            <ul id="ztreeUL" class="ztree"></ul>
        </div>
    </div>
</div>
<style>

</style>
</body>
</html>
