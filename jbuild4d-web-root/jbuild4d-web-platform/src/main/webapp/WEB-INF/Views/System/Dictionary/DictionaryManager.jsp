<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/19
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
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
    <style>
        .left-outer-c{
            position: absolute;left: 0px;top: 0px;width:185px;bottom: 0px;
            border: #0B61A4 1px solid;
            border-radius: 4px;
        }
        .right-outer-c{
            position: absolute;left: 200px;top: 0px;right:10px;bottom: 0px;
            border: #0B61A4 1px solid;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div id="appList">
        <div class="left-outer-c">
            <div class="left-page-c">
                <div class="tool-bar-c">
                    <div alt="新增分类组" title="新增分类组" class="add" @click="addGroup()"></div>
                    <div alt="修改分类组" title="修改分类组" class="edit" @click="editGroup"></div>
                    <div alt="删除分类组" title="删除分类组" class="del" @click="delGroup"></div>
                    <div alt="浏览分类组" title="浏览分类组" class="view" @click="viewGroup"></div>
                    <div alt="上移" title="上移" class="order-up" @click=""></div>
                    <div alt="下移" title="下移" class="order-down last" @click=""></div>
                </div>
                <div>
                    <ul id="ztreeUL" class="ztree"></ul>
                </div>
            </div>
        </div>
        <div class="right-outer-c">
            <div style="width: 100%">
                <div style="float: right;margin-bottom: 15px">
                    <i-button type="primary" @click="add()" ><Icon type="plus"></Icon> 新增 </i-button>
                    <i-button type="primary" @click="edit()"><Icon type="edit"></Icon> 修改 </i-button>
                    <i-button type="primary" @click="del()"><Icon type="trash-a"></Icon> 删除 </i-button>
                    <i-button type="primary" @click="view()"><Icon type="android-open"></Icon> 浏览 </i-button>
                    <i-button type="primary" @click="moveUp()"><Icon type="android-open"></Icon> 上移 </i-button>
                    <i-button type="primary" @click="moveDown()"><Icon type="android-open"></Icon> 下移 </i-button>
                </div>
            </div>
            <div id="divEditTable"></div>
        </div>
    </div>
    <script>
        var treeTableObj=null;
        var appList=new Vue({
            el:"#appList",
            mounted:function () {
            },
            data:{
                table_data:null,
                treeSetting:{
                    async : {
                        enable : true,
                        // Ajax 获取数据的 URL 地址
                        url : BaseUtility.BuildUrl("/PlatForm/System/DictionaryGroup/GetListData.do"),
                        //ajax提交的时候，传的是id值
                        autoParam : [ "categoryId", "categoryName" ]
                    },
                    // 必须使用data
                    data:{
                        key:{
                            name:"categoryName"
                        },
                        simpleData : {
                            enable : true,
                            idKey : "categoryId", // id编号命名
                            pIdKey : "parentId",  // 父id编号命名
                            rootId : 0
                        }
                    },
                    // 回调函数
                    callback : {
                        onClick : function(event, treeId, treeNode) {
                            // 根节点不触发任何事件
                            if(treeNode.level != 0) {

                            }
                        },
                        //成功的回调函数
                        onAsyncSuccess : function(event, treeId, treeNode, msg){

                        }
                    }
                }
            },
            methods:{
                <!--Group-->
                initTree:function () {
                    $.fn.zTree.init($("#ztreeUL"), this.treeSetting);
                },
                addGroup:function () {
                    var url = BaseUtility.BuildUrl("/PlatForm/System/DictionaryGroup/Detail.do?op=add");
                    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "字典分组"}, 3);
                },
                editGroup:function () {

                },
                delGroup:function () {

                },
                viewGroup:function () {

                },
                <!--Dictionary-->
                reloadData:function () {
                    /*var url='/PlatForm/System/Dictionary/GetListData.do';
                    var _self=this;
                    var senddata={};
                    AjaxUtility.Post(url, senddata , function (result) {
                        if (result.success) {
                            _self.table_data = new Array();
                            _self.table_data = result.data;
                            var treedata=JsonUtility.ResolveSimpleArrayJsonToTreeJson({
                                KeyField: "dictSid",
                                RelationField:"dictParentId",
                                ChildFieldName:"Nodes"
                            },result.data,0);
                            treeTableObj=Object.create(TreeTable);
                            treeTableObj.Initialization(TreeTableConfig);
                            treeTableObj.LoadJsonData(treedata);
                        }
                    },"json");*/
                },
                add:function(){
                    var nodeData=treeTableObj.GetSelectedRowData();
                    if(nodeData == null) {
                        B4D.DialogUtility.Alert(window,B4D.DialogUtility.DialogAlertId,{},"请选择上级字典!",null);
                        return false;
                    }
                    var url=BaseUtility.BuildUrl("/project/system/dictionary/detail.do?dictParentId="+nodeData.dictSid+"&op=add");
                    DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,url,{title:"字典管理"},2);
                    //treeTableObj.AppendChildRowToCurrentSelectedRow(newrowData);
                },
                edit:function(){
                    var nodeData=treeTableObj.GetSelectedRowData();
                    if(nodeData == null) {
                        B4D.DialogUtility.Alert(window,B4D.DialogUtility.DialogAlertId,{},"请选择需要编辑的字典!",null);
                        return false;
                    }
                    var url=BaseUtility.BuildUrl("/project/system/dictionary/detail.do?sId="+nodeData.dictSid+"&op=update");
                    DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,url,{title:"字典管理"},2);
                },
                del:function(){
                    B4D.DialogUtility.Alert(window,B4D.DialogUtility.DialogAlertId,{},"未实现!",null);
                },
                view:function(){
                    var nodeData=treeTableObj.GetSelectedRowData();
                    if(nodeData == null) {
                        B4D.DialogUtility.Alert(window,B4D.DialogUtility.DialogAlertId,{},"请选择需要查看的字典!",null);
                        return false;
                    }
                    var url=BaseUtility.BuildUrl("/project/system/dictionary/detail.do?sId="+nodeData.dictSid+"&op=view");
                    DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,url,{title:"字典管理"},2);
                },
                moveUp:function(){
                    B4D.DialogUtility.Alert(window,B4D.DialogUtility.DialogAlertId,{},"未实现!",null);
                    return false;
                    var nodeData=treeTableObj.GetSelectedRowData();
                    if(nodeData == null) {
                        B4D.DialogUtility.Alert(window,B4D.DialogUtility.DialogAlertId,{},"未实现!",null);
                        return false;
                    }
                    var nodeData=treeTableObj.GetSelectedRowData();
                    treeTableObj.MoveUpRow(nodeData.Organ_Id);
                },
                moveDown:function(){
                    B4D.DialogUtility.Alert(window,B4D.DialogUtility.DialogAlertId,{},"未实现!",null);
                    return false;
                    var nodeData=treeTableObj.GetSelectedRowData();
                    if(nodeData == null) {
                        B4D.DialogUtility.Alert(window,B4D.DialogUtility.DialogAlertId,{},"未实现!",null);
                        return false;
                    }
                    var nodeData=treeTableObj.GetSelectedRowData();
                    treeTableObj.MoveDownRow(nodeData.Organ_Id);
                }
            }
        });
    </script>
</body>
</html>
