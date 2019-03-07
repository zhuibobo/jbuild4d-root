/*选择组织组件*/
Vue.component("select-organ-single-comp", {
    data: function () {
        return {
            acInterface: {
                getOrganDataUrl:"/PlatFormRest/SSO/Organ/GetFullOrgan",
                getSingleOrganDataUrl:"/PlatFormRest/SSO/Organ/GetDetailData"
            },
            jsEditorInstance:null,
            organTree: {
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
                            name: "organName"
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "organId",
                            pIdKey: "organParentId",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            var _self=this.getZTreeObj(treeId)._host;
                            //debugger;
                            _self.selectedOrgan(treeNode);
                            _self.handleClose();
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
            DialogUtility.CloseDialogElem(this.$refs.selectOrganModelDialogWrap);
        },
        beginSelectOrgan:function () {
            var elem=this.$refs.selectOrganModelDialogWrap;
            //debugger;
            this.getOrganDataInitTree();
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 470,
                height: 500,
                title: "选择组织机构"
            });
        },
        getOrganDataInitTree:function () {
            var _self = this;
            AjaxUtility.Post(this.acInterface.getOrganDataUrl, {}, function (result) {
                if (result.success) {
                    _self.organTree.treeData = result.data;
                    _self.$refs.organZTreeUL.setAttribute("id","select-organ-single-comp-"+StringUtility.Guid());
                    _self.organTree.treeObj = $.fn.zTree.init($(_self.$refs.organZTreeUL), _self.organTree.treeSetting, _self.organTree.treeData);
                    _self.organTree.treeObj.expandAll(true);
                    _self.organTree.treeObj._host=_self;
                    fuzzySearchTreeObj(_self.organTree.treeObj,_self.$refs.txt_organ_search_text.$refs.input,null,true);
                    /*if(_self.oldSelectedOrganId) {
                        for (var i = 0; i < result.data.length; i++) {
                            if(_self.oldSelectedOrganId==result.data[i].organId){
                                _self.selectedOrganData=result.data[i];
                            }
                        }
                    }*/
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        selectedOrgan:function (organData) {
            this.selectedOrganData=organData;
            this.$emit('on-selected-organ', organData)
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
    template: `<div>
                    <div class="select-view-organ-wrap">
                        <div class="text">{{getSelectedOrganName()}}</div>
                        <div class="value"></div>
                        <div class="id"></div>
                        <div class="button" @click="beginSelectOrgan()"><Icon type="ios-funnel" />&nbsp;选择</div>
                    </div>
                    <div ref="selectOrganModelDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                        <div class="c1-select-model-source-wrap">
                            <i-input search class="input_border_bottom" ref="txt_organ_search_text" placeholder="请输入组织机构名称">
                            </i-input>
                            <div class="inner-wrap div-custom-scroll">
                                <ul ref="organZTreeUL" class="ztree"></ul>
                            </div>
                        </div>
                    </div>
                </div>`
});
