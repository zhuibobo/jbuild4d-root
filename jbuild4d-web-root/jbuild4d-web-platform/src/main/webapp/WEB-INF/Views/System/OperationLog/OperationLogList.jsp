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
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
</head>
<body>
<div id="appList" class="iv-list-page-wrap">
    <div class="list-simple-search-wrap" id="list-simple-search-wrap">
        <table class="ls-table">
            <colgroup>
                <col style="width: 80px">
                <col style="">
                <col style="width: 80px">
                <col style="">
                <col style="width: 100px">
                <col style="">
                <col style="width: 80px">
                <col style="">
                <col style="width: 80px">
            </colgroup>
            <tr class="ls-table-row">
                <td>内容：</td>
                <td>
                    <i-input v-model="searchCondition.logText.value" placeholder=""></i-input>
                </td>
                <td>用户：</td>
                <td>
                    <i-input v-model="searchCondition.logUserName.value" placeholder=""></i-input>
                </td>
                <td>时间（从）：</td>
                <td>
                    <date-picker v-model="searchCondition.logCreateTime_s.value" type="date" placeholder="" style="width: 100%"></date-picker>
                </td>
                <td>（到）：</td>
                <td>
                    <date-picker v-model="searchCondition.logCreateTime_e.value" type="date" placeholder="" style="width: 100%"></date-picker>
                </td>
                <td><i-button type="primary" @click="search"><Icon type="android-search"></Icon> 查询 </i-button></td>
            </tr>
        </table>
    </div>
    <div id="list-button-wrap" class="list-button-outer-wrap">
        <div class="list-button-inner-wrap">
        </div>
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
<script>
    var appList = new Vue({
        el: "#appList",
        mounted: function () {
            this.reloadData();
            window.setTimeout(function () {
                appList.listHeight=ListPageUtility.GetGeneralPageHeight(0);
            },500);
        },
        data: {
            idFieldName:"logId",
            searchCondition:{
                logText:{
                    value:"",
                    type:SearchUtility.SearchFieldType.LikeStringType
                },
                logUserName:{
                    value:"",
                    type:SearchUtility.SearchFieldType.LikeStringType
                },
                logCreateTime_s:{
                    value:"",
                    type:SearchUtility.SearchFieldType.DataStringType
                },
                logCreateTime_e:{
                    value:"",
                    type:SearchUtility.SearchFieldType.DataStringType
                }
            },
            columnsConfig: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '内容',
                    key: 'logText',
                    align: "left"
                }, {
                    title: '子系统名称',
                    width: 150,
                    key: 'logSystemName',
                    align: "center"
                }, {
                    title: '模块名称',
                    width: 150,
                    key: 'logModuleName',
                    align: "center"
                }, {
                    title: '用户名称',
                    width: 100,
                    align: "center",
                    width: 100,
                    key: 'logUserName'
                }, {
                    title: '记录时间',
                    key: 'logCreateTime',
                    width: 100,
                    align: "center",
                    render: function (h, params) {
                        return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.logCreateTime);
                    }
                }, {
                    title: '操作',
                    key: 'dictGroupId',
                    width: 70,
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
        methods: {
            selectionChange: function (selection) {
                this.selectionRows = selection;
            },
            reloadData: function () {
                var url = '/PlatForm/System/OperationLog/GetListData.do';
                ListPageUtility.IViewTableLoadDataSearch(url,this.pageNum,this.pageSize,this.searchCondition,this,this.idFieldName,true,null);
                //this.selectionRows=null;
            },
            view:function (recordId) {
                var url = BaseUtility.BuildUrl("/PlatForm/System/OperationLog/Detail.do?op=view&recordId=" + recordId);
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "通用列表"}, 2);
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
