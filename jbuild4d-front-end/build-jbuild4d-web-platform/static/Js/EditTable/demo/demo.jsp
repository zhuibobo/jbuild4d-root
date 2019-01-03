<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2016/1/18
  Time: 10:00
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link href="../Css/EditTable.css" rel="stylesheet" />
    <script src="../../../Js/jquery-1.7.2.js"></script>
    <script src="../../../Js/SSSBaseLib.js"></script>
    <script src="../Js/EditTable.js"></script>
    <script src="../Js/Config.js"></script>
    <script src="../../../Category/Table/Js/EditTableRenderer/EditTable_TextBox.js"></script>
    <script src="../../../Category/Table/Js/EditTableRenderer/EditTable_Select.js"></script>
    <script>
        var editTable1=null;
        $(function(){
            editTable1=Object.create(EditTable);
            //editTable1.Config(EditTableConfig);
            editTable1.Initialization(EditTableConfig,EditTableData);
        });

        function addrow() {
            editTable1.AddEditingRowByTemplate();
        }
    </script>
</head>
<body>
<input type="button" value="addrow" onclick="addrow()">
<div id="divEditTable"></div>
<table>
    <thead>
    <tr>
        <th></th>
    </tr>
    </thead>
</table>
<label></label>
<input type="hidden">
</body>
</html>
