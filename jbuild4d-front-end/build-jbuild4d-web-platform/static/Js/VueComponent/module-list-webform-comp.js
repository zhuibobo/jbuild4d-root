/*html编辑器中的元素辅助列表*/
Vue.component("module-list-webform-comp", {
    props:['listHeight','moduleData'],
    data: function () {
        return {
            acInterface:{
                editView: "/PlatForm/Builder/Form/DetailView",
                reloadData: "/PlatForm/DevDemo/DevDemoGenList/GetListData",
                delete: "/PlatForm/DevDemo/DevDemoGenList/Delete",
                statusChange: "/PlatForm/DevDemo/DevDemoGenList/StatusChange",
                move: "/PlatForm/DevDemo/DevDemoGenList/Move",
            },
            columnsConfig: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '表单名称',
                    key: 'ddtlKey',
                    align: "center"
                }, {
                    title: '唯一名',
                    key: 'ddtlName',
                    align: "center"
                }, {
                    title: 'ddtlDesc',
                    key: 'ddtlDesc'
                }, {
                    title: 'ddtlStatus',
                    width: 100,
                    align: "center",
                    key: 'ddtlStatus'
                }, {
                    title: 'CT',
                    key: 'ddtlCreatetime',
                    width: 100,
                    align: "center",
                    render: function (h, params) {
                        return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.ddtlCreatetime);
                    }
                }, {
                    title: '操作',
                    key: 'dictGroupId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        return h('div',{class: "list-row-button-wrap"},[
                            ListPageUtility.IViewTableInnerButton.ViewButton(h,params,appList.idFieldName,appList),
                            ListPageUtility.IViewTableInnerButton.EditButton(h,params,appList.idFieldName,appList),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,appList.idFieldName,appList)
                        ]);
                    }
                }
            ],
            tableData: [],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 12,
            pageNum: 1
        }
    },
    mounted:function(){
        //alert(this.listHeight);
    },
    watch: {
    },
    methods:{
        form_add:function () {
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
        selectionChange:function () {

        },
        changePage:function () {

        }
    },
    template: '<div style="width: 100%;">\
                    <div id="list-button-wrap" class="list-button-outer-wrap">\
                        <div class="list-button-inner-wrap">\
                            <button-group>\
                                <i-button type="success" @click="form_add()"><Icon type="plus"></Icon> 新增 </i-button>\
                                <i-button type="success" @click="form_add()"><Icon type="plus"></Icon> 引入URL </i-button>\
                                <i-button type="primary" @click="form_add(\'启用\')"><Icon type="checkmark-round"></Icon> 复制 </i-button>\
                                <i-button type="primary" @click="form_add(\'禁用\')"><Icon type="minus-round"></Icon> 预览 </i-button>\
                                <i-button type="primary" @click="form_add(\'禁用\')"><Icon type="minus-round"></Icon> 历史版本 </i-button>\
                                <i-button type="primary" @click="form_add(\'禁用\')"><Icon type="minus-round"></Icon> 复制ID </i-button>\
                                <i-button type="primary" @click="form_add(\'up\')"><Icon type="arrow-up-b"></Icon> 上移 </i-button>\
                                <i-button type="primary" @click="form_add(\'down\')"><Icon type="arrow-down-b"></Icon> 下移 </i-button>\
                            </button-group>\
                        </div>\
                        <div style="clear: both"></div>\
                    </div>\
                    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"\
                             class="iv-list-table" :highlight-row="true"\
                             @on-selection-change="selectionChange"></i-table>\
                    <div style="float: right;" id="list-pager-wrap">\
                        <page @on-change="changePage" :current.sync="pageNum" :page-size="pageSize" show-total\
                              :total="pageTotal"></page>\
                    </div>\
                </div>'
});