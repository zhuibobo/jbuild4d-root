/*选择组织组件*/
Vue.component("select-single-table-dialog", {
    data: function () {
        return {
            acInterface: {
                getTableDataUrl:"/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
                getSingleOrganDataUrl:"/PlatFormRest/SSO/Organ/GetDetailData"
            },
            jsEditorInstance:null,
            tableTree: {
                treeObj: null,
                treeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: true,
                        nocheckInherit: false,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        key: {
                            name: "text"
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
                            if (treeNode.nodeTypeName == "Table") {
                                //appForm.tableTree.tableTreeObj.checkNode(treeNode, true, true);
                                //appForm.formResourceEntity.formMainTableCaption=treeNode.attr1;
                                //appForm.formResourceEntity.formMainTableName=treeNode.value;
                                var _self = window._dbtablerelationcomp;
                                $("#divSelectTable").dialog("close");
                                _self.addTableToRelationTableTree(treeNode);
                            }
                        }
                    }
                },
                treeData: null,
                clickNode:null
            },
            selectedOrganData:null
        }
    },
    mounted:function(){

    },
    methods:{
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectTableModelDialogWrap);
        },
        beginSelectTable:function () {
            //alert(PageStyleUtility.GetPageHeight());
            var elem=this.$refs.selectTableModelDialogWrap;
            //debugger;
            this.getTableDataInitTree();

            var height=450;
            if(PageStyleUtility.GetPageHeight()>550){
                height=600;
            }

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 470,
                height: height,
                title: "选择表"
            });
        },
        getTableDataInitTree:function () {
            var _self = this;
            AjaxUtility.Post(this.acInterface.getTableDataUrl, {}, function (result) {
                if (result.success) {
                    _self.tableTree.treeData = result.data;
                    _self.$refs.tableZTreeUL.setAttribute("id","select-table-single-comp-"+StringUtility.Guid());
                    _self.tableTree.treeObj = $.fn.zTree.init($(_self.$refs.tableZTreeUL), _self.tableTree.treeSetting, _self.tableTree.treeData);
                    _self.tableTree.treeObj.expandAll(true);
                    _self.tableTree.treeObj._host=_self;
                    fuzzySearchTreeObj(_self.tableTree.treeObj,_self.$refs.txt_table_search_text.$refs.input,null,true);
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        selectedOrgan:function (tableData) {
            this.selectedOrganData=tableData;
            this.$emit('on-selected-organ', tableData)
        },
        getSelectedOrganName:function () {
            //debugger;
            if(this.selectedOrganData==null){
                return "请选择组织机构"
            }
            else {
                return this.selectedOrganData.organName;
            }
        },
        setOldSelectedOrgan:function (organId) {
            var _self=this;
            AjaxUtility.Post(this.acInterface.getSingleOrganDataUrl, {"recordId":organId}, function (result) {
                //debugger;
                if (result.success) {
                    _self.selectedOrganData=result.data;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        }
    },
    template: `<div ref="selectTableModelDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div class="c1-select-model-source-wrap c1-select-model-source-has-buttons-wrap">
                        <i-input search class="input_border_bottom" ref="txt_table_search_text" placeholder="请输入表名或者标题">
                        </i-input>
                        <div class="inner-wrap div-custom-scroll">
                            <ul ref="tableZTreeUL" class="ztree"></ul>
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
