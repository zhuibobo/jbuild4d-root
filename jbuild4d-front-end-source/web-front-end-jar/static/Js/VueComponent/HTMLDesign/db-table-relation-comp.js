/*用于设定表关联的Vue封装组件*/
Vue.component("db-table-relation-comp", {
    data:function(){
        return {
            acInterface: {
                getTablesDataUrl: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
                getTableFieldsUrl: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTableFieldsByTableId"
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
                tableTreeRootData: {
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
                condition:"",
                tableId:"",
                tableName:"",
                tableCaption:""
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
                condition:"",
                tableId:"",
                tableName:"",
                tableCaption:""
            },
            selectTableTree: {
                oldSelectedDBLinkId:"JBuild4dLocationDBLink",
                disabledDBLink:false,
                dbLinkEntities:[],
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
                                $("#divSelectTable").dialog("close");
                                _self.addTableToRelationTableTree(treeNode);
                            }
                        }
                    }
                },
                tableTreeData: null,//${tableTreeData},
                allTableTreeData:null,
                selectedTableName: "无"
            },
            tempDataStore: {},
            resultData: [],
            treeNodeSetting:{
                MainTableNodeImg: "../../../Themes/Png16X16/page_key.png",
                SubTableNodeImg:"../../../Themes/Png16X16/page_refresh.png"
            }
        }
    },
    mounted:function(){
        this.getTablesAndBindOldSelected();
        //初始化根节点
        this.relationTableTree.treeObj=$.fn.zTree.init($("#dataRelationZTreeUL"), this.relationTableTree.tableTreeSetting,this.relationTableTree.tableTreeRootData);
        this.relationTableTree.treeObj.expandAll(true);
        this.relationTableTree.currentSelectedNode=this.relationTableTree.treeObj.getNodeByParam("id","-1");
        //将对象附加到window上,提供给后边进行操作
        window._dbtablerelationcomp=this;
    },
    watch: {
        currentEditorData: { //深度监听，可监听到对象、数组的变化
            handler:function(val, oldVal){
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
                        this.resultItemCopyEditEnableValue(this.resultData[i],val);
                    }
                }
            },
            deep:true
        }
    },
    methods: {
        resultItemCopyEditEnableValue:function(toObj,fromObj){
            toObj.singleName=fromObj.singleName;
            toObj.pkFieldName=fromObj.pkFieldName;
            toObj.desc=fromObj.desc;
            toObj.selfKeyFieldName=fromObj.selfKeyFieldName;
            toObj.outerKeyFieldName=fromObj.outerKeyFieldName;
            toObj.relationType=fromObj.relationType;
            toObj.isSave=fromObj.isSave;
            toObj.condition=fromObj.condition;
            //toObj.code=fromObj.code;
        },
        getTableFieldsByTableId:function (tableId) {
            if(tableId=="-1"){
                return null;
            }
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
        getTablesAndBindOldSelected:function(){
            var _self = this;
            AjaxUtility.Post(this.acInterface.getTablesDataUrl, {}, function (result) {
                if (result.success) {
                    //console.log(result);
                    _self.selectTableTree.dbLinkEntities=result.exKVData.dbLinkEntityList;
                    _self.selectTableTree.allTableTreeData=result.data;
                    _self.bindSelectTableTree(true);
                    //fuzzySearch("tableZTreeUL","#txtSearchTableTree",null,true);
                    fuzzySearchTreeObj(_self.selectTableTree.tableTreeObj,_self.$refs.txt_table_search_text.$refs.input,null,true);
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        bindSelectTableTree: function (isGetCookieOldSelected) {
            //debugger;

            var oldSelectedDBLinkId=CookieUtility.GetCookie("DBTRCDBLINKID");
            if(oldSelectedDBLinkId&&isGetCookieOldSelected){
                this.selectTableTree.oldSelectedDBLinkId=oldSelectedDBLinkId;
            }
            else{
                oldSelectedDBLinkId=this.selectTableTree.oldSelectedDBLinkId;
            }

            var bindToTreeData=[];

            for(var i=0;i<this.selectTableTree.allTableTreeData.length;i++) {
                if (oldSelectedDBLinkId == this.selectTableTree.allTableTreeData[i].outerId) {
                    bindToTreeData.push(this.selectTableTree.allTableTreeData[i]);
                }
            }

            this.selectTableTree.tableTreeData = bindToTreeData;
            //console.log(_self.tree.tableTreeData);
            this.selectTableTree.tableTreeObj = $.fn.zTree.init($("#selectTableZTreeUL"), this.selectTableTree.tableTreeSetting, this.selectTableTree.tableTreeData);
            this.selectTableTree.tableTreeObj.expandAll(true);
        },
        changeDBLink:function(dbLinkId){
            CookieUtility.SetCookie1Month("DBTRCDBLINKID",dbLinkId);
            this.bindSelectTableTree(true);
        },
        getMainTableDBLinkId:function(){
            //debugger;
            for(var i=0;i<this.selectTableTree.allTableTreeData.length;i++){
                if(this.selectTableTree.allTableTreeData[i].id==this.getMainTableId()){
                    return this.selectTableTree.allTableTreeData[i].outerId;
                }
            }
            return "";
        },
        deleteSelectedRelationTreeNode:function(){
            if(this.relationTableTree.currentSelectedNode){
                if(!this.isSelectedRootRelationTableNode()){
                    if(!this.relationTableTree.currentSelectedNode.isParent){
                        for(var i=0;i<this.resultData.length;i++){
                            if(this.resultData[i].id==this.relationTableTree.currentSelectedNode.id){
                                this.resultData.splice(i,1);
                                break;
                            }
                        }
                        this.resultItemCopyEditEnableValue(this.currentEditorData,this.emptyEditorData);
                        this.currentEditorData.id="";
                        this.currentEditorData.parentId="";
                        this.$refs.sqlGeneralDesignComp.setValue("");
                        this.relationTableEditorView.selPKData=[];
                        this.relationTableEditorView.selSelfKeyData=[];
                        this.relationTableEditorView.selForeignKeyData=[];
                        this.relationTableEditorView.isShowTableEditDetail=false;
                        this.relationTableTree.treeObj.removeNode(this.relationTableTree.currentSelectedNode,false);
                        this.relationTableTree.currentSelectedNode=null;
                    }
                    else{
                        DialogUtility.AlertText("不能删除父节点!");
                    }
                }
                else{
                    DialogUtility.AlertText("不能删除根节点!");
                }
            }
            else{
                DialogUtility.AlertText("请选择要删除的节点!");
            }
        },
        beginSelectTableToRelationTable: function () {
            if (this.relationTableTree.currentSelectedNode) {
                $("#divSelectTable").dialog({
                    modal: true,
                    height: 600,
                    width: 700
                });

                //debugger;
                //如果已经设置了主表,则只能使用相同连接下的表
                var mainTableDBLinkId=this.getMainTableDBLinkId();
                if(mainTableDBLinkId){
                    this.selectTableTree.oldSelectedDBLinkId=mainTableDBLinkId;
                    this.bindSelectTableTree(false);
                    this.selectTableTree.disabledDBLink=true;
                }
                else{
                    this.selectTableTree.disabledDBLink=false;
                }
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "选择一个父节点!", null);
            }
        },
        appendMainTableNodeProp:function(node){
            node._nodeExType = "MainNode";
            node.icon = this.treeNodeSetting.MainTableNodeImg;
        },
        appendSubTableNodeProp:function(node){
            node._nodeExType = "SubNode";
            node.icon = this.treeNodeSetting.SubTableNodeImg;
        },
        buildRelationTableNode:function(sourceNode,treeNodeId){
            if (this.relationTableTree.currentSelectedNode._nodeExType == "root") {
                //sourceNode._nodeExType = "MainNode";
                //sourceNode.icon = this.treeNodeSetting.MainTableNodeImg;
                this.appendMainTableNodeProp(sourceNode);
            }
            else {
                //sourceNode._nodeExType = "SubNode";
                //sourceNode.icon = this.treeNodeSetting.SubTableNodeImg;
                this.appendSubTableNodeProp(sourceNode);
            }
            sourceNode.tableId=sourceNode.id;
            if(treeNodeId){
                sourceNode.id = treeNodeId;
            }
            else {
                sourceNode.id = StringUtility.Guid();
            }
            return sourceNode;
        },
        getMainRelationTableNode:function(){
            var node=this.relationTableTree.treeObj.getNodeByParam("_nodeExType", "MainNode");
            if(node){
                return node;
            }
            return null;
        },
        getMainTableId:function() {
            return this.getMainRelationTableNode() ? this.getMainRelationTableNode().tableId : "";
        },
        getMainTableName:function() {
            return this.getMainRelationTableNode() ? this.getMainRelationTableNode().value : "";
        },
        getMainTableCaption:function() {
            return this.getMainRelationTableNode() ? this.getMainRelationTableNode().attr1 : "";
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
            newResultItem.tableId=newNode.tableId;
            newResultItem.tableName=newNode.value;
            newResultItem.tableCaption=newNode.attr1;
            newResultItem.tableCode=newNode.code;

            this.resultData.push(newResultItem);
        },
        selectedRelationTableNode: function (node) {
            //return;
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
                this.resultItemCopyEditEnableValue(this.currentEditorData,existResultItem);
                //调用sql编辑的组件,进行赋值
                var _self=this;
                window.setTimeout(function () {
                    _self.$refs.sqlGeneralDesignComp.setValue(_self.currentEditorData.condition);
                    //_self.$refs.sqlGeneralDesignComp.selfTableFields=_self.relationTableEditorView.selSelfKeyData;
                    _self.$refs.sqlGeneralDesignComp.setAboutTableFields(_self.relationTableEditorView.selSelfKeyData,_self.relationTableEditorView.selForeignKeyData);
                },300);
                //debugger;
            }
            else{
                alert("通过getExistResultItem获取不到数据!");
            }
        },
        getResultData:function(){
            return this.resultData;
        },
        serializeRelation:function(isFormat){
            alert("serializeRelation已经停用");
            return;
            if(isFormat){
                return JsonUtility.JsonToStringFormat(this.resultData);
            }
            return JsonUtility.JsonToString(this.resultData);
        },
        deserializeRelation:function(jsonString){
            alert("deserializeRelation已经停用");
            return;
        },
        getValue:function(){
            var result={
                mainTableId:this.getMainTableId(),
                mainTableName:this.getMainTableName(),
                mainTableCaption:this.getMainTableCaption(),
                relationData:this.resultData
            }
            return result;
        },
        setValue:function(jsonString){
            //debugger;
            var tempData=JsonUtility.StringToJson(jsonString);
            this.resultData=tempData;
            //构造树形式的展现
            //转换数据为树格式的数据
            var treeNodeData=new Array();
            for(var i=0;i<tempData.length;i++){
                var treeNode={
                    "value":tempData[i].tableName,
                    "attr1":tempData[i].tableCaption,
                    "text":"【"+tempData[i].tableCode+"】"+tempData[i].tableCaption+"【"+tempData[i].tableName+"】",
                    "id":tempData[i].id,
                    "parentId":tempData[i].parentId
                }
                if(tempData[i].parentId=="-1"){
                    this.appendMainTableNodeProp(treeNode);
                }
                else{
                    this.appendSubTableNodeProp(treeNode);
                }
                //tempData[i].value=tempData[i].tableName;
                //tempData[i].attr1=tempData[i].tableCaption;
                //tempData[i].text=tempData[i].tableCaption+"【"+tempData[i].tableName+"】";
                treeNodeData.push(treeNode);
            }
            //this.relationTableTree.treeObj.removeChildNodes(this.relationTableTree.tableTreeRootData);
            treeNodeData.push(this.relationTableTree.tableTreeRootData);
            //debugger;
            this.relationTableTree.treeObj = $.fn.zTree.init($("#dataRelationZTreeUL"), this.relationTableTree.tableTreeSetting,treeNodeData);
            this.relationTableTree.treeObj.expandAll(true);
        },
        alertSerializeRelation:function(){
            DialogUtility.AlertJsonCode(this.resultData);
        },
        inputDeserializeRelation:function(){
            DialogUtility.Prompt(window,{
                width: 900,
                height: 600
            },DialogUtility.DialogPromptId,"请贴入数据关联Json设置字符串",function (jsonString) {
                try{
                    window._dbtablerelationcomp.setValue(jsonString);
                }
                catch (e) {
                    alert("反序列化失败:"+e);
                }
            });
        }
    },
    template:`<div class="db-table-relation-comp">
                <divider orientation="left" :dashed="true" style="font-size: 12px;margin-top: 0px;margin-bottom: 10px">数据关系关联设置</divider>
                <div style="float: left;width: 350px;height: 330px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 10px 10px 10px;">
                    <button-group shape="circle" style="margin: auto">
                        <i-button type="success" @click="beginSelectTableToRelationTable">&nbsp;添加&nbsp;</i-button>
                        <i-button @click="deleteSelectedRelationTreeNode">&nbsp;删除&nbsp;</i-button>
                        <i-button @click="alertSerializeRelation">序列化</i-button>
                        <i-button @click="inputDeserializeRelation">反序列化</i-button>
                        <i-button>说明</i-button>
                    </button-group>
                    <ul id="dataRelationZTreeUL" class="ztree" style="overflow-x: hidden"></ul>
                </div>
                <div style="float: right;width: 630px;height: 330px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 10px 10px 10px;">
                    <table class="light-gray-table" cellpadding="0" cellspacing="0" border="0" v-if="relationTableEditorView.isShowTableEditDetail">
                        <colgroup>
                            <col style="width: 17%" />
                            <col style="width: 33%" />
                            <col style="width: 15%" />
                            <col style="width: 35%" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td class="label">SingleName：</td>
                                <td>
                                    <i-input v-model="currentEditorData.singleName" size="small" placeholder="本关联中的唯一名称,可以为空" />
                                </td>
                                <td class="label">PKKey：</td>
                                <td>
                                    <i-select placeholder="默认使用Id字段" v-model="currentEditorData.pkFieldName" size="small" style="width:199px">
                                        <i-option v-for="item in relationTableEditorView.selPKData" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>
                                    </i-select>
                                </td>
                            </tr>
                            <tr v-if="relationTableEditorView.isSubEditTr">
                                <td class="label">数据关系：</td>
                                <td>
                                    <radio-group v-model="currentEditorData.relationType" type="button" size="small">
                                        <radio label="1To1">1:1</radio>
                                        <radio label="1ToN">1:N</radio>
                                    </radio-group>
                                </td>
                                <td class="label">是否保存：</td>
                                <td>
                                    <radio-group v-model="currentEditorData.isSave" type="button" size="small">
                                        <radio label="true">是</radio>
                                        <radio label="false">否</radio>
                                    </radio-group>
                                </td>
                            </tr>
                            <tr v-if="relationTableEditorView.isSubEditTr">
                                <td class="label">本身关联字段：</td>
                                <td>
                                     <i-select placeholder="默认使用Id字段" v-model="currentEditorData.selfKeyFieldName" size="small" style="width:199px">
                                        <i-option v-for="item in relationTableEditorView.selSelfKeyData" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>
                                    </i-select>
                                </td>
                                <td class="label">外联字段：</td>
                                <td>
                                     <i-select placeholder="默认使用Id字段" v-model="currentEditorData.outerKeyFieldName" size="small" style="width:199px">
                                        <i-option v-for="item in relationTableEditorView.selPKData" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>
                                    </i-select>
                                </td>
                            </tr>
                            <tr>
                                <td class="label">Desc：</td>
                                <td colspan="3">
                                    <i-input v-model="currentEditorData.desc" size="small" placeholder="说明" />
                                </td>
                            </tr>
                            <tr>
                                <td class="label">加载条件：</td>
                                <td colspan="3">
                                    <sql-general-design-comp ref="sqlGeneralDesignComp" :sqlDesignerHeight="74" v-model="currentEditorData.condition"></sql-general-design-comp>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="divSelectTable" title="请选择表" style="display: none">
                    <i-input search class="input_border_bottom" ref="txt_table_search_text" placeholder="请输入表名或者标题">
                        <i-select v-model="selectTableTree.oldSelectedDBLinkId" slot="prepend" style="width: 280px" @on-change="changeDBLink" :disabled="selectTableTree.disabledDBLink">
                            <i-option :value="item.dbId" v-for="item in selectTableTree.dbLinkEntities">{{item.dbLinkName}}</i-option>
                        </i-select>
                    </i-input>
                    <ul id="selectTableZTreeUL" class="ztree" style="height: 500px;overflow-y:scroll;overflow-x:hidden"></ul>
                </div>
              </div>`
});
