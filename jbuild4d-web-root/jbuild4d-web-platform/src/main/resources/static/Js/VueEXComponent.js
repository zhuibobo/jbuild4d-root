"use strict";

Vue.component("dataset-simple-select-comp", {
  data: function data() {
    return {
      acInterface: {
        getDataSetData: "/PlatFormRest/Builder/DataSet/DataSetMain/GetDataSetsForZTreeNodeList"
      },
      dataSetTree: {
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
              if (treeNode.nodeTypeName == "Table") {}
            }
          }
        },
        tableTreeData: null,
        selectedTableName: "无"
      }
    };
  },
  mounted: function mounted() {
    this.bindDataSetTree();
  },
  methods: {
    bindDataSetTree: function bindDataSetTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getDataSetData, {}, function (result) {
        if (result.success) {
          _self.dataSetTree.tableTreeData = result.data;
          _self.dataSetTree.tableTreeObj = $.fn.zTree.init($("#dataSetZTreeUL"), _self.dataSetTree.tableTreeSetting, _self.dataSetTree.tableTreeData);

          _self.dataSetTree.tableTreeObj.expandAll(true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    }
  },
  template: '<div class="js-code-fragment-wrap">\
                    <ul id="dataSetZTreeUL" class="ztree"></ul>\
                </div>'
});
"use strict";

Vue.component("db-table-relation-comp", {
  data: function data() {
    return {
      acInterface: {
        getTablesDataUrl: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
        getTableFieldsUrl: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTableFieldsByTableId"
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
      resultData: [],
      treeNodeSetting: {
        MainTableNodeImg: "../../../Themes/Png16X16/page_key.png",
        SubTableNodeImg: "../../../Themes/Png16X16/page_refresh.png"
      }
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
    appendMainTableNodeProp: function appendMainTableNodeProp(node) {
      node._nodeExType = "MainNode";
      node.icon = this.treeNodeSetting.MainTableNodeImg;
    },
    appendSubTableNodeProp: function appendSubTableNodeProp(node) {
      node._nodeExType = "SubNode";
      node.icon = this.treeNodeSetting.SubTableNodeImg;
    },
    buildRelationTableNode: function buildRelationTableNode(sourceNode, treeNodeId) {
      if (this.relationTableTree.currentSelectedNode._nodeExType == "root") {
        this.appendMainTableNodeProp(sourceNode);
      } else {
        this.appendSubTableNodeProp(sourceNode);
      }

      sourceNode.tableId = sourceNode.id;

      if (treeNodeId) {
        sourceNode.id = treeNodeId;
      } else {
        sourceNode.id = StringUtility.Guid();
      }

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
      var treeNodeData = new Array();

      for (var i = 0; i < tempData.length; i++) {
        var treeNode = {
          "value": tempData[i].tableName,
          "attr1": tempData[i].tableCaption,
          "text": tempData[i].tableCaption + "【" + tempData[i].tableName + "】",
          "id": tempData[i].id,
          "parentId": tempData[i].parentId
        };

        if (tempData[i].parentId == "-1") {
          this.appendMainTableNodeProp(treeNode);
        } else {
          this.appendSubTableNodeProp(treeNode);
        }

        treeNodeData.push(treeNode);
      }

      treeNodeData.push(this.relationTableTree.tableTreeRootData);
      this.relationTableTree.treeObj = $.fn.zTree.init($("#dataRelationZTreeUL"), this.relationTableTree.tableTreeSetting, treeNodeData);
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
          window._dbtablerelationcomp.setValue(jsonString);
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

window.addEventListener("message", function (event) {}, false);
Vue.component("module-list-flow-comp", {
  props: ['listHeight', 'moduleData', 'activeTabName'],
  data: function data() {
    return {
      acInterface: {
        saveModel: "/PlatFormRest/Builder/FlowModel/SaveModel",
        getEditModelURL: "/PlatFormRest/Builder/FlowModel/GetEditModelURL",
        getViewModelURL: "/PlatFormRest/Builder/FlowModel/GetViewModelURL",
        reloadData: "/PlatFormRest/Builder/FlowModel/GetListData",
        getSingleData: "/PlatFormRest/Builder/FlowModel/GetDetailData",
        delete: "/PlatFormRest/Builder/FlowModel/DeleteModel",
        move: "/PlatFormRest/Builder/FlowModel/Move",
        defaultFlowModelImage: "/PlatFormRest/Builder/FlowModel/GetProcessModelMainImg"
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
        width: 140,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            class: "list-row-button-wrap"
          }, [window._modulelistflowcomp.editModelButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp), window._modulelistflowcomp.viewModelButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp), ListPageUtility.IViewTableInnerButton.EditButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp), ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp)]);
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
        modelFromType: "",
        modelMainImageId: "DefModelMainImageId"
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
      },
      defaultFlowModelImageSrc: "",
      value1: false
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
        this.defaultFlowModelImageSrc = BaseUtility.BuildAction(this.acInterface.defaultFlowModelImage, {
          fileId: "defaultFlowModelImage"
        });
        DialogUtility.DialogElem("divNewFlowModelWrap", {
          modal: true,
          width: 670,
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
          _self.defaultFlowModelImageSrc = BaseUtility.BuildAction(_self.acInterface.defaultFlowModelImage, {
            fileId: _self.flowModelEntity.modelMainImageId
          });
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
    uploadFlowModelImageSuccess: function uploadFlowModelImageSuccess(response, file, fileList) {
      var data = response.data;
      this.flowModelEntity.modelMainImageId = data.fileId;
      this.defaultFlowModelImageSrc = BaseUtility.BuildAction(this.acInterface.defaultFlowModelImage, {
        fileId: this.flowModelEntity.modelMainImageId
      });
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
    viewModelButton: function viewModelButton(h, params, idField, pageAppObj) {
      return h('div', {
        class: "list-row-button view-model",
        on: {
          click: function click() {
            pageAppObj.viewModel(params.row[idField]);
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
    },
    viewModel: function viewModel(recordId) {
      AjaxUtility.Post(this.acInterface.getViewModelURL, {
        modelId: recordId
      }, function (result) {
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, result.data.editModelWebUrl, {
          title: "流程浏览",
          modal: true
        }, 0);
      }, "json");
    }
  },
  template: '<div class="module-list-wrap">\
                    <div style="display: none" id="divNewFlowModelWrap">\
                        <div class="general-edit-page-wrap" style="padding: 10px;width: 100%">\
                            <div style="width: 70%;float: left">\
                                <i-form ref="flowModelEntity" :model="flowModelEntity" :rules="ruleValidate" :label-width="100">\
                                    <form-item label="模型名称：" prop="modelName">\
                                        <i-input v-model="flowModelEntity.modelName"></i-input>\
                                    </form-item>\
                                    <form-item label="模型Key：" prop="modelStartKey">\
                                        <i-input v-model="flowModelEntity.modelStartKey"></i-input>\
                                    </form-item>\
                                    <form-item label="描述：">\
                                        <i-input v-model="flowModelEntity.modelDesc" type="textarea" :autosize="{minRows: 11,maxRows: 11}"></i-input>\
                                    </form-item>\
                                </i-form>\
                            </div>\
                            <div style="width: 29%;float: right">\
                                <div>\
                                    <img :src="defaultFlowModelImageSrc" class="flowModelImg" />\
                                </div>\
                                <upload style="margin:10px 12px 0 20px" :data="importEXData" :before-upload="bindUploadExData" :on-success="uploadFlowModelImageSuccess" multiple type="drag" name="file" action="../../../PlatForm/Builder/FlowModel/UploadProcessModelMainImg.do" accept=".png">\
                                    <div style="padding:20px 0px">\
                                        <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>\
                                        <p>上传流程主题图片</p>\
                                    </div>\
                                </upload>\
                            </div>\
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
        editView: "/HTML/Builder/Form/FormDesign.html",
        reloadData: "/PlatFormRest/Builder/Form/GetListData",
        delete: "/PlatFormRest/Builder/Form/Delete",
        move: "/PlatFormRest/Builder/Form/Move"
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
      debugger;
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

Vue.component("module-list-weblist-comp", {
  props: ['listHeight', 'moduleData', 'activeTabName'],
  data: function data() {
    return {
      acInterface: {
        editView: "/HTML/Builder/List/ListDesign.html",
        reloadData: "/PlatFormRest/Builder/List/GetListData",
        delete: "/PlatFormRest/Builder/List/Delete",
        move: "/PlatFormRest/Builder/List/Move"
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
      debugger;
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

Vue.component("select-department-user-dialog", {
  data: function data() {
    return {
      acInterface: {
        getDepartmentTreeData: "/PlatFormRest/SSO/Department/GetDepartmentsByOrganId",
        departmentEditView: "/HTML/SSO/Department/DepartmentEdit.html",
        deleteDepartment: "/PlatFormRest/SSO/Department/Delete",
        moveDepartment: "/PlatFormRest/SSO/Department/Move",
        listEditView: "/HTML/SSO/Department/DepartmentUserEdit.html",
        reloadListData: "/PlatFormRest/SSO/DepartmentUser/GetListData",
        deleteListRecord: "/PlatFormRest/SSO/DepartmentUser/Delete",
        listStatusChange: "/PlatFormRest/SSO/DepartmentUser/StatusChange",
        listMove: "/PlatFormRest/SSO/DepartmentUser/Move"
      },
      treeIdFieldName: "deptId",
      treeObj: null,
      treeSelectedNode: null,
      treeSetting: {
        async: {
          enable: true,
          url: ""
        },
        data: {
          key: {
            name: "deptName"
          },
          simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "deptParentId"
          }
        },
        callback: {
          onClick: function onClick(event, treeId, treeNode) {
            var _self = this.getZTreeObj(treeId)._host;

            _self.treeNodeSelected(event, treeId, treeNode);
          },
          onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {
            appList.treeObj.expandAll(true);
          }
        }
      },
      idFieldName: "DU_ID",
      searchCondition: {
        userName: {
          value: "",
          type: SearchUtility.SearchFieldType.LikeStringType
        },
        account: {
          value: "",
          type: SearchUtility.SearchFieldType.LikeStringType
        },
        userPhoneNumber: {
          value: "",
          type: SearchUtility.SearchFieldType.LikeStringType
        },
        departmentId: {
          value: "",
          type: SearchUtility.SearchFieldType.StringType
        },
        searchInALL: {
          value: "否",
          type: SearchUtility.SearchFieldType.StringType
        }
      },
      columnsConfig: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '用户名',
        key: 'USER_NAME',
        align: "center"
      }, {
        title: '手机号码',
        key: 'USER_PHONE_NUMBER',
        width: 140,
        align: "center"
      }, {
        title: '组织机构',
        key: 'ORGAN_NAME',
        width: 140,
        align: "center"
      }, {
        title: '部门',
        key: 'DEPT_NAME',
        width: 140,
        align: "center"
      }, {
        title: '主属',
        key: 'DU_IS_MAIN',
        width: 70,
        align: "center"
      }],
      tableData: [],
      selectionRows: null,
      pageTotal: 0,
      pageSize: 12,
      pageNum: 1,
      listHeight: 270
    };
  },
  mounted: function mounted() {
    var oldSelectedOrganId = CookieUtility.GetCookie("DMORGSID");

    if (oldSelectedOrganId) {
      this.$refs.selectOrganComp.setOldSelectedOrgan(oldSelectedOrganId);
      this.initTree(oldSelectedOrganId);
    }
  },
  methods: {
    changeOrgan: function changeOrgan(organData) {
      CookieUtility.SetCookie1Month("DMORGSID", organData.organId);
      this.initTree(organData.organId);
      this.clearSearchCondition();
      this.tableData = [];
    },
    initTree: function initTree(organId) {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getDepartmentTreeData, {
        "organId": organId
      }, function (result) {
        if (result.success) {
          _self.$refs.zTreeUL.setAttribute("id", "select-department-user-dialog-" + StringUtility.Guid());

          _self.treeObj = $.fn.zTree.init($(_self.$refs.zTreeUL), _self.treeSetting, result.data);

          _self.treeObj.expandAll(true);

          _self.treeObj._host = _self;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        }
      }, "json");
    },
    treeNodeSelected: function treeNodeSelected(event, treeId, treeNode) {
      this.treeSelectedNode = treeNode;
      this.selectionRows = null;
      this.pageNum = 1;
      this.clearSearchCondition();
      this.searchCondition.departmentId.value = this.treeSelectedNode[this.treeIdFieldName];
      this.reloadData();
    },
    addDepartment: function addDepartment() {
      if (this.treeSelectedNode != null) {
        var url = BaseUtility.BuildView(this.acInterface.departmentEditView, {
          "op": "add",
          "parentId": this.treeSelectedNode[appList.treeIdFieldName]
        });
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {
          title: "部门管理"
        }, 3);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择父节点!", null);
      }
    },
    editDepartment: function editDepartment() {
      if (this.treeSelectedNode != null) {
        var url = BaseUtility.BuildView(this.acInterface.departmentEditView, {
          "op": "update",
          "recordId": this.treeSelectedNode[appList.treeIdFieldName]
        });
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {
          title: "部门管理"
        }, 3);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择需要编辑的节点!", null);
      }
    },
    viewDepartment: function viewDepartment() {
      var url = BaseUtility.BuildView(this.acInterface.departmentEditView, {
        "op": "view",
        "recordId": this.treeSelectedNode[appList.treeIdFieldName]
      });
      DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: "部门管理"
      }, 3);
    },
    delDepartment: function delDepartment() {
      var _self = this;

      var recordId = this.treeSelectedNode[appList.treeIdFieldName];
      DialogUtility.Confirm(window, "确认要删除选定的节点吗？", function () {
        AjaxUtility.Delete(_self.acInterface.deleteDepartment, {
          recordId: recordId
        }, function (result) {
          if (result.success) {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
              appList.treeObj.removeNode(appList.treeSelectedNode);
              appList.treeSelectedNode = null;
            });
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
          }
        }, "json");
      });
    },
    moveDepartment: function moveDepartment(type) {
      if (this.treeSelectedNode != null) {
        var recordId = this.treeSelectedNode[appList.treeIdFieldName];
        AjaxUtility.Post(this.acInterface.moveDepartment, {
          recordId: recordId,
          type: type
        }, function (result) {
          if (result.success) {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
              if (type == "down") {
                if (appList.treeSelectedNode.getNextNode() != null) {
                  appList.treeObj.moveNode(appList.treeSelectedNode.getNextNode(), appList.treeSelectedNode, "next", false);
                }
              } else {
                if (appList.treeSelectedNode.getPreNode() != null) {
                  appList.treeObj.moveNode(appList.treeSelectedNode.getPreNode(), appList.treeSelectedNode, "prev", false);
                }
              }
            });
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
          }
        }, "json");
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择需要编辑的节点!", null);
      }
    },
    newTreeNode: function newTreeNode(newNodeData) {
      var silent = false;
      appList.treeObj.addNodes(this.treeSelectedNode, newNodeData, silent);
    },
    updateNode: function updateNode(newNodeData) {
      this.treeSelectedNode = $.extend(true, this.treeSelectedNode, newNodeData);
      appList.treeObj.updateNode(this.treeSelectedNode);
    },
    clearSearchCondition: function clearSearchCondition() {
      for (var key in this.searchCondition) {
        this.searchCondition[key].value = "";
      }

      this.searchCondition["searchInALL"].value = "否";
    },
    selectionChange: function selectionChange(selection) {
      this.selectionRows = selection;
    },
    reloadData: function reloadData() {
      ListPageUtility.IViewTableLoadDataSearch(this.acInterface.reloadListData, this.pageNum, this.pageSize, this.searchCondition, this, this.idFieldName, true, null, false);
    },
    add: function add() {
      if (this.treeSelectedNode != null) {
        var url = BaseUtility.BuildView(this.acInterface.listEditView, {
          "op": "add",
          "departmentId": this.treeSelectedNode[appList.treeIdFieldName]
        });
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {
          title: "部门用户管理"
        }, 2);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择分组!", null);
      }
    },
    edit: function edit(recordId) {
      var url = BaseUtility.BuildView(this.acInterface.listEditView, {
        "op": "update",
        "recordId": recordId
      });
      DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: "部门用户管理"
      }, 2);
    },
    view: function view(recordId) {
      var url = BaseUtility.BuildView(this.acInterface.listEditView, {
        "op": "view",
        "recordId": recordId
      });
      DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: "部门用户管理"
      }, 2);
    },
    del: function del(recordId) {
      ListPageUtility.IViewTableDeleteRow(this.acInterface.deleteListRecord, recordId, appList);
    },
    statusEnable: function statusEnable(statusName) {
      ListPageUtility.IViewChangeServerStatusFace(this.acInterface.listStatusChange, this.selectionRows, appList.idFieldName, statusName, appList);
    },
    move: function move(type) {
      ListPageUtility.IViewMoveFace(this.acInterface.listMove, this.selectionRows, appList.idFieldName, type, appList);
    },
    moveToAnotherDepartment: function moveToAnotherDepartment() {
      if (this.selectionRows != null && this.selectionRows.length > 0 && this.selectionRows.length == 1) {} else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的记录，每次只能选中一行!", null);
      }
    },
    partTimeJob: function partTimeJob() {
      if (this.selectionRows != null && this.selectionRows.length > 0 && this.selectionRows.length == 1) {} else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的记录，每次只能选中一行!", null);
      }
    },
    changePage: function changePage(pageNum) {
      this.pageNum = pageNum;
      this.reloadData();
      this.selectionRows = null;
    },
    search: function search() {
      this.pageNum = 1;
      this.reloadData();
    },
    beginSelect: function beginSelect() {
      var elem = this.$refs.selectDepartmentUserModelDialogWrap;
      var dialogHeight = 460;

      if (PageStyleUtility.GetPageHeight() > 700) {
        dialogHeight = 660;
      }

      this.listHeight = dialogHeight - 230;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 970,
        height: dialogHeight,
        title: "选择组织机构"
      });
    },
    completed: function completed() {
      console.log(this.selectionRows);

      if (this.selectionRows) {
        this.$emit('on-selected-completed', this.selectionRows);
        this.handleClose();
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请先选中人员!", null);
      }
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectDepartmentUserModelDialogWrap);
    }
  },
  template: "<div ref=\"selectDepartmentUserModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div class=\"list-2column\">\n                        <div class=\"left-outer-wrap\" style=\"width: 180px;top: 10px;left: 10px;bottom: 55px\">\n                            <select-organ-single-comp @on-selected-organ=\"changeOrgan\" ref=\"selectOrganComp\"></select-organ-single-comp>\n                            <div class=\"inner-wrap\" style=\"position:absolute;top: 30px;bottom: 10px;height: auto;overflow: auto\">\n                                <div>\n                                    <ul ref=\"zTreeUL\" class=\"ztree\"></ul>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"right-outer-wrap iv-list-page-wrap\" style=\"padding: 10px;left: 200px;top: 10px;right: 10px;bottom: 55px\">\n                            <div class=\"list-simple-search-wrap\">\n                                <table class=\"ls-table\">\n                                    <colgroup>\n                                        <col style=\"width: 80px\">\n                                        <col style=\"\">\n                                        <col style=\"width: 100px\">\n                                        <col style=\"\">\n                                        <col style=\"width: 80px\">\n                                        <col style=\"width: 85px\">\n                                        <col style=\"width: 80px\">\n                                    </colgroup>\n                                    <tr class=\"ls-table-row\">\n                                        <td>\u7528\u6237\u540D\uFF1A</td>\n                                        <td>\n                                            <i-input v-model=\"searchCondition.userName.value\" placeholder=\"\"></i-input>\n                                        </td>\n                                        <td>\u624B\u673A\uFF1A</td>\n                                        <td>\n                                            <i-input v-model=\"searchCondition.userPhoneNumber.value\"></i-input>\n                                        </td>\n                                        <td>\u5168\u5C40\uFF1A</td>\n                                        <td>\n                                            <radio-group v-model=\"searchCondition.searchInALL.value\">\n                                                <radio label=\"\u662F\">\u662F</radio>\n                                                <radio label=\"\u5426\">\u5426</radio>\n                                            </radio-group>\n                                        </td>\n                                        <td><i-button type=\"primary\" @click=\"search\"><Icon type=\"android-search\"></Icon> \u67E5\u8BE2 </i-button></td>\n                                    </tr>\n                                </table>\n                            </div>\n                            <i-table :height=\"listHeight\" stripe border :columns=\"columnsConfig\" :data=\"tableData\"\n                                     class=\"iv-list-table\" :highlight-row=\"true\"\n                                     @on-selection-change=\"selectionChange\"></i-table>\n                            <div style=\"float: right;\">\n                                <page @on-change=\"changePage\" :current.sync=\"pageNum\" :page-size=\"pageSize\" show-total\n                                      :total=\"pageTotal\"></page>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"button-outer-wrap\" style=\"bottom: 12px;right: 12px\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"completed()\" icon=\"md-checkmark\">\u786E\u8BA4</i-button>\n                                <i-button @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("select-organ-comp", {
  data: function data() {
    return {
      acInterface: {
        getOrganDataUrl: "/PlatFormRest/SSO/Organ/GetFullOrgan"
      },
      jsEditorInstance: null,
      organTree: {
        treeObj: null,
        treeSetting: {
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
              name: "organName"
            },
            simpleData: {
              enable: true,
              idKey: "organId",
              pIdKey: "organParentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {}
          }
        },
        treeData: null,
        clickNode: null
      },
      searchOrganText: "",
      selectedOrganConfig: [{
        title: '组织名称',
        key: 'organName',
        align: "center"
      }, {
        title: '操作',
        key: 'organId',
        width: 65,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            class: "list-row-button-wrap"
          }, [ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, window._modulelistflowcomp.idFieldName, window._modulelistflowcomp)]);
        }
      }],
      selectedOrganData: []
    };
  },
  mounted: function mounted() {
    this.getOrganDataInitTree();
  },
  methods: {
    beginSelectOrgan: function beginSelectOrgan() {
      var elem = this.$refs.selectOrganModelDialogWrap;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 670,
        height: 500,
        title: "选择组织机构"
      });
    },
    getOrganDataInitTree: function getOrganDataInitTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getOrganDataUrl, {}, function (result) {
        if (result.success) {
          _self.organTree.treeData = result.data;

          _self.$refs.organZTreeUL.setAttribute("id", "select-organ-comp-" + StringUtility.Guid());

          _self.organTree.treeObj = $.fn.zTree.init($(_self.$refs.organZTreeUL), _self.organTree.treeSetting, _self.organTree.treeData);

          _self.organTree.treeObj.expandAll(true);

          fuzzySearchTreeObj(_self.organTree.treeObj, _self.$refs.txt_organ_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    selectedOrgan: function selectedOrgan(treeNode) {
      if (!treeNode) {}

      this.selectedOrganData.push(treeNode);
    },
    removeAllOrgan: function removeAllOrgan() {},
    removeSingleOrgan: function removeSingleOrgan() {}
  },
  template: "<div>\n                    <div class=\"select-view-organ-wrap\">\n                        <div class=\"text\">\u8BF7\u9009\u62E9\u7EC4\u7EC7</div>\n                        <div class=\"value\"></div>\n                        <div class=\"id\"></div>\n                        <div class=\"button\" @click=\"beginSelectOrgan()\"><Icon type=\"ios-funnel\" />&nbsp;\u9009\u62E9</div>\n                    </div>\n                    <div ref=\"selectOrganModelDialogWrap\" class=\"c3-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                        <div class=\"c3-select-model-source-wrap\">\n                            <i-input search class=\"input_border_bottom\" ref=\"txt_organ_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u7EC4\u7EC7\u673A\u6784\u540D\u79F0\">\n                            </i-input>\n                            <div class=\"inner-wrap div-custom-scroll\">\n                                <ul ref=\"organZTreeUL\" class=\"ztree\"></ul>\n                            </div>\n                        </div>\n                        <div class=\"c3-select-model-button-wrap\">\n                            <div class=\"to_selected_button\">\n                                <Icon type=\"ios-arrow-dropright-circle\" />\n                            </div>\n                            <div>\n                                <Icon type=\"ios-arrow-dropleft-circle\" />\n                            </div>\n                        </div>\n                        <div class=\"c3-select-model-selected-wrap\">\n                            <div class=\"selected-title\"><Icon type=\"md-done-all\" /> \u5DF2\u9009\u7EC4\u7EC7</div>\n                            <div style=\"margin: 2px\">\n                                <i-table stripe :columns=\"selectedOrganConfig\" :data=\"selectedOrganData\" class=\"iv-list-table\" :highlight-row=\"true\" :show-header=\"false\"></i-table>\n                            </div>\n                        </div>\n                        <div class=\"button-outer-wrap\" style=\"height: 40px;padding-right: 10px\">\n                            <div class=\"button-inner-wrap\">\n                                <button-group>\n                                    <i-button type=\"primary\" @click=\"handleSubmitFlowModelEdit('flowModelEntity')\"> \u4FDD \u5B58</i-button>\n                                    <i-button @click=\"handleClose('divNewFlowModelWrap')\">\u5173 \u95ED</i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("select-organ-single-comp", {
  data: function data() {
    return {
      acInterface: {
        getOrganDataUrl: "/PlatFormRest/SSO/Organ/GetFullOrgan",
        getSingleOrganDataUrl: "/PlatFormRest/SSO/Organ/GetDetailData"
      },
      jsEditorInstance: null,
      organTree: {
        treeObj: null,
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "organName"
            },
            simpleData: {
              enable: true,
              idKey: "organId",
              pIdKey: "organParentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              var _self = this.getZTreeObj(treeId)._host;

              _self.selectedOrgan(treeNode);

              _self.handleClose();
            }
          }
        },
        treeData: null,
        clickNode: null
      },
      selectedOrganData: null
    };
  },
  mounted: function mounted() {},
  methods: {
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectOrganModelDialogWrap);
    },
    beginSelectOrgan: function beginSelectOrgan() {
      var elem = this.$refs.selectOrganModelDialogWrap;
      this.getOrganDataInitTree();
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 470,
        height: 500,
        title: "选择组织机构"
      });
    },
    getOrganDataInitTree: function getOrganDataInitTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getOrganDataUrl, {}, function (result) {
        if (result.success) {
          _self.organTree.treeData = result.data;

          _self.$refs.organZTreeUL.setAttribute("id", "select-organ-single-comp-" + StringUtility.Guid());

          _self.organTree.treeObj = $.fn.zTree.init($(_self.$refs.organZTreeUL), _self.organTree.treeSetting, _self.organTree.treeData);

          _self.organTree.treeObj.expandAll(true);

          _self.organTree.treeObj._host = _self;
          fuzzySearchTreeObj(_self.organTree.treeObj, _self.$refs.txt_organ_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    selectedOrgan: function selectedOrgan(organData) {
      this.selectedOrganData = organData;
      this.$emit('on-selected-organ', organData);
    },
    getSelectedOrganName: function getSelectedOrganName() {
      if (this.selectedOrganData == null) {
        return "请选择组织机构";
      } else {
        return this.selectedOrganData.organName;
      }
    },
    setOldSelectedOrgan: function setOldSelectedOrgan(organId) {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getSingleOrganDataUrl, {
        "recordId": organId
      }, function (result) {
        if (result.success) {
          _self.selectedOrganData = result.data;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    }
  },
  template: "<div>\n                    <div class=\"select-view-organ-wrap\">\n                        <div class=\"text\">{{getSelectedOrganName()}}</div>\n                        <div class=\"value\"></div>\n                        <div class=\"id\"></div>\n                        <div class=\"button\" @click=\"beginSelectOrgan()\"><Icon type=\"ios-funnel\" />&nbsp;\u9009\u62E9</div>\n                    </div>\n                    <div ref=\"selectOrganModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                        <div class=\"c1-select-model-source-wrap\">\n                            <i-input search class=\"input_border_bottom\" ref=\"txt_organ_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u7EC4\u7EC7\u673A\u6784\u540D\u79F0\">\n                            </i-input>\n                            <div class=\"inner-wrap div-custom-scroll\">\n                                <ul ref=\"organZTreeUL\" class=\"ztree\"></ul>\n                            </div>\n                        </div>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("select-tree-data-dialog-comp", {
  data: function data() {
    return {
      acInterface: {
        getOrganDataUrl: "/PlatFormRest/SSO/Organ/GetFullOrgan",
        getSingleOrganDataUrl: "/PlatFormRest/SSO/Organ/GetDetailData"
      },
      jsEditorInstance: null,
      organTree: {
        treeObj: null,
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            chkStyle: "radio",
            radioType: "all"
          },
          data: {
            key: {
              name: "organName"
            },
            simpleData: {
              enable: true,
              idKey: "organId",
              pIdKey: "organParentId",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              var _self = this.getZTreeObj(treeId)._host;

              _self.selectedOrgan(treeNode);

              _self.handleClose();
            }
          }
        },
        treeData: null,
        clickNode: null
      },
      selectedOrganData: null
    };
  },
  mounted: function mounted() {},
  methods: {
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectOrganModelDialogWrap);
    },
    beginSelectOrgan: function beginSelectOrgan() {
      var elem = this.$refs.selectOrganModelDialogWrap;
      this.getOrganDataInitTree();
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 470,
        height: 500,
        title: "选择组织机构"
      });
    },
    getOrganDataInitTree: function getOrganDataInitTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getOrganDataUrl, {}, function (result) {
        if (result.success) {
          _self.organTree.treeData = result.data;

          _self.$refs.organZTreeUL.setAttribute("id", "select-organ-single-comp-" + StringUtility.Guid());

          _self.organTree.treeObj = $.fn.zTree.init($(_self.$refs.organZTreeUL), _self.organTree.treeSetting, _self.organTree.treeData);

          _self.organTree.treeObj.expandAll(true);

          _self.organTree.treeObj._host = _self;
          fuzzySearchTreeObj(_self.organTree.treeObj, _self.$refs.txt_organ_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    selectedOrgan: function selectedOrgan(organData) {
      this.selectedOrganData = organData;
      this.$emit('on-selected-organ', organData);
    },
    getSelectedOrganName: function getSelectedOrganName() {
      if (this.selectedOrganData == null) {
        return "请选择组织机构";
      } else {
        return this.selectedOrganData.organName;
      }
    },
    setOldSelectedOrgan: function setOldSelectedOrgan(organId) {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getSingleOrganDataUrl, {
        "recordId": organId
      }, function (result) {
        if (result.success) {
          _self.selectedOrganData = result.data;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    }
  },
  template: "<div ref=\"selectDepartmentModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div class=\"c1-select-model-source-wrap\">\n                        <i-input search class=\"input_border_bottom\" ref=\"txt_organ_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u90E8\u95E8\u540D\u79F0\">\n                        </i-input>\n                        <div class=\"inner-wrap div-custom-scroll\">\n                            <ul ref=\"organZTreeUL\" class=\"ztree\"></ul>\n                        </div>\n                    </div>\n                    \n                </div>"
});
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
"use strict";

Vue.component("sso-app-detail-from-comp", {
  data: function data() {
    return {};
  },
  mounted: function mounted() {},
  methods: {},
  template: ""
});
"use strict";

Vue.component("sso-app-interface-list-comp", {
  data: function data() {
    return {};
  },
  mounted: function mounted() {},
  methods: {},
  template: ""
});
"use strict";

Vue.component("sso-app-sub-system-list-comp", {
  data: function data() {
    return {
      appEntity: {},
      ruleValidate: {}
    };
  },
  mounted: function mounted() {},
  methods: {},
  template: "<div>\n                    <div style=\"width: 80%;float: left\">\n                        <i-form ref=\"appEntity\" :model=\"appEntity\" :rules=\"ruleValidate\" :label-width=\"100\">\n                            <form-item label=\"\u7CFB\u7EDF\u7F16\u7801\uFF1A\" prop=\"appEntity.appCode\">\n                                <row>\n                                    <i-col span=\"10\">\n                                        <form-item prop=\"appEntity.appCode\">\n                                            <i-input v-model=\"appEntity.appCode\"></i-input>\n                                        </form-item>\n                                    </i-col>\n                                    <i-col span=\"4\" style=\"text-align: center\"><span style=\"color: red\">*</span> \u7CFB\u7EDF\u540D\u79F0\uFF1A</i-col>\n                                    <i-col span=\"10\">\n                                        <form-item prop=\"appEntity.appName\">\n                                            <i-input v-model=\"appEntity.appName\"></i-input>\n                                        </form-item>\n                                    </i-col>\n                                </row>\n                            </form-item>\n                            <form-item label=\"\u57DF\u540D\uFF1A\">\n                                <row>\n                                    <i-col span=\"10\">\n                                        <i-input v-model=\"appEntity.appDomain\"></i-input>\n                                    </i-col>\n                                    <i-col span=\"4\" style=\"text-align: center\">\u7CFB\u7EDF\u7C7B\u522B\uFF1A</i-col>\n                                    <i-col span=\"10\">\n                                        <radio-group v-model=\"appEntity.appCategory\" type=\"button\">\n                                            <radio label=\"app\">\u79FB\u52A8App</radio>\n                                            <radio label=\"web\">Web\u7CFB\u7EDF</radio>\n                                        </radio-group>\n                                    </i-col>\n                                </row>\n                            </form-item>\n                            <form-item label=\"\u516C\u94A5\uFF1A\">\n                                <i-input v-model=\"appEntity.appPublicKey\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u79C1\u94A5\uFF1A\">\n                                <i-input v-model=\"appEntity.appPrivateKey\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u9ED8\u8BA4\u5730\u5740\uFF1A\">\n                                <i-input v-model=\"appEntity.appIndexUrl\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u5907\u6CE8\uFF1A\">\n                                <i-input v-model=\"appEntity.appDesc\" type=\"textarea\" :autosize=\"{minRows: 6,maxRows: 6}\"></i-input>\n                            </form-item>\n                        </i-form>\n                    </div>\n                    <div style=\"width: 19%;float: right\">\n                        <div style=\"border-radius: 8px;text-align: center;margin-top: 20px;margin-bottom: 30px\">\n                            <img :src=\"userHeadImageSrc\" style=\"width: 110px;height: 120px\" />\n                        </div>\n                        <upload style=\"margin:10px 12px 0 20px\" :on-success=\"uploadUserHeadImageSuccess\" multiple type=\"drag\" name=\"file\" action=\"../../../PlatFormRest/SSO/DepartmentUser/UploadUserHeadIMG.do\" accept=\".png\">\n                            <div style=\"padding:10px 0px\">\n                                <icon type=\"ios-cloud-upload\" size=\"52\" style=\"color: #3399ff\"></icon>\n                                <p>\u4E0A\u4F20\u7CFB\u7EDFLogo</p>\n                            </div>\n                        </upload>\n                    </div>\n                </div>"
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFzZXQtc2ltcGxlLXNlbGVjdC1jb21wLmpzIiwiZGItdGFibGUtcmVsYXRpb24tY29tcC5qcyIsImRlc2lnbi1odG1sLWVsZW0tbGlzdC5qcyIsImZkLWNvbnRyb2wtYmFzZS1pbmZvLmpzIiwiZmQtY29udHJvbC1iaW5kLXRvLmpzIiwianMtZGVzaWduLWNvZGUtZnJhZ21lbnQuanMiLCJtb2R1bGUtbGlzdC1hYm91dGNvbmZpZy1jb21wLmpzIiwibW9kdWxlLWxpc3QtYXBwZm9ybS1jb21wLmpzIiwibW9kdWxlLWxpc3QtYXBwbGlzdC1jb21wLmpzIiwibW9kdWxlLWxpc3QtZmxvdy1jb21wLmpzIiwibW9kdWxlLWxpc3QtcmVwb3J0LWNvbXAuanMiLCJtb2R1bGUtbGlzdC13ZWJmb3JtLWNvbXAuanMiLCJtb2R1bGUtbGlzdC13ZWJsaXN0LWNvbXAuanMiLCJzZWxlY3QtZGVwYXJ0bWVudC11c2VyLWRpYWxvZy5qcyIsInNlbGVjdC1vcmdhbi1jb21wLmpzIiwic2VsZWN0LW9yZ2FuLXNpbmdsZS1jb21wLmpzIiwic2VsZWN0LXRyZWUtZGF0YS1kaWFsb2ctY29tcC5qcyIsInNxbC1nZW5lcmFsLWRlc2lnbi1jb21wLmpzIiwic3NvLWFwcC1kZXRhaWwtZnJvbS1jb21wLmpzIiwic3NvLWFwcC1pbnRlcmZhY2UtbGlzdC1jb21wLmpzIiwic3NvLWFwcC1zdWItc3lzdGVtLWxpc3QtY29tcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUNBQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BZQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVnVlRVhDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImRhdGFzZXQtc2ltcGxlLXNlbGVjdC1jb21wXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0RGF0YVNldERhdGE6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTZXQvRGF0YVNldE1haW4vR2V0RGF0YVNldHNGb3JaVHJlZU5vZGVMaXN0XCJcbiAgICAgIH0sXG4gICAgICBkYXRhU2V0VHJlZToge1xuICAgICAgICB0YWJsZVRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRhYmxlVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgaWYgKHRyZWVOb2RlLm5vZGVUeXBlTmFtZSA9PSBcIlRhYmxlXCIpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVRyZWVEYXRhOiBudWxsLFxuICAgICAgICBzZWxlY3RlZFRhYmxlTmFtZTogXCLml6BcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5iaW5kRGF0YVNldFRyZWUoKTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGJpbmREYXRhU2V0VHJlZTogZnVuY3Rpb24gYmluZERhdGFTZXRUcmVlKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldERhdGFTZXREYXRhLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5kYXRhU2V0VHJlZS50YWJsZVRyZWVEYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgX3NlbGYuZGF0YVNldFRyZWUudGFibGVUcmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjZGF0YVNldFpUcmVlVUxcIiksIF9zZWxmLmRhdGFTZXRUcmVlLnRhYmxlVHJlZVNldHRpbmcsIF9zZWxmLmRhdGFTZXRUcmVlLnRhYmxlVHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYuZGF0YVNldFRyZWUudGFibGVUcmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cImRhdGFTZXRaVHJlZVVMXCIgY2xhc3M9XCJ6dHJlZVwiPjwvdWw+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZGItdGFibGUtcmVsYXRpb24tY29tcFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlc0RhdGFVcmw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZvclpUcmVlTm9kZUxpc3RcIixcbiAgICAgICAgZ2V0VGFibGVGaWVsZHNVcmw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlRmllbGRzQnlUYWJsZUlkXCJcbiAgICAgIH0sXG4gICAgICByZWxhdGlvblRhYmxlVHJlZToge1xuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0YWJsZVRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgdmFyIF9zZWxmID0gd2luZG93Ll9kYnRhYmxlcmVsYXRpb25jb21wO1xuXG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkUmVsYXRpb25UYWJsZU5vZGUodHJlZU5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdGFibGVUcmVlUm9vdERhdGE6IHtcbiAgICAgICAgICBpZDogXCItMVwiLFxuICAgICAgICAgIHRleHQ6IFwi5pWw5o2u5YWz6IGUXCIsXG4gICAgICAgICAgcGFyZW50SWQ6IFwiXCIsXG4gICAgICAgICAgbm9kZVR5cGVOYW1lOiBcIuagueiKgueCuVwiLFxuICAgICAgICAgIGljb246IFwiLi4vLi4vLi4vVGhlbWVzL1BuZzE2WDE2L2NvaW5zX2FkZC5wbmdcIixcbiAgICAgICAgICBfbm9kZUV4VHlwZTogXCJyb290XCIsXG4gICAgICAgICAgdGFibGVJZDogXCItMVwiXG4gICAgICAgIH0sXG4gICAgICAgIGN1cnJlbnRTZWxlY3RlZE5vZGU6IG51bGxcbiAgICAgIH0sXG4gICAgICByZWxhdGlvblRhYmxlRWRpdG9yVmlldzoge1xuICAgICAgICBpc1Nob3dUYWJsZUVkaXREZXRhaWw6IGZhbHNlLFxuICAgICAgICBpc1N1YkVkaXRUcjogZmFsc2UsXG4gICAgICAgIGlzTWFpbkVkaXRUcjogZmFsc2UsXG4gICAgICAgIHNlbFBLRGF0YTogW10sXG4gICAgICAgIHNlbFNlbGZLZXlEYXRhOiBbXSxcbiAgICAgICAgc2VsRm9yZWlnbktleURhdGE6IFtdXG4gICAgICB9LFxuICAgICAgZW1wdHlFZGl0b3JEYXRhOiB7XG4gICAgICAgIGlkOiBcIlwiLFxuICAgICAgICBwYXJlbnRJZDogXCJcIixcbiAgICAgICAgc2luZ2xlTmFtZTogXCJcIixcbiAgICAgICAgcGtGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIGRlc2M6IFwiXCIsXG4gICAgICAgIHNlbGZLZXlGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIG91dGVyS2V5RmllbGROYW1lOiBcIlwiLFxuICAgICAgICByZWxhdGlvblR5cGU6IFwiMVRvTlwiLFxuICAgICAgICBpc1NhdmU6IFwidHJ1ZVwiLFxuICAgICAgICBjb25kaXRpb246IFwiXCIsXG4gICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgIHRhYmxlTmFtZTogXCJcIixcbiAgICAgICAgdGFibGVDYXB0aW9uOiBcIlwiXG4gICAgICB9LFxuICAgICAgY3VycmVudEVkaXRvckRhdGE6IHtcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIHBhcmVudElkOiBcIlwiLFxuICAgICAgICBzaW5nbGVOYW1lOiBcIlwiLFxuICAgICAgICBwa0ZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgZGVzYzogXCJcIixcbiAgICAgICAgc2VsZktleUZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgb3V0ZXJLZXlGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIHJlbGF0aW9uVHlwZTogXCIxVG9OXCIsXG4gICAgICAgIGlzU2F2ZTogXCJ0cnVlXCIsXG4gICAgICAgIGNvbmRpdGlvbjogXCJcIixcbiAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgdGFibGVOYW1lOiBcIlwiLFxuICAgICAgICB0YWJsZUNhcHRpb246IFwiXCJcbiAgICAgIH0sXG4gICAgICBzZWxlY3RUYWJsZVRyZWU6IHtcbiAgICAgICAgdGFibGVUcmVlT2JqOiBudWxsLFxuICAgICAgICB0YWJsZVRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIGlmICh0cmVlTm9kZS5ub2RlVHlwZU5hbWUgPT0gXCJUYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gd2luZG93Ll9kYnRhYmxlcmVsYXRpb25jb21wO1xuICAgICAgICAgICAgICAgICQoXCIjZGl2U2VsZWN0VGFibGVcIikuZGlhbG9nKFwiY2xvc2VcIik7XG5cbiAgICAgICAgICAgICAgICBfc2VsZi5hZGRUYWJsZVRvUmVsYXRpb25UYWJsZVRyZWUodHJlZU5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVRyZWVEYXRhOiBudWxsLFxuICAgICAgICBzZWxlY3RlZFRhYmxlTmFtZTogXCLml6BcIlxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhU3RvcmU6IHt9LFxuICAgICAgcmVzdWx0RGF0YTogW10sXG4gICAgICB0cmVlTm9kZVNldHRpbmc6IHtcbiAgICAgICAgTWFpblRhYmxlTm9kZUltZzogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvcGFnZV9rZXkucG5nXCIsXG4gICAgICAgIFN1YlRhYmxlTm9kZUltZzogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvcGFnZV9yZWZyZXNoLnBuZ1wiXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJpbmRTZWxlY3RUYWJsZVRyZWUoKTtcbiAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNkYXRhUmVsYXRpb25aVHJlZVVMXCIpLCB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRhYmxlVHJlZVNldHRpbmcsIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudGFibGVUcmVlUm9vdERhdGEpO1xuICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlID0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmdldE5vZGVCeVBhcmFtKFwiaWRcIiwgXCItMVwiKTtcbiAgICB3aW5kb3cuX2RidGFibGVyZWxhdGlvbmNvbXAgPSB0aGlzO1xuICB9LFxuICB3YXRjaDoge1xuICAgIGN1cnJlbnRFZGl0b3JEYXRhOiB7XG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbiBoYW5kbGVyKHZhbCwgb2xkVmFsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZXN1bHREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMucmVzdWx0RGF0YVtpXS5pZCA9PSB2YWwuaWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodGhpcy5yZXN1bHREYXRhW2ldLCB2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZXA6IHRydWVcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICByZXN1bHRJdGVtQ29weUVkaXRFbmFibGVWYWx1ZTogZnVuY3Rpb24gcmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodG9PYmosIGZyb21PYmopIHtcbiAgICAgIHRvT2JqLnNpbmdsZU5hbWUgPSBmcm9tT2JqLnNpbmdsZU5hbWU7XG4gICAgICB0b09iai5wa0ZpZWxkTmFtZSA9IGZyb21PYmoucGtGaWVsZE5hbWU7XG4gICAgICB0b09iai5kZXNjID0gZnJvbU9iai5kZXNjO1xuICAgICAgdG9PYmouc2VsZktleUZpZWxkTmFtZSA9IGZyb21PYmouc2VsZktleUZpZWxkTmFtZTtcbiAgICAgIHRvT2JqLm91dGVyS2V5RmllbGROYW1lID0gZnJvbU9iai5vdXRlcktleUZpZWxkTmFtZTtcbiAgICAgIHRvT2JqLnJlbGF0aW9uVHlwZSA9IGZyb21PYmoucmVsYXRpb25UeXBlO1xuICAgICAgdG9PYmouaXNTYXZlID0gZnJvbU9iai5pc1NhdmU7XG4gICAgICB0b09iai5jb25kaXRpb24gPSBmcm9tT2JqLmNvbmRpdGlvbjtcbiAgICB9LFxuICAgIGdldFRhYmxlRmllbGRzQnlUYWJsZUlkOiBmdW5jdGlvbiBnZXRUYWJsZUZpZWxkc0J5VGFibGVJZCh0YWJsZUlkKSB7XG4gICAgICBpZiAodGFibGVJZCA9PSBcIi0xXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnRlbXBEYXRhU3RvcmVbXCJ0YWJsZUZpZWxkX1wiICsgdGFibGVJZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmModGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZUZpZWxkc1VybCwge1xuICAgICAgICAgIHRhYmxlSWQ6IHRhYmxlSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgX3NlbGYudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50ZW1wRGF0YVN0b3JlW1widGFibGVGaWVsZF9cIiArIHRhYmxlSWRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBEYXRhU3RvcmVbXCJ0YWJsZUZpZWxkX1wiICsgdGFibGVJZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldEVtcHR5UmVzdWx0SXRlbTogZnVuY3Rpb24gZ2V0RW1wdHlSZXN1bHRJdGVtKCkge1xuICAgICAgcmV0dXJuIEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHRoaXMuZW1wdHlFZGl0b3JEYXRhKTtcbiAgICB9LFxuICAgIGdldEV4aXN0UmVzdWx0SXRlbTogZnVuY3Rpb24gZ2V0RXhpc3RSZXN1bHRJdGVtKGlkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVzdWx0RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5yZXN1bHREYXRhW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0RGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGJpbmRTZWxlY3RUYWJsZVRyZWU6IGZ1bmN0aW9uIGJpbmRTZWxlY3RUYWJsZVRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVzRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZURhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICBfc2VsZi5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjc2VsZWN0VGFibGVaVHJlZVVMXCIpLCBfc2VsZi5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlU2V0dGluZywgX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgZGVsZXRlU2VsZWN0ZWRSZWxhdGlvblRyZWVOb2RlOiBmdW5jdGlvbiBkZWxldGVTZWxlY3RlZFJlbGF0aW9uVHJlZU5vZGUoKSB7XG4gICAgICBpZiAodGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCkpIHtcbiAgICAgICAgICBpZiAoIXRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pc1BhcmVudCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlc3VsdERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMucmVzdWx0RGF0YVtpXS5pZCA9PSB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdERhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodGhpcy5jdXJyZW50RWRpdG9yRGF0YSwgdGhpcy5lbXB0eUVkaXRvckRhdGEpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RWRpdG9yRGF0YS5pZCA9IFwiXCI7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLnBhcmVudElkID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuJHJlZnMuc3FsR2VuZXJhbERlc2lnbkNvbXAuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFBLRGF0YSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxTZWxmS2V5RGF0YSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxGb3JlaWduS2V5RGF0YSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1Nob3dUYWJsZUVkaXREZXRhaWwgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5yZW1vdmVOb2RlKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlID0gbnVsbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLkuI3og73liKDpmaTniLboioLngrkhXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuS4jeiDveWIoOmZpOagueiKgueCuSFcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+36YCJ5oup6KaB5Yig6Zmk55qE6IqC54K5IVwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0VGFibGVUb1JlbGF0aW9uVGFibGU6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0VGFibGVUb1JlbGF0aW9uVGFibGUoKSB7XG4gICAgICBpZiAodGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlKSB7XG4gICAgICAgICQoXCIjZGl2U2VsZWN0VGFibGVcIikuZGlhbG9nKHtcbiAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICB3aWR0aDogNTAwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6YCJ5oup5LiA5Liq54i26IqC54K5IVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFwcGVuZE1haW5UYWJsZU5vZGVQcm9wOiBmdW5jdGlvbiBhcHBlbmRNYWluVGFibGVOb2RlUHJvcChub2RlKSB7XG4gICAgICBub2RlLl9ub2RlRXhUeXBlID0gXCJNYWluTm9kZVwiO1xuICAgICAgbm9kZS5pY29uID0gdGhpcy50cmVlTm9kZVNldHRpbmcuTWFpblRhYmxlTm9kZUltZztcbiAgICB9LFxuICAgIGFwcGVuZFN1YlRhYmxlTm9kZVByb3A6IGZ1bmN0aW9uIGFwcGVuZFN1YlRhYmxlTm9kZVByb3Aobm9kZSkge1xuICAgICAgbm9kZS5fbm9kZUV4VHlwZSA9IFwiU3ViTm9kZVwiO1xuICAgICAgbm9kZS5pY29uID0gdGhpcy50cmVlTm9kZVNldHRpbmcuU3ViVGFibGVOb2RlSW1nO1xuICAgIH0sXG4gICAgYnVpbGRSZWxhdGlvblRhYmxlTm9kZTogZnVuY3Rpb24gYnVpbGRSZWxhdGlvblRhYmxlTm9kZShzb3VyY2VOb2RlLCB0cmVlTm9kZUlkKSB7XG4gICAgICBpZiAodGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLl9ub2RlRXhUeXBlID09IFwicm9vdFwiKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kTWFpblRhYmxlTm9kZVByb3Aoc291cmNlTm9kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFwcGVuZFN1YlRhYmxlTm9kZVByb3Aoc291cmNlTm9kZSk7XG4gICAgICB9XG5cbiAgICAgIHNvdXJjZU5vZGUudGFibGVJZCA9IHNvdXJjZU5vZGUuaWQ7XG5cbiAgICAgIGlmICh0cmVlTm9kZUlkKSB7XG4gICAgICAgIHNvdXJjZU5vZGUuaWQgPSB0cmVlTm9kZUlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc291cmNlTm9kZS5pZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc291cmNlTm9kZTtcbiAgICB9LFxuICAgIGdldE1haW5SZWxhdGlvblRhYmxlTm9kZTogZnVuY3Rpb24gZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmouZ2V0Tm9kZUJ5UGFyYW0oXCJfbm9kZUV4VHlwZVwiLCBcIk1haW5Ob2RlXCIpO1xuXG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBnZXRNYWluVGFibGVJZDogZnVuY3Rpb24gZ2V0TWFpblRhYmxlSWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSA/IHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkudGFibGVJZCA6IFwiXCI7XG4gICAgfSxcbiAgICBnZXRNYWluVGFibGVOYW1lOiBmdW5jdGlvbiBnZXRNYWluVGFibGVOYW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkgPyB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpLnZhbHVlIDogXCJcIjtcbiAgICB9LFxuICAgIGdldE1haW5UYWJsZUNhcHRpb246IGZ1bmN0aW9uIGdldE1haW5UYWJsZUNhcHRpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSA/IHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkuYXR0cjEgOiBcIlwiO1xuICAgIH0sXG4gICAgaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZTogZnVuY3Rpb24gaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaWQgPT0gXCItMVwiO1xuICAgIH0sXG4gICAgaXNTZWxlY3RlZE1haW5SZWxhdGlvblRhYmxlTm9kZTogZnVuY3Rpb24gaXNTZWxlY3RlZE1haW5SZWxhdGlvblRhYmxlTm9kZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuX25vZGVFeFR5cGUgPT0gXCJNYWluTm9kZVwiO1xuICAgIH0sXG4gICAgYWRkVGFibGVUb1JlbGF0aW9uVGFibGVUcmVlOiBmdW5jdGlvbiBhZGRUYWJsZVRvUmVsYXRpb25UYWJsZVRyZWUobmV3Tm9kZSkge1xuICAgICAgbmV3Tm9kZSA9IHRoaXMuYnVpbGRSZWxhdGlvblRhYmxlTm9kZShuZXdOb2RlKTtcbiAgICAgIHZhciB0ZW1wTm9kZSA9IHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCk7XG5cbiAgICAgIGlmICh0ZW1wTm9kZSAhPSBudWxsKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGUoKSkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuWPquWFgeiuuOWtmOWcqOS4gOS4quS4u+iusOW9lSFcIiwgbnVsbCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5hZGROb2Rlcyh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUsIC0xLCBuZXdOb2RlLCBmYWxzZSk7XG4gICAgICB2YXIgbmV3UmVzdWx0SXRlbSA9IHRoaXMuZ2V0RW1wdHlSZXN1bHRJdGVtKCk7XG4gICAgICBuZXdSZXN1bHRJdGVtLmlkID0gbmV3Tm9kZS5pZDtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0ucGFyZW50SWQgPSB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaWQ7XG4gICAgICBuZXdSZXN1bHRJdGVtLnRhYmxlSWQgPSBuZXdOb2RlLnRhYmxlSWQ7XG4gICAgICBuZXdSZXN1bHRJdGVtLnRhYmxlTmFtZSA9IG5ld05vZGUudmFsdWU7XG4gICAgICBuZXdSZXN1bHRJdGVtLnRhYmxlQ2FwdGlvbiA9IG5ld05vZGUuYXR0cjE7XG4gICAgICB0aGlzLnJlc3VsdERhdGEucHVzaChuZXdSZXN1bHRJdGVtKTtcbiAgICB9LFxuICAgIHNlbGVjdGVkUmVsYXRpb25UYWJsZU5vZGU6IGZ1bmN0aW9uIHNlbGVjdGVkUmVsYXRpb25UYWJsZU5vZGUobm9kZSkge1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlID0gbm9kZTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTaG93VGFibGVFZGl0RGV0YWlsID0gIXRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc01haW5FZGl0VHIgPSB0aGlzLmlzU2VsZWN0ZWRNYWluUmVsYXRpb25UYWJsZU5vZGUoKTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTdWJFZGl0VHIgPSAhdGhpcy5pc1NlbGVjdGVkTWFpblJlbGF0aW9uVGFibGVOb2RlKCk7XG5cbiAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGUoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsUEtEYXRhID0gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChub2RlLnRhYmxlSWQpICE9IG51bGwgPyB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKG5vZGUudGFibGVJZCkgOiBbXTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsU2VsZktleURhdGEgPSB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKG5vZGUudGFibGVJZCkgIT0gbnVsbCA/IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQobm9kZS50YWJsZUlkKSA6IFtdO1xuICAgICAgdmFyIHBhcmVudE5vZGUgPSBub2RlLmdldFBhcmVudE5vZGUoKTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsRm9yZWlnbktleURhdGEgPSB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKHBhcmVudE5vZGUudGFibGVJZCkgIT0gbnVsbCA/IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQocGFyZW50Tm9kZS50YWJsZUlkKSA6IFtdO1xuICAgICAgdGhpcy5jdXJyZW50RWRpdG9yRGF0YS5pZCA9IHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pZDtcbiAgICAgIHRoaXMuY3VycmVudEVkaXRvckRhdGEucGFyZW50SWQgPSBwYXJlbnROb2RlLmlkO1xuICAgICAgdmFyIGV4aXN0UmVzdWx0SXRlbSA9IHRoaXMuZ2V0RXhpc3RSZXN1bHRJdGVtKG5vZGUuaWQpO1xuXG4gICAgICBpZiAoZXhpc3RSZXN1bHRJdGVtICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5yZXN1bHRJdGVtQ29weUVkaXRFbmFibGVWYWx1ZSh0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLCBleGlzdFJlc3VsdEl0ZW0pO1xuXG4gICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF9zZWxmLiRyZWZzLnNxbEdlbmVyYWxEZXNpZ25Db21wLnNldFZhbHVlKF9zZWxmLmN1cnJlbnRFZGl0b3JEYXRhLmNvbmRpdGlvbik7XG5cbiAgICAgICAgICBfc2VsZi4kcmVmcy5zcWxHZW5lcmFsRGVzaWduQ29tcC5zZXRBYm91dFRhYmxlRmllbGRzKF9zZWxmLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFNlbGZLZXlEYXRhLCBfc2VsZi5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxGb3JlaWduS2V5RGF0YSk7XG4gICAgICAgIH0sIDMwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIumAmui/h2dldEV4aXN0UmVzdWx0SXRlbeiOt+WPluS4jeWIsOaVsOaNriFcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRSZXN1bHREYXRhOiBmdW5jdGlvbiBnZXRSZXN1bHREYXRhKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0RGF0YTtcbiAgICB9LFxuICAgIHNlcmlhbGl6ZVJlbGF0aW9uOiBmdW5jdGlvbiBzZXJpYWxpemVSZWxhdGlvbihpc0Zvcm1hdCkge1xuICAgICAgYWxlcnQoXCJzZXJpYWxpemVSZWxhdGlvbuW3sue7j+WBnOeUqFwiKTtcbiAgICAgIHJldHVybjtcblxuICAgICAgaWYgKGlzRm9ybWF0KSB7XG4gICAgICAgIHJldHVybiBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmdGb3JtYXQodGhpcy5yZXN1bHREYXRhKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh0aGlzLnJlc3VsdERhdGEpO1xuICAgIH0sXG4gICAgZGVzZXJpYWxpemVSZWxhdGlvbjogZnVuY3Rpb24gZGVzZXJpYWxpemVSZWxhdGlvbihqc29uU3RyaW5nKSB7XG4gICAgICBhbGVydChcImRlc2VyaWFsaXplUmVsYXRpb27lt7Lnu4/lgZznlKhcIik7XG4gICAgICByZXR1cm47XG4gICAgfSxcbiAgICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBtYWluVGFibGVJZDogdGhpcy5nZXRNYWluVGFibGVJZCgpLFxuICAgICAgICBtYWluVGFibGVOYW1lOiB0aGlzLmdldE1haW5UYWJsZU5hbWUoKSxcbiAgICAgICAgbWFpblRhYmxlQ2FwdGlvbjogdGhpcy5nZXRNYWluVGFibGVDYXB0aW9uKCksXG4gICAgICAgIHJlbGF0aW9uRGF0YTogdGhpcy5yZXN1bHREYXRhXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZShqc29uU3RyaW5nKSB7XG4gICAgICB2YXIgdGVtcERhdGEgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oanNvblN0cmluZyk7XG4gICAgICB0aGlzLnJlc3VsdERhdGEgPSB0ZW1wRGF0YTtcbiAgICAgIHZhciB0cmVlTm9kZURhdGEgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdHJlZU5vZGUgPSB7XG4gICAgICAgICAgXCJ2YWx1ZVwiOiB0ZW1wRGF0YVtpXS50YWJsZU5hbWUsXG4gICAgICAgICAgXCJhdHRyMVwiOiB0ZW1wRGF0YVtpXS50YWJsZUNhcHRpb24sXG4gICAgICAgICAgXCJ0ZXh0XCI6IHRlbXBEYXRhW2ldLnRhYmxlQ2FwdGlvbiArIFwi44CQXCIgKyB0ZW1wRGF0YVtpXS50YWJsZU5hbWUgKyBcIuOAkVwiLFxuICAgICAgICAgIFwiaWRcIjogdGVtcERhdGFbaV0uaWQsXG4gICAgICAgICAgXCJwYXJlbnRJZFwiOiB0ZW1wRGF0YVtpXS5wYXJlbnRJZFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0ZW1wRGF0YVtpXS5wYXJlbnRJZCA9PSBcIi0xXCIpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZE1haW5UYWJsZU5vZGVQcm9wKHRyZWVOb2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZFN1YlRhYmxlTm9kZVByb3AodHJlZU5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJlZU5vZGVEYXRhLnB1c2godHJlZU5vZGUpO1xuICAgICAgfVxuXG4gICAgICB0cmVlTm9kZURhdGEucHVzaCh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRhYmxlVHJlZVJvb3REYXRhKTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI2RhdGFSZWxhdGlvblpUcmVlVUxcIiksIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudGFibGVUcmVlU2V0dGluZywgdHJlZU5vZGVEYXRhKTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgfSxcbiAgICBhbGVydFNlcmlhbGl6ZVJlbGF0aW9uOiBmdW5jdGlvbiBhbGVydFNlcmlhbGl6ZVJlbGF0aW9uKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEpzb25Db2RlKHRoaXMucmVzdWx0RGF0YSk7XG4gICAgfSxcbiAgICBpbnB1dERlc2VyaWFsaXplUmVsYXRpb246IGZ1bmN0aW9uIGlucHV0RGVzZXJpYWxpemVSZWxhdGlvbigpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuUHJvbXB0KHdpbmRvdywge1xuICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICBoZWlnaHQ6IDYwMFxuICAgICAgfSwgRGlhbG9nVXRpbGl0eS5EaWFsb2dQcm9tcHRJZCwgXCLor7fotLTlhaXmlbDmja7lhbPogZRKc29u6K6+572u5a2X56ym5LiyXCIsIGZ1bmN0aW9uIChqc29uU3RyaW5nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgd2luZG93Ll9kYnRhYmxlcmVsYXRpb25jb21wLnNldFZhbHVlKGpzb25TdHJpbmcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgYWxlcnQoXCLlj43luo/liJfljJblpLHotKU6XCIgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkYi10YWJsZS1yZWxhdGlvbi1jb21wXCI+XFxcclxuICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVwibGVmdFwiIDpkYXNoZWQ9XCJ0cnVlXCIgc3R5bGU9XCJmb250LXNpemU6IDEycHhcIj7mlbDmja7lhbPns7vlhbPogZTorr7nva48L2RpdmlkZXI+XFxcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdDt3aWR0aDogMzUwcHg7aGVpZ2h0OiAzMzBweDtib3JkZXI6ICNkZGRkZjEgMXB4IHNvbGlkO2JvcmRlci1yYWRpdXM6IDRweDtwYWRkaW5nOiAxMHB4IDEwcHggMTBweCAxMHB4O1wiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cCBzaGFwZT1cImNpcmNsZVwiIHN0eWxlPVwibWFyZ2luOiBhdXRvXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJzdWNjZXNzXCIgQGNsaWNrPVwiYmVnaW5TZWxlY3RUYWJsZVRvUmVsYXRpb25UYWJsZVwiPiZuYnNwO+a3u+WKoCZuYnNwOzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cImRlbGV0ZVNlbGVjdGVkUmVsYXRpb25UcmVlTm9kZVwiPiZuYnNwO+WIoOmZpCZuYnNwOzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cImFsZXJ0U2VyaWFsaXplUmVsYXRpb25cIj7luo/liJfljJY8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XCJpbnB1dERlc2VyaWFsaXplUmVsYXRpb25cIj7lj43luo/liJfljJY8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbj7or7TmmI48L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XCJkYXRhUmVsYXRpb25aVHJlZVVMXCIgY2xhc3M9XCJ6dHJlZVwiPjwvdWw+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiA2MzBweDtoZWlnaHQ6IDMzMHB4O2JvcmRlcjogI2RkZGRmMSAxcHggc29saWQ7Ym9yZGVyLXJhZGl1czogNHB4O3BhZGRpbmc6IDEwcHggMTBweCAxMHB4IDEwcHg7XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJsaWdodC1ncmF5LXRhYmxlXCIgY2VsbHBhZGRpbmc9XCIwXCIgY2VsbHNwYWNpbmc9XCIwXCIgYm9yZGVyPVwiMFwiIHYtaWY9XCJyZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1Nob3dUYWJsZUVkaXREZXRhaWxcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XCJ3aWR0aDogMTclXCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cIndpZHRoOiAzMyVcIiAvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVwid2lkdGg6IDE1JVwiIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XCJ3aWR0aDogMzUlXCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj5TaW5nbGVOYW1l77yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEuc2luZ2xlTmFtZVwiIHNpemU9XCJzbWFsbFwiIHBsYWNlaG9sZGVyPVwi5pys5YWz6IGU5Lit55qE5ZSv5LiA5ZCN56ewLOWPr+S7peS4uuepulwiIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj5QS0tlee+8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHBsYWNlaG9sZGVyPVwi6buY6K6k5L2/55SoSWTlrZfmrrVcIiB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEucGtGaWVsZE5hbWVcIiBzaXplPVwic21hbGxcIiBzdHlsZT1cIndpZHRoOjE5OXB4XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gcmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsUEtEYXRhXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgdi1pZj1cInJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU3ViRWRpdFRyXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYWJlbFwiPuaVsOaNruWFs+ezu++8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5yZWxhdGlvblR5cGVcIiB0eXBlPVwiYnV0dG9uXCIgc2l6ZT1cInNtYWxsXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cIjFUbzFcIj4xOjE8L3JhZGlvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XCIxVG9OXCI+MTpOPC9yYWRpbz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+5piv5ZCm5L+d5a2Y77yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLmlzU2F2ZVwiIHR5cGU9XCJidXR0b25cIiBzaXplPVwic21hbGxcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVwidHJ1ZVwiPuaYrzwvcmFkaW8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cImZhbHNlXCI+5ZCmPC9yYWRpbz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHYtaWY9XCJyZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1N1YkVkaXRUclwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj7mnKzouqvlhbPogZTlrZfmrrXvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5zZWxmS2V5RmllbGROYW1lXCIgc2l6ZT1cInNtYWxsXCIgc3R5bGU9XCJ3aWR0aDoxOTlweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFNlbGZLZXlEYXRhXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj7lpJbogZTlrZfmrrXvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5vdXRlcktleUZpZWxkTmFtZVwiIHNpemU9XCJzbWFsbFwiIHN0eWxlPVwid2lkdGg6MTk5cHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHYtZm9yPVwiaXRlbSBpbiByZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxQS0RhdGFcIiA6dmFsdWU9XCJpdGVtLmZpZWxkTmFtZVwiIDprZXk9XCJpdGVtLmZpZWxkTmFtZVwiPnt7aXRlbS5maWVsZENhcHRpb259fTwvaS1vcHRpb24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+RGVzY++8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEuZGVzY1wiIHNpemU9XCJzbWFsbFwiIHBsYWNlaG9sZGVyPVwi6K+05piOXCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+5Yqg6L295p2h5Lu277yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcWwtZ2VuZXJhbC1kZXNpZ24tY29tcCByZWY9XCJzcWxHZW5lcmFsRGVzaWduQ29tcFwiIDpzcWxEZXNpZ25lckhlaWdodD1cIjc0XCIgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLmNvbmRpdGlvblwiPjwvc3FsLWdlbmVyYWwtZGVzaWduLWNvbXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImRpdlNlbGVjdFRhYmxlXCIgdGl0bGU9XCLor7fpgInmi6nooahcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cInNlbGVjdFRhYmxlWlRyZWVVTFwiIGNsYXNzPVwienRyZWVcIj48L3VsPlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZGVzaWduLWh0bWwtZWxlbS1saXN0XCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge30sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImRlc2lnbi1odG1sLWVsZW0tbGlzdC13cmFwXCI+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2lnbi1odG1sLWVsZW0tbGlzdC1pdGVtXCI+5qC85byP5YyWPC9kaXY+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlc2lnbi1odG1sLWVsZW0tbGlzdC1pdGVtXCI+6K+05piOPC9kaXY+XFxcclxuICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImZkLWNvbnRyb2wtYmFzZS1pbmZvXCIsIHtcbiAgcHJvcHM6IFtcInZhbHVlXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBiYXNlSW5mbzoge1xuICAgICAgICBpZDogXCJcIixcbiAgICAgICAgc2VyaWFsaXplOiBcIlwiLFxuICAgICAgICBuYW1lOiBcIlwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiXCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcIlwiLFxuICAgICAgICByZWFkb25seTogXCJcIixcbiAgICAgICAgZGlzYWJsZWQ6IFwiXCIsXG4gICAgICAgIHN0eWxlOiBcIlwiLFxuICAgICAgICBkZXNjOiBcIlwiXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBiYXNlSW5mbzogZnVuY3Rpb24gYmFzZUluZm8obmV3VmFsKSB7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG5ld1ZhbCk7XG4gICAgfSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmV3VmFsKSB7XG4gICAgICB0aGlzLmJhc2VJbmZvID0gbmV3VmFsO1xuICAgIH1cbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJhc2VJbmZvID0gdGhpcy52YWx1ZTtcbiAgfSxcbiAgbWV0aG9kczoge30sXG4gIHRlbXBsYXRlOiAnPHRhYmxlIGNsYXNzPVwiaHRtbC1kZXNpZ24tcGx1Z2luLWRpYWxvZy10YWJsZS13cmFwZXJcIiBjZWxscGFkZGluZz1cIjBcIiBjZWxsc3BhY2luZz1cIjBcIiBib3JkZXI9XCIwXCI+JyArICc8Y29sZ3JvdXA+JyArICc8Y29sIHN0eWxlPVwid2lkdGg6IDEwMHB4XCIgLz4nICsgJzxjb2wgc3R5bGU9XCJ3aWR0aDogMjgwcHhcIiAvPicgKyAnPGNvbCBzdHlsZT1cIndpZHRoOiA5MHB4XCIgLz4nICsgJzxjb2wgc3R5bGU9XCJ3aWR0aDogMTEwcHhcIiAvPicgKyAnPGNvbCBzdHlsZT1cIndpZHRoOiA5MHB4XCIgLz4nICsgJzxjb2wgLz4nICsgJzwvY29sZ3JvdXA+JyArICc8dHI+JyArICc8dGQ+SUTvvJo8L3RkPicgKyAnPHRkPicgKyAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdi1tb2RlbD1cImJhc2VJbmZvLmlkXCIgLz4nICsgJzwvdGQ+JyArICc8dGQ+U2VyaWFsaXpl77yaPC90ZD4nICsgJzx0ZCBjb2xzcGFuPVwiM1wiPicgKyAnPHJhZGlvLWdyb3VwIHR5cGU9XCJidXR0b25cIiBzdHlsZT1cIm1hcmdpbjogYXV0b1wiIHYtbW9kZWw9XCJiYXNlSW5mby5zZXJpYWxpemVcIj4nICsgJzxyYWRpbyBsYWJlbD1cInRydWVcIj7mmK88L3JhZGlvPicgKyAnPHJhZGlvIGxhYmVsPVwiZmFsc2VcIj7lkKY8L3JhZGlvPicgKyAnPC9yYWRpby1ncm91cD4nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkPk5hbWXvvJo8L3RkPicgKyAnPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIHYtbW9kZWw9XCJiYXNlSW5mby5uYW1lXCIgLz48L3RkPicgKyAnPHRkPkNsYXNzTmFtZe+8mjwvdGQ+JyArICc8dGQgY29sc3Bhbj1cIjNcIj48aW5wdXQgdHlwZT1cInRleHRcIiB2LW1vZGVsPVwiYmFzZUluZm8uY2xhc3NOYW1lXCIgLz48L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZD5QbGFjZWhvbGRlcjwvdGQ+JyArICc8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgdi1tb2RlbD1cImJhc2VJbmZvLnBsYWNlaG9sZGVyXCIgLz48L3RkPicgKyAnPHRkPlJlYWRvbmx577yaPC90ZD4nICsgJzx0ZCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPicgKyAnPHJhZGlvLWdyb3VwIHR5cGU9XCJidXR0b25cIiBzdHlsZT1cIm1hcmdpbjogYXV0b1wiIHYtbW9kZWw9XCJiYXNlSW5mby5yZWFkb25seVwiPicgKyAnPHJhZGlvIGxhYmVsPVwicmVhZG9ubHlcIj7mmK88L3JhZGlvPicgKyAnPHJhZGlvIGxhYmVsPVwibm9yZWFkb25seVwiPuWQpjwvcmFkaW8+JyArICc8L3JhZGlvLWdyb3VwPicgKyAnPC90ZD4nICsgJzx0ZD5EaXNhYmxlZO+8mjwvdGQ+JyArICc8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj4nICsgJzxyYWRpby1ncm91cCB0eXBlPVwiYnV0dG9uXCIgc3R5bGU9XCJtYXJnaW46IGF1dG9cIiB2LW1vZGVsPVwiYmFzZUluZm8uZGlzYWJsZWRcIj4nICsgJzxyYWRpbyBsYWJlbD1cImRpc2FibGVkXCI+5pivPC9yYWRpbz4nICsgJzxyYWRpbyBsYWJlbD1cIm5vZGlzYWJsZWRcIj7lkKY8L3JhZGlvPicgKyAnPC9yYWRpby1ncm91cD4nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkPuagt+W8j++8mjwvdGQ+JyArICc8dGQgY29sc3Bhbj1cIjVcIj4nICsgJzx0ZXh0YXJlYSByb3dzPVwiN1wiIHYtbW9kZWw9XCJiYXNlSW5mby5zdHlsZVwiPjwvdGV4dGFyZWE+JyArICc8L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZD7lpIfms6jvvJo8L3RkPicgKyAnPHRkIGNvbHNwYW49XCI1XCI+JyArICc8dGV4dGFyZWEgcm93cz1cIjhcIiB2LW1vZGVsPVwiYmFzZUluZm8uZGVzY1wiPjwvdGV4dGFyZWE+JyArICc8L3RkPicgKyAnPC90cj4nICsgJzwvdGFibGU+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJmZC1jb250cm9sLWJpbmQtdG9cIiwge1xuICBwcm9wczogW1wiYmluZFRvRmllbGRQcm9wXCIsIFwiZGVmYXVsdFZhbHVlUHJvcFwiLCBcInZhbGlkYXRlUnVsZXNQcm9wXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBiaW5kVG9GaWVsZDoge1xuICAgICAgICB0YWJsZUlkOiBcIlwiLFxuICAgICAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIixcbiAgICAgICAgZmllbGROYW1lOiBcIlwiLFxuICAgICAgICBmaWVsZENhcHRpb246IFwiXCIsXG4gICAgICAgIGZpZWxkRGF0YVR5cGU6IFwiXCIsXG4gICAgICAgIGZpZWxkTGVuZ3RoOiBcIlwiXG4gICAgICB9LFxuICAgICAgdmFsaWRhdGVSdWxlczoge1xuICAgICAgICBtc2c6IFwiXCIsXG4gICAgICAgIHJ1bGVzOiBbXVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRWYWx1ZToge1xuICAgICAgICBkZWZhdWx0VHlwZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiLFxuICAgICAgICBkZWZhdWx0VGV4dDogXCJcIlxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhOiB7XG4gICAgICAgIGRlZmF1bHREaXNwbGF5VGV4dDogXCJcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgYmluZFRvUHJvcDogZnVuY3Rpb24gYmluZFRvUHJvcChuZXdWYWx1ZSkge1xuICAgICAgY29uc29sZS5sb2cobmV3VmFsdWUpO1xuICAgIH0sXG4gICAgYmluZFRvRmllbGRQcm9wOiBmdW5jdGlvbiBiaW5kVG9GaWVsZFByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuYmluZFRvRmllbGQgPSBuZXdWYWx1ZTtcbiAgICB9LFxuICAgIGRlZmF1bHRWYWx1ZVByb3A6IGZ1bmN0aW9uIGRlZmF1bHRWYWx1ZVByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlKSkge1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB2YWxpZGF0ZVJ1bGVzUHJvcDogZnVuY3Rpb24gdmFsaWRhdGVSdWxlc1Byb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMudmFsaWRhdGVSdWxlcyA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJpbmRUb0ZpZWxkID0gdGhpcy5iaW5kVG9GaWVsZFByb3A7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBzZXRDb21wbGV0ZWQ6IGZ1bmN0aW9uIHNldENvbXBsZXRlZCgpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLXNldC1jb21wbGV0ZWQnLCB0aGlzLmJpbmRUb0ZpZWxkLCB0aGlzLmRlZmF1bHRWYWx1ZSwgdGhpcy52YWxpZGF0ZVJ1bGVzKTtcbiAgICB9LFxuICAgIHNlbGVjdEJpbmRGaWVsZFZpZXc6IGZ1bmN0aW9uIHNlbGVjdEJpbmRGaWVsZFZpZXcoKSB7XG4gICAgICBKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0QmluZFRvRmllbGQuYmVnaW5TZWxlY3RJbkZyYW1lKHdpbmRvdywgXCJfU2VsZWN0QmluZE9ialwiLCB7fSk7XG4gICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB0aGlzO1xuICAgIH0sXG4gICAgc2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZShyZXN1bHQpIHtcbiAgICAgIHRoaXMuYmluZFRvRmllbGQgPSB7fTtcblxuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGROYW1lID0gcmVzdWx0LmZpZWxkTmFtZTtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUlkID0gcmVzdWx0LnRhYmxlSWQ7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVOYW1lID0gcmVzdWx0LnRhYmxlTmFtZTtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUNhcHRpb24gPSByZXN1bHQudGFibGVDYXB0aW9uO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbiA9IHJlc3VsdC5maWVsZENhcHRpb247XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGREYXRhVHlwZSA9IHJlc3VsdC5maWVsZERhdGFUeXBlO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkTGVuZ3RoID0gcmVzdWx0LmZpZWxkTGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZE5hbWUgPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlSWQgPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlTmFtZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVDYXB0aW9uID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZENhcHRpb24gPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkRGF0YVR5cGUgPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkTGVuZ3RoID0gXCJcIjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcbiAgICB9LFxuICAgIGdldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIGdldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWUoKSB7XG4gICAgICByZXR1cm4gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUodGhpcy5iaW5kVG9GaWVsZCk7XG4gICAgfSxcbiAgICBzZWxlY3REZWZhdWx0VmFsdWVWaWV3OiBmdW5jdGlvbiBzZWxlY3REZWZhdWx0VmFsdWVWaWV3KCkge1xuICAgICAgSkJ1aWxkNERTZWxlY3RWaWV3LlNlbGVjdEVudlZhcmlhYmxlLmJlZ2luU2VsZWN0SW5GcmFtZSh3aW5kb3csIFwiX1NlbGVjdEJpbmRPYmpcIiwge30pO1xuICAgICAgd2luZG93Ll9TZWxlY3RCaW5kT2JqID0gdGhpcztcbiAgICB9LFxuICAgIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUgPSByZXN1bHQuVHlwZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFZhbHVlID0gcmVzdWx0LlZhbHVlO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCA9IHJlc3VsdC5UZXh0O1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRWYWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0ID0gXCJcIjtcbiAgICAgICAgdGhpcy50ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHQgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldENvbXBsZXRlZCgpO1xuICAgIH0sXG4gICAgc2VsZWN0VmFsaWRhdGVSdWxlVmlldzogZnVuY3Rpb24gc2VsZWN0VmFsaWRhdGVSdWxlVmlldygpIHtcbiAgICAgIEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RWYWxpZGF0ZVJ1bGUuYmVnaW5TZWxlY3RJbkZyYW1lKHdpbmRvdywgXCJfU2VsZWN0QmluZE9ialwiLCB7fSk7XG4gICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB0aGlzO1xuICAgIH0sXG4gICAgc2V0U2VsZWN0VmFsaWRhdGVSdWxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVSdWxlcyA9IHJlc3VsdDtcbiAgICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVSdWxlcy5tc2cgPSBcIlwiO1xuICAgICAgICB0aGlzLnZhbGlkYXRlUnVsZXMucnVsZXMgPSBbXTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBnZXRTZWxlY3RWYWxpZGF0ZVJ1bGVSZXN1bHRWYWx1ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlUnVsZXM7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzx0YWJsZSBjZWxscGFkZGluZz1cIjBcIiBjZWxsc3BhY2luZz1cIjBcIiBib3JkZXI9XCIwXCIgY2xhc3M9XCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclwiPicgKyAnPGNvbGdyb3VwPicgKyAnPGNvbCBzdHlsZT1cIndpZHRoOiAxMDBweFwiIC8+JyArICc8Y29sIHN0eWxlPVwid2lkdGg6IDI4MHB4XCIgLz4nICsgJzxjb2wgc3R5bGU9XCJ3aWR0aDogMTAwcHhcIiAvPicgKyAnPGNvbCAvPicgKyAnPC9jb2xncm91cD4nICsgJzx0cj4nICsgJzx0ZCBjb2xzcGFuPVwiNFwiPicgKyAnICAgIOe7keWumuWIsOihqDxidXR0b24gY2xhc3M9XCJidG4tc2VsZWN0IGZyaWdodFwiIHYtb246Y2xpY2s9XCJzZWxlY3RCaW5kRmllbGRWaWV3XCI+Li4uPC9idXR0b24+JyArICc8L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZD7ooajnvJblj7fvvJo8L3RkPicgKyAnPHRkIGNvbHNwYW49XCIzXCI+e3tiaW5kVG9GaWVsZC50YWJsZUlkfX08L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZD7ooajlkI3vvJo8L3RkPicgKyAnPHRkPnt7YmluZFRvRmllbGQudGFibGVOYW1lfX08L3RkPicgKyAnPHRkPuihqOagh+mimO+8mjwvdGQ+JyArICc8dGQ+e3tiaW5kVG9GaWVsZC50YWJsZUNhcHRpb259fTwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkPuWtl+auteWQje+8mjwvdGQ+JyArICc8dGQ+e3tiaW5kVG9GaWVsZC5maWVsZE5hbWV9fTwvdGQ+JyArICc8dGQ+5a2X5q615qCH6aKY77yaPC90ZD4nICsgJzx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbn19PC90ZD4nICsgJzwvdHI+JyArICc8dHI+JyArICc8dGQ+57G75Z6L77yaPC90ZD4nICsgJzx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkRGF0YVR5cGV9fTwvdGQ+JyArICc8dGQ+6ZW/5bqm77yaPC90ZD4nICsgJzx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkTGVuZ3RofX08L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZCBjb2xzcGFuPVwiNFwiPum7mOiupOWAvDxidXR0b24gY2xhc3M9XCJidG4tc2VsZWN0IGZyaWdodFwiIHYtb246Y2xpY2s9XCJzZWxlY3REZWZhdWx0VmFsdWVWaWV3XCI+Li4uPC9idXR0b24+PC90ZD4nICsgJzwvdHI+JyArICc8dHIgc3R5bGU9XCJoZWlnaHQ6IDM1cHhcIj4nICsgJzx0ZCBjb2xzcGFuPVwiNFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcIj4nICsgJ3t7dGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0fX0nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkIGNvbHNwYW49XCI0XCI+JyArICcgICAg5qCh6aqM6KeE5YiZPGJ1dHRvbiBjbGFzcz1cImJ0bi1zZWxlY3QgZnJpZ2h0XCIgdi1vbjpjbGljaz1cInNlbGVjdFZhbGlkYXRlUnVsZVZpZXdcIj4uLi48L2J1dHRvbj4nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkIGNvbHNwYW49XCI0XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmXCI+JyArICc8dGFibGUgY2xhc3M9XCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclwiPicgKyAnPGNvbGdyb3VwPicgKyAnPGNvbCBzdHlsZT1cIndpZHRoOiAxMDBweFwiIC8+JyArICc8Y29sIC8+JyArICc8L2NvbGdyb3VwPicgKyAnPHRyPicgKyAnPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPuaPkOekuua2iOaBr++8mjwvdGQ+JyArICc8dGQ+e3t2YWxpZGF0ZVJ1bGVzLm1zZ319PC90ZD4nICsgJzwvdHI+JyArICc8dHI+JyArICc8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+6aqM6K+B57G75Z6LPC90ZD4nICsgJzx0ZCBzdHlsZT1cImJhY2tncm91bmQ6ICNlOGVhZWM7dGV4dC1hbGlnbjogY2VudGVyO1wiPuWPguaVsDwvdGQ+JyArICc8L3RyPicgKyAnPHRyIHYtZm9yPVwicnVsZUl0ZW0gaW4gdmFsaWRhdGVSdWxlcy5ydWxlc1wiPicgKyAnPHRkIHN0eWxlPVwiYmFja2dyb3VuZDogI2ZmZmZmZjt0ZXh0LWFsaWduOiBjZW50ZXI7Y29sb3I6ICNhZDkzNjFcIj57e3J1bGVJdGVtLnZhbGlkYXRlVHlwZX19PC90ZD4nICsgJzx0ZCBzdHlsZT1cImJhY2tncm91bmQ6ICNmZmZmZmY7dGV4dC1hbGlnbjogY2VudGVyO1wiPjxwIHYtaWY9XCJydWxlSXRlbS52YWxpZGF0ZVBhcmFzID09PSBcXCdcXCdcIj7ml6Dlj4LmlbA8L3A+PHAgdi1lbHNlPnt7cnVsZUl0ZW0udmFsaWRhdGVQYXJhc319PC9wPjwvdGQ+JyArICc8L3RyPicgKyAnPC90YWJsZT4nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPC90YWJsZT4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImpzLWRlc2lnbi1jb2RlLWZyYWdtZW50XCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAganNFZGl0b3JJbnN0YW5jZTogbnVsbFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIHNldEpTRWRpdG9ySW5zdGFuY2U6IGZ1bmN0aW9uIHNldEpTRWRpdG9ySW5zdGFuY2Uob2JqKSB7XG4gICAgICB0aGlzLmpzRWRpdG9ySW5zdGFuY2UgPSBvYmo7XG4gICAgfSxcbiAgICBnZXRKc0VkaXRvckluc3Q6IGZ1bmN0aW9uIGdldEpzRWRpdG9ySW5zdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmpzRWRpdG9ySW5zdGFuY2U7XG4gICAgfSxcbiAgICBpbnNlcnRKczogZnVuY3Rpb24gaW5zZXJ0SnMoanMpIHtcbiAgICAgIHZhciBkb2MgPSB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmdldERvYygpO1xuICAgICAgdmFyIGN1cnNvciA9IGRvYy5nZXRDdXJzb3IoKTtcbiAgICAgIGRvYy5yZXBsYWNlUmFuZ2UoanMsIGN1cnNvcik7XG4gICAgfSxcbiAgICBmb3JtYXRKUzogZnVuY3Rpb24gZm9ybWF0SlMoKSB7XG4gICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW1wic2VsZWN0QWxsXCJdKHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkpO1xuICAgICAgdmFyIHJhbmdlID0ge1xuICAgICAgICBmcm9tOiB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgdG86IHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKGZhbHNlKVxuICAgICAgfTtcbiAgICAgIDtcbiAgICAgIHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkuYXV0b0Zvcm1hdFJhbmdlKHJhbmdlLmZyb20sIHJhbmdlLnRvKTtcbiAgICB9LFxuICAgIGFsZXJ0RGVzYzogZnVuY3Rpb24gYWxlcnREZXNjKCkge30sXG4gICAgcmVmU2NyaXB0OiBmdW5jdGlvbiByZWZTY3JpcHQoKSB7XG4gICAgICB2YXIganMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIiBzcmM9XFxcIiR7Y29udGV4dFBhdGh9L1VJQ29tcG9uZW50L1RyZWVUYWJsZS9Kcy9UcmVlVGFibGUuanNcXFwiPjwvc2NyaXB0PlwiO1xuICAgICAgdGhpcy5pbnNlcnRKcyhqcyk7XG4gICAgfSxcbiAgICBjYWxsU2VydmljZU1ldGhvZDogZnVuY3Rpb24gY2FsbFNlcnZpY2VNZXRob2QoKSB7fVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LXdyYXBcIj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCIgQGNsaWNrPVwiZm9ybWF0SlNcIj7moLzlvI/ljJY8L2Rpdj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+6K+05piOPC9kaXY+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiIEBjbGljaz1cInJlZlNjcmlwdFwiPuW8leWFpeiEmuacrDwvZGl2PlxcXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIj7ojrflj5ZVUkzlj4LmlbA8L2Rpdj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+6LCD55So5pyN5Yqh5pa55rOVPC9kaXY+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiPuWKoOi9veaVsOaNruWtl+WFuDwvZGl2PlxcXHJcbiAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHt9LCBmYWxzZSk7XG5WdWUuY29tcG9uZW50KFwibW9kdWxlLWxpc3QtZmxvdy1jb21wXCIsIHtcbiAgcHJvcHM6IFsnbGlzdEhlaWdodCcsICdtb2R1bGVEYXRhJywgJ2FjdGl2ZVRhYk5hbWUnXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgc2F2ZU1vZGVsOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvU2F2ZU1vZGVsXCIsXG4gICAgICAgIGdldEVkaXRNb2RlbFVSTDogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRmxvd01vZGVsL0dldEVkaXRNb2RlbFVSTFwiLFxuICAgICAgICBnZXRWaWV3TW9kZWxVUkw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zsb3dNb2RlbC9HZXRWaWV3TW9kZWxVUkxcIixcbiAgICAgICAgcmVsb2FkRGF0YTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRmxvd01vZGVsL0dldExpc3REYXRhXCIsXG4gICAgICAgIGdldFNpbmdsZURhdGE6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zsb3dNb2RlbC9HZXREZXRhaWxEYXRhXCIsXG4gICAgICAgIGRlbGV0ZTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRmxvd01vZGVsL0RlbGV0ZU1vZGVsXCIsXG4gICAgICAgIG1vdmU6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zsb3dNb2RlbC9Nb3ZlXCIsXG4gICAgICAgIGRlZmF1bHRGbG93TW9kZWxJbWFnZTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRmxvd01vZGVsL0dldFByb2Nlc3NNb2RlbE1haW5JbWdcIlxuICAgICAgfSxcbiAgICAgIGlkRmllbGROYW1lOiBcIm1vZGVsSWRcIixcbiAgICAgIHNlYXJjaENvbmRpdGlvbjoge1xuICAgICAgICBtb2RlbE1vZHVsZUlkOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW5Y+3JyxcbiAgICAgICAga2V5OiAnbW9kZWxDb2RlJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHdpZHRoOiA4MFxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+a1geeoi+WQjeensCcsXG4gICAgICAgIGtleTogJ21vZGVsTmFtZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5ZCv5YqoS2V5JyxcbiAgICAgICAga2V5OiAnbW9kZWxTdGFydEtleScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5aSH5rOoJyxcbiAgICAgICAga2V5OiAnbW9kZWxEZXNjJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJbovpHml7bpl7QnLFxuICAgICAgICBrZXk6ICdtb2RlbFVwZGF0ZVRpbWUnLFxuICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlUmVuZGVyZXIuVG9EYXRlWVlZWV9NTV9ERChoLCBwYXJhbXMucm93Lm1vZGVsVXBkYXRlVGltZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICBrZXk6ICdtb2RlbElkJyxcbiAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgfSwgW3dpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wLmVkaXRNb2RlbEJ1dHRvbihoLCBwYXJhbXMsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wLmlkRmllbGROYW1lLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcCksIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wLnZpZXdNb2RlbEJ1dHRvbihoLCBwYXJhbXMsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wLmlkRmllbGROYW1lLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcCksIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRWRpdEJ1dHRvbihoLCBwYXJhbXMsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wLmlkRmllbGROYW1lLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcCksIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wKV0pO1xuICAgICAgICB9XG4gICAgICB9XSxcbiAgICAgIHRhYmxlRGF0YTogW10sXG4gICAgICB0YWJsZURhdGFPcmlnaW5hbDogW10sXG4gICAgICBzZWxlY3Rpb25Sb3dzOiBudWxsLFxuICAgICAgcGFnZVRvdGFsOiAwLFxuICAgICAgcGFnZVNpemU6IDUwMCxcbiAgICAgIHBhZ2VOdW06IDEsXG4gICAgICBzZWFyY2hUZXh0OiBcIlwiLFxuICAgICAgZmxvd01vZGVsRW50aXR5OiB7XG4gICAgICAgIG1vZGVsSWQ6IFwiXCIsXG4gICAgICAgIG1vZGVsRGVJZDogXCJcIixcbiAgICAgICAgbW9kZWxNb2R1bGVJZDogXCJcIixcbiAgICAgICAgbW9kZWxHcm91cElkOiBcIlwiLFxuICAgICAgICBtb2RlbE5hbWU6IFwiXCIsXG4gICAgICAgIG1vZGVsQ3JlYXRlVGltZTogRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGEoKSxcbiAgICAgICAgbW9kZWxDcmVhdGVyOiBcIlwiLFxuICAgICAgICBtb2RlbFVwZGF0ZVRpbWU6IERhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhKCksXG4gICAgICAgIG1vZGVsVXBkYXRlcjogXCJcIixcbiAgICAgICAgbW9kZWxEZXNjOiBcIlwiLFxuICAgICAgICBtb2RlbFN0YXR1czogXCLlkK/nlKhcIixcbiAgICAgICAgbW9kZWxPcmRlck51bTogXCJcIixcbiAgICAgICAgbW9kZWxEZXBsb3ltZW50SWQ6IFwiXCIsXG4gICAgICAgIG1vZGVsU3RhcnRLZXk6IFwiXCIsXG4gICAgICAgIG1vZGVsUmVzb3VyY2VOYW1lOiBcIlwiLFxuICAgICAgICBtb2RlbEZyb21UeXBlOiBcIlwiLFxuICAgICAgICBtb2RlbE1haW5JbWFnZUlkOiBcIkRlZk1vZGVsTWFpbkltYWdlSWRcIlxuICAgICAgfSxcbiAgICAgIGVtcHR5Rmxvd01vZGVsRW50aXR5OiB7fSxcbiAgICAgIGltcG9ydEVYRGF0YToge1xuICAgICAgICBtb2RlbE1vZHVsZUlkOiBcIlwiXG4gICAgICB9LFxuICAgICAgcnVsZVZhbGlkYXRlOiB7XG4gICAgICAgIG1vZGVsTmFtZTogW3tcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAn44CQ5qih5Z6L5ZCN56ew44CR5LiN6IO956m677yBJyxcbiAgICAgICAgICB0cmlnZ2VyOiAnYmx1cidcbiAgICAgICAgfV0sXG4gICAgICAgIG1vZGVsU3RhcnRLZXk6IFt7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogJ+OAkOaooeWei0tleeOAkeS4jeiDveepuu+8gScsXG4gICAgICAgICAgdHJpZ2dlcjogJ2JsdXInXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgZGVmYXVsdEZsb3dNb2RlbEltYWdlU3JjOiBcIlwiLFxuICAgICAgdmFsdWUxOiBmYWxzZVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuZmxvd01vZGVsRW50aXR5KSB7XG4gICAgICB0aGlzLmVtcHR5Rmxvd01vZGVsRW50aXR5W2tleV0gPSB0aGlzLmZsb3dNb2RlbEVudGl0eVtrZXldO1xuICAgIH1cbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBtb2R1bGVEYXRhOiBmdW5jdGlvbiBtb2R1bGVEYXRhKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBhY3RpdmVUYWJOYW1lOiBmdW5jdGlvbiBhY3RpdmVUYWJOYW1lKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBzZWFyY2hUZXh0OiBmdW5jdGlvbiBzZWFyY2hUZXh0KG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICB2YXIgZmlsdGVyVGFibGVEYXRhID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlRGF0YVtpXTtcblxuICAgICAgICAgIGlmIChyb3cubW9kZWxDb2RlLmluZGV4T2YobmV3VmFsKSA+PSAwKSB7XG4gICAgICAgICAgICBmaWx0ZXJUYWJsZURhdGEucHVzaChyb3cpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocm93Lm1vZGVsTmFtZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IGZpbHRlclRhYmxlRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gdGhpcy50YWJsZURhdGFPcmlnaW5hbDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoZGlhbG9nSWQpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coZGlhbG9nSWQpO1xuICAgIH0sXG4gICAgZ2V0TW9kdWxlTmFtZTogZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vZHVsZURhdGEgPT0gbnVsbCA/IFwi6K+36YCJ5Lit5qih5Z2XXCIgOiB0aGlzLm1vZHVsZURhdGEubW9kdWxlVGV4dDtcbiAgICB9LFxuICAgIHN0YXR1c0VuYWJsZTogZnVuY3Rpb24gc3RhdHVzRW5hYmxlKHN0YXR1c05hbWUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2UodGhpcy5hY0ludGVyZmFjZS5zdGF0dXNDaGFuZ2UsIHRoaXMuc2VsZWN0aW9uUm93cywgYXBwTGlzdC5pZEZpZWxkTmFtZSwgc3RhdHVzTmFtZSwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKHR5cGUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld01vdmVGYWNlKHRoaXMuYWNJbnRlcmZhY2UubW92ZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCB0aGlzLmlkRmllbGROYW1lLCB0eXBlLCB0aGlzKTtcbiAgICB9LFxuICAgIHNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlKHNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gc2VsZWN0aW9uO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCAmJiB0aGlzLmFjdGl2ZVRhYk5hbWUgPT0gXCJsaXN0LWZsb3dcIikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5tb2RlbE1vZHVsZUlkLnZhbHVlID0gdGhpcy5tb2R1bGVEYXRhLm1vZHVsZUlkO1xuICAgICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoKHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkRGF0YSwgdGhpcy5wYWdlTnVtLCB0aGlzLnBhZ2VTaXplLCB0aGlzLnNlYXJjaENvbmRpdGlvbiwgdGhpcywgdGhpcy5pZEZpZWxkTmFtZSwgdHJ1ZSwgZnVuY3Rpb24gKHJlc3VsdCwgcGFnZUFwcE9iaikge1xuICAgICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhT3JpZ2luYWwgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZCgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICBEZXRhaWxQYWdlVXRpbGl0eS5PdmVycmlkZU9iamVjdFZhbHVlRnVsbCh0aGlzLmZsb3dNb2RlbEVudGl0eSwgdGhpcy5lbXB0eUZsb3dNb2RlbEVudGl0eSk7XG4gICAgICAgIHRoaXMuZGVmYXVsdEZsb3dNb2RlbEltYWdlU3JjID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5hY0ludGVyZmFjZS5kZWZhdWx0Rmxvd01vZGVsSW1hZ2UsIHtcbiAgICAgICAgICBmaWxlSWQ6IFwiZGVmYXVsdEZsb3dNb2RlbEltYWdlXCJcbiAgICAgICAgfSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbShcImRpdk5ld0Zsb3dNb2RlbFdyYXBcIiwge1xuICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgIHdpZHRoOiA2NzAsXG4gICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgdGl0bGU6IFwi5Yib5bu65rWB56iL5qih5Z6LXCJcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nmqKHlnZchXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChyZWNvcmRJZCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgX3NlbGYuJHJlZnNbXCJmbG93TW9kZWxFbnRpdHlcIl0ucmVzZXRGaWVsZHMoKTtcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFNpbmdsZURhdGEsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZElkLFxuICAgICAgICBvcDogXCJlZGl0XCJcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuT3ZlcnJpZGVPYmplY3RWYWx1ZUZ1bGwoX3NlbGYuZmxvd01vZGVsRW50aXR5LCByZXN1bHQuZGF0YSk7XG4gICAgICAgICAgX3NlbGYuZGVmYXVsdEZsb3dNb2RlbEltYWdlU3JjID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oX3NlbGYuYWNJbnRlcmZhY2UuZGVmYXVsdEZsb3dNb2RlbEltYWdlLCB7XG4gICAgICAgICAgICBmaWxlSWQ6IF9zZWxmLmZsb3dNb2RlbEVudGl0eS5tb2RlbE1haW5JbWFnZUlkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtKFwiZGl2TmV3Rmxvd01vZGVsV3JhcFwiLCB7XG4gICAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgIHRpdGxlOiBcIue8lui+kea1geeoi+aooeWei+amguWGtVwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiBkZWwocmVjb3JkSWQpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlRGVsZXRlUm93KHRoaXMuYWNJbnRlcmZhY2UuZGVsZXRlLCByZWNvcmRJZCwgdGhpcyk7XG4gICAgfSxcbiAgICBoYW5kbGVTdWJtaXRGbG93TW9kZWxFZGl0OiBmdW5jdGlvbiBoYW5kbGVTdWJtaXRGbG93TW9kZWxFZGl0KG5hbWUpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMuJHJlZnNbbmFtZV0udmFsaWRhdGUoZnVuY3Rpb24gKHZhbGlkKSB7XG4gICAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICAgIF9zZWxmLmZsb3dNb2RlbEVudGl0eS5tb2RlbE1vZHVsZUlkID0gX3NlbGYubW9kdWxlRGF0YS5tb2R1bGVJZDtcblxuICAgICAgICAgIHZhciBfZGVzaWduTW9kZWwgPSBfc2VsZi5mbG93TW9kZWxFbnRpdHkubW9kZWxJZCA9PSBcIlwiID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICAgICAgdmFyIHNlbmREYXRhID0gSlNPTi5zdHJpbmdpZnkoX3NlbGYuZmxvd01vZGVsRW50aXR5KTtcbiAgICAgICAgICBBamF4VXRpbGl0eS5Qb3N0UmVxdWVzdEJvZHkoX3NlbGYuYWNJbnRlcmZhY2Uuc2F2ZU1vZGVsLCBzZW5kRGF0YSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIF9zZWxmLmhhbmRsZUNsb3NlKFwiZGl2TmV3Rmxvd01vZGVsV3JhcFwiKTtcblxuICAgICAgICAgICAgICBfc2VsZi5yZWxvYWREYXRhKCk7XG5cbiAgICAgICAgICAgICAgaWYgKF9kZXNpZ25Nb2RlbCkge1xuICAgICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuT3Blbk5ld1dpbmRvdyh3aW5kb3csIFwiZWRpdE1vZGVsV2ViV2luZG93XCIsIHJlc3VsdC5kYXRhLmVkaXRNb2RlbFdlYlVybCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIFwianNvblwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLiRNZXNzYWdlLmVycm9yKCdGYWlsIScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGltcG9ydE1vZGVsOiBmdW5jdGlvbiBpbXBvcnRNb2RlbCgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICBEZXRhaWxQYWdlVXRpbGl0eS5PdmVycmlkZU9iamVjdFZhbHVlRnVsbCh0aGlzLmZsb3dNb2RlbEVudGl0eSwgdGhpcy5lbXB0eUZsb3dNb2RlbEVudGl0eSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbShcImRpdkltcG9ydEZsb3dNb2RlbFdyYXBcIiwge1xuICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICAgICAgdGl0bGU6IFwi5a+85YWl5rWB56iL5qih5Z6LXCJcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nmqKHlnZchXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBsb2FkU3VjY2VzczogZnVuY3Rpb24gdXBsb2FkU3VjY2VzcyhyZXNwb25zZSwgZmlsZSwgZmlsZUxpc3QpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXNwb25zZS5tZXNzYWdlLCBudWxsKTtcblxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCdkaXZJbXBvcnRGbG93TW9kZWxXcmFwJyk7XG4gICAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYmluZFVwbG9hZEV4RGF0YTogZnVuY3Rpb24gYmluZFVwbG9hZEV4RGF0YSgpIHtcbiAgICAgIHRoaXMuaW1wb3J0RVhEYXRhLm1vZGVsTW9kdWxlSWQgPSB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWQ7XG4gICAgfSxcbiAgICB1cGxvYWRGbG93TW9kZWxJbWFnZVN1Y2Nlc3M6IGZ1bmN0aW9uIHVwbG9hZEZsb3dNb2RlbEltYWdlU3VjY2VzcyhyZXNwb25zZSwgZmlsZSwgZmlsZUxpc3QpIHtcbiAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIHRoaXMuZmxvd01vZGVsRW50aXR5Lm1vZGVsTWFpbkltYWdlSWQgPSBkYXRhLmZpbGVJZDtcbiAgICAgIHRoaXMuZGVmYXVsdEZsb3dNb2RlbEltYWdlU3JjID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5hY0ludGVyZmFjZS5kZWZhdWx0Rmxvd01vZGVsSW1hZ2UsIHtcbiAgICAgICAgZmlsZUlkOiB0aGlzLmZsb3dNb2RlbEVudGl0eS5tb2RlbE1haW5JbWFnZUlkXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGVkaXRNb2RlbEJ1dHRvbjogZnVuY3Rpb24gZWRpdE1vZGVsQnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIGVkaXQtbW9kZWxcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLmVkaXRNb2RlbChwYXJhbXMucm93W2lkRmllbGRdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdmlld01vZGVsQnV0dG9uOiBmdW5jdGlvbiB2aWV3TW9kZWxCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gdmlldy1tb2RlbFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmoudmlld01vZGVsKHBhcmFtcy5yb3dbaWRGaWVsZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBlZGl0TW9kZWw6IGZ1bmN0aW9uIGVkaXRNb2RlbChyZWNvcmRJZCkge1xuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldEVkaXRNb2RlbFVSTCwge1xuICAgICAgICBtb2RlbElkOiByZWNvcmRJZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCByZXN1bHQuZGF0YS5lZGl0TW9kZWxXZWJVcmwsIHtcbiAgICAgICAgICB0aXRsZTogXCLmtYHnqIvorr7orqFcIixcbiAgICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIHZpZXdNb2RlbDogZnVuY3Rpb24gdmlld01vZGVsKHJlY29yZElkKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0Vmlld01vZGVsVVJMLCB7XG4gICAgICAgIG1vZGVsSWQ6IHJlY29yZElkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHJlc3VsdC5kYXRhLmVkaXRNb2RlbFdlYlVybCwge1xuICAgICAgICAgIHRpdGxlOiBcIua1geeoi+a1j+iniFwiLFxuICAgICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICAgIH0sIDApO1xuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibW9kdWxlLWxpc3Qtd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBpZD1cImRpdk5ld0Zsb3dNb2RlbFdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFwiIHN0eWxlPVwicGFkZGluZzogMTBweDt3aWR0aDogMTAwJVwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDcwJTtmbG9hdDogbGVmdFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktZm9ybSByZWY9XCJmbG93TW9kZWxFbnRpdHlcIiA6bW9kZWw9XCJmbG93TW9kZWxFbnRpdHlcIiA6cnVsZXM9XCJydWxlVmFsaWRhdGVcIiA6bGFiZWwtd2lkdGg9XCIxMDBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVwi5qih5Z6L5ZCN56ew77yaXCIgcHJvcD1cIm1vZGVsTmFtZVwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVwiZmxvd01vZGVsRW50aXR5Lm1vZGVsTmFtZVwiPjwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVwi5qih5Z6LS2V577yaXCIgcHJvcD1cIm1vZGVsU3RhcnRLZXlcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cImZsb3dNb2RlbEVudGl0eS5tb2RlbFN0YXJ0S2V5XCI+PC9pLWlucHV0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XCLmj4/ov7DvvJpcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cImZsb3dNb2RlbEVudGl0eS5tb2RlbERlc2NcIiB0eXBlPVwidGV4dGFyZWFcIiA6YXV0b3NpemU9XCJ7bWluUm93czogMTEsbWF4Um93czogMTF9XCI+PC9pLWlucHV0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWZvcm0+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDI5JTtmbG9hdDogcmlnaHRcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyA6c3JjPVwiZGVmYXVsdEZsb3dNb2RlbEltYWdlU3JjXCIgY2xhc3M9XCJmbG93TW9kZWxJbWdcIiAvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXBsb2FkIHN0eWxlPVwibWFyZ2luOjEwcHggMTJweCAwIDIwcHhcIiA6ZGF0YT1cImltcG9ydEVYRGF0YVwiIDpiZWZvcmUtdXBsb2FkPVwiYmluZFVwbG9hZEV4RGF0YVwiIDpvbi1zdWNjZXNzPVwidXBsb2FkRmxvd01vZGVsSW1hZ2VTdWNjZXNzXCIgbXVsdGlwbGUgdHlwZT1cImRyYWdcIiBuYW1lPVwiZmlsZVwiIGFjdGlvbj1cIi4uLy4uLy4uL1BsYXRGb3JtL0J1aWxkZXIvRmxvd01vZGVsL1VwbG9hZFByb2Nlc3NNb2RlbE1haW5JbWcuZG9cIiBhY2NlcHQ9XCIucG5nXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cInBhZGRpbmc6MjBweCAwcHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGljb24gdHlwZT1cImlvcy1jbG91ZC11cGxvYWRcIiBzaXplPVwiNTJcIiBzdHlsZT1cImNvbG9yOiAjMzM5OWZmXCI+PC9pY29uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD7kuIrkvKDmtYHnqIvkuLvpopjlm77niYc8L3A+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VwbG9hZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tb3V0ZXItd3JhcFwiIHN0eWxlPVwiaGVpZ2h0OiA0MHB4O3BhZGRpbmctcmlnaHQ6IDEwcHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24taW5uZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cImhhbmRsZVN1Ym1pdEZsb3dNb2RlbEVkaXQoXFwnZmxvd01vZGVsRW50aXR5XFwnKVwiPiDkv50g5a2YPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cImhhbmRsZUNsb3NlKFxcJ2Rpdk5ld0Zsb3dNb2RlbFdyYXBcXCcpXCI+5YWzIOmXrTwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgaWQ9XCJkaXZJbXBvcnRGbG93TW9kZWxXcmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcIiBzdHlsZT1cInBhZGRpbmc6IDEwcHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVwbG9hZCA6ZGF0YT1cImltcG9ydEVYRGF0YVwiIDpiZWZvcmUtdXBsb2FkPVwiYmluZFVwbG9hZEV4RGF0YVwiIDpvbi1zdWNjZXNzPVwidXBsb2FkU3VjY2Vzc1wiIG11bHRpcGxlIHR5cGU9XCJkcmFnXCIgbmFtZT1cImZpbGVcIiBhY3Rpb249XCIuLi8uLi8uLi9QbGF0Rm9ybS9CdWlsZGVyL0Zsb3dNb2RlbC9JbXBvcnRQcm9jZXNzTW9kZWwuZG9cIiBhY2NlcHQ9XCIuYnBtblwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cInBhZGRpbmc6IDIwcHggMFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpY29uIHR5cGU9XCJpb3MtY2xvdWQtdXBsb2FkXCIgc2l6ZT1cIjUyXCIgc3R5bGU9XCJjb2xvcjogIzMzOTlmZlwiPjwvaWNvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5DbGljayBvciBkcmFnIGZpbGVzIGhlcmUgdG8gdXBsb2FkPC9wPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdXBsb2FkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLW91dGVyLXdyYXBcIiBzdHlsZT1cImhlaWdodDogNDBweDtwYWRkaW5nLXJpZ2h0OiAxMHB4XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWlubmVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVwiaGFuZGxlQ2xvc2UoXFwnZGl2SW1wb3J0Rmxvd01vZGVsV3JhcFxcJylcIj7lhbMg6ZetPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3QtYnV0dG9uLXdyYXBcIiBjbGFzcz1cImxpc3QtYnV0dG9uLW91dGVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kdWxlLWxpc3QtbmFtZVwiPjxJY29uIHR5cGU9XCJpb3MtYXJyb3ctZHJvcHJpZ2h0LWNpcmNsZVwiIC8+Jm5ic3A75qih5Z2X44CQe3tnZXRNb2R1bGVOYW1lKCl9feOAkTwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWJ1dHRvbi1pbm5lci13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiAgdHlwZT1cInN1Y2Nlc3NcIiBAY2xpY2s9XCJhZGQoKVwiIGljb249XCJtZC1hZGRcIj7mlrDlop48L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwiaW1wb3J0TW9kZWwoKVwiIGljb249XCJtZC1hZGRcIj7kuIrkvKDmqKHlnosgPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYWxidW1zXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+5aSN5Yi2PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYm9va21hcmtzXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+5Y6G5Y+y5qih5Z6LPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYnJ1c2hcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj7lpI3liLZJRDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ3VwXFwnKVwiIGljb249XCJtZC1hcnJvdy11cFwiPuS4iuenuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ2Rvd25cXCcpXCIgaWNvbj1cIm1kLWFycm93LWRvd25cIj7kuIvnp7s8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogcmlnaHQ7d2lkdGg6IDIwMHB4O21hcmdpbi1yaWdodDogMTBweDtcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVwiaW5wdXRfYm9yZGVyX2JvdHRvbVwiIHYtbW9kZWw9XCJzZWFyY2hUZXh0XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY2xlYXI6IGJvdGhcIj48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cImxpc3RIZWlnaHRcIiBzdHJpcGUgYm9yZGVyIDpjb2x1bW5zPVwiY29sdW1uc0NvbmZpZ1wiIDpkYXRhPVwidGFibGVEYXRhXCJcXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiaXYtbGlzdC10YWJsZVwiIDpoaWdobGlnaHQtcm93PVwidHJ1ZVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tc2VsZWN0aW9uLWNoYW5nZT1cInNlbGVjdGlvbkNoYW5nZVwiPjwvaS10YWJsZT5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJtb2R1bGUtbGlzdC13ZWJmb3JtLWNvbXBcIiwge1xuICBwcm9wczogWydsaXN0SGVpZ2h0JywgJ21vZHVsZURhdGEnLCAnYWN0aXZlVGFiTmFtZSddLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBlZGl0VmlldzogXCIvSFRNTC9CdWlsZGVyL0Zvcm0vRm9ybURlc2lnbi5odG1sXCIsXG4gICAgICAgIHJlbG9hZERhdGE6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zvcm0vR2V0TGlzdERhdGFcIixcbiAgICAgICAgZGVsZXRlOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9Gb3JtL0RlbGV0ZVwiLFxuICAgICAgICBtb3ZlOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9Gb3JtL01vdmVcIlxuICAgICAgfSxcbiAgICAgIGlkRmllbGROYW1lOiBcImZvcm1JZFwiLFxuICAgICAgc2VhcmNoQ29uZGl0aW9uOiB7XG4gICAgICAgIGZvcm1Nb2R1bGVJZDoge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLlN0cmluZ1R5cGVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgIHR5cGU6ICdzZWxlY3Rpb24nLFxuICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e8luWPtycsXG4gICAgICAgIGtleTogJ2Zvcm1Db2RlJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHdpZHRoOiA4MFxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+ihqOWNleWQjeensCcsXG4gICAgICAgIGtleTogJ2Zvcm1OYW1lJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfllK/kuIDlkI0nLFxuICAgICAgICBrZXk6ICdmb3JtU2luZ2xlTmFtZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5aSH5rOoJyxcbiAgICAgICAga2V5OiAnZm9ybURlc2MnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e8lui+keaXtumXtCcsXG4gICAgICAgIGtleTogJ2Zvcm1VcGRhdGVUaW1lJyxcbiAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZVJlbmRlcmVyLlRvRGF0ZVlZWVlfTU1fREQoaCwgcGFyYW1zLnJvdy5mb3JtVXBkYXRlVGltZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICBrZXk6ICdmb3JtSWQnLFxuICAgICAgICB3aWR0aDogMTIwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICB9LCBbTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5FZGl0QnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0d2ViZm9ybWNvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdHdlYmZvcm1jb21wKSwgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5EZWxldGVCdXR0b24oaCwgcGFyYW1zLCB3aW5kb3cuX21vZHVsZWxpc3R3ZWJmb3JtY29tcC5pZEZpZWxkTmFtZSwgd2luZG93Ll9tb2R1bGVsaXN0d2ViZm9ybWNvbXApXSk7XG4gICAgICAgIH1cbiAgICAgIH1dLFxuICAgICAgdGFibGVEYXRhOiBbXSxcbiAgICAgIHRhYmxlRGF0YU9yaWdpbmFsOiBbXSxcbiAgICAgIHNlbGVjdGlvblJvd3M6IG51bGwsXG4gICAgICBwYWdlVG90YWw6IDAsXG4gICAgICBwYWdlU2l6ZTogNTAwLFxuICAgICAgcGFnZU51bTogMSxcbiAgICAgIHNlYXJjaFRleHQ6IFwiXCJcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHdpbmRvdy5fbW9kdWxlbGlzdHdlYmZvcm1jb21wID0gdGhpcztcbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBtb2R1bGVEYXRhOiBmdW5jdGlvbiBtb2R1bGVEYXRhKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBhY3RpdmVUYWJOYW1lOiBmdW5jdGlvbiBhY3RpdmVUYWJOYW1lKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBzZWFyY2hUZXh0OiBmdW5jdGlvbiBzZWFyY2hUZXh0KG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICB2YXIgZmlsdGVyVGFibGVEYXRhID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlRGF0YVtpXTtcblxuICAgICAgICAgIGlmIChyb3cuZm9ybUNvZGUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyb3cuZm9ybU5hbWUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YWJsZURhdGEgPSBmaWx0ZXJUYWJsZURhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IHRoaXMudGFibGVEYXRhT3JpZ2luYWw7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgc2VsZWN0aW9uQ2hhbmdlOiBmdW5jdGlvbiBzZWxlY3Rpb25DaGFuZ2Uoc2VsZWN0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBzZWxlY3Rpb247XG4gICAgfSxcbiAgICByZWxvYWREYXRhOiBmdW5jdGlvbiByZWxvYWREYXRhKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsICYmIHRoaXMuYWN0aXZlVGFiTmFtZSA9PSBcImxpc3Qtd2ViZm9ybVwiKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmZvcm1Nb2R1bGVJZC52YWx1ZSA9IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZDtcbiAgICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVMb2FkRGF0YVNlYXJjaCh0aGlzLmFjSW50ZXJmYWNlLnJlbG9hZERhdGEsIHRoaXMucGFnZU51bSwgdGhpcy5wYWdlU2l6ZSwgdGhpcy5zZWFyY2hDb25kaXRpb24sIHRoaXMsIHRoaXMuaWRGaWVsZE5hbWUsIHRydWUsIGZ1bmN0aW9uIChyZXN1bHQsIHBhZ2VBcHBPYmopIHtcbiAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YU9yaWdpbmFsID0gcmVzdWx0LmRhdGEubGlzdDtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbiBhZGQoKSB7XG4gICAgICBpZiAodGhpcy5tb2R1bGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRWaWV3LCB7XG4gICAgICAgICAgXCJvcFwiOiBcImFkZFwiLFxuICAgICAgICAgIFwibW9kdWxlSWRcIjogdGhpcy5tb2R1bGVEYXRhLm1vZHVsZUlkXG4gICAgICAgIH0pO1xuICAgICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgfSwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nmqKHlnZchXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChyZWNvcmRJZCkge1xuICAgICAgZGVidWdnZXI7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdFZpZXcsIHtcbiAgICAgICAgXCJvcFwiOiBcInVwZGF0ZVwiLFxuICAgICAgICBcInJlY29yZElkXCI6IHJlY29yZElkXG4gICAgICB9KTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3Blbk5ld1dpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gZGVsKHJlY29yZElkKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZURlbGV0ZVJvdyh0aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZSwgcmVjb3JkSWQsIHRoaXMpO1xuICAgIH0sXG4gICAgc3RhdHVzRW5hYmxlOiBmdW5jdGlvbiBzdGF0dXNFbmFibGUoc3RhdHVzTmFtZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh0aGlzLmFjSW50ZXJmYWNlLnN0YXR1c0NoYW5nZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCBhcHBMaXN0LmlkRmllbGROYW1lLCBzdGF0dXNOYW1lLCBhcHBMaXN0KTtcbiAgICB9LFxuICAgIG1vdmU6IGZ1bmN0aW9uIG1vdmUodHlwZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3TW92ZUZhY2UodGhpcy5hY0ludGVyZmFjZS5tb3ZlLCB0aGlzLnNlbGVjdGlvblJvd3MsIHRoaXMuaWRGaWVsZE5hbWUsIHR5cGUsIHRoaXMpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibW9kdWxlLWxpc3Qtd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3QtYnV0dG9uLXdyYXBcIiBjbGFzcz1cImxpc3QtYnV0dG9uLW91dGVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1idXR0b24taW5uZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gIHR5cGU9XCJzdWNjZXNzXCIgQGNsaWNrPVwiYWRkKClcIiBpY29uPVwibWQtYWRkXCI+5paw5aKePC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYWRkXCI+5byV5YWlVVJMIDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLWFsYnVtc1wiPuWkjeWItjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLXByaWNldGFnXCI+6aKE6KeIPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYm9va21hcmtzXCI+5Y6G5Y+y54mI5pysPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYnJ1c2hcIj7lpI3liLZJRDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ3VwXFwnKVwiIGljb249XCJtZC1hcnJvdy11cFwiPuS4iuenuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ2Rvd25cXCcpXCIgaWNvbj1cIm1kLWFycm93LWRvd25cIj7kuIvnp7s8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiAyMDBweDttYXJnaW4tcmlnaHQ6IDEwcHg7XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cImlucHV0X2JvcmRlcl9ib3R0b21cIiB2LW1vZGVsPVwic2VhcmNoVGV4dFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImNsZWFyOiBib3RoXCI+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XCJsaXN0SGVpZ2h0XCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cImNvbHVtbnNDb25maWdcIiA6ZGF0YT1cInRhYmxlRGF0YVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIml2LWxpc3QtdGFibGVcIiA6aGlnaGxpZ2h0LXJvdz1cInRydWVcIlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XCJzZWxlY3Rpb25DaGFuZ2VcIj48L2ktdGFibGU+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwibW9kdWxlLWxpc3Qtd2VibGlzdC1jb21wXCIsIHtcbiAgcHJvcHM6IFsnbGlzdEhlaWdodCcsICdtb2R1bGVEYXRhJywgJ2FjdGl2ZVRhYk5hbWUnXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZWRpdFZpZXc6IFwiL0hUTUwvQnVpbGRlci9MaXN0L0xpc3REZXNpZ24uaHRtbFwiLFxuICAgICAgICByZWxvYWREYXRhOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9MaXN0L0dldExpc3REYXRhXCIsXG4gICAgICAgIGRlbGV0ZTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvTGlzdC9EZWxldGVcIixcbiAgICAgICAgbW92ZTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvTGlzdC9Nb3ZlXCJcbiAgICAgIH0sXG4gICAgICBpZEZpZWxkTmFtZTogXCJmb3JtSWRcIixcbiAgICAgIHNlYXJjaENvbmRpdGlvbjoge1xuICAgICAgICBmb3JtTW9kdWxlSWQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0eXBlOiAnc2VsZWN0aW9uJyxcbiAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJblj7cnLFxuICAgICAgICBrZXk6ICdmb3JtQ29kZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICB3aWR0aDogODBcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfooajljZXlkI3np7AnLFxuICAgICAgICBrZXk6ICdmb3JtTmFtZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5ZSv5LiA5ZCNJyxcbiAgICAgICAga2V5OiAnZm9ybVNpbmdsZU5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgIGtleTogJ2Zvcm1EZXNjJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJbovpHml7bpl7QnLFxuICAgICAgICBrZXk6ICdmb3JtVXBkYXRlVGltZScsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVSZW5kZXJlci5Ub0RhdGVZWVlZX01NX0REKGgsIHBhcmFtcy5yb3cuZm9ybVVwZGF0ZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnZm9ybUlkJyxcbiAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgfSwgW0xpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRWRpdEJ1dHRvbihoLCBwYXJhbXMsIHdpbmRvdy5fbW9kdWxlbGlzdHdlYmZvcm1jb21wLmlkRmllbGROYW1lLCB3aW5kb3cuX21vZHVsZWxpc3R3ZWJmb3JtY29tcCksIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0d2ViZm9ybWNvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdHdlYmZvcm1jb21wKV0pO1xuICAgICAgICB9XG4gICAgICB9XSxcbiAgICAgIHRhYmxlRGF0YTogW10sXG4gICAgICB0YWJsZURhdGFPcmlnaW5hbDogW10sXG4gICAgICBzZWxlY3Rpb25Sb3dzOiBudWxsLFxuICAgICAgcGFnZVRvdGFsOiAwLFxuICAgICAgcGFnZVNpemU6IDUwMCxcbiAgICAgIHBhZ2VOdW06IDEsXG4gICAgICBzZWFyY2hUZXh0OiBcIlwiXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB3aW5kb3cuX21vZHVsZWxpc3R3ZWJmb3JtY29tcCA9IHRoaXM7XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgbW9kdWxlRGF0YTogZnVuY3Rpb24gbW9kdWxlRGF0YShuZXdWYWwpIHtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0sXG4gICAgYWN0aXZlVGFiTmFtZTogZnVuY3Rpb24gYWN0aXZlVGFiTmFtZShuZXdWYWwpIHtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0sXG4gICAgc2VhcmNoVGV4dDogZnVuY3Rpb24gc2VhcmNoVGV4dChuZXdWYWwpIHtcbiAgICAgIGlmIChuZXdWYWwpIHtcbiAgICAgICAgdmFyIGZpbHRlclRhYmxlRGF0YSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgcm93ID0gdGhpcy50YWJsZURhdGFbaV07XG5cbiAgICAgICAgICBpZiAocm93LmZvcm1Db2RlLmluZGV4T2YobmV3VmFsKSA+PSAwKSB7XG4gICAgICAgICAgICBmaWx0ZXJUYWJsZURhdGEucHVzaChyb3cpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocm93LmZvcm1OYW1lLmluZGV4T2YobmV3VmFsKSA+PSAwKSB7XG4gICAgICAgICAgICBmaWx0ZXJUYWJsZURhdGEucHVzaChyb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gZmlsdGVyVGFibGVEYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50YWJsZURhdGEgPSB0aGlzLnRhYmxlRGF0YU9yaWdpbmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIHNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlKHNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gc2VsZWN0aW9uO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCAmJiB0aGlzLmFjdGl2ZVRhYk5hbWUgPT0gXCJsaXN0LXdlYmZvcm1cIikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5mb3JtTW9kdWxlSWQudmFsdWUgPSB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWQ7XG4gICAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlTG9hZERhdGFTZWFyY2godGhpcy5hY0ludGVyZmFjZS5yZWxvYWREYXRhLCB0aGlzLnBhZ2VOdW0sIHRoaXMucGFnZVNpemUsIHRoaXMuc2VhcmNoQ29uZGl0aW9uLCB0aGlzLCB0aGlzLmlkRmllbGROYW1lLCB0cnVlLCBmdW5jdGlvbiAocmVzdWx0LCBwYWdlQXBwT2JqKSB7XG4gICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFPcmlnaW5hbCA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJhZGRcIixcbiAgICAgICAgICBcIm1vZHVsZUlkXCI6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3V2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgIH0sIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup5qih5Z2XIVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVkaXQ6IGZ1bmN0aW9uIGVkaXQocmVjb3JkSWQpIHtcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRWaWV3LCB7XG4gICAgICAgIFwib3BcIjogXCJ1cGRhdGVcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZFxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGhlaWdodDogMFxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBkZWw6IGZ1bmN0aW9uIGRlbChyZWNvcmRJZCkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVEZWxldGVSb3codGhpcy5hY0ludGVyZmFjZS5kZWxldGUsIHJlY29yZElkLCB0aGlzKTtcbiAgICB9LFxuICAgIHN0YXR1c0VuYWJsZTogZnVuY3Rpb24gc3RhdHVzRW5hYmxlKHN0YXR1c05hbWUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2UodGhpcy5hY0ludGVyZmFjZS5zdGF0dXNDaGFuZ2UsIHRoaXMuc2VsZWN0aW9uUm93cywgYXBwTGlzdC5pZEZpZWxkTmFtZSwgc3RhdHVzTmFtZSwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKHR5cGUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld01vdmVGYWNlKHRoaXMuYWNJbnRlcmZhY2UubW92ZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCB0aGlzLmlkRmllbGROYW1lLCB0eXBlLCB0aGlzKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm1vZHVsZS1saXN0LXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0LWJ1dHRvbi13cmFwXCIgY2xhc3M9XCJsaXN0LWJ1dHRvbi1vdXRlci13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtYnV0dG9uLWlubmVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uICB0eXBlPVwic3VjY2Vzc1wiIEBjbGljaz1cImFkZCgpXCIgaWNvbj1cIm1kLWFkZFwiPuaWsOWinjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLWFsYnVtc1wiPuWkjeWItjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLXByaWNldGFnXCI+6aKE6KeIPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYm9va21hcmtzXCI+5Y6G5Y+y54mI5pysPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYnJ1c2hcIj7lpI3liLZJRDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ3VwXFwnKVwiIGljb249XCJtZC1hcnJvdy11cFwiPuS4iuenuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ2Rvd25cXCcpXCIgaWNvbj1cIm1kLWFycm93LWRvd25cIj7kuIvnp7s8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiAyMDBweDttYXJnaW4tcmlnaHQ6IDEwcHg7XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cImlucHV0X2JvcmRlcl9ib3R0b21cIiB2LW1vZGVsPVwic2VhcmNoVGV4dFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImNsZWFyOiBib3RoXCI+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XCJsaXN0SGVpZ2h0XCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cImNvbHVtbnNDb25maWdcIiA6ZGF0YT1cInRhYmxlRGF0YVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIml2LWxpc3QtdGFibGVcIiA6aGlnaGxpZ2h0LXJvdz1cInRydWVcIlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XCJzZWxlY3Rpb25DaGFuZ2VcIj48L2ktdGFibGU+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LWRlcGFydG1lbnQtdXNlci1kaWFsb2dcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXREZXBhcnRtZW50VHJlZURhdGE6IFwiL1BsYXRGb3JtUmVzdC9TU08vRGVwYXJ0bWVudC9HZXREZXBhcnRtZW50c0J5T3JnYW5JZFwiLFxuICAgICAgICBkZXBhcnRtZW50RWRpdFZpZXc6IFwiL0hUTUwvU1NPL0RlcGFydG1lbnQvRGVwYXJ0bWVudEVkaXQuaHRtbFwiLFxuICAgICAgICBkZWxldGVEZXBhcnRtZW50OiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0RlcGFydG1lbnQvRGVsZXRlXCIsXG4gICAgICAgIG1vdmVEZXBhcnRtZW50OiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0RlcGFydG1lbnQvTW92ZVwiLFxuICAgICAgICBsaXN0RWRpdFZpZXc6IFwiL0hUTUwvU1NPL0RlcGFydG1lbnQvRGVwYXJ0bWVudFVzZXJFZGl0Lmh0bWxcIixcbiAgICAgICAgcmVsb2FkTGlzdERhdGE6IFwiL1BsYXRGb3JtUmVzdC9TU08vRGVwYXJ0bWVudFVzZXIvR2V0TGlzdERhdGFcIixcbiAgICAgICAgZGVsZXRlTGlzdFJlY29yZDogXCIvUGxhdEZvcm1SZXN0L1NTTy9EZXBhcnRtZW50VXNlci9EZWxldGVcIixcbiAgICAgICAgbGlzdFN0YXR1c0NoYW5nZTogXCIvUGxhdEZvcm1SZXN0L1NTTy9EZXBhcnRtZW50VXNlci9TdGF0dXNDaGFuZ2VcIixcbiAgICAgICAgbGlzdE1vdmU6IFwiL1BsYXRGb3JtUmVzdC9TU08vRGVwYXJ0bWVudFVzZXIvTW92ZVwiXG4gICAgICB9LFxuICAgICAgdHJlZUlkRmllbGROYW1lOiBcImRlcHRJZFwiLFxuICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgIHRyZWVTZWxlY3RlZE5vZGU6IG51bGwsXG4gICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICBhc3luYzoge1xuICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICB1cmw6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgbmFtZTogXCJkZXB0TmFtZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBpZEtleTogXCJkZXB0SWRcIixcbiAgICAgICAgICAgIHBJZEtleTogXCJkZXB0UGFyZW50SWRcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuX2hvc3Q7XG5cbiAgICAgICAgICAgIF9zZWxmLnRyZWVOb2RlU2VsZWN0ZWQoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHtcbiAgICAgICAgICAgIGFwcExpc3QudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaWRGaWVsZE5hbWU6IFwiRFVfSURcIixcbiAgICAgIHNlYXJjaENvbmRpdGlvbjoge1xuICAgICAgICB1c2VyTmFtZToge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLkxpa2VTdHJpbmdUeXBlXG4gICAgICAgIH0sXG4gICAgICAgIGFjY291bnQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5MaWtlU3RyaW5nVHlwZVxuICAgICAgICB9LFxuICAgICAgICB1c2VyUGhvbmVOdW1iZXI6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5MaWtlU3RyaW5nVHlwZVxuICAgICAgICB9LFxuICAgICAgICBkZXBhcnRtZW50SWQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH0sXG4gICAgICAgIHNlYXJjaEluQUxMOiB7XG4gICAgICAgICAgdmFsdWU6IFwi5ZCmXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn55So5oi35ZCNJyxcbiAgICAgICAga2V5OiAnVVNFUl9OQU1FJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfmiYvmnLrlj7fnoIEnLFxuICAgICAgICBrZXk6ICdVU0VSX1BIT05FX05VTUJFUicsXG4gICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57uE57uH5py65p6EJyxcbiAgICAgICAga2V5OiAnT1JHQU5fTkFNRScsXG4gICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn6YOo6ZeoJyxcbiAgICAgICAga2V5OiAnREVQVF9OQU1FJyxcbiAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfkuLvlsZ4nLFxuICAgICAgICBrZXk6ICdEVV9JU19NQUlOJyxcbiAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiAxMixcbiAgICAgIHBhZ2VOdW06IDEsXG4gICAgICBsaXN0SGVpZ2h0OiAyNzBcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHZhciBvbGRTZWxlY3RlZE9yZ2FuSWQgPSBDb29raWVVdGlsaXR5LkdldENvb2tpZShcIkRNT1JHU0lEXCIpO1xuXG4gICAgaWYgKG9sZFNlbGVjdGVkT3JnYW5JZCkge1xuICAgICAgdGhpcy4kcmVmcy5zZWxlY3RPcmdhbkNvbXAuc2V0T2xkU2VsZWN0ZWRPcmdhbihvbGRTZWxlY3RlZE9yZ2FuSWQpO1xuICAgICAgdGhpcy5pbml0VHJlZShvbGRTZWxlY3RlZE9yZ2FuSWQpO1xuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGNoYW5nZU9yZ2FuOiBmdW5jdGlvbiBjaGFuZ2VPcmdhbihvcmdhbkRhdGEpIHtcbiAgICAgIENvb2tpZVV0aWxpdHkuU2V0Q29va2llMU1vbnRoKFwiRE1PUkdTSURcIiwgb3JnYW5EYXRhLm9yZ2FuSWQpO1xuICAgICAgdGhpcy5pbml0VHJlZShvcmdhbkRhdGEub3JnYW5JZCk7XG4gICAgICB0aGlzLmNsZWFyU2VhcmNoQ29uZGl0aW9uKCk7XG4gICAgICB0aGlzLnRhYmxlRGF0YSA9IFtdO1xuICAgIH0sXG4gICAgaW5pdFRyZWU6IGZ1bmN0aW9uIGluaXRUcmVlKG9yZ2FuSWQpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXREZXBhcnRtZW50VHJlZURhdGEsIHtcbiAgICAgICAgXCJvcmdhbklkXCI6IG9yZ2FuSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuJHJlZnMuelRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1kZXBhcnRtZW50LXVzZXItZGlhbG9nLVwiICsgU3RyaW5nVXRpbGl0eS5HdWlkKCkpO1xuXG4gICAgICAgICAgX3NlbGYudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKF9zZWxmLiRyZWZzLnpUcmVlVUwpLCBfc2VsZi50cmVlU2V0dGluZywgcmVzdWx0LmRhdGEpO1xuXG4gICAgICAgICAgX3NlbGYudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG5cbiAgICAgICAgICBfc2VsZi50cmVlT2JqLl9ob3N0ID0gX3NlbGY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIHRyZWVOb2RlU2VsZWN0ZWQ6IGZ1bmN0aW9uIHRyZWVOb2RlU2VsZWN0ZWQoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgIHRoaXMudHJlZVNlbGVjdGVkTm9kZSA9IHRyZWVOb2RlO1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gbnVsbDtcbiAgICAgIHRoaXMucGFnZU51bSA9IDE7XG4gICAgICB0aGlzLmNsZWFyU2VhcmNoQ29uZGl0aW9uKCk7XG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5kZXBhcnRtZW50SWQudmFsdWUgPSB0aGlzLnRyZWVTZWxlY3RlZE5vZGVbdGhpcy50cmVlSWRGaWVsZE5hbWVdO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBhZGREZXBhcnRtZW50OiBmdW5jdGlvbiBhZGREZXBhcnRtZW50KCkge1xuICAgICAgaWYgKHRoaXMudHJlZVNlbGVjdGVkTm9kZSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5kZXBhcnRtZW50RWRpdFZpZXcsIHtcbiAgICAgICAgICBcIm9wXCI6IFwiYWRkXCIsXG4gICAgICAgICAgXCJwYXJlbnRJZFwiOiB0aGlzLnRyZWVTZWxlY3RlZE5vZGVbYXBwTGlzdC50cmVlSWRGaWVsZE5hbWVdXG4gICAgICAgIH0pO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgICB0aXRsZTogXCLpg6jpl6jnrqHnkIZcIlxuICAgICAgICB9LCAzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqeeItuiKgueCuSFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlZGl0RGVwYXJ0bWVudDogZnVuY3Rpb24gZWRpdERlcGFydG1lbnQoKSB7XG4gICAgICBpZiAodGhpcy50cmVlU2VsZWN0ZWROb2RlICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmRlcGFydG1lbnRFZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJ1cGRhdGVcIixcbiAgICAgICAgICBcInJlY29yZElkXCI6IHRoaXMudHJlZVNlbGVjdGVkTm9kZVthcHBMaXN0LnRyZWVJZEZpZWxkTmFtZV1cbiAgICAgICAgfSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICAgIHRpdGxlOiBcIumDqOmXqOeuoeeQhlwiXG4gICAgICAgIH0sIDMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup6ZyA6KaB57yW6L6R55qE6IqC54K5IVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHZpZXdEZXBhcnRtZW50OiBmdW5jdGlvbiB2aWV3RGVwYXJ0bWVudCgpIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5kZXBhcnRtZW50RWRpdFZpZXcsIHtcbiAgICAgICAgXCJvcFwiOiBcInZpZXdcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiB0aGlzLnRyZWVTZWxlY3RlZE5vZGVbYXBwTGlzdC50cmVlSWRGaWVsZE5hbWVdXG4gICAgICB9KTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogXCLpg6jpl6jnrqHnkIZcIlxuICAgICAgfSwgMyk7XG4gICAgfSxcbiAgICBkZWxEZXBhcnRtZW50OiBmdW5jdGlvbiBkZWxEZXBhcnRtZW50KCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgdmFyIHJlY29yZElkID0gdGhpcy50cmVlU2VsZWN0ZWROb2RlW2FwcExpc3QudHJlZUlkRmllbGROYW1lXTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k6KaB5Yig6Zmk6YCJ5a6a55qE6IqC54K55ZCX77yfXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgQWpheFV0aWxpdHkuRGVsZXRlKF9zZWxmLmFjSW50ZXJmYWNlLmRlbGV0ZURlcGFydG1lbnQsIHtcbiAgICAgICAgICByZWNvcmRJZDogcmVjb3JkSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGFwcExpc3QudHJlZU9iai5yZW1vdmVOb2RlKGFwcExpc3QudHJlZVNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgIGFwcExpc3QudHJlZVNlbGVjdGVkTm9kZSA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIG1vdmVEZXBhcnRtZW50OiBmdW5jdGlvbiBtb3ZlRGVwYXJ0bWVudCh0eXBlKSB7XG4gICAgICBpZiAodGhpcy50cmVlU2VsZWN0ZWROb2RlICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHJlY29yZElkID0gdGhpcy50cmVlU2VsZWN0ZWROb2RlW2FwcExpc3QudHJlZUlkRmllbGROYW1lXTtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLm1vdmVEZXBhcnRtZW50LCB7XG4gICAgICAgICAgcmVjb3JkSWQ6IHJlY29yZElkLFxuICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGlmICh0eXBlID09IFwiZG93blwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFwcExpc3QudHJlZVNlbGVjdGVkTm9kZS5nZXROZXh0Tm9kZSgpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGFwcExpc3QudHJlZU9iai5tb3ZlTm9kZShhcHBMaXN0LnRyZWVTZWxlY3RlZE5vZGUuZ2V0TmV4dE5vZGUoKSwgYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlLCBcIm5leHRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlLmdldFByZU5vZGUoKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBhcHBMaXN0LnRyZWVPYmoubW92ZU5vZGUoYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlLmdldFByZU5vZGUoKSwgYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlLCBcInByZXZcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6npnIDopoHnvJbovpHnmoToioLngrkhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbmV3VHJlZU5vZGU6IGZ1bmN0aW9uIG5ld1RyZWVOb2RlKG5ld05vZGVEYXRhKSB7XG4gICAgICB2YXIgc2lsZW50ID0gZmFsc2U7XG4gICAgICBhcHBMaXN0LnRyZWVPYmouYWRkTm9kZXModGhpcy50cmVlU2VsZWN0ZWROb2RlLCBuZXdOb2RlRGF0YSwgc2lsZW50KTtcbiAgICB9LFxuICAgIHVwZGF0ZU5vZGU6IGZ1bmN0aW9uIHVwZGF0ZU5vZGUobmV3Tm9kZURhdGEpIHtcbiAgICAgIHRoaXMudHJlZVNlbGVjdGVkTm9kZSA9ICQuZXh0ZW5kKHRydWUsIHRoaXMudHJlZVNlbGVjdGVkTm9kZSwgbmV3Tm9kZURhdGEpO1xuICAgICAgYXBwTGlzdC50cmVlT2JqLnVwZGF0ZU5vZGUodGhpcy50cmVlU2VsZWN0ZWROb2RlKTtcbiAgICB9LFxuICAgIGNsZWFyU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBjbGVhclNlYXJjaENvbmRpdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnNlYXJjaENvbmRpdGlvbikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbltrZXldLnZhbHVlID0gXCJcIjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb25bXCJzZWFyY2hJbkFMTFwiXS52YWx1ZSA9IFwi5ZCmXCI7XG4gICAgfSxcbiAgICBzZWxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZShzZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uUm93cyA9IHNlbGVjdGlvbjtcbiAgICB9LFxuICAgIHJlbG9hZERhdGE6IGZ1bmN0aW9uIHJlbG9hZERhdGEoKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoKHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkTGlzdERhdGEsIHRoaXMucGFnZU51bSwgdGhpcy5wYWdlU2l6ZSwgdGhpcy5zZWFyY2hDb25kaXRpb24sIHRoaXMsIHRoaXMuaWRGaWVsZE5hbWUsIHRydWUsIG51bGwsIGZhbHNlKTtcbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMudHJlZVNlbGVjdGVkTm9kZSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5saXN0RWRpdFZpZXcsIHtcbiAgICAgICAgICBcIm9wXCI6IFwiYWRkXCIsXG4gICAgICAgICAgXCJkZXBhcnRtZW50SWRcIjogdGhpcy50cmVlU2VsZWN0ZWROb2RlW2FwcExpc3QudHJlZUlkRmllbGROYW1lXVxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgICAgdGl0bGU6IFwi6YOo6Zeo55So5oi3566h55CGXCJcbiAgICAgICAgfSwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nliIbnu4QhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChyZWNvcmRJZCkge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmxpc3RFZGl0Vmlldywge1xuICAgICAgICBcIm9wXCI6IFwidXBkYXRlXCIsXG4gICAgICAgIFwicmVjb3JkSWRcIjogcmVjb3JkSWRcbiAgICAgIH0pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumDqOmXqOeUqOaIt+euoeeQhlwiXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIHZpZXc6IGZ1bmN0aW9uIHZpZXcocmVjb3JkSWQpIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5saXN0RWRpdFZpZXcsIHtcbiAgICAgICAgXCJvcFwiOiBcInZpZXdcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZFxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgdGl0bGU6IFwi6YOo6Zeo55So5oi3566h55CGXCJcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiBkZWwocmVjb3JkSWQpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlRGVsZXRlUm93KHRoaXMuYWNJbnRlcmZhY2UuZGVsZXRlTGlzdFJlY29yZCwgcmVjb3JkSWQsIGFwcExpc3QpO1xuICAgIH0sXG4gICAgc3RhdHVzRW5hYmxlOiBmdW5jdGlvbiBzdGF0dXNFbmFibGUoc3RhdHVzTmFtZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh0aGlzLmFjSW50ZXJmYWNlLmxpc3RTdGF0dXNDaGFuZ2UsIHRoaXMuc2VsZWN0aW9uUm93cywgYXBwTGlzdC5pZEZpZWxkTmFtZSwgc3RhdHVzTmFtZSwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKHR5cGUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld01vdmVGYWNlKHRoaXMuYWNJbnRlcmZhY2UubGlzdE1vdmUsIHRoaXMuc2VsZWN0aW9uUm93cywgYXBwTGlzdC5pZEZpZWxkTmFtZSwgdHlwZSwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBtb3ZlVG9Bbm90aGVyRGVwYXJ0bWVudDogZnVuY3Rpb24gbW92ZVRvQW5vdGhlckRlcGFydG1lbnQoKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Sb3dzICE9IG51bGwgJiYgdGhpcy5zZWxlY3Rpb25Sb3dzLmxlbmd0aCA+IDAgJiYgdGhpcy5zZWxlY3Rpb25Sb3dzLmxlbmd0aCA9PSAxKSB7fSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5Lit6ZyA6KaB5pON5L2c55qE6K6w5b2V77yM5q+P5qyh5Y+q6IO96YCJ5Lit5LiA6KGMIVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcnRUaW1lSm9iOiBmdW5jdGlvbiBwYXJ0VGltZUpvYigpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblJvd3MgIT0gbnVsbCAmJiB0aGlzLnNlbGVjdGlvblJvd3MubGVuZ3RoID4gMCAmJiB0aGlzLnNlbGVjdGlvblJvd3MubGVuZ3RoID09IDEpIHt9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInkuK3pnIDopoHmk43kvZznmoTorrDlvZXvvIzmr4/mrKHlj6rog73pgInkuK3kuIDooYwhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2hhbmdlUGFnZTogZnVuY3Rpb24gY2hhbmdlUGFnZShwYWdlTnVtKSB7XG4gICAgICB0aGlzLnBhZ2VOdW0gPSBwYWdlTnVtO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBudWxsO1xuICAgIH0sXG4gICAgc2VhcmNoOiBmdW5jdGlvbiBzZWFyY2goKSB7XG4gICAgICB0aGlzLnBhZ2VOdW0gPSAxO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3QoKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0RGVwYXJ0bWVudFVzZXJNb2RlbERpYWxvZ1dyYXA7XG4gICAgICB2YXIgZGlhbG9nSGVpZ2h0ID0gNDYwO1xuXG4gICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA3MDApIHtcbiAgICAgICAgZGlhbG9nSGVpZ2h0ID0gNjYwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RIZWlnaHQgPSBkaWFsb2dIZWlnaHQgLSAyMzA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDk3MCxcbiAgICAgICAgaGVpZ2h0OiBkaWFsb2dIZWlnaHQsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqee7hOe7h+acuuaehFwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gY29tcGxldGVkKCkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5zZWxlY3Rpb25Sb3dzKTtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUm93cykge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1jb21wbGV0ZWQnLCB0aGlzLnNlbGVjdGlvblJvd3MpO1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7flhYjpgInkuK3kurrlkZghXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3REZXBhcnRtZW50VXNlck1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwic2VsZWN0RGVwYXJ0bWVudFVzZXJNb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtd3JhcCBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LTJjb2x1bW5cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxlZnQtb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcIndpZHRoOiAxODBweDt0b3A6IDEwcHg7bGVmdDogMTBweDtib3R0b206IDU1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0LW9yZ2FuLXNpbmdsZS1jb21wIEBvbi1zZWxlY3RlZC1vcmdhbj1cXFwiY2hhbmdlT3JnYW5cXFwiIHJlZj1cXFwic2VsZWN0T3JnYW5Db21wXFxcIj48L3NlbGVjdC1vcmdhbi1zaW5nbGUtY29tcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5uZXItd3JhcFxcXCIgc3R5bGU9XFxcInBvc2l0aW9uOmFic29sdXRlO3RvcDogMzBweDtib3R0b206IDEwcHg7aGVpZ2h0OiBhdXRvO292ZXJmbG93OiBhdXRvXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwielRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJpZ2h0LW91dGVyLXdyYXAgaXYtbGlzdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nOiAxMHB4O2xlZnQ6IDIwMHB4O3RvcDogMTBweDtyaWdodDogMTBweDtib3R0b206IDU1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XFxcImxzLXRhYmxlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA4MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDgwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogODVweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA4MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cXFwibHMtdGFibGUtcm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTc1MjhcXHU2MjM3XFx1NTQwRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJzZWFyY2hDb25kaXRpb24udXNlck5hbWUudmFsdWVcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTYyNEJcXHU2NzNBXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcInNlYXJjaENvbmRpdGlvbi51c2VyUGhvbmVOdW1iZXIudmFsdWVcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTUxNjhcXHU1QzQwXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVxcXCJzZWFyY2hDb25kaXRpb24uc2VhcmNoSW5BTEwudmFsdWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiXFx1NjYyRlxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJcXHU1NDI2XFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzZWFyY2hcXFwiPjxJY29uIHR5cGU9XFxcImFuZHJvaWQtc2VhcmNoXFxcIj48L0ljb24+IFxcdTY3RTVcXHU4QkUyIDwvaS1idXR0b24+PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XFxcImxpc3RIZWlnaHRcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJ0YWJsZURhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XFxcInNlbGVjdGlvbkNoYW5nZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogcmlnaHQ7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYWdlIEBvbi1jaGFuZ2U9XFxcImNoYW5nZVBhZ2VcXFwiIDpjdXJyZW50LnN5bmM9XFxcInBhZ2VOdW1cXFwiIDpwYWdlLXNpemU9XFxcInBhZ2VTaXplXFxcIiBzaG93LXRvdGFsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dG90YWw9XFxcInBhZ2VUb3RhbFxcXCI+PC9wYWdlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJib3R0b206IDEycHg7cmlnaHQ6IDEycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNvbXBsZXRlZCgpXFxcIiBpY29uPVxcXCJtZC1jaGVja21hcmtcXFwiPlxcdTc4NkVcXHU4QkE0PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj5cXHU1MTczXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1vcmdhbi1jb21wXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0T3JnYW5EYXRhVXJsOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL09yZ2FuL0dldEZ1bGxPcmdhblwiXG4gICAgICB9LFxuICAgICAganNFZGl0b3JJbnN0YW5jZTogbnVsbCxcbiAgICAgIG9yZ2FuVHJlZToge1xuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIGNoa1N0eWxlOiBcInJhZGlvXCIsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcIm9yZ2FuTmFtZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcIm9yZ2FuSWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcIm9yZ2FuUGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge31cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVEYXRhOiBudWxsLFxuICAgICAgICBjbGlja05vZGU6IG51bGxcbiAgICAgIH0sXG4gICAgICBzZWFyY2hPcmdhblRleHQ6IFwiXCIsXG4gICAgICBzZWxlY3RlZE9yZ2FuQ29uZmlnOiBbe1xuICAgICAgICB0aXRsZTogJ+e7hOe7h+WQjeensCcsXG4gICAgICAgIGtleTogJ29yZ2FuTmFtZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnb3JnYW5JZCcsXG4gICAgICAgIHdpZHRoOiA2NSxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgfSwgW0xpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wKV0pO1xuICAgICAgICB9XG4gICAgICB9XSxcbiAgICAgIHNlbGVjdGVkT3JnYW5EYXRhOiBbXVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5nZXRPcmdhbkRhdGFJbml0VHJlZSgpO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYmVnaW5TZWxlY3RPcmdhbjogZnVuY3Rpb24gYmVnaW5TZWxlY3RPcmdhbigpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3RPcmdhbk1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNjcwLFxuICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup57uE57uH5py65p6EXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0T3JnYW5EYXRhSW5pdFRyZWU6IGZ1bmN0aW9uIGdldE9yZ2FuRGF0YUluaXRUcmVlKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldE9yZ2FuRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYub3JnYW5UcmVlLnRyZWVEYXRhID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICBfc2VsZi4kcmVmcy5vcmdhblpUcmVlVUwuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzZWxlY3Qtb3JnYW4tY29tcC1cIiArIFN0cmluZ1V0aWxpdHkuR3VpZCgpKTtcblxuICAgICAgICAgIF9zZWxmLm9yZ2FuVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoX3NlbGYuJHJlZnMub3JnYW5aVHJlZVVMKSwgX3NlbGYub3JnYW5UcmVlLnRyZWVTZXR0aW5nLCBfc2VsZi5vcmdhblRyZWUudHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYub3JnYW5UcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuXG4gICAgICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKF9zZWxmLm9yZ2FuVHJlZS50cmVlT2JqLCBfc2VsZi4kcmVmcy50eHRfb3JnYW5fc2VhcmNoX3RleHQuJHJlZnMuaW5wdXQsIG51bGwsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIHNlbGVjdGVkT3JnYW46IGZ1bmN0aW9uIHNlbGVjdGVkT3JnYW4odHJlZU5vZGUpIHtcbiAgICAgIGlmICghdHJlZU5vZGUpIHt9XG5cbiAgICAgIHRoaXMuc2VsZWN0ZWRPcmdhbkRhdGEucHVzaCh0cmVlTm9kZSk7XG4gICAgfSxcbiAgICByZW1vdmVBbGxPcmdhbjogZnVuY3Rpb24gcmVtb3ZlQWxsT3JnYW4oKSB7fSxcbiAgICByZW1vdmVTaW5nbGVPcmdhbjogZnVuY3Rpb24gcmVtb3ZlU2luZ2xlT3JnYW4oKSB7fVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0LXZpZXctb3JnYW4td3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGV4dFxcXCI+XFx1OEJGN1xcdTkwMDlcXHU2MkU5XFx1N0VDNFxcdTdFQzc8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ2YWx1ZVxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaWRcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvblxcXCIgQGNsaWNrPVxcXCJiZWdpblNlbGVjdE9yZ2FuKClcXFwiPjxJY29uIHR5cGU9XFxcImlvcy1mdW5uZWxcXFwiIC8+Jm5ic3A7XFx1OTAwOVxcdTYyRTk8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9XFxcInNlbGVjdE9yZ2FuTW9kZWxEaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiYzMtc2VsZWN0LW1vZGVsLXdyYXAgZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMzLXNlbGVjdC1tb2RlbC1zb3VyY2Utd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cXFwiaW5wdXRfYm9yZGVyX2JvdHRvbVxcXCIgcmVmPVxcXCJ0eHRfb3JnYW5fc2VhcmNoX3RleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVcXHU3RUM0XFx1N0VDN1xcdTY3M0FcXHU2Nzg0XFx1NTQwRFxcdTc5RjBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXAgZGl2LWN1c3RvbS1zY3JvbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwib3JnYW5aVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMzLXNlbGVjdC1tb2RlbC1idXR0b24td3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRvX3NlbGVjdGVkX2J1dHRvblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiB0eXBlPVxcXCJpb3MtYXJyb3ctZHJvcHJpZ2h0LWNpcmNsZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiB0eXBlPVxcXCJpb3MtYXJyb3ctZHJvcGxlZnQtY2lyY2xlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjMy1zZWxlY3QtbW9kZWwtc2VsZWN0ZWQtd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkLXRpdGxlXFxcIj48SWNvbiB0eXBlPVxcXCJtZC1kb25lLWFsbFxcXCIgLz4gXFx1NURGMlxcdTkwMDlcXHU3RUM0XFx1N0VDNzwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJtYXJnaW46IDJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBzdHJpcGUgOmNvbHVtbnM9XFxcInNlbGVjdGVkT3JnYW5Db25maWdcXFwiIDpkYXRhPVxcXCJzZWxlY3RlZE9yZ2FuRGF0YVxcXCIgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIDpoaWdobGlnaHQtcm93PVxcXCJ0cnVlXFxcIiA6c2hvdy1oZWFkZXI9XFxcImZhbHNlXFxcIj48L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OiA0MHB4O3BhZGRpbmctcmlnaHQ6IDEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImhhbmRsZVN1Ym1pdEZsb3dNb2RlbEVkaXQoJ2Zsb3dNb2RlbEVudGl0eScpXFxcIj4gXFx1NEZERCBcXHU1QjU4PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJoYW5kbGVDbG9zZSgnZGl2TmV3Rmxvd01vZGVsV3JhcCcpXFxcIj5cXHU1MTczIFxcdTk1RUQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1vcmdhbi1zaW5nbGUtY29tcFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldE9yZ2FuRGF0YVVybDogXCIvUGxhdEZvcm1SZXN0L1NTTy9Pcmdhbi9HZXRGdWxsT3JnYW5cIixcbiAgICAgICAgZ2V0U2luZ2xlT3JnYW5EYXRhVXJsOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL09yZ2FuL0dldERldGFpbERhdGFcIlxuICAgICAgfSxcbiAgICAgIGpzRWRpdG9ySW5zdGFuY2U6IG51bGwsXG4gICAgICBvcmdhblRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwib3JnYW5OYW1lXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwib3JnYW5JZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwib3JnYW5QYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZE9yZ2FuKHRyZWVOb2RlKTtcblxuICAgICAgICAgICAgICBfc2VsZi5oYW5kbGVDbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZURhdGE6IG51bGwsXG4gICAgICAgIGNsaWNrTm9kZTogbnVsbFxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkT3JnYW5EYXRhOiBudWxsXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3RPcmdhbk1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdE9yZ2FuOiBmdW5jdGlvbiBiZWdpblNlbGVjdE9yZ2FuKCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNlbGVjdE9yZ2FuTW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5nZXRPcmdhbkRhdGFJbml0VHJlZSgpO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA0NzAsXG4gICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nnu4Tnu4fmnLrmnoRcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRPcmdhbkRhdGFJbml0VHJlZTogZnVuY3Rpb24gZ2V0T3JnYW5EYXRhSW5pdFRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0T3JnYW5EYXRhVXJsLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5vcmdhblRyZWUudHJlZURhdGEgPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgIF9zZWxmLiRyZWZzLm9yZ2FuWlRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1vcmdhbi1zaW5nbGUtY29tcC1cIiArIFN0cmluZ1V0aWxpdHkuR3VpZCgpKTtcblxuICAgICAgICAgIF9zZWxmLm9yZ2FuVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoX3NlbGYuJHJlZnMub3JnYW5aVHJlZVVMKSwgX3NlbGYub3JnYW5UcmVlLnRyZWVTZXR0aW5nLCBfc2VsZi5vcmdhblRyZWUudHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYub3JnYW5UcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuXG4gICAgICAgICAgX3NlbGYub3JnYW5UcmVlLnRyZWVPYmouX2hvc3QgPSBfc2VsZjtcbiAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmooX3NlbGYub3JnYW5UcmVlLnRyZWVPYmosIF9zZWxmLiRyZWZzLnR4dF9vcmdhbl9zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRPcmdhbjogZnVuY3Rpb24gc2VsZWN0ZWRPcmdhbihvcmdhbkRhdGEpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRPcmdhbkRhdGEgPSBvcmdhbkRhdGE7XG4gICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1vcmdhbicsIG9yZ2FuRGF0YSk7XG4gICAgfSxcbiAgICBnZXRTZWxlY3RlZE9yZ2FuTmFtZTogZnVuY3Rpb24gZ2V0U2VsZWN0ZWRPcmdhbk5hbWUoKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZE9yZ2FuRGF0YSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcIuivt+mAieaLqee7hOe7h+acuuaehFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRPcmdhbkRhdGEub3JnYW5OYW1lO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0T2xkU2VsZWN0ZWRPcmdhbjogZnVuY3Rpb24gc2V0T2xkU2VsZWN0ZWRPcmdhbihvcmdhbklkKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0U2luZ2xlT3JnYW5EYXRhVXJsLCB7XG4gICAgICAgIFwicmVjb3JkSWRcIjogb3JnYW5JZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5zZWxlY3RlZE9yZ2FuRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3Qtdmlldy1vcmdhbi13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj57e2dldFNlbGVjdGVkT3JnYW5OYW1lKCl9fTwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInZhbHVlXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uXFxcIiBAY2xpY2s9XFxcImJlZ2luU2VsZWN0T3JnYW4oKVxcXCI+PEljb24gdHlwZT1cXFwiaW9zLWZ1bm5lbFxcXCIgLz4mbmJzcDtcXHU5MDA5XFx1NjJFOTwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj1cXFwic2VsZWN0T3JnYW5Nb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtd3JhcCBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXNvdXJjZS13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVxcXCJpbnB1dF9ib3JkZXJfYm90dG9tXFxcIiByZWY9XFxcInR4dF9vcmdhbl9zZWFyY2hfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NVxcdTdFQzRcXHU3RUM3XFx1NjczQVxcdTY3ODRcXHU1NDBEXFx1NzlGMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5uZXItd3JhcCBkaXYtY3VzdG9tLXNjcm9sbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgcmVmPVxcXCJvcmdhblpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LXRyZWUtZGF0YS1kaWFsb2ctY29tcFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldE9yZ2FuRGF0YVVybDogXCIvUGxhdEZvcm1SZXN0L1NTTy9Pcmdhbi9HZXRGdWxsT3JnYW5cIixcbiAgICAgICAgZ2V0U2luZ2xlT3JnYW5EYXRhVXJsOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL09yZ2FuL0dldERldGFpbERhdGFcIlxuICAgICAgfSxcbiAgICAgIGpzRWRpdG9ySW5zdGFuY2U6IG51bGwsXG4gICAgICBvcmdhblRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwib3JnYW5OYW1lXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwib3JnYW5JZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwib3JnYW5QYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZE9yZ2FuKHRyZWVOb2RlKTtcblxuICAgICAgICAgICAgICBfc2VsZi5oYW5kbGVDbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZURhdGE6IG51bGwsXG4gICAgICAgIGNsaWNrTm9kZTogbnVsbFxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkT3JnYW5EYXRhOiBudWxsXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3RPcmdhbk1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdE9yZ2FuOiBmdW5jdGlvbiBiZWdpblNlbGVjdE9yZ2FuKCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNlbGVjdE9yZ2FuTW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5nZXRPcmdhbkRhdGFJbml0VHJlZSgpO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA0NzAsXG4gICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nnu4Tnu4fmnLrmnoRcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRPcmdhbkRhdGFJbml0VHJlZTogZnVuY3Rpb24gZ2V0T3JnYW5EYXRhSW5pdFRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0T3JnYW5EYXRhVXJsLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5vcmdhblRyZWUudHJlZURhdGEgPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgIF9zZWxmLiRyZWZzLm9yZ2FuWlRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1vcmdhbi1zaW5nbGUtY29tcC1cIiArIFN0cmluZ1V0aWxpdHkuR3VpZCgpKTtcblxuICAgICAgICAgIF9zZWxmLm9yZ2FuVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoX3NlbGYuJHJlZnMub3JnYW5aVHJlZVVMKSwgX3NlbGYub3JnYW5UcmVlLnRyZWVTZXR0aW5nLCBfc2VsZi5vcmdhblRyZWUudHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYub3JnYW5UcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuXG4gICAgICAgICAgX3NlbGYub3JnYW5UcmVlLnRyZWVPYmouX2hvc3QgPSBfc2VsZjtcbiAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmooX3NlbGYub3JnYW5UcmVlLnRyZWVPYmosIF9zZWxmLiRyZWZzLnR4dF9vcmdhbl9zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRPcmdhbjogZnVuY3Rpb24gc2VsZWN0ZWRPcmdhbihvcmdhbkRhdGEpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRPcmdhbkRhdGEgPSBvcmdhbkRhdGE7XG4gICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1vcmdhbicsIG9yZ2FuRGF0YSk7XG4gICAgfSxcbiAgICBnZXRTZWxlY3RlZE9yZ2FuTmFtZTogZnVuY3Rpb24gZ2V0U2VsZWN0ZWRPcmdhbk5hbWUoKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZE9yZ2FuRGF0YSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcIuivt+mAieaLqee7hOe7h+acuuaehFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRPcmdhbkRhdGEub3JnYW5OYW1lO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0T2xkU2VsZWN0ZWRPcmdhbjogZnVuY3Rpb24gc2V0T2xkU2VsZWN0ZWRPcmdhbihvcmdhbklkKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0U2luZ2xlT3JnYW5EYXRhVXJsLCB7XG4gICAgICAgIFwicmVjb3JkSWRcIjogb3JnYW5JZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5zZWxlY3RlZE9yZ2FuRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJzZWxlY3REZXBhcnRtZW50TW9kZWxEaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXdyYXAgZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXNvdXJjZS13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XFxcImlucHV0X2JvcmRlcl9ib3R0b21cXFwiIHJlZj1cXFwidHh0X29yZ2FuX3NlYXJjaF90ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1OEJGN1xcdThGOTNcXHU1MTY1XFx1OTBFOFxcdTk1RThcXHU1NDBEXFx1NzlGMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXAgZGl2LWN1c3RvbS1zY3JvbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgcmVmPVxcXCJvcmdhblpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgXFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNxbC1nZW5lcmFsLWRlc2lnbi1jb21wXCIsIHtcbiAgcHJvcHM6IFtcInNxbERlc2lnbmVySGVpZ2h0XCIsIFwidmFsdWVcIl0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNxbFRleHQ6IFwiXCIsXG4gICAgICBzZWxlY3RlZEl0ZW1WYWx1ZTogXCLor7TmmI5cIixcbiAgICAgIHNlbGZUYWJsZUZpZWxkczogW10sXG4gICAgICBwYXJlbnRUYWJsZUZpZWxkczogW11cbiAgICB9O1xuICB9LFxuICB3YXRjaDoge1xuICAgIHNxbFRleHQ6IGZ1bmN0aW9uIHNxbFRleHQobmV3VmFsKSB7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG5ld1ZhbCk7XG4gICAgfSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnNxbFRleHQgPSBuZXdWYWw7XG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuc3FsQ29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKCQoXCIjVGV4dEFyZWFTUUxFZGl0b3JcIilbMF0sIHtcbiAgICAgIG1vZGU6IFwidGV4dC94LXNxbFwiLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICBmb2xkR3V0dGVyOiB0cnVlLFxuICAgICAgdGhlbWU6IFwibW9ub2thaVwiXG4gICAgfSk7XG4gICAgdGhpcy5zcWxDb2RlTWlycm9yLnNldFNpemUoXCIxMDAlXCIsIHRoaXMuc3FsRGVzaWduZXJIZWlnaHQpO1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHRoaXMuc3FsQ29kZU1pcnJvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoY01pcnJvcikge1xuICAgICAgY29uc29sZS5sb2coY01pcnJvci5nZXRWYWx1ZSgpKTtcbiAgICAgIF9zZWxmLnNxbFRleHQgPSBjTWlycm9yLmdldFZhbHVlKCk7XG4gICAgfSk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XG4gICAgICB0aGlzLnNxbENvZGVNaXJyb3IuZ2V0VmFsdWUoKTtcbiAgICB9LFxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgdGhpcy5zcWxDb2RlTWlycm9yLnNldFZhbHVlKHZhbHVlKTtcbiAgICB9LFxuICAgIHNldEFib3V0VGFibGVGaWVsZHM6IGZ1bmN0aW9uIHNldEFib3V0VGFibGVGaWVsZHMoc2VsZlRhYmxlRmllbGRzLCBwYXJlbnRUYWJsZUZpZWxkcykge1xuICAgICAgdGhpcy5zZWxmVGFibGVGaWVsZHMgPSBzZWxmVGFibGVGaWVsZHM7XG4gICAgICB0aGlzLnBhcmVudFRhYmxlRmllbGRzID0gcGFyZW50VGFibGVGaWVsZHM7XG4gICAgfSxcbiAgICBpbnNlcnRFbnZUb0VkaXRvcjogZnVuY3Rpb24gaW5zZXJ0RW52VG9FZGl0b3IoY29kZSkge1xuICAgICAgdGhpcy5pbnNlcnRDb2RlQXRDdXJzb3IoY29kZSk7XG4gICAgfSxcbiAgICBpbnNlcnRGaWVsZFRvRWRpdG9yOiBmdW5jdGlvbiBpbnNlcnRGaWVsZFRvRWRpdG9yKHNvdXJjZVR5cGUsIGV2ZW50KSB7XG4gICAgICB2YXIgc291cmNlRmllbGRzID0gbnVsbDtcblxuICAgICAgaWYgKHNvdXJjZVR5cGUgPT0gXCJzZWxmVGFibGVGaWVsZHNcIikge1xuICAgICAgICBzb3VyY2VGaWVsZHMgPSB0aGlzLnNlbGZUYWJsZUZpZWxkcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvdXJjZUZpZWxkcyA9IHRoaXMucGFyZW50VGFibGVGaWVsZHM7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VGaWVsZHNbaV0uZmllbGROYW1lID09IGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5pbnNlcnRDb2RlQXRDdXJzb3Ioc291cmNlRmllbGRzW2ldLnRhYmxlTmFtZSArIFwiLlwiICsgc291cmNlRmllbGRzW2ldLmZpZWxkTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGluc2VydENvZGVBdEN1cnNvcjogZnVuY3Rpb24gaW5zZXJ0Q29kZUF0Q3Vyc29yKGNvZGUpIHtcbiAgICAgIHZhciBkb2MgPSB0aGlzLnNxbENvZGVNaXJyb3IuZ2V0RG9jKCk7XG4gICAgICB2YXIgY3Vyc29yID0gZG9jLmdldEN1cnNvcigpO1xuICAgICAgZG9jLnJlcGxhY2VSYW5nZShjb2RlLCBjdXJzb3IpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2PlxcXHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJUZXh0QXJlYVNRTEVkaXRvclwiPjwvdGV4dGFyZWE+XFxcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDttYXJnaW4tdG9wOiA4cHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cCBzaXplPVwic21hbGxcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIEBjbGljaz1cImluc2VydEVudlRvRWRpdG9yKFxcJyN7QXBpVmFyLuW9k+WJjeeUqOaIt+aJgOWcqOe7hOe7h0lEfVxcJylcIj7nu4Tnu4dJZDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi35omA5Zyo57uE57uH5ZCN56ewfVxcJylcIj7nu4Tnu4flkI3np7A8L0J1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIEBjbGljaz1cImluc2VydEVudlRvRWRpdG9yKFxcJyN7QXBpVmFyLuW9k+WJjeeUqOaIt0lEfVxcJylcIj7nlKjmiLdJZDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi35ZCN56ewfVxcJylcIj7nlKjmiLflkI3np7A8L0J1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIEBjbGljaz1cImluc2VydEVudlRvRWRpdG9yKFxcJyN7RGF0ZVRpbWUu5bm05bm05bm05bm0LeaciOaciC3ml6Xml6V9XFwnKVwiPnl5eXktTU0tZGQ8L0J1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uPuivtOaYjjwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Hcm91cD5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOiA4cHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdDttYXJnaW46IDRweCAxMHB4XCI+5pys6KGo5a2X5q61PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnRcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHNpemU9XCJzbWFsbFwiIHN0eWxlPVwid2lkdGg6MTc1cHhcIiBAb24tY2hhbmdlPVwiaW5zZXJ0RmllbGRUb0VkaXRvcihcXCdzZWxmVGFibGVGaWVsZHNcXCcsJGV2ZW50KVwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHNlbGZUYWJsZUZpZWxkc1wiIDp2YWx1ZT1cIml0ZW0uZmllbGROYW1lXCIgOmtleT1cIml0ZW0uZmllbGROYW1lXCI+e3tpdGVtLmZpZWxkQ2FwdGlvbn19PC9pLW9wdGlvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnQ7bWFyZ2luOiA0cHggMTBweFwiPueItuihqOWtl+autTwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHBsYWNlaG9sZGVyPVwi6buY6K6k5L2/55SoSWTlrZfmrrVcIiBzaXplPVwic21hbGxcIiBzdHlsZT1cIndpZHRoOjE3N3B4XCIgQG9uLWNoYW5nZT1cImluc2VydEZpZWxkVG9FZGl0b3IoXFwncGFyZW50VGFibGVGaWVsZHNcXCcsJGV2ZW50KVwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHBhcmVudFRhYmxlRmllbGRzXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNzby1hcHAtZGV0YWlsLWZyb20tY29tcFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHt9LFxuICB0ZW1wbGF0ZTogXCJcIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzc28tYXBwLWludGVyZmFjZS1saXN0LWNvbXBcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7fSxcbiAgdGVtcGxhdGU6IFwiXCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic3NvLWFwcC1zdWItc3lzdGVtLWxpc3QtY29tcFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFwcEVudGl0eToge30sXG4gICAgICBydWxlVmFsaWRhdGU6IHt9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7fSxcbiAgdGVtcGxhdGU6IFwiPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcIndpZHRoOiA4MCU7ZmxvYXQ6IGxlZnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gcmVmPVxcXCJhcHBFbnRpdHlcXFwiIDptb2RlbD1cXFwiYXBwRW50aXR5XFxcIiA6cnVsZXM9XFxcInJ1bGVWYWxpZGF0ZVxcXCIgOmxhYmVsLXdpZHRoPVxcXCIxMDBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU3Q0ZCXFx1N0VERlxcdTdGMTZcXHU3ODAxXFx1RkYxQVxcXCIgcHJvcD1cXFwiYXBwRW50aXR5LmFwcENvZGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIHByb3A9XFxcImFwcEVudGl0eS5hcHBDb2RlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBDb2RlXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjRcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjogcmVkXFxcIj4qPC9zcGFuPiBcXHU3Q0ZCXFx1N0VERlxcdTU0MERcXHU3OUYwXFx1RkYxQTwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBwcm9wPVxcXCJhcHBFbnRpdHkuYXBwTmFtZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwTmFtZVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU1N0RGXFx1NTQwRFxcdUZGMUFcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwRG9tYWluXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiNFxcXCIgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFx1N0NGQlxcdTdFREZcXHU3QzdCXFx1NTIyQlxcdUZGMUE8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwQ2F0ZWdvcnlcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImFwcFxcXCI+XFx1NzlGQlxcdTUyQThBcHA8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJ3ZWJcXFwiPldlYlxcdTdDRkJcXHU3RURGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU1MTZDXFx1OTRBNVxcdUZGMUFcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcFB1YmxpY0tleVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NzlDMVxcdTk0QTVcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBQcml2YXRlS2V5XFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU5RUQ4XFx1OEJBNFxcdTU3MzBcXHU1NzQwXFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwSW5kZXhVcmxcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTU5MDdcXHU2Q0U4XFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwRGVzY1xcXCIgdHlwZT1cXFwidGV4dGFyZWFcXFwiIDphdXRvc2l6ZT1cXFwie21pblJvd3M6IDYsbWF4Um93czogNn1cXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWZvcm0+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcIndpZHRoOiAxOSU7ZmxvYXQ6IHJpZ2h0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJib3JkZXItcmFkaXVzOiA4cHg7dGV4dC1hbGlnbjogY2VudGVyO21hcmdpbi10b3A6IDIwcHg7bWFyZ2luLWJvdHRvbTogMzBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgOnNyYz1cXFwidXNlckhlYWRJbWFnZVNyY1xcXCIgc3R5bGU9XFxcIndpZHRoOiAxMTBweDtoZWlnaHQ6IDEyMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1cGxvYWQgc3R5bGU9XFxcIm1hcmdpbjoxMHB4IDEycHggMCAyMHB4XFxcIiA6b24tc3VjY2Vzcz1cXFwidXBsb2FkVXNlckhlYWRJbWFnZVN1Y2Nlc3NcXFwiIG11bHRpcGxlIHR5cGU9XFxcImRyYWdcXFwiIG5hbWU9XFxcImZpbGVcXFwiIGFjdGlvbj1cXFwiLi4vLi4vLi4vUGxhdEZvcm1SZXN0L1NTTy9EZXBhcnRtZW50VXNlci9VcGxvYWRVc2VySGVhZElNRy5kb1xcXCIgYWNjZXB0PVxcXCIucG5nXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwicGFkZGluZzoxMHB4IDBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aWNvbiB0eXBlPVxcXCJpb3MtY2xvdWQtdXBsb2FkXFxcIiBzaXplPVxcXCI1MlxcXCIgc3R5bGU9XFxcImNvbG9yOiAjMzM5OWZmXFxcIj48L2ljb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5cXHU0RTBBXFx1NEYyMFxcdTdDRkJcXHU3RURGTG9nbzwvcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC91cGxvYWQ+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyJdfQ==
