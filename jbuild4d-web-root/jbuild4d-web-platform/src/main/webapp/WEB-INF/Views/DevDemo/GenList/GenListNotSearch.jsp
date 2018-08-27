<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/15
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
        <div id="list-button-wrap" class="list-button-outer-wrap">
            <div class="list-button-inner-wrap">
                <i-button type="success" @click="add()">
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
                <i-button type="primary" @click="move('up')">
                    <Icon type="arrow-up-b"></Icon>
                    上移
                </i-button>
                <i-button type="primary" @click="move('down')">
                    <Icon type="arrow-down-b"></Icon>
                    下移
                </i-button>
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
                idFieldName:"ddglId",
                searchCondition:{
                    ddglKey:{
                        value:"",
                        type:SearchUtility.SearchFieldType.LikeStringType
                    },
                    ddglName:{
                        value:"",
                        type:SearchUtility.SearchFieldType.StringType
                    },
                    ddglCreatetime_s:{
                        value:"",
                        type:SearchUtility.SearchFieldType.DataStringType
                    },
                    ddglCreatetime_e:{
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
                        title: 'ddglKey',
                        key: 'ddglKey',
                        align: "center"
                    }, {
                        title: 'ddglName',
                        key: 'ddglName',
                        align: "center"
                    }, {
                        title: 'ddglDesc',
                        key: 'ddglDesc'
                    }, {
                        title: 'ddglStatus',
                        width: 100,
                        align: "center",
                        key: 'ddglStatus'
                    }, {
                        title: 'CT',
                        key: 'ddglCreatetime',
                        width: 100,
                        align: "center",
                        render: function (h, params) {
                            return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.ddglCreatetime);
                        }
                    }, {
                        title: '操作',
                        key: 'dictGroupId',
                        width: 120,
                        align: "center",
                        render: function (h, params) {
                            return h('div',{class: "list-row-button-wrap"},[
                                ListPageUtility.IViewTableInnerButton.ViewButton(h,params,appList.idFieldName,appList),
                                ListPageUtility.IViewTableInnerButton.EditButton(h,params,appList.idFieldName,appList),
                                ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,appList.idFieldName,appList)
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
                    var url = '/PlatForm/DevDemo/DevDemoGenList/GetListData.do';
                    ListPageUtility.IViewTableLoadDataSearch(url,this.pageNum,this.pageSize,this.searchCondition,this,this.idFieldName,true,null);
                    //this.selectionRows=null;
                },
                add: function () {
                    var url = BaseUtility.BuildUrl("/PlatForm/DevDemo/DevDemoGenList/Detail.do?op=add");
                    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "通用列表"}, 2);
                },
                edit: function (recordId) {
                    var url = BaseUtility.BuildUrl("/PlatForm/DevDemo/DevDemoGenList/Detail.do?op=update&recordId=" + recordId);
                    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "通用列表"}, 2);
                },
                view:function (recordId) {
                    var url = BaseUtility.BuildUrl("/PlatForm/DevDemo/DevDemoGenList/Detail.do?op=view&recordId=" + recordId);
                    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "通用列表"}, 2);
                },
                del: function (recordId) {
                    var url = '/PlatForm/DevDemo/DevDemoGenList/Delete.do';
                    ListPageUtility.IViewTableDeleteRow(url,recordId,appList);
                },
                statusEnable: function (statusName) {
                    var url = '/PlatForm/DevDemo/DevDemoGenList/StatusChange.do';
                    ListPageUtility.IViewChangeServerStatusFace(url,this.selectionRows,appList.idFieldName,statusName,appList);
                },
                move:function (type) {
                    var url = '/PlatForm/DevDemo/DevDemoGenList/Move.do';
                    ListPageUtility.IViewMoveFace(url,this.selectionRows,appList.idFieldName,type,appList);
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
