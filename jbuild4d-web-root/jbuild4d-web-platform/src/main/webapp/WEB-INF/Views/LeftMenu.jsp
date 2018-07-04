<%--
  Created by IntelliJ IDEA.
  User: BBHome
  Date: 2018/7/4
  Time: 21:10
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
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
</head>
<body style="height: 100%">
    <div id="app" v-cloak>
        <i-menu active-name="Project-SystemManagement-BusinessUsers" theme="light" width="auto" :open-names="['1']" @on-select="left_menu_click">
            <menu-item :name="item.menuText" v-for="(item, key) in leftMenuArrayJson" v-if="item.items==undefined">
                <div :class="LeftMenuItemClass(item)"></div>
                {{item.menuText}}
            </menu-item>
            <submenu name="item.menuId" v-else-if="item.items.length>0">
                <template slot="title">
                    <icon type="ios-analytics"></icon>
                    {{item.menuText}}
                </template>
            </submenu>
        </i-menu>
    </div>
    <script>
        var app=new Vue({
            data:{
                leftMenuArrayJson:null
            },
            methods:{
                LeftMenuItemClass:function (item) {
                    return "frame-left-menu-item frame-left-menu-affairs "+item.iconClassName;
                },
                PageReady:function () {
                    debugger;
                    app.$mount('#app');
                },
                left_menu_click:function () {
                    
                }
            }
        })
    </script>
</body>
</html>
