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
    <style>
        body {
            SCROLLBAR-FACE-COLOR: #e8e7e7;
            SCROLLBAR-HIGHLIGHT-COLOR: #ffffff;
            SCROLLBAR-SHADOW-COLOR: #ffffff;
            SCROLLBAR-3DLIGHT-COLOR: #cccccc;
            SCROLLBAR-ARROW-COLOR: #03B7EC;
            SCROLLBAR-TRACK-COLOR: #EFEFEF;
            SCROLLBAR-DARKSHADOW-COLOR: #b2b2b2;
            SCROLLBAR-BASE-COLOR: #000000;
        }

        body::-webkit-scrollbar {
            width: 5px;
        }

        body::-webkit-scrollbar-track {
            border-radius: 5px;
            background-color: #eee;
        }

        body::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: rgb(171, 175, 186);
        }
    </style>
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
                    <div :class="LeftMenuItemClass(item)"></div>
                    {{item.menuText}}
                </template>
                <template v-for="(i, k) in item.items">
                    <menu-item v-bind:name="i.menuId"  v-if="i.items==undefined"><div :class="LeftMenuItemClass(item)"></div>{{ i.menuText }}</menu-item>
                    <submenu name="i.menuId" v-else-if="i.items.length>0">
                        <template slot="title">
                            <div :class="LeftMenuItemClass(item)"></div>
                            {{item.menuText}}
                        </template>
                        <template v-for="(j, k) in i.items">
                            <menu-item v-bind:name="j.menuId"  v-if="j.items==undefined">{{ j.menuText }}</menu-item>
                        </template>
                    </submenu>
                </template>
            </submenu>
        </i-menu>
    </div>
    <script>
        var app=new Vue({
            el:"#app",
            data:{
                leftMenuArrayJson:[]
            },
            mounted:function(){
                this.leftMenuArrayJson=window.parent.app.leftMenuArrayJson;
            },
            methods:{
                LeftMenuItemClass:function (item) {
                    return "frame-left-menu-item frame-left-menu-affairs "+item.iconClassName;
                },
                /*PageReady:function () {
                    app.$mount('#app');
                },*/
                left_menu_click:function () {
                    
                }
            }
        })
    </script>
</body>
</html>
