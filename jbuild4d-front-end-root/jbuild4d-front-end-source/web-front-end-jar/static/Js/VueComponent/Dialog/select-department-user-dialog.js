/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2018/8/26
**To change this template use File | Settings | File Templates.
**选择部门人员组件
*/
Vue.component("select-department-user-dialog", {
    data: function () {
        return {
            acInterface:{
                //Department
                getDepartmentTreeData:"/PlatFormRest/SSO/Department/GetDepartmentsByOrganId",
                departmentEditView:"/HTML/SSO/Department/DepartmentEdit.html",
                deleteDepartment:"/PlatFormRest/SSO/Department/Delete",
                moveDepartment:"/PlatFormRest/SSO/Department/Move",
                //List
                listEditView:"/HTML/SSO/Department/DepartmentUserEdit.html",
                reloadListData:"/PlatFormRest/SSO/DepartmentUser/GetListData",
                deleteListRecord:"/PlatFormRest/SSO/DepartmentUser/Delete",
                listStatusChange:"/PlatFormRest/SSO/DepartmentUser/StatusChange",
                listMove:"/PlatFormRest/SSO/DepartmentUser/Move"
            },
            //Tree
            treeIdFieldName:"deptId",
            treeObj:null,
            treeSelectedNode:null,
            treeSetting:{
                async : {
                    enable : true,
                    // Ajax 获取数据的 URL 地址
                    url :""
                },
                // 必须使用data
                data:{
                    key:{
                        name:"deptName"
                    },
                    simpleData : {
                        enable : true,
                        idKey : "deptId", // id编号命名
                        pIdKey : "deptParentId"  // 父id编号命名
                    }
                },
                // 回调函数
                callback : {
                    onClick : function(event, treeId, treeNode) {
                        var _self=this.getZTreeObj(treeId)._host;
                        _self.treeNodeSelected(event,treeId,treeNode);
                    },
                    //成功的回调函数
                    onAsyncSuccess : function(event, treeId, treeNode, msg){
                        appList.treeObj.expandAll(true);
                    }
                }
            },
            //List
            idFieldName:"DU_ID",
            searchCondition:{
                userName:{
                    value: "",
                    type: SearchUtility.SearchFieldType.LikeStringType
                },
                account:{
                    value: "",
                    type: SearchUtility.SearchFieldType.LikeStringType
                },
                userPhoneNumber:{
                    value: "",
                    type: SearchUtility.SearchFieldType.LikeStringType
                },
                departmentId: {
                    value: "",
                    type: SearchUtility.SearchFieldType.StringType
                },
                searchInALL:{
                    value: "否",
                    type: SearchUtility.SearchFieldType.StringType
                }
            },
            columnsConfig: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'USER_NAME',
                    align: "center"
                },{
                    title: '手机号码',
                    key: 'USER_PHONE_NUMBER',
                    width:140,
                    align: "center"
                }, {
                    title: '组织机构',
                    key: 'ORGAN_NAME',
                    width:140,
                    align: "center"
                }, {
                    title: '部门',
                    key: 'DEPT_NAME',
                    width:140,
                    align: "center"
                }, {
                    title: '主属',
                    key: 'DU_IS_MAIN',
                    width: 70,
                    align: "center"
                }
            ],
            tableData: [],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 12,
            pageNum: 1,
            listHeight: 270
        }
    },
    mounted:function(){
        var oldSelectedOrganId=CookieUtility.GetCookie("DMORGSID");
        if(oldSelectedOrganId){
            this.$refs.selectOrganComp.setOldSelectedOrgan(oldSelectedOrganId);
            this.initTree(oldSelectedOrganId);
        }
    },
    methods:{
        //Organ
        changeOrgan:function(organData){
            //console.log(organData);
            CookieUtility.SetCookie1Month("DMORGSID",organData.organId);
            this.initTree(organData.organId);
            this.clearSearchCondition();
            this.tableData=[];
        },
        //DepartmentTree
        initTree:function (organId) {
            var _self=this;
            AjaxUtility.Post(this.acInterface.getDepartmentTreeData, {"organId":organId}, function (result) {
                if (result.success) {
                    _self.$refs.zTreeUL.setAttribute("id","select-department-user-dialog-"+StringUtility.Guid());
                    _self.treeObj=$.fn.zTree.init($(_self.$refs.zTreeUL), _self.treeSetting,result.data);
                    _self.treeObj.expandAll(true);
                    _self.treeObj._host=_self;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, "json");
        },
        treeNodeSelected:function (event, treeId, treeNode) {
            // 根节点不触发任何事件
            //if(treeNode.level != 0) {
            this.treeSelectedNode=treeNode;
            this.selectionRows=null;
            this.pageNum=1;
            this.clearSearchCondition();
            this.searchCondition.departmentId.value=this.treeSelectedNode[this.treeIdFieldName];
            this.reloadData();
            //appList.reloadTreeTableData();
            //}
        },
        addDepartment:function () {
            if (this.treeSelectedNode != null) {
                var url = BaseUtility.BuildView(this.acInterface.departmentEditView, {
                    "op": "add",
                    "parentId": this.treeSelectedNode[appList.treeIdFieldName]
                });
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "部门管理"}, 3);
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择父节点!", null);
            }
        },
        editDepartment:function () {
            if(this.treeSelectedNode!=null) {
                var url = BaseUtility.BuildView(this.acInterface.departmentEditView, {
                    "op": "update",
                    "recordId": this.treeSelectedNode[appList.treeIdFieldName]
                });
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "部门管理"}, 3);
            }
            else {
                DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择需要编辑的节点!",null);
            }
        },
        viewDepartment:function () {
            var url = BaseUtility.BuildView(this.acInterface.departmentEditView, {
                "op": "view",
                "recordId": this.treeSelectedNode[appList.treeIdFieldName]
            });
            DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "部门管理"}, 3);
        },
        delDepartment:function () {
            //var url="/PlatForm/devdemo/TreeAndList/DevDemoTLTree/Delete.do";
            var _self=this;
            var recordId=this.treeSelectedNode[appList.treeIdFieldName];
            DialogUtility.Confirm(window, "确认要删除选定的节点吗？", function () {
                AjaxUtility.Delete(_self.acInterface.deleteDepartment, {recordId: recordId}, function (result) {
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
        moveDepartment:function (type) {
            if(this.treeSelectedNode!=null) {
                var recordId = this.treeSelectedNode[appList.treeIdFieldName];
                AjaxUtility.Post(this.acInterface.moveDepartment, {recordId: recordId,type:type}, function (result) {
                    if (result.success) {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                            if(type=="down") {
                                if(appList.treeSelectedNode.getNextNode()!=null) {
                                    appList.treeObj.moveNode(appList.treeSelectedNode.getNextNode(), appList.treeSelectedNode, "next", false)
                                }
                            }else{
                                if(appList.treeSelectedNode.getPreNode()!=null) {
                                    appList.treeObj.moveNode(appList.treeSelectedNode.getPreNode(), appList.treeSelectedNode, "prev", false);
                                }
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
            appList.treeObj.addNodes(this.treeSelectedNode,newNodeData,silent);
        },
        updateNode : function (newNodeData) {
            this.treeSelectedNode=$.extend(true,this.treeSelectedNode, newNodeData);
            appList.treeObj.updateNode(this.treeSelectedNode);
        },
        //List
        clearSearchCondition:function () {
            for(var key in this.searchCondition){
                this.searchCondition[key].value="";
            }
            this.searchCondition["searchInALL"].value="否";
        },
        selectionChange: function (selection) {
            this.selectionRows = selection;
        },
        reloadData: function () {
            ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadListData,this.pageNum,this.pageSize,this.searchCondition,this,this.idFieldName,true,null,false);
        },
        add: function () {
            if(this.treeSelectedNode!=null) {
                var url = BaseUtility.BuildView(this.acInterface.listEditView, {
                    "op": "add",
                    "departmentId": this.treeSelectedNode[appList.treeIdFieldName]
                });
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "部门用户管理"}, 2);
            }
            else {
                DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请选择分组!",null);
            }
        },
        edit: function (recordId) {
            var url = BaseUtility.BuildView(this.acInterface.listEditView, {
                "op": "update",
                "recordId": recordId
            });
            DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "部门用户管理"}, 2);
        },
        view:function (recordId) {
            var url = BaseUtility.BuildView(this.acInterface.listEditView, {
                "op": "view",
                "recordId": recordId
            });
            DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "部门用户管理"}, 2);
        },
        del: function (recordId) {
            ListPageUtility.IViewTableDeleteRow(this.acInterface.deleteListRecord,recordId,appList);
        },
        statusEnable: function (statusName) {
            ListPageUtility.IViewChangeServerStatusFace(this.acInterface.listStatusChange,this.selectionRows,appList.idFieldName,statusName,appList);
        },
        move:function (type) {
            ListPageUtility.IViewMoveFace(this.acInterface.listMove,this.selectionRows,appList.idFieldName,type,appList);
        },
        moveToAnotherDepartment:function(){
            if(this.selectionRows!=null&&this.selectionRows.length>0&&this.selectionRows.length==1){

            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的记录，每次只能选中一行!", null);
            }
        },
        partTimeJob:function(){
            if(this.selectionRows!=null&&this.selectionRows.length>0&&this.selectionRows.length==1){

            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的记录，每次只能选中一行!", null);
            }
        },
        changePage: function (pageNum) {
            this.pageNum = pageNum;
            this.reloadData();
            this.selectionRows=null;
        },
        search:function () {
            this.pageNum=1;
            this.reloadData();
        },
        beginSelect:function () {
            var elem=this.$refs.selectDepartmentUserModelDialogWrap;
            //debugger;
            //this.getOrganDataInitTree();
            //alert();
            var dialogHeight=460;
            if(PageStyleUtility.GetPageHeight()>700){
                dialogHeight=660;
            }
            this.listHeight=dialogHeight-230;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 970,
                height: dialogHeight,
                title: "选择组织机构"
            });
        },
        completed:function () {
            console.log(this.selectionRows);
            if(this.selectionRows) {
                this.$emit('on-selected-completed', this.selectionRows)
                this.handleClose();
            }
            else{
                DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"请先选中人员!",null);
            }

        },
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectDepartmentUserModelDialogWrap);
        },
    },
    template: `<div ref="selectDepartmentUserModelDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div class="list-2column">
                        <div class="left-outer-wrap" style="width: 180px;top: 10px;left: 10px;bottom: 55px">
                            <select-organ-single-comp @on-selected-organ="changeOrgan" ref="selectOrganComp"></select-organ-single-comp>
                            <div class="inner-wrap" style="position:absolute;top: 30px;bottom: 10px;height: auto;overflow: auto">
                                <div>
                                    <ul ref="zTreeUL" class="ztree"></ul>
                                </div>
                            </div>
                        </div>
                        <div class="right-outer-wrap iv-list-page-wrap" style="padding: 10px;left: 200px;top: 10px;right: 10px;bottom: 55px">
                            <div class="list-simple-search-wrap">
                                <table class="ls-table">
                                    <colgroup>
                                        <col style="width: 80px">
                                        <col style="">
                                        <col style="width: 100px">
                                        <col style="">
                                        <col style="width: 80px">
                                        <col style="width: 85px">
                                        <col style="width: 80px">
                                    </colgroup>
                                    <tr class="ls-table-row">
                                        <td>用户名：</td>
                                        <td>
                                            <i-input v-model="searchCondition.userName.value" placeholder=""></i-input>
                                        </td>
                                        <td>手机：</td>
                                        <td>
                                            <i-input v-model="searchCondition.userPhoneNumber.value"></i-input>
                                        </td>
                                        <td>全局：</td>
                                        <td>
                                            <radio-group v-model="searchCondition.searchInALL.value">
                                                <radio label="是">是</radio>
                                                <radio label="否">否</radio>
                                            </radio-group>
                                        </td>
                                        <td><i-button type="primary" @click="search"><Icon type="android-search"></Icon> 查询 </i-button></td>
                                    </tr>
                                </table>
                            </div>
                            <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
                                     class="iv-list-table" :highlight-row="true"
                                     @on-selection-change="selectionChange"></i-table>
                            <div style="float: right;">
                                <page @on-change="changePage" :current.sync="pageNum" :page-size="pageSize" show-total
                                      :total="pageTotal"></page>
                            </div>
                        </div>
                    </div>
                    <div class="button-outer-wrap" style="bottom: 12px;right: 12px">
                        <div class="button-inner-wrap">
                            <button-group>
                                <i-button type="primary" @click="completed()" icon="md-checkmark">确认</i-button>
                                <i-button @click="handleClose()" icon="md-close">关闭</i-button>
                            </button-group>
                        </div>
                    </div>
                </div>`
});
