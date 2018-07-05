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
<div id="app">
    <div style="width: 100%" id="list-button-wrap">
        <div style="float: right">
            <i-button type="primary" @click="add()"><Icon type="plus"></Icon> 新增 </i-button>
            <i-button type="primary" @click="edit()"><Icon type="edit"></Icon> 修改 </i-button>
            <i-button type="primary" @click="del()"><Icon type="trash-a"></Icon> 删除 </i-button>
        </div>
        <div style="clear: both"></div>
    </div>
    <i-table :height="list_height" stripe border :columns="columns_config" :data="table_data" :style="{marginTop:'10px',marginBottom:'10px'}" :highlight-row="true" @on-current-change="currentSelectedSingleRow"></i-table>
    <div style="float: right;">
        <page @on-change="changePage" :current.sync="page_num" :page-size="page_size" show-total  :total="page_total"></page>
    </div>
</div>
<script>
    var app=new Vue({
        el:"#app",
        mounted:function () {
            this.reloadData();
        },
        data:{
            columns_config: [
                {
                    title: '分组名称',
                    key: 'dictGroupText'
                },{
                    title: '分组值',
                    key: 'dictGroupValue'

                },{
                    title: '创建时间',
                    key: 'dictGroupCreateTime',
                    render: function (h, params) {
                        return JB4D.ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h,params.row.dictGroupCreateTime);
                    }
                },{
                    title: '操作',
                    key: 'orgSid',
                    width:120,
                    render:function (h, params) {
                        return h('div',{class:"list-row-button-wrap"},[
                            h('div', {
                                class:"list-row-button list-row-button-edit",
                                on: {
                                    click: function () {
                                        app.edit(params.row.roleSid);
                                    }
                                }
                            }),
                            h('div', {
                                class:"list-row-button list-row-button-del",
                                on: {
                                    click: function () {
                                        app.del(params.row.roleSid);
                                    }
                                }
                            })
                        ]);
                    }
                }
            ],
            table_data: [],
            current_selected_row:null,
            page_total:0,
            page_size:5,
            page_num:1,
            list_height:JB4D.ListPageUtility.GetGeneralPageHeight(JB4D.ListPageUtility.GetFixHeightNotSearch())
        },
        methods:{
            currentSelectedSingleRow:function (currentRow,oldCurrentRow) {
                this.current_selected_row=currentRow;
            },
            reloadData:function () {
                var url='/project/system/role/listdata.do';
                var _self=this;
                //debugger;
                var senddata={
                    page_num:_self.page_num,
                    page_size:_self.page_size
                }
                AjaxUtility.Post(url, senddata , function (result) {
                    if (result.success) {
                        _self.table_data = new Array();
                        _self.table_data = result.data.list;
                        _self.page_total = result.data.total;
                    }
                },"json");
            },
            makingSureId:function (id) {
                //debugger;
                if(!id&&this.current_selected_row!=null) {
                    id = this.current_selected_row.roleSid
                }
                if(!id) {
                    B4D.DialogUtility.Alert(window, B4D.DialogUtility.DialogAlertId, {}, "请选中需要操作的行!", null);
                    return {
                        then:function (func) {
                        }
                    }
                }
                return {
                    then:function (func) {
                        func(id);
                    }
                }
            },
            add:function () {
                var url=BaseUtility.BuildUrl("/PlatForm/System/DictionaryGroup/Detail.do?op=add");
                DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,url,{title:"数据字典分组管理",width:400,height:310},4);
            },
            edit:function (id) {
                this.makingSureId(id).then(function (id) {
                    var url=BaseUtility.BuildUrl("/project/system/role/detail.do?sId="+id);
                    DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,url,{title:"角色管理"},2);
                });
            },
            del:function (id) {
                this.makingSureId(id).then(function (id) {
                    B4D.DialogUtility.Alert(window,B4D.DialogUtility.DialogAlertId,{},"未实现!",null);
                });
            },
            changePage:function(page){
                this.page_num=page;
                this.reloadData();
            }
        }
    });
</script>
</body>
</html>
