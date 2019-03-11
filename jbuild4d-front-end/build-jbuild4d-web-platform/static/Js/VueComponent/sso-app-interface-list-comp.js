/*SSO系统集成接口列表页面*/
Vue.component("sso-app-interface-list-comp", {
    data: function () {
        return {
            interfaceEntity:{
                interfaceId:"",
                interfaceBelongAppId:"",
                interfaceCode:"",
                interfaceName:"",
                interfaceUrl:"",
                interfaceUrlParas:"",
                interfaceUrlFormat:"",
                interfaceUrlDesc:"",
                interfaceUrlOrderNum:"",
                interfaceUrlCreateTime:DateUtility.GetCurrentData(),
                interfaceUrlStatus:"启用",
                interfaceUrlCreaterId:"",
                interfaceUrlOrganId:""
            },
            ruleValidate:{
                interfaceCode: [
                    {required: true, message: '【接口类型】不能为空！', trigger: 'blur'},
                    { type: 'string',pattern:/^[A-Za-z0-9]+$/, message:'请使用字母或数字', trigger:'blur'},
                ],
                interfaceName:[
                    {required: true, message: '【接口名称】不能为空！', trigger: 'blur'}
                ]
            },
            list:{
                columnsConfig: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '接口类型',
                        key: 'interfaceTypeName',
                        align: "center",
                        width: 100
                    },{
                        title: '接口名称',
                        key: 'interfaceName',
                        align: "center",
                        width: 280
                    },{
                        title: '备注',
                        key: 'interfaceUrlDesc',
                        align: "center"
                    },{
                        title: '操作',
                        key: 'interfaceId',
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
            }
        }
    },
    mounted:function(){

    },
    methods:{
        addInterface:function () {
            var elem=this.$refs.ssoAppInterfaceEditModelDialogWrap;
            //debugger;
            //this.getOrganDataInitTree();
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 570,
                height: 350,
                title: "接口设置"
            });
        },
        saveInterfaceEdit:function () {

        },
        changeInterfaceCode:function () {
            alert("1");
        }
    },
    template: `<div class="iv-list-page-wrap">
                    <div ref="ssoAppInterfaceEditModelDialogWrap" class="general-edit-page-wrap" style="display: none;margin-top: 0px">
                        <i-form ref="interfaceEntity" :model="interfaceEntity" :rules="ruleValidate" :label-width="130">
                            <form-item label="接口类型：" prop="interfaceCode" style="margin-bottom: 13px">
                                <i-input v-model="interfaceEntity.interfaceCode" size="small">
                                    <Select slot="append" style="width: 90px" @on-change="changeInterfaceCode()">
                                        <Option value="Login">登录接口</Option>
                                        <Option value="Other">其他</Option>
                                    </Select>
                                </i-input>
                            </form-item>
                            <form-item label="接口名称：" prop="interfaceName" style="margin-bottom: 18px">
                                <i-input v-model="interfaceEntity.interfaceName" size="small"></i-input>
                            </form-item>
                            <form-item label="接口地址：" style="margin-bottom: 2px">
                                <i-input v-model="interfaceEntity.interfaceUrl" size="small"></i-input>
                            </form-item>
                            <form-item label="参数：" style="margin-bottom: 2px">
                                <i-input v-model="interfaceEntity.interfaceUrlParas" type="textarea" :autosize="{minRows: 2,maxRows: 2}" size="small"></i-input>    
                            </form-item>
                            <form-item label="格式化方法：" style="margin-bottom: 2px">
                                <i-input v-model="interfaceEntity.interfaceUrlFormat" size="small"></i-input>
                            </form-item>
                            <form-item label="备注：" style="margin-bottom: 2px">
                                <i-input v-model="interfaceEntity.interfaceUrlDesc" size="small"></i-input>
                            </form-item>
                        </i-form>
                        <div class="button-outer-wrap" style="margin-left: 8px">
                            <div class="button-inner-wrap">
                                <button-group size="small">
                                    <i-button type="primary" @click="saveInterfaceEdit('interfaceEntity')" icon="md-checkmark"></i-button>
                                    <i-button @click="handleClose()" icon="md-close"></i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                    <div id="list-button-wrap" class="list-button-outer-wrap">
                        <div class="list-button-inner-wrap">
                            <ButtonGroup>
                                <i-button  type="success" @click="addInterface()" icon="md-add">新增</i-button>
                            </ButtonGroup>
                        </div>
                        <div style="clear: both"></div>
                    </div>
                    <i-table :height="list.listHeight" stripe border :columns="list.columnsConfig" :data="list.tableData"
                         class="iv-list-table" :highlight-row="true"></i-table>
                </div>`
});
