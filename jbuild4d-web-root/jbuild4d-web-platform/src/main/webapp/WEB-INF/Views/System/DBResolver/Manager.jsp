<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/25
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
    <%@ include file="/WEB-INF/Views/TagLibs/ZTreeLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/TreeTableLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
</head>
<body>
<div id="appList" class="list-2column">
    <div class="left-outer-wrap-c" style="width: 435px;">
        <div class="left-page-c" style="padding: 10px">
            <div class="list-simple-search-wrap" id="list-simple-search-wrap" style="border-width:0px ">
                <table class="ls-table">
                    <colgroup>
                        <col style="">
                        <col style="width: 80px">
                    </colgroup>
                    <tr class="ls-table-row">
                        <td>
                            <i-input v-model="searchCondition.tableName.value" placeholder=""></i-input>
                        </td>
                        <td><i-button type="primary" @click="search"><Icon type="android-search"></Icon> 查询 </i-button></td>
                    </tr>
                </table>
            </div>
            <div id="list-button-wrap" class="list-button-outer-wrap">
                <div style="clear: both"></div>
            </div>
            <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
                     class="iv-list-table" :highlight-row="true"
                     @on-selection-change="selectionChange"></i-table>
            <div style="float: right;" id="list-pager-wrap">
                <page @on-change="changePage" :current.sync="pageNum" :page-size="pageSize" show-total
                      :total="pageTotal"></page>
            </div>
        </div>
    </div>
    <div class="right-outer-wrap-c" style="padding: 10px;left: 450px;">
        <tabs type="card">
            <tab-pane label="Entity">标签一的内容</tab-pane>
            <tab-pane label="MapperAC">标签二的内容</tab-pane>
            <tab-pane label="MapperEX">标签二的内容</tab-pane>
            <tab-pane label="Service">标签二的内容</tab-pane>
            <tab-pane label="Bean">标签三的内容</tab-pane>
            <tab-pane label="Controller">标签二的内容</tab-pane>
            <tab-pane label="ListJsp">标签二的内容</tab-pane>
            <tab-pane label="DetailJsp">标签二的内容</tab-pane>
        </tabs>
    </div>
</div>
<script>
    var appList=new Vue({
        el:"#appList",
        mounted:function () {
            window.setTimeout(function () {
                appList.listHeight=ListPageUtility.GetGeneralPageHeight(-20);
            },500);
        },
        data:{
            <!--List-->
            idFieldName:"ddtlId",
            searchCondition:{
                tableName:{
                    value:"",
                    type:SearchUtility.SearchFieldType.StringType
                }
            },
            columnsConfig: [
                {
                    title: '表名',
                    key: 'ddtlKey',
                    align: "center"
                },{
                    title: '操作',
                    key: 'dictGroupId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        return h('div',{class: "list-row-button-wrap"},[
                            ListPageUtility.IViewTableInnerButton.ViewButton(h,params,appList.idFieldName,appList)
                        ]);
                    }
                }
            ],
            tableData: [],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 12,
            pageNum: 1,
            listHeight: 300
        },
        methods:{
            <!--List-->
            selectionChange: function (selection) {
                this.selectionRows = selection;
            },
            reloadData: function () {
                var url = '/PlatForm/DevDemo/TreeAndList/DevDemoTLList/GetListData.do';
                //debugger;
                ListPageUtility.IViewTableLoadDataSearch(url,this.pageNum,this.pageSize,this.searchCondition,this,this.idFieldName,true,null);
                //this.selectionRows=null;
            },
            view:function (recordId) {
                var url = BaseUtility.BuildUrl("/PlatForm/DevDemo/TreeAndList/DevDemoTLList/Detail.do?op=view&recordId=" + recordId);
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "列表"}, 2);
            },
            changePage: function (pageNum) {
                this.pageNum = pageNum;
                this.reloadData();
                this.selectionRows=null;
            },
            search:function () {
                this.pageNum=1;
                this.reloadData();
            }
        }
    });
</script>
</body>
</html>