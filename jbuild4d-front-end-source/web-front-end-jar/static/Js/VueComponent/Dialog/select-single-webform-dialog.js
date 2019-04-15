/*选择webform组件*/
Vue.component("select-single-webform-dialog", {
    data: function () {
        return {
            acInterface: {
                getTableDataUrl:"/PlatFormRest/Builder/Form/GetWebFormForZTreeNodeList"
            },
            jsEditorInstance:null,
            tree: {
                treeObj: null,
                treeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: false,
                        nocheckInherit: false,
                        /*chkStyle: "radio",*/
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
                            var _self=this.getZTreeObj(treeId)._host;
                            if (treeNode.nodeTypeName == "Table") {
                                _self.selectedTable(event,treeId,treeNode);
                            }
                            else{
                                _self.selectedTable(event,treeId,null);
                            }
                        }
                    }
                },
                treeData: null,
                clickNode:null
            },
            selectedTableData:null
        }
    },
    mounted:function(){

    },
    methods:{
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectTableModelDialogWrap);
        },
        beginSelectForm:function () {
            //alert(PageStyleUtility.GetPageHeight());
            var elem=this.$refs.selectModelDialogWrap;
            //debugger;
            this.getFormDataInitTree();

            var height=500;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 570,
                height: height,
                title: "选择窗体"
            });
        },
        getFormDataInitTree:function () {
            var _self = this;
            AjaxUtility.Post(this.acInterface.getTableDataUrl, {}, function (result) {
                if (result.success) {
                    _self.tree.treeData = result.data;

                    for(var i=0;i<_self.tree.treeData.length;i++){
                        if(_self.tree.treeData[i].nodeTypeName=="WebForm"){
                            _self.tree.treeData[i].icon=BaseUtility.GetRootPath()+"/static/Themes/Png16X16/table.png";
                        }
                        else if(_self.tree.treeData[i].nodeTypeName=="Module"){
                            _self.tree.treeData[i].icon=BaseUtility.GetRootPath()+"/static/Themes/Png16X16/folder-table.png";
                        }
                    }

                    _self.$refs.tableZTreeUL.setAttribute("id","select-table-single-comp-"+StringUtility.Guid());
                    _self.tree.treeObj = $.fn.zTree.init($(_self.$refs.tableZTreeUL), _self.tree.treeSetting, _self.tree.treeData);
                    _self.tree.treeObj.expandAll(true);
                    _self.tree.treeObj._host=_self;
                    fuzzySearchTreeObj(_self.tree.treeObj,_self.$refs.txt_table_search_text.$refs.input,null,true);
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        selectedTable:function (event,treeId,tableData) {
            this.selectedTableData=tableData;
        },
        completed:function () {
            if(this.selectedTableData) {
                this.$emit('on-selected-table', this.selectedTableData);
                this.handleClose();
            }
            else{
                DialogUtility.AlertText("请选择表!");
            }
        }
    },
    template: `<div ref="selectModelDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div class="c1-select-model-source-wrap c1-select-model-source-has-buttons-wrap">
                        <i-input search class="input_border_bottom" ref="txt_table_search_text" placeholder="请输入表单名称">
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
