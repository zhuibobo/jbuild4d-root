<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/8/3
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
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ZTreeLib.jsp" %>
</head>
<body>
    <div id="appSelectView">
        <tabs value="Const">
            <tab-pane label="静态值" name="Const">
                <i-form :label-width="80" style="width: 80%;margin: 50px auto auto;">
                    <form-item label="静态值：">
                        <i-input v-model="selectValue"></i-input>
                    </form-item>
                </i-form>
            </tab-pane>
            <tab-pane label="日期时间" name="DateTime">
                <ul id="datetimeZTreeUL" class="ztree"></ul>
            </tab-pane>
            <tab-pane label="环境变量" name="EnvVar">
                <ul id="envVarZTreeUL" class="ztree"></ul>
            </tab-pane>
            <tab-pane label="序号编码" name="NumberCode">
                <ul id="numberCodeZTreeUL" class="ztree"></ul>
            </tab-pane>
        </tabs>
        <div style="position: absolute;bottom: 0px;width: 100%;text-align: center">
            <i-button type="primary" @click="saveEditTable()"> 保 存</i-button>
            <i-button style="margin-left: 8px">关 闭</i-button>
        </div>
    </div>
    <script>
        var appSelectView=new Vue({
            el:"#appSelectView",
            data:{
                selectType:"",
                selectValue:"",
                selectText:"",
                tree:{
                    datetimeTreeSetting:{},
                    datetimeTreeData:{},
                    envVarTreeSetting:{},
                    envVarTreeData:{},
                    numberCodeTreeSetting:{},
                    numberCodeTreeData:{}
                }
            },
            mounted:function (){

            },
            method:{

            }
        })
    </script>
</body>
</html>
