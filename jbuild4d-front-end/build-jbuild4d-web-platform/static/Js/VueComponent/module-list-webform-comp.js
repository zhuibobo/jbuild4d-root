/*html编辑器中的元素辅助列表*/
Vue.component("module-list-webform-comp", {
    props:['listHeight','moduleData'],
    data: function () {
        return {
            acInterface:{
                editView: "/PlatForm/Builder/Form/DetailView",
                reloadData: "/PlatForm/Builder/Form/GetListData",
                delete: "/PlatForm/Builder/Form/Delete",
                move: "/PlatForm/Builder/Form/Move",
            },
            idFieldName: "formId",
            searchCondition: {
                formModuleId: {
                    value: "",
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
                    title: '表单名称',
                    key: 'formName',
                    align: "center"
                }, {
                    title: '唯一名',
                    key: 'formSingleName',
                    align: "center"
                }, {
                    title: '备注',
                    key: 'formDesc',
                    align: "center"
                }, {
                    title: '编辑时间',
                    key: 'formUpdateTime',
                    width: 100,
                    align: "center",
                    render: function (h, params) {
                        return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.formUpdateTime);
                    }
                }, {
                    title: '操作',
                    key: 'dictGroupId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        return h('div',{class: "list-row-button-wrap"},[
                            ListPageUtility.IViewTableInnerButton.ViewButton(h,params,this.idFieldName,appList),
                            ListPageUtility.IViewTableInnerButton.EditButton(h,params,this.idFieldName,appList),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,this.idFieldName,appList)
                        ]);
                    }
                }
            ],
            tableData: [],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 500,
            pageNum: 1
        }
    },
    mounted:function(){
        this.reloadData();
        //alert(this.listHeight);
    },
    watch: {
        moduleData:function (newVal) {
            this.reloadData();
        }
    },
    methods:{
        selectionChange: function (selection) {
            this.selectionRows = selection;
        },
        reloadData: function () {
            if(this.moduleData!=null) {
                this.searchCondition.formModuleId.value = this.moduleData.moduleId;
                ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadData, this.pageNum, this.pageSize, this.searchCondition, this, this.idFieldName, true, null);
            }
        },
        add: function () {
            if(this.moduleData!=null) {
                var url = BaseUtility.BuildView(this.acInterface.editView, {
                    "op": "add",
                    "moduleId": this.moduleData.moduleId
                });
                //alert(url);
                DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {width: 0, height: 0}, 2);
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
            }
        },
        addScroll: function () {
            var url = BaseUtility.BuildView(this.acInterface.editScrollView, {"op": "add"});
            DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "通用列表"}, 2);
        },
        edit: function (recordId) {
            var url = BaseUtility.BuildView(this.acInterface.editView, {
                "op": "update",
                "recordId": recordId
            });
            DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "通用列表"}, 2);
        },
        view: function (recordId) {
            var url = BaseUtility.BuildView(this.acInterface.editView, {
                "op": "view",
                "recordId": recordId
            });
            DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "通用列表"}, 2);
        },
        del: function (recordId) {
            ListPageUtility.IViewTableDeleteRow(this.acInterface.delete, recordId, appList);
        },
        statusEnable: function (statusName) {
            ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
        },
        move: function (type) {
            ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, appList.idFieldName, type, appList);
        },
        changePage: function (pageNum) {
            this.pageNum = pageNum;
            this.reloadData();
            this.selectionRows = null;
        },
        search: function () {
            this.pageNum = 1;
            this.reloadData();
        }
    },
    template: '<div class="module-list-wrap">\
                    <div id="list-button-wrap" class="list-button-outer-wrap">\
                        <div class="list-button-inner-wrap">\
                            <button-group>\
                                <i-button type="success" @click="add()"><Icon type="plus"></Icon> 新增 </i-button>\
                                <i-button type="success" @click="add()"><Icon type="plus"></Icon> 引入URL </i-button>\
                                <i-button type="primary" @click="add(\'启用\')"><Icon type="checkmark-round"></Icon> 复制 </i-button>\
                                <i-button type="primary" @click="add(\'禁用\')"><Icon type="minus-round"></Icon> 预览 </i-button>\
                                <i-button type="primary" @click="add(\'禁用\')"><Icon type="minus-round"></Icon> 历史版本 </i-button>\
                                <i-button type="primary" @click="add(\'禁用\')"><Icon type="minus-round"></Icon> 复制ID </i-button>\
                                <i-button type="primary" @click="add(\'up\')"><Icon type="arrow-up-b"></Icon> 上移 </i-button>\
                                <i-button type="primary" @click="add(\'down\')"><Icon type="arrow-down-b"></Icon> 下移 </i-button>\
                            </button-group>\
                        </div>\
                         <div style="float: right;width: 200px;margin-right: 10px;">\
                            <i-input search class="input_border_bottom">\
                            </i-input>\
                        </div>\
                        <div style="clear: both"></div>\
                    </div>\
                    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"\
                             class="iv-list-table" :highlight-row="true"\
                             @on-selection-change="selectionChange"></i-table>\
                </div>'
});