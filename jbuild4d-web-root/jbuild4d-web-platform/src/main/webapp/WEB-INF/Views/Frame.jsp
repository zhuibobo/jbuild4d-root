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
<body style="height: 100%;overflow: hidden">
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
                            <div :class="topMenuItemClass(item)" @click="topMenuClick(item,true)" v-for="(item, key) in topMenuArrayJson" topmenu="true">
                                {{item.menuText}}
                            </div>
                        </div>
                    </div>
                    <div class="frame-top-menu-op-c">
                        <div class="right" @click="nextTopMenu()"></div>
                        <div class="left" @click="prevTopMenu()"></div>
                    </div>
                    <div class="frame-top-right-wrap">
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
                <sider hide-trigger :style="sider_style" width="300">
                    <iframe id="leftMenuIframe" :src="leftIframeUrl" frameborder="0" style="width: 100%;height: 99%" ></iframe>
                </sider>
                <layout :style="{padding: '0 24px 24px'}">
                    <breadcrumb :style="{margin: '10px 0'}">
                        <breadcrumb-item v-for="(item,key) in breadcrumbArrayJson">{{item.text}}</breadcrumb-item>
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
    var menuJsonSource=[];
    menuJsonSource=${menuJson};
    //增加selected属性，用于选中状态控制。
    for(var i=0;i<menuJsonSource.length;i++){
        menuJsonSource[i].selected=false;
    }
    var menuJson=JsonUtility.ResolveSimpleArrayJsonToTreeJson({
        KeyField: "menuId",
        RelationField: "parentId",
        ChildFieldName: "items"
    },menuJsonSource,"0");
    console.log(menuJson.items);
    var app=new Vue({
        data:{
            menuJson:menuJson,
            menuJsonSource:menuJsonSource,
            topMenuArrayJson:menuJson.items,
            leftMenuArrayJson:menuJson.items[0].items,
            breadcrumbArrayJson:[{text:"JBuild4D"}],
            frameHeight: 0,
            contentIframeUrl:"${ctxpath}/PlatForm/Base/RightContent.do",
            leftIframeUrl:"${ctxpath}/PlatForm/Base/LeftMenu.do",
            defaultLeftIframeUrl:"${ctxpath}/PlatForm/Base/LeftMenu.do",
            defaultContentIframeUrl:"${ctxpath}/PlatForm/Base/RightContent.do",
            userInfo:${currUserEntity}
        },
        mounted:function(){
            this.setFrameHeight();
            this.contentIframeUrl=BaseUtility.ReplaceUrlVariable(this.contentIframeUrl);
            /*$("#leftMenuIframe").on("load",function() {
                $("#leftMenuIframe")[0].contentWindow.app.leftMenuArrayJson = app.leftMenuArrayJson;
                $("#leftMenuIframe")[0].contentWindow.app.PageReady();
            });*/
        },
        created:function () {
            //this.contentIframeUrl=BaseUtility.ReplaceUrlVariable(menuArrayJson.items[0].items[0].url);
            this.topMenuClick(this.topMenuArrayJson[0],false);
        },
        methods:{
            topMenuItemClass:function (item) {
                if(item.selected){
                    return "frame-top-menu-item frame-top-menu-item-selected "+item.iconClassName;
                }
                return "frame-top-menu-item "+item.iconClassName;
            },
            unSelectedAllTopMenu:function () {
                for(var i=0;i<this.topMenuArrayJson.length;i++){
                    this.topMenuArrayJson[i].selected=false;
                }
            },
            topMenuHasNextPage:function () {
                var outerwidth = $(".frame-top-menu-item-warp").width();
                var topmenus = $("[topmenu='true']");
                var topmenuswidth = 0;
                for (var i = 0; i < topmenus.length; i++) {
                    topmenuswidth += $(topmenus[i]).outerWidth(true);
                }
                return topmenuswidth > outerwidth;
            },
            nextTopMenu:function () {
                //debugger;
                if (this.topMenuHasNextPage()) {
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
            prevTopMenu:function () {
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
            getMenu:function (menuId) {
                for(var i=0;i<this.menuJsonSource.length;i++){
                    if(this.menuJsonSource[i].menuId==menuId){
                        return this.menuJsonSource[i];
                    }
                }
                return null;
            },
            buildBreadcrumbByMenuId:function (menuId) {
                var lastMenu=this.getMenu(menuId);
                var breadcrumbArrayJson=new Array();
                //debugger;
                if(lastMenu!=null){
                    breadcrumbArrayJson.push({text:lastMenu.menuText});
                    if(lastMenu.parentId!="0"){
                        var lastMenuL1=this.getMenu(lastMenu.parentId);
                        breadcrumbArrayJson.push({text:lastMenuL1.menuText});
                        if(lastMenuL1.parentId!="0"){
                            lastMenuL1=this.getMenu(lastMenuL1.parentId);
                            breadcrumbArrayJson.push({text:lastMenuL1.menuText});
                            if(lastMenuL1.parentId!="0"){
                                lastMenuL1=this.getMenu(lastMenuL1.parentId);
                                breadcrumbArrayJson.push({text:lastMenuL1.menuText});
                            }
                        }
                    }
                }
                breadcrumbArrayJson=breadcrumbArrayJson.reverse();
                this.setBreadcrumbArrayJson(breadcrumbArrayJson);
            },
            topMenuClick:function (item,reSetLeftMenu) {
                this.unSelectedAllTopMenu();
                item.selected=true;
                this.leftMenuArrayJson=item.items;
                //debugger;
                if(this.leftIframeUrl.indexOf("/PlatForm/Base/LeftMenu.do")>=0&&reSetLeftMenu) {
                    $("#leftMenuIframe")[0].contentWindow.app.leftMenuArrayJson = app.leftMenuArrayJson;
                };
                this.buildBreadcrumbByMenuId(item.menuId);
                //debugger;
                if(item.rightUrl!=""&&item.rightUrl!=null){
                    this.contentIframeUrl=item.rightUrl;
                }else{
                    this.contentIframeUrl=this.defaultContentIframeUrl;
                }
                //debugger;
                if(item.leftUrl!=""&&item.leftUrl!=null&&item.leftUrl!="LeftMenu.do"){
                    this.leftIframeUrl=JB4D.BaseUtility.BuildUrl(item.leftUrl);
                    return;
                }
                else{
                    this.leftIframeUrl=this.defaultLeftIframeUrl;
                    $("#leftMenuIframe").on("load",function() {
                        $("#leftMenuIframe")[0].contentWindow.app.leftMenuArrayJson = app.leftMenuArrayJson;
                        $("#leftMenuIframe").unbind("load");
                        //$("#leftMenuIframe")[0].contentWindow.app.PageReady();
                    });
                }
            },
            setFrameHeight:function(){
                //调整掉一些补白的值
                //debugger;
                this.mainHeight = PageStyleUtility.GetWindowHeigth()-90-60;
                this.frameHeight = this.mainHeight-30;
            },
            setBreadcrumbArrayJson:function (jsonArray) {
                this.breadcrumbArrayJson=jsonArray;
            },
            setContentIframeUrl:function (url) {
                this.contentIframeUrl=BaseUtility.GetRootPath()+url;
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