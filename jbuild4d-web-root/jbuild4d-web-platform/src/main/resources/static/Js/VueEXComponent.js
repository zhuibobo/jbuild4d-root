"use strict";

Vue.component("db-table-relation-comp", {
  data: function data() {
    return {
      acInterface: {
        getTablesDataUrl: "/PlatForm/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
        getTableFieldsUrl: "/PlatForm/Builder/DataStorage/DataBase/Table/GetTableFieldsByTableId"
      },
      relationTableTree: {
        treeObj: null,
        tableTreeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          data: {
            key: {
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
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
      emptyEditorData: {
        id: "",
        parentId: "",
        singleName: "",
        pkFieldName: "",
        desc: "",
        selfKeyFieldName: "",
        outerKeyFieldName: "",
        relationType: "1ToN",
        isSave: "true",
        condition: "",
        tableId: "",
        tableName: "",
        tableCaption: ""
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
        condition: "",
        tableId: "",
        tableName: "",
        tableCaption: ""
      },
      selectTableTree: {
        tableTreeObj: null,
        tableTreeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
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
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              if (treeNode.nodeTypeName == "Table") {
                var _self = window._dbtablerelationcomp;
                $("#divSelectTable").dialog("close");

                _self.addTableToRelationTableTree(treeNode);
              }
            }
          }
        },
        tableTreeData: null,
        selectedTableName: "无"
      },
      tempDataStore: {},
      resultData: []
    };
  },
  mounted: function mounted() {
    this.bindSelectTableTree();
    this.relationTableTree.treeObj = $.fn.zTree.init($("#dataRelationZTreeUL"), this.relationTableTree.tableTreeSetting, this.relationTableTree.tableTreeRootData);
    this.relationTableTree.treeObj.expandAll(true);
    this.relationTableTree.currentSelectedNode = this.relationTableTree.treeObj.getNodeByParam("id", "-1");
    window._dbtablerelationcomp = this;
  },
  watch: {
    currentEditorData: {
      handler: function handler(val, oldVal) {
        for (var i = 0; i < this.resultData.length; i++) {
          if (this.resultData[i].id == val.id) {
            this.resultItemCopyEditEnableValue(this.resultData[i], val);
          }
        }
      },
      deep: true
    }
  },
  methods: {
    resultItemCopyEditEnableValue: function resultItemCopyEditEnableValue(toObj, fromObj) {
      toObj.singleName = fromObj.singleName;
      toObj.pkFieldName = fromObj.pkFieldName;
      toObj.desc = fromObj.desc;
      toObj.selfKeyFieldName = fromObj.selfKeyFieldName;
      toObj.outerKeyFieldName = fromObj.outerKeyFieldName;
      toObj.relationType = fromObj.relationType;
      toObj.isSave = fromObj.isSave;
      toObj.condition = fromObj.condition;
    },
    getTableFieldsByTableId: function getTableFieldsByTableId(tableId) {
      if (tableId == "-1") {
        return null;
      }

      if (this.tempDataStore["tableField_" + tableId]) {
        return this.tempDataStore["tableField_" + tableId];
      } else {
        var _self = this;

        AjaxUtility.PostSync(this.acInterface.getTableFieldsUrl, {
          tableId: tableId
        }, function (result) {
          if (result.success) {
            _self.tempDataStore["tableField_" + tableId] = result.data;
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
          }
        }, "json");
      }

      if (this.tempDataStore["tableField_" + tableId]) {
        return this.tempDataStore["tableField_" + tableId];
      } else {
        return null;
      }
    },
    getEmptyResultItem: function getEmptyResultItem() {
      return JsonUtility.CloneSimple(this.emptyEditorData);
    },
    getExistResultItem: function getExistResultItem(id) {
      for (var i = 0; i < this.resultData.length; i++) {
        if (this.resultData[i].id == id) {
          return this.resultData[i];
        }
      }

      return null;
    },
    bindSelectTableTree: function bindSelectTableTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getTablesDataUrl, {}, function (result) {
        if (result.success) {
          _self.selectTableTree.tableTreeData = result.data;
          _self.selectTableTree.tableTreeObj = $.fn.zTree.init($("#selectTableZTreeUL"), _self.selectTableTree.tableTreeSetting, _self.selectTableTree.tableTreeData);

          _self.selectTableTree.tableTreeObj.expandAll(true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    deleteSelectedRelationTreeNode: function deleteSelectedRelationTreeNode() {
      if (this.relationTableTree.currentSelectedNode) {
        if (!this.isSelectedRootRelationTableNode()) {
          if (!this.relationTableTree.currentSelectedNode.isParent) {
            for (var i = 0; i < this.resultData.length; i++) {
              if (this.resultData[i].id == this.relationTableTree.currentSelectedNode.id) {
                this.resultData.splice(i, 1);
                break;
              }
            }

            this.resultItemCopyEditEnableValue(this.currentEditorData, this.emptyEditorData);
            this.currentEditorData.id = "";
            this.currentEditorData.parentId = "";
            this.$refs.sqlGeneralDesignComp.setValue("");
            this.relationTableEditorView.selPKData = [];
            this.relationTableEditorView.selSelfKeyData = [];
            this.relationTableEditorView.selForeignKeyData = [];
            this.relationTableEditorView.isShowTableEditDetail = false;
            this.relationTableTree.treeObj.removeNode(this.relationTableTree.currentSelectedNode, false);
            this.relationTableTree.currentSelectedNode = null;
          } else {
            DialogUtility.AlertText("不能删除父节点!");
          }
        } else {
          DialogUtility.AlertText("不能删除根节点!");
        }
      } else {
        DialogUtility.AlertText("请选择要删除的节点!");
      }
    },
    beginSelectTableToRelationTable: function beginSelectTableToRelationTable() {
      if (this.relationTableTree.currentSelectedNode) {
        $("#divSelectTable").dialog({
          modal: true,
          height: 600,
          width: 500
        });
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "选择一个父节点!", null);
      }
    },
    buildRelationTableNode: function buildRelationTableNode(sourceNode) {
      if (this.relationTableTree.currentSelectedNode._nodeExType == "root") {
        sourceNode._nodeExType = "MainNode";
        sourceNode.icon = "../../../Themes/Png16X16/page_key.png";
      } else {
        sourceNode._nodeExType = "SubNode";
        sourceNode.icon = "../../../Themes/Png16X16/page_refresh.png";
      }

      sourceNode.tableId = sourceNode.id;
      sourceNode.id = StringUtility.Guid();
      return sourceNode;
    },
    getMainRelationTableNode: function getMainRelationTableNode() {
      var node = this.relationTableTree.treeObj.getNodeByParam("_nodeExType", "MainNode");

      if (node) {
        return node;
      }

      return null;
    },
    getMainTableId: function getMainTableId() {
      return this.getMainRelationTableNode() ? this.getMainRelationTableNode().tableId : "";
    },
    getMainTableName: function getMainTableName() {
      return this.getMainRelationTableNode() ? this.getMainRelationTableNode().value : "";
    },
    getMainTableCaption: function getMainTableCaption() {
      return this.getMainRelationTableNode() ? this.getMainRelationTableNode().attr1 : "";
    },
    isSelectedRootRelationTableNode: function isSelectedRootRelationTableNode() {
      return this.relationTableTree.currentSelectedNode.id == "-1";
    },
    isSelectedMainRelationTableNode: function isSelectedMainRelationTableNode() {
      return this.relationTableTree.currentSelectedNode._nodeExType == "MainNode";
    },
    addTableToRelationTableTree: function addTableToRelationTableTree(newNode) {
      newNode = this.buildRelationTableNode(newNode);
      var tempNode = this.getMainRelationTableNode();

      if (tempNode != null) {
        if (this.isSelectedRootRelationTableNode()) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "只允许存在一个主记录!", null);
          return;
        }
      }

      this.relationTableTree.treeObj.addNodes(this.relationTableTree.currentSelectedNode, -1, newNode, false);
      var newResultItem = this.getEmptyResultItem();
      newResultItem.id = newNode.id;
      newResultItem.parentId = this.relationTableTree.currentSelectedNode.id;
      newResultItem.tableId = newNode.tableId;
      newResultItem.tableName = newNode.value;
      newResultItem.tableCaption = newNode.attr1;
      this.resultData.push(newResultItem);
    },
    selectedRelationTableNode: function selectedRelationTableNode(node) {
      this.relationTableTree.currentSelectedNode = node;
      this.relationTableEditorView.isShowTableEditDetail = !this.isSelectedRootRelationTableNode();
      this.relationTableEditorView.isMainEditTr = this.isSelectedMainRelationTableNode();
      this.relationTableEditorView.isSubEditTr = !this.isSelectedMainRelationTableNode();

      if (this.isSelectedRootRelationTableNode()) {
        return;
      }

      this.relationTableEditorView.selPKData = this.getTableFieldsByTableId(node.tableId) != null ? this.getTableFieldsByTableId(node.tableId) : [];
      this.relationTableEditorView.selSelfKeyData = this.getTableFieldsByTableId(node.tableId) != null ? this.getTableFieldsByTableId(node.tableId) : [];
      var parentNode = node.getParentNode();
      this.relationTableEditorView.selForeignKeyData = this.getTableFieldsByTableId(parentNode.tableId) != null ? this.getTableFieldsByTableId(parentNode.tableId) : [];
      this.currentEditorData.id = this.relationTableTree.currentSelectedNode.id;
      this.currentEditorData.parentId = parentNode.id;
      var existResultItem = this.getExistResultItem(node.id);

      if (existResultItem != null) {
        this.resultItemCopyEditEnableValue(this.currentEditorData, existResultItem);

        var _self = this;

        window.setTimeout(function () {
          _self.$refs.sqlGeneralDesignComp.setValue(_self.currentEditorData.condition);

          _self.$refs.sqlGeneralDesignComp.setAboutTableFields(_self.relationTableEditorView.selSelfKeyData, _self.relationTableEditorView.selForeignKeyData);
        }, 300);
      } else {
        alert("通过getExistResultItem获取不到数据!");
      }
    },
    getResultData: function getResultData() {
      return this.resultData;
    },
    serializeRelation: function serializeRelation(isFormat) {
      alert("serializeRelation已经停用");
      return;

      if (isFormat) {
        return JsonUtility.JsonToStringFormat(this.resultData);
      }

      return JsonUtility.JsonToString(this.resultData);
    },
    deserializeRelation: function deserializeRelation(jsonString) {
      alert("deserializeRelation已经停用");
      return;
    },
    getValue: function getValue() {
      var result = {
        mainTableId: this.getMainTableId(),
        mainTableName: this.getMainTableName(),
        mainTableCaption: this.getMainTableCaption(),
        relationData: this.resultData
      };
      return result;
    },
    setValue: function setValue(jsonString) {
      var tempData = JsonUtility.StringToJson(jsonString);
      this.resultData = tempData;

      for (var i = 0; i < tempData.length; i++) {
        tempData[i].value = tempData[i].tableName;
        tempData[i].attr1 = tempData[i].tableCaption;
        tempData[i].text = tempData[i].tableCaption + "【" + tempData[i].tableName + "】";
      }

      tempData.push(this.relationTableTree.tableTreeRootData);
      this.relationTableTree.treeObj = $.fn.zTree.init($("#dataRelationZTreeUL"), this.relationTableTree.tableTreeSetting, tempData);
      this.relationTableTree.treeObj.expandAll(true);
    },
    alertSerializeRelation: function alertSerializeRelation() {
      DialogUtility.AlertJsonCode(this.resultData);
    },
    inputDeserializeRelation: function inputDeserializeRelation() {
      DialogUtility.Prompt(window, {
        width: 900,
        height: 600
      }, DialogUtility.DialogPromptId, "请贴入数据关联Json设置字符串", function (jsonString) {
        try {
          window._dbtablerelationcomp.deserializeRelation(jsonString);
        } catch (e) {
          alert("反序列化失败:" + e);
        }
      });
    }
  },
  template: '<div class="db-table-relation-comp">\
                <divider orientation="left" :dashed="true" style="font-size: 12px">数据关系关联设置</divider>\
                <div style="float: left;width: 350px;height: 330px;border: #ddddf1 1px solid;border-radius: 4px;padding: 10px 10px 10px 10px;">\
                    <button-group shape="circle" style="margin: auto">\
                        <i-button type="success" @click="beginSelectTableToRelationTable">&nbsp;添加&nbsp;</i-button>\
                        <i-button @click="deleteSelectedRelationTreeNode">&nbsp;删除&nbsp;</i-button>\
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
                                <td class="label">Desc：</td>\
                                <td colspan="3">\
                                    <i-input v-model="currentEditorData.desc" size="small" placeholder="说明" />\
                                </td>\
                            </tr>\
                            <tr>\
                                <td class="label">加载条件：</td>\
                                <td colspan="3">\
                                    <sql-general-design-comp ref="sqlGeneralDesignComp" :sqlDesignerHeight="74" v-model="currentEditorData.condition"></sql-general-design-comp>\
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
"use strict";

Vue.component("design-html-elem-list", {
  data: function data() {
    return {};
  },
  mounted: function mounted() {},
  methods: {},
  template: '<div class="design-html-elem-list-wrap">\
            <div class="design-html-elem-list-item">格式化</div>\
            <div class="design-html-elem-list-item">说明</div>\
        </div>'
});
"use strict";

Vue.component("fd-control-base-info", {
  props: ["value"],
  data: function data() {
    return {
      baseInfo: {
        id: "",
        serialize: "",
        name: "",
        className: "",
        placeholder: "",
        readonly: "",
        disabled: "",
        style: "",
        desc: ""
      }
    };
  },
  watch: {
    baseInfo: function baseInfo(newVal) {
      this.$emit('input', newVal);
    },
    value: function value(newVal) {
      this.baseInfo = newVal;
    }
  },
  mounted: function mounted() {
    this.baseInfo = this.value;
  },
  methods: {},
  template: '<table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">' + '<colgroup>' + '<col style="width: 100px" />' + '<col style="width: 280px" />' + '<col style="width: 90px" />' + '<col style="width: 110px" />' + '<col style="width: 90px" />' + '<col />' + '</colgroup>' + '<tr>' + '<td>ID：</td>' + '<td>' + '<input type="text" v-model="baseInfo.id" />' + '</td>' + '<td>Serialize：</td>' + '<td colspan="3">' + '<radio-group type="button" style="margin: auto" v-model="baseInfo.serialize">' + '<radio label="true">是</radio>' + '<radio label="false">否</radio>' + '</radio-group>' + '</td>' + '</tr>' + '<tr>' + '<td>Name：</td>' + '<td><input type="text" v-model="baseInfo.name" /></td>' + '<td>ClassName：</td>' + '<td colspan="3"><input type="text" v-model="baseInfo.className" /></td>' + '</tr>' + '<tr>' + '<td>Placeholder</td>' + '<td><input type="text" v-model="baseInfo.placeholder" /></td>' + '<td>Readonly：</td>' + '<td style="text-align: center">' + '<radio-group type="button" style="margin: auto" v-model="baseInfo.readonly">' + '<radio label="readonly">是</radio>' + '<radio label="noreadonly">否</radio>' + '</radio-group>' + '</td>' + '<td>Disabled：</td>' + '<td style="text-align: center">' + '<radio-group type="button" style="margin: auto" v-model="baseInfo.disabled">' + '<radio label="disabled">是</radio>' + '<radio label="nodisabled">否</radio>' + '</radio-group>' + '</td>' + '</tr>' + '<tr>' + '<td>样式：</td>' + '<td colspan="5">' + '<textarea rows="7" v-model="baseInfo.style"></textarea>' + '</td>' + '</tr>' + '<tr>' + '<td>备注：</td>' + '<td colspan="5">' + '<textarea rows="8" v-model="baseInfo.desc"></textarea>' + '</td>' + '</tr>' + '</table>'
});
"use strict";

Vue.component("fd-control-bind-to", {
  props: ["bindToFieldProp", "defaultValueProp", "validateRulesProp"],
  data: function data() {
    return {
      bindToField: {
        tableId: "",
        tableName: "",
        tableCaption: "",
        fieldName: "",
        fieldCaption: "",
        fieldDataType: "",
        fieldLength: ""
      },
      validateRules: {
        msg: "",
        rules: []
      },
      defaultValue: {
        defaultType: "",
        defaultValue: "",
        defaultText: ""
      },
      tempData: {
        defaultDisplayText: ""
      }
    };
  },
  watch: {
    bindToProp: function bindToProp(newValue) {
      console.log(newValue);
    },
    bindToFieldProp: function bindToFieldProp(newValue) {
      this.bindToField = newValue;
    },
    defaultValueProp: function defaultValueProp(newValue) {
      this.defaultValue = newValue;

      if (!StringUtility.IsNullOrEmpty(this.defaultValue.defaultType)) {
        this.tempData.defaultDisplayText = JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
      }
    },
    validateRulesProp: function validateRulesProp(newValue) {
      this.validateRules = newValue;
    }
  },
  mounted: function mounted() {
    this.bindToField = this.bindToFieldProp;
  },
  methods: {
    setCompleted: function setCompleted() {
      this.$emit('on-set-completed', this.bindToField, this.defaultValue, this.validateRules);
    },
    selectBindFieldView: function selectBindFieldView() {
      JBuild4DSelectView.SelectBindToField.beginSelectInFrame(window, "_SelectBindObj", {});
      window._SelectBindObj = this;
    },
    setSelectFieldResultValue: function setSelectFieldResultValue(result) {
      this.bindToField = {};

      if (result != null) {
        this.bindToField.fieldName = result.fieldName;
        this.bindToField.tableId = result.tableId;
        this.bindToField.tableName = result.tableName;
        this.bindToField.tableCaption = result.tableCaption;
        this.bindToField.fieldCaption = result.fieldCaption;
        this.bindToField.fieldDataType = result.fieldDataType;
        this.bindToField.fieldLength = result.fieldLength;
      } else {
        this.bindToField.fieldName = "";
        this.bindToField.tableId = "";
        this.bindToField.tableName = "";
        this.bindToField.tableCaption = "";
        this.bindToField.fieldCaption = "";
        this.bindToField.fieldDataType = "";
        this.bindToField.fieldLength = "";
      }

      this.setCompleted();
    },
    getSelectFieldResultValue: function getSelectFieldResultValue() {
      return JsonUtility.CloneSimple(this.bindToField);
    },
    selectDefaultValueView: function selectDefaultValueView() {
      JBuild4DSelectView.SelectEnvVariable.beginSelectInFrame(window, "_SelectBindObj", {});
      window._SelectBindObj = this;
    },
    setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(result) {
      if (result != null) {
        this.defaultValue.defaultType = result.Type;
        this.defaultValue.defaultValue = result.Value;
        this.defaultValue.defaultText = result.Text;
        this.tempData.defaultDisplayText = JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
      } else {
        this.defaultValue.defaultType = "";
        this.defaultValue.defaultValue = "";
        this.defaultValue.defaultText = "";
        this.tempData.defaultDisplayText = "";
      }

      this.setCompleted();
    },
    selectValidateRuleView: function selectValidateRuleView() {
      JBuild4DSelectView.SelectValidateRule.beginSelectInFrame(window, "_SelectBindObj", {});
      window._SelectBindObj = this;
    },
    setSelectValidateRuleResultValue: function setSelectValidateRuleResultValue(result) {
      if (result != null) {
        this.validateRules = result;
        this.setCompleted();
      } else {
        this.validateRules.msg = "";
        this.validateRules.rules = [];
      }
    },
    getSelectValidateRuleResultValue: function getSelectValidateRuleResultValue() {
      return this.validateRules;
    }
  },
  template: '<table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">' + '<colgroup>' + '<col style="width: 100px" />' + '<col style="width: 280px" />' + '<col style="width: 100px" />' + '<col />' + '</colgroup>' + '<tr>' + '<td colspan="4">' + '    绑定到表<button class="btn-select fright" v-on:click="selectBindFieldView">...</button>' + '</td>' + '</tr>' + '<tr>' + '<td>表编号：</td>' + '<td colspan="3">{{bindToField.tableId}}</td>' + '</tr>' + '<tr>' + '<td>表名：</td>' + '<td>{{bindToField.tableName}}</td>' + '<td>表标题：</td>' + '<td>{{bindToField.tableCaption}}</td>' + '</tr>' + '<tr>' + '<td>字段名：</td>' + '<td>{{bindToField.fieldName}}</td>' + '<td>字段标题：</td>' + '<td>{{bindToField.fieldCaption}}</td>' + '</tr>' + '<tr>' + '<td>类型：</td>' + '<td>{{bindToField.fieldDataType}}</td>' + '<td>长度：</td>' + '<td>{{bindToField.fieldLength}}</td>' + '</tr>' + '<tr>' + '<td colspan="4">默认值<button class="btn-select fright" v-on:click="selectDefaultValueView">...</button></td>' + '</tr>' + '<tr style="height: 35px">' + '<td colspan="4" style="background-color: #ffffff;">' + '{{tempData.defaultDisplayText}}' + '</td>' + '</tr>' + '<tr>' + '<td colspan="4">' + '    校验规则<button class="btn-select fright" v-on:click="selectValidateRuleView">...</button>' + '</td>' + '</tr>' + '<tr>' + '<td colspan="4" style="background-color: #ffffff">' + '<table class="html-design-plugin-dialog-table-wraper">' + '<colgroup>' + '<col style="width: 100px" />' + '<col />' + '</colgroup>' + '<tr>' + '<td style="text-align: center;">提示消息：</td>' + '<td>{{validateRules.msg}}</td>' + '</tr>' + '<tr>' + '<td style="text-align: center;">验证类型</td>' + '<td style="background: #e8eaec;text-align: center;">参数</td>' + '</tr>' + '<tr v-for="ruleItem in validateRules.rules">' + '<td style="background: #ffffff;text-align: center;color: #ad9361">{{ruleItem.validateType}}</td>' + '<td style="background: #ffffff;text-align: center;"><p v-if="ruleItem.validateParas === \'\'">无参数</p><p v-else>{{ruleItem.validateParas}}</p></td>' + '</tr>' + '</table>' + '</td>' + '</tr>' + '</table>'
});
"use strict";

Vue.component("js-design-code-fragment", {
  data: function data() {
    return {
      jsEditorInstance: null
    };
  },
  mounted: function mounted() {},
  methods: {
    setJSEditorInstance: function setJSEditorInstance(obj) {
      this.jsEditorInstance = obj;
    },
    getJsEditorInst: function getJsEditorInst() {
      return this.jsEditorInstance;
    },
    insertJs: function insertJs(js) {
      var doc = this.getJsEditorInst().getDoc();
      var cursor = doc.getCursor();
      doc.replaceRange(js, cursor);
    },
    formatJS: function formatJS() {
      CodeMirror.commands["selectAll"](this.getJsEditorInst());
      var range = {
        from: this.getJsEditorInst().getCursor(true),
        to: this.getJsEditorInst().getCursor(false)
      };
      ;
      this.getJsEditorInst().autoFormatRange(range.from, range.to);
    },
    alertDesc: function alertDesc() {},
    refScript: function refScript() {
      var js = "<script type=\"text/javascript\" src=\"${contextPath}/UIComponent/TreeTable/Js/TreeTable.js\"></script>";
      this.insertJs(js);
    },
    callServiceMethod: function callServiceMethod() {}
  },
  template: '<div class="js-code-fragment-wrap">\
            <div class="js-code-fragment-item" @click="formatJS">格式化</div>\
            <div class="js-code-fragment-item">说明</div>\
            <div class="js-code-fragment-item" @click="refScript">引入脚本</div>\
            <div class="js-code-fragment-item">获取URL参数</div>\
            <div class="js-code-fragment-item">调用服务方法</div>\
            <div class="js-code-fragment-item">加载数据字典</div>\
        </div>'
});
"use strict";
"use strict";
"use strict";
"use strict";

window.addEventListener("message", function (event) {
  DialogUtility.CloseDialog("FrameDialogEle" + DialogUtility.DialogId);
}, false);
Vue.component("module-list-flow-comp", {
  props: ['listHeight', 'moduleData', 'activeTabName'],
  data: function data() {
    return {
      acInterface: {
        saveModel: "/PlatForm/Builder/FlowModel/SaveModel",
        getEditModelURL: "/PlatForm/Builder/FlowModel/GetEditModelURL",
        reloadData: "/PlatForm/Builder/FlowModel/GetListData",
        getSingleData: "/PlatForm/Builder/FlowModel/GetDetailData",
        delete: "/PlatForm/Builder/FlowModel/DeleteModel",
        move: "/PlatForm/Builder/FlowModel/Move"
      },
      idFieldName: "modelId",
      searchCondition: {
        modelModuleId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      columnsConfig: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '编号',
        key: 'modelCode',
        align: "center",
        width: 80
      }, {
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
        render: function render(h, params) {
          return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.modelUpdateTime);
        }
      }, {
        title: '操作',
        key: 'modelId',
        width: 120,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            class: "list-row-button-wrap"
          }, [window._modulelistflowcomp.editModelButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp), ListPageUtility.IViewTableInnerButton.EditButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp), ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp)]);
        }
      }],
      tableData: [],
      tableDataOriginal: [],
      selectionRows: null,
      pageTotal: 0,
      pageSize: 500,
      pageNum: 1,
      searchText: "",
      flowModelEntity: {
        modelId: "",
        modelDeId: "",
        modelModuleId: "",
        modelGroupId: "",
        modelName: "",
        modelCreateTime: DateUtility.GetCurrentData(),
        modelCreater: "",
        modelUpdateTime: DateUtility.GetCurrentData(),
        modelUpdater: "",
        modelDesc: "",
        modelStatus: "启用",
        modelOrderNum: "",
        modelDeploymentId: "",
        modelStartKey: "",
        modelResourceName: "",
        modelFromType: ""
      },
      emptyFlowModelEntity: {},
      importEXData: {
        modelModuleId: ""
      },
      ruleValidate: {
        modelName: [{
          required: true,
          message: '【模型名称】不能空！',
          trigger: 'blur'
        }],
        modelStartKey: [{
          required: true,
          message: '【模型Key】不能空！',
          trigger: 'blur'
        }]
      }
    };
  },
  mounted: function mounted() {
    this.reloadData();
    window._modulelistflowcomp = this;

    for (var key in this.flowModelEntity) {
      this.emptyFlowModelEntity[key] = this.flowModelEntity[key];
    }
  },
  watch: {
    moduleData: function moduleData(newVal) {
      this.reloadData();
    },
    activeTabName: function activeTabName(newVal) {
      this.reloadData();
    },
    searchText: function searchText(newVal) {
      if (newVal) {
        var filterTableData = [];

        for (var i = 0; i < this.tableData.length; i++) {
          var row = this.tableData[i];

          if (row.modelCode.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          } else if (row.modelName.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          }
        }

        this.tableData = filterTableData;
      } else {
        this.tableData = this.tableDataOriginal;
      }
    }
  },
  methods: {
    handleClose: function handleClose(dialogId) {
      DialogUtility.CloseDialog(dialogId);
    },
    getModuleName: function getModuleName() {
      return this.moduleData == null ? "请选中模块" : this.moduleData.moduleText;
    },
    statusEnable: function statusEnable(statusName) {
      ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
    },
    move: function move(type) {
      ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
    },
    selectionChange: function selectionChange(selection) {
      this.selectionRows = selection;
    },
    reloadData: function reloadData() {
      if (this.moduleData != null && this.activeTabName == "list-flow") {
        this.searchCondition.modelModuleId.value = this.moduleData.moduleId;
        ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadData, this.pageNum, this.pageSize, this.searchCondition, this, this.idFieldName, true, function (result, pageAppObj) {
          pageAppObj.tableDataOriginal = result.data.list;
        }, false);
      }
    },
    add: function add() {
      if (this.moduleData != null) {
        DetailPageUtility.OverrideObjectValueFull(this.flowModelEntity, this.emptyFlowModelEntity);
        DialogUtility.DialogElem("divNewFlowModelWrap", {
          modal: true,
          width: 600,
          height: 500,
          title: "创建流程模型"
        });
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
      }
    },
    edit: function edit(recordId) {
      var _self = this;

      _self.$refs["flowModelEntity"].resetFields();

      AjaxUtility.Post(this.acInterface.getSingleData, {
        recordId: recordId,
        op: "edit"
      }, function (result) {
        if (result.success) {
          DetailPageUtility.OverrideObjectValueFull(_self.flowModelEntity, result.data);
          DialogUtility.DialogElem("divNewFlowModelWrap", {
            modal: true,
            width: 600,
            height: 500,
            title: "编辑流程模型概况"
          });
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    del: function del(recordId) {
      ListPageUtility.IViewTableDeleteRow(this.acInterface.delete, recordId, this);
    },
    handleSubmitFlowModelEdit: function handleSubmitFlowModelEdit(name) {
      var _self = this;

      this.$refs[name].validate(function (valid) {
        if (valid) {
          _self.flowModelEntity.modelModuleId = _self.moduleData.moduleId;

          var _designModel = _self.flowModelEntity.modelId == "" ? true : false;

          var sendData = JSON.stringify(_self.flowModelEntity);
          AjaxUtility.PostRequestBody(_self.acInterface.saveModel, sendData, function (result) {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
              _self.handleClose("divNewFlowModelWrap");

              _self.reloadData();

              if (_designModel) {
                DialogUtility.OpenNewWindow(window, "editModelWebWindow", result.data.editModelWebUrl);
              }
            });
          }, "json");
        } else {
          this.$Message.error('Fail!');
        }
      });
    },
    importModel: function importModel() {
      if (this.moduleData != null) {
        DetailPageUtility.OverrideObjectValueFull(this.flowModelEntity, this.emptyFlowModelEntity);
        DialogUtility.DialogElem("divImportFlowModelWrap", {
          modal: true,
          width: 600,
          height: 300,
          title: "导入流程模型"
        });
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
      }
    },
    uploadSuccess: function uploadSuccess(response, file, fileList) {
      DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, response.message, null);

      if (response.success == true) {
        this.handleClose('divImportFlowModelWrap');
        this.reloadData();
      }
    },
    bindUploadExData: function bindUploadExData() {
      this.importEXData.modelModuleId = this.moduleData.moduleId;
    },
    editModelButton: function editModelButton(h, params, idField, pageAppObj) {
      return h('div', {
        class: "list-row-button edit-model",
        on: {
          click: function click() {
            pageAppObj.editModel(params.row[idField]);
          }
        }
      });
    },
    editModel: function editModel(recordId) {
      AjaxUtility.Post(this.acInterface.getEditModelURL, {
        modelId: recordId
      }, function (result) {
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, result.data.editModelWebUrl, {
          title: "流程设计",
          modal: true
        }, 0);
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
                    <div style="display: none" id="divImportFlowModelWrap">\
                        <div class="general-edit-page-wrap" style="padding: 10px">\
                            <upload :data="importEXData" :before-upload="bindUploadExData" :on-success="uploadSuccess" multiple type="drag" name="file" action="../../../PlatForm/Builder/FlowModel/ImportProcessModel.do" accept=".bpmn">\
                                <div style="padding: 20px 0">\
                                    <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>\
                                    <p>Click or drag files here to upload</p>\
                                </div>\
                            </upload>\
                            <div class="button-outer-wrap" style="height: 40px;padding-right: 10px">\
                                <div class="button-inner-wrap">\
                                    <button-group>\
                                        <i-button @click="handleClose(\'divImportFlowModelWrap\')">关 闭</i-button>\
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
                                <i-button type="primary" @click="importModel()" icon="md-add">上传模型 </i-button>\
                                <i-button type="error" icon="md-albums" style="display: none">复制</i-button>\
                                <i-button type="error" icon="md-bookmarks" style="display: none">历史模型</i-button>\
                                <i-button type="error" icon="md-brush" style="display: none">复制ID</i-button>\
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
"use strict";
"use strict";

Vue.component("module-list-webform-comp", {
  props: ['listHeight', 'moduleData', 'activeTabName'],
  data: function data() {
    return {
      acInterface: {
        editView: "/PlatForm/Builder/Form/DetailView",
        reloadData: "/PlatForm/Builder/Form/GetListData",
        delete: "/PlatForm/Builder/Form/Delete",
        move: "/PlatForm/Builder/Form/Move"
      },
      idFieldName: "formId",
      searchCondition: {
        formModuleId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      columnsConfig: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '编号',
        key: 'formCode',
        align: "center",
        width: 80
      }, {
        title: '表单名称',
        key: 'formName',
        align: "center"
      }, {
        title: '唯一名',
        key: 'formSingleName',
        align: "center"
      }, {
        title: '备注',
        key: 'formDesc',
        align: "center"
      }, {
        title: '编辑时间',
        key: 'formUpdateTime',
        width: 100,
        align: "center",
        render: function render(h, params) {
          return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.formUpdateTime);
        }
      }, {
        title: '操作',
        key: 'formId',
        width: 120,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            class: "list-row-button-wrap"
          }, [ListPageUtility.IViewTableInnerButton.EditButton(h, params, window._modulelistwebformcomp.idFieldName, window._modulelistwebformcomp), ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, window._modulelistwebformcomp.idFieldName, window._modulelistwebformcomp)]);
        }
      }],
      tableData: [],
      tableDataOriginal: [],
      selectionRows: null,
      pageTotal: 0,
      pageSize: 500,
      pageNum: 1,
      searchText: ""
    };
  },
  mounted: function mounted() {
    window._modulelistwebformcomp = this;
  },
  watch: {
    moduleData: function moduleData(newVal) {
      this.reloadData();
    },
    activeTabName: function activeTabName(newVal) {
      this.reloadData();
    },
    searchText: function searchText(newVal) {
      if (newVal) {
        var filterTableData = [];

        for (var i = 0; i < this.tableData.length; i++) {
          var row = this.tableData[i];

          if (row.formCode.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          } else if (row.formName.indexOf(newVal) >= 0) {
            filterTableData.push(row);
          }
        }

        this.tableData = filterTableData;
      } else {
        this.tableData = this.tableDataOriginal;
      }
    }
  },
  methods: {
    selectionChange: function selectionChange(selection) {
      this.selectionRows = selection;
    },
    reloadData: function reloadData() {
      if (this.moduleData != null && this.activeTabName == "list-webform") {
        this.searchCondition.formModuleId.value = this.moduleData.moduleId;
        ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadData, this.pageNum, this.pageSize, this.searchCondition, this, this.idFieldName, true, function (result, pageAppObj) {
          pageAppObj.tableDataOriginal = result.data.list;
        }, false);
      }
    },
    add: function add() {
      if (this.moduleData != null) {
        var url = BaseUtility.BuildView(this.acInterface.editView, {
          "op": "add",
          "moduleId": this.moduleData.moduleId
        });
        DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {
          width: 0,
          height: 0
        }, 2);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择模块!", null);
      }
    },
    edit: function edit(recordId) {
      var url = BaseUtility.BuildView(this.acInterface.editView, {
        "op": "update",
        "recordId": recordId
      });
      DialogUtility.OpenNewWindow(window, DialogUtility.DialogId, url, {
        width: 0,
        height: 0
      }, 2);
    },
    del: function del(recordId) {
      ListPageUtility.IViewTableDeleteRow(this.acInterface.delete, recordId, this);
    },
    statusEnable: function statusEnable(statusName) {
      ListPageUtility.IViewChangeServerStatusFace(this.acInterface.statusChange, this.selectionRows, appList.idFieldName, statusName, appList);
    },
    move: function move(type) {
      ListPageUtility.IViewMoveFace(this.acInterface.move, this.selectionRows, this.idFieldName, type, this);
    }
  },
  template: '<div class="module-list-wrap">\
                    <div id="list-button-wrap" class="list-button-outer-wrap">\
                        <div class="list-button-inner-wrap">\
                            <ButtonGroup>\
                                <i-button  type="success" @click="add()" icon="md-add">新增</i-button>\
                                <i-button type="error" icon="md-add">引入URL </i-button>\
                                <i-button type="error" icon="md-albums">复制</i-button>\
                                <i-button type="error" icon="md-pricetag">预览</i-button>\
                                <i-button type="error" icon="md-bookmarks">历史版本</i-button>\
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
"use strict";
"use strict";

Vue.component("sql-general-design-comp", {
  props: ["sqlDesignerHeight", "value"],
  data: function data() {
    return {
      sqlText: "",
      selectedItemValue: "说明",
      selfTableFields: [],
      parentTableFields: []
    };
  },
  watch: {
    sqlText: function sqlText(newVal) {
      this.$emit('input', newVal);
    },
    value: function value(newVal) {
      this.sqlText = newVal;
    }
  },
  mounted: function mounted() {
    this.sqlCodeMirror = CodeMirror.fromTextArea($("#TextAreaSQLEditor")[0], {
      mode: "text/x-sql",
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      theme: "monokai"
    });
    this.sqlCodeMirror.setSize("100%", this.sqlDesignerHeight);

    var _self = this;

    this.sqlCodeMirror.on("change", function (cMirror) {
      console.log(cMirror.getValue());
      _self.sqlText = cMirror.getValue();
    });
  },
  methods: {
    getValue: function getValue() {
      this.sqlCodeMirror.getValue();
    },
    setValue: function setValue(value) {
      this.sqlCodeMirror.setValue(value);
    },
    setAboutTableFields: function setAboutTableFields(selfTableFields, parentTableFields) {
      this.selfTableFields = selfTableFields;
      this.parentTableFields = parentTableFields;
    },
    insertEnvToEditor: function insertEnvToEditor(code) {
      this.insertCodeAtCursor(code);
    },
    insertFieldToEditor: function insertFieldToEditor(sourceType, event) {
      var sourceFields = null;

      if (sourceType == "selfTableFields") {
        sourceFields = this.selfTableFields;
      } else {
        sourceFields = this.parentTableFields;
      }

      for (var i = 0; i < sourceFields.length; i++) {
        if (sourceFields[i].fieldName == event) {
          this.insertCodeAtCursor(sourceFields[i].tableName + "." + sourceFields[i].fieldName);
        }
      }
    },
    insertCodeAtCursor: function insertCodeAtCursor(code) {
      var doc = this.sqlCodeMirror.getDoc();
      var cursor = doc.getCursor();
      doc.replaceRange(code, cursor);
    }
  },
  template: '<div>\
                <textarea id="TextAreaSQLEditor"></textarea>\
                <div style="text-align: right;margin-top: 8px">\
                    <ButtonGroup size="small">\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户所在组织ID}\')">组织Id</Button>\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户所在组织名称}\')">组织名称</Button>\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户ID}\')">用户Id</Button>\
                        <Button @click="insertEnvToEditor(\'#{ApiVar.当前用户名称}\')">用户名称</Button>\
                        <Button @click="insertEnvToEditor(\'#{DateTime.年年年年-月月-日日}\')">yyyy-MM-dd</Button>\
                        <Button>说明</Button>\
                    </ButtonGroup>\
                </div>\
                <div style="margin-top: 8px">\
                    <div style="float: left;margin: 4px 10px">本表字段</div>\
                    <div style="float: left">\
                        <i-select placeholder="默认使用Id字段" size="small" style="width:175px" @on-change="insertFieldToEditor(\'selfTableFields\',$event)">\
                            <i-option v-for="item in selfTableFields" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>\
                        </i-select>\
                    </div>\
                    <div style="float: left;margin: 4px 10px">父表字段</div>\
                    <div style="float: left">\
                        <i-select placeholder="默认使用Id字段" size="small" style="width:177px" @on-change="insertFieldToEditor(\'parentTableFields\',$event)">\
                            <i-option v-for="item in parentTableFields" :value="item.fieldName" :key="item.fieldName">{{item.fieldCaption}}</i-option>\
                        </i-select>\
                    </div>\
                </div>\
              </div>'
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiLXRhYmxlLXJlbGF0aW9uLWNvbXAuanMiLCJkZXNpZ24taHRtbC1lbGVtLWxpc3QuanMiLCJmZC1jb250cm9sLWJhc2UtaW5mby5qcyIsImZkLWNvbnRyb2wtYmluZC10by5qcyIsImpzLWRlc2lnbi1jb2RlLWZyYWdtZW50LmpzIiwibW9kdWxlLWxpc3QtYWJvdXRjb25maWctY29tcC5qcyIsIm1vZHVsZS1saXN0LWFwcGZvcm0tY29tcC5qcyIsIm1vZHVsZS1saXN0LWFwcGxpc3QtY29tcC5qcyIsIm1vZHVsZS1saXN0LWZsb3ctY29tcC5qcyIsIm1vZHVsZS1saXN0LXJlcG9ydC1jb21wLmpzIiwibW9kdWxlLWxpc3Qtd2ViZm9ybS1jb21wLmpzIiwibW9kdWxlLWxpc3Qtd2VibGlzdC1jb21wLmpzIiwic3FsLWdlbmVyYWwtZGVzaWduLWNvbXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQ0FBO0FDQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25WQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEtBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVnVlRVhDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImRiLXRhYmxlLXJlbGF0aW9uLWNvbXBcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRUYWJsZXNEYXRhVXJsOiBcIi9QbGF0Rm9ybS9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZvclpUcmVlTm9kZUxpc3RcIixcbiAgICAgICAgZ2V0VGFibGVGaWVsZHNVcmw6IFwiL1BsYXRGb3JtL0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVGaWVsZHNCeVRhYmxlSWRcIlxuICAgICAgfSxcbiAgICAgIHJlbGF0aW9uVGFibGVUcmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRhYmxlVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB3aW5kb3cuX2RidGFibGVyZWxhdGlvbmNvbXA7XG5cbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWRSZWxhdGlvblRhYmxlTm9kZSh0cmVlTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVRyZWVSb290RGF0YToge1xuICAgICAgICAgIGlkOiBcIi0xXCIsXG4gICAgICAgICAgdGV4dDogXCLmlbDmja7lhbPogZRcIixcbiAgICAgICAgICBwYXJlbnRJZDogXCJcIixcbiAgICAgICAgICBub2RlVHlwZU5hbWU6IFwi5qC56IqC54K5XCIsXG4gICAgICAgICAgaWNvbjogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvY29pbnNfYWRkLnBuZ1wiLFxuICAgICAgICAgIF9ub2RlRXhUeXBlOiBcInJvb3RcIixcbiAgICAgICAgICB0YWJsZUlkOiBcIi0xXCJcbiAgICAgICAgfSxcbiAgICAgICAgY3VycmVudFNlbGVjdGVkTm9kZTogbnVsbFxuICAgICAgfSxcbiAgICAgIHJlbGF0aW9uVGFibGVFZGl0b3JWaWV3OiB7XG4gICAgICAgIGlzU2hvd1RhYmxlRWRpdERldGFpbDogZmFsc2UsXG4gICAgICAgIGlzU3ViRWRpdFRyOiBmYWxzZSxcbiAgICAgICAgaXNNYWluRWRpdFRyOiBmYWxzZSxcbiAgICAgICAgc2VsUEtEYXRhOiBbXSxcbiAgICAgICAgc2VsU2VsZktleURhdGE6IFtdLFxuICAgICAgICBzZWxGb3JlaWduS2V5RGF0YTogW11cbiAgICAgIH0sXG4gICAgICBlbXB0eUVkaXRvckRhdGE6IHtcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIHBhcmVudElkOiBcIlwiLFxuICAgICAgICBzaW5nbGVOYW1lOiBcIlwiLFxuICAgICAgICBwa0ZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgZGVzYzogXCJcIixcbiAgICAgICAgc2VsZktleUZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgb3V0ZXJLZXlGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIHJlbGF0aW9uVHlwZTogXCIxVG9OXCIsXG4gICAgICAgIGlzU2F2ZTogXCJ0cnVlXCIsXG4gICAgICAgIGNvbmRpdGlvbjogXCJcIixcbiAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgdGFibGVOYW1lOiBcIlwiLFxuICAgICAgICB0YWJsZUNhcHRpb246IFwiXCJcbiAgICAgIH0sXG4gICAgICBjdXJyZW50RWRpdG9yRGF0YToge1xuICAgICAgICBpZDogXCJcIixcbiAgICAgICAgcGFyZW50SWQ6IFwiXCIsXG4gICAgICAgIHNpbmdsZU5hbWU6IFwiXCIsXG4gICAgICAgIHBrRmllbGROYW1lOiBcIlwiLFxuICAgICAgICBkZXNjOiBcIlwiLFxuICAgICAgICBzZWxmS2V5RmllbGROYW1lOiBcIlwiLFxuICAgICAgICBvdXRlcktleUZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgcmVsYXRpb25UeXBlOiBcIjFUb05cIixcbiAgICAgICAgaXNTYXZlOiBcInRydWVcIixcbiAgICAgICAgY29uZGl0aW9uOiBcIlwiLFxuICAgICAgICB0YWJsZUlkOiBcIlwiLFxuICAgICAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIlxuICAgICAgfSxcbiAgICAgIHNlbGVjdFRhYmxlVHJlZToge1xuICAgICAgICB0YWJsZVRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRhYmxlVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgaWYgKHRyZWVOb2RlLm5vZGVUeXBlTmFtZSA9PSBcIlRhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB3aW5kb3cuX2RidGFibGVyZWxhdGlvbmNvbXA7XG4gICAgICAgICAgICAgICAgJChcIiNkaXZTZWxlY3RUYWJsZVwiKS5kaWFsb2coXCJjbG9zZVwiKTtcblxuICAgICAgICAgICAgICAgIF9zZWxmLmFkZFRhYmxlVG9SZWxhdGlvblRhYmxlVHJlZSh0cmVlTm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRhYmxlVHJlZURhdGE6IG51bGwsXG4gICAgICAgIHNlbGVjdGVkVGFibGVOYW1lOiBcIuaXoFwiXG4gICAgICB9LFxuICAgICAgdGVtcERhdGFTdG9yZToge30sXG4gICAgICByZXN1bHREYXRhOiBbXVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5iaW5kU2VsZWN0VGFibGVUcmVlKCk7XG4gICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjZGF0YVJlbGF0aW9uWlRyZWVVTFwiKSwgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50YWJsZVRyZWVTZXR0aW5nLCB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRhYmxlVHJlZVJvb3REYXRhKTtcbiAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSA9IHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5nZXROb2RlQnlQYXJhbShcImlkXCIsIFwiLTFcIik7XG4gICAgd2luZG93Ll9kYnRhYmxlcmVsYXRpb25jb21wID0gdGhpcztcbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBjdXJyZW50RWRpdG9yRGF0YToge1xuICAgICAgaGFuZGxlcjogZnVuY3Rpb24gaGFuZGxlcih2YWwsIG9sZFZhbCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVzdWx0RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLnJlc3VsdERhdGFbaV0uaWQgPT0gdmFsLmlkKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlKHRoaXMucmVzdWx0RGF0YVtpXSwgdmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWVwOiB0cnVlXG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgcmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWU6IGZ1bmN0aW9uIHJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlKHRvT2JqLCBmcm9tT2JqKSB7XG4gICAgICB0b09iai5zaW5nbGVOYW1lID0gZnJvbU9iai5zaW5nbGVOYW1lO1xuICAgICAgdG9PYmoucGtGaWVsZE5hbWUgPSBmcm9tT2JqLnBrRmllbGROYW1lO1xuICAgICAgdG9PYmouZGVzYyA9IGZyb21PYmouZGVzYztcbiAgICAgIHRvT2JqLnNlbGZLZXlGaWVsZE5hbWUgPSBmcm9tT2JqLnNlbGZLZXlGaWVsZE5hbWU7XG4gICAgICB0b09iai5vdXRlcktleUZpZWxkTmFtZSA9IGZyb21PYmoub3V0ZXJLZXlGaWVsZE5hbWU7XG4gICAgICB0b09iai5yZWxhdGlvblR5cGUgPSBmcm9tT2JqLnJlbGF0aW9uVHlwZTtcbiAgICAgIHRvT2JqLmlzU2F2ZSA9IGZyb21PYmouaXNTYXZlO1xuICAgICAgdG9PYmouY29uZGl0aW9uID0gZnJvbU9iai5jb25kaXRpb247XG4gICAgfSxcbiAgICBnZXRUYWJsZUZpZWxkc0J5VGFibGVJZDogZnVuY3Rpb24gZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQodGFibGVJZCkge1xuICAgICAgaWYgKHRhYmxlSWQgPT0gXCItMVwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50ZW1wRGF0YVN0b3JlW1widGFibGVGaWVsZF9cIiArIHRhYmxlSWRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBEYXRhU3RvcmVbXCJ0YWJsZUZpZWxkX1wiICsgdGFibGVJZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3RTeW5jKHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVGaWVsZHNVcmwsIHtcbiAgICAgICAgICB0YWJsZUlkOiB0YWJsZUlkXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIF9zZWxmLnRlbXBEYXRhU3RvcmVbXCJ0YWJsZUZpZWxkX1wiICsgdGFibGVJZF0gPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFwianNvblwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXSkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wRGF0YVN0b3JlW1widGFibGVGaWVsZF9cIiArIHRhYmxlSWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRFbXB0eVJlc3VsdEl0ZW06IGZ1bmN0aW9uIGdldEVtcHR5UmVzdWx0SXRlbSgpIHtcbiAgICAgIHJldHVybiBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZSh0aGlzLmVtcHR5RWRpdG9yRGF0YSk7XG4gICAgfSxcbiAgICBnZXRFeGlzdFJlc3VsdEl0ZW06IGZ1bmN0aW9uIGdldEV4aXN0UmVzdWx0SXRlbShpZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlc3VsdERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMucmVzdWx0RGF0YVtpXS5pZCA9PSBpZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlc3VsdERhdGFbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBiaW5kU2VsZWN0VGFibGVUcmVlOiBmdW5jdGlvbiBiaW5kU2VsZWN0VGFibGVUcmVlKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlc0RhdGFVcmwsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLnNlbGVjdFRhYmxlVHJlZS50YWJsZVRyZWVEYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI3NlbGVjdFRhYmxlWlRyZWVVTFwiKSwgX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZVNldHRpbmcsIF9zZWxmLnNlbGVjdFRhYmxlVHJlZS50YWJsZVRyZWVEYXRhKTtcblxuICAgICAgICAgIF9zZWxmLnNlbGVjdFRhYmxlVHJlZS50YWJsZVRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIGRlbGV0ZVNlbGVjdGVkUmVsYXRpb25UcmVlTm9kZTogZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWRSZWxhdGlvblRyZWVOb2RlKCkge1xuICAgICAgaWYgKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaXNQYXJlbnQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZXN1bHREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlc3VsdERhdGFbaV0uaWQgPT0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bHREYXRhLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlKHRoaXMuY3VycmVudEVkaXRvckRhdGEsIHRoaXMuZW1wdHlFZGl0b3JEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEVkaXRvckRhdGEuaWQgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RWRpdG9yRGF0YS5wYXJlbnRJZCA9IFwiXCI7XG4gICAgICAgICAgICB0aGlzLiRyZWZzLnNxbEdlbmVyYWxEZXNpZ25Db21wLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxQS0RhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsU2VsZktleURhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsRm9yZWlnbktleURhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTaG93VGFibGVFZGl0RGV0YWlsID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmoucmVtb3ZlTm9kZSh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5LiN6IO95Yig6Zmk54i26IqC54K5IVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLkuI3og73liKDpmaTmoLnoioLngrkhXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+mAieaLqeimgeWIoOmZpOeahOiKgueCuSFcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdFRhYmxlVG9SZWxhdGlvblRhYmxlOiBmdW5jdGlvbiBiZWdpblNlbGVjdFRhYmxlVG9SZWxhdGlvblRhYmxlKCkge1xuICAgICAgaWYgKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSkge1xuICAgICAgICAkKFwiI2RpdlNlbGVjdFRhYmxlXCIpLmRpYWxvZyh7XG4gICAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgICAgd2lkdGg6IDUwMFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIumAieaLqeS4gOS4queItuiKgueCuSFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZFJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBidWlsZFJlbGF0aW9uVGFibGVOb2RlKHNvdXJjZU5vZGUpIHtcbiAgICAgIGlmICh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuX25vZGVFeFR5cGUgPT0gXCJyb290XCIpIHtcbiAgICAgICAgc291cmNlTm9kZS5fbm9kZUV4VHlwZSA9IFwiTWFpbk5vZGVcIjtcbiAgICAgICAgc291cmNlTm9kZS5pY29uID0gXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvcGFnZV9rZXkucG5nXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb3VyY2VOb2RlLl9ub2RlRXhUeXBlID0gXCJTdWJOb2RlXCI7XG4gICAgICAgIHNvdXJjZU5vZGUuaWNvbiA9IFwiLi4vLi4vLi4vVGhlbWVzL1BuZzE2WDE2L3BhZ2VfcmVmcmVzaC5wbmdcIjtcbiAgICAgIH1cblxuICAgICAgc291cmNlTm9kZS50YWJsZUlkID0gc291cmNlTm9kZS5pZDtcbiAgICAgIHNvdXJjZU5vZGUuaWQgPSBTdHJpbmdVdGlsaXR5Lkd1aWQoKTtcbiAgICAgIHJldHVybiBzb3VyY2VOb2RlO1xuICAgIH0sXG4gICAgZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBnZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5nZXROb2RlQnlQYXJhbShcIl9ub2RlRXhUeXBlXCIsIFwiTWFpbk5vZGVcIik7XG5cbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldE1haW5UYWJsZUlkOiBmdW5jdGlvbiBnZXRNYWluVGFibGVJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpID8gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKS50YWJsZUlkIDogXCJcIjtcbiAgICB9LFxuICAgIGdldE1haW5UYWJsZU5hbWU6IGZ1bmN0aW9uIGdldE1haW5UYWJsZU5hbWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSA/IHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkudmFsdWUgOiBcIlwiO1xuICAgIH0sXG4gICAgZ2V0TWFpblRhYmxlQ2FwdGlvbjogZnVuY3Rpb24gZ2V0TWFpblRhYmxlQ2FwdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpID8gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKS5hdHRyMSA6IFwiXCI7XG4gICAgfSxcbiAgICBpc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBpc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pZCA9PSBcIi0xXCI7XG4gICAgfSxcbiAgICBpc1NlbGVjdGVkTWFpblJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBpc1NlbGVjdGVkTWFpblJlbGF0aW9uVGFibGVOb2RlKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5fbm9kZUV4VHlwZSA9PSBcIk1haW5Ob2RlXCI7XG4gICAgfSxcbiAgICBhZGRUYWJsZVRvUmVsYXRpb25UYWJsZVRyZWU6IGZ1bmN0aW9uIGFkZFRhYmxlVG9SZWxhdGlvblRhYmxlVHJlZShuZXdOb2RlKSB7XG4gICAgICBuZXdOb2RlID0gdGhpcy5idWlsZFJlbGF0aW9uVGFibGVOb2RlKG5ld05vZGUpO1xuICAgICAgdmFyIHRlbXBOb2RlID0gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKTtcblxuICAgICAgaWYgKHRlbXBOb2RlICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi5Y+q5YWB6K645a2Y5Zyo5LiA5Liq5Li76K6w5b2VIVwiLCBudWxsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmFkZE5vZGVzKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSwgLTEsIG5ld05vZGUsIGZhbHNlKTtcbiAgICAgIHZhciBuZXdSZXN1bHRJdGVtID0gdGhpcy5nZXRFbXB0eVJlc3VsdEl0ZW0oKTtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0uaWQgPSBuZXdOb2RlLmlkO1xuICAgICAgbmV3UmVzdWx0SXRlbS5wYXJlbnRJZCA9IHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pZDtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVJZCA9IG5ld05vZGUudGFibGVJZDtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVOYW1lID0gbmV3Tm9kZS52YWx1ZTtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVDYXB0aW9uID0gbmV3Tm9kZS5hdHRyMTtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS5wdXNoKG5ld1Jlc3VsdEl0ZW0pO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRSZWxhdGlvblRhYmxlTm9kZTogZnVuY3Rpb24gc2VsZWN0ZWRSZWxhdGlvblRhYmxlTm9kZShub2RlKSB7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUgPSBub2RlO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1Nob3dUYWJsZUVkaXREZXRhaWwgPSAhdGhpcy5pc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzTWFpbkVkaXRUciA9IHRoaXMuaXNTZWxlY3RlZE1haW5SZWxhdGlvblRhYmxlTm9kZSgpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1N1YkVkaXRUciA9ICF0aGlzLmlzU2VsZWN0ZWRNYWluUmVsYXRpb25UYWJsZU5vZGUoKTtcblxuICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxQS0RhdGEgPSB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKG5vZGUudGFibGVJZCkgIT0gbnVsbCA/IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQobm9kZS50YWJsZUlkKSA6IFtdO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxTZWxmS2V5RGF0YSA9IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQobm9kZS50YWJsZUlkKSAhPSBudWxsID8gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChub2RlLnRhYmxlSWQpIDogW107XG4gICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUuZ2V0UGFyZW50Tm9kZSgpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxGb3JlaWduS2V5RGF0YSA9IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQocGFyZW50Tm9kZS50YWJsZUlkKSAhPSBudWxsID8gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChwYXJlbnROb2RlLnRhYmxlSWQpIDogW107XG4gICAgICB0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLmlkID0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlkO1xuICAgICAgdGhpcy5jdXJyZW50RWRpdG9yRGF0YS5wYXJlbnRJZCA9IHBhcmVudE5vZGUuaWQ7XG4gICAgICB2YXIgZXhpc3RSZXN1bHRJdGVtID0gdGhpcy5nZXRFeGlzdFJlc3VsdEl0ZW0obm9kZS5pZCk7XG5cbiAgICAgIGlmIChleGlzdFJlc3VsdEl0ZW0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlKHRoaXMuY3VycmVudEVkaXRvckRhdGEsIGV4aXN0UmVzdWx0SXRlbSk7XG5cbiAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3NlbGYuJHJlZnMuc3FsR2VuZXJhbERlc2lnbkNvbXAuc2V0VmFsdWUoX3NlbGYuY3VycmVudEVkaXRvckRhdGEuY29uZGl0aW9uKTtcblxuICAgICAgICAgIF9zZWxmLiRyZWZzLnNxbEdlbmVyYWxEZXNpZ25Db21wLnNldEFib3V0VGFibGVGaWVsZHMoX3NlbGYucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsU2VsZktleURhdGEsIF9zZWxmLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbEZvcmVpZ25LZXlEYXRhKTtcbiAgICAgICAgfSwgMzAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwi6YCa6L+HZ2V0RXhpc3RSZXN1bHRJdGVt6I635Y+W5LiN5Yiw5pWw5o2uIVwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFJlc3VsdERhdGE6IGZ1bmN0aW9uIGdldFJlc3VsdERhdGEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHREYXRhO1xuICAgIH0sXG4gICAgc2VyaWFsaXplUmVsYXRpb246IGZ1bmN0aW9uIHNlcmlhbGl6ZVJlbGF0aW9uKGlzRm9ybWF0KSB7XG4gICAgICBhbGVydChcInNlcmlhbGl6ZVJlbGF0aW9u5bey57uP5YGc55SoXCIpO1xuICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoaXNGb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZ0Zvcm1hdCh0aGlzLnJlc3VsdERhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHRoaXMucmVzdWx0RGF0YSk7XG4gICAgfSxcbiAgICBkZXNlcmlhbGl6ZVJlbGF0aW9uOiBmdW5jdGlvbiBkZXNlcmlhbGl6ZVJlbGF0aW9uKGpzb25TdHJpbmcpIHtcbiAgICAgIGFsZXJ0KFwiZGVzZXJpYWxpemVSZWxhdGlvbuW3sue7j+WBnOeUqFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9LFxuICAgIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG1haW5UYWJsZUlkOiB0aGlzLmdldE1haW5UYWJsZUlkKCksXG4gICAgICAgIG1haW5UYWJsZU5hbWU6IHRoaXMuZ2V0TWFpblRhYmxlTmFtZSgpLFxuICAgICAgICBtYWluVGFibGVDYXB0aW9uOiB0aGlzLmdldE1haW5UYWJsZUNhcHRpb24oKSxcbiAgICAgICAgcmVsYXRpb25EYXRhOiB0aGlzLnJlc3VsdERhdGFcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKGpzb25TdHJpbmcpIHtcbiAgICAgIHZhciB0ZW1wRGF0YSA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihqc29uU3RyaW5nKTtcbiAgICAgIHRoaXMucmVzdWx0RGF0YSA9IHRlbXBEYXRhO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRlbXBEYXRhW2ldLnZhbHVlID0gdGVtcERhdGFbaV0udGFibGVOYW1lO1xuICAgICAgICB0ZW1wRGF0YVtpXS5hdHRyMSA9IHRlbXBEYXRhW2ldLnRhYmxlQ2FwdGlvbjtcbiAgICAgICAgdGVtcERhdGFbaV0udGV4dCA9IHRlbXBEYXRhW2ldLnRhYmxlQ2FwdGlvbiArIFwi44CQXCIgKyB0ZW1wRGF0YVtpXS50YWJsZU5hbWUgKyBcIuOAkVwiO1xuICAgICAgfVxuXG4gICAgICB0ZW1wRGF0YS5wdXNoKHRoaXMucmVsYXRpb25UYWJsZVRyZWUudGFibGVUcmVlUm9vdERhdGEpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjZGF0YVJlbGF0aW9uWlRyZWVVTFwiKSwgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50YWJsZVRyZWVTZXR0aW5nLCB0ZW1wRGF0YSk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgIH0sXG4gICAgYWxlcnRTZXJpYWxpemVSZWxhdGlvbjogZnVuY3Rpb24gYWxlcnRTZXJpYWxpemVSZWxhdGlvbigpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRKc29uQ29kZSh0aGlzLnJlc3VsdERhdGEpO1xuICAgIH0sXG4gICAgaW5wdXREZXNlcmlhbGl6ZVJlbGF0aW9uOiBmdW5jdGlvbiBpbnB1dERlc2VyaWFsaXplUmVsYXRpb24oKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LlByb21wdCh3aW5kb3csIHtcbiAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgaGVpZ2h0OiA2MDBcbiAgICAgIH0sIERpYWxvZ1V0aWxpdHkuRGlhbG9nUHJvbXB0SWQsIFwi6K+36LS05YWl5pWw5o2u5YWz6IGUSnNvbuiuvue9ruWtl+espuS4slwiLCBmdW5jdGlvbiAoanNvblN0cmluZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHdpbmRvdy5fZGJ0YWJsZXJlbGF0aW9uY29tcC5kZXNlcmlhbGl6ZVJlbGF0aW9uKGpzb25TdHJpbmcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgYWxlcnQoXCLlj43luo/liJfljJblpLHotKU6XCIgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkYi10YWJsZS1yZWxhdGlvbi1jb21wXCI+XFxcclxuICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVwibGVmdFwiIDpkYXNoZWQ9XCJ0cnVlXCIgc3R5bGU9XCJmb250LXNpemU6IDEycHhcIj7mlbDmja7lhbPns7vlhbPogZTorr7nva48L2RpdmlkZXI+XFxcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdDt3aWR0aDogMzUwcHg7aGVpZ2h0OiAzMzBweDtib3JkZXI6ICNkZGRkZjEgMXB4IHNvbGlkO2JvcmRlci1yYWRpdXM6IDRweDtwYWRkaW5nOiAxMHB4IDEwcHggMTBweCAxMHB4O1wiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cCBzaGFwZT1cImNpcmNsZVwiIHN0eWxlPVwibWFyZ2luOiBhdXRvXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJzdWNjZXNzXCIgQGNsaWNrPVwiYmVnaW5TZWxlY3RUYWJsZVRvUmVsYXRpb25UYWJsZVwiPiZuYnNwO+a3u+WKoCZuYnNwOzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cImRlbGV0ZVNlbGVjdGVkUmVsYXRpb25UcmVlTm9kZVwiPiZuYnNwO+WIoOmZpCZuYnNwOzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cImFsZXJ0U2VyaWFsaXplUmVsYXRpb25cIj7luo/liJfljJY8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XCJpbnB1dERlc2VyaWFsaXplUmVsYXRpb25cIj7lj43luo/liJfljJY8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbj7or7TmmI48L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XCJkYXRhUmVsYXRpb25aVHJlZVVMXCIgY2xhc3M9XCJ6dHJlZVwiPjwvdWw+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiA2MzBweDtoZWlnaHQ6IDMzMHB4O2JvcmRlcjogI2RkZGRmMSAxcHggc29saWQ7Ym9yZGVyLXJhZGl1czogNHB4O3BhZGRpbmc6IDEwcHggMTBweCAxMHB4IDEwcHg7XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJsaWdodC1ncmF5LXRhYmxlXCIgY2VsbHBhZGRpbmc9XCIwXCIgY2VsbHNwYWNpbmc9XCIwXCIgYm9yZGVyPVwiMFwiIHYtaWY9XCJyZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1Nob3dUYWJsZUVkaXREZXRhaWxcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XCJ3aWR0aDogMTclXCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cIndpZHRoOiAzMyVcIiAvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVwid2lkdGg6IDE1JVwiIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XCJ3aWR0aDogMzUlXCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj5TaW5nbGVOYW1l77yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEuc2luZ2xlTmFtZVwiIHNpemU9XCJzbWFsbFwiIHBsYWNlaG9sZGVyPVwi5pys5YWz6IGU5Lit55qE5ZSv5LiA5ZCN56ewLOWPr+S7peS4uuepulwiIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj5QS0tlee+8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHBsYWNlaG9sZGVyPVwi6buY6K6k5L2/55SoSWTlrZfmrrVcIiB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEucGtGaWVsZE5hbWVcIiBzaXplPVwic21hbGxcIiBzdHlsZT1cIndpZHRoOjE5OXB4XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gcmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsUEtEYXRhXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgdi1pZj1cInJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU3ViRWRpdFRyXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYWJlbFwiPuaVsOaNruWFs+ezu++8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5yZWxhdGlvblR5cGVcIiB0eXBlPVwiYnV0dG9uXCIgc2l6ZT1cInNtYWxsXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cIjFUbzFcIj4xOjE8L3JhZGlvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XCIxVG9OXCI+MTpOPC9yYWRpbz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+5piv5ZCm5L+d5a2Y77yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLmlzU2F2ZVwiIHR5cGU9XCJidXR0b25cIiBzaXplPVwic21hbGxcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVwidHJ1ZVwiPuaYrzwvcmFkaW8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cImZhbHNlXCI+5ZCmPC9yYWRpbz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHYtaWY9XCJyZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1N1YkVkaXRUclwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj7mnKzouqvlhbPogZTlrZfmrrXvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5zZWxmS2V5RmllbGROYW1lXCIgc2l6ZT1cInNtYWxsXCIgc3R5bGU9XCJ3aWR0aDoxOTlweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFNlbGZLZXlEYXRhXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj7lpJbogZTlrZfmrrXvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5vdXRlcktleUZpZWxkTmFtZVwiIHNpemU9XCJzbWFsbFwiIHN0eWxlPVwid2lkdGg6MTk5cHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHYtZm9yPVwiaXRlbSBpbiByZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxQS0RhdGFcIiA6dmFsdWU9XCJpdGVtLmZpZWxkTmFtZVwiIDprZXk9XCJpdGVtLmZpZWxkTmFtZVwiPnt7aXRlbS5maWVsZENhcHRpb259fTwvaS1vcHRpb24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+RGVzY++8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEuZGVzY1wiIHNpemU9XCJzbWFsbFwiIHBsYWNlaG9sZGVyPVwi6K+05piOXCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+5Yqg6L295p2h5Lu277yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcWwtZ2VuZXJhbC1kZXNpZ24tY29tcCByZWY9XCJzcWxHZW5lcmFsRGVzaWduQ29tcFwiIDpzcWxEZXNpZ25lckhlaWdodD1cIjc0XCIgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLmNvbmRpdGlvblwiPjwvc3FsLWdlbmVyYWwtZGVzaWduLWNvbXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImRpdlNlbGVjdFRhYmxlXCIgdGl0bGU9XCLor7fpgInmi6nooahcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cInNlbGVjdFRhYmxlWlRyZWVVTFwiIGNsYXNzPVwienRyZWVcIj48L3VsPlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZGVzaWduLWh0bWwtZWxlbS1saXN0XCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge30sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImRlc2lnbi1odG1sLWVsZW0tbGlzdC13cmFwXCI+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2lnbi1odG1sLWVsZW0tbGlzdC1pdGVtXCI+5qC85byP5YyWPC9kaXY+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2lnbi1odG1sLWVsZW0tbGlzdC1pdGVtXCI+6K+05piOPC9kaXY+XFxcclxuICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImZkLWNvbnRyb2wtYmFzZS1pbmZvXCIsIHtcbiAgcHJvcHM6IFtcInZhbHVlXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBiYXNlSW5mbzoge1xuICAgICAgICBpZDogXCJcIixcbiAgICAgICAgc2VyaWFsaXplOiBcIlwiLFxuICAgICAgICBuYW1lOiBcIlwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiXCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcIlwiLFxuICAgICAgICByZWFkb25seTogXCJcIixcbiAgICAgICAgZGlzYWJsZWQ6IFwiXCIsXG4gICAgICAgIHN0eWxlOiBcIlwiLFxuICAgICAgICBkZXNjOiBcIlwiXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBiYXNlSW5mbzogZnVuY3Rpb24gYmFzZUluZm8obmV3VmFsKSB7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG5ld1ZhbCk7XG4gICAgfSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmV3VmFsKSB7XG4gICAgICB0aGlzLmJhc2VJbmZvID0gbmV3VmFsO1xuICAgIH1cbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJhc2VJbmZvID0gdGhpcy52YWx1ZTtcbiAgfSxcbiAgbWV0aG9kczoge30sXG4gIHRlbXBsYXRlOiAnPHRhYmxlIGNsYXNzPVwiaHRtbC1kZXNpZ24tcGx1Z2luLWRpYWxvZy10YWJsZS13cmFwZXJcIiBjZWxscGFkZGluZz1cIjBcIiBjZWxsc3BhY2luZz1cIjBcIiBib3JkZXI9XCIwXCI+JyArICc8Y29sZ3JvdXA+JyArICc8Y29sIHN0eWxlPVwid2lkdGg6IDEwMHB4XCIgLz4nICsgJzxjb2wgc3R5bGU9XCJ3aWR0aDogMjgwcHhcIiAvPicgKyAnPGNvbCBzdHlsZT1cIndpZHRoOiA5MHB4XCIgLz4nICsgJzxjb2wgc3R5bGU9XCJ3aWR0aDogMTEwcHhcIiAvPicgKyAnPGNvbCBzdHlsZT1cIndpZHRoOiA5MHB4XCIgLz4nICsgJzxjb2wgLz4nICsgJzwvY29sZ3JvdXA+JyArICc8dHI+JyArICc8dGQ+SUTvvJo8L3RkPicgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdi1tb2RlbD1cImJhc2VJbmZvLmlkXCIgLz4nICsgJzwvdGQ+JyArICc8dGQ+U2VyaWFsaXpl77yaPC90ZD4nICsgJzx0ZCBjb2xzcGFuPVwiM1wiPicgKyAnPHJhZGlvLWdyb3VwIHR5cGU9XCJidXR0b25cIiBzdHlsZT1cIm1hcmdpbjogYXV0b1wiIHYtbW9kZWw9XCJiYXNlSW5mby5zZXJpYWxpemVcIj4nICsgJzxyYWRpbyBsYWJlbD1cInRydWVcIj7mmK88L3JhZGlvPicgKyAnPHJhZGlvIGxhYmVsPVwiZmFsc2VcIj7lkKY8L3JhZGlvPicgKyAnPC9yYWRpby1ncm91cD4nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkPk5hbWXvvJo8L3RkPicgKyAnPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIHYtbW9kZWw9XCJiYXNlSW5mby5uYW1lXCIgLz48L3RkPicgKyAnPHRkPkNsYXNzTmFtZe+8mjwvdGQ+JyArICc8dGQgY29sc3Bhbj1cIjNcIj48aW5wdXQgdHlwZT1cInRleHRcIiB2LW1vZGVsPVwiYmFzZUluZm8uY2xhc3NOYW1lXCIgLz48L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZD5QbGFjZWhvbGRlcjwvdGQ+JyArICc8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgdi1tb2RlbD1cImJhc2VJbmZvLnBsYWNlaG9sZGVyXCIgLz48L3RkPicgKyAnPHRkPlJlYWRvbmx577yaPC90ZD4nICsgJzx0ZCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPicgKyAnPHJhZGlvLWdyb3VwIHR5cGU9XCJidXR0b25cIiBzdHlsZT1cIm1hcmdpbjogYXV0b1wiIHYtbW9kZWw9XCJiYXNlSW5mby5yZWFkb25seVwiPicgKyAnPHJhZGlvIGxhYmVsPVwicmVhZG9ubHlcIj7mmK88L3JhZGlvPicgKyAnPHJhZGlvIGxhYmVsPVwibm9yZWFkb25seVwiPuWQpjwvcmFkaW8+JyArICc8L3JhZGlvLWdyb3VwPicgKyAnPC90ZD4nICsgJzx0ZD5EaXNhYmxlZO+8mjwvdGQ+JyArICc8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgJzxyYWRpby1ncm91cCB0eXBlPVwiYnV0dG9uXCIgc3R5bGU9XCJtYXJnaW46IGF1dG9cIiB2LW1vZGVsPVwiYmFzZUluZm8uZGlzYWJsZWRcIj4nICsgJzxyYWRpbyBsYWJlbD1cImRpc2FibGVkXCI+5pivPC9yYWRpbz4nICsgJzxyYWRpbyBsYWJlbD1cIm5vZGlzYWJsZWRcIj7lkKY8L3JhZGlvPicgKyAnPC9yYWRpby1ncm91cD4nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkPuagt+W8j++8mjwvdGQ+JyArICc8dGQgY29sc3Bhbj1cIjVcIj4nICsgJzx0ZXh0YXJlYSByb3dzPVwiN1wiIHYtbW9kZWw9XCJiYXNlSW5mby5zdHlsZVwiPjwvdGV4dGFyZWE+JyArICc8L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZD7lpIfms6jvvJo8L3RkPicgKyAnPHRkIGNvbHNwYW49XCI1XCI+JyArICc8dGV4dGFyZWEgcm93cz1cIjhcIiB2LW1vZGVsPVwiYmFzZUluZm8uZGVzY1wiPjwvdGV4dGFyZWE+JyArICc8L3RkPicgKyAnPC90cj4nICsgJzwvdGFibGU+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJmZC1jb250cm9sLWJpbmQtdG9cIiwge1xuICBwcm9wczogW1wiYmluZFRvRmllbGRQcm9wXCIsIFwiZGVmYXVsdFZhbHVlUHJvcFwiLCBcInZhbGlkYXRlUnVsZXNQcm9wXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBiaW5kVG9GaWVsZDoge1xuICAgICAgICB0YWJsZUlkOiBcIlwiLFxuICAgICAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIixcbiAgICAgICAgZmllbGROYW1lOiBcIlwiLFxuICAgICAgICBmaWVsZENhcHRpb246IFwiXCIsXG4gICAgICAgIGZpZWxkRGF0YVR5cGU6IFwiXCIsXG4gICAgICAgIGZpZWxkTGVuZ3RoOiBcIlwiXG4gICAgICB9LFxuICAgICAgdmFsaWRhdGVSdWxlczoge1xuICAgICAgICBtc2c6IFwiXCIsXG4gICAgICAgIHJ1bGVzOiBbXVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRWYWx1ZToge1xuICAgICAgICBkZWZhdWx0VHlwZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiLFxuICAgICAgICBkZWZhdWx0VGV4dDogXCJcIlxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhOiB7XG4gICAgICAgIGRlZmF1bHREaXNwbGF5VGV4dDogXCJcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgYmluZFRvUHJvcDogZnVuY3Rpb24gYmluZFRvUHJvcChuZXdWYWx1ZSkge1xuICAgICAgY29uc29sZS5sb2cobmV3VmFsdWUpO1xuICAgIH0sXG4gICAgYmluZFRvRmllbGRQcm9wOiBmdW5jdGlvbiBiaW5kVG9GaWVsZFByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuYmluZFRvRmllbGQgPSBuZXdWYWx1ZTtcbiAgICB9LFxuICAgIGRlZmF1bHRWYWx1ZVByb3A6IGZ1bmN0aW9uIGRlZmF1bHRWYWx1ZVByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlKSkge1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB2YWxpZGF0ZVJ1bGVzUHJvcDogZnVuY3Rpb24gdmFsaWRhdGVSdWxlc1Byb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMudmFsaWRhdGVSdWxlcyA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJpbmRUb0ZpZWxkID0gdGhpcy5iaW5kVG9GaWVsZFByb3A7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBzZXRDb21wbGV0ZWQ6IGZ1bmN0aW9uIHNldENvbXBsZXRlZCgpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLXNldC1jb21wbGV0ZWQnLCB0aGlzLmJpbmRUb0ZpZWxkLCB0aGlzLmRlZmF1bHRWYWx1ZSwgdGhpcy52YWxpZGF0ZVJ1bGVzKTtcbiAgICB9LFxuICAgIHNlbGVjdEJpbmRGaWVsZFZpZXc6IGZ1bmN0aW9uIHNlbGVjdEJpbmRGaWVsZFZpZXcoKSB7XG4gICAgICBKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0QmluZFRvRmllbGQuYmVnaW5TZWxlY3RJbkZyYW1lKHdpbmRvdywgXCJfU2VsZWN0QmluZE9ialwiLCB7fSk7XG4gICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB0aGlzO1xuICAgIH0sXG4gICAgc2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZShyZXN1bHQpIHtcbiAgICAgIHRoaXMuYmluZFRvRmllbGQgPSB7fTtcblxuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGROYW1lID0gcmVzdWx0LmZpZWxkTmFtZTtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUlkID0gcmVzdWx0LnRhYmxlSWQ7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVOYW1lID0gcmVzdWx0LnRhYmxlTmFtZTtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUNhcHRpb24gPSByZXN1bHQudGFibGVDYXB0aW9uO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbiA9IHJlc3VsdC5maWVsZENhcHRpb247XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGREYXRhVHlwZSA9IHJlc3VsdC5maWVsZERhdGFUeXBlO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkTGVuZ3RoID0gcmVzdWx0LmZpZWxkTGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZE5hbWUgPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlSWQgPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlTmFtZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVDYXB0aW9uID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZENhcHRpb24gPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkRGF0YVR5cGUgPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkTGVuZ3RoID0gXCJcIjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcbiAgICB9LFxuICAgIGdldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIGdldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWUoKSB7XG4gICAgICByZXR1cm4gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUodGhpcy5iaW5kVG9GaWVsZCk7XG4gICAgfSxcbiAgICBzZWxlY3REZWZhdWx0VmFsdWVWaWV3OiBmdW5jdGlvbiBzZWxlY3REZWZhdWx0VmFsdWVWaWV3KCkge1xuICAgICAgSkJ1aWxkNERTZWxlY3RWaWV3LlNlbGVjdEVudlZhcmlhYmxlLmJlZ2luU2VsZWN0SW5GcmFtZSh3aW5kb3csIFwiX1NlbGVjdEJpbmRPYmpcIiwge30pO1xuICAgICAgd2luZG93Ll9TZWxlY3RCaW5kT2JqID0gdGhpcztcbiAgICB9LFxuICAgIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUgPSByZXN1bHQuVHlwZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFZhbHVlID0gcmVzdWx0LlZhbHVlO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCA9IHJlc3VsdC5UZXh0O1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRWYWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0ID0gXCJcIjtcbiAgICAgICAgdGhpcy50ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHQgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldENvbXBsZXRlZCgpO1xuICAgIH0sXG4gICAgc2VsZWN0VmFsaWRhdGVSdWxlVmlldzogZnVuY3Rpb24gc2VsZWN0VmFsaWRhdGVSdWxlVmlldygpIHtcbiAgICAgIEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RWYWxpZGF0ZVJ1bGUuYmVnaW5TZWxlY3RJbkZyYW1lKHdpbmRvdywgXCJfU2VsZWN0QmluZE9ialwiLCB7fSk7XG4gICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB0aGlzO1xuICAgIH0sXG4gICAgc2V0U2VsZWN0VmFsaWRhdGVSdWxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVSdWxlcyA9IHJlc3VsdDtcbiAgICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVSdWxlcy5tc2cgPSBcIlwiO1xuICAgICAgICB0aGlzLnZhbGlkYXRlUnVsZXMucnVsZXMgPSBbXTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBnZXRTZWxlY3RWYWxpZGF0ZVJ1bGVSZXN1bHRWYWx1ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlUnVsZXM7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzx0YWJsZSBjZWxscGFkZGluZz1cIjBcIiBjZWxsc3BhY2luZz1cIjBcIiBib3JkZXI9XCIwXCIgY2xhc3M9XCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclwiPicgKyAnPGNvbGdyb3VwPicgKyAnPGNvbCBzdHlsZT1cIndpZHRoOiAxMDBweFwiIC8+JyArICc8Y29sIHN0eWxlPVwid2lkdGg6IDI4MHB4XCIgLz4nICsgJzxjb2wgc3R5bGU9XCJ3aWR0aDogMTAwcHhcIiAvPicgKyAnPGNvbCAvPicgKyAnPC9jb2xncm91cD4nICsgJzx0cj4nICsgJzx0ZCBjb2xzcGFuPVwiNFwiPicgKyAnICAgIOe7keWumuWIsOihqDxidXR0b24gY2xhc3M9XCJidG4tc2VsZWN0IGZyaWdodFwiIHYtb246Y2xpY2s9XCJzZWxlY3RCaW5kRmllbGRWaWV3XCI+Li4uPC9idXR0b24+JyArICc8L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZD7ooajnvJblj7fvvJo8L3RkPicgKyAnPHRkIGNvbHNwYW49XCIzXCI+e3tiaW5kVG9GaWVsZC50YWJsZUlkfX08L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZD7ooajlkI3vvJo8L3RkPicgKyAnPHRkPnt7YmluZFRvRmllbGQudGFibGVOYW1lfX08L3RkPicgKyAnPHRkPuihqOagh+mimO+8mjwvdGQ+JyArICc8dGQ+e3tiaW5kVG9GaWVsZC50YWJsZUNhcHRpb259fTwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkPuWtl+auteWQje+8mjwvdGQ+JyArICc8dGQ+e3tiaW5kVG9GaWVsZC5maWVsZE5hbWV9fTwvdGQ+JyArICc8dGQ+5a2X5q615qCH6aKY77yaPC90ZD4nICsgJzx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbn19PC90ZD4nICsgJzwvdHI+JyArICc8dHI+JyArICc8dGQ+57G75Z6L77yaPC90ZD4nICsgJzx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkRGF0YVR5cGV9fTwvdGQ+JyArICc8dGQ+6ZW/5bqm77yaPC90ZD4nICsgJzx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkTGVuZ3RofX08L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZCBjb2xzcGFuPVwiNFwiPum7mOiupOWAvDxidXR0b24gY2xhc3M9XCJidG4tc2VsZWN0IGZyaWdodFwiIHYtb246Y2xpY2s9XCJzZWxlY3REZWZhdWx0VmFsdWVWaWV3XCI+Li4uPC9idXR0b24+PC90ZD4nICsgJzwvdHI+JyArICc8dHIgc3R5bGU9XCJoZWlnaHQ6IDM1cHhcIj4nICsgJzx0ZCBjb2xzcGFuPVwiNFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcIj4nICsgJ3t7dGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0fX0nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkIGNvbHNwYW49XCI0XCI+JyArICcgICAg5qCh6aqM6KeE5YiZPGJ1dHRvbiBjbGFzcz1cImJ0bi1zZWxlY3QgZnJpZ2h0XCIgdi1vbjpjbGljaz1cInNlbGVjdFZhbGlkYXRlUnVsZVZpZXdcIj4uLi48L2J1dHRvbj4nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkIGNvbHNwYW49XCI0XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmXCI+JyArICc8dGFibGUgY2xhc3M9XCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclwiPicgKyAnPGNvbGdyb3VwPicgKyAnPGNvbCBzdHlsZT1cIndpZHRoOiAxMDBweFwiIC8+JyArICc8Y29sIC8+JyArICc8L2NvbGdyb3VwPicgKyAnPHRyPicgKyAnPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPuaPkOekuua2iOaBr++8mjwvdGQ+JyArICc8dGQ+e3t2YWxpZGF0ZVJ1bGVzLm1zZ319PC90ZD4nICsgJzwvdHI+JyArICc8dHI+JyArICc8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+6aqM6K+B57G75Z6LPC90ZD4nICsgJzx0ZCBzdHlsZT1cImJhY2tncm91bmQ6ICNlOGVhZWM7dGV4dC1hbGlnbjogY2VudGVyO1wiPuWPguaVsDwvdGQ+JyArICc8L3RyPicgKyAnPHRyIHYtZm9yPVwicnVsZUl0ZW0gaW4gdmFsaWRhdGVSdWxlcy5ydWxlc1wiPicgKyAnPHRkIHN0eWxlPVwiYmFja2dyb3VuZDogI2ZmZmZmZjt0ZXh0LWFsaWduOiBjZW50ZXI7Y29sb3I6ICNhZDkzNjFcIj57e3J1bGVJdGVtLnZhbGlkYXRlVHlwZX19PC90ZD4nICsgJzx0ZCBzdHlsZT1cImJhY2tncm91bmQ6ICNmZmZmZmY7dGV4dC1hbGlnbjogY2VudGVyO1wiPjxwIHYtaWY9XCJydWxlSXRlbS52YWxpZGF0ZVBhcmFzID09PSBcXCdcXCdcIj7ml6Dlj4LmlbA8L3A+PHAgdi1lbHNlPnt7cnVsZUl0ZW0udmFsaWRhdGVQYXJhc319PC9wPjwvdGQ+JyArICc8L3RyPicgKyAnPC90YWJsZT4nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPC90YWJsZT4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImpzLWRlc2lnbi1jb2RlLWZyYWdtZW50XCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAganNFZGl0b3JJbnN0YW5jZTogbnVsbFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIHNldEpTRWRpdG9ySW5zdGFuY2U6IGZ1bmN0aW9uIHNldEpTRWRpdG9ySW5zdGFuY2Uob2JqKSB7XG4gICAgICB0aGlzLmpzRWRpdG9ySW5zdGFuY2UgPSBvYmo7XG4gICAgfSxcbiAgICBnZXRKc0VkaXRvckluc3Q6IGZ1bmN0aW9uIGdldEpzRWRpdG9ySW5zdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmpzRWRpdG9ySW5zdGFuY2U7XG4gICAgfSxcbiAgICBpbnNlcnRKczogZnVuY3Rpb24gaW5zZXJ0SnMoanMpIHtcbiAgICAgIHZhciBkb2MgPSB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmdldERvYygpO1xuICAgICAgdmFyIGN1cnNvciA9IGRvYy5nZXRDdXJzb3IoKTtcbiAgICAgIGRvYy5yZXBsYWNlUmFuZ2UoanMsIGN1cnNvcik7XG4gICAgfSxcbiAgICBmb3JtYXRKUzogZnVuY3Rpb24gZm9ybWF0SlMoKSB7XG4gICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW1wic2VsZWN0QWxsXCJdKHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkpO1xuICAgICAgdmFyIHJhbmdlID0ge1xuICAgICAgICBmcm9tOiB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgdG86IHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKGZhbHNlKVxuICAgICAgfTtcbiAgICAgIDtcbiAgICAgIHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkuYXV0b0Zvcm1hdFJhbmdlKHJhbmdlLmZyb20sIHJhbmdlLnRvKTtcbiAgICB9LFxuICAgIGFsZXJ0RGVzYzogZnVuY3Rpb24gYWxlcnREZXNjKCkge30sXG4gICAgcmVmU2NyaXB0OiBmdW5jdGlvbiByZWZTY3JpcHQoKSB7XG4gICAgICB2YXIganMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIiBzcmM9XFxcIiR7Y29udGV4dFBhdGh9L1VJQ29tcG9uZW50L1RyZWVUYWJsZS9Kcy9UcmVlVGFibGUuanNcXFwiPjwvc2NyaXB0PlwiO1xuICAgICAgdGhpcy5pbnNlcnRKcyhqcyk7XG4gICAgfSxcbiAgICBjYWxsU2VydmljZU1ldGhvZDogZnVuY3Rpb24gY2FsbFNlcnZpY2VNZXRob2QoKSB7fVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LXdyYXBcIj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCIgQGNsaWNrPVwiZm9ybWF0SlNcIj7moLzlvI/ljJY8L2Rpdj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+6K+05piOPC9kaXY+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiIEBjbGljaz1cInJlZlNjcmlwdFwiPuW8leWFpeiEmuacrDwvZGl2PlxcXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIj7ojrflj5ZVUkzlj4LmlbA8L2Rpdj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+6LCD55So5pyN5Yqh5pa55rOVPC9kaXY+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiPuWKoOi9veaVsOaNruWtl+WFuDwvZGl2PlxcXHJcbiAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhcIkZyYW1lRGlhbG9nRWxlXCIgKyBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkKTtcbn0sIGZhbHNlKTtcblZ1ZS5jb21wb25lbnQoXCJtb2R1bGUtbGlzdC1mbG93LWNvbXBcIiwge1xuICBwcm9wczogWydsaXN0SGVpZ2h0JywgJ21vZHVsZURhdGEnLCAnYWN0aXZlVGFiTmFtZSddLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBzYXZlTW9kZWw6IFwiL1BsYXRGb3JtL0J1aWxkZXIvRmxvd01vZGVsL1NhdmVNb2RlbFwiLFxuICAgICAgICBnZXRFZGl0TW9kZWxVUkw6IFwiL1BsYXRGb3JtL0J1aWxkZXIvRmxvd01vZGVsL0dldEVkaXRNb2RlbFVSTFwiLFxuICAgICAgICByZWxvYWREYXRhOiBcIi9QbGF0Rm9ybS9CdWlsZGVyL0Zsb3dNb2RlbC9HZXRMaXN0RGF0YVwiLFxuICAgICAgICBnZXRTaW5nbGVEYXRhOiBcIi9QbGF0Rm9ybS9CdWlsZGVyL0Zsb3dNb2RlbC9HZXREZXRhaWxEYXRhXCIsXG4gICAgICAgIGRlbGV0ZTogXCIvUGxhdEZvcm0vQnVpbGRlci9GbG93TW9kZWwvRGVsZXRlTW9kZWxcIixcbiAgICAgICAgbW92ZTogXCIvUGxhdEZvcm0vQnVpbGRlci9GbG93TW9kZWwvTW92ZVwiXG4gICAgICB9LFxuICAgICAgaWRGaWVsZE5hbWU6IFwibW9kZWxJZFwiLFxuICAgICAgc2VhcmNoQ29uZGl0aW9uOiB7XG4gICAgICAgIG1vZGVsTW9kdWxlSWQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0eXBlOiAnc2VsZWN0aW9uJyxcbiAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJblj7cnLFxuICAgICAgICBrZXk6ICdtb2RlbENvZGUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgd2lkdGg6IDgwXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5rWB56iL5ZCN56ewJyxcbiAgICAgICAga2V5OiAnbW9kZWxOYW1lJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflkK/liqhLZXknLFxuICAgICAgICBrZXk6ICdtb2RlbFN0YXJ0S2V5JyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflpIfms6gnLFxuICAgICAgICBrZXk6ICdtb2RlbERlc2MnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e8lui+keaXtumXtCcsXG4gICAgICAgIGtleTogJ21vZGVsVXBkYXRlVGltZScsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVSZW5kZXJlci5Ub0RhdGVZWVlZX01NX0REKGgsIHBhcmFtcy5yb3cubW9kZWxVcGRhdGVUaW1lKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgIGtleTogJ21vZGVsSWQnLFxuICAgICAgICB3aWR0aDogMTIwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICB9LCBbd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAuZWRpdE1vZGVsQnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wKSwgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5FZGl0QnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wKSwgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5EZWxldGVCdXR0b24oaCwgcGFyYW1zLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcC5pZEZpZWxkTmFtZSwgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXApXSk7XG4gICAgICAgIH1cbiAgICAgIH1dLFxuICAgICAgdGFibGVEYXRhOiBbXSxcbiAgICAgIHRhYmxlRGF0YU9yaWdpbmFsOiBbXSxcbiAgICAgIHNlbGVjdGlvblJvd3M6IG51bGwsXG4gICAgICBwYWdlVG90YWw6IDAsXG4gICAgICBwYWdlU2l6ZTogNTAwLFxuICAgICAgcGFnZU51bTogMSxcbiAgICAgIHNlYXJjaFRleHQ6IFwiXCIsXG4gICAgICBmbG93TW9kZWxFbnRpdHk6IHtcbiAgICAgICAgbW9kZWxJZDogXCJcIixcbiAgICAgICAgbW9kZWxEZUlkOiBcIlwiLFxuICAgICAgICBtb2RlbE1vZHVsZUlkOiBcIlwiLFxuICAgICAgICBtb2RlbEdyb3VwSWQ6IFwiXCIsXG4gICAgICAgIG1vZGVsTmFtZTogXCJcIixcbiAgICAgICAgbW9kZWxDcmVhdGVUaW1lOiBEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YSgpLFxuICAgICAgICBtb2RlbENyZWF0ZXI6IFwiXCIsXG4gICAgICAgIG1vZGVsVXBkYXRlVGltZTogRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGEoKSxcbiAgICAgICAgbW9kZWxVcGRhdGVyOiBcIlwiLFxuICAgICAgICBtb2RlbERlc2M6IFwiXCIsXG4gICAgICAgIG1vZGVsU3RhdHVzOiBcIuWQr+eUqFwiLFxuICAgICAgICBtb2RlbE9yZGVyTnVtOiBcIlwiLFxuICAgICAgICBtb2RlbERlcGxveW1lbnRJZDogXCJcIixcbiAgICAgICAgbW9kZWxTdGFydEtleTogXCJcIixcbiAgICAgICAgbW9kZWxSZXNvdXJjZU5hbWU6IFwiXCIsXG4gICAgICAgIG1vZGVsRnJvbVR5cGU6IFwiXCJcbiAgICAgIH0sXG4gICAgICBlbXB0eUZsb3dNb2RlbEVudGl0eToge30sXG4gICAgICBpbXBvcnRFWERhdGE6IHtcbiAgICAgICAgbW9kZWxNb2R1bGVJZDogXCJcIlxuICAgICAgfSxcbiAgICAgIHJ1bGVWYWxpZGF0ZToge1xuICAgICAgICBtb2RlbE5hbWU6IFt7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogJ+OAkOaooeWei+WQjeensOOAkeS4jeiDveepuu+8gScsXG4gICAgICAgICAgdHJpZ2dlcjogJ2JsdXInXG4gICAgICAgIH1dLFxuICAgICAgICBtb2RlbFN0YXJ0S2V5OiBbe1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6ICfjgJDmqKHlnotLZXnjgJHkuI3og73nqbrvvIEnLFxuICAgICAgICAgIHRyaWdnZXI6ICdibHVyJ1xuICAgICAgICB9XVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuZmxvd01vZGVsRW50aXR5KSB7XG4gICAgICB0aGlzLmVtcHR5Rmxvd01vZGVsRW50aXR5W2tleV0gPSB0aGlzLmZsb3dNb2RlbEVudGl0eVtrZXldO1xuICAgIH1cbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBtb2R1bGVEYXRhOiBmdW5jdGlvbiBtb2R1bGVEYXRhKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBhY3RpdmVUYWJOYW1lOiBmdW5jdGlvbiBhY3RpdmVUYWJOYW1lKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBzZWFyY2hUZXh0OiBmdW5jdGlvbiBzZWFyY2hUZXh0KG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICB2YXIgZmlsdGVyVGFibGVEYXRhID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlRGF0YVtpXTtcblxuICAgICAgICAgIGlmIChyb3cubW9kZWxDb2RlLmluZGV4T2YobmV3VmFsKSA+PSAwKSB7XG4gICAgICAgICAgICBmaWx0ZXJUYWJsZURhdGEucHVzaChyb3cpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocm93Lm1vZGVsTmFtZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IGZpbHRlclRhYmxlRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gdGhpcy50YWJsZURhdGFPcmlnaW5hbDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoZGlhbG9nSWQpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coZGlhbG9nSWQpO1xuICAgIH0sXG4gICAgZ2V0TW9kdWxlTmFtZTogZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vZHVsZURhdGEgPT0gbnVsbCA/IFwi6K+36YCJ5Lit5qih5Z2XXCIgOiB0aGlzLm1vZHVsZURhdGEubW9kdWxlVGV4dDtcbiAgICB9LFxuICAgIHN0YXR1c0VuYWJsZTogZnVuY3Rpb24gc3RhdHVzRW5hYmxlKHN0YXR1c05hbWUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2UodGhpcy5hY0ludGVyZmFjZS5zdGF0dXNDaGFuZ2UsIHRoaXMuc2VsZWN0aW9uUm93cywgYXBwTGlzdC5pZEZpZWxkTmFtZSwgc3RhdHVzTmFtZSwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKHR5cGUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld01vdmVGYWNlKHRoaXMuYWNJbnRlcmZhY2UubW92ZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCB0aGlzLmlkRmllbGROYW1lLCB0eXBlLCB0aGlzKTtcbiAgICB9LFxuICAgIHNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlKHNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gc2VsZWN0aW9uO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCAmJiB0aGlzLmFjdGl2ZVRhYk5hbWUgPT0gXCJsaXN0LWZsb3dcIikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5tb2RlbE1vZHVsZUlkLnZhbHVlID0gdGhpcy5tb2R1bGVEYXRhLm1vZHVsZUlkO1xuICAgICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoKHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkRGF0YSwgdGhpcy5wYWdlTnVtLCB0aGlzLnBhZ2VTaXplLCB0aGlzLnNlYXJjaENvbmRpdGlvbiwgdGhpcywgdGhpcy5pZEZpZWxkTmFtZSwgdHJ1ZSwgZnVuY3Rpb24gKHJlc3VsdCwgcGFnZUFwcE9iaikge1xuICAgICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhT3JpZ2luYWwgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZCgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICBEZXRhaWxQYWdlVXRpbGl0eS5PdmVycmlkZU9iamVjdFZhbHVlRnVsbCh0aGlzLmZsb3dNb2RlbEVudGl0eSwgdGhpcy5lbXB0eUZsb3dNb2RlbEVudGl0eSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbShcImRpdk5ld0Zsb3dNb2RlbFdyYXBcIiwge1xuICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgdGl0bGU6IFwi5Yib5bu65rWB56iL5qih5Z6LXCJcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nmqKHlnZchXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChyZWNvcmRJZCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgX3NlbGYuJHJlZnNbXCJmbG93TW9kZWxFbnRpdHlcIl0ucmVzZXRGaWVsZHMoKTtcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFNpbmdsZURhdGEsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZElkLFxuICAgICAgICBvcDogXCJlZGl0XCJcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuT3ZlcnJpZGVPYmplY3RWYWx1ZUZ1bGwoX3NlbGYuZmxvd01vZGVsRW50aXR5LCByZXN1bHQuZGF0YSk7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtKFwiZGl2TmV3Rmxvd01vZGVsV3JhcFwiLCB7XG4gICAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgIHRpdGxlOiBcIue8lui+kea1geeoi+aooeWei+amguWGtVwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiBkZWwocmVjb3JkSWQpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlRGVsZXRlUm93KHRoaXMuYWNJbnRlcmZhY2UuZGVsZXRlLCByZWNvcmRJZCwgdGhpcyk7XG4gICAgfSxcbiAgICBoYW5kbGVTdWJtaXRGbG93TW9kZWxFZGl0OiBmdW5jdGlvbiBoYW5kbGVTdWJtaXRGbG93TW9kZWxFZGl0KG5hbWUpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMuJHJlZnNbbmFtZV0udmFsaWRhdGUoZnVuY3Rpb24gKHZhbGlkKSB7XG4gICAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICAgIF9zZWxmLmZsb3dNb2RlbEVudGl0eS5tb2RlbE1vZHVsZUlkID0gX3NlbGYubW9kdWxlRGF0YS5tb2R1bGVJZDtcblxuICAgICAgICAgIHZhciBfZGVzaWduTW9kZWwgPSBfc2VsZi5mbG93TW9kZWxFbnRpdHkubW9kZWxJZCA9PSBcIlwiID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICAgICAgdmFyIHNlbmREYXRhID0gSlNPTi5zdHJpbmdpZnkoX3NlbGYuZmxvd01vZGVsRW50aXR5KTtcbiAgICAgICAgICBBamF4VXRpbGl0eS5Qb3N0UmVxdWVzdEJvZHkoX3NlbGYuYWNJbnRlcmZhY2Uuc2F2ZU1vZGVsLCBzZW5kRGF0YSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIF9zZWxmLmhhbmRsZUNsb3NlKFwiZGl2TmV3Rmxvd01vZGVsV3JhcFwiKTtcblxuICAgICAgICAgICAgICBfc2VsZi5yZWxvYWREYXRhKCk7XG5cbiAgICAgICAgICAgICAgaWYgKF9kZXNpZ25Nb2RlbCkge1xuICAgICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuT3Blbk5ld1dpbmRvdyh3aW5kb3csIFwiZWRpdE1vZGVsV2ViV2luZG93XCIsIHJlc3VsdC5kYXRhLmVkaXRNb2RlbFdlYlVybCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIFwianNvblwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLiRNZXNzYWdlLmVycm9yKCdGYWlsIScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGltcG9ydE1vZGVsOiBmdW5jdGlvbiBpbXBvcnRNb2RlbCgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICBEZXRhaWxQYWdlVXRpbGl0eS5PdmVycmlkZU9iamVjdFZhbHVlRnVsbCh0aGlzLmZsb3dNb2RlbEVudGl0eSwgdGhpcy5lbXB0eUZsb3dNb2RlbEVudGl0eSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbShcImRpdkltcG9ydEZsb3dNb2RlbFdyYXBcIiwge1xuICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICAgICAgdGl0bGU6IFwi5a+85YWl5rWB56iL5qih5Z6LXCJcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nmqKHlnZchXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBsb2FkU3VjY2VzczogZnVuY3Rpb24gdXBsb2FkU3VjY2VzcyhyZXNwb25zZSwgZmlsZSwgZmlsZUxpc3QpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXNwb25zZS5tZXNzYWdlLCBudWxsKTtcblxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCdkaXZJbXBvcnRGbG93TW9kZWxXcmFwJyk7XG4gICAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYmluZFVwbG9hZEV4RGF0YTogZnVuY3Rpb24gYmluZFVwbG9hZEV4RGF0YSgpIHtcbiAgICAgIHRoaXMuaW1wb3J0RVhEYXRhLm1vZGVsTW9kdWxlSWQgPSB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWQ7XG4gICAgfSxcbiAgICBlZGl0TW9kZWxCdXR0b246IGZ1bmN0aW9uIGVkaXRNb2RlbEJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiBlZGl0LW1vZGVsXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5lZGl0TW9kZWwocGFyYW1zLnJvd1tpZEZpZWxkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGVkaXRNb2RlbDogZnVuY3Rpb24gZWRpdE1vZGVsKHJlY29yZElkKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0RWRpdE1vZGVsVVJMLCB7XG4gICAgICAgIG1vZGVsSWQ6IHJlY29yZElkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHJlc3VsdC5kYXRhLmVkaXRNb2RlbFdlYlVybCwge1xuICAgICAgICAgIHRpdGxlOiBcIua1geeoi+iuvuiuoVwiLFxuICAgICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICAgIH0sIDApO1xuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibW9kdWxlLWxpc3Qtd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBpZD1cImRpdk5ld0Zsb3dNb2RlbFdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFwiIHN0eWxlPVwicGFkZGluZzogMTBweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1mb3JtIHJlZj1cImZsb3dNb2RlbEVudGl0eVwiIDptb2RlbD1cImZsb3dNb2RlbEVudGl0eVwiIDpydWxlcz1cInJ1bGVWYWxpZGF0ZVwiIDpsYWJlbC13aWR0aD1cIjEwMFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cIuaooeWei+WQjeensO+8mlwiIHByb3A9XCJtb2RlbE5hbWVcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVwiZmxvd01vZGVsRW50aXR5Lm1vZGVsTmFtZVwiPjwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cIuaooeWei0tlee+8mlwiIHByb3A9XCJtb2RlbFN0YXJ0S2V5XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cImZsb3dNb2RlbEVudGl0eS5tb2RlbFN0YXJ0S2V5XCI+PC9pLWlucHV0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVwi5o+P6L+w77yaXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cImZsb3dNb2RlbEVudGl0eS5tb2RlbERlc2NcIiB0eXBlPVwidGV4dGFyZWFcIiA6YXV0b3NpemU9XCJ7bWluUm93czogOCxtYXhSb3dzOiA4fVwiPjwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1vdXRlci13cmFwXCIgc3R5bGU9XCJoZWlnaHQ6IDQwcHg7cGFkZGluZy1yaWdodDogMTBweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1pbm5lci13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwiaGFuZGxlU3VibWl0Rmxvd01vZGVsRWRpdChcXCdmbG93TW9kZWxFbnRpdHlcXCcpXCI+IOS/nSDlrZg8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVwiaGFuZGxlQ2xvc2UoXFwnZGl2TmV3Rmxvd01vZGVsV3JhcFxcJylcIj7lhbMg6ZetPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBpZD1cImRpdkltcG9ydEZsb3dNb2RlbFdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFwiIHN0eWxlPVwicGFkZGluZzogMTBweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXBsb2FkIDpkYXRhPVwiaW1wb3J0RVhEYXRhXCIgOmJlZm9yZS11cGxvYWQ9XCJiaW5kVXBsb2FkRXhEYXRhXCIgOm9uLXN1Y2Nlc3M9XCJ1cGxvYWRTdWNjZXNzXCIgbXVsdGlwbGUgdHlwZT1cImRyYWdcIiBuYW1lPVwiZmlsZVwiIGFjdGlvbj1cIi4uLy4uLy4uL1BsYXRGb3JtL0J1aWxkZXIvRmxvd01vZGVsL0ltcG9ydFByb2Nlc3NNb2RlbC5kb1wiIGFjY2VwdD1cIi5icG1uXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwicGFkZGluZzogMjBweCAwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGljb24gdHlwZT1cImlvcy1jbG91ZC11cGxvYWRcIiBzaXplPVwiNTJcIiBzdHlsZT1cImNvbG9yOiAjMzM5OWZmXCI+PC9pY29uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPkNsaWNrIG9yIGRyYWcgZmlsZXMgaGVyZSB0byB1cGxvYWQ8L3A+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91cGxvYWQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tb3V0ZXItd3JhcFwiIHN0eWxlPVwiaGVpZ2h0OiA0MHB4O3BhZGRpbmctcmlnaHQ6IDEwcHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24taW5uZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XCJoYW5kbGVDbG9zZShcXCdkaXZJbXBvcnRGbG93TW9kZWxXcmFwXFwnKVwiPuWFsyDpl608L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibGlzdC1idXR0b24td3JhcFwiIGNsYXNzPVwibGlzdC1idXR0b24tb3V0ZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2R1bGUtbGlzdC1uYW1lXCI+PEljb24gdHlwZT1cImlvcy1hcnJvdy1kcm9wcmlnaHQtY2lyY2xlXCIgLz4mbmJzcDvmqKHlnZfjgJB7e2dldE1vZHVsZU5hbWUoKX1944CRPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtYnV0dG9uLWlubmVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uICB0eXBlPVwic3VjY2Vzc1wiIEBjbGljaz1cImFkZCgpXCIgaWNvbj1cIm1kLWFkZFwiPuaWsOWinjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJpbXBvcnRNb2RlbCgpXCIgaWNvbj1cIm1kLWFkZFwiPuS4iuS8oOaooeWeiyA8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJlcnJvclwiIGljb249XCJtZC1hbGJ1bXNcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj7lpI3liLY8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJlcnJvclwiIGljb249XCJtZC1ib29rbWFya3NcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj7ljoblj7LmqKHlnos8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJlcnJvclwiIGljb249XCJtZC1icnVzaFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPuWkjeWItklEPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cIm1vdmUoXFwndXBcXCcpXCIgaWNvbj1cIm1kLWFycm93LXVwXCI+5LiK56e7PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cIm1vdmUoXFwnZG93blxcJylcIiBpY29uPVwibWQtYXJyb3ctZG93blwiPuS4i+enuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogcmlnaHQ7d2lkdGg6IDIwMHB4O21hcmdpbi1yaWdodDogMTBweDtcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVwiaW5wdXRfYm9yZGVyX2JvdHRvbVwiIHYtbW9kZWw9XCJzZWFyY2hUZXh0XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY2xlYXI6IGJvdGhcIj48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cImxpc3RIZWlnaHRcIiBzdHJpcGUgYm9yZGVyIDpjb2x1bW5zPVwiY29sdW1uc0NvbmZpZ1wiIDpkYXRhPVwidGFibGVEYXRhXCJcXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiaXYtbGlzdC10YWJsZVwiIDpoaWdobGlnaHQtcm93PVwidHJ1ZVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tc2VsZWN0aW9uLWNoYW5nZT1cInNlbGVjdGlvbkNoYW5nZVwiPjwvaS10YWJsZT5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJtb2R1bGUtbGlzdC13ZWJmb3JtLWNvbXBcIiwge1xuICBwcm9wczogWydsaXN0SGVpZ2h0JywgJ21vZHVsZURhdGEnLCAnYWN0aXZlVGFiTmFtZSddLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBlZGl0VmlldzogXCIvUGxhdEZvcm0vQnVpbGRlci9Gb3JtL0RldGFpbFZpZXdcIixcbiAgICAgICAgcmVsb2FkRGF0YTogXCIvUGxhdEZvcm0vQnVpbGRlci9Gb3JtL0dldExpc3REYXRhXCIsXG4gICAgICAgIGRlbGV0ZTogXCIvUGxhdEZvcm0vQnVpbGRlci9Gb3JtL0RlbGV0ZVwiLFxuICAgICAgICBtb3ZlOiBcIi9QbGF0Rm9ybS9CdWlsZGVyL0Zvcm0vTW92ZVwiXG4gICAgICB9LFxuICAgICAgaWRGaWVsZE5hbWU6IFwiZm9ybUlkXCIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IHtcbiAgICAgICAgZm9ybU1vZHVsZUlkOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW5Y+3JyxcbiAgICAgICAga2V5OiAnZm9ybUNvZGUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgd2lkdGg6IDgwXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn6KGo5Y2V5ZCN56ewJyxcbiAgICAgICAga2V5OiAnZm9ybU5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+WUr+S4gOWQjScsXG4gICAgICAgIGtleTogJ2Zvcm1TaW5nbGVOYW1lJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflpIfms6gnLFxuICAgICAgICBrZXk6ICdmb3JtRGVzYycsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW6L6R5pe26Ze0JyxcbiAgICAgICAga2V5OiAnZm9ybVVwZGF0ZVRpbWUnLFxuICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlUmVuZGVyZXIuVG9EYXRlWVlZWV9NTV9ERChoLCBwYXJhbXMucm93LmZvcm1VcGRhdGVUaW1lKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgIGtleTogJ2Zvcm1JZCcsXG4gICAgICAgIHdpZHRoOiAxMjAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCB3aW5kb3cuX21vZHVsZWxpc3R3ZWJmb3JtY29tcC5pZEZpZWxkTmFtZSwgd2luZG93Ll9tb2R1bGVsaXN0d2ViZm9ybWNvbXApLCBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkRlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIHdpbmRvdy5fbW9kdWxlbGlzdHdlYmZvcm1jb21wLmlkRmllbGROYW1lLCB3aW5kb3cuX21vZHVsZWxpc3R3ZWJmb3JtY29tcCldKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgdGFibGVEYXRhT3JpZ2luYWw6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiA1MDAsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgc2VhcmNoVGV4dDogXCJcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgd2luZG93Ll9tb2R1bGVsaXN0d2ViZm9ybWNvbXAgPSB0aGlzO1xuICB9LFxuICB3YXRjaDoge1xuICAgIG1vZHVsZURhdGE6IGZ1bmN0aW9uIG1vZHVsZURhdGEobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGFjdGl2ZVRhYk5hbWU6IGZ1bmN0aW9uIGFjdGl2ZVRhYk5hbWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIHNlYXJjaFRleHQ6IGZ1bmN0aW9uIHNlYXJjaFRleHQobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgIHZhciBmaWx0ZXJUYWJsZURhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGVEYXRhW2ldO1xuXG4gICAgICAgICAgaWYgKHJvdy5mb3JtQ29kZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5mb3JtTmFtZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IGZpbHRlclRhYmxlRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gdGhpcy50YWJsZURhdGFPcmlnaW5hbDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBzZWxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZShzZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uUm93cyA9IHNlbGVjdGlvbjtcbiAgICB9LFxuICAgIHJlbG9hZERhdGE6IGZ1bmN0aW9uIHJlbG9hZERhdGEoKSB7XG4gICAgICBpZiAodGhpcy5tb2R1bGVEYXRhICE9IG51bGwgJiYgdGhpcy5hY3RpdmVUYWJOYW1lID09IFwibGlzdC13ZWJmb3JtXCIpIHtcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24uZm9ybU1vZHVsZUlkLnZhbHVlID0gdGhpcy5tb2R1bGVEYXRhLm1vZHVsZUlkO1xuICAgICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoKHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkRGF0YSwgdGhpcy5wYWdlTnVtLCB0aGlzLnBhZ2VTaXplLCB0aGlzLnNlYXJjaENvbmRpdGlvbiwgdGhpcywgdGhpcy5pZEZpZWxkTmFtZSwgdHJ1ZSwgZnVuY3Rpb24gKHJlc3VsdCwgcGFnZUFwcE9iaikge1xuICAgICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhT3JpZ2luYWwgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZCgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdFZpZXcsIHtcbiAgICAgICAgICBcIm9wXCI6IFwiYWRkXCIsXG4gICAgICAgICAgXCJtb2R1bGVJZFwiOiB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWRcbiAgICAgICAgfSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuT3Blbk5ld1dpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICB9LCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqeaooeWdlyFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlZGl0OiBmdW5jdGlvbiBlZGl0KHJlY29yZElkKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdFZpZXcsIHtcbiAgICAgICAgXCJvcFwiOiBcInVwZGF0ZVwiLFxuICAgICAgICBcInJlY29yZElkXCI6IHJlY29yZElkXG4gICAgICB9KTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3Blbk5ld1dpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gZGVsKHJlY29yZElkKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZURlbGV0ZVJvdyh0aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZSwgcmVjb3JkSWQsIHRoaXMpO1xuICAgIH0sXG4gICAgc3RhdHVzRW5hYmxlOiBmdW5jdGlvbiBzdGF0dXNFbmFibGUoc3RhdHVzTmFtZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh0aGlzLmFjSW50ZXJmYWNlLnN0YXR1c0NoYW5nZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCBhcHBMaXN0LmlkRmllbGROYW1lLCBzdGF0dXNOYW1lLCBhcHBMaXN0KTtcbiAgICB9LFxuICAgIG1vdmU6IGZ1bmN0aW9uIG1vdmUodHlwZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3TW92ZUZhY2UodGhpcy5hY0ludGVyZmFjZS5tb3ZlLCB0aGlzLnNlbGVjdGlvblJvd3MsIHRoaXMuaWRGaWVsZE5hbWUsIHR5cGUsIHRoaXMpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibW9kdWxlLWxpc3Qtd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3QtYnV0dG9uLXdyYXBcIiBjbGFzcz1cImxpc3QtYnV0dG9uLW91dGVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1idXR0b24taW5uZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gIHR5cGU9XCJzdWNjZXNzXCIgQGNsaWNrPVwiYWRkKClcIiBpY29uPVwibWQtYWRkXCI+5paw5aKePC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYWRkXCI+5byV5YWlVVJMIDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLWFsYnVtc1wiPuWkjeWItjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLXByaWNldGFnXCI+6aKE6KeIPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYm9va21hcmtzXCI+5Y6G5Y+y54mI5pysPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYnJ1c2hcIj7lpI3liLZJRDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ3VwXFwnKVwiIGljb249XCJtZC1hcnJvdy11cFwiPuS4iuenuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ2Rvd25cXCcpXCIgaWNvbj1cIm1kLWFycm93LWRvd25cIj7kuIvnp7s8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiAyMDBweDttYXJnaW4tcmlnaHQ6IDEwcHg7XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cImlucHV0X2JvcmRlcl9ib3R0b21cIiB2LW1vZGVsPVwic2VhcmNoVGV4dFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImNsZWFyOiBib3RoXCI+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XCJsaXN0SGVpZ2h0XCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cImNvbHVtbnNDb25maWdcIiA6ZGF0YT1cInRhYmxlRGF0YVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIml2LWxpc3QtdGFibGVcIiA6aGlnaGxpZ2h0LXJvdz1cInRydWVcIlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XCJzZWxlY3Rpb25DaGFuZ2VcIj48L2ktdGFibGU+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic3FsLWdlbmVyYWwtZGVzaWduLWNvbXBcIiwge1xuICBwcm9wczogW1wic3FsRGVzaWduZXJIZWlnaHRcIiwgXCJ2YWx1ZVwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3FsVGV4dDogXCJcIixcbiAgICAgIHNlbGVjdGVkSXRlbVZhbHVlOiBcIuivtOaYjlwiLFxuICAgICAgc2VsZlRhYmxlRmllbGRzOiBbXSxcbiAgICAgIHBhcmVudFRhYmxlRmllbGRzOiBbXVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgc3FsVGV4dDogZnVuY3Rpb24gc3FsVGV4dChuZXdWYWwpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgbmV3VmFsKTtcbiAgICB9LFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShuZXdWYWwpIHtcbiAgICAgIHRoaXMuc3FsVGV4dCA9IG5ld1ZhbDtcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5zcWxDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoJChcIiNUZXh0QXJlYVNRTEVkaXRvclwiKVswXSwge1xuICAgICAgbW9kZTogXCJ0ZXh0L3gtc3FsXCIsXG4gICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgIGZvbGRHdXR0ZXI6IHRydWUsXG4gICAgICB0aGVtZTogXCJtb25va2FpXCJcbiAgICB9KTtcbiAgICB0aGlzLnNxbENvZGVNaXJyb3Iuc2V0U2l6ZShcIjEwMCVcIiwgdGhpcy5zcWxEZXNpZ25lckhlaWdodCk7XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5zcWxDb2RlTWlycm9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChjTWlycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhjTWlycm9yLmdldFZhbHVlKCkpO1xuICAgICAgX3NlbGYuc3FsVGV4dCA9IGNNaXJyb3IuZ2V0VmFsdWUoKTtcbiAgICB9KTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcbiAgICAgIHRoaXMuc3FsQ29kZU1pcnJvci5nZXRWYWx1ZSgpO1xuICAgIH0sXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgICB0aGlzLnNxbENvZGVNaXJyb3Iuc2V0VmFsdWUodmFsdWUpO1xuICAgIH0sXG4gICAgc2V0QWJvdXRUYWJsZUZpZWxkczogZnVuY3Rpb24gc2V0QWJvdXRUYWJsZUZpZWxkcyhzZWxmVGFibGVGaWVsZHMsIHBhcmVudFRhYmxlRmllbGRzKSB7XG4gICAgICB0aGlzLnNlbGZUYWJsZUZpZWxkcyA9IHNlbGZUYWJsZUZpZWxkcztcbiAgICAgIHRoaXMucGFyZW50VGFibGVGaWVsZHMgPSBwYXJlbnRUYWJsZUZpZWxkcztcbiAgICB9LFxuICAgIGluc2VydEVudlRvRWRpdG9yOiBmdW5jdGlvbiBpbnNlcnRFbnZUb0VkaXRvcihjb2RlKSB7XG4gICAgICB0aGlzLmluc2VydENvZGVBdEN1cnNvcihjb2RlKTtcbiAgICB9LFxuICAgIGluc2VydEZpZWxkVG9FZGl0b3I6IGZ1bmN0aW9uIGluc2VydEZpZWxkVG9FZGl0b3Ioc291cmNlVHlwZSwgZXZlbnQpIHtcbiAgICAgIHZhciBzb3VyY2VGaWVsZHMgPSBudWxsO1xuXG4gICAgICBpZiAoc291cmNlVHlwZSA9PSBcInNlbGZUYWJsZUZpZWxkc1wiKSB7XG4gICAgICAgIHNvdXJjZUZpZWxkcyA9IHRoaXMuc2VsZlRhYmxlRmllbGRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc291cmNlRmllbGRzID0gdGhpcy5wYXJlbnRUYWJsZUZpZWxkcztcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvdXJjZUZpZWxkc1tpXS5maWVsZE5hbWUgPT0gZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLmluc2VydENvZGVBdEN1cnNvcihzb3VyY2VGaWVsZHNbaV0udGFibGVOYW1lICsgXCIuXCIgKyBzb3VyY2VGaWVsZHNbaV0uZmllbGROYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgaW5zZXJ0Q29kZUF0Q3Vyc29yOiBmdW5jdGlvbiBpbnNlcnRDb2RlQXRDdXJzb3IoY29kZSkge1xuICAgICAgdmFyIGRvYyA9IHRoaXMuc3FsQ29kZU1pcnJvci5nZXREb2MoKTtcbiAgICAgIHZhciBjdXJzb3IgPSBkb2MuZ2V0Q3Vyc29yKCk7XG4gICAgICBkb2MucmVwbGFjZVJhbmdlKGNvZGUsIGN1cnNvcik7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXY+XFxcclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cIlRleHRBcmVhU1FMRWRpdG9yXCI+PC90ZXh0YXJlYT5cXFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0O21hcmdpbi10b3A6IDhweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwIHNpemU9XCJzbWFsbFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi35omA5Zyo57uE57uHSUR9XFwnKVwiPue7hOe7h0lkPC9CdXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBAY2xpY2s9XCJpbnNlcnRFbnZUb0VkaXRvcihcXCcje0FwaVZhci7lvZPliY3nlKjmiLfmiYDlnKjnu4Tnu4flkI3np7B9XFwnKVwiPue7hOe7h+WQjeensDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi3SUR9XFwnKVwiPueUqOaIt0lkPC9CdXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBAY2xpY2s9XCJpbnNlcnRFbnZUb0VkaXRvcihcXCcje0FwaVZhci7lvZPliY3nlKjmiLflkI3np7B9XFwnKVwiPueUqOaIt+WQjeensDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tEYXRlVGltZS7lubTlubTlubTlubQt5pyI5pyILeaXpeaXpX1cXCcpXCI+eXl5eS1NTS1kZDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24+6K+05piOPC9CdXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6IDhweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0O21hcmdpbjogNHB4IDEwcHhcIj7mnKzooajlrZfmrrU8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCBwbGFjZWhvbGRlcj1cIum7mOiupOS9v+eUqElk5a2X5q61XCIgc2l6ZT1cInNtYWxsXCIgc3R5bGU9XCJ3aWR0aDoxNzVweFwiIEBvbi1jaGFuZ2U9XCJpbnNlcnRGaWVsZFRvRWRpdG9yKFxcJ3NlbGZUYWJsZUZpZWxkc1xcJywkZXZlbnQpXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gc2VsZlRhYmxlRmllbGRzXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdDttYXJnaW46IDRweCAxMHB4XCI+54i26KGo5a2X5q61PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnRcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHNpemU9XCJzbWFsbFwiIHN0eWxlPVwid2lkdGg6MTc3cHhcIiBAb24tY2hhbmdlPVwiaW5zZXJ0RmllbGRUb0VkaXRvcihcXCdwYXJlbnRUYWJsZUZpZWxkc1xcJywkZXZlbnQpXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gcGFyZW50VGFibGVGaWVsZHNcIiA6dmFsdWU9XCJpdGVtLmZpZWxkTmFtZVwiIDprZXk9XCJpdGVtLmZpZWxkTmFtZVwiPnt7aXRlbS5maWVsZENhcHRpb259fTwvaS1vcHRpb24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyJdfQ==
