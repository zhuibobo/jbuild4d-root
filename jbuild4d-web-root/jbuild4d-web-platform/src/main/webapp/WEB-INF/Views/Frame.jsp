<%--
  Created by IntelliJ IDEA.
  User: BBHome
  Date: 2018/6/30
  Time: 22:14
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
    <div class="frame-layout">
        <layout :style="{minHeight: '100vh'}">
            <i-header style="padding: 0 10px" class="frame-layout-header-wrap">
                <div style="width: 100%;height: 65px">
                    <div class="frame-layout-logo">
                        <Icon type="ios-monitor-outline"></Icon>&nbsp;&nbsp;JBuild4D-V-0.1
                    </div>
                    <div class="frame-top-menu-item-warp">
                        <div class="frame-top-menu-item-inner-warp">
                            <div :class="top_menu_item_class(item)" @click="top_menu_click(item)" v-for="(item, key) in topMenuArrayJson" topmenu="true">
                                {{item.menuText}}
                            </div>
                        </div>
                        <div class="frame-top-menu-op-c">
                            <div class="right" @click="NextTopMenu()"></div>
                            <div class="left" @click="PrevTopMenu()"></div>
                        </div>
                    </div>
                    <div class="top-right-wrap">
                        <div class="frame-user-warp">
                            <div class="user-header"></div>
                            <div class="line"></div>
                            <div style="float: left">
                                <div style="line-height:24px;margin-top: 8px">用户名：{{userInfo.userName}}</div>
                                <div style="line-height: 24px;overflow-x: hidden;width: 130px;white-space: nowrap;text-overflow:  ellipsis;">部&nbsp;&nbsp;&nbsp;&nbsp;门：{{userInfo.organName}}</div>
                            </div>
                        </div>
                        <div class="logout" onclick="window.location.href='${ctxpath}/Login.do'"></div>
                    </div>
                </div>
                <div class="layout-header-shadow-line" style="height: 4px;width: 100%"></div>
            </i-header>
            <layout>
                <sider hide-trigger :style="sider_style">
                    <i-menu active-name="Project-SystemManagement-BusinessUsers" theme="light" width="auto" :open-names="['1']" @on-select="left_menu_click">
                        <menu-item :name="item.menuText" v-for="(item, key) in leftMenuArrayJson" v-if="item.items==undefined">
                            <icon :type="item.iconType==''?'shuffle':item.iconType" size="20" color="#2d8cf0"></icon>
                            {{item.text}}
                        </menu-item>
                        <Submenu :name="item.menuText"  v-else-if="item.items.length>0">
                            <template slot="title">
                                <Icon :type="item.iconType==''?'shuffle':item.iconType" color="#2d8cf0"></Icon>
                                {{ item.text }}
                            </template>
                            <template v-for="(i, k) in item.items">
                                <Menu-item v-bind:name="i.menuText">{{ i.text }}</Menu-item>
                            </template>
                        </Submenu>
                    </i-menu>
                </sider>
                <layout :style="{padding: '0 24px 24px'}">
                    <breadcrumb :style="{margin: '24px 0'}">
                        <%--<breadcrumb-item v-for="(item,key) in breadcrumbArrayJson">{{item.text}}</breadcrumb-item>--%>
                    </breadcrumb>
                    <i-content :style="{padding: '24px', minHeight: '480px', background: '#fff'}">
                        <iframe name="iframe" :src="contentIframeUrl" width="100%" :height="frameHeight" frameborder="0"></iframe>
                    </i-content>
                </layout>
            </layout>
        </layout>
    </div>

</div>
<script>
    var IsTopWorkaroundPage = true;
    var menuJson=${menuJson};
    var menuJson=JsonUtility.ResolveSimpleArrayJsonToTreeJson({
        KeyField: "menuId",
        RelationField: "parentId",
        ChildFieldName: "items"
    },menuJson,"0");
    console.log(menuJson.items);
    var app=new Vue({
        data:{
            topMenuArrayJson:menuJson.items,
            leftMenuArrayJson:menuJson.items[0].items,
            /*breadcrumbArrayJson:[menuJson.items[0],menuJson.items[0].items[0]],*/
            frameHeight: 0,
            contentIframeUrl:"",
            userInfo:${currUserEntity}
        },
        mounted:function(){
            this.setFrameHeight();
            this.contentIframeUrl=BaseUtility.ReplaceUrlVariable(this.contentIframeUrl);
            //alert(this.contentIframeUrl);
        },
        created:function () {
            //this.contentIframeUrl=BaseUtility.ReplaceUrlVariable(menuArrayJson.items[0].items[0].url);
        },
        methods:{
            TopMenuHasNextPage:function () {
                var outerwidth = $(".frame-top-menu-item-warp").width();
                var topmenus = $("[topmenu='true']");
                var topmenuswidth = 0;
                for (var i = 0; i < topmenus.length; i++) {
                    topmenuswidth += $(topmenus[i]).outerWidth(true);
                }
                return topmenuswidth > outerwidth;
            },
            NextTopMenu:function () {
                //debugger;
                if (this.TopMenuHasNextPage()) {
                    var warpObj=$(".frame-top-menu-item-warp");
                    var innerWarpObj=$(".frame-top-menu-item-inner-warp");
                    var outerWidth = warpObj.width() * 0.9;
                    var left=innerWarpObj.css("left");
                    var innerLeft=0;
                    if(left!="auto") {
                        innerLeft = parseInt(left);
                    }
                    var innerWidth =innerWarpObj.width();
                    var toLeft = innerLeft - outerWidth;

                    if(-toLeft > innerWidth - warpObj.width()) {
                        toLeft = -(innerWidth - warpObj.width());
                    }
                    innerWarpObj.animate({
                        left: toLeft
                    }, 1000);
                }
                else {

                }
            },
            PrevTopMenu:function () {
                var warpObj=$(".frame-top-menu-item-warp");
                var innerWarpObj=$(".frame-top-menu-item-inner-warp");
                var innerLeft = parseInt(innerWarpObj.css("left"));
                if (innerLeft < 0) {
                    var outerWidth = warpObj.width() * 0.9;
                    var toLeft = innerLeft + outerWidth;
                    if(toLeft > 0) {
                        toLeft = 0;
                    }
                    innerWarpObj.animate({
                        left: toLeft
                    }, 1000);
                }
            },
            get_menu:function (name) {
                for(var i=0;i<this.l1MenuArrayJson.length;i++){
                    if(this.l1MenuArrayJson[i].name==name){
                        return this.l1MenuArrayJson[i];
                    }
                }
                return null;
            },
            buildBreadcrumbArrayJson:function (name) {
                this.breadcrumbArrayJson=new Array();
                var lastMenu=this.get_menu(name);
                if(lastMenu!=null){
                    this.breadcrumbArrayJson.push(lastMenu);
                    if(lastMenu.parentName!="0"){
                        var lastMenuL1=this.get_menu(lastMenu.parentName);
                        this.breadcrumbArrayJson.push(lastMenuL1);
                    }
                }
                this.breadcrumbArrayJson.reverse();
            },
            top_menu_click:function (name) {
                for(var i=0;i<this.topMenuArrayJson.length;i++) {
                    if(this.topMenuArrayJson[i].name==name){
                        this.leftMenuArrayJson = this.topMenuArrayJson[i].items;
                    }
                }
            },
            left_menu_click:function (name) {
                this.buildBreadcrumbArrayJson(name);
                var menu=this.get_menu(name);
                var url=BaseUtility.ReplaceUrlVariable(menu.url);
                this.contentIframeUrl=url;
            },
            setFrameHeight:function(){
                //调整掉一些补白的值
                //debugger;
                this.mainHeight = PageStyleUtility.GetWindowHeigth()-90-90;
                this.frameHeight = this.mainHeight-30;
            },
            top_menu_item_class:function (item) {
                //debugger;
                return "frame-top-menu-item "+item.iconClassName;
            }
        },
        computed:{
            sider_style:function () {
                var height=$(window).height()-65;
                return {
                    background:"#fff",
                    height:height+"px",
                    overflow:"auto"
                }
            }
        }
    });
    app.$mount('#app');
</script>
</body>
</html>