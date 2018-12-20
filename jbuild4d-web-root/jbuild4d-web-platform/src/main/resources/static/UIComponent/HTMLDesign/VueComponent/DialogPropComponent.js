/*字段绑定的Vue组件*/
Vue.component("fd-control-bind-to", {
    props:["bindToFieldProp","defaultValueProp","validateRulesProp"],
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
            validateRules:{
                msg:"",
                rules:[]
            },
            defaultValue: {
                defaultType: "",
                defaultValue: "",
                defaultText: ""
            },
            tempData:{
                defaultDisplayText:""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        bindToProp :function(newValue) {
            console.log(newValue);
        },
        bindToFieldProp:function (newValue) {
            this.bindToField=newValue;
        },
        defaultValueProp:function (newValue) {
            this.defaultValue=newValue;
            if(!StringUtility.IsNullOrEmpty(this.defaultValue.defaultType)){
                this.tempData.defaultDisplayText=JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType,this.defaultValue.defaultText);
            }
        },
        validateRulesProp:function (newValue) {
            this.validateRules=newValue;
        }
    },
    mounted:function(){
        this.bindToField=this.bindToFieldProp;
    },
    methods:{
        setCompleted:function(){
            this.$emit('on-set-completed', this.bindToField,this.defaultValue,this.validateRules)
        },
        /*绑定字段*/
        selectBindFieldView:function () {
            /*var url = BaseUtility.BuildAction("/PlatForm/SelectView/SelectBindToTableField/Select", {instanceName: "_SelectBindObj"});
            window.parent.JBuild4D.FormDesign.Dialog.ShowIframeDialogInDesignPage(window, url, {
                modal: true,
                title: "选择绑定字段"
            });*/
            JBuild4DSelectView.SelectBindToField.beginSelectInFrame(window,"_SelectBindObj",{});
            //将当前对象附着到window上,提供给子窗体使用
            window._SelectBindObj = this;
        },
        setSelectFieldResultValue:function (result) {
            //debugger;
            this.bindToField={};
            if(result!=null){
                this.bindToField.fieldName=result.fieldName;
                this.bindToField.tableId=result.tableId;
                this.bindToField.tableName=result.tableName;
                this.bindToField.tableCaption=result.tableCaption;
                this.bindToField.fieldCaption=result.fieldCaption;
                this.bindToField.fieldDataType=result.fieldDataType;
                this.bindToField.fieldLength=result.fieldLength;
            }
            else {
                this.bindToField.fieldName = "";
                this.bindToField.tableId = "";
                this.bindToField.tableName = "";
                this.bindToField.tableCaption = "";
                this.bindToField.fieldCaption = "";
                this.bindToField.fieldDataType = "";
                this.bindToField.fieldLength = "";
            }

            this.setCompleted();
            //alert(result);
        },
        getSelectFieldResultValue:function () {
            return JsonUtility.CloneSimple(this.bindToField);
            //return this.bindTo;
        },
        /*绑定默认值*/
        selectDefaultValueView:function () {
            //var url = BaseUtility.BuildAction("/PlatForm/SelectView/SelectEnvVariable/Select", {instanceName: "_SelectBindObj"});
            //window.parent.JBuild4D.FormDesign.Dialog.ShowIframeDialogInDesignPage(window, url, {
            //    modal: true,
            //    title: "选择默认值"
            //});
            JBuild4DSelectView.SelectEnvVariable.beginSelectInFrame(window,"_SelectBindObj",{});
            //将当前对象附着到window上,提供给子窗体使用
            window._SelectBindObj = this;
        },
        setSelectEnvVariableResultValue:function(result){
            if(result!=null) {
                this.defaultValue.defaultType = result.Type;
                this.defaultValue.defaultValue = result.Value;
                this.defaultValue.defaultText = result.Text;
                this.tempData.defaultDisplayText = JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
            }
            else {
                this.defaultValue.defaultType = "";
                this.defaultValue.defaultValue = "";
                this.defaultValue.defaultText = "";
                this.tempData.defaultDisplayText = "";
            }
            this.setCompleted();
        },
        /*绑定验证规则*/
        selectValidateRuleView:function () {
            JBuild4DSelectView.SelectValidateRule.beginSelectInFrame(window,"_SelectBindObj",{});
            //将当前对象附着到window上,提供给子窗体使用
            window._SelectBindObj = this;
        },
        setSelectValidateRuleResultValue:function (result) {
            if(result!=null){
                this.validateRules=result;
                this.setCompleted();
            }
            else{
                this.validateRules.msg="";
                this.validateRules.rules=[];
            }
        },
        getSelectValidateRuleResultValue:function () {
            return this.validateRules;
        }
    },
    template: '<table cellpadding="0" cellspacing="0" border="0" class="dialog-table-wraper">' +
                    '<colgroup>' +
                        '<col style="width: 100px" />' +
                        '<col style="width: 280px" />' +
                        '<col style="width: 100px" />' +
                        '<col />' +
                    '</colgroup>' +
                    '<tr>' +
                        '<td colspan="4">' +
                        '    绑定到表<button class="btn-select fright" v-on:click="selectBindFieldView">...</button>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>'+
                        '<td>表编号：</td>' +
                        '<td colspan="3">{{bindToField.tableId}}</td>' +
                    '</tr>'+
                    '<tr>' +
                        '<td>表名：</td>' +
                        '<td>{{bindToField.tableName}}</td>' +
                        '<td>表标题：</td>' +
                        '<td>{{bindToField.tableCaption}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>字段名：</td>' +
                        '<td>{{bindToField.fieldName}}</td>' +
                        '<td>字段标题：</td>' +
                        '<td>{{bindToField.fieldCaption}}</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>类型：</td>' +
                        '<td>{{bindToField.fieldDataType}}</td>' +
                        '<td>长度：</td>' +
                        '<td>{{bindToField.fieldLength}}</td>' +
                    '</tr>' +
                    '<tr>'+
                        '<td colspan="4">默认值<button class="btn-select fright" v-on:click="selectDefaultValueView">...</button></td>'+
                    '</tr>'+
                    '<tr style="height: 35px">'+
                        '<td colspan="4" style="background-color: #ffffff;">' +
                            '{{tempData.defaultDisplayText}}'+
                        '</td>'+
                    '</tr>'+
                    '<tr>' +
                        '<td colspan="4">' +
                        '    校验规则<button class="btn-select fright" v-on:click="selectValidateRuleView">...</button>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td colspan="4" style="background-color: #ffffff">' +
                            '<table class="dialog-table-wraper">' +
                                '<colgroup>' +
                                    '<col style="width: 100px" />' +
                                    '<col />' +
                                '</colgroup>' +
                                '<tr>' +
                                    '<td style="text-align: center;">提示消息：</td>' +
                                    '<td>{{validateRules.msg}}</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td style="text-align: center;">验证类型</td>'+
                                    '<td style="background: #e8eaec;text-align: center;">参数</td>'+
                                '</tr>'+
                                '<tr v-for="ruleItem in validateRules.rules">' +
                                    '<td style="background: #ffffff;text-align: center;color: #ad9361">{{ruleItem.validateType}}</td>'+
                                    '<td style="background: #ffffff;text-align: center;"><p v-if="ruleItem.validateParas === \'\'">无参数</p><p v-else>{{ruleItem.validateParas}}</p></td>'+
                                '</tr>'+
                            '</table>' +
                        '</td>' +
                    '</tr>' +
                '</table>'
});

/*绑定一般信息的Vue组件*/
Vue.component("fd-control-base-info", {
    props:["value"],
    data: function () {
        return {
            baseInfo:{
                id:"",
                serialize:"",
                name:"",
                className:"",
                placeholder:"",
                readonly:"",
                disabled:"",
                style:"",
                desc:""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        baseInfo: function (newVal) {
            // 必须是input
            this.$emit('input', newVal)
        },
        value:function (newVal) {
            this.baseInfo=newVal;
        }
    },
    mounted:function(){
        //debugger;
        this.baseInfo=this.value;
    },
    methods:{

    },
    template: '<table class="dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">' +
                    '<colgroup>' +
                        '<col style="width: 100px" />' +
                        '<col style="width: 280px" />' +
                        '<col style="width: 90px" />' +
                        '<col style="width: 110px" />' +
                        '<col style="width: 90px" />' +
                        '<col />' +
                    '</colgroup>' +
                    '<tr>' +
                        '<td>ID：</td>' +
                        '<td>' +
                            '<input type="text" v-model="baseInfo.id" />' +
                        '</td>' +
                        '<td>Serialize：</td>' +
                        '<td colspan="3">' +
                            '<radio-group type="button" style="margin: auto" v-model="baseInfo.serialize">' +
                                '<radio label="true">是</radio>' +
                                '<radio label="false">否</radio>' +
                            '</radio-group>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>Name：</td>' +
                        '<td><input type="text" v-model="baseInfo.name" /></td>' +
                        '<td>ClassName：</td>' +
                        '<td colspan="3"><input type="text" v-model="baseInfo.className" /></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>Placeholder</td>' +
                        '<td><input type="text" v-model="baseInfo.placeholder" /></td>' +
                        '<td>Readonly：</td>' +
                        '<td style="text-align: center">' +
                            '<radio-group type="button" style="margin: auto" v-model="baseInfo.readonly">' +
                                '<radio label="readonly">是</radio>' +
                                '<radio label="noreadonly">否</radio>' +
                            '</radio-group>' +
                        '</td>' +
                        '<td>Disabled：</td>' +
                        '<td style="text-align: center">' +
                            '<radio-group type="button" style="margin: auto" v-model="baseInfo.disabled">' +
                                '<radio label="disabled">是</radio>' +
                                '<radio label="nodisabled">否</radio>' +
                            '</radio-group>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>样式：</td>' +
                        '<td colspan="5">' +
                            '<textarea rows="7" v-model="baseInfo.style"></textarea>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>备注：</td>' +
                        '<td colspan="5">' +
                            '<textarea rows="8" v-model="baseInfo.desc"></textarea>' +
                        '</td>' +
                    '</tr>' +
        '</table>'
});

/*SQL编辑控件*/
Vue.component("sql-general-design-comp", {
    props:["sqlDesignerHeight","value"],
    data:function(){
        return {
            sqlText:""
        }
    },
    watch: {
        sqlText: function (newVal) {
            // 必须是input
            this.$emit('input', newVal)
        },
        value:function (newVal) {
            this.sqlText=newVal;
            //this.setValue(newVal);
        }
    },
    mounted:function(){
        this.sqlCodeMirror = CodeMirror.fromTextArea($("#TextAreaSQLEditor")[0], {
            mode: "text/x-sql",
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            theme: "monokai"
        });
        this.sqlCodeMirror.setSize("100%", this.sqlDesignerHeight);
        var _self=this;
        this.sqlCodeMirror.on("change",function (cMirror) {
            console.log(cMirror.getValue());
            _self.sqlText=cMirror.getValue();
        });
        //this.sqlCodeMirror.setValue("123123");
    },
    methods:{
        getValue:function () {
            this.sqlCodeMirror.getValue();
        },
        setValue:function (value) {
            this.sqlCodeMirror.setValue(value);
        }
    },
    template:'<div>\
                <textarea id="TextAreaSQLEditor"></textarea>\
                <div style="text-align: right;margin-top: 8px">\
                    <radio-group type="button" size="small">\
                        <radio label="组织Id"></radio>\
                        <radio label="组织名称"></radio>\
                        <radio label="用户Id"></radio>\
                        <radio label="用户名称"></radio>\
                        <radio label="yyyy-MM-dd"></radio>\
                        <radio label="表字段"></radio>\
                        <radio label="说明"></radio>\
                    </radio-group>\
                </div>\
              </div>'
});

/*用于设定表关联的Vue封装组件*/
Vue.component("db-table-relation-comp", {
    data:function(){
        return {
            acInterface: {
                getTablesDataUrl: "/PlatForm/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
                getTableFieldsUrl: "/PlatForm/Builder/DataStorage/DataBase/Table/GetTableFieldsByTableId"
            },
            relationTableTree: {
                treeObj: null,
                tableTreeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    data: {
                        key: {
                            name: "text"
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
                            var _self = window._dbtablerelationcomp;
                            _self.selectedRelationTableNode(treeNode);
                        }
                    }
                },
                tableTreeData: {
                    id: "-1",
                    text: "数据关联",
                    parentId: "",
                    nodeTypeName: "根节点",
                    icon: "../../../Themes/Png16X16/coins_add.png",
                    _nodeExType: "root",
                    tableId: "-1"
                },
                currentSelectedNode: null
            },
            relationTableEditorView: {
                isShowTableEditDetail: false,
                isSubEditTr: false,
                isMainEditTr: false,
                selPKData: [],
                selSelfKeyData: [],
                selForeignKeyData: []
            },
            emptyEditorData:{
                id: "",
                parentId: "",
                singleName: "",
                pkFieldName: "",
                desc: "",
                selfKeyFieldName: "",
                outerKeyFieldName: "",
                relationType: "1ToN",
                isSave: "true",
                condition:""
            },
            currentEditorData: {
                id: "",
                parentId: "",
                singleName: "",
                pkFieldName: "",
                desc: "",
                selfKeyFieldName: "",
                outerKeyFieldName: "",
                relationType: "1ToN",
                isSave: "true",
                condition:""
            },
            selectTableTree: {
                tableTreeObj: null,
                tableTreeSetting: {
                    view: {
                        dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
                        showLine: true,//是否显示节点之间的连线
                        fontCss: {'color': 'black', 'font-weight': 'normal'}
                    },
                    check: {
                        enable: true,
                        nocheckInherit: false,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        key: {
                            name: "text"
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
                            if (treeNode.nodeTypeName == "Table") {
                                //appForm.tableTree.tableTreeObj.checkNode(treeNode, true, true);
                                //appForm.formResourceEntity.formMainTableCaption=treeNode.attr1;
                                //appForm.formResourceEntity.formMainTableName=treeNode.value;
                                var _self = window._dbtablerelationcomp;
                                _self.addTableToRelationTableTree(treeNode);
                                $("#divSelectTable").dialog("close");
                            }
                        }
                    }
                },
                tableTreeData: null,//${tableTreeData},
                selectedTableName: "无"
            },
            tempDataStore: {},
            resultData: []
        }
    },
    mounted:function(){
        this.bindSelectTableTree();
        //初始化根节点
        this.relationTableTree.treeObj=$.fn.zTree.init($("#dataRelationZTreeUL"), this.relationTableTree.tableTreeSetting,this.relationTableTree.tableTreeData);
        this.relationTableTree.treeObj.expandAll(true);
        this.relationTableTree.currentSelectedNode=this.relationTableTree.treeObj.getNodeByParam("id","-1");
        //将对象附加到window上,提供给后边进行操作
        window._dbtablerelationcomp=this;
    },
    watch: {
        currentEditorData: { //深度监听，可监听到对象、数组的变化
            handler(val, oldVal){
                //console.log(val.id);
                //使用设置值覆盖掉结果集中的值.
                for(var i=0;i<this.resultData.length;i++) {
                    if (this.resultData[i].id == val.id) {
                        /*this.resultData[i].singleName=val.singleName;
                        this.resultData[i].pkFieldName=val.pkFieldName;
                        this.resultData[i].desc=val.desc;
                        this.resultData[i].selfKeyFieldName=val.selfKeyFieldName;
                        this.resultData[i].outerKeyFieldName=val.outerKeyFieldName;
                        this.resultData[i].relationType=val.relationType;
                        this.resultData[i].isSave=val.isSave;
                        this.resultData[i].condition=val.condition;*/
                        this.resultItemCopyValue(this.resultData[i],val);
                    }
                }
            },
            deep:true
        }
    },
    methods: {
        resultItemCopyValue:function(toObj,fromObj){
            toObj.singleName=fromObj.singleName;
            toObj.pkFieldName=fromObj.pkFieldName;
            toObj.desc=fromObj.desc;
            toObj.selfKeyFieldName=fromObj.selfKeyFieldName;
            toObj.outerKeyFieldName=fromObj.outerKeyFieldName;
            toObj.relationType=fromObj.relationType;
            toObj.isSave=fromObj.isSave;
            toObj.condition=fromObj.condition;
        },
        getTableFieldsByTableId:function (tableId) {
            if(this.tempDataStore["tableField_"+tableId]){
                return this.tempDataStore["tableField_"+tableId];
            }
            else{
                var _self=this;
                AjaxUtility.PostSync(this.acInterface.getTableFieldsUrl,{tableId:tableId},function (result) {
                    if(result.success){
                        _self.tempDataStore["tableField_"+tableId]=result.data;
                    }
                    else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                    }
                },"json");
            }
            if(this.tempDataStore["tableField_"+tableId]){
                return this.tempDataStore["tableField_"+tableId];
            }
            else{
                return null;
            }
        },
        getEmptyResultItem:function(){
            return JsonUtility.CloneSimple(this.emptyEditorData);
        },
        getExistResultItem:function(id){
            for(var i=0;i<this.resultData.length;i++){
                if(this.resultData[i].id==id){
                    return this.resultData[i];
                }
            }
            return null;
        },
        bindSelectTableTree: function () {
            var _self = this;
            AjaxUtility.Post(this.acInterface.getTablesDataUrl, {}, function (result) {
                if (result.success) {
                    _self.selectTableTree.tableTreeData = result.data;
                    //console.log(_self.tree.tableTreeData);
                    _self.selectTableTree.tableTreeObj = $.fn.zTree.init($("#selectTableZTreeUL"), _self.selectTableTree.tableTreeSetting, _self.selectTableTree.tableTreeData);
                    _self.selectTableTree.tableTreeObj.expandAll(true);
                    //fuzzySearch("tableZTreeUL","#txtSearchTableTree",null,true);
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        beginSelectTableToRelationTable: function () {
            if (this.relationTableTree.currentSelectedNode) {
                $("#divSelectTable").dialog({
                    modal: true,
                    height: 600,
                    width: 500
                });
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "选择一个父节点!", null);
            }
        },
        buildRelationTableNode:function(sourceNode){
            if (this.relationTableTree.currentSelectedNode._nodeExType == "root") {
                sourceNode._nodeExType = "MainNode";
                sourceNode.icon = "../../../Themes/Png16X16/page_key.png";
            }
            else {
                sourceNode._nodeExType = "SubNode";
                sourceNode.icon = "../../../Themes/Png16X16/page_refresh.png";
            }
            sourceNode.tableId=sourceNode.id;
            sourceNode.id=StringUtility.Guid();
            return sourceNode;
        },
        getMainRelationTableNode:function(){
            return this.relationTableTree.treeObj.getNodeByParam("_nodeExType", "MainNode");
        },
        isSelectedRootRelationTableNode:function(){
            return this.relationTableTree.currentSelectedNode.id == "-1";
        },
        isSelectedMainRelationTableNode:function(){
            return this.relationTableTree.currentSelectedNode._nodeExType=="MainNode";
        },
        addTableToRelationTableTree: function (newNode) {
            newNode = this.buildRelationTableNode(newNode);
            var tempNode = this.getMainRelationTableNode();
            if (tempNode != null) {
                if (this.isSelectedRootRelationTableNode()) {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "只允许存在一个主记录!", null);
                    return;
                }
            }
            this.relationTableTree.treeObj.addNodes(this.relationTableTree.currentSelectedNode, -1, newNode, false);
            //将当前的节点加入结果集合
            var newResultItem = this.getEmptyResultItem();
            newResultItem.id = newNode.id;
            newResultItem.parentId = this.relationTableTree.currentSelectedNode.id;
            this.resultData.push(newResultItem);
        },
        selectedRelationTableNode: function (node) {
            //debugger;
            this.relationTableTree.currentSelectedNode = node;
            this.relationTableEditorView.isShowTableEditDetail=!this.isSelectedRootRelationTableNode();
            this.relationTableEditorView.isMainEditTr=this.isSelectedMainRelationTableNode();
            this.relationTableEditorView.isSubEditTr=!this.isSelectedMainRelationTableNode();
            if(this.isSelectedRootRelationTableNode()){
                return
            }
            //绑定主键的下拉列表
            //alert(node.id);
            this.relationTableEditorView.selPKData=this.getTableFieldsByTableId(node.tableId)!=null?this.getTableFieldsByTableId(node.tableId):[];
            //console.log(this.relationTableEditorView.selPKData);
            //绑定本身关联字段的下拉列表
            this.relationTableEditorView.selSelfKeyData=this.getTableFieldsByTableId(node.tableId)!=null?this.getTableFieldsByTableId(node.tableId):[];
            //绑定外联字段的下拉列表
            var parentNode=node.getParentNode();
            this.relationTableEditorView.selForeignKeyData=this.getTableFieldsByTableId(parentNode.tableId)!=null?this.getTableFieldsByTableId(parentNode.tableId):[];
            this.currentEditorData.id=this.relationTableTree.currentSelectedNode.id;
            this.currentEditorData.parentId=parentNode.id;

            //从关联的结果数据中,查找出当前节点的数据,绑定到编辑窗口
            var existResultItem=this.getExistResultItem(node.id);
            if(existResultItem!=null){
                this.resultItemCopyValue(this.currentEditorData,existResultItem);
                //调用sql编辑的组件,进行赋值
                var _self=this;
                window.setTimeout(function () {
                    _self.$refs.sqlGeneralDesignComp.setValue(_self.currentEditorData.condition);
                },300);
                //debugger;
            }
            else{
                alert("通过getExistResultItem获取不到数据!");
            }
        },
        serializeRelation:function(){
            return JsonUtility.JsonToString(this.resultData);
        },
        deserializeRelation:function(){

        },
        alertSerializeRelation:function(){
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {width:900,height:600},"<div><textarea style='width: 100%;height:480px'>"+this.serializeRelation()+"</textarea></div>", null);
        },
        inputDeserializeRelation:function(){

        }
    },
    template:'<div class="db-table-relation-comp">\
                <divider orientation="left" :dashed="true" style="font-size: 12px">数据关系关联设置</divider>\
                <div style="float: left;width: 350px;height: 330px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 10px 10px 10px;">\
                    <button-group shape="circle" style="margin: auto">\
                        <i-button type="success" @click="beginSelectTableToRelationTable">&nbsp;添加&nbsp;</i-button>\
                        <i-button>&nbsp;删除&nbsp;</i-button>\
                        <i-button @click="alertSerializeRelation">序列化</i-button>\
                        <i-button @click="inputDeserializeRelation">反序列化</i-button>\
                        <i-button>说明</i-button>\
                    </button-group>\
                    <ul id="dataRelationZTreeUL" class="ztree"></ul>\
                </div>\
                <div style="float: right;width: 630px;height: 330px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 10px 10px 10px;">\
                    <table class="light-gray-table" cellpadding="0" cellspacing="0" border="0" v-if="relationTableEditorView.isShowTableEditDetail">\
                        <colgroup>\
                            <col style="width: 17%" />\
                            <col style="width: 33%" />\
                            <col style="width: 15%" />\
                            <col style="width: 35%" />\
                        </colgroup>\
                        <tbody>\
                            <tr>\
                                <td class="label">SingleName：</td>\
                                <td>\
                                    <i-input v-model="currentEditorData.singleName" size="small" placeholder="本关联中的唯一名称,可以为空" />\
                                </td>\
                                <td class="label">PKKey：</td>\
                                <td>\
                                    <i-select placeholder="默认使用Id字段" v-model="currentEditorData.pkFieldName" size="small" style="width:199px">\
                                        <i-option v-for="item in relationTableEditorView.selPKData" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>\
                                    </i-select>\
                                </td>\
                            </tr>\
                            <tr>\
                                <td class="label">Desc：</td>\
                                <td colspan="3">\
                                    <i-input v-model="currentEditorData.desc" size="small" placeholder="说明" />\
                                </td>\
                            </tr>\
                            <tr v-if="relationTableEditorView.isSubEditTr">\
                                <td class="label">数据关系：</td>\
                                <td>\
                                    <radio-group v-model="currentEditorData.relationType" type="button" size="small">\
                                        <radio label="1To1">1:1</radio>\
                                        <radio label="1ToN">1:N</radio>\
                                    </radio-group>\
                                </td>\
                                <td class="label">是否保存：</td>\
                                <td>\
                                    <radio-group v-model="currentEditorData.isSave" type="button" size="small">\
                                        <radio label="true">是</radio>\
                                        <radio label="false">否</radio>\
                                    </radio-group>\
                                </td>\
                            </tr>\
                            <tr v-if="relationTableEditorView.isSubEditTr">\
                                <td class="label">本身关联字段：</td>\
                                <td>\
                                     <i-select placeholder="默认使用Id字段" v-model="currentEditorData.selfKeyFieldName" size="small" style="width:199px">\
                                        <i-option v-for="item in relationTableEditorView.selSelfKeyData" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>\
                                    </i-select>\
                                </td>\
                                <td class="label">外联字段：</td>\
                                <td>\
                                     <i-select placeholder="默认使用Id字段" v-model="currentEditorData.outerKeyFieldName" size="small" style="width:199px">\
                                        <i-option v-for="item in relationTableEditorView.selPKData" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>\
                                    </i-select>\
                                </td>\
                            </tr>\
                            <tr>\
                                <td class="label">加载条件：<br />[对加载数据起效]</td>\
                                <td colspan="3">\
                                    <sql-general-design-comp ref="sqlGeneralDesignComp" :sqlDesignerHeight="110" v-model="currentEditorData.condition"></sql-general-design-comp>\
                                </td>\
                            </tr>\
                        </tbody>\
                    </table>\
                </div>\
                <div id="divSelectTable" title="请选择表" style="display: none">\
                    <ul id="selectTableZTreeUL" class="ztree"></ul>\
                </div>\
              </div>'
});