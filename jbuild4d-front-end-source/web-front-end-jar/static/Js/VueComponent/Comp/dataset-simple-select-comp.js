Vue.component("dataset-simple-select-comp", {
    data: function () {
        var _self = this;
        return {
            acInterface:{
                getDataSetData:"/PlatFormRest/Builder/DataSet/DataSetMain/GetDataSetsForZTreeNodeList"
            },
            dataSetTree: {
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
                            if (treeNode.nodeTypeName == "DataSet") {
                                _self.selectedNode(treeNode);
                            }
                        }
                    }
                },
                treeData: null,
                selectedTableName: "无"
            }
        }
    },
    mounted:function(){
        this.bindDataSetTree();
    },
    methods:{
        bindDataSetTree: function () {
            var _self = this;
            AjaxUtility.Post(this.acInterface.getDataSetData, {}, function (result) {
                if (result.success) {
                    if(result.data!=null&&result.data.length>0){
                        for(var i=0;i<result.data.length;i++) {
                            if(result.data[i].nodeTypeName=="DataSetGroup"){
                                result.data[i].icon = BaseUtility.GetRootPath()+"/static/Themes/Png16X16/package.png";
                            }
                            else {
                                result.data[i].icon = BaseUtility.GetRootPath()+"/static/Themes/Png16X16/application_view_columns.png";
                            }
                        }
                    }

                    _self.dataSetTree.treeData = result.data;
                    _self.dataSetTree.treeObj = $.fn.zTree.init($("#dataSetZTreeUL"), _self.dataSetTree.treeSetting, _self.dataSetTree.treeData);
                    _self.dataSetTree.treeObj.expandAll(true);
                    fuzzySearchTreeObj(_self.dataSetTree.treeObj,_self.$refs.txt_search_text.$refs.input,null,true);
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        selectedNode:function (treeNode) {
            this.$emit('on-selected-dataset', treeNode);
        }
    },
    template: '<div class="js-code-fragment-wrap">\
                    <i-input search class="input_border_bottom" ref="txt_search_text" placeholder="请输入表名或者标题"></i-input>\
                    <ul id="dataSetZTreeUL" class="ztree"></ul>\
                </div>'
});
