/*窗体内按钮*/
Vue.component("inner-form-button-list-comp", {
    props:["formId"],
    data: function () {
        var _self=this;

        return {
            columnsConfig: [
                {
                    title: '标题',
                    key: 'caption',
                    align: "center"
                }, {
                    title: '类型',
                    key: 'buttonType',
                    align: "center"
                }, {
                    title: '操作',
                    key: 'id',
                    width: 200,
                    align: "center",
                    render: function (h, params) {
                        var buttons=[];
                        if(params.row.buttonType=="保存按钮"){
                            buttons.push(ListPageUtility.IViewTableInnerButton.EditButton(h,params,"id",_self));
                        }
                        buttons.push(ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,"id",_self));
                        buttons.push(ListPageUtility.IViewTableInnerButton.MoveUpButton(h,params,"id",_self));
                        buttons.push(ListPageUtility.IViewTableInnerButton.MoveDownButton(h,params,"id",_self));
                        return h('div',{class: "list-row-button-wrap"},buttons);
                    }
                }
            ],
            tableData: [
                /*{
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
                }*/
            ],
            innerSaveButtonEditData:{
                caption:"",
                saveAndClose:"true",
                apis:[],
                fields:[],
                //开发扩展
                id:"",
                buttonType:"保存按钮",
                custServerResolveMethod:"",
                custServerResolveMethodPara:"",
                custClientRendererMethod:"",
                custClientRendererMethodPara:"",
                custClientRendererAfterMethod:"",
                custClientRendererAfterMethodPara:"",
                custClientClickBeforeMethod:"",
                custClientClickBeforeMethodPara:"",
            },
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
                acInterface: {
                    getFormMainTableFields: "/PlatFormRest/Builder/Form/GetFormMainTableFields",
                },
                editTableObject:null,
                editTableConfig:{
                    Status: "Edit",
                    AddAfterRowEvent: null,
                    DataField: "fieldName",
                    Templates: [
                        {
                            Title: "表名标题",
                            BindName: "TableName",
                            Renderer: "EditTable_Label"
                        }, {
                            Title: "字段标题",
                            BindName: "FieldName",
                            Renderer: "EditTable_Select"
                        },{
                            Title:"默认值",
                            BindName:"DefaultValue",
                            Renderer:"EditTable_SelectDefaultValue",
                            Hidden:false
                        }
                    ],
                    RowIdCreater: function () {
                    },
                    TableClass: "edit-table",
                    RendererTo: "fieldContainer",
                    TableId: "fieldContainerTable",
                    TableAttrs: {cellpadding: "1", cellspacing: "1", border: "1"}
                }
            }
        }
    },
    mounted:function(){
        //alert(1);

        this.getApiConfigAndBindToTable();
        //this.getTableFieldsAndBindToTable();
    },
    methods:{
        getJson:function () {
            //debugger;
            return JsonUtility.JsonToString(this.tableData);
        },
        setJson:function (tableDataJson) {
            if(tableDataJson!=null&&tableDataJson!=""){
                this.tableData=JsonUtility.StringToJson(tableDataJson);
            }
        },
        handleClose:function(dialogElem){
            DialogUtility.CloseDialogElem(this.$refs[dialogElem]);
        },
        //region 列表按钮相关方法
        edit:function(id,params){
            console.log(params);
            if(params.row["buttonType"]=="保存按钮"){
                this.editInnerFormSaveButton(params);
            }
        },
        del:function(id,params){
            for(var i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].id==id) {
                    ArrayUtility.Delete(this.tableData,i);
                }
            }
        },
        moveUp:function(id,params){
            for(var i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].id==id) {
                    ArrayUtility.MoveUp(this.tableData,i);
                    return;
                    //console.log(id);
                }
            }
        },
        moveDown:function(id,params){
            //console.log(this.tableData);
            for(var i=0;i<this.tableData.length;i++) {
                if(this.tableData[i].id==id) {
                    ArrayUtility.MoveDown(this.tableData,i);
                    return
                    //console.log(id);
                }
            }
        },
        //endregion

        //region 保存按钮
        addInnerFormSaveButton:function(){
            if(this.formId!=null&&this.formId!="") {
                this.editSaveButtonStatuc="add";
                //重置编辑表单
                this.resetInnerSaveButtonData();

                var elem = this.$refs.innerFormButtonEdit;

                DialogUtility.DialogElemObj(elem, {
                    modal: true,
                    height: 520,
                    width: 720,
                    title: "窗体内按钮"
                });

                $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
                $(window.document).find(".ui-dialog").css("zIndex", 10101);

                this.innerSaveButtonEditData.id = "inner_form_button_" + StringUtility.Timestamp();

                if(!this.isLoadTableField||this.formId!=this.oldformId){
                    this.getTableFieldsAndBindToTable();
                    this.oldformId=this.formId;
                    this.isLoadTableField=true;
                }
            }
            else{
                DialogUtility.AlertText("请先设置绑定的窗体!");
            }
        },
        editInnerFormSaveButton:function(params){
            this.addInnerFormSaveButton();
            this.editSaveButtonStatuc="edit";
            this.innerSaveButtonEditData=JsonUtility.CloneStringify(params.row);
            this.api.editTableObject.LoadJsonData(this.innerSaveButtonEditData.apis);
            this.field.editTableObject.LoadJsonData(this.innerSaveButtonEditData.fields);
        },
        resetInnerSaveButtonData:function(){
            this.innerSaveButtonEditData={
                    caption:"",
                    saveAndClose:"true",
                    apis:[],
                    fields:[],
                    id:"",
                    buttonType:"保存按钮",
                    custServerResolveMethod:"",
                    custServerResolveMethodPara:"",
                    custClientRendererMethod:"",
                    custClientRendererMethodPara:"",
                    custClientRendererAfterMethod:"",
                    custClientRendererAfterMethodPara:"",
                    custClientClickBeforeMethod:"",
                    custClientClickBeforeMethodPara:"",
            };
            this.api.editTableObject.RemoveAllRow();
            if(this.field.editTableObject) {
                this.field.editTableObject.RemoveAllRow();
            }
        },
        saveInnerSaveButtonToList:function(){
            //保存到列表
            var singleInnerFormButtonData=JsonUtility.CloneSimple(this.innerSaveButtonEditData);
            this.api.editTableObject.CompletedEditingRow();
            singleInnerFormButtonData.apis=this.api.editTableObject.GetSerializeJson();
            this.field.editTableObject.CompletedEditingRow();
            singleInnerFormButtonData.fields=this.field.editTableObject.GetSerializeJson();
            //debugger;
            if(this.editSaveButtonStatuc=="add") {
                //存储到列表数据中
                this.tableData.push(singleInnerFormButtonData);
            }
            else{
                for(var i=0;i<this.tableData.length;i++){
                    if(this.tableData[i].id==singleInnerFormButtonData.id) {
                        //this.tableData[i]=singleInnerFormButtonData;
                        Vue.set(this.tableData, i, singleInnerFormButtonData);
                    }
                }
            }

            console.log(singleInnerFormButtonData);

            this.handleClose("innerFormButtonEdit");
        },
        //endregion

        //region 关闭按钮

        //endregion

        //region 字段列表
        getTableFieldsAndBindToTable:function(){
            var _self=this;
            AjaxUtility.Post(this.field.acInterface.getFormMainTableFields,{formId:this.formId},function (result) {
                console.log(result);
                var fieldsData=[];

                for(var i=0;i<result.data.length;i++) {
                    fieldsData.push({
                        Value: result.data[i].fieldName,
                        Text: result.data[i].fieldCaption
                    });
                }
                _self.field.editTableConfig.Templates[0].DefaultValue={
                    Type:"Const",
                    Value:result.data[0].tableName
                },
                _self.field.editTableConfig.Templates[1].ClientDataSource=fieldsData;
                _self.field.editTableObject = Object.create(EditTable);
                _self.field.editTableObject.Initialization(_self.field.editTableConfig);
            },"json");
        },
        addField:function(){
            this.field.editTableObject.AddEditingRowByTemplate();
        },
        removeField:function(){
            this.field.editTableObject.AddEditingRowByTemplate();
        },
        //endregion
        addInnerFormCloseButton:function () {
            var closeButtonData={
                caption:"关闭",
                id:"inner_close_button_"+StringUtility.Timestamp(),
                buttonType:"关闭按钮"
            };
            this.tableData.push(closeButtonData);
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
                        Group:result.data[i].name
                    }
                    var options=[];
                    for(var j=0;j<result.data[i].buttonAPIVoList.length;j++){
                        options.push({
                            Value:result.data[i].buttonAPIVoList[j].id,
                            Text:result.data[i].buttonAPIVoList[j].name
                        });
                    }
                    group["Options"]=options;
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
        addAPI:function () {
            this.api.editTableObject.AddEditingRowByTemplate();
        },
        removeAPI:function () {
            this.api.editTableObject.RemoveRow();
        }
        //endregion
    },
    template: `<div style="height: 210px" class="iv-list-page-wrap">
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
                                                <i-input v-model="innerSaveButtonEditData.caption" />
                                            </td>
                                            <td>保存并关闭：</td>
                                            <td>
                                                <radio-group type="button" style="margin: auto" v-model="innerSaveButtonEditData.saveAndClose">
                                                    <radio label="true">是</radio>
                                                    <radio label="false">否</radio>
                                                </radio-group>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>API：</td>
                                            <td colspan="3">
                                                <div style="height: 140px">
                                                    <div style="float: left;width: 94%">
                                                        <div id="apiContainer" class="edit-table-wrap" style="height: 140px;overflow: auto;width: 98%;margin: auto"></div>
                                                    </div>
                                                    <div style="float: right;width: 5%">
                                                        <button-group vertical>
                                                            <i-button size="small" type="success" icon="md-add" @click="addAPI"></i-button>
                                                            <i-button size="small" type="primary" icon="md-close" @click="removeAPI"></i-button>
                                                        </button-group>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>字段：</td>
                                            <td colspan="3">
                                                <div style="height: 140px">
                                                    <div style="float: left;width: 94%">
                                                        <div id="fieldContainer" class="edit-table-wrap" style="height: 140px;overflow: auto;width: 98%;margin: auto"></div>
                                                    </div>
                                                    <div style="float: right;width: 5%">
                                                        <button-group vertical>
                                                            <i-button size="small" type="success" icon="md-add" @click="addField"></i-button>
                                                            <i-button size="small" type="primary" icon="md-close" @click="removeField"></i-button>
                                                        </button-group>
                                                    </div>
                                                </div>
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
                                                ID：
                                            </td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.id" size="small" placeholder="" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                服务端解析类：
                                            </td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custServerResolveMethod" size="small" placeholder="按钮进行服务端解析时,类全称,将调用该类,需要实现接口IFormButtonCustResolve" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custServerResolveMethodPara" size="small" placeholder="服务端解析类的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                客户端渲染方法：
                                            </td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientRendererMethod" size="small" placeholder="客户端渲染方法,按钮将经由该方法渲染,最终形成页面元素,需要返回最终元素的HTML对象" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientRendererMethodPara" size="small" placeholder="客户端渲染方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                客户端渲染后方法：
                                            </td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientRendererAfterMethod" size="small" placeholder="客户端渲染后调用方法,经过默认的渲染,无返回值" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientRendererAfterMethodPara" size="small" placeholder="客户端渲染后方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                客户端点击前方法：
                                            </td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientClickBeforeMethod" size="small" placeholder="客户端点击该按钮时的前置方法,如果返回false将阻止默认调用" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="innerSaveButtonEditData.custClientClickBeforeMethodPara" size="small" placeholder="客户端点击前方法的参数" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                        </tabs>
                        <div class="button-outer-wrap">
                            <div class="button-inner-wrap">
                                <button-group>
                                    <i-button type="primary" @click="saveInnerSaveButtonToList()"> 保 存</i-button>
                                    <i-button @click="handleClose('innerFormButtonEdit')">关 闭</i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                    <div style="height: 210px;width: 100%">
                        <div style="float: left;width: 84%">
                            <i-table :height="210" width="100%" stripe border :columns="columnsConfig" :data="tableData"
                                                     class="iv-list-table" :highlight-row="true"
                                                     size="small"></i-table>
                        </div>
                        <div style="float: right;width: 15%">
                            <ButtonGroup vertical>
                                <i-button type="success" @click="addInnerFormSaveButton()" icon="md-add">保存按钮</i-button>
                                <i-button icon="md-add" disabled>意见按钮</i-button>
                                <i-button type="primary" @click="addInnerFormCloseButton()" icon="md-add">关闭按钮</i-button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>`
});