/*窗体内按钮*/
Vue.component("inner-form-button-list-comp", {
    data: function () {
        var _self=this;

        return {

            columnsConfig: [
                {
                    title: '表单名称',
                    key: 'formName',
                    align: "center"
                }, {
                    title: '唯一名',
                    key: 'formSingleName',
                    align: "center"
                }, {
                    title: '操作',
                    key: 'formId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        //console.log(params);
                        //console.log(this);
                        return h('div',{class: "list-row-button-wrap"},[
                            //ListPageUtility.IViewTableInnerButton.EditButton(h,params,_self.idFieldName,_self),
                            //ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,_self.idFieldName,_self)
                        ]);
                    }
                }
            ],
            tableData: [
                {
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                }
            ],
            normalProps:{},
            api:{
                acInterface: {
                    getButtonApiConfig: "/PlatFormRest/Builder/Button/ButtonApi/GetButtonApiConfig",
                },
                apiSelectData:null,
                editTableObject:null,
                editTableConfig:{
                    Status: "Edit",
                    AddAfterRowEvent: null,
                    DataField: "fieldName",
                    Templates: [
                        {
                            Title: "API名称",
                            BindName: "Value",
                            Renderer: "EditTable_Select",
                            TitleCellClassName: "TitleCell"
                            /*ClientDataSource: _self.api.apiSelectData*/
                        }, {
                            Title: "调用顺序",
                            BindName: "RunTime",
                            Renderer: "EditTable_Select",
                            ClientDataSource: [{"Text": "之前", "Value": "之前"}, {"Text": "之后", "Value": "之后"}],
                            Width: 100
                        }
                    ],
                    RowIdCreater: function () {
                    },
                    TableClass: "edit-table",
                    RendererTo: "apiContainer",
                    TableId: "apiContainerTable",
                    TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                }
            },
            field:{
                editTableObject:null,
                editTableConfig:{
                    Status: "Edit",
                    AddAfterRowEvent: null,
                    DataField: "fieldName",
                    Templates: [
                        {
                            Title: "API名称",
                            BindName: "Value",
                            Renderer: "EditTable_Select",
                            TitleCellClassName: "TitleCell"/*,
                            ClientDataSourceFunc: this.GetAPIListSelect*/

                        }, {
                            Title: "调用顺序",
                            BindName: "RunTime",
                            Renderer: "EditTable_Select",
                            ClientDataSource: [{"Text": "之前", "Value": "之前"}, {"Text": "之后", "Value": "之后"}],
                            Width: 100
                        }
                    ],
                    RowIdCreater: function () {
                    },
                    TableClass: "edit-table",
                    RendererTo: "apiContainer",
                    TableId: "apiContainerTable",
                    TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                }
            }
        }
    },
    mounted:function(){
        //alert(1);

        this.getApiConfigAndBindToTable();
    },
    methods:{
        getJson:function () {

        },
        setJson:function () {

        },
        //region api列表
        getApiConfigAndBindToTable:function(){
            var _self=this;
            AjaxUtility.Post(this.api.acInterface.getButtonApiConfig,{},function (result) {
                console.log(result);
                //var apiSelectData
                var apiSelectData=[];

                for(var i=0;i<result.data.length;i++){
                    var group={
                        group:result.data[i].name
                    }
                    var options=[];
                    for(var j=0;j<result.data[i].buttonAPIVoList.length;j++){
                        options.push({
                            value:result.data[i].buttonAPIVoList[j].id,
                            text:result.data[i].buttonAPIVoList[j].name
                        });
                    }
                    group["options"]=options;
                    apiSelectData.push(group);
                }

                /*configSource=[{
                    group:"name",
                    options:[{
                        value:"1",
                        text:"2"
                    },{
                        value:"",
                        text:""
                    }]
                },{
                    group:"name",
                    options:[{
                        value:"",
                        text:""
                    },{
                        value:"",
                        text:""
                    }]
                }]*/

                _self.api.editTableConfig.Templates[0].ClientDataSource=apiSelectData;
                _self.api.editTableObject = Object.create(EditTable);
                _self.api.editTableObject.Initialization(_self.api.editTableConfig);
            },"json");
        },
        //endregion
        addInnerFormButton:function(){
            var elem=this.$refs.innerFormButtonEdit;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 520,
                width: 720,
                title: "窗体内按钮"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex",10100);
            $(window.document).find(".ui-dialog").css("zIndex",10101);
        },
        addAPI:function () {
            this.api.editTableObject.AddEditingRowByTemplate();
        },
        removeAPI:function () {

        }
    },
    template: `<div style="height: 210px" class="">
                    <div ref="innerFormButtonEdit" class="html-design-plugin-dialog-wraper general-edit-page-wrap" style="display: none">
                        <tabs size="small">
                            <tab-pane label="绑定信息">
                                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                                    <colgroup>
                                        <col style="width: 60px" />
                                        <col style="width: 220px" />
                                        <col style="width: 100px" />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>标题：</td>
                                            <td>
                                                <i-input v-model="normalProps.windowCaption" />
                                            </td>
                                            <td>保存并关闭：</td>
                                            <td>
                                                <radio-group type="button" style="margin: auto" v-model="normalProps.openType">
                                                    <radio label="Dialog">是</radio>
                                                    <radio label="NewWindow">否</radio>
                                                </radio-group>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>API：</td>
                                            <td colspan="3">
                                                <div style="height: 140px">
                                                    <div style="width: 98%;margin: auto">
                                                        <div style="float: right;margin-bottom: 8px">
                                                            <button-group>
                                                                <i-button size="small" type="success" icon="md-add" @click="addAPI"></i-button>
                                                                <i-button size="small" type="primary" icon="md-close" @click="removeAPI"></i-button>
                                                            </button-group>
                                                        </div>
                                                        <div style="clear: bottom"></div>
                                                    </div>
                                                    <div id="apiContainer" class="edit-table-wrap" style="height: 100px;overflow: auto;width: 98%;margin: auto"></div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>字段：</td>
                                            <td colspan="3">
                                                <div style="height: 140px"></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                            <tab-pane label="开发扩展">
                                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                                    <colgroup>
                                        <col style="width: 150px" />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>
                                                服务端解析类：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.serverResolveMethod" size="small" placeholder="按钮进行服务端解析时,类全称,将调用该类,需要实现接口IFormButtonCustResolve" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.serverResolveMethodPara" size="small" placeholder="服务端解析类的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                客户端渲染方法：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientRendererMethod" size="small" placeholder="客户端渲染方法,按钮将经由该方法渲染,最终形成页面元素,需要返回最终元素的HTML对象" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientRendererMethodPara" size="small" placeholder="客户端渲染方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                客户端渲染后方法：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientRendererAfterMethod" size="small" placeholder="客户端渲染后调用方法,经过默认的渲染,无返回值" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientRendererAfterMethodPara" size="small" placeholder="客户端渲染后方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                客户端点击前方法：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientClickBeforeMethod" size="small" placeholder="客户端点击该按钮时的前置方法,如果返回false将阻止默认调用" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientClickBeforeMethodPara" size="small" placeholder="客户端点击前方法的参数" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                        </tabs>
                        <div class="button-outer-wrap">
                            <div class="button-inner-wrap">
                                <button-group>
                                    <i-button type="primary" @click="saveEditTable()"> 保 存</i-button>
                                    <i-button @click="handleClose()">关 闭</i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                    <div style="height: 30px">
                        <div style="float: right;">
                            <ButtonGroup size="small">
                                <i-button type="success" @click="addInnerFormButton()" icon="md-add">保存按钮</i-button>
                                <i-button type="primary" icon="md-add">关闭按钮</i-button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <i-table :height="180" :width="660" stripe border :columns="columnsConfig" :data="tableData"
                                                 class="iv-list-table" :highlight-row="true"
                                                 size="small" :show-header="false"></i-table>
                </div>`
});