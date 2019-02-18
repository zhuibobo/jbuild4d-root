Vue.component("dataset-simple-select-comp", {
    data: function () {
        return {
            acInterface:{
                getDataSetData:"/PlatForm/Builder/DataSet/DataSetMain/GetDataSetsForZTreeNodeList"
            },
            dataSetTree: {
                tableTreeObj: null,
                tableTreeSetting: {
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

                            }
                        }
                    }
                },
                tableTreeData: null,
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
                    _self.dataSetTree.tableTreeData = result.data;
                    _self.dataSetTree.tableTreeObj = $.fn.zTree.init($("#dataSetZTreeUL"), _self.dataSetTree.tableTreeSetting, _self.dataSetTree.tableTreeData);
                    _self.dataSetTree.tableTreeObj.expandAll(true);
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        }
    },
    template: '<div class="js-code-fragment-wrap">\
                    <ul id="dataSetZTreeUL" class="ztree"></ul>\
                </div>'
});
