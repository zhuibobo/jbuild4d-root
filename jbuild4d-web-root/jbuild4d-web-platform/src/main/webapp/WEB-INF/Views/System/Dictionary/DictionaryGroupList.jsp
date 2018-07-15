<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/5
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
<div id="app" class="iv-list-page-wrap">
    <div style="width: 100%" id="list-button-wrap">
        <div style="float: right">
            <i-button type="primary" @click="add()">
                <Icon type="plus"></Icon>
                新增
            </i-button>
            <i-button type="primary" @click="statusEnable('启用')">
                <Icon type="checkmark-round"></Icon>
                启用
            </i-button>
            <i-button type="primary" @click="statusEnable('禁用')">
                <Icon type="minus-round"></Icon>
                禁用
            </i-button>
        </div>
        <div style="clear: both"></div>
    </div>
    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
             class="iv-list-table" :highlight-row="true"
             @on-selection-change="selectionChange"></i-table>
    <div style="float: right;">
        <page @on-change="changePage" :current.sync="pageNum" :page-size="pageSize" show-total
              :total="pageTotal"></page>
    </div>
</div>
<script>
    var app = new Vue({
        el: "#app",
        mounted: function () {
            this.reloadData();
        },
        data: {
            columnsConfig: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '分组名称',
                    key: 'dictGroupText',
                    align: "center"
                }, {
                    title: '分组值',
                    key: 'dictGroupValue',
                    align: "center"
                }, {
                    title: '备注',
                    key: 'dictGroupDesc'
                }, {
                    title: '状态',
                    width: 100,
                    align: "center",
                    key: 'dictGroupStatus'
                }, {
                    title: '创建时间',
                    key: 'dictGroupCreateTime',
                    width: 100,
                    align: "center",
                    render: function (h, params) {
                        return JB4D.ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.dictGroupCreateTime);
                    }
                }, {
                    title: '操作',
                    key: 'dictGroupId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        return h('div',{class: "list-row-button-wrap"},[
                            ListPageUtility.IViewTableInnerButton.EditButton(h,params,"dictGroupId",app),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,"dictGroupId",app)
                        ]);
                    }
                }
            ],
            tableData: [],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 10,
            pageNum: 1,
            listHeight: JB4D.ListPageUtility.GetGeneralPageHeight(JB4D.ListPageUtility.GetFixHeightNotSearch())
        },
        methods: {
            selectionChange: function (selection) {
                this.selectionRows = selection;
            },
            reloadData: function () {
                var url = '/PlatForm/DevDemo/DevDemoGenList/GetListData.do';
                JB4D.ListPageUtility.IViewTableLoadDataNoSearch(url,this.pageNum,this.pageSize,this);
                this.selectionRows=null;
            },
            add: function () {
                var url = BaseUtility.BuildUrl("/PlatForm/DevDemo/DevDemoGenList/Detail.do?op=add");
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "数据字典分组管理"}, 3);
            },
            edit: function (recordId) {
                var url = BaseUtility.BuildUrl("/PlatForm/DevDemo/DevDemoGenList/Detail.do?op=update&recordId=" + recordId);
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "数据字典分组管理"}, 3);
            },
            del: function (recordId) {
                var url = '/PlatForm/DevDemo/DevDemoGenList/Delete.do';
                JB4D.ListPageUtility.IViewTableDeleteRow(url,recordId,app);
            },
            statusEnable: function (statusName) {
                var url = '/PlatForm/DevDemo/DevDemoGenList/StatusChange.do';
                JB4D.ListPageUtility.IViewChangeServerStatusFace(url,this.selectionRows,"dictGroupId",statusName,app);
            },
            changePage: function (pageNum) {
                this.pageNum = pageNum;
                this.reloadData();
            }
        }
    });
</script>
</body>
</html>
