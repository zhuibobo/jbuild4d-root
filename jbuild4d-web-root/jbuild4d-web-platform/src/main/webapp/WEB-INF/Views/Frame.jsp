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
    <div class="layout">
        <layout :style="{minHeight: '100vh'}">
            <i-header style="padding: 0 10px" class="layout-header-wrap">
                <div style="width: 100%;height: 65px">
                    <div class="layout-logo">
                        <Icon type="ios-monitor-outline"></Icon>&nbsp;&nbsp;MYWebApp
                    </div>
                    <div class="topMenuItem-warp">
                        <div class="topMenuItem-inner-warp">
                            <div :class="top_menu_item_class(item)" @click="top_menu_click(item.name)" v-for="(item, key) in topMenuArrayJson">
                                {{item.text}}
                            </div>
                        </div>
                    </div>
                    <div class="top-right-wrap">
                        <div class="yonghu">
                            <div class="touxiang"></div>
                            <div class="lanxian"></div>
                            <div style="float: left">
                                <div style="line-height:24px;margin-top: 8px">用户名：{{userInfo.userName}}</div>
                                <div style="line-height:24px">部&nbsp;&nbsp;&nbsp;&nbsp;门：{{userInfo.organName}}</div>
                            </div>
                        </div>
                        <div class="tuichu" onclick="window.location.href='${ctxpath}/Login.do'"></div>
                    </div>
                </div>
                <div class="layout-header-shadow-line" style="height: 4px;width: 100%"></div>
            </i-header>
            <layout>
                <sider hide-trigger :style="sider_style">
                    <i-menu active-name="Project-SystemManagement-BusinessUsers" theme="light" width="auto" :open-names="['1']" @on-select="left_menu_click">
                        <menu-item :name="item.name" v-for="(item, key) in leftMenuArrayJson" v-if="item.items==undefined">
                            <icon :type="item.iconType==''?'shuffle':item.iconType" size="20" color="#2d8cf0"></icon>
                            {{item.text}}
                        </menu-item>
                        <Submenu :name="item.name"  v-else-if="item.items.length>0">
                            <template slot="title">
                                <Icon :type="item.iconType==''?'shuffle':item.iconType" color="#2d8cf0"></Icon>
                                {{ item.text }}
                            </template>
                            <template v-for="(i, k) in item.items">
                                <Menu-item v-bind:name="i.name">{{ i.text }}</Menu-item>
                            </template>
                        </Submenu>
                    </i-menu>
                </sider>
                <layout :style="{padding: '0 24px 24px'}">
                    <breadcrumb :style="{margin: '24px 0'}">
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
    var menuJson=${menuJson};
    //var l1MenuArrayJson=null;
    //l1MenuArrayJson=[{"name":"0","parentName":"","text":"Root","iconType":"","url":"","openType":"","path":"Root/"},{"name":"Project-HardDiskTool-List","parentName":"Project-HardDiskTool","text":"硬盘管理","iconType":"soup-can-outline","url":"${ctxpath}/HardDiskTool/HardDiskList.do","openType":"","path":"HardDiskTool/硬盘管理"},{"name":"Project-HardDiskTool-Search","parentName":"Project-HardDiskTool","text":"文件检索","iconType":"ios-search","url":"${ctxpath}/HardDiskTool/HardDiskList.do","openType":"","path":"HardDiskTool/文件检索"},{"name":"Project-HardDiskTool","parentName":"0","text":"HardDiskTool","iconType":"Pastel_Icons_038","url":"","openType":"","path":"Root/HardDiskTool"},{"name":"Work-Tracking-File","parentName":"Work-Tracking-Management","text":"硬盘","iconType":"","url":"","openType":"","path":"RPGMV/硬盘"},{"name":"Work-Tracking-Management","parentName":"0","text":"RPGMV","iconType":"Pastel_Icons_037","url":"","openType":"","path":"Root/RPGMV"},{"name":"Base-Management-Setting","parentName":"Base-Management","text":"系统设置","iconType":"ios-gear-outline","url":"${ctxpath}//System/Setting/List.do","openType":"","path":"System/系统设置"},{"name":"Base-Management","parentName":"0","text":"System","iconType":"Pastel_Icons_064","url":"","openType":"","path":"Root/System"}];
    var menuJson=JsonUtility.ResolveSimpleArrayJsonToTreeJson({
        KeyField: "name",
        RelationField: "parentName",
        ChildFieldName: "items"
    },menuJson,"0");
    var app=new Vue({
        data:{
            topMenuArrayJson:menuJson.items,
            leftMenuArrayJson:menuJson.items[0].items,
            breadcrumbArrayJson:[menuJson.items[0],menuJson.items[0].items[0]],
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
            this.contentIframeUrl=BaseUtility.ReplaceUrlVariable(menuArrayJson.items[0].items[0].url);
        },
        methods:{
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
                return "topMenuItem "+item.iconType;
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