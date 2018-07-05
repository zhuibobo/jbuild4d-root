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
    <%@ include file="/WEB-INF/Views/TagLibs/TreeTableLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
    <script>
        var TreeTableConfig={
            CanDeleteWhenHasChild:false,
            IdField:"dictSid",
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
                    Width:"30"
                },{
                    Title:"字典值",
                    FieldName:"dictValue",
                    TitleCellClassName:"TitleCell",
                    Renderer:"Lable",
                    Hidden:false,
                    TitleCellAttrs:{},
                    Width:"30"
                },{
                    Title:"字典状态",
                    FieldName:"dictStatus",
                    TitleCellClassName:"TitleCell",
                    Renderer:"Lable",
                    Hidden:false,
                    TitleCellAttrs:{},
                    Width:"10%"
                },{
                    Title:"默认选中",
                    FieldName:"dictIsSelected",
                    TitleCellClassName:"TitleCell",
                    Renderer:"Lable",
                    Hidden:false,
                    TitleCellAttrs:{},
                    Width:"10%"
                },{
                    Title:"创建时间",
                    FieldName:"dictCreateTime",
                    TitleCellClassName:"TitleCell",
                    Renderer:"Lable",
                    Hidden:false,
                    TitleCellAttrs:{},
                    Width:"20%"
                }
            ],
            TableClass:"TreeTable",
            RendererTo:"divEditTable",//div elem
            TableId:"TreeTable",
            TableAttrs:{cellpadding:"0",cellspacing:"0",border:"0"}
        }
    </script>
</head>
<body>
<div id="app">
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
<script>
    var treeTableObj=null;
    var app=new Vue({
        el:"#app",
        mounted:function () {
            this.reloadData();
        },
        data:{
            table_data:null
        },
        methods:{
            refreshPage:function () {
                window.location.href=window.location.href;
            },
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
