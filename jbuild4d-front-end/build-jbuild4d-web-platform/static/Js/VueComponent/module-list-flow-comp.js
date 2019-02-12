window.addEventListener("message", function( event ) {
    // 把父窗口发送过来的数据显示在子窗口中
    DialogUtility.CloseDialog("FrameDialogEle"+DialogUtility.DialogId);
}, false );

Vue.component("module-list-flow-comp", {
    props:['listHeight','moduleData','activeTabName'],
    data: function () {
        return {
            acInterface:{
                //editView: "/PlatForm/Builder/FlowModel/DetailView",
                //uploadFlowModelView: "/PlatForm/Builder/FlowModel/UploadFlowModelView",
                newModel:"/PlatForm/Builder/FlowModel/NewModel",
                editModel:"/PlatForm/Builder/FlowModel/EditModel",
                reloadData: "/PlatForm/Builder/FlowModel/GetListData",
                getSingleData:"/PlatForm/Builder/FlowModel/GetDetailData",
                delete: "/PlatForm/Builder/FlowModel/Delete",
                move: "/PlatForm/Builder/FlowModel/Move",
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
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        //console.log(params);
                        //console.log(this);
                        return h('div',{class: "list-row-button-wrap"},[
                            window._modulelistflowcomp.editModelButton(h,params,window._modulelistflowcomp.idFieldName,window._modulelistflowcomp),
                            ListPageUtility.IViewTableInnerButton.EditButton(h,params,window._modulelistflowcomp.idFieldName,window._modulelistflowcomp),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,window._modulelistflowcomp.idFieldName,window._modulelistflowcomp)
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
            searchText:"",
            flowModelEntity:{
                modelId:"",
                modelDeId:"",
                modelModuleId:"",
                modelGroupId:"",
                modelName:"",
                modelCreateTime:DateUtility.GetCurrentData(),
                modelCreater:"",
                modelUpdateTime:DateUtility.GetCurrentData(),
                modelUpdater:"",
                modelDesc:"",
                modelStatus:"启用",
                modelOrderNum:"",
                modelDeploymentId:"",
                modelStartKey:"",
                modelResourceName:"",
                modelFromType:""
            },
            emptyFlowModelEntity:{

            },
            ruleValidate: {
                modelName: [
                    {required: true, message: '【模型名称】不能空！', trigger: 'blur'}
                ],
                modelStartKey: [
                    {required: true, message: '【模型Key】不能空！', trigger: 'blur'}
                ]
            }
        }
    },
    mounted:function(){
        this.reloadData();
        //将对象附加到window上,提供给后边进行操作
        window._modulelistflowcomp=this;
        for(var key in this.flowModelEntity){
            this.emptyFlowModelEntity[key]=this.flowModelEntity[key];
        }
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
                    if (row.modelCode.indexOf(newVal) >= 0) {
                        filterTableData.push(row);
                    }
                    else if (row.modelName.indexOf(newVal) >= 0) {
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
        /*基础的相关的方法*/
        handleClose:function(dialogId){
            DialogUtility.CloseDialog(dialogId);
        },
        getModuleName:function () {
            return this.moduleData==null?"请选中模块":this.moduleData.moduleText;
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
            if(this.moduleData!=null&&this.activeTabName=="list-flow") {
                this.searchCondition.modelModuleId.value = this.moduleData.moduleId;
                ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadData, this.pageNum, this.pageSize, this.searchCondition, this, this.idFieldName, true, function (result,pageAppObj) {
                    pageAppObj.tableDataOriginal=result.data.list;
                },false);
            }
        },
        /*流程模型基础数据*/
        add:function(){
            if(this.moduleData!=null) {
                //debugger;
                DetailPageUtility.OverrideObjectValueFull(this.flowModelEntity, this.emptyFlowModelEntity);
                DialogUtility.DialogElem("divNewFlowModelWrap", {
                    modal: true,
                    width: 600,
                    height: 500,
                    title: "创建流程模型"
                });
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
            }
        },
        edit: function (recordId) {
            var _self=this;
            AjaxUtility.Post(this.acInterface.getSingleData,{recordId:recordId,op:"edit"},function (result) {
                if(result.success) {
                    _self.$refs["flowModelEntity"].resetFields();
                    DetailPageUtility.OverrideObjectValueFull(_self.flowModelEntity, result.data);
                    DialogUtility.DialogElem("divNewFlowModelWrap",{modal:true,width:600,height:500,title:"编辑流程模型概况"});
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            },"json");
        },
        del: function (recordId) {
            ListPageUtility.IViewTableDeleteRow(this.acInterface.delete, recordId, this);
        },
        handleSubmitFlowModelEdit:function(name){
            var _self = this;
            this.$refs[name].validate(function (valid) {
                if (valid) {
                    _self.flowModelEntity.modelModuleId=_self.moduleData.moduleId;
                    var sendData = JSON.stringify(_self.flowModelEntity);
                    AjaxUtility.PostRequestBody(_self.acInterface.newModel, sendData, function (result) {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                            //debugger;
                            //window.OpenerWindowObj.appList.reloadData();
                            //DialogUtility.Frame_CloseDialog(window);
                            _self.handleClose("divNewFlowModelWrap");
                            _self.reloadData();
                            //console.log(result);
                            DialogUtility.OpenNewWindow(window,"editModelWebWindow",result.data.editModelWebUrl);
                            //打开流程设计页面
                        });
                    }, "json");
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        /*集成的流程模型编辑器*/
        editModelButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button edit-model",
                on: {
                    click: function () {
                        pageAppObj.editModel(params.row[idField]);
                    }
                }
            });
        },
        editModel:function (recordId) {
            AjaxUtility.Post(this.acInterface.editModel, {modelId: recordId}, function (result) {
                //DialogUtility.OpenNewWindow(window, "editModelWebWindow", result.data.editModelWebUrl);
                //console.log(result);
                DialogUtility.Frame_OpenIframeWindow(window,DialogUtility.DialogId,result.data.editModelWebUrl,{
                    title:"流程设计",
                    modal:true
                },0);
            }, "json");
        }
    },
    template: '<div class="module-list-wrap">\
                    <div style="display: none" id="divNewFlowModelWrap">\
                        <div class="general-edit-page-wrap" style="padding: 10px">\
                            <i-form ref="flowModelEntity" :model="flowModelEntity" :rules="ruleValidate" :label-width="100">\
                                <form-item label="模型名称：" prop="modelName">\
                                    <i-input v-model="flowModelEntity.modelName"></i-input>\
                                </form-item>\
                                <form-item label="模型Key：" prop="modelStartKey">\
                                    <i-input v-model="flowModelEntity.modelStartKey"></i-input>\
                                </form-item>\
                                <form-item label="描述：">\
                                    <i-input v-model="flowModelEntity.modelDesc" type="textarea" :autosize="{minRows: 8,maxRows: 8}"></i-input>\
                                </form-item>\
                            </i-form>\
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
                                <i-button  type="success" @click="add()" icon="md-add">新增</i-button>\
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