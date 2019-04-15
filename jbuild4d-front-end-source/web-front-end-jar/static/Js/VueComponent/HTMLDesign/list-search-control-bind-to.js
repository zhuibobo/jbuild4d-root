/*查询字段绑定的Vue组件*/
Vue.component("list-search-control-bind-to", {
    props:["bindToFieldProp","dataSetId"],
    data: function () {
        return {
            bindToField:{
                tableId: "",
                tableName: "",
                tableCaption: "",
                fieldName: "",
                fieldCaption: "",
                fieldDataType: "",
                fieldLength:""
            },
            tree: {
                treeObj: null,
                treeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: false,
                        nocheckInherit: false,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        key: {
                            name: "displayText"
                        },
                        simpleData: {//简单数据模式
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId",
                            rootPId: "-1"// 1
                        }
                    },
                    callback: {
                        //点击树节点事件
                        onClick: function (event, treeId, treeNode) {
                            _self.selectedData.tableId = treeNode.tableId;
                            _self.selectedData.tableName = treeNode.tableName;
                            _self.selectedData.tableCaption = treeNode.tableCaption;
                            _self.selectedData.fieldName = "";
                            _self.selectedData.fieldCaption = "";
                            _self.selectedData.fieldDataType = "";
                            _self.selectedData.fieldLength = "";
                            _self.fieldTable.fieldData = [];
                            _self.filterAllFieldsToTable(_self.selectedData.tableId);
                        },
                        onDblClick: function (event, treeId, treeNode) {

                        },
                        //成功的回调函数
                        onAsyncSuccess: function (event, treeId, treeNode, msg) {

                        }
                    }
                },
                treeData: null
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        bindToProp :function(newValue) {
            console.log(newValue);
        },
        defaultValueProp:function (newValue) {
            this.defaultValue=newValue;
            if(!StringUtility.IsNullOrEmpty(this.defaultValue.defaultType)){
                this.tempData.defaultDisplayText=JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType,this.defaultValue.defaultText);
            }
        }
    },
    mounted:function(){
        this.bindToField=this.bindToFieldProp;
        //var dataset=window.parent.listDesign.getDataSet();
    },
    methods:{
        init:function(dataSetVo){
            console.log(dataSetVo);
        },
        bindTreeData:function () {

        }
    },
    template: `<table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                    <colgroup>
                        <col style="width: 100px" />
                        <col style="width: 280px" />
                        <col />
                    </colgroup>
                    <tr>
                        <td>
                            标题：
                        </td>
                        <td>
                            <input type="text" />
                        </td>
                        <td rowspan="6">
                            <ul class="ztree"></ul>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            绑定字段：
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            字段名称：
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            运算符：
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            默认值：
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            备注：
                        </td>
                        <td>
                            <textarea rows="15"></textarea>
                        </td>
                    </tr>
                </table>`
});
