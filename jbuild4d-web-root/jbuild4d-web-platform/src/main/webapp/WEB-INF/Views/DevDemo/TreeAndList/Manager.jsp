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
                <div alt="上移" title="上移" class="order-up" onclick=""></div>
                <div alt="下移" title="下移" class="order-down last" onclick=""></div>
            </div>
            <div>
                <ul id="ztreeUL" class="ztree"></ul>
            </div>
        </div>
    </div>
    <div class="right-outer-wrap-c">
        <div style="width: 100%">
            <div style="float: right;margin-bottom: 15px;margin-top: 10px;margin-right: 10px">
                <i-button type="success" @click="add()"><Icon type="plus"></Icon> 新增 </i-button>
                <i-button type="primary" @click="edit()"><Icon type="edit"></Icon> 修改 </i-button>
                <i-button type="primary" @click="del()"><Icon type="trash-a"></Icon> 删除 </i-button>
                <i-button type="primary" @click="view()"><Icon type="android-open"></Icon> 浏览 </i-button>
                <i-button type="primary" @click="statusEnable('启用')"><Icon type="checkmark-round"></Icon> 启用 </i-button>
                <i-button type="primary" @click="statusEnable('禁用')"><Icon type="minus-round"></Icon> 禁用 </i-button>
                <i-button type="primary" @click="move('up')"><Icon type="arrow-up-b"></Icon> 上移</i-button>
                <i-button type="primary" @click="move('down')"><Icon type="arrow-down-b"></Icon> 下移 </i-button>
            </div>
        </div>

    </div>
</div>
<script>
    var appList=new Vue({
        el:"#appList",
        mounted:function () {
            this.initTree();
        },
        data:{
            treeObj:null,
            treeSelectedNode:null,
            treeSetting:{
                async : {
                    enable : true,
                    // Ajax 获取数据的 URL 地址
                    url : BaseUtility.BuildUrl("/PlatForm/System/DictionaryGroup/GetTreeData.do"),
                    //ajax提交的时候，传的是id值
                    autoParam : [ "categoryId", "categoryName" ]
                },
                // 必须使用data
                data:{
                    key:{
                        name:"dictGroupText"
                    },
                    simpleData : {
                        enable : true,
                        idKey : "dictGroupId", // id编号命名
                        pIdKey : "dictGroupParentId",  // 父id编号命名
                        rootId : 0
                    }
                },
                // 回调函数
                callback : {
                    onClick : function(event, treeId, treeNode) {
                        // 根节点不触发任何事件
                        //if(treeNode.level != 0) {
                        appList.treeSelectedNode=treeNode;
                        appList.reloadTreeTableData();
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
                    var url = BaseUtility.BuildUrl("/PlatForm/System/DictionaryGroup/Detail.do?op=add&parentId="+this.treeSelectedNode.dictGroupId);
                    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "字典分组"}, 2);
                }
                else {
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择父节点!",null);
                }
            },
            editGroup:function () {
                if(this.treeSelectedNode!=null) {
                    var url = BaseUtility.BuildUrl("/PlatForm/System/DictionaryGroup/Detail.do?op=update&recordId="+this.treeSelectedNode.dictGroupId);
                    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "字典分组"}, 2);
                }
                else {
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择需要编辑的节点!",null);
                }
            },
            viewGroup:function () {
                var url = BaseUtility.BuildUrl("/PlatForm/System/DictionaryGroup/Detail.do?op=view&recordId=" + this.treeSelectedNode.dictGroupId);
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "字典分组"}, 2);
            },
            delGroup:function () {
                var url="/PlatForm/System/DictionaryGroup/Delete.do";
                var recordId=this.treeSelectedNode.dictGroupId;
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
            newTreeNode : function (dictGroupId, dictGroupValue,dictGroupText,dictGroupParentId) {
                var silent = false;
                var newNode = {dictGroupId:dictGroupId, dictGroupValue:dictGroupValue,dictGroupText:dictGroupText,dictGroupParentId:dictGroupParentId};
                appList.treeObj.addNodes(this.treeSelectedNode,newNode,silent);
            },
            updateNode : function (dictGroupValue,dictGroupText) {
                this.treeSelectedNode.dictGroupValue=dictGroupValue;
                this.treeSelectedNode.dictGroupText=dictGroupText;
                appList.treeObj.updateNode(this.treeSelectedNode);
            }
            <!--List-->
        }
    });
</script>
</body>
</html>
