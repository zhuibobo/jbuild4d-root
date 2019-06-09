/*选择组件绑定的字段*/
Vue.component("fd-control-select-bind-to-single-field-dialog", {
    data:function () {

        var _self=this;
        return {
            acInterface: {
                getTablesDataUrl: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
                getTableFieldsDataUrl: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTableFieldsByTableId",
                getTablesFieldsByTableIds:"/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds"
            },
            selectedData: {
                tableId: "",
                tableName: "",
                tableCaption: "",
                fieldName: "",
                fieldCaption: "",
                fieldDataType: "",
                fieldLength: ""
            },
            tableTree: {
                tableTreeObj: null,
                tableTreeSetting: {
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
                            /*if (treeNode.nodeTypeName == "Table") {
                                appSelectView.tableTree.tableTreeObj.checkNode(treeNode, true, true);
                                appSelectView.selectedData.tableId = treeNode.id;
                                //alert(appSelectView.selectedData.tableId);
                                appSelectView.selectedData.tableName = treeNode.value;
                                appSelectView.selectedData.tableCaption = treeNode.attr1;
                                appSelectView.selectedData.fieldName = "";
                                appSelectView.selectedData.fieldCaption = "";
                                appSelectView.selectedData.fieldDataType = "";
                                appSelectView.selectedData.fieldLength = "";
                                appSelectView.bindFieldTable();
                            }
                            else {
                                appSelectView.selectedData.tableId = "";
                                appSelectView.selectedData.tableName = "";
                                appSelectView.selectedData.tableCaption = "";
                                appSelectView.selectedData.fieldName = "";
                                appSelectView.selectedData.fieldCaption = "";
                                appSelectView.selectedData.fieldDataType = "";
                                appSelectView.selectedData.fieldLength = "";
                                appSelectView.fieldTable.fieldData = [];
                            }*/
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
                tableTreeData: null,//${tableTreeData},
                selectedTableName: "无"
            },
            fieldTable: {
                fieldData: [],
                tableHeight: 470,
                columnsConfig: [
                    {
                        title: ' ',
                        width: 60,
                        key: 'isSelectedToBind',
                        render: function (h, params) {
                            //console.log(params);
                            if(params.row.isSelectedToBind=="1") {
                                return h('div',{class: "list-row-button-wrap"},[
                                    h('div', {
                                        class: "list-row-button selected"
                                    })
                                ]);
                            }
                            else
                            {
                                return h('div', {
                                    class: "",
                                }, "");
                            }
                        }
                    },
                    {
                        title: '名称',
                        key: 'fieldName',
                        align: "center"
                    }, {
                        title: '标题',
                        key: 'fieldCaption',
                        align: "center"
                    }
                ]
            },
            oldRelationDataString:"",
            relationData:null,
            allFields:null,
            oldBindFieldData:null
        }
    },
    mounted:function (){
        /*window.setTimeout(function () {
            appSelectView.bindOldSelectedValue();
            appSelectView.bindHistorySelectedValue();
            appSelectView.bindTableTree();
        },400);*/
    },
    methods:{
        beginSelect:function (relationData,oldBindFieldData) {
            console.log("关联表数据：")
            console.log(relationData);
            console.log("已经绑定了的数据：")
            console.log(oldBindFieldData);
            if(relationData==null||relationData==""||relationData.length==0){
                DialogUtility.AlertText("请先设置表单的数据关联！");
                $(window.document).find(".ui-widget-overlay").css("zIndex",10100);
                $(window.document).find(".ui-dialog").css("zIndex",10101);
                return;
            }
            //alert(PageStyleUtility.GetPageHeight());
            var elem=this.$refs.fdControlSelectBindToSingleFieldDialogWrap;
            //debugger;
            //this.getTableDataInitTree();

            var height=450;
            /*if(PageStyleUtility.GetPageHeight()>550){
                height=600;
            }*/

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 680,
                width: 980,
                title: "选择绑定字段"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex",10100);
            $(window.document).find(".ui-dialog").css("zIndex",10101);

            this.oldBindFieldData=oldBindFieldData;
            this.selectedData=JsonUtility.CloneSimple(oldBindFieldData);
            if (JsonUtility.JsonToString(relationData)!=this.oldRelationDataString){
                for(var i=0;i<relationData.length;i++){
                    relationData[i].displayText=relationData[i].tableName+"["+relationData[i].tableCaption+"]("+relationData[i].relationType+")";
                    if(relationData[i].parentId=="-1"){
                        relationData[i].displayText=relationData[i].tableName+"["+relationData[i].tableCaption+"]";
                    }
                    relationData[i].icon = "../../../Themes/Png16X16/table.png";
                }
                //将relationData的数据进行装换，用于形成树节点的数据
                //将关联数据加载成为树，并从服务端加载字段信息。
                this.tableTree.tableTreeObj=$.fn.zTree.init($("#tableZTreeUL"), this.tableTree.tableTreeSetting,relationData);
                this.tableTree.tableTreeObj.expandAll(true);

                this.oldRelationDataString=JsonUtility.JsonToString(relationData);
                this.relationData=relationData;
                this.getAllTablesFields(relationData);
            }
            else{
                this.resetFieldToSelectedStatus(this.allFields);
            }

            if(oldBindFieldData&&oldBindFieldData.tableId&&oldBindFieldData.tableId!="") {
                var selectedNode = this.tableTree.tableTreeObj.getNodeByParam("tableId", oldBindFieldData.tableId);
                //debugger;
                this.tableTree.tableTreeObj.selectNode(selectedNode, false, true);
            }
        },
        resetFieldToSelectedStatus:function(_allFields){
            //debugger;
            for(var i=0;i<this.fieldTable.fieldData.length;i++){
                this.fieldTable.fieldData[i].isSelectedToBind="0";
                //this.fieldTable.fieldData[i].fieldDesc='1';
            }
            //console.log(this.fieldTable.fieldData);
            //var temp=this.fieldTable.fieldData;
            //this.fieldTable.fieldData=[];
            //this.fieldTable.fieldData=temp;
            if(_allFields) {
                for (var i = 0; i < _allFields.length; i++) {
                    _allFields[i].isSelectedToBind = "0";
                    if (_allFields[i].fieldTableId == this.oldBindFieldData.tableId) {
                        if (_allFields[i].fieldName == this.oldBindFieldData.fieldName) {
                            _allFields[i].isSelectedToBind = "1";
                        }
                    }
                }
                this.allFields = _allFields;
            }
            this.filterAllFieldsToTable(this.oldBindFieldData.tableId);
        },
        getAllTablesFields:function(relationData){
            var tableIds=[];
            for(var i=0;i<relationData.length;i++){
                tableIds.push(relationData[i].tableId);
            }
            var _self=this;
            AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {"tableIds": tableIds}, function (result) {
                if (result.success) {
                    var allFields = result.data;
                    var singleTable = result.exKVData.Tables[0];
                    console.log("重新获取数据");
                    console.log(allFields);

                    _self.resetFieldToSelectedStatus(allFields);
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        filterAllFieldsToTable:function(tableId){
            if(tableId) {
                var fields = [];
                for (var i = 0; i < this.allFields.length; i++) {
                    if (this.allFields[i].fieldTableId == tableId) {
                        fields.push(this.allFields[i]);
                    }
                }
                this.fieldTable.fieldData = fields;
                console.log(this.fieldTable.fieldData);
            }
        },
        /*bindTableTree:function () {
            var _self=this;
            AjaxUtility.Post(this.acInterface.getTablesDataUrl,{},function (result) {
                if(result.success) {
                    _self.tableTree.tableTreeData=result.data;
                    _self.tableTree.tableTreeObj=$.fn.zTree.init($("#tableZTreeUL"), _self.tableTree.tableTreeSetting,_self.tableTree.tableTreeData);
                    _self.tableTree.tableTreeObj.expandAll(true);
                    fuzzySearch("tableZTreeUL","#txtSearchTableTree",null,true);
                    if(!StringUtility.IsNullOrEmpty(_self.selectedData.tableId)){
                        var selectedNode=_self.tableTree.tableTreeObj.getNodeByParam("id",_self.selectedData.tableId);
                        _self.tableTree.tableTreeObj.checkNode(selectedNode, true, true);
                        _self.bindFieldTable();
                    }
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            },"json");
        },
        bindFieldTable:function(){
            var _self=this;
            if(!StringUtility.IsNullOrEmpty(this.selectedData.tableId)){
                AjaxUtility.Post(this.acInterface.getTableFieldsDataUrl,{"tableId":this.selectedData.tableId},function (result) {
                    if(result.success) {
                        _self.fieldTable.fieldData=result.data;
                        var oldSelectedValue=_self.selectedData;
                        if(!StringUtility.IsNullOrEmpty(oldSelectedValue.tableId)&&!StringUtility.IsNullOrEmpty(oldSelectedValue.fieldName)) {
                            //ivu-table-row-highlight
                            window.setTimeout(function() {
                                $("span").each(function (j) {
                                    if ($(this).html() == oldSelectedValue.fieldName) {
                                        $(this).parent().parent().parent().addClass("select-old-field-tr");
                                    }
                                })
                            },300);
                        }
                    }
                    else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                    }
                },"json");
            }
            else{
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请先选择表!", null);
            }
        },
        bindOldSelectedValue:function(){
            //debugger;
            var oldSelectedValue= window.OpenerWindowObj[this.getSelectInstanceName()].getSelectFieldResultValue();
            //debugger;
            if(!StringUtility.IsNullOrEmpty(oldSelectedValue.tableId)) {
                this.selectedData.tableId = oldSelectedValue.tableId;
                this.selectedData.tableName = oldSelectedValue.tableName;
                this.selectedData.tableCaption = oldSelectedValue.tableCaption;
                this.selectedData.fieldName = oldSelectedValue.fieldName;
                this.selectedData.fieldCaption = oldSelectedValue.fieldCaption;
                this.selectedData.fieldDataType = oldSelectedValue.fieldDataType;
                this.selectedData.fieldLength = oldSelectedValue.fieldLength;
            }
        },
        bindHistorySelectedValue:function(){
            //debugger;
            if(StringUtility.IsNullOrEmpty(this.selectedData.tableId)){
                var SBTF_TableId=CookieUtility.GetCookie("SBTF_TableId");
                if(!StringUtility.IsNullOrEmpty(SBTF_TableId)){
                    var SBTF_TableName=CookieUtility.GetCookie("SBTF_TableName");
                    var SBTF_TableCaption=CookieUtility.GetCookie("SBTF_TableCaption");
                    this.selectedData.tableId =SBTF_TableId;
                    this.selectedData.tableName = SBTF_TableName;
                    this.selectedData.tableCaption = SBTF_TableCaption;
                }
            }
        },
        setHistorySelectedTableDataToCookie:function(tableId,tableName,tableCaption){
            CookieUtility.SetCookie1Month("SBTF_TableId",tableId);
            CookieUtility.SetCookie1Month("SBTF_TableName",tableName);
            CookieUtility.SetCookie1Month("SBTF_TableCaption",tableCaption);
        },
        getSelectInstanceName:function () {
            return BaseUtility.GetUrlParaValue("instanceName");
        },*/
        selectedField:function(selection,index){
            //alert(selection.fieldName);
            this.selectedData.fieldName=selection.fieldName;
            this.selectedData.fieldCaption=selection.fieldCaption;
            this.selectedData.fieldDataType=selection.fieldDataType;
            this.selectedData.fieldLength=selection.fieldDataLength;

            //根据选中的表id,从树结构中获取表的相关信息
            var selectedNode = this.tableTree.tableTreeObj.getNodeByParam("tableId", selection.fieldTableId);
            this.selectedData.tableId = selectedNode.tableId;
            this.selectedData.tableName = selectedNode.tableName;
            this.selectedData.tableCaption = selectedNode.tableCaption;
        },
        selectComplete:function () {
            var result=this.selectedData;
            if(!StringUtility.IsNullOrEmpty(result.tableId)&&!StringUtility.IsNullOrEmpty(result.fieldName)) {
                //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectFieldResultValue(result);
                //this.setHistorySelectedTableDataToCookie(result.tableId,result.tableName,result.tableCaption);
                this.$emit('on-selected-bind-to-single-field', result);
                this.handleClose();
            }
            else{
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {},"请选择需要绑定的字段!", null);
            }
        },
        clearComplete:function(){
            window.OpenerWindowObj[this.getSelectInstanceName()].setSelectFieldResultValue(null);
            this.handleClose();
        },
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.fdControlSelectBindToSingleFieldDialogWrap);
        }
    },
    template: `<div ref="fdControlSelectBindToSingleFieldDialogWrap" class="general-edit-page-wrap design-dialog-wraper-single-dialog" style="display: none">
                    <div class="select-table-wraper">
                        <divider orientation="left" :dashed="true" style="font-size: 12px">选择表</divider>
                        <!--<input type="text" id="txtSearchTableTree" style="width: 100%;height: 32px;margin-top: 2px" />-->
                        <ul id="tableZTreeUL" class="ztree"></ul>
                    </div>
                    <div class="select-field-wraper iv-list-page-wrap">
                        <divider orientation="left" :dashed="true" style="font-size: 12px">选择字段</divider>
                        <i-table border :columns="fieldTable.columnsConfig" :data="fieldTable.fieldData"
                                 class="iv-list-table" :highlight-row="true"
                                 @on-row-click="selectedField" :height="fieldTable.tableHeight" size="small" no-data-text="请选择表"></i-table>
                    </div>
                    <div class="button-outer-wrap">
                        <div class="button-inner-wrap">
                            <button-group>
                                <i-button type="primary" @click="selectComplete()"> 确 认 </i-button>
                                <i-button type="primary" @click="clearComplete()"> 清 空 </i-button>
                                <i-button @click="handleClose()">关 闭</i-button>
                            </button-group>
                        </div>
                    </div>
                </div>`
});
