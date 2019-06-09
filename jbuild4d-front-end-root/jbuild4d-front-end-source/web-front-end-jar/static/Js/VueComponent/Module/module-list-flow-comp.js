window.addEventListener("message", function (event) {
    // 把父窗口发送过来的数据显示在子窗口中
    // 和本地安装的插件冲突,后边再修订!
    //DialogUtility.CloseDialog("FrameDialogEle" + DialogUtility.DialogId);
}, false);

Vue.component("module-list-flow-comp", {
    props: ['listHeight', 'moduleData', 'activeTabName'],
    data: function () {
        return {
            acInterface: {
                //editView: "/PlatForm/Builder/FlowModel/DetailView",
                //uploadFlowModelView: "/PlatForm/Builder/FlowModel/UploadFlowModelView",
                saveModel: "/PlatFormRest/Builder/FlowModel/SaveModel",
                getEditModelURL: "/PlatFormRest/Builder/FlowModel/GetEditModelURL",
                getViewModelURL: "/PlatFormRest/Builder/FlowModel/GetViewModelURL",
                reloadData: "/PlatFormRest/Builder/FlowModel/GetListData",
                getSingleData: "/PlatFormRest/Builder/FlowModel/GetDetailData",
                delete: "/PlatFormRest/Builder/FlowModel/DeleteModel",
                move: "/PlatFormRest/Builder/FlowModel/Move",
                defaultFlowModelImage:"/PlatFormRest/Builder/FlowModel/GetProcessModelMainImg"
            },
            idFieldName: "modelId",
            searchCondition: {
                modelModuleId: {
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
                    key: 'modelCode',
                    align: "center",
                    width: 80
                },
                {
                    title: '流程名称',
                    key: 'modelName',
                    align: "center"
                }, {
                    title: '启动Key',
                    key: 'modelStartKey',
                    align: "center"
                }, {
                    title: '备注',
                    key: 'modelDesc',
                    align: "center"
                }, {
                    title: '编辑时间',
                    key: 'modelUpdateTime',
                    width: 100,
                    align: "center",
                    render: function (h, params) {
                        return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.modelUpdateTime);
                    }
                }, {
                    title: '操作',
                    key: 'modelId',
                    width: 140,
                    align: "center",
                    render: function (h, params) {
                        //console.log(params);
                        //console.log(this);
                        return h('div', {class: "list-row-button-wrap"}, [
                            window._modulelistflowcomp.editModelButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp),
                            window._modulelistflowcomp.viewModelButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp),
                            ListPageUtility.IViewTableInnerButton.EditButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp)
                        ]);
                    }
                }
            ],
            tableData: [],
            tableDataOriginal: [],
            selectionRows: null,
            pageTotal: 0,
            pageSize: 500,
            pageNum: 1,
            searchText: "",
            flowModelEntity: {
                modelId: "",
                modelDeId: "",
                modelModuleId: "",
                modelGroupId: "",
                modelName: "",
                modelCreateTime: DateUtility.GetCurrentData(),
                modelCreater: "",
                modelUpdateTime: DateUtility.GetCurrentData(),
                modelUpdater: "",
                modelDesc: "",
                modelStatus: "启用",
                modelOrderNum: "",
                modelDeploymentId: "",
                modelStartKey: "",
                modelResourceName: "",
                modelFromType: "",
                modelMainImageId:"DefModelMainImageId"
            },
            emptyFlowModelEntity: {},
            importEXData: {
                modelModuleId: ""
            },
            ruleValidate: {
                modelName: [
                    {required: true, message: '【模型名称】不能空！', trigger: 'blur'}
                ],
                modelStartKey: [
                    {required: true, message: '【模型Key】不能空！', trigger: 'blur'}
                ]
            },
            defaultFlowModelImageSrc:"",
            value1:false
        }
    },
    mounted: function () {
        this.reloadData();
        //将对象附加到window上,提供给后边进行操作
        window._modulelistflowcomp = this;
        for (var key in this.flowModelEntity) {
            this.emptyFlowModelEntity[key] = this.flowModelEntity[key];
        }
        //alert(this.activeTabName);
        //alert(this.listHeight);
    },
    watch: {
        moduleData: function (newVal) {
            this.reloadData();
        },
        activeTabName: function (newVal) {
            //alert(this.activeTabName);
            this.reloadData();
        },
        searchText: function (newVal) {
            //console.log(this.searchText);
            if (newVal) {
                var filterTableData = [];
                for (var i = 0; i < this.tableData.length; i++) {
                    var row = this.tableData[i];
                    if (row.modelCode.indexOf(newVal) >= 0) {
                        filterTableData.push(row);
                    }
                    else if (row.modelName.indexOf(newVal) >= 0) {
                        filterTableData.push(row);
                    }
                }
                this.tableData = filterTableData;
            }
            else {
                this.tableData = this.tableDataOriginal;
            }
        }
    },
    methods: {
        /*基础的相关的方法*/
        handleClose: function (dialogId) {
            DialogUtility.CloseDialog(dialogId);
        },
        getModuleName: function () {
            return this.moduleData == null ? "请选中模块" : this.moduleData.moduleText;
        },
        /*列表的相关方法*/
        statusEnable: function (statusName) {
            ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
        },
        move: function (type) {
            ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
        },
        selectionChange: function (selection) {
            this.selectionRows = selection;
        },
        reloadData: function () {
            if (this.moduleData != null && this.activeTabName == "list-flow") {
                this.searchCondition.modelModuleId.value = this.moduleData.moduleId;
                ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadData, this.pageNum, this.pageSize, this.searchCondition, this, this.idFieldName, true, function (result, pageAppObj) {
                    pageAppObj.tableDataOriginal = result.data.list;
                }, false);
            }
        },
        /*流程模型基础数据*/
        add: function () {
            if (this.moduleData != null) {
                //debugger;
                DetailPageUtility.OverrideObjectValueFull(this.flowModelEntity, this.emptyFlowModelEntity);
                this.defaultFlowModelImageSrc=BaseUtility.BuildAction(this.acInterface.defaultFlowModelImage,{fileId:"defaultFlowModelImage"});

                DialogUtility.DialogElem("divNewFlowModelWrap", {
                    modal: true,
                    width: 670,
                    height: 500,
                    title: "创建流程模型"
                });
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
            }
        },
        edit: function (recordId) {
            var _self = this;
            _self.$refs["flowModelEntity"].resetFields();
            AjaxUtility.Post(this.acInterface.getSingleData, {recordId: recordId, op: "edit"}, function (result) {
                if (result.success) {
                    DetailPageUtility.OverrideObjectValueFull(_self.flowModelEntity, result.data);
                    _self.defaultFlowModelImageSrc = BaseUtility.BuildAction(_self.acInterface.defaultFlowModelImage, {fileId: _self.flowModelEntity.modelMainImageId});
                    DialogUtility.DialogElem("divNewFlowModelWrap", {
                        modal: true,
                        width: 600,
                        height: 500,
                        title: "编辑流程模型概况"
                    });
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        del: function (recordId) {
            ListPageUtility.IViewTableDeleteRow(this.acInterface.delete, recordId, this);
        },
        handleSubmitFlowModelEdit: function (name) {
            var _self = this;
            this.$refs[name].validate(function (valid) {
                if (valid) {
                    _self.flowModelEntity.modelModuleId = _self.moduleData.moduleId;
                    var _designModel = (_self.flowModelEntity.modelId == "" ? true : false)
                    var sendData = JSON.stringify(_self.flowModelEntity);
                    AjaxUtility.PostRequestBody(_self.acInterface.saveModel, sendData, function (result) {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                            //debugger;
                            //window.OpenerWindowObj.appList.reloadData();
                            //DialogUtility.Frame_CloseDialog(window);
                            _self.handleClose("divNewFlowModelWrap");
                            _self.reloadData();
                            //console.log(result);
                            if (_designModel) {
                                DialogUtility.OpenNewWindow(window, "editModelWebWindow", result.data.editModelWebUrl);
                            }
                            //打开流程设计页面
                        });
                    }, "json");
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        importModel: function () {
            if (this.moduleData != null) {
                DetailPageUtility.OverrideObjectValueFull(this.flowModelEntity, this.emptyFlowModelEntity);
                DialogUtility.DialogElem("divImportFlowModelWrap", {
                    modal: true,
                    width: 600,
                    height: 300,
                    title: "导入流程模型"
                });
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
            }
        },
        uploadSuccess: function (response, file, fileList) {
            //debugger;
            //if (response.success == false) {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, response.message, null);
            if (response.success == true) {
                this.handleClose('divImportFlowModelWrap');
                this.reloadData();
            }
            //}
            //else{

            //}
        },
        bindUploadExData: function () {
            //return {modelModuleId: this.moduleData.moduleId};
            //alert(this.moduleData.moduleId);
            this.importEXData.modelModuleId = this.moduleData.moduleId;
        },
        uploadFlowModelImageSuccess:function(response, file, fileList) {
            var data = response.data;
            this.flowModelEntity.modelMainImageId = data.fileId;
            this.defaultFlowModelImageSrc = BaseUtility.BuildAction(this.acInterface.defaultFlowModelImage, {fileId: this.flowModelEntity.modelMainImageId});
        },
        /*集成的流程模型编辑器*/
        editModelButton: function (h, params, idField, pageAppObj) {
            return h('div', {
                class: "list-row-button edit-model",
                on: {
                    click: function () {
                        pageAppObj.editModel(params.row[idField]);
                    }
                }
            });
        },
        viewModelButton: function (h, params, idField, pageAppObj) {
            return h('div', {
                class: "list-row-button view-model",
                on: {
                    click: function () {
                        pageAppObj.viewModel(params.row[idField]);
                    }
                }
            });
        },
        editModel: function (recordId) {
            AjaxUtility.Post(this.acInterface.getEditModelURL, {modelId: recordId}, function (result) {
                //DialogUtility.OpenNewWindow(window, "editModelWebWindow", result.data.editModelWebUrl);
                //console.log(result);
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, result.data.editModelWebUrl, {
                    title: "流程设计",
                    modal: true
                }, 0);
            }, "json");
        },
        viewModel: function (recordId) {
            AjaxUtility.Post(this.acInterface.getViewModelURL, {modelId: recordId}, function (result) {
                //alert(result.data.editModelWebUrl);
                DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, result.data.editModelWebUrl, {
                    title: "流程浏览",
                    modal: true
                }, 0);
            }, "json");
        }
    },
    template: '<div class="module-list-wrap">\
                    <div style="display: none" id="divNewFlowModelWrap">\
                        <div class="general-edit-page-wrap" style="padding: 10px;width: 100%">\
                            <div style="width: 70%;float: left">\
                                <i-form ref="flowModelEntity" :model="flowModelEntity" :rules="ruleValidate" :label-width="100">\
                                    <form-item label="模型名称：" prop="modelName">\
                                        <i-input v-model="flowModelEntity.modelName"></i-input>\
                                    </form-item>\
                                    <form-item label="模型Key：" prop="modelStartKey">\
                                        <i-input v-model="flowModelEntity.modelStartKey"></i-input>\
                                    </form-item>\
                                    <form-item label="描述：">\
                                        <i-input v-model="flowModelEntity.modelDesc" type="textarea" :autosize="{minRows: 11,maxRows: 11}"></i-input>\
                                    </form-item>\
                                </i-form>\
                            </div>\
                            <div style="width: 29%;float: right">\
                                <div>\
                                    <img :src="defaultFlowModelImageSrc" class="flowModelImg" />\
                                </div>\
                                <upload style="margin:10px 12px 0 20px" :data="importEXData" :before-upload="bindUploadExData" :on-success="uploadFlowModelImageSuccess" multiple type="drag" name="file" action="../../../PlatFormRest/Builder/FlowModel/UploadProcessModelMainImg.do" accept=".png">\
                                    <div style="padding:20px 0px">\
                                        <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>\
                                        <p>上传流程主题图片</p>\
                                    </div>\
                                </upload>\
                            </div>\
                            <div class="button-outer-wrap" style="height: 40px;padding-right: 10px">\
                                <div class="button-inner-wrap">\
                                    <button-group>\
                                        <i-button type="primary" @click="handleSubmitFlowModelEdit(\'flowModelEntity\')"> 保 存</i-button>\
                                        <i-button @click="handleClose(\'divNewFlowModelWrap\')">关 闭</i-button>\
                                    </button-group>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div style="display: none" id="divImportFlowModelWrap">\
                        <div class="general-edit-page-wrap" style="padding: 10px">\
                            <upload :data="importEXData" :before-upload="bindUploadExData" :on-success="uploadSuccess" multiple type="drag" name="file" action="../../../PlatFormRest/Builder/FlowModel/ImportProcessModel.do" accept=".bpmn">\
                                <div style="padding: 20px 0">\
                                    <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>\
                                    <p>Click or drag files here to upload</p>\
                                </div>\
                            </upload>\
                            <div class="button-outer-wrap" style="height: 40px;padding-right: 10px">\
                                <div class="button-inner-wrap">\
                                    <button-group>\
                                        <i-button @click="handleClose(\'divImportFlowModelWrap\')">关 闭</i-button>\
                                    </button-group>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div id="list-button-wrap" class="list-button-outer-wrap">\
                        <div class="module-list-name"><Icon type="ios-arrow-dropright-circle" />&nbsp;模块【{{getModuleName()}}】</div>\
                        <div class="list-button-inner-wrap">\
                            <ButtonGroup>\
                                <i-button  type="success" @click="add()" icon="md-add">新增</i-button>\
                                <i-button type="primary" @click="importModel()" icon="md-add">上传模型 </i-button>\
                                <i-button type="error" icon="md-albums" style="display: none">复制</i-button>\
                                <i-button type="error" icon="md-bookmarks" style="display: none">历史模型</i-button>\
                                <i-button type="error" icon="md-brush" style="display: none">复制ID</i-button>\
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