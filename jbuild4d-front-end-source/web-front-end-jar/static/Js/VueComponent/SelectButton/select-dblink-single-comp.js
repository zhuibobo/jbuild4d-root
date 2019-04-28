/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2019/4/27
**To change this template use File | Settings | File Templates.
*/
Vue.component("select-dblink-single-comp", {
    data: function () {
        return {
            acInterface: {
                getDBLinkDataUrl:"/PlatFormRest/Builder/DataStorage/DBLink/GetFullDBLink",
                getSingleDBLinkDataUrl:"/PlatFormRest/Builder/DataStorage/DBLink/GetDetailData"
            },
            jsEditorInstance:null,
            dbLinkTree: {
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
                            name: "dbLinkName"
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "dbId",
                            pIdKey: "dbOrderNum",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            var _self=this.getZTreeObj(treeId)._host;
                            //debugger;
                            _self.selectedDBLink(treeNode);
                            _self.handleClose();
                        }
                    }
                },
                treeData: null,
                clickNode:null
            },
            selectedDBLinkData:null
        }
    },
    mounted:function(){

    },
    methods:{
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectDBLinkModelDialogWrap);
        },
        beginSelectDBLink:function () {
            var elem=this.$refs.selectDBLinkModelDialogWrap;
            //debugger;
            this.getDBLinkDataInitTree();
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 470,
                height: 500,
                title: "选择数据库连接"
            });
        },
        getDBLinkDataInitTree:function () {
            var _self = this;
            AjaxUtility.Post(this.acInterface.getDBLinkDataUrl, {}, function (result) {
                if (result.success) {
                    _self.dbLinkTree.treeData = result.data;
                    for(var i=0;i<_self.dbLinkTree.treeData.length;i++){
                        _self.dbLinkTree.treeData[i].icon = "../../../../static/Themes/Png16X16/database_connect.png";
                    }
                    _self.$refs.dbLinkZTreeUL.setAttribute("id","select-dbLink-single-comp-"+StringUtility.Guid());
                    _self.dbLinkTree.treeObj = $.fn.zTree.init($(_self.$refs.dbLinkZTreeUL), _self.dbLinkTree.treeSetting, _self.dbLinkTree.treeData);
                    _self.dbLinkTree.treeObj.expandAll(true);
                    _self.dbLinkTree.treeObj._host=_self;
                    fuzzySearchTreeObj(_self.dbLinkTree.treeObj,_self.$refs.txt_dbLink_search_text.$refs.input,null,true);
                    /*if(_self.oldSelectedDBLinkId) {
                        for (var i = 0; i < result.data.length; i++) {
                            if(_self.oldSelectedDBLinkId==result.data[i].dbLinkId){
                                _self.selectedDBLinkData=result.data[i];
                            }
                        }
                    }*/
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        selectedDBLink:function (dbLinkData) {
            this.selectedDBLinkData=dbLinkData;
            this.$emit('on-selected-dblink', dbLinkData)
        },
        getSelectedDBLinkName:function () {
            //debugger;
            if(this.selectedDBLinkData==null){
                return "请选择数据库连接"
            }
            else {
                return this.selectedDBLinkData.dbLinkName;
            }
        },
        setOldSelectedDBLink:function (dbLinkId) {
            //debugger;
            var _self=this;
            AjaxUtility.Post(this.acInterface.getSingleDBLinkDataUrl, {"recordId":dbLinkId}, function (result) {
                //debugger;
                if (result.success) {
                    _self.selectedDBLinkData=result.data;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        }
    },
    template: `<div>
                    <div class="select-view-dblink-wrap">
                        <div class="text">{{getSelectedDBLinkName()}}</div>
                        <div class="value"></div>
                        <div class="id"></div>
                        <div class="button" @click="beginSelectDBLink()"><Icon type="ios-funnel" />&nbsp;选择</div>
                    </div>
                    <div ref="selectDBLinkModelDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                        <div class="c1-select-model-source-wrap">
                            <i-input search class="input_border_bottom" ref="txt_dbLink_search_text" placeholder="请输入数据库连接名称">
                            </i-input>
                            <div class="inner-wrap div-custom-scroll">
                                <ul ref="dbLinkZTreeUL" class="ztree"></ul>
                            </div>
                        </div>
                    </div>
                </div>`
});