/*选择组织组件*/
Vue.component("table-relation-connect-two-table-dialog", {
    data: function () {
        return {
            acInterface: {
                getTablesFieldsByTableIds:"/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds"
            },
            fromTableField:{
                fieldData:[],
                columnsConfig: [
                    {
                        title: '字段名称',
                        key: 'fieldName',
                        align: "center"
                    }, {
                        title: '标题',
                        key: 'fieldCaption',
                        align: "center"
                    }/*, {
                        title: '操作',
                        key: 'fieldId',
                        width: 70,
                        align: "center",
                        render: function (h, params) {
                            return h('div',{class: "list-row-button-wrap"},[
                                h('div', {
                                    class: "list-row-button listmanager",
                                    on: {
                                        click: function () {
                                            sqlDesignerForm.insertTableFieldToCodeMirror(params.row);
                                        }
                                    }
                                })
                            ]);
                        }
                    }*/
                ]
            },
            toTableField:{
                fieldData:[],
                columnsConfig: [
                    {
                        title: '字段名称',
                        key: 'fieldName',
                        align: "center"
                    }, {
                        title: '标题',
                        key: 'fieldCaption',
                        align: "center"
                    }/*, {
                        title: '操作',
                        key: 'fieldId',
                        width: 70,
                        align: "center",
                        render: function (h, params) {
                            return h('div',{class: "list-row-button-wrap"},[
                                h('div', {
                                    class: "list-row-button listmanager",
                                    on: {
                                        click: function () {
                                            sqlDesignerForm.insertTableFieldToCodeMirror(params.row);
                                        }
                                    }
                                })
                            ]);
                        }
                    }*/
                ]
            },
            dialogHeight:0,
            resultData:{
                from:{
                    tableId:"",
                    text:""
                },
                to:{
                    tableId:"",
                    text:""
                }
            }
        }
    },
    mounted:function(){

    },
    methods:{
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.connectTableFieldModelDialogWrap);
        },
        completed:function () {
            if(this.resultData.from.text!=""&&this.resultData.to.text!=""){
                this.$emit('on-completed-connect', this.resultData);
                this.handleClose();
            }
            else {
                DialogUtility.AlertText("请设置关联字段");
            }
        },
        getFieldsAndBind:function(fromTableId,toTableId){
            var tableIds = [fromTableId,toTableId];

            var _self=this;
            //debugger;
            AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds,{"tableIds":tableIds},function (result) {
                if(result.success){
                    var allFields=result.data;
                    var allTables=result.exKVData.Tables;

                    var fromTableFields=_self.getSingleTableFieldsData(allFields,fromTableId);
                    var toTableFields=_self.getSingleTableFieldsData(allFields,toTableId);

                    _self.fromTableField.fieldData=fromTableFields;
                    _self.toTableField.fieldData=toTableFields;
                }
                else{
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
                //console.log(result);
            },"json");
        },
        beginSelectConnect:function (fromTableId,toTableId) {
            var elem=this.$refs.connectTableFieldModelDialogWrap;
            this.resultData.from.tableId=fromTableId;
            this.resultData.to.tableId=toTableId;
            this.resultData.from.text="";
            this.resultData.to.text="";
            this.getFieldsAndBind(fromTableId,toTableId);
            var height=450;
            if(PageStyleUtility.GetPageHeight()>550){
                height=600;
            }
            this.dialogHeight=height;
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 870,
                height: height,
                title: "设置关联"
            });
        },
        getSingleTableFieldsData:function(allFields,tableId){
            var result=[];
            for(var i=0;i<allFields.length;i++){
                if(allFields[i].fieldTableId==tableId){
                    result.push(allFields[i]);
                }
            }
            return result;
        },
        selectedFromField:function (row,index) {
            //console.log(row);
            this.resultData.from.text=row.fieldName+"[1]";
        },
        selectedToField:function (row,index) {
            //console.log(row);
            this.resultData.to.text=row.fieldName+"[0..N]";
        }
    },
    template: `<div ref="connectTableFieldModelDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div class="c1-select-model-source-wrap c1-select-model-source-has-buttons-wrap" style="padding: 10px">
                        <div style="float: left;width: 49%;height: 100%;">
                            <i-input v-model="resultData.from.text" suffix="md-done-all" placeholder="开始关联字段" style="margin-bottom: 10px">
                            </i-input>
                            <i-table @on-row-click="selectedFromField" size="small" :height="dialogHeight-180" stripe border :columns="fromTableField.columnsConfig" :data="fromTableField.fieldData"
                                         class="iv-list-table" :highlight-row="true"></i-table>
                        </div>
                        <div style="float:right;width: 49%;height: 100%;">
                            <i-input v-model="resultData.to.text" suffix="md-done-all" placeholder="结束关联字段" style="margin-bottom: 10px">
                            </i-input>
                            <i-table @on-row-click="selectedToField" size="small" :height="dialogHeight-180" stripe border :columns="toTableField.columnsConfig" :data="toTableField.fieldData"
                                         class="iv-list-table" :highlight-row="true"></i-table>
                        </div>
                    </div>
                    <div class="button-outer-wrap" style="bottom: 12px;right: 12px">
                        <div class="button-inner-wrap">
                            <button-group>
                                <i-button type="primary" @click="completed()" icon="md-checkmark">确认</i-button>
                                <i-button @click="handleClose()" icon="md-close">关闭</i-button>
                            </button-group>
                        </div>
                    </div>
               </div>`
});
