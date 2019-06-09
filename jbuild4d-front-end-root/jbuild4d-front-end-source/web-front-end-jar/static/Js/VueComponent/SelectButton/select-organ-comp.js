/*选择组织组件*/
Vue.component("select-organ-comp", {
    data: function () {
        return {
            acInterface: {
                getOrganDataUrl:"/PlatFormRest/SSO/Organ/GetFullOrgan"
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
                        enable: true,
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

                        }
                    }
                },
                treeData: null,
                clickNode:null
            },
            searchOrganText:"",
            selectedOrganConfig: [{
                title: '组织名称',
                key: 'organName',
                align: "center"
            }, {
                title: '操作',
                key: 'organId',
                width: 65,
                align: "center",
                render: function (h, params) {
                    return h('div', {class: "list-row-button-wrap"}, [
                        ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp)
                    ]);
                }
            }],
            selectedOrganData:[]
        }
    },
    mounted:function(){
        this.getOrganDataInitTree();
    },
    methods:{
        beginSelectOrgan:function () {
            //alert("1");
            var elem=this.$refs.selectOrganModelDialogWrap;
            //debugger;
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 670,
                height: 500,
                title: "选择组织机构"
            });
        },
        getOrganDataInitTree:function () {
            var _self = this;
            AjaxUtility.Post(this.acInterface.getOrganDataUrl, {}, function (result) {
                if (result.success) {
                    _self.organTree.treeData = result.data;
                    _self.$refs.organZTreeUL.setAttribute("id","select-organ-comp-"+StringUtility.Guid());
                    _self.organTree.treeObj = $.fn.zTree.init($(_self.$refs.organZTreeUL), _self.organTree.treeSetting, _self.organTree.treeData);
                    _self.organTree.treeObj.expandAll(true);
                    //fuzzySearch("organZTreeUL",$("#txt_organ_search_text").find("input"),null,true);
                    //alert(1);
                    //debugger;
                    fuzzySearchTreeObj(_self.organTree.treeObj,_self.$refs.txt_organ_search_text.$refs.input,null,true);
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        selectedOrgan:function (treeNode) {
            if(!treeNode){

            }
            this.selectedOrganData.push(treeNode);
        },
        removeAllOrgan:function () {

        },
        removeSingleOrgan:function () {

        }
    },
    template: `<div>
                    <div class="select-view-organ-wrap">
                        <div class="text">请选择组织</div>
                        <div class="value"></div>
                        <div class="id"></div>
                        <div class="button" @click="beginSelectOrgan()"><Icon type="ios-funnel" />&nbsp;选择</div>
                    </div>
                    <div ref="selectOrganModelDialogWrap" class="c3-select-model-wrap general-edit-page-wrap" style="display: none">
                        <div class="c3-select-model-source-wrap">
                            <i-input search class="input_border_bottom" ref="txt_organ_search_text" placeholder="请输入组织机构名称">
                            </i-input>
                            <div class="inner-wrap div-custom-scroll">
                                <ul ref="organZTreeUL" class="ztree"></ul>
                            </div>
                        </div>
                        <div class="c3-select-model-button-wrap">
                            <div class="to_selected_button">
                                <Icon type="ios-arrow-dropright-circle" />
                            </div>
                            <div>
                                <Icon type="ios-arrow-dropleft-circle" />
                            </div>
                        </div>
                        <div class="c3-select-model-selected-wrap">
                            <div class="selected-title"><Icon type="md-done-all" /> 已选组织</div>
                            <div style="margin: 2px">
                                <i-table stripe :columns="selectedOrganConfig" :data="selectedOrganData" class="iv-list-table" :highlight-row="true" :show-header="false"></i-table>
                            </div>
                        </div>
                        <div class="button-outer-wrap" style="height: 40px;padding-right: 10px">
                            <div class="button-inner-wrap">
                                <button-group>
                                    <i-button type="primary" @click="handleSubmitFlowModelEdit('flowModelEntity')"> 保 存</i-button>
                                    <i-button @click="handleClose('divNewFlowModelWrap')">关 闭</i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                </div>`
});
