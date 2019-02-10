Vue.component("module-list-flow-comp", {
    props:['listHeight','moduleData','activeTabName'],
    data: function () {
        return {
            acInterface:{
                editView: "/PlatForm/Builder/FlowModel/DetailView",
                uploadFlowModelView: "/PlatForm/Builder/FlowModel/UploadFlowModelView",
                reloadData: "/PlatForm/Builder/FlowModel/GetListData",
                delete: "/PlatForm/Builder/FlowModel/Delete",
                move: "/PlatForm/Builder/FlowModel/Move",
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
                    title: '编号',
                    key: 'formCode',
                    align: "center",
                    width: 80
                },
                {
                    title: '流程名称',
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
                    key: 'formId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        //console.log(params);
                        //console.log(this);
                        return h('div',{class: "list-row-button-wrap"},[
                            ListPageUtility.IViewTableInnerButton.EditButton(h,params,window._modulelistwebformcomp.idFieldName,window._modulelistwebformcomp),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,window._modulelistwebformcomp.idFieldName,window._modulelistwebformcomp)
                        ]);
                    }
                }
            ],
            tableData: [],
            tableDataOriginal:[],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 500,
            pageNum: 1,
            searchText:""
        }
    },
    mounted:function(){
        this.reloadData();
        //将对象附加到window上,提供给后边进行操作
        window._modulelistflowcomp=this;
        //alert(this.activeTabName);
        //alert(this.listHeight);
    },
    watch: {
        moduleData:function (newVal) {
            this.reloadData();
        },
        activeTabName:function (newVal) {
            //alert(this.activeTabName);
            this.reloadData();
        },
        searchText:function (newVal) {
            //console.log(this.searchText);
            if(newVal) {
                var filterTableData = [];
                for (var i = 0; i < this.tableData.length; i++) {
                    var row = this.tableData[i];
                    if (row.formCode.indexOf(newVal) >= 0) {
                        filterTableData.push(row);
                    }
                    else if (row.formName.indexOf(newVal) >= 0) {
                        filterTableData.push(row);
                    }
                }
                this.tableData = filterTableData;
            }
            else{
                this.tableData = this.tableDataOriginal ;
            }
        }
    },
    methods:{
        selectionChange: function (selection) {
            this.selectionRows = selection;
        },
        reloadData: function () {
            if(this.moduleData!=null&&this.activeTabName=="list-webform") {
                this.searchCondition.formModuleId.value = this.moduleData.moduleId;
                ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadData, this.pageNum, this.pageSize, this.searchCondition, this, this.idFieldName, true, function (result,pageAppObj) {
                    pageAppObj.tableDataOriginal=result.data.list;
                },false);
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
        uploadModel:function(){
            var url = BaseUtility.BuildView(this.acInterface.uploadFlowModelView, {"op": "add"});
            DialogUtility.DialogElem("#divUploadFlowModelWrap",{modal:true,width:700,height:600,title:"上传流程模型"});
        },
        newModel:function(){
            DialogUtility.DialogElem("#divNewFlowModelWrap",{modal:true,width:600,height:500,title:"创建流程模型"});
        },
        edit: function (recordId) {
            var url = BaseUtility.BuildView(this.acInterface.editView, {
                "op": "update",
                "recordId": recordId
            });
            DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {width: 0, height: 0}, 2);
        },
        del: function (recordId) {
            ListPageUtility.IViewTableDeleteRow(this.acInterface.delete, recordId, this);
        },
        statusEnable: function (statusName) {
            ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
        },
        move: function (type) {
            ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
        },
        getModuleName:function () {
            return this.moduleData==null?"请选中模块":this.moduleData.moduleText;
        }
    },
    template: '<div class="module-list-wrap">\
                    <div style="display: none" id="divNewFlowModelWrap">\
                        <div class="general-edit-page-wrap" style="padding: 10px">\
                            <i-form :label-width="100">\
                                <form-item label="模型名称：">\
                                    <i-input></i-input>\
                                </form-item>\
                                <form-item label="模型Key：">\
                                    <i-input></i-input>\
                                </form-item>\
                                <form-item label="描述：">\
                                    <i-input type="textarea" :autosize="{minRows: 8,maxRows: 8}"></i-input>\
                                </form-item>\
                            </i-form>\
                            <div class="button-outer-wrap" style="height: 40px;padding-right: 10px">\
                                <div class="button-inner-wrap">\
                                    <button-group>\
                                        <i-button type="primary" @click="handleSubmit(\'formEntity\')"> 保 存</i-button>\
                                        <i-button @click="handleClose()">关 闭</i-button>\
                                    </button-group>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div style="display: none" id="divUploadFlowModelWrap">\
                        <div class="general-edit-page-wrap" style="padding: 10px">\
                            <i-form :label-width="100">\
                                <form-item label="模型名称：">\
                                    <i-input></i-input>\
                                </form-item>\
                                <form-item label="备注：">\
                                    <i-input type="textarea" :autosize="{minRows: 4,maxRows: 4}"></i-input>\
                                </form-item>\
                            </i-form>\
                            <Upload action="//jsonplaceholder.typicode.com/posts/">\
                                <Button icon="ios-cloud-upload-outline">Upload files</Button>\
                            </Upload>\
                            <div class="button-outer-wrap" style="height: 40px;padding-right: 10px">\
                                <div class="button-inner-wrap">\
                                    <button-group>\
                                        <i-button type="primary" @click="handleSubmit(\'formEntity\')">保 存</i-button>\
                                        <i-button @click="handleClose()">关 闭</i-button>\
                                    </button-group>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div id="list-button-wrap" class="list-button-outer-wrap">\
                        <div class="module-list-name"><Icon type="ios-arrow-dropright-circle" />&nbsp;模块【{{getModuleName()}}】</div>\
                        <div class="list-button-inner-wrap">\
                            <ButtonGroup>\
                                <i-button  type="success" @click="newModel()" icon="md-add">新增</i-button>\
                                <i-button type="primary" @click="uploadModel()" icon="md-add">上传模型 </i-button>\
                                <i-button type="error" icon="md-albums">复制</i-button>\
                                <i-button type="error" icon="md-bookmarks">历史模型</i-button>\
                                <i-button type="error" icon="md-brush">复制ID</i-button>\
                                <i-button type="primary" @click="move(\'up\')" icon="md-arrow-up">上移</i-button>\
                                <i-button type="primary" @click="move(\'down\')" icon="md-arrow-down">下移</i-button>\
                            </ButtonGroup>\
                        </div>\
                         <div style="float: right;width: 200px;margin-right: 10px;">\
                            <i-input search class="input_border_bottom" v-model="searchText">\
                            </i-input>\
                        </div>\
                        <div style="clear: both"></div>\
                    </div>\
                    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"\
                             class="iv-list-table" :highlight-row="true"\
                             @on-selection-change="selectionChange"></i-table>\
                </div>'
});