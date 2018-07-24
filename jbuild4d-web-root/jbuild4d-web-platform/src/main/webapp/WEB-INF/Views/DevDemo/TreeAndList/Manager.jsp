<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/24
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
    <div class="left-outer-wrap-c">
        <div class="left-page-c">
            <div class="tool-bar-c">
                <div alt="新增分类组" title="新增分类组" class="add" @click="addGroup()"></div>
                <div alt="修改分类组" title="修改分类组" class="edit" @click="editGroup"></div>
                <div alt="删除分类组" title="删除分类组" class="del" @click="delGroup"></div>
                <div alt="浏览分类组" title="浏览分类组" class="view" @click="viewGroup"></div>
                <div alt="上移" title="上移" class="order-up" @click="moveGroup('up')"></div>
                <div alt="下移" title="下移" class="order-down last" @click="moveGroup('down')"></div>
            </div>
            <div>
                <ul id="ztreeUL" class="ztree"></ul>
            </div>
        </div>
    </div>
    <div class="right-outer-wrap-c">

    </div>
</div>
<script>
    var appList=new Vue({
        el:"#appList",
        mounted:function () {
            this.initTree();
        },
        data:{
            treeIdFieldName:"ddttId",
            treeObj:null,
            treeSelectedNode:null,
            treeSetting:{
                async : {
                    enable : true,
                    // Ajax 获取数据的 URL 地址
                    url : BaseUtility.BuildUrl("/PlatForm/DevDemo/TreeAndList/DevDemoTLTree/GetTreeData.do")
                },
                // 必须使用data
                data:{
                    key:{
                        name:"ddttName"
                    },
                    simpleData : {
                        enable : true,
                        idKey : "ddttId", // id编号命名
                        pIdKey : "ddttParentId",  // 父id编号命名
                        rootId : 0
                    }
                },
                // 回调函数
                callback : {
                    onClick : function(event, treeId, treeNode) {
                        // 根节点不触发任何事件
                        //if(treeNode.level != 0) {
                        appList.treeSelectedNode=treeNode;
                        //appList.reloadTreeTableData();
                        //}
                    },
                    //成功的回调函数
                    onAsyncSuccess : function(event, treeId, treeNode, msg){
                        appList.treeObj.expandAll(true);
                    }
                }
            }
        },
        methods:{
            <!--Tree-->
            initTree:function () {
                this.treeObj=$.fn.zTree.init($("#ztreeUL"), this.treeSetting);
            },
            addGroup:function () {
                if(this.treeSelectedNode!=null) {
                    var url = BaseUtility.BuildUrl("/PlatForm/DevDemo/TreeAndList/DevDemoTLTree/Detail.do?op=add&parentId="+this.treeSelectedNode[appList.treeIdFieldName]);
                    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "分组"}, 2);
                }
                else {
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择父节点!",null);
                }
            },
            editGroup:function () {
                if(this.treeSelectedNode!=null) {
                    var url = BaseUtility.BuildUrl("/PlatForm/DevDemo/TreeAndList/DevDemoTLTree/Detail.do?op=update&recordId="+this.treeSelectedNode[appList.treeIdFieldName]);
                    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "分组"}, 2);
                }
                else {
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择需要编辑的节点!",null);
                }
            },
            viewGroup:function () {
                var url = BaseUtility.BuildUrl("/PlatForm/DevDemo/TreeAndList/DevDemoTLTree/Detail.do?op=view&recordId=" + this.treeSelectedNode[appList.treeIdFieldName]);
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "分组"}, 2);
            },
            delGroup:function () {
                var url="/PlatForm/DevDemo/TreeAndList/DevDemoTLTree/Delete.do";
                var recordId=this.treeSelectedNode[appList.treeIdFieldName];
                DialogUtility.Comfirm(window, "确认要删除选定的节点吗？", function () {
                    AjaxUtility.Post(url, {recordId: recordId}, function (result) {
                        if (result.success) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                appList.treeObj.removeNode(appList.treeSelectedNode);
                                appList.treeSelectedNode=null;
                            });
                        }
                        else {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                        }
                    }, "json");
                });
            },
            moveGroup:function (type) {
                if(this.treeSelectedNode!=null) {
                    var url = '/PlatForm/DevDemo/TreeAndList/DevDemoTLTree/Move.do';
                    var recordId = this.treeSelectedNode[appList.treeIdFieldName];
                    AjaxUtility.Post(url, {recordId: recordId,type:type}, function (result) {
                        if (result.success) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                if(type=="down") {
                                    //_self.treeTableObject.MoveDownRow(appList.treeSelectedNode[appList.treeTableConfig.IdField]);
                                }else{
                                    //_self.treeTableObject.MoveUpRow(appList.treeSelectedNode[appList.treeTableConfig.IdField]);
                                }
                            });
                        }
                        else {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message,null);
                        }
                    }, "json");
                }
                else {
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择需要编辑的节点!",null);
                }
            },
            newTreeNode : function (newNodeData) {
                var silent = false;
                //var newNode = {dictGroupId:dictGroupId, dictGroupValue:dictGroupValue,dictGroupText:dictGroupText,dictGroupParentId:dictGroupParentId};
                appList.treeObj.addNodes(this.treeSelectedNode,newNodeData,silent);
            },
            updateNode : function (newNodeData) {
                //this.treeSelectedNode.dictGroupValue=dictGroupValue;
                this.treeSelectedNode=$.extend(true,this.treeSelectedNode, newNodeData);
                appList.treeObj.updateNode(this.treeSelectedNode);
            }

            <!--List-->
        }
    });
</script>
</body>
</html>
