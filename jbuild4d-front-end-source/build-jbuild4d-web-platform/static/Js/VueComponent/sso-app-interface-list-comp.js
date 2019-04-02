/*SSO系统集成接口列表页面*/
Vue.component("sso-app-interface-list-comp", {
    props:["interfaceBelongAppId"],
    watch: {
        interfaceBelongAppId:function (newVal) {
            this.interfaceEntity.interfaceBelongAppId=newVal;
        }
    },
    data: function () {
        var _self = this;
        return {
            acInterface:{
                delete:"/PlatFormRest/SSO/Application/DeleteInterface"
            },
            interfaceEntity:{
                interfaceId:"",
                interfaceBelongAppId:"",
                interfaceCode:"",
                interfaceName:"",
                interfaceUrl:"",
                interfaceParas:"",
                interfaceFormat:"",
                interfaceDesc:"",
                interfaceOrderNum:"",
                interfaceCreateTime:DateUtility.GetCurrentData(),
                interfaceStatus:"启用",
                interfaceCreaterId:"",
                interfaceOrganId:""
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
                        key: 'interfaceCode',
                        align: "center",
                        width: 100
                    },{
                        title: '接口名称',
                        key: 'interfaceName',
                        align: "center",
                        width: 280
                    },{
                        title: '备注',
                        key: 'interfaceDesc',
                        align: "center"
                    },{
                        title: '操作',
                        key: 'interfaceId',
                        width: 140,
                        align: "center",
                        render: function (h, params) {
                            //console.log(_self);
                            //debugger;
                            return h('div', {class: "list-row-button-wrap"}, [
                                ListPageUtility.IViewTableInnerButton.EditButton(h, params, "interfaceId",_self),
                                ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, "interfaceId", _self)
                            ]);
                        }
                    }
                ],
                tableData: [],
            },
            innerStatus:"add"
        }
    },
    mounted:function(){
        //this.interfaceEntity.interfaceBelongAppId=this.interfaceBelongAppId;
        //alert(this.interfaceBelongAppId);
    },
    methods:{
        resetListData:function(){
            this.list.tableData=[];
        },
        addInterface:function () {
            var elem=this.$refs.ssoAppInterfaceEditModelDialogWrap;
            //debugger;
            //this.getOrganDataInitTree();
            this.innerStatus=="add";
            this.interfaceEntity.interfaceId="";
            this.interfaceEntity.interfaceBelongAppId=this.interfaceBelongAppId;
            this.interfaceEntity.interfaceCode="";
            this.interfaceEntity.interfaceName="";
            this.interfaceEntity.interfaceUrl="";
            this.interfaceEntity.interfaceParas="";
            this.interfaceEntity.interfaceFormat="";
            this.interfaceEntity.interfaceDesc="";
            this.interfaceEntity.interfaceOrderNum="";
            this.interfaceEntity.interfaceCreateTime=DateUtility.GetCurrentData();
            this.interfaceEntity.interfaceStatus="启用";
            this.interfaceEntity.interfaceCreaterId="";
            this.interfaceEntity.interfaceOrganId="";
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 570,
                height: 330,
                title: "接口设置"
            });
        },
        handleClose:function(){
            DialogUtility.CloseDialogElem(this.$refs.ssoAppInterfaceEditModelDialogWrap);
        },
        saveInterfaceEdit:function () {
            if(this.innerStatus=="add"){
                this.interfaceEntity.interfaceId=StringUtility.Guid();
                this.list.tableData.push(JsonUtility.CloneSimple(this.interfaceEntity));
            }
            else{
                //debugger;
                for(var i=0;i<this.list.tableData.length;i++){
                    if(this.list.tableData[i].interfaceId==this.interfaceEntity.interfaceId){
                        //this.list.tableData[i]=JsonUtility.CloneSimple(this.interfaceEntity);
                        this.list.tableData[i].interfaceCode=this.interfaceEntity.interfaceCode;
                        this.list.tableData[i].interfaceName=this.interfaceEntity.interfaceName;
                        this.list.tableData[i].interfaceUrl=this.interfaceEntity.interfaceUrl;
                        this.list.tableData[i].interfaceParas=this.interfaceEntity.interfaceParas;
                        this.list.tableData[i].interfaceFormat=this.interfaceEntity.interfaceFormat;
                        this.list.tableData[i].interfaceDesc=this.interfaceEntity.interfaceDesc;
                        break;
                    }
                }
            }
            this.handleClose();
        },
        changeInterfaceCode:function (value) {
            this.interfaceEntity.interfaceCode=value;
        },
        getInterfaceListData:function () {
            return this.list.tableData;
        },
        setInterfaceListData:function (data) {
            this.list.tableData=data;
        },
        edit:function (interfaceId,params) {
            //console.log(params);
            this.innerStatus="update";
            this.interfaceEntity.interfaceId=params.row.interfaceId;
            this.interfaceEntity.interfaceCode=params.row.interfaceCode;
            this.interfaceEntity.interfaceName=params.row.interfaceName;
            this.interfaceEntity.interfaceUrl=params.row.interfaceUrl;
            this.interfaceEntity.interfaceParas=params.row.interfaceParas;
            this.interfaceEntity.interfaceFormat=params.row.interfaceFormat;
            this.interfaceEntity.interfaceDesc=params.row.interfaceDesc;
            this.interfaceEntity.interfaceOrderNum=params.row.interfaceOrderNum;
            this.interfaceEntity.interfaceCreateTime=params.row.interfaceCreateTime;
            this.interfaceEntity.interfaceStatus=params.row.interfaceStatus;
            this.interfaceEntity.interfaceCreaterId=params.row.interfaceCreaterId;
            this.interfaceEntity.interfaceOrganId=params.row.interfaceOrganId;
            this.interfaceEntity.interfaceBelongAppId=params.row.interfaceBelongAppId;
            var elem=this.$refs.ssoAppInterfaceEditModelDialogWrap;
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 570,
                height: 330,
                title: "接口设置"
            });
        },
        del:function (interfaceId,params) {
            var _self=this;
            for(var i=0;i<this.list.tableData.length;i++){
                if(this.list.tableData[i].interfaceId==interfaceId){
                    _self.list.tableData.splice(i,1);
                    DialogUtility.Confirm(window, "确认要删除该接口吗？", function () {
                        AjaxUtility.Delete(_self.acInterface.delete, {"interfaceId": interfaceId}, function (result) {
                            if (result.success) {
                            }
                            else {
                                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                            }
                        }, "json");
                    });
                }
            }
        }
    },
    template: `<div class="iv-list-page-wrap">
                    <div ref="ssoAppInterfaceEditModelDialogWrap" class="general-edit-page-wrap" style="display: none;margin-top: 0px">
                        <i-form ref="interfaceEntity" :model="interfaceEntity" :label-width="130">
                            <form-item style="margin-bottom: 2px">
                                <span slot="label"><span style="color: red">*</span>&nbsp;接口类型：</span>
                                <i-input v-model="interfaceEntity.interfaceCode" size="small">
                                    <Select slot="append" style="width: 90px" @on-change="changeInterfaceCode">
                                        <Option value="登录接口">登录接口</Option>
                                        <Option value="其他">其他</Option>
                                    </Select>
                                </i-input>
                            </form-item>
                            <form-item style="margin-bottom: 2px">
                                <span slot="label"><span style="color: red">*</span>&nbsp;接口名称：</span>
                                <i-input v-model="interfaceEntity.interfaceName" size="small"></i-input>
                            </form-item>
                            <form-item label="接口地址：" style="margin-bottom: 2px">
                                <i-input v-model="interfaceEntity.interfaceUrl" size="small"></i-input>
                            </form-item>
                            <form-item label="参数：" style="margin-bottom: 2px">
                                <i-input v-model="interfaceEntity.interfaceParas" type="textarea" :autosize="{minRows: 2,maxRows: 2}" size="small"></i-input>    
                            </form-item>
                            <form-item label="格式化方法：" style="margin-bottom: 2px">
                                <i-input v-model="interfaceEntity.interfaceFormat" size="small"></i-input>
                            </form-item>
                            <form-item label="备注：" style="margin-bottom: 2px">
                                <i-input v-model="interfaceEntity.interfaceDesc" size="small"></i-input>
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
