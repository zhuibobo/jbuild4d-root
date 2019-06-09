/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2018/8/26
**To change this template use File | Settings | File Templates.
*/
Vue.component("select-default-value-dialog", {
    data:function () {
        var _self=this;

        return {
            acInterface:{
                getSelectData:"/PlatFormRest/SelectView/SelectEnvVariable/GetSelectData"
            },
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
                datetimeTreeData:null,
                envVarTreeObj:null,
                envVarTreeSetting:{
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
                envVarTreeData:null,
                numberCodeTreeObj:null,
                numberCodeTreeSetting:{},
                numberCodeTreeData:{}
            }
        }
    },
    mounted:function (){

        this.loadData();
    },
    methods:{
        beginSelect:function(oldData){
            var elem=this.$refs.selectDefaultValueDialogWrap;
            //debugger;
            //this.getTableDataInitTree();

            var height=450;
            /*if(PageStyleUtility.GetPageHeight()>550){
                height=600;
            }*/

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 680,
                width: 980,
                title: "设置默认值"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex",10100);
            $(window.document).find(".ui-dialog").css("zIndex",10101);

            if(oldData==null){
                this.selectType="Const";
                this.selectValue="";
                this.selectText="";
            }
        },
        loadData:function(){
            var _self=this;
            AjaxUtility.Post(this.acInterface.getSelectData,{},function (result) {
                _self.tree.datetimeTreeData=result.data.datetimeTreeData;
                _self.tree.envVarTreeData=result.data.envVarTreeData;
                _self.tree.datetimeTreeObj=$.fn.zTree.init($("#datetimeZTreeUL"), _self.tree.datetimeTreeSetting,_self.tree.datetimeTreeData);
                _self.tree.datetimeTreeObj.expandAll(true);
                _self.tree.envVarTreeObj=$.fn.zTree.init($("#envVarZTreeUL"), _self.tree.envVarTreeSetting,_self.tree.envVarTreeData);
                _self.tree.envVarTreeObj.expandAll(true);
            },"json");
        },
        getSelectInstanceName:function () {
            return BaseUtility.GetUrlParaValue("instanceName");
        },
        selectComplete:function () {
            var result={};
            if(this.selectType=="Const"){
                if(this.selectValue==""){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请设置常量默认值！",null);
                    return;
                }

                result.Type="Const";
                result.Value=this.selectValue;
                result.Text=this.selectValue;
            }
            else if(this.selectType=="DateTime"){
                var selectNodes=this.tree.datetimeTreeObj.getSelectedNodes();
                if(selectNodes.length==0){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择一种时间类型！",null);
                    return;
                }
                else {
                    result.Type = "DateTime";
                    result.Value = selectNodes[0].value;
                    result.Text = selectNodes[0].text;
                }
            }
            else if(this.selectType=="ApiVar"){
                //result.Type = "ApiVar";
                var selectNodes=this.tree.envVarTreeObj.getSelectedNodes();
                if(selectNodes.length==0){
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择一种API类型！",null);
                    return;
                }
                else {
                    if(selectNodes[0].group==true){
                        DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"不能选择分组！",null);
                        return
                    }
                    else {
                        result.Type = "ApiVar";
                        result.Value = selectNodes[0].value;
                        result.Text = selectNodes[0].text;
                    }
                }
            }
            else if(this.selectType=="NumberCode"){
                result.Type = "NumberCode";
            }

            this.$emit('on-selected-default-value', result);
            //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectEnvVariableResultValue(result);
            this.handleClose();
        },
        clearComplete:function(){
            //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectEnvVariableResultValue(null);
            this.$emit('on-selected-default-value', null);
            this.handleClose();
        },
        handleClose: function () {
            //DialogUtility.CloseOpenIframeWindow(window,DialogUtility.DialogId);
            /*if(window.IsOpenForFrame){
                DialogUtility.Frame_CloseDialog(window)
            }
            else {
                DialogUtility.CloseOpenIframeWindow(window, DialogUtility.DialogId);
            }*/
            DialogUtility.CloseDialogElem(this.$refs.selectDefaultValueDialogWrap);
        }
    },
    template: `<div  ref="selectDefaultValueDialogWrap" class="general-edit-page-wrap" style="display: none">
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
                        <tab-pane label="主键生成" name="IdCoder">
                            <ul id="numberCodeZTreeUL1" class="ztree"></ul>
                        </tab-pane>
                    </tabs>
                    <div class="button-outer-wrap">
                        <div class="button-inner-wrap">
                            <button-group>
                                <i-button type="primary" @click="selectComplete()"> 确 认 </i-button>
                                <i-button type="primary" @click="clearComplete()"> 清 空 </i-button>
                                <i-button @click="handleClose()">关 闭</i-button>
                            </button-group>
                        </div>
                    </div>
                </div>`
});
