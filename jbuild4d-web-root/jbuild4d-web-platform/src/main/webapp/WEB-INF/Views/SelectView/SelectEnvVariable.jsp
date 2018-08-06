<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/8/3
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
    <%@ include file="/WEB-INF/Views/TagLibs/ZTreeLib.jsp" %>
</head>
<body>
    <div id="appSelectView">
        <tabs :value="selectType" v-model="selectType">
            <tab-pane label="静态值" name="Const" >
                <i-form :label-width="80" style="width: 80%;margin: 50px auto auto;">
                    <form-item label="静态值：">
                        <i-input v-model="selectValue"></i-input>
                    </form-item>
                </i-form>
            </tab-pane>
            <tab-pane label="日期时间" name="DateTime">
                <ul id="datetimeZTreeUL" class="ztree"></ul>
            </tab-pane>
            <tab-pane label="API变量" name="ApiVar">
                <ul id="envVarZTreeUL" class="ztree"></ul>
            </tab-pane>
            <tab-pane label="序号编码" name="NumberCode">
                <ul id="numberCodeZTreeUL" class="ztree"></ul>
            </tab-pane>
        </tabs>
        <div style="position: absolute;bottom: 0px;width: 100%;text-align: center">
            <i-button type="primary" @click="selectEnvVar()"> 确 认 </i-button>
            <i-button style="margin-left: 8px" @click="handleClose()">关 闭</i-button>
        </div>
    </div>
    <script>
        var appSelectView=new Vue({
            el:"#appSelectView",
            data:{
                selectType:"Const",
                selectValue:"",
                selectText:"",
                tree:{
                    datetimeTreeObj:null,
                    datetimeTreeSetting:{
                        view: {
                            dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                            showLine: true,//是否显示节点之间的连线
                            fontCss: {'color': 'black', 'font-weight': 'normal'}
                        },
                        data: {
                            key: {
                                name: "text",
                            },
                            simpleData: {//简单数据模式
                                enable: true,
                                idKey: "id",
                                pIdKey: "parentId",
                                rootPId: "-1"// 1
                            }
                        },
                        callback: {
                            //点击树节点事件
                            onClick: function (event, treeId, treeNode) {

                            },
                            onDblClick: function (event, treeId, treeNode) {

                            },
                            //成功的回调函数
                            onAsyncSuccess: function (event, treeId, treeNode, msg) {

                            }
                        }
                    },
                    datetimeTreeData:${datetimeTreeData},
                    envVarTreeObj:null,
                    envVarTreeSetting:{},
                    envVarTreeData:${envVarTreeData},
                    numberCodeTreeObj:null,
                    numberCodeTreeSetting:{},
                    numberCodeTreeData:{}
                }
            },
            mounted:function (){
                this.tree.datetimeTreeObj=$.fn.zTree.init($("#datetimeZTreeUL"), this.tree.datetimeTreeSetting,this.tree.datetimeTreeData);
                this.tree.datetimeTreeObj.expandAll(true);
            },
            methods:{
                getSelectInstanceName:function () {
                    return StringUtility.QueryString("instanceName");
                },
                selectEnvVar:function () {
                    var result={};
                    if(this.selectType=="Const"){
                        result.Type="Const";
                        result.Value=this.selectValue;
                        result.Text=this.selectValue;
                    }
                    else if(this.selectType=="DateTime"){
                        var selectNodes=this.tree.datetimeTreeObj.getSelectedNodes();
                        if(selectNodes.length==0){
                            DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择一种时间类型",null);
                        }
                        else {
                            result.Type = "DateTime";
                            result.Value = selectNodes[0].value;
                            result.Text = selectNodes[0].text;
                        }
                    }
                    else if(this.selectType=="ApiVar"){
                        result.Type = "ApiVar";
                    }
                    else if(this.selectType=="NumberCode"){
                        result.Type = "NumberCode";
                    }
                    window.OpenerWindowObj[this.getSelectInstanceName()].SetSelectResultValue(result);
                    this.handleClose();
                },
                handleClose: function () {
                    DialogUtility.CloseOpenIframeWindow(window,DialogUtility.DialogId);
                }
            }
        })
    </script>
</body>
</html>
