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
    <%@ include file="/WEB-INF/Views/TagLibs/TreeTableLib.jsp" %>
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
                </div>
                <div>
                    <ul id="ztreeUL" class="ztree"></ul>
                </div>
            </div>
        </div>
        <div class="right-outer-c">
            <div style="width: 100%">
                <div style="float: right;margin-bottom: 15px;margin-top: 10px;margin-right: 10px">
                    <i-button type="success" @click="add()"><Icon type="plus"></Icon> 新增 </i-button>
                    <i-button type="primary" @click="edit()"><Icon type="edit"></Icon> 修改 </i-button>
                    <i-button type="primary" @click="del()"><Icon type="trash-a"></Icon> 删除 </i-button>
                    <i-button type="primary" @click="view()"><Icon type="android-open"></Icon> 浏览 </i-button>
                    <i-button type="primary" @click="statusEnable('启用')"><Icon type="checkmark-round"></Icon> 启用 </i-button>
                    <i-button type="primary" @click="statusEnable('禁用')"><Icon type="minus-round"></Icon> 禁用 </i-button>
                    <i-button type="primary" @click="setSelected()"><Icon type="checkmark-round"></Icon> 设为选中 </i-button>
                    <i-button type="primary" @click="move('up')"><Icon type="arrow-up-b"></Icon> 上移</i-button>
                    <i-button type="primary" @click="move('down')"><Icon type="arrow-down-b"></Icon> 下移 </i-button>
                </div>
            </div>
            <div id="divTreeTable" style="width: 98%;margin: auto"></div>
        </div>
    </div>
    <script>
        var treeTableObj=null;
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
                },
                treeTableObject:null,
                treeTableConfig:{
                    CanDeleteWhenHasChild:false,
                    IdField:"dictId",
                    RowIdPrefix:"TreeTable_",
                    LoadChildJsonURL:"",
                    LoadChildFunc:null,
                    OpenLevel:1,
                    ChildTestField:"dictChildCount",//判断是否存在子节点的字段，是否>0或者为true，则支持展开
                    Templates:[
                        {
                            Title:"字典名称",
                            FieldName:"dictText",
                            TitleCellClassName:"TitleCell",
                            Renderer:"Lable",
                            Hidden:false,
                            TitleCellAttrs:{},
                            Width:"40"
                        },{
                            Title:"字典值",
                            FieldName:"dictValue",
                            TitleCellClassName:"TitleCell",
                            Renderer:"Lable",
                            Hidden:false,
                            TitleCellAttrs:{},
                            Width:"40",
                            TextAlign:"center"
                        },{
                            Title:"字典状态",
                            FieldName:"dictStatus",
                            TitleCellClassName:"TitleCell",
                            Renderer:"Lable",
                            Hidden:false,
                            TitleCellAttrs:{},
                            Width:"10%",
                            TextAlign:"center"
                        },{
                            Title:"默认选中",
                            FieldName:"dictIsSelected",
                            TitleCellClassName:"TitleCell",
                            Renderer:"Lable",
                            Hidden:false,
                            TitleCellAttrs:{},
                            Width:"10%",
                            TextAlign:"center"
                        }
                    ],
                    TableClass:"TreeTable",
                    RendererTo:"divTreeTable",//div elem
                    TableId:"TreeTable",
                    TableAttrs:{cellpadding:"0",cellspacing:"0",border:"0"}
                }
            },
            methods:{
                <!--Group-->
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
                },
                <!--Dictionary-->
                reloadTreeTableData:function () {
                    var url='/PlatForm/System/Dictionary/GetListDataByGroupId.do';
                    var _self=this;
                    var senddata={groupId:this.treeSelectedNode.dictGroupId,groupName:this.treeSelectedNode.dictGroupText};
                    AjaxUtility.Post(url, senddata , function (result) {
                        if (result.success) {
                            //debugger;
                            if(result.data==null){
                                result.data=new Array();
                            }
                            result.data.push({dictId:senddata.groupId,dictKey:senddata.groupId,dictValue:senddata.groupName,dictText:senddata.groupName,dictStatus:"",dictIsSelected:"",dictCreateTime:""});
                            var treedata=JsonUtility.ResolveSimpleArrayJsonToTreeJson({
                                KeyField: "dictId",
                                RelationField:"dictParentId",
                                ChildFieldName:"Nodes"
                            },result.data,senddata.groupId);
                            $("#divTreeTable").html("");
                            _self.treeTableObject=Object.create(TreeTable);
                            _self.treeTableObject.Initialization(_self.treeTableConfig);
                            _self.treeTableObject.LoadJsonData(treedata);
                        }
                    },"json");
                },
                mareSureSelectedTreeTableRow:function (actionText) {
                    if(this.treeTableObject!=null) {
                        var nodeData = this.treeTableObject.GetSelectedRowData();
                        if (nodeData == null) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择需要"+actionText+"的字典!", null);
                            return {
                                then:function (func) {
                                }
                            }
                        }
                        if(nodeData.dictId==this.treeSelectedNode.dictGroupId){
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "不能编辑根节点!", null);
                            return {
                                then:function (func) {
                                }
                            }
                        }
                        return {
                            then:function (func) {
                                func(nodeData);
                            }
                        }
                    }
                    else{
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请先选定分组!", null);
                    }
                    return {
                        then:function (func) {
                        }
                    }
                },
                add:function(){
                    if(this.treeTableObject!=null){
                        var nodeData=this.treeTableObject.GetSelectedRowData();
                        if(nodeData == null) {
                            DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择上级字典!",null);
                            return false;
                        }
                        var url=BaseUtility.BuildUrl("/PlatForm/System/Dictionary/Detail.do?dictParentId="+nodeData.dictId+"&op=add&dictGroupId="+this.treeSelectedNode.dictGroupId);
                        DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,url,{title:"字典管理"},2);
                    }
                },
                edit:function(){
                    this.mareSureSelectedTreeTableRow("编辑").then(function (nodeData) {
                        var url = BaseUtility.BuildUrl("/PlatForm/System/Dictionary/Detail.do?op=update&recordId=" + nodeData.dictId);
                        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "字典管理"}, 2);
                    })
                    /*if(this.treeTableObject!=null) {
                        var nodeData = this.treeTableObject.GetSelectedRowData();
                        if (nodeData == null) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择需要编辑的字典!", null);
                            return false;
                        }
                        if(nodeData.dictId==this.treeSelectedNode.dictGroupId){
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "不能编辑根节点!", null);
                            return;
                        }
                        var url = BaseUtility.BuildUrl("/PlatForm/System/Dictionary/Detail.do?op=update&recordId=" + nodeData.dictId);
                        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "字典管理"}, 2);
                    }*/
                },
                del:function(){
                    var _self=this;
                    this.mareSureSelectedTreeTableRow("删除").then(function (nodeData) {
                        var url="/PlatForm/System/Dictionary/Delete.do";
                        var recordId=nodeData.dictId;
                        DialogUtility.Comfirm(window, "确认要删除选定的节点吗？", function () {
                            AjaxUtility.Post(url, {recordId: recordId}, function (result) {
                                if (result.success) {
                                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                        _self.treeTableObject.DeleteRow(recordId);

                                    });
                                }
                                else {
                                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                                }
                            }, "json");
                        });
                    })
                    /*if(this.treeTableObject!=null) {
                        var nodeData = this.treeTableObject.GetSelectedRowData();
                        if (nodeData == null) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择需要删除的字典!", null);
                            return false;
                        }
                        if(nodeData.dictId==this.treeSelectedNode.dictGroupId){
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "不能删除根节点!", null);
                            return;
                        }
                        var url="/PlatForm/System/Dictionary/Delete.do";
                        var recordId=nodeData.dictId;
                        var _self=this;
                        DialogUtility.Comfirm(window, "确认要删除选定的节点吗？", function () {
                            AjaxUtility.Post(url, {recordId: recordId}, function (result) {
                                if (result.success) {
                                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                        _self.treeTableObject.DeleteRow(recordId);

                                    });
                                }
                                else {
                                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                                }
                            }, "json");
                        });
                    }*/
                },
                view:function(){
                    this.mareSureSelectedTreeTableRow("编辑").then(function (nodeData) {
                        var url = BaseUtility.BuildUrl("/PlatForm/System/Dictionary/Detail.do?op=view&recordId=" + nodeData.dictId);
                        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "字典管理"}, 2);
                    });
                    /*if(this.treeTableObject!=null) {
                        var nodeData = this.treeTableObject.GetSelectedRowData();
                        if (nodeData == null) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择需要查看的字典!", null);
                            return false;
                        }
                        if(nodeData.dictId==this.treeSelectedNode.dictGroupId){
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "不能查看根节点!", null);
                            return;
                        }
                        var url = BaseUtility.BuildUrl("/PlatForm/System/Dictionary/Detail.do?op=view&recordId=" + nodeData.dictId);
                        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "字典管理"}, 2);
                    }*/
                },
                statusEnable:function (statusName) {
                    var _self=this;
                    this.mareSureSelectedTreeTableRow("启用").then(function (nodeData) {
                        var url = "/PlatForm/System/Dictionary/StatusChange.do";
                        var recordId = nodeData.dictId;
                        AjaxUtility.Post(url, {ids: recordId,statusName:statusName}, function (result) {
                            if (result.success) {
                                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                    nodeData.dictStatus=statusName;
                                    _self.treeTableObject.UpdateToRow(nodeData.dictId,nodeData);
                                });
                            }
                            else {
                                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message,null);
                            }
                        }, "json");
                    });
                },
                setSelected:function () {
                    var _self=this;
                    this.mareSureSelectedTreeTableRow("选中").then(function (nodeData) {
                        var url = "/PlatForm/System/Dictionary/SetSelected.do";
                        var recordId = nodeData.dictId;
                        AjaxUtility.Post(url, {recordId: recordId}, function (result) {
                            if (result.success) {
                                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                    //debugger;
                                    var brothersDatas=_self.treeTableObject.GetBrothersNodeDatasByParentId(nodeData.dictId);
                                    for(var i=0;i<brothersDatas.length;i++){
                                        brothersDatas[i].dictIsSelected="否";
                                        _self.treeTableObject.UpdateToRow(brothersDatas[i].dictId, brothersDatas[i]);
                                    }
                                    nodeData.dictIsSelected="是";
                                    _self.treeTableObject.UpdateToRow(nodeData.dictId,nodeData);
                                });
                            }
                            else {
                                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message,null);
                            }
                        }, "json");
                    });
                },
                move:function(type){
                    var _self=this;
                    this.mareSureSelectedTreeTableRow("选中").then(function (nodeData) {
                        var url = '/PlatForm/System/Dictionary/Move.do';
                        var recordId = nodeData.dictId;
                        AjaxUtility.Post(url, {recordId: recordId,type:type}, function (result) {
                            if (result.success) {
                                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                    if(type=="down") {
                                        _self.treeTableObject.MoveDownRow(nodeData.dictId);
                                    }else{
                                        _self.treeTableObject.MoveUpRow(nodeData.dictId);
                                    }
                                    //_self.treeTableObject.UpdateToRow(nodeData.dictId,nodeData);
                                });
                            }
                            else {
                                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message,null);
                            }
                        }, "json");
                    });
                },
                newTreeTableNode : function (dictId, dictKey,dictValue,dictText,dictGroupId,dictCreateTime,dictStatus,dictIsSelected) {
                    var newData={
                        dictId:dictId,
                        dictKey:dictKey,
                        dictValue:dictValue,
                        dictText:dictText,
                        dictGroupId:dictGroupId,
                        dictCreateTime:dictCreateTime,
                        dictStatus:dictStatus,
                        dictIsSelected:dictIsSelected
                    };
                    this.treeTableObject.AppendChildRowToCurrentSelectedRow(newData);
                },
                updateTreeTableNode : function (dictId,dictKey,dictValue,dictText,dictStatus,dictIsSelected) {
                    //debugger;
                    var newData={
                        dictId:dictId,
                        dictKey:dictKey,
                        dictValue:dictValue,
                        dictText:dictText,
                        dictStatus:dictStatus,
                        dictIsSelected:dictIsSelected
                    };
                    this.treeTableObject.UpdateToRow(dictId,newData);
                }
            }
        });
    </script>
</body>
</html>
