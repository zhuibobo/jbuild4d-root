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

Vue.component("table-relation-content-comp", {
  props: ["relation"],
  data: function data() {
    return {
      acInterface: {
        getTablesFieldsByTableIds: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds",
        saveDiagram: "/PlatFormRest/Builder/DataStorage/TableRelation/TableRelation/SaveDiagram",
        getSingleDiagramData: "/PlatFormRest/Builder/DataStorage/TableRelation/TableRelation/GetDetailData",
        tableView: "/HTML/Builder/DataStorage/DataBase/TableEdit.html"
      },
      tableRelationDiagram: null,
      displayDesc: true,
      formatJson: null,
      recordId: this.relation.relationId
    };
  },
  mounted: function mounted() {
    $(this.$refs.relationContentOuterWrap).css("height", PageStyleUtility.GetPageHeight() - 75);

    if (PageStyleUtility.GetPageWidth() < 1000) {
      this.displayDesc = false;
      $(".table-relation-op-buttons-outer-wrap").css("width", "100%");
    }

    this.initDiagram();
    this.loadRelationDetailData();
  },
  methods: {
    init: function init() {
      if (window.goSamples) goSamples();
      var $ = go.GraphObject.make;
      var myDiagram = $(go.Diagram, "tableRelationDiagramDiv", {
        allowDelete: false,
        allowCopy: false,
        layout: $(go.ForceDirectedLayout),
        "undoManager.isEnabled": true
      });
      var bluegrad = $(go.Brush, "Linear", {
        0: "rgb(150, 150, 250)",
        0.5: "rgb(86, 86, 186)",
        1: "rgb(86, 86, 186)"
      });
      var greengrad = $(go.Brush, "Linear", {
        0: "rgb(158, 209, 159)",
        1: "rgb(67, 101, 56)"
      });
      var redgrad = $(go.Brush, "Linear", {
        0: "rgb(206, 106, 100)",
        1: "rgb(180, 56, 50)"
      });
      var yellowgrad = $(go.Brush, "Linear", {
        0: "rgb(254, 221, 50)",
        1: "rgb(254, 182, 50)"
      });
      var lightgrad = $(go.Brush, "Linear", {
        1: "#E6E6FA",
        0: "#FFFAF0"
      });
      var itemTempl = $(go.Panel, "Horizontal", $(go.Shape, {
        desiredSize: new go.Size(10, 10)
      }, new go.Binding("figure", "figure"), new go.Binding("fill", "color")), $(go.TextBlock, {
        stroke: "#333333",
        font: "bold 14px sans-serif"
      }, new go.Binding("text", "name")));
      myDiagram.nodeTemplate = $(go.Node, "Auto", {
        selectionAdorned: true,
        resizable: true,
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        isShadowed: true,
        shadowColor: "#C5C1AA"
      }, new go.Binding("location", "location").makeTwoWay(), new go.Binding("desiredSize", "visible", function (v) {
        return new go.Size(NaN, NaN);
      }).ofObject("LIST"), $(go.Shape, "Rectangle", {
        fill: lightgrad,
        stroke: "#756875",
        strokeWidth: 3
      }), $(go.Panel, "Table", {
        margin: 8,
        stretch: go.GraphObject.Fill
      }, $(go.RowColumnDefinition, {
        row: 0,
        sizing: go.RowColumnDefinition.None
      }), $(go.TextBlock, {
        row: 0,
        alignment: go.Spot.Center,
        margin: new go.Margin(0, 14, 0, 2),
        font: "bold 16px sans-serif"
      }, new go.Binding("text", "key")), $("PanelExpanderButton", "LIST", {
        row: 0,
        alignment: go.Spot.TopRight
      }), $(go.Panel, "Vertical", {
        name: "LIST",
        row: 1,
        padding: 3,
        alignment: go.Spot.TopLeft,
        defaultAlignment: go.Spot.Left,
        stretch: go.GraphObject.Horizontal,
        itemTemplate: itemTempl
      }, new go.Binding("itemArray", "items"))));
      myDiagram.linkTemplate = $(go.Link, {
        selectionAdorned: true,
        layerName: "Foreground",
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver
      }, $(go.Shape, {
        stroke: "#303B45",
        strokeWidth: 2.5
      }), $(go.TextBlock, {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: 0,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright
      }, new go.Binding("text", "text")), $(go.TextBlock, {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: -1,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright
      }, new go.Binding("text", "toText")));
      var nodeDataArray = [{
        key: "Products",
        items: [{
          name: "ProductID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "ProductName",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "SupplierID",
          iskey: false,
          figure: "Decision",
          color: "purple"
        }, {
          name: "CategoryID",
          iskey: false,
          figure: "Decision",
          color: "purple"
        }]
      }, {
        key: "Suppliers",
        items: [{
          name: "SupplierID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "CompanyName",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "ContactName",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "Address",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }]
      }, {
        key: "Categories",
        items: [{
          name: "CategoryID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "CategoryName",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "Description",
          iskey: false,
          figure: "Cube1",
          color: bluegrad
        }, {
          name: "Picture",
          iskey: false,
          figure: "TriangleUp",
          color: redgrad
        }]
      }, {
        key: "Order Details",
        items: [{
          name: "OrderID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "ProductID",
          iskey: true,
          figure: "Decision",
          color: yellowgrad
        }, {
          name: "UnitPrice",
          iskey: false,
          figure: "MagneticData",
          color: greengrad
        }, {
          name: "Quantity",
          iskey: false,
          figure: "MagneticData",
          color: greengrad
        }, {
          name: "Discount",
          iskey: false,
          figure: "MagneticData",
          color: greengrad
        }]
      }];
      var linkDataArray = [{
        from: "Products",
        to: "Suppliers",
        text: "0..N",
        toText: "1"
      }, {
        from: "Products",
        to: "Categories",
        text: "0..N",
        toText: "1"
      }, {
        from: "Order Details",
        to: "Products",
        text: "0..N",
        toText: "1"
      }];
      myDiagram.model = $(go.GraphLinksModel, {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: nodeDataArray,
        linkDataArray: linkDataArray
      });
    },
    showSelectTableDialog: function showSelectTableDialog() {
      this.$refs.selectSingleTableDialog.beginSelectTable();
    },
    showSelectFieldConnectDialog: function showSelectFieldConnectDialog() {
      var fromTableId = "";
      var toTableId = "";
      var i = 0;
      this.tableRelationDiagram.selection.each(function (part) {
        if (part instanceof go.Node) {
          if (i == 0) {
            fromTableId = part.data.tableId;
            i++;
          } else {
            toTableId = part.data.tableId;
          }
        }
      });

      if (!toTableId) {
        toTableId = fromTableId;
      }

      if (fromTableId != "" && toTableId != "") {
        this.$refs.tableRelationConnectTwoTableDialog.beginSelectConnect(fromTableId, toTableId);
      } else {
        DialogUtility.AlertText("请先选中2个节点");
      }
    },
    addTableToDiagram: function addTableToDiagram(tableData) {
      var tableId = tableData.id;
      var tableIds = [tableId];

      var _self = this;

      if (!this.tableIsExistInDiagram(tableId)) {
        AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {
          "tableIds": tableIds
        }, function (result) {
          if (result.success) {
            var allFields = result.data;
            var singleTable = result.exKVData.Tables[0];
            var allFieldsStyle = [];

            for (var i = 0; i < allFields.length; i++) {
              allFields[i].displayText = allFields[i].fieldName + "[" + allFields[i].fieldCaption + "]";
              allFieldsStyle.push(_self.rendererFieldStyle(allFields[i]));
            }

            var modelNodeData = {
              tableId: tableId,
              loc: "0 0",
              fields: allFieldsStyle,
              tableData: singleTable,
              tableName: singleTable.tableName,
              tableCaption: singleTable.tableCaption,
              tableDisplayText: singleTable.tableName + "[" + singleTable.tableCaption + "]",
              key: singleTable.tableId
            };

            _self.tableRelationDiagram.model.startTransaction("flash");

            _self.tableRelationDiagram.model.addNodeData(modelNodeData);

            _self.tableRelationDiagram.model.commitTransaction("flash");
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
          }
        }, "json");
      } else {
        DialogUtility.AlertText("该画布中已经存在表:" + tableData.text);
      }
    },
    deleteSelection: function deleteSelection() {
      if (this.tableRelationDiagram.commandHandler.canDeleteSelection()) {
        this.tableRelationDiagram.commandHandler.deleteSelection();
        return;
      }
    },
    connectSelectionNode: function connectSelectionNode(connectData) {
      this.tableRelationDiagram.model.startTransaction("flash");
      var lineData = {
        lineId: StringUtility.Guid(),
        from: connectData.from.tableId,
        to: connectData.to.tableId,
        fromText: connectData.from.text,
        toText: connectData.to.text
      };
      this.tableRelationDiagram.model.addLinkData(lineData);
      this.tableRelationDiagram.model.commitTransaction("flash");
    },
    saveModelToServer: function saveModelToServer() {
      if (this.recordId) {
        var sendData = {
          recordId: this.recordId,
          relationContent: JsonUtility.JsonToString(this.getDataJson()),
          relationDiagramJson: this.getDiagramJson()
        };
        AjaxUtility.Post(this.acInterface.saveDiagram, sendData, function (result) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }, "json");
      }
    },
    initDiagram: function initDiagram() {
      var _self = this;

      if (window.goSamples) goSamples();
      var $ = go.GraphObject.make;
      this.tableRelationDiagram = $(go.Diagram, "tableRelationDiagramDiv", {
        allowDelete: true,
        allowCopy: false,
        layout: $(go.ForceDirectedLayout, {
          isOngoing: false
        }),
        "undoManager.isEnabled": true
      });
      var tableRelationDiagram = this.tableRelationDiagram;
      var lightgrad = $(go.Brush, "Linear", {
        1: "#E6E6FA",
        0: "#FFFAF0"
      });
      var itemTempl = $(go.Panel, "Horizontal", $(go.Shape, {
        desiredSize: new go.Size(10, 10)
      }, new go.Binding("figure", "figure"), new go.Binding("fill", "color")), $(go.TextBlock, {
        stroke: "#333333",
        font: "bold 14px sans-serif"
      }, new go.Binding("text", "displayText")));
      tableRelationDiagram.nodeTemplate = $(go.Node, "Auto", {
        selectionAdorned: true,
        resizable: true,
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        isShadowed: true,
        shadowColor: "#C5C1AA",
        doubleClick: function doubleClick(e, node) {
          var url = BaseUtility.BuildView(_self.acInterface.tableView, {
            "op": "view",
            "recordId": node.data.tableId
          });
          DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {
            title: "表设计"
          }, 0);
        }
      }, new go.Binding("location", "loc", go.Point.parse), new go.Binding("desiredSize", "visible", function (v) {
        return new go.Size(NaN, NaN);
      }).ofObject("LIST"), $(go.Shape, "RoundedRectangle", {
        fill: lightgrad,
        stroke: "#756875",
        strokeWidth: 1
      }), $(go.Panel, "Table", {
        margin: 8,
        stretch: go.GraphObject.Fill
      }, $(go.RowColumnDefinition, {
        row: 0,
        sizing: go.RowColumnDefinition.None
      }), $(go.TextBlock, {
        row: 0,
        alignment: go.Spot.Center,
        margin: new go.Margin(0, 14, 0, 2),
        font: "bold 16px sans-serif"
      }, new go.Binding("text", "tableDisplayText")), $("PanelExpanderButton", "LIST", {
        row: 0,
        alignment: go.Spot.TopRight
      }), $(go.Panel, "Vertical", {
        name: "LIST",
        row: 1,
        padding: 3,
        alignment: go.Spot.TopLeft,
        defaultAlignment: go.Spot.Left,
        stretch: go.GraphObject.Horizontal,
        itemTemplate: itemTempl
      }, new go.Binding("itemArray", "fields"))));
      tableRelationDiagram.linkTemplate = $(go.Link, {
        selectionAdorned: true,
        layerName: "Foreground",
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver
      }, $(go.Shape, {
        stroke: "#303B45",
        strokeWidth: 1.5
      }), $(go.TextBlock, {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: 0,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright
      }, new go.Binding("text", "fromText")), $(go.TextBlock, {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: -1,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright
      }, new go.Binding("text", "toText")));
    },
    loadRelationDetailData: function loadRelationDetailData() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getSingleDiagramData, {
        recordId: this.recordId,
        op: "Edit"
      }, function (result) {
        if (result.success) {
          if (result.data.relationContent) {
            var dataJson = JsonUtility.StringToJson(result.data.relationContent);
            console.log(dataJson);

            _self.setDataJson(dataJson);

            _self.convertToFullJson(dataJson, _self.drawObjInDiagram);
          }
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    drawObjInDiagram: function drawObjInDiagram(fullJson) {
      var $ = go.GraphObject.make;
      var bluegrad = $(go.Brush, "Linear", {
        0: "rgb(150, 150, 250)",
        0.5: "rgb(86, 86, 186)",
        1: "rgb(86, 86, 186)"
      });
      var greengrad = $(go.Brush, "Linear", {
        0: "rgb(158, 209, 159)",
        1: "rgb(67, 101, 56)"
      });
      var redgrad = $(go.Brush, "Linear", {
        0: "rgb(206, 106, 100)",
        1: "rgb(180, 56, 50)"
      });
      var yellowgrad = $(go.Brush, "Linear", {
        0: "rgb(254, 221, 50)",
        1: "rgb(254, 182, 50)"
      });
      var linkDataArray = fullJson.lineList;
      this.tableRelationDiagram.model = $(go.GraphLinksModel, {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: fullJson.tableList
      });

      var _self = this;

      window.setTimeout(function () {
        _self.tableRelationDiagram.model.startTransaction("flash");

        for (var i = 0; i < fullJson.lineList.length; i++) {
          var lineData = fullJson.lineList[i];

          _self.tableRelationDiagram.model.addLinkData(lineData);
        }

        _self.tableRelationDiagram.model.commitTransaction("flash");
      }, 500);
    },
    convertToFullJson: function convertToFullJson(simpleJson, func) {
      var fullJson = JsonUtility.CloneSimple(simpleJson);
      var tableIds = new Array();

      for (var i = 0; i < simpleJson.tableList.length; i++) {
        tableIds.push(simpleJson.tableList[i].tableId);
      }

      var _self = this;

      AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {
        "tableIds": tableIds
      }, function (result) {
        if (result.success) {
          var allFields = result.data;
          var allTables = result.exKVData.Tables;

          for (var i = 0; i < fullJson.tableList.length; i++) {
            var singleTableData = _self.getSingleTableData(allTables, fullJson.tableList[i].tableId);

            fullJson.tableList[i].tableData = singleTableData;
            fullJson.tableList[i].tableName = singleTableData.tableName;
            fullJson.tableList[i].tableCaption = singleTableData.tableCaption;
            fullJson.tableList[i].tableDisplayText = singleTableData.displayText;

            var singleTableFieldsData = _self.getSingleTableFieldsData(allFields, fullJson.tableList[i].tableId);

            fullJson.tableList[i].fields = singleTableFieldsData;
            fullJson.tableList[i].key = fullJson.tableList[i].tableId;
          }

          _self.drawObjInDiagram(fullJson);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    getSingleTableData: function getSingleTableData(allTables, tableId) {
      for (var i = 0; i < allTables.length; i++) {
        if (allTables[i].tableId == tableId) {
          allTables[i].displayText = allTables[i].tableName + "[" + allTables[i].tableCaption + "]";
          return allTables[i];
        }
      }

      return null;
    },
    getSingleTableFieldsData: function getSingleTableFieldsData(allFields, tableId) {
      var result = [];

      for (var i = 0; i < allFields.length; i++) {
        if (allFields[i].fieldTableId == tableId) {
          allFields[i].displayText = allFields[i].fieldName + "[" + allFields[i].fieldCaption + "]";
          result.push(this.rendererFieldStyle(allFields[i]));
        }
      }

      return result;
    },
    rendererFieldStyle: function rendererFieldStyle(field) {
      if (field.fieldIsPk == "是") {
        field.color = this.getKeyFieldBrush();
        field.figure = "Decision";
      } else {
        field.color = this.getNorFieldBrush();
        field.figure = "Cube1";
      }

      return field;
    },
    getKeyFieldBrush: function getKeyFieldBrush() {
      return go.GraphObject.make(go.Brush, "Linear", {
        0: "rgb(254, 221, 50)",
        1: "rgb(254, 182, 50)"
      });
    },
    getNorFieldBrush: function getNorFieldBrush() {
      return go.GraphObject.make(go.Brush, "Linear", {
        0: "rgb(150, 150, 250)",
        0.5: "rgb(86, 86, 186)",
        1: "rgb(86, 86, 186)"
      });
    },
    getDataJson: function getDataJson() {
      var dataJson = {
        tableList: [],
        lineList: []
      };
      this.tableRelationDiagram.nodes.each(function (part) {
        if (part instanceof go.Node) {
          dataJson.tableList.push({
            tableId: part.data.tableId,
            loc: part.location.x + " " + part.location.y
          });
        } else if (part instanceof go.Link) {
          alert("line");
        }
      });
      this.tableRelationDiagram.links.each(function (part) {
        if (part instanceof go.Link) {
          dataJson.lineList.push({
            lineId: part.data.lineId,
            from: part.data.from,
            to: part.data.to,
            fromText: part.data.fromText,
            toText: part.data.toText
          });
        }
      });
      return dataJson;
    },
    setDataJson: function setDataJson(json) {
      this.formatJson = json;
    },
    getDiagramJson: function getDiagramJson() {
      return this.tableRelationDiagram.model.toJson();
    },
    alertDataJson: function alertDataJson() {
      var dataJson = this.getDataJson();
      DialogUtility.AlertJsonCode(dataJson);
    },
    alertDiagramJson: function alertDiagramJson() {
      var diagramJson = this.getDiagramJson();
      DialogUtility.AlertJsonCode(diagramJson);
    },
    tableIsExistInDiagram: function tableIsExistInDiagram(tableId) {
      var result = false;
      this.tableRelationDiagram.nodes.each(function (part) {
        if (part instanceof go.Node) {
          if (part.data.tableId == tableId) {
            result = true;
          }
        }
      });
      return result;
    },
    downLoadModelPNG: function downLoadModelPNG() {
      function myCallback(blob) {
        var url = window.URL.createObjectURL(blob);
        var filename = "myBlobFile1.png";
        var a = document.createElement("a");
        a.style = "display: none";
        a.href = url;
        a.download = filename;

        if (window.navigator.msSaveBlob !== undefined) {
          window.navigator.msSaveBlob(blob, filename);
          return;
        }

        document.body.appendChild(a);
        requestAnimationFrame(function () {
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
      }

      var blob = this.tableRelationDiagram.makeImageData({
        background: "white",
        returnType: "blob",
        scale: 1,
        callback: myCallback
      });
    }
  },
  template: "<div ref=\"relationContentOuterWrap\" class=\"table-relation-content-outer-wrap\">\n                    <div class=\"table-relation-content-header-wrap\">\n                        <div class=\"table-relation-desc-outer-wrap\" v-if=\"displayDesc\">\n                            <div class=\"table-relation-desc\">\n                                \u5907\u6CE8\uFF1A{{relation.relationDesc}}\n                            </div>\n                        </div>\n                        <div class=\"table-relation-op-buttons-outer-wrap\">\n                            <div class=\"table-relation-op-buttons-inner-wrap\">\n                                <button-group shape=\"circle\">\n                                    <i-button @click=\"showSelectTableDialog\" type=\"success\" icon=\"md-add\"></i-button>\n                                    <i-button @click=\"showSelectFieldConnectDialog\" type=\"primary\" icon=\"logo-steam\">\u8FDE\u63A5</i-button>\n                                    <i-button disabled type=\"primary\" icon=\"md-return-left\">\u5F15\u5165</i-button>\n                                    <i-button disabled type=\"primary\" icon=\"md-qr-scanner\">\u5168\u5C4F</i-button>\n                                    <i-button disabled type=\"primary\" icon=\"md-git-compare\">\u5386\u53F2</i-button>\n                                    <i-button @click=\"alertDataJson\" type=\"primary\" icon=\"md-code\">\u6570\u636EJson</i-button>\n                                    <i-button @click=\"alertDiagramJson\" type=\"primary\" icon=\"md-code-working\">\u56FE\u5F62Json</i-button>\n                                    <i-button @click=\"downLoadModelPNG\" type=\"primary\" icon=\"md-cloud-download\">\u4E0B\u8F7D</i-button>\n                                    <i-button @click=\"saveModelToServer\" type=\"primary\" icon=\"logo-instagram\">\u4FDD\u5B58</i-button>\n                                    <i-button @click=\"deleteSelection\" type=\"primary\" icon=\"md-close\"></i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"table-relation-content-wrap\" id=\"tableRelationDiagramDiv\"></div>\n                    <select-single-table-dialog ref=\"selectSingleTableDialog\" @on-selected-table=\"addTableToDiagram\"></select-single-table-dialog>\n                    <table-relation-connect-two-table-dialog ref=\"tableRelationConnectTwoTableDialog\" @on-completed-connect=\"connectSelectionNode\"></table-relation-connect-two-table-dialog>\n                </div>"
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

Vue.component("select-single-table-dialog", {
  data: function data() {
    return {
      acInterface: {
        getTableDataUrl: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
        getSingleOrganDataUrl: "/PlatFormRest/SSO/Organ/GetDetailData"
      },
      jsEditorInstance: null,
      tableTree: {
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
              var _self = this.getZTreeObj(treeId)._host;

              if (treeNode.nodeTypeName == "Table") {
                _self.selectedTable(event, treeId, treeNode);
              } else {
                _self.selectedTable(event, treeId, null);
              }
            }
          }
        },
        treeData: null,
        clickNode: null
      },
      selectedTableData: null
    };
  },
  mounted: function mounted() {},
  methods: {
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectTableModelDialogWrap);
    },
    beginSelectTable: function beginSelectTable() {
      var elem = this.$refs.selectTableModelDialogWrap;
      this.getTableDataInitTree();
      var height = 450;

      if (PageStyleUtility.GetPageHeight() > 550) {
        height = 600;
      }

      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 570,
        height: height,
        title: "选择表"
      });
    },
    getTableDataInitTree: function getTableDataInitTree() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getTableDataUrl, {}, function (result) {
        if (result.success) {
          _self.tableTree.treeData = result.data;

          _self.$refs.tableZTreeUL.setAttribute("id", "select-table-single-comp-" + StringUtility.Guid());

          _self.tableTree.treeObj = $.fn.zTree.init($(_self.$refs.tableZTreeUL), _self.tableTree.treeSetting, _self.tableTree.treeData);

          _self.tableTree.treeObj.expandAll(true);

          _self.tableTree.treeObj._host = _self;
          fuzzySearchTreeObj(_self.tableTree.treeObj, _self.$refs.txt_table_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    selectedTable: function selectedTable(event, treeId, tableData) {
      this.selectedTableData = tableData;
    },
    completed: function completed() {
      if (this.selectedTableData) {
        this.$emit('on-selected-table', this.selectedTableData);
        this.handleClose();
      } else {
        DialogUtility.AlertText("请选择表!");
      }
    }
  },
  template: "<div ref=\"selectTableModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div class=\"c1-select-model-source-wrap c1-select-model-source-has-buttons-wrap\">\n                        <i-input search class=\"input_border_bottom\" ref=\"txt_table_search_text\" placeholder=\"\u8BF7\u8F93\u5165\u8868\u540D\u6216\u8005\u6807\u9898\">\n                        </i-input>\n                        <div class=\"inner-wrap div-custom-scroll\">\n                            <ul ref=\"tableZTreeUL\" class=\"ztree\"></ul>\n                        </div>\n                    </div>\n                    <div class=\"button-outer-wrap\" style=\"bottom: 12px;right: 12px\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"completed()\" icon=\"md-checkmark\">\u786E\u8BA4</i-button>\n                                <i-button @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n               </div>"
});
"use strict";

Vue.component("table-relation-connect-two-table-dialog", {
  data: function data() {
    return {
      acInterface: {
        getTablesFieldsByTableIds: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds"
      },
      fromTableField: {
        fieldData: [],
        columnsConfig: [{
          title: '字段名称',
          key: 'fieldName',
          align: "center"
        }, {
          title: '标题',
          key: 'fieldCaption',
          align: "center"
        }]
      },
      toTableField: {
        fieldData: [],
        columnsConfig: [{
          title: '字段名称',
          key: 'fieldName',
          align: "center"
        }, {
          title: '标题',
          key: 'fieldCaption',
          align: "center"
        }]
      },
      dialogHeight: 0,
      resultData: {
        from: {
          tableId: "",
          text: ""
        },
        to: {
          tableId: "",
          text: ""
        }
      }
    };
  },
  mounted: function mounted() {},
  methods: {
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.connectTableFieldModelDialogWrap);
    },
    completed: function completed() {
      if (this.resultData.from.text != "" && this.resultData.to.text != "") {
        this.$emit('on-completed-connect', this.resultData);
        this.handleClose();
      } else {
        DialogUtility.AlertText("请设置关联字段");
      }
    },
    getFieldsAndBind: function getFieldsAndBind(fromTableId, toTableId) {
      var tableIds = [fromTableId, toTableId];

      var _self = this;

      AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {
        "tableIds": tableIds
      }, function (result) {
        if (result.success) {
          var allFields = result.data;
          var allTables = result.exKVData.Tables;

          var fromTableFields = _self.getSingleTableFieldsData(allFields, fromTableId);

          var toTableFields = _self.getSingleTableFieldsData(allFields, toTableId);

          _self.fromTableField.fieldData = fromTableFields;
          _self.toTableField.fieldData = toTableFields;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    beginSelectConnect: function beginSelectConnect(fromTableId, toTableId) {
      var elem = this.$refs.connectTableFieldModelDialogWrap;
      this.resultData.from.tableId = fromTableId;
      this.resultData.to.tableId = toTableId;
      this.resultData.from.text = "";
      this.resultData.to.text = "";
      this.getFieldsAndBind(fromTableId, toTableId);
      var height = 450;

      if (PageStyleUtility.GetPageHeight() > 550) {
        height = 600;
      }

      this.dialogHeight = height;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 870,
        height: height,
        title: "设置关联"
      });
    },
    getSingleTableFieldsData: function getSingleTableFieldsData(allFields, tableId) {
      var result = [];

      for (var i = 0; i < allFields.length; i++) {
        if (allFields[i].fieldTableId == tableId) {
          result.push(allFields[i]);
        }
      }

      return result;
    },
    selectedFromField: function selectedFromField(row, index) {
      this.resultData.from.text = row.fieldName + "[1]";
    },
    selectedToField: function selectedToField(row, index) {
      this.resultData.to.text = row.fieldName + "[0..N]";
    }
  },
  template: "<div ref=\"connectTableFieldModelDialogWrap\" class=\"c1-select-model-wrap general-edit-page-wrap\" style=\"display: none\">\n                    <div class=\"c1-select-model-source-wrap c1-select-model-source-has-buttons-wrap\" style=\"padding: 10px\">\n                        <div style=\"float: left;width: 49%;height: 100%;\">\n                            <i-input v-model=\"resultData.from.text\" suffix=\"md-done-all\" placeholder=\"\u5F00\u59CB\u5173\u8054\u5B57\u6BB5\" style=\"margin-bottom: 10px\">\n                            </i-input>\n                            <i-table @on-row-click=\"selectedFromField\" size=\"small\" :height=\"dialogHeight-180\" stripe border :columns=\"fromTableField.columnsConfig\" :data=\"fromTableField.fieldData\"\n                                         class=\"iv-list-table\" :highlight-row=\"true\"></i-table>\n                        </div>\n                        <div style=\"float:right;width: 49%;height: 100%;\">\n                            <i-input v-model=\"resultData.to.text\" suffix=\"md-done-all\" placeholder=\"\u7ED3\u675F\u5173\u8054\u5B57\u6BB5\" style=\"margin-bottom: 10px\">\n                            </i-input>\n                            <i-table @on-row-click=\"selectedToField\" size=\"small\" :height=\"dialogHeight-180\" stripe border :columns=\"toTableField.columnsConfig\" :data=\"toTableField.fieldData\"\n                                         class=\"iv-list-table\" :highlight-row=\"true\"></i-table>\n                        </div>\n                    </div>\n                    <div class=\"button-outer-wrap\" style=\"bottom: 12px;right: 12px\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"completed()\" icon=\"md-checkmark\">\u786E\u8BA4</i-button>\n                                <i-button @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n               </div>"
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

          fuzzySearchTreeObj(_self.selectTableTree.tableTreeObj, _self.$refs.txt_table_search_text.$refs.input, null, true);
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
          width: 700
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
                <divider orientation="left" :dashed="true" style="font-size: 12px;margin-top: 0px;margin-bottom: 10px">数据关系关联设置</divider>\
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
                    <i-input search class="input_border_bottom" ref="txt_table_search_text" placeholder="请输入表名或者标题"></i-input>\
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
  template: "<table class=\"html-design-plugin-dialog-table-wraper\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 280px\" />\n                        <col style=\"width: 90px\" />\n                        <col style=\"width: 110px\" />\n                        <col style=\"width: 90px\" />\n                        <col />\n                    </colgroup>\n                    <tr>\n                        <td>ID\uFF1A</td>\n                        <td>\n                            <input type=\"text\" v-model=\"baseInfo.id\" />\n                        </td>\n                        <td>Serialize\uFF1A</td>\n                        <td colspan=\"3\">\n                            <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.serialize\">\n                                <radio label=\"true\">\u662F</radio>\n                                <radio label=\"false\">\u5426</radio>\n                            </radio-group>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>Name\uFF1A</td>\n                        <td>\n                            <input type=\"text\" v-model=\"baseInfo.name\" />\n                        </td>\n                        <td>ClassName\uFF1A</td>\n                        <td colspan=\"3\">\n                            <input type=\"text\" v-model=\"baseInfo.className\" />\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>Placeholder</td>\n                        <td>\n                            <input type=\"text\" v-model=\"baseInfo.placeholder\" />\n                        </td>\n                        <td>Readonly\uFF1A</td>\n                        <td style=\"text-align: center\">\n                            <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.readonly\">\n                                <radio label=\"readonly\">\u662F</radio>\n                                <radio label=\"noreadonly\">\u5426</radio>\n                            </radio-group>\n                        </td>\n                        <td>Disabled\uFF1A</td>\n                        <td style=\"text-align: center\">\n                            <radio-group type=\"button\" style=\"margin: auto\" v-model=\"baseInfo.disabled\">\n                                <radio label=\"disabled\">\u662F</radio>\n                                <radio label=\"nodisabled\">\u5426</radio>\n                            </radio-group>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\u6837\u5F0F\uFF1A</td>\n                        <td colspan=\"5\">\n                            <textarea rows=\"7\" v-model=\"baseInfo.style\"></textarea>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\u5907\u6CE8\uFF1A</td>\n                        <td colspan=\"5\">\n                            <textarea rows=\"8\" v-model=\"baseInfo.desc\"></textarea>\n                        </td>\n                    </tr>\n                </table>"
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
      window._SelectBindObj = this;
      window.parent.appForm.selectBindToSingleFieldDialogBegin(window, this.getSelectFieldResultValue());
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

Vue.component("fd-control-select-bind-to-single-field-dialog", {
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        getTablesDataUrl: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesForZTreeNodeList",
        getTableFieldsDataUrl: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTableFieldsByTableId",
        getTablesFieldsByTableIds: "/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds"
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
              name: "displayText"
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
            onDblClick: function onDblClick(event, treeId, treeNode) {},
            onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {}
          }
        },
        tableTreeData: null,
        selectedTableName: "无"
      },
      fieldTable: {
        fieldData: [],
        tableHeight: 470,
        columnsConfig: [{
          title: ' ',
          width: 60,
          key: 'isSelectedToBind',
          render: function render(h, params) {
            if (params.row.isSelectedToBind == "1") {
              return h('div', {
                class: "list-row-button-wrap"
              }, [h('div', {
                class: "list-row-button selected"
              })]);
            } else {
              return h('div', {
                class: ""
              }, "");
            }
          }
        }, {
          title: '名称',
          key: 'fieldName',
          align: "center"
        }, {
          title: '标题',
          key: 'fieldCaption',
          align: "center"
        }]
      },
      oldRelationDataString: "",
      relationData: null,
      allFields: null,
      oldBindFieldData: null
    };
  },
  mounted: function mounted() {},
  methods: {
    beginSelect: function beginSelect(relationData, oldBindFieldData) {
      console.log("关联表数据：");
      console.log(relationData);
      console.log("已经绑定了的数据：");
      console.log(oldBindFieldData);

      if (relationData == null || relationData == "" || relationData.length == 0) {
        DialogUtility.AlertText("请先设置表单的数据关联！");
        $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
        $(window.document).find(".ui-dialog").css("zIndex", 10101);
        return;
      }

      var elem = this.$refs.fdControlSelectBindToSingleFieldDialogWrap;
      var height = 450;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        height: 680,
        width: 980,
        title: "选择绑定字段"
      });
      $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.document).find(".ui-dialog").css("zIndex", 10101);
      this.oldBindFieldData = oldBindFieldData;
      this.selectedData = JsonUtility.CloneSimple(oldBindFieldData);

      if (JsonUtility.JsonToString(relationData) != this.oldRelationDataString) {
        for (var i = 0; i < relationData.length; i++) {
          relationData[i].displayText = relationData[i].tableName + "[" + relationData[i].tableCaption + "](" + relationData[i].relationType + ")";

          if (relationData[i].parentId == "-1") {
            relationData[i].displayText = relationData[i].tableName + "[" + relationData[i].tableCaption + "]";
          }

          relationData[i].icon = "../../../Themes/Png16X16/table.png";
        }

        this.tableTree.tableTreeObj = $.fn.zTree.init($("#tableZTreeUL"), this.tableTree.tableTreeSetting, relationData);
        this.tableTree.tableTreeObj.expandAll(true);
        this.oldRelationDataString = JsonUtility.JsonToString(relationData);
        this.relationData = relationData;
        this.getAllTablesFields(relationData);
      } else {
        this.resetFieldToSelectedStatus(this.allFields);
      }

      if (oldBindFieldData && oldBindFieldData.tableId && oldBindFieldData.tableId != "") {
        var selectedNode = this.tableTree.tableTreeObj.getNodeByParam("tableId", oldBindFieldData.tableId);
        this.tableTree.tableTreeObj.selectNode(selectedNode, false, true);
      }
    },
    resetFieldToSelectedStatus: function resetFieldToSelectedStatus(_allFields) {
      for (var i = 0; i < this.fieldTable.fieldData.length; i++) {
        this.fieldTable.fieldData[i].isSelectedToBind = "0";
      }

      if (_allFields) {
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
    getAllTablesFields: function getAllTablesFields(relationData) {
      var tableIds = [];

      for (var i = 0; i < relationData.length; i++) {
        tableIds.push(relationData[i].tableId);
      }

      var _self = this;

      AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {
        "tableIds": tableIds
      }, function (result) {
        if (result.success) {
          var allFields = result.data;
          var singleTable = result.exKVData.Tables[0];
          console.log("重新获取数据");
          console.log(allFields);

          _self.resetFieldToSelectedStatus(allFields);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    filterAllFieldsToTable: function filterAllFieldsToTable(tableId) {
      if (tableId) {
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
    selectedField: function selectedField(selection, index) {
      this.selectedData.fieldName = selection.fieldName;
      this.selectedData.fieldCaption = selection.fieldCaption;
      this.selectedData.fieldDataType = selection.fieldDataType;
      this.selectedData.fieldLength = selection.fieldDataLength;
      var selectedNode = this.tableTree.tableTreeObj.getNodeByParam("tableId", selection.fieldTableId);
      this.selectedData.tableId = selectedNode.tableId;
      this.selectedData.tableName = selectedNode.tableName;
      this.selectedData.tableCaption = selectedNode.tableCaption;
    },
    selectComplete: function selectComplete() {
      var result = this.selectedData;

      if (!StringUtility.IsNullOrEmpty(result.tableId) && !StringUtility.IsNullOrEmpty(result.fieldName)) {
        this.$emit('on-selected-bind-to-single-field', result);
        this.handleClose();
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择需要绑定的字段!", null);
      }
    },
    clearComplete: function clearComplete() {
      window.OpenerWindowObj[this.getSelectInstanceName()].setSelectFieldResultValue(null);
      this.handleClose();
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.fdControlSelectBindToSingleFieldDialogWrap);
    }
  },
  template: "<div ref=\"fdControlSelectBindToSingleFieldDialogWrap\" class=\"general-edit-page-wrap design-dialog-wraper-single-dialog\" style=\"display: none\">\n                    <div class=\"select-table-wraper\">\n                        <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px\">\u9009\u62E9\u8868</divider>\n                        <!--<input type=\"text\" id=\"txtSearchTableTree\" style=\"width: 100%;height: 32px;margin-top: 2px\" />-->\n                        <ul id=\"tableZTreeUL\" class=\"ztree\"></ul>\n                    </div>\n                    <div class=\"select-field-wraper iv-list-page-wrap\">\n                        <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px\">\u9009\u62E9\u5B57\u6BB5</divider>\n                        <i-table border :columns=\"fieldTable.columnsConfig\" :data=\"fieldTable.fieldData\"\n                                 class=\"iv-list-table\" :highlight-row=\"true\"\n                                 @on-row-click=\"selectedField\" :height=\"fieldTable.tableHeight\" size=\"small\" no-data-text=\"\u8BF7\u9009\u62E9\u8868\"></i-table>\n                    </div>\n                    <div class=\"button-outer-wrap\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"selectComplete()\"> \u786E \u8BA4 </i-button>\n                                <i-button type=\"primary\" @click=\"clearComplete()\"> \u6E05 \u7A7A </i-button>\n                                <i-button @click=\"handleClose()\">\u5173 \u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
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
                                <upload style="margin:10px 12px 0 20px" :data="importEXData" :before-upload="bindUploadExData" :on-success="uploadFlowModelImageSuccess" multiple type="drag" name="file" action="../../../PlatFormRest/Builder/FlowModel/UploadProcessModelMainImg.do" accept=".png">\
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
                            <upload :data="importEXData" :before-upload="bindUploadExData" :on-success="uploadSuccess" multiple type="drag" name="file" action="../../../PlatFormRest/Builder/FlowModel/ImportProcessModel.do" accept=".bpmn">\
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
    var _self = this;

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
          }, [ListPageUtility.IViewTableInnerButton.EditButton(h, params, _self.idFieldName, _self), ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, _self.idFieldName, _self)]);
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
    getModuleName: function getModuleName() {
      return this.moduleData == null ? "请选中模块" : this.moduleData.moduleText;
    },
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
                        <div class="module-list-name"><Icon type="ios-arrow-dropright-circle" />&nbsp;模块【{{getModuleName()}}】</div>\
                        <div class="list-button-inner-wrap">\
                            <ButtonGroup>\
                                <i-button  type="success" @click="add()" icon="md-add">新增</i-button>\
                                <i-button type="primary" disabled icon="md-add">引入URL </i-button>\
                                <i-button type="primary" disabled icon="md-albums">复制</i-button>\
                                <i-button type="primary" disabled icon="md-pricetag">预览</i-button>\
                                <i-button type="primary" disabled icon="md-bookmarks">历史版本</i-button>\
                                <i-button type="primary" disabled icon="md-brush">复制ID</i-button>\
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
    window._modulelistweblistcomp = this;
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
    getModuleName: function getModuleName() {
      return this.moduleData == null ? "请选中模块" : this.moduleData.moduleText;
    },
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
                        <div class="module-list-name"><Icon type="ios-arrow-dropright-circle" />&nbsp;模块【{{getModuleName()}}】</div>\
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

Vue.component("sso-app-detail-from-comp", {
  props: ["status", "appId", "isSubSystem"],
  watch: {
    appId: function appId(newVal) {
      this.appEntity.appId = newVal;
    },
    status: function status(newVal) {
      this.innerStatus = newVal;
    }
  },
  data: function data() {
    return {
      acInterface: {
        appLogoUrl: "/PlatFormRest/SSO/Application/GetAppLogo",
        getNewKeys: "/PlatFormRest/SSO/Application/GetNewKeys"
      },
      appEntity: {
        appId: "",
        appCode: "",
        appName: "",
        appPublicKey: "",
        appPrivateKey: "",
        appDomain: "",
        appIndexUrl: "",
        appMainImageId: "",
        appType: "",
        appMainId: "",
        appCategory: "web",
        appDesc: "",
        appStatus: "启用",
        appCreateTime: DateUtility.GetCurrentData()
      },
      ruleValidate: {
        appCode: [{
          required: true,
          message: '【系统编码】不能为空！',
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[A-Za-z0-9]+$/,
          message: '请使用字母或数字',
          trigger: 'blur'
        }],
        appName: [{
          required: true,
          message: '【系统名称】不能为空！',
          trigger: 'blur'
        }]
      },
      systemLogoImageSrc: "",
      innerStatus: "add"
    };
  },
  mounted: function mounted() {
    if (this.innerStatus == "add") {
      this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
        fileId: "defaultSSOAppLogoImage"
      });
    } else {
      this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
        fileId: ""
      });
    }
  },
  methods: {
    resetAppEntity: function resetAppEntity() {
      this.appEntity.appId = "";
      this.appEntity.appCode = "";
      this.appEntity.appName = "";
      this.appEntity.appPublicKey = "";
      this.appEntity.appPrivateKey = "";
      this.appEntity.appDomain = "";
      this.appEntity.appIndexUrl = "";
      this.appEntity.appMainImageId = "";
      this.appEntity.appType = "";
      this.appEntity.appMainId = "";
      this.appEntity.appCategory = "web";
      this.appEntity.appDesc = "";
      this.appEntity.appStatus = "启用";
      this.appEntity.appCreateTime = DateUtility.GetCurrentData();
    },
    uploadSystemLogoImageSuccess: function uploadSystemLogoImageSuccess(response, file, fileList) {
      var data = response.data;
      this.appEntity.appMainImageId = data.fileId;
      this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
        fileId: this.appEntity.appMainImageId
      });
    },
    getAppEntity: function getAppEntity() {
      return this.appEntity;
    },
    setAppEntity: function setAppEntity(appEntity) {
      this.appEntity = appEntity;
    },
    createKeys: function createKeys() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getNewKeys, {}, function (result) {
        if (result.success) {
          _self.appEntity.appPublicKey = result.data.publicKey;
          _self.appEntity.appPrivateKey = result.data.privateKey;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    }
  },
  template: "<div>\n                    <div style=\"width: 80%;float: left\">\n                        <i-form ref=\"appEntity\" :model=\"appEntity\" :rules=\"ruleValidate\" :label-width=\"100\">\n                            <form-item label=\"\u7CFB\u7EDF\u7F16\u7801\uFF1A\" prop=\"appCode\">\n                                <row>\n                                    <i-col span=\"10\">\n                                        <form-item prop=\"appCode\">\n                                            <i-input v-model=\"appEntity.appCode\"></i-input>\n                                        </form-item>\n                                    </i-col>\n                                    <i-col span=\"4\" style=\"text-align: center\"><span style=\"color: red\">*</span> \u7CFB\u7EDF\u540D\u79F0\uFF1A</i-col>\n                                    <i-col span=\"10\">\n                                        <form-item prop=\"appName\">\n                                            <i-input v-model=\"appEntity.appName\"></i-input>\n                                        </form-item>\n                                    </i-col>\n                                </row>\n                            </form-item>\n                            <form-item label=\"\u57DF\u540D\uFF1A\">\n                                <row>\n                                    <i-col span=\"10\">\n                                        <i-input v-model=\"appEntity.appDomain\"></i-input>\n                                    </i-col>\n                                    <i-col span=\"4\" style=\"text-align: center\">\u7CFB\u7EDF\u7C7B\u522B\uFF1A</i-col>\n                                    <i-col span=\"10\">\n                                        <radio-group v-model=\"appEntity.appCategory\" type=\"button\">\n                                            <radio label=\"app\">\u79FB\u52A8App</radio>\n                                            <radio label=\"web\">Web\u7CFB\u7EDF</radio>\n                                        </radio-group>\n                                    </i-col>\n                                </row>\n                            </form-item>\n                            <form-item label=\"\u516C\u94A5\uFF1A\" v-if=\"isSubSystem=='0'\">\n                                <i-input placeholder=\"\u8BF7\u521B\u5EFA\u5BC6\u94A5\u5BF9,\u7528\u4E8E\u6570\u636E\u7684\u52A0\u5BC6\u4F7F\u7528\" search enter-button=\"\u521B\u5EFA\u5BC6\u94A5\u5BF9\" v-model=\"appEntity.appPublicKey\" @on-search=\"createKeys()\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u79C1\u94A5\uFF1A\" v-if=\"isSubSystem==0\">\n                                <i-input v-model=\"appEntity.appPrivateKey\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u521B\u5EFA\u65F6\u95F4\uFF1A\">\n                                <row>\n                                    <i-col span=\"10\">\n                                        <date-picker type=\"date\" placeholder=\"\u9009\u62E9\u521B\u5EFA\u65F6\u95F4\" v-model=\"appEntity.appCreateTime\" disabled\n                                                     readonly></date-picker>\n                                    </i-col>\n                                    <i-col span=\"4\" style=\"text-align: center\">\u72B6\u6001\uFF1A</i-col>\n                                    <i-col span=\"10\">\n                                        <form-item>\n                                            <radio-group v-model=\"appEntity.appStatus\">\n                                                <radio label=\"\u542F\u7528\">\u542F\u7528</radio>\n                                                <radio label=\"\u7981\u7528\">\u7981\u7528</radio>\n                                            </radio-group>\n                                        </form-item>\n                                    </i-col>\n                                </row>\n                            </form-item>\n                            <form-item label=\"\u9ED8\u8BA4\u5730\u5740\uFF1A\">\n                                <i-input v-model=\"appEntity.appIndexUrl\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u5907\u6CE8\uFF1A\">\n                                <i-input v-model=\"appEntity.appDesc\" type=\"textarea\" :autosize=\"{minRows: 4,maxRows: 4}\"></i-input>\n                            </form-item>\n                        </i-form>\n                    </div>\n                    <div style=\"width: 19%;float: right\">\n                        <div style=\"border-radius: 8px;text-align: center;margin-top: 0px;margin-bottom: 30px\">\n                            <img :src=\"systemLogoImageSrc\" style=\"width: 110px;height: 110px\" />\n                        </div>\n                        <upload style=\"margin:10px 12px 0 20px\" :on-success=\"uploadSystemLogoImageSuccess\" multiple type=\"drag\" name=\"file\" action=\"../../..//PlatFormRest/SSO/Application/UploadAppLogo.do\" accept=\".png\">\n                            <div style=\"padding:10px 0px\">\n                                <icon type=\"ios-cloud-upload\" size=\"52\" style=\"color: #3399ff\"></icon>\n                                <p>\u4E0A\u4F20\u7CFB\u7EDFLogo</p>\n                            </div>\n                        </upload>\n                    </div>\n                </div>"
});
"use strict";

Vue.component("sso-app-interface-list-comp", {
  props: ["interfaceBelongAppId"],
  watch: {
    interfaceBelongAppId: function interfaceBelongAppId(newVal) {
      this.interfaceEntity.interfaceBelongAppId = newVal;
    }
  },
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        delete: "/PlatFormRest/SSO/Application/DeleteInterface"
      },
      interfaceEntity: {
        interfaceId: "",
        interfaceBelongAppId: "",
        interfaceCode: "",
        interfaceName: "",
        interfaceUrl: "",
        interfaceParas: "",
        interfaceFormat: "",
        interfaceDesc: "",
        interfaceOrderNum: "",
        interfaceCreateTime: DateUtility.GetCurrentData(),
        interfaceStatus: "启用",
        interfaceCreaterId: "",
        interfaceOrganId: ""
      },
      list: {
        columnsConfig: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '接口类型',
          key: 'interfaceCode',
          align: "center",
          width: 100
        }, {
          title: '接口名称',
          key: 'interfaceName',
          align: "center",
          width: 280
        }, {
          title: '备注',
          key: 'interfaceDesc',
          align: "center"
        }, {
          title: '操作',
          key: 'interfaceId',
          width: 140,
          align: "center",
          render: function render(h, params) {
            return h('div', {
              class: "list-row-button-wrap"
            }, [ListPageUtility.IViewTableInnerButton.EditButton(h, params, "interfaceId", _self), ListPageUtility.IViewTableInnerButton.DeleteButton(h, params, "interfaceId", _self)]);
          }
        }],
        tableData: []
      },
      innerStatus: "add"
    };
  },
  mounted: function mounted() {},
  methods: {
    resetListData: function resetListData() {
      this.list.tableData = [];
    },
    addInterface: function addInterface() {
      var elem = this.$refs.ssoAppInterfaceEditModelDialogWrap;
      this.innerStatus == "add";
      this.interfaceEntity.interfaceId = "";
      this.interfaceEntity.interfaceBelongAppId = this.interfaceBelongAppId;
      this.interfaceEntity.interfaceCode = "";
      this.interfaceEntity.interfaceName = "";
      this.interfaceEntity.interfaceUrl = "";
      this.interfaceEntity.interfaceParas = "";
      this.interfaceEntity.interfaceFormat = "";
      this.interfaceEntity.interfaceDesc = "";
      this.interfaceEntity.interfaceOrderNum = "";
      this.interfaceEntity.interfaceCreateTime = DateUtility.GetCurrentData();
      this.interfaceEntity.interfaceStatus = "启用";
      this.interfaceEntity.interfaceCreaterId = "";
      this.interfaceEntity.interfaceOrganId = "";
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 570,
        height: 330,
        title: "接口设置"
      });
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.ssoAppInterfaceEditModelDialogWrap);
    },
    saveInterfaceEdit: function saveInterfaceEdit() {
      if (this.innerStatus == "add") {
        this.interfaceEntity.interfaceId = StringUtility.Guid();
        this.list.tableData.push(JsonUtility.CloneSimple(this.interfaceEntity));
      } else {
        for (var i = 0; i < this.list.tableData.length; i++) {
          if (this.list.tableData[i].interfaceId == this.interfaceEntity.interfaceId) {
            this.list.tableData[i].interfaceCode = this.interfaceEntity.interfaceCode;
            this.list.tableData[i].interfaceName = this.interfaceEntity.interfaceName;
            this.list.tableData[i].interfaceUrl = this.interfaceEntity.interfaceUrl;
            this.list.tableData[i].interfaceParas = this.interfaceEntity.interfaceParas;
            this.list.tableData[i].interfaceFormat = this.interfaceEntity.interfaceFormat;
            this.list.tableData[i].interfaceDesc = this.interfaceEntity.interfaceDesc;
            break;
          }
        }
      }

      this.handleClose();
    },
    changeInterfaceCode: function changeInterfaceCode(value) {
      this.interfaceEntity.interfaceCode = value;
    },
    getInterfaceListData: function getInterfaceListData() {
      return this.list.tableData;
    },
    setInterfaceListData: function setInterfaceListData(data) {
      this.list.tableData = data;
    },
    edit: function edit(interfaceId, params) {
      this.innerStatus = "update";
      this.interfaceEntity.interfaceId = params.row.interfaceId;
      this.interfaceEntity.interfaceCode = params.row.interfaceCode;
      this.interfaceEntity.interfaceName = params.row.interfaceName;
      this.interfaceEntity.interfaceUrl = params.row.interfaceUrl;
      this.interfaceEntity.interfaceParas = params.row.interfaceParas;
      this.interfaceEntity.interfaceFormat = params.row.interfaceFormat;
      this.interfaceEntity.interfaceDesc = params.row.interfaceDesc;
      this.interfaceEntity.interfaceOrderNum = params.row.interfaceOrderNum;
      this.interfaceEntity.interfaceCreateTime = params.row.interfaceCreateTime;
      this.interfaceEntity.interfaceStatus = params.row.interfaceStatus;
      this.interfaceEntity.interfaceCreaterId = params.row.interfaceCreaterId;
      this.interfaceEntity.interfaceOrganId = params.row.interfaceOrganId;
      this.interfaceEntity.interfaceBelongAppId = params.row.interfaceBelongAppId;
      var elem = this.$refs.ssoAppInterfaceEditModelDialogWrap;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 570,
        height: 330,
        title: "接口设置"
      });
    },
    del: function del(interfaceId, params) {
      var _self = this;

      for (var i = 0; i < this.list.tableData.length; i++) {
        if (this.list.tableData[i].interfaceId == interfaceId) {
          _self.list.tableData.splice(i, 1);

          DialogUtility.Confirm(window, "确认要删除该接口吗？", function () {
            AjaxUtility.Delete(_self.acInterface.delete, {
              "interfaceId": interfaceId
            }, function (result) {
              if (result.success) {} else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
              }
            }, "json");
          });
        }
      }
    }
  },
  template: "<div class=\"iv-list-page-wrap\">\n                    <div ref=\"ssoAppInterfaceEditModelDialogWrap\" class=\"general-edit-page-wrap\" style=\"display: none;margin-top: 0px\">\n                        <i-form ref=\"interfaceEntity\" :model=\"interfaceEntity\" :label-width=\"130\">\n                            <form-item style=\"margin-bottom: 2px\">\n                                <span slot=\"label\"><span style=\"color: red\">*</span>&nbsp;\u63A5\u53E3\u7C7B\u578B\uFF1A</span>\n                                <i-input v-model=\"interfaceEntity.interfaceCode\" size=\"small\">\n                                    <Select slot=\"append\" style=\"width: 90px\" @on-change=\"changeInterfaceCode\">\n                                        <Option value=\"\u767B\u5F55\u63A5\u53E3\">\u767B\u5F55\u63A5\u53E3</Option>\n                                        <Option value=\"\u5176\u4ED6\">\u5176\u4ED6</Option>\n                                    </Select>\n                                </i-input>\n                            </form-item>\n                            <form-item style=\"margin-bottom: 2px\">\n                                <span slot=\"label\"><span style=\"color: red\">*</span>&nbsp;\u63A5\u53E3\u540D\u79F0\uFF1A</span>\n                                <i-input v-model=\"interfaceEntity.interfaceName\" size=\"small\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u63A5\u53E3\u5730\u5740\uFF1A\" style=\"margin-bottom: 2px\">\n                                <i-input v-model=\"interfaceEntity.interfaceUrl\" size=\"small\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u53C2\u6570\uFF1A\" style=\"margin-bottom: 2px\">\n                                <i-input v-model=\"interfaceEntity.interfaceParas\" type=\"textarea\" :autosize=\"{minRows: 2,maxRows: 2}\" size=\"small\"></i-input>    \n                            </form-item>\n                            <form-item label=\"\u683C\u5F0F\u5316\u65B9\u6CD5\uFF1A\" style=\"margin-bottom: 2px\">\n                                <i-input v-model=\"interfaceEntity.interfaceFormat\" size=\"small\"></i-input>\n                            </form-item>\n                            <form-item label=\"\u5907\u6CE8\uFF1A\" style=\"margin-bottom: 2px\">\n                                <i-input v-model=\"interfaceEntity.interfaceDesc\" size=\"small\"></i-input>\n                            </form-item>\n                        </i-form>\n                        <div class=\"button-outer-wrap\" style=\"margin-left: 8px\">\n                            <div class=\"button-inner-wrap\">\n                                <button-group size=\"small\">\n                                    <i-button type=\"primary\" @click=\"saveInterfaceEdit('interfaceEntity')\" icon=\"md-checkmark\"></i-button>\n                                    <i-button @click=\"handleClose()\" icon=\"md-close\"></i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                    <div id=\"list-button-wrap\" class=\"list-button-outer-wrap\">\n                        <div class=\"list-button-inner-wrap\">\n                            <ButtonGroup>\n                                <i-button  type=\"success\" @click=\"addInterface()\" icon=\"md-add\">\u65B0\u589E</i-button>\n                            </ButtonGroup>\n                        </div>\n                        <div style=\"clear: both\"></div>\n                    </div>\n                    <i-table :height=\"list.listHeight\" stripe border :columns=\"list.columnsConfig\" :data=\"list.tableData\"\n                         class=\"iv-list-table\" :highlight-row=\"true\"></i-table>\n                </div>"
});
"use strict";

Vue.component("sso-app-sub-system-list-comp", {
  props: ["status", "belongAppId"],
  data: function data() {
    return {
      acInterface: {
        saveSubAppUrl: "/PlatFormRest/SSO/Application/SaveSubApp",
        reloadData: "/PlatFormRest/SSO/Application/GetAllSubSsoApp",
        appLogoUrl: "/PlatFormRest/SSO/Application/GetAppLogo",
        delete: "/PlatFormRest/SSO/Application/Delete",
        getDataUrl: "/PlatFormRest/SSO/Application/GetAppVo"
      },
      appList: [],
      innerEditModelDialogStatus: "add"
    };
  },
  mounted: function mounted() {
    this.reloadData();
  },
  methods: {
    addIntegratedSystem: function addIntegratedSystem() {
      var elem = this.$refs.ssoAppSubSystemEditModelDialogWrap;
      this.$refs.subAppDetailFromComp.resetAppEntity();
      this.$refs.subAppInterfaceListComp.resetListData();
      this.innerEditModelDialogStatus = "add";
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 900,
        height: 500,
        title: "子系统设置"
      });
    },
    saveSubSystemSetting: function saveSubSystemSetting() {
      var _self = this;

      var ssoAppEntity = this.$refs.subAppDetailFromComp.getAppEntity();
      var ssoAppInterfaceEntityList = this.$refs.subAppInterfaceListComp.getInterfaceListData();
      ssoAppEntity.appMainId = this.belongAppId;

      if (this.innerEditModelDialogStatus == "add") {
        ssoAppEntity.appId = StringUtility.Guid();
      }

      if (ssoAppInterfaceEntityList) {
        for (var i = 0; i < ssoAppInterfaceEntityList.length; i++) {
          ssoAppInterfaceEntityList[i].interfaceBelongAppId = ssoAppEntity.appId;
        }
      }

      var vo = {
        "ssoAppEntity": ssoAppEntity,
        "ssoAppInterfaceEntityList": ssoAppInterfaceEntityList
      };
      var sendData = JSON.stringify(vo);
      AjaxUtility.PostRequestBody(this.acInterface.saveSubAppUrl, sendData, function (result) {
        if (result.success) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
            _self.reloadData();

            _self.handleClose();
          });
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.ssoAppSubSystemEditModelDialogWrap);
    },
    reloadData: function reloadData() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.reloadData, {
        appId: _self.belongAppId
      }, function (result) {
        if (result.success) {
          _self.appList = result.data;
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    buildLogoUrl: function buildLogoUrl(app) {
      if (app.appMainImageId == "") {
        return BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
          fileId: "defaultSSOAppLogoImage"
        });
      } else {
        return BaseUtility.BuildAction(this.acInterface.appLogoUrl, {
          fileId: app.appMainImageId
        });
      }
    },
    settingApp: function settingApp(app) {
      var elem = this.$refs.ssoAppSubSystemEditModelDialogWrap;
      this.innerEditModelDialogStatus = "update";

      var _self = this;

      AjaxUtility.Post(this.acInterface.getDataUrl, {
        appId: app.appId
      }, function (result) {
        console.log(result);

        if (result.success) {
          _self.$refs.subAppDetailFromComp.setAppEntity(result.data.ssoAppEntity);

          _self.$refs.subAppInterfaceListComp.setInterfaceListData(result.data.ssoAppInterfaceEntityList);

          DialogUtility.DialogElemObj(elem, {
            modal: true,
            width: 900,
            height: 500,
            title: "子系统设置"
          });
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    removeApp: function removeApp(app) {
      var _self = this;

      DialogUtility.Confirm(window, "确认要注销系统[" + app.appName + "]吗？", function () {
        AjaxUtility.Delete(_self.acInterface.delete, {
          appId: app.appId
        }, function (result) {
          if (result.success) {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
              _self.reloadData();
            });
          } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
          }
        }, "json");
      });
    }
  },
  template: "<div>\n                    <div ref=\"ssoAppSubSystemEditModelDialogWrap\" class=\"general-edit-page-wrap\" style=\"display: none;margin-top: 0px\">\n                        <tabs>\n                            <tab-pane label=\"\u7CFB\u7EDF\u8BBE\u7F6E\">\n                                <sso-app-detail-from-comp ref=\"subAppDetailFromComp\" :is-sub-system=\"true\" :status=\"innerEditModelDialogStatus\"></sso-app-detail-from-comp>\n                            </tab-pane>\n                            <tab-pane label=\"\u63A5\u53E3\u8BBE\u7F6E\">\n                                <sso-app-interface-list-comp ref=\"subAppInterfaceListComp\"></sso-app-interface-list-comp>\n                            </tab-pane>\n                        </tabs>\n                        <div class=\"button-outer-wrap\" style=\"margin-right: 10px;margin-bottom: 10px\">\n                            <div class=\"button-inner-wrap\">\n                                <button-group>\n                                    <i-button type=\"primary\" v-if=\"status!='view'\" @click=\"saveSubSystemSetting()\" icon=\"md-checkmark\">\u4FDD\u5B58\u5B50\u7CFB\u7EDF\u8BBE\u7F6E</i-button>\n                                    <i-button v-if=\"status!='view'\" @click=\"handleClose()\" icon=\"md-close\">\u5173\u95ED</i-button>\n                                </button-group>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"apps-manager-outer-wrap\">\n                        <div class=\"apps-outer-wrap\" ref=\"appsOuterWrap\" v-if=\"status!='add'\">\n                            <div  v-for=\"app in appList\" class=\"app-outer-wrap app-outer-wrap-sub-system\">\n                                <div class=\"title\">\n                                    <span>{{app.appName}}</span>\n                                </div>\n                                <div class=\"content\">\n                                    <div class=\"mainImg\">\n                                        <img :src=\"buildLogoUrl(app)\" />\n                                    </div>\n                                    <div class=\"button-wrap\">\n                                        <div class=\"button setting-button\" @click=\"settingApp(app)\">\n                                            \u8BBE\u7F6E\n                                        </div>\n                                        <div class=\"button remove-button\" @click=\"removeApp(app)\">\n                                            \u6CE8\u9500\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"app-outer-wrap app-outer-wrap-sub-system new-system-outer-wrap\">\n                                <div class=\"add-system-button\" @click=\"addIntegratedSystem()\" style=\"margin-top: 60px\">\u65B0\u589E</div>\n                            </div>\n                        </div>\n                        <div v-if=\"status=='add'\">\u8BF7\u5148\u4FDD\u5B58\u4E3B\u7CFB\u7EDF,\u518D\u8BBE\u7F6E\u5176\u4E2D\u7684\u5B50\u7CFB\u7EDF!</div>\n                    </div>\n                 </div>"
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXAvZGF0YXNldC1zaW1wbGUtc2VsZWN0LWNvbXAuanMiLCJDb21wL2pzLWRlc2lnbi1jb2RlLWZyYWdtZW50LmpzIiwiQ29tcC9zcWwtZ2VuZXJhbC1kZXNpZ24tY29tcC5qcyIsIkNvbXAvdGFibGUtcmVsYXRpb24tY29udGVudC1jb21wLmpzIiwiRGlhbG9nL3NlbGVjdC1kZXBhcnRtZW50LXVzZXItZGlhbG9nLmpzIiwiRGlhbG9nL3NlbGVjdC1zaW5nbGUtdGFibGUtZGlhbG9nLmpzIiwiRGlhbG9nL3RhYmxlLXJlbGF0aW9uLWNvbm5lY3QtdHdvLXRhYmxlLWRpYWxvZy5qcyIsIkhUTUxEZXNpZ24vZGItdGFibGUtcmVsYXRpb24tY29tcC5qcyIsIkhUTUxEZXNpZ24vZGVzaWduLWh0bWwtZWxlbS1saXN0LmpzIiwiSFRNTERlc2lnbi9mZC1jb250cm9sLWJhc2UtaW5mby5qcyIsIkhUTUxEZXNpZ24vZmQtY29udHJvbC1iaW5kLXRvLmpzIiwiSFRNTERlc2lnbi9mZC1jb250cm9sLXNlbGVjdC1iaW5kLXRvLXNpbmdsZS1maWVsZC1kaWFsb2cuanMiLCJNb2R1bGUvbW9kdWxlLWxpc3QtYWJvdXRjb25maWctY29tcC5qcyIsIk1vZHVsZS9tb2R1bGUtbGlzdC1hcHBmb3JtLWNvbXAuanMiLCJNb2R1bGUvbW9kdWxlLWxpc3QtYXBwbGlzdC1jb21wLmpzIiwiTW9kdWxlL21vZHVsZS1saXN0LWZsb3ctY29tcC5qcyIsIk1vZHVsZS9tb2R1bGUtbGlzdC1yZXBvcnQtY29tcC5qcyIsIk1vZHVsZS9tb2R1bGUtbGlzdC13ZWJmb3JtLWNvbXAuanMiLCJNb2R1bGUvbW9kdWxlLWxpc3Qtd2VibGlzdC1jb21wLmpzIiwiU2VsZWN0QnV0dG9uL3NlbGVjdC1vcmdhbi1jb21wLmpzIiwiU2VsZWN0QnV0dG9uL3NlbGVjdC1vcmdhbi1zaW5nbGUtY29tcC5qcyIsIlNTTy9zc28tYXBwLWRldGFpbC1mcm9tLWNvbXAuanMiLCJTU08vc3NvLWFwcC1pbnRlcmZhY2UtbGlzdC1jb21wLmpzIiwiU1NPL3Nzby1hcHAtc3ViLXN5c3RlbS1saXN0LWNvbXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNucUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDblZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Z0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0UEE7QUNBQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BZQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJWdWVFWENvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZGF0YXNldC1zaW1wbGUtc2VsZWN0LWNvbXBcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXREYXRhU2V0RGF0YTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRGF0YVNldC9EYXRhU2V0TWFpbi9HZXREYXRhU2V0c0ZvclpUcmVlTm9kZUxpc3RcIlxuICAgICAgfSxcbiAgICAgIGRhdGFTZXRUcmVlOiB7XG4gICAgICAgIHRhYmxlVHJlZU9iajogbnVsbCxcbiAgICAgICAgdGFibGVUcmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIGNoa1N0eWxlOiBcInJhZGlvXCIsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBpZiAodHJlZU5vZGUubm9kZVR5cGVOYW1lID09IFwiVGFibGVcIikge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRhYmxlVHJlZURhdGE6IG51bGwsXG4gICAgICAgIHNlbGVjdGVkVGFibGVOYW1lOiBcIuaXoFwiXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJpbmREYXRhU2V0VHJlZSgpO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYmluZERhdGFTZXRUcmVlOiBmdW5jdGlvbiBiaW5kRGF0YVNldFRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0RGF0YVNldERhdGEsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLmRhdGFTZXRUcmVlLnRhYmxlVHJlZURhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICBfc2VsZi5kYXRhU2V0VHJlZS50YWJsZVRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNkYXRhU2V0WlRyZWVVTFwiKSwgX3NlbGYuZGF0YVNldFRyZWUudGFibGVUcmVlU2V0dGluZywgX3NlbGYuZGF0YVNldFRyZWUudGFibGVUcmVlRGF0YSk7XG5cbiAgICAgICAgICBfc2VsZi5kYXRhU2V0VHJlZS50YWJsZVRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVwiZGF0YVNldFpUcmVlVUxcIiBjbGFzcz1cInp0cmVlXCI+PC91bD5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJqcy1kZXNpZ24tY29kZS1mcmFnbWVudFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGpzRWRpdG9ySW5zdGFuY2U6IG51bGxcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBzZXRKU0VkaXRvckluc3RhbmNlOiBmdW5jdGlvbiBzZXRKU0VkaXRvckluc3RhbmNlKG9iaikge1xuICAgICAgdGhpcy5qc0VkaXRvckluc3RhbmNlID0gb2JqO1xuICAgIH0sXG4gICAgZ2V0SnNFZGl0b3JJbnN0OiBmdW5jdGlvbiBnZXRKc0VkaXRvckluc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5qc0VkaXRvckluc3RhbmNlO1xuICAgIH0sXG4gICAgaW5zZXJ0SnM6IGZ1bmN0aW9uIGluc2VydEpzKGpzKSB7XG4gICAgICB2YXIgZG9jID0gdGhpcy5nZXRKc0VkaXRvckluc3QoKS5nZXREb2MoKTtcbiAgICAgIHZhciBjdXJzb3IgPSBkb2MuZ2V0Q3Vyc29yKCk7XG4gICAgICBkb2MucmVwbGFjZVJhbmdlKGpzLCBjdXJzb3IpO1xuICAgIH0sXG4gICAgZm9ybWF0SlM6IGZ1bmN0aW9uIGZvcm1hdEpTKCkge1xuICAgICAgQ29kZU1pcnJvci5jb21tYW5kc1tcInNlbGVjdEFsbFwiXSh0aGlzLmdldEpzRWRpdG9ySW5zdCgpKTtcbiAgICAgIHZhciByYW5nZSA9IHtcbiAgICAgICAgZnJvbTogdGhpcy5nZXRKc0VkaXRvckluc3QoKS5nZXRDdXJzb3IodHJ1ZSksXG4gICAgICAgIHRvOiB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmdldEN1cnNvcihmYWxzZSlcbiAgICAgIH07XG4gICAgICA7XG4gICAgICB0aGlzLmdldEpzRWRpdG9ySW5zdCgpLmF1dG9Gb3JtYXRSYW5nZShyYW5nZS5mcm9tLCByYW5nZS50byk7XG4gICAgfSxcbiAgICBhbGVydERlc2M6IGZ1bmN0aW9uIGFsZXJ0RGVzYygpIHt9LFxuICAgIHJlZlNjcmlwdDogZnVuY3Rpb24gcmVmU2NyaXB0KCkge1xuICAgICAgdmFyIGpzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCIgc3JjPVxcXCIke2NvbnRleHRQYXRofS9VSUNvbXBvbmVudC9UcmVlVGFibGUvSnMvVHJlZVRhYmxlLmpzXFxcIj48L3NjcmlwdD5cIjtcbiAgICAgIHRoaXMuaW5zZXJ0SnMoanMpO1xuICAgIH0sXG4gICAgY2FsbFNlcnZpY2VNZXRob2Q6IGZ1bmN0aW9uIGNhbGxTZXJ2aWNlTWV0aG9kKCkge31cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC13cmFwXCI+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiIEBjbGljaz1cImZvcm1hdEpTXCI+5qC85byP5YyWPC9kaXY+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiPuivtOaYjjwvZGl2PlxcXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIiBAY2xpY2s9XCJyZWZTY3JpcHRcIj7lvJXlhaXohJrmnKw8L2Rpdj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+6I635Y+WVVJM5Y+C5pWwPC9kaXY+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiPuiwg+eUqOacjeWKoeaWueazlTwvZGl2PlxcXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIj7liqDovb3mlbDmja7lrZflhbg8L2Rpdj5cXFxyXG4gICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic3FsLWdlbmVyYWwtZGVzaWduLWNvbXBcIiwge1xuICBwcm9wczogW1wic3FsRGVzaWduZXJIZWlnaHRcIiwgXCJ2YWx1ZVwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3FsVGV4dDogXCJcIixcbiAgICAgIHNlbGVjdGVkSXRlbVZhbHVlOiBcIuivtOaYjlwiLFxuICAgICAgc2VsZlRhYmxlRmllbGRzOiBbXSxcbiAgICAgIHBhcmVudFRhYmxlRmllbGRzOiBbXVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgc3FsVGV4dDogZnVuY3Rpb24gc3FsVGV4dChuZXdWYWwpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgbmV3VmFsKTtcbiAgICB9LFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShuZXdWYWwpIHtcbiAgICAgIHRoaXMuc3FsVGV4dCA9IG5ld1ZhbDtcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5zcWxDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoJChcIiNUZXh0QXJlYVNRTEVkaXRvclwiKVswXSwge1xuICAgICAgbW9kZTogXCJ0ZXh0L3gtc3FsXCIsXG4gICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgIGZvbGRHdXR0ZXI6IHRydWUsXG4gICAgICB0aGVtZTogXCJtb25va2FpXCJcbiAgICB9KTtcbiAgICB0aGlzLnNxbENvZGVNaXJyb3Iuc2V0U2l6ZShcIjEwMCVcIiwgdGhpcy5zcWxEZXNpZ25lckhlaWdodCk7XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5zcWxDb2RlTWlycm9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChjTWlycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhjTWlycm9yLmdldFZhbHVlKCkpO1xuICAgICAgX3NlbGYuc3FsVGV4dCA9IGNNaXJyb3IuZ2V0VmFsdWUoKTtcbiAgICB9KTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcbiAgICAgIHRoaXMuc3FsQ29kZU1pcnJvci5nZXRWYWx1ZSgpO1xuICAgIH0sXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgICB0aGlzLnNxbENvZGVNaXJyb3Iuc2V0VmFsdWUodmFsdWUpO1xuICAgIH0sXG4gICAgc2V0QWJvdXRUYWJsZUZpZWxkczogZnVuY3Rpb24gc2V0QWJvdXRUYWJsZUZpZWxkcyhzZWxmVGFibGVGaWVsZHMsIHBhcmVudFRhYmxlRmllbGRzKSB7XG4gICAgICB0aGlzLnNlbGZUYWJsZUZpZWxkcyA9IHNlbGZUYWJsZUZpZWxkcztcbiAgICAgIHRoaXMucGFyZW50VGFibGVGaWVsZHMgPSBwYXJlbnRUYWJsZUZpZWxkcztcbiAgICB9LFxuICAgIGluc2VydEVudlRvRWRpdG9yOiBmdW5jdGlvbiBpbnNlcnRFbnZUb0VkaXRvcihjb2RlKSB7XG4gICAgICB0aGlzLmluc2VydENvZGVBdEN1cnNvcihjb2RlKTtcbiAgICB9LFxuICAgIGluc2VydEZpZWxkVG9FZGl0b3I6IGZ1bmN0aW9uIGluc2VydEZpZWxkVG9FZGl0b3Ioc291cmNlVHlwZSwgZXZlbnQpIHtcbiAgICAgIHZhciBzb3VyY2VGaWVsZHMgPSBudWxsO1xuXG4gICAgICBpZiAoc291cmNlVHlwZSA9PSBcInNlbGZUYWJsZUZpZWxkc1wiKSB7XG4gICAgICAgIHNvdXJjZUZpZWxkcyA9IHRoaXMuc2VsZlRhYmxlRmllbGRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc291cmNlRmllbGRzID0gdGhpcy5wYXJlbnRUYWJsZUZpZWxkcztcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvdXJjZUZpZWxkc1tpXS5maWVsZE5hbWUgPT0gZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLmluc2VydENvZGVBdEN1cnNvcihzb3VyY2VGaWVsZHNbaV0udGFibGVOYW1lICsgXCIuXCIgKyBzb3VyY2VGaWVsZHNbaV0uZmllbGROYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgaW5zZXJ0Q29kZUF0Q3Vyc29yOiBmdW5jdGlvbiBpbnNlcnRDb2RlQXRDdXJzb3IoY29kZSkge1xuICAgICAgdmFyIGRvYyA9IHRoaXMuc3FsQ29kZU1pcnJvci5nZXREb2MoKTtcbiAgICAgIHZhciBjdXJzb3IgPSBkb2MuZ2V0Q3Vyc29yKCk7XG4gICAgICBkb2MucmVwbGFjZVJhbmdlKGNvZGUsIGN1cnNvcik7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXY+XFxcclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cIlRleHRBcmVhU1FMRWRpdG9yXCI+PC90ZXh0YXJlYT5cXFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0O21hcmdpbi10b3A6IDhweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwIHNpemU9XCJzbWFsbFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi35omA5Zyo57uE57uHSUR9XFwnKVwiPue7hOe7h0lkPC9CdXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBAY2xpY2s9XCJpbnNlcnRFbnZUb0VkaXRvcihcXCcje0FwaVZhci7lvZPliY3nlKjmiLfmiYDlnKjnu4Tnu4flkI3np7B9XFwnKVwiPue7hOe7h+WQjeensDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi3SUR9XFwnKVwiPueUqOaIt0lkPC9CdXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBAY2xpY2s9XCJpbnNlcnRFbnZUb0VkaXRvcihcXCcje0FwaVZhci7lvZPliY3nlKjmiLflkI3np7B9XFwnKVwiPueUqOaIt+WQjeensDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tEYXRlVGltZS7lubTlubTlubTlubQt5pyI5pyILeaXpeaXpX1cXCcpXCI+eXl5eS1NTS1kZDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24+6K+05piOPC9CdXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6IDhweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0O21hcmdpbjogNHB4IDEwcHhcIj7mnKzooajlrZfmrrU8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCBwbGFjZWhvbGRlcj1cIum7mOiupOS9v+eUqElk5a2X5q61XCIgc2l6ZT1cInNtYWxsXCIgc3R5bGU9XCJ3aWR0aDoxNzVweFwiIEBvbi1jaGFuZ2U9XCJpbnNlcnRGaWVsZFRvRWRpdG9yKFxcJ3NlbGZUYWJsZUZpZWxkc1xcJywkZXZlbnQpXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gc2VsZlRhYmxlRmllbGRzXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdDttYXJnaW46IDRweCAxMHB4XCI+54i26KGo5a2X5q61PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnRcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHNpemU9XCJzbWFsbFwiIHN0eWxlPVwid2lkdGg6MTc3cHhcIiBAb24tY2hhbmdlPVwiaW5zZXJ0RmllbGRUb0VkaXRvcihcXCdwYXJlbnRUYWJsZUZpZWxkc1xcJywkZXZlbnQpXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gcGFyZW50VGFibGVGaWVsZHNcIiA6dmFsdWU9XCJpdGVtLmZpZWxkTmFtZVwiIDprZXk9XCJpdGVtLmZpZWxkTmFtZVwiPnt7aXRlbS5maWVsZENhcHRpb259fTwvaS1vcHRpb24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwidGFibGUtcmVsYXRpb24tY29udGVudC1jb21wXCIsIHtcbiAgcHJvcHM6IFtcInJlbGF0aW9uXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzXCIsXG4gICAgICAgIHNhdmVEaWFncmFtOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9UYWJsZVJlbGF0aW9uL1RhYmxlUmVsYXRpb24vU2F2ZURpYWdyYW1cIixcbiAgICAgICAgZ2V0U2luZ2xlRGlhZ3JhbURhdGE6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL1RhYmxlUmVsYXRpb24vVGFibGVSZWxhdGlvbi9HZXREZXRhaWxEYXRhXCIsXG4gICAgICAgIHRhYmxlVmlldzogXCIvSFRNTC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlRWRpdC5odG1sXCJcbiAgICAgIH0sXG4gICAgICB0YWJsZVJlbGF0aW9uRGlhZ3JhbTogbnVsbCxcbiAgICAgIGRpc3BsYXlEZXNjOiB0cnVlLFxuICAgICAgZm9ybWF0SnNvbjogbnVsbCxcbiAgICAgIHJlY29yZElkOiB0aGlzLnJlbGF0aW9uLnJlbGF0aW9uSWRcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgICQodGhpcy4kcmVmcy5yZWxhdGlvbkNvbnRlbnRPdXRlcldyYXApLmNzcyhcImhlaWdodFwiLCBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSAtIDc1KTtcblxuICAgIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpIDwgMTAwMCkge1xuICAgICAgdGhpcy5kaXNwbGF5RGVzYyA9IGZhbHNlO1xuICAgICAgJChcIi50YWJsZS1yZWxhdGlvbi1vcC1idXR0b25zLW91dGVyLXdyYXBcIikuY3NzKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdERpYWdyYW0oKTtcbiAgICB0aGlzLmxvYWRSZWxhdGlvbkRldGFpbERhdGEoKTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICBpZiAod2luZG93LmdvU2FtcGxlcykgZ29TYW1wbGVzKCk7XG4gICAgICB2YXIgJCA9IGdvLkdyYXBoT2JqZWN0Lm1ha2U7XG4gICAgICB2YXIgbXlEaWFncmFtID0gJChnby5EaWFncmFtLCBcInRhYmxlUmVsYXRpb25EaWFncmFtRGl2XCIsIHtcbiAgICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgICBhbGxvd0NvcHk6IGZhbHNlLFxuICAgICAgICBsYXlvdXQ6ICQoZ28uRm9yY2VEaXJlY3RlZExheW91dCksXG4gICAgICAgIFwidW5kb01hbmFnZXIuaXNFbmFibGVkXCI6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdmFyIGJsdWVncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigxNTAsIDE1MCwgMjUwKVwiLFxuICAgICAgICAwLjU6IFwicmdiKDg2LCA4NiwgMTg2KVwiLFxuICAgICAgICAxOiBcInJnYig4NiwgODYsIDE4NilcIlxuICAgICAgfSk7XG4gICAgICB2YXIgZ3JlZW5ncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigxNTgsIDIwOSwgMTU5KVwiLFxuICAgICAgICAxOiBcInJnYig2NywgMTAxLCA1NilcIlxuICAgICAgfSk7XG4gICAgICB2YXIgcmVkZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMjA2LCAxMDYsIDEwMClcIixcbiAgICAgICAgMTogXCJyZ2IoMTgwLCA1NiwgNTApXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIHllbGxvd2dyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDI1NCwgMjIxLCA1MClcIixcbiAgICAgICAgMTogXCJyZ2IoMjU0LCAxODIsIDUwKVwiXG4gICAgICB9KTtcbiAgICAgIHZhciBsaWdodGdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDE6IFwiI0U2RTZGQVwiLFxuICAgICAgICAwOiBcIiNGRkZBRjBcIlxuICAgICAgfSk7XG4gICAgICB2YXIgaXRlbVRlbXBsID0gJChnby5QYW5lbCwgXCJIb3Jpem9udGFsXCIsICQoZ28uU2hhcGUsIHtcbiAgICAgICAgZGVzaXJlZFNpemU6IG5ldyBnby5TaXplKDEwLCAxMClcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwiZmlndXJlXCIsIFwiZmlndXJlXCIpLCBuZXcgZ28uQmluZGluZyhcImZpbGxcIiwgXCJjb2xvclwiKSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIHN0cm9rZTogXCIjMzMzMzMzXCIsXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIlxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwibmFtZVwiKSkpO1xuICAgICAgbXlEaWFncmFtLm5vZGVUZW1wbGF0ZSA9ICQoZ28uTm9kZSwgXCJBdXRvXCIsIHtcbiAgICAgICAgc2VsZWN0aW9uQWRvcm5lZDogdHJ1ZSxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICBsYXlvdXRDb25kaXRpb25zOiBnby5QYXJ0LkxheW91dFN0YW5kYXJkICYgfmdvLlBhcnQuTGF5b3V0Tm9kZVNpemVkLFxuICAgICAgICBmcm9tU3BvdDogZ28uU3BvdC5BbGxTaWRlcyxcbiAgICAgICAgdG9TcG90OiBnby5TcG90LkFsbFNpZGVzLFxuICAgICAgICBpc1NoYWRvd2VkOiB0cnVlLFxuICAgICAgICBzaGFkb3dDb2xvcjogXCIjQzVDMUFBXCJcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwibG9jYXRpb25cIiwgXCJsb2NhdGlvblwiKS5tYWtlVHdvV2F5KCksIG5ldyBnby5CaW5kaW5nKFwiZGVzaXJlZFNpemVcIiwgXCJ2aXNpYmxlXCIsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiBuZXcgZ28uU2l6ZShOYU4sIE5hTik7XG4gICAgICB9KS5vZk9iamVjdChcIkxJU1RcIiksICQoZ28uU2hhcGUsIFwiUmVjdGFuZ2xlXCIsIHtcbiAgICAgICAgZmlsbDogbGlnaHRncmFkLFxuICAgICAgICBzdHJva2U6IFwiIzc1Njg3NVwiLFxuICAgICAgICBzdHJva2VXaWR0aDogM1xuICAgICAgfSksICQoZ28uUGFuZWwsIFwiVGFibGVcIiwge1xuICAgICAgICBtYXJnaW46IDgsXG4gICAgICAgIHN0cmV0Y2g6IGdvLkdyYXBoT2JqZWN0LkZpbGxcbiAgICAgIH0sICQoZ28uUm93Q29sdW1uRGVmaW5pdGlvbiwge1xuICAgICAgICByb3c6IDAsXG4gICAgICAgIHNpemluZzogZ28uUm93Q29sdW1uRGVmaW5pdGlvbi5Ob25lXG4gICAgICB9KSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgcm93OiAwLFxuICAgICAgICBhbGlnbm1lbnQ6IGdvLlNwb3QuQ2VudGVyLFxuICAgICAgICBtYXJnaW46IG5ldyBnby5NYXJnaW4oMCwgMTQsIDAsIDIpLFxuICAgICAgICBmb250OiBcImJvbGQgMTZweCBzYW5zLXNlcmlmXCJcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcImtleVwiKSksICQoXCJQYW5lbEV4cGFuZGVyQnV0dG9uXCIsIFwiTElTVFwiLCB7XG4gICAgICAgIHJvdzogMCxcbiAgICAgICAgYWxpZ25tZW50OiBnby5TcG90LlRvcFJpZ2h0XG4gICAgICB9KSwgJChnby5QYW5lbCwgXCJWZXJ0aWNhbFwiLCB7XG4gICAgICAgIG5hbWU6IFwiTElTVFwiLFxuICAgICAgICByb3c6IDEsXG4gICAgICAgIHBhZGRpbmc6IDMsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5Ub3BMZWZ0LFxuICAgICAgICBkZWZhdWx0QWxpZ25tZW50OiBnby5TcG90LkxlZnQsXG4gICAgICAgIHN0cmV0Y2g6IGdvLkdyYXBoT2JqZWN0Lkhvcml6b250YWwsXG4gICAgICAgIGl0ZW1UZW1wbGF0ZTogaXRlbVRlbXBsXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcIml0ZW1BcnJheVwiLCBcIml0ZW1zXCIpKSkpO1xuICAgICAgbXlEaWFncmFtLmxpbmtUZW1wbGF0ZSA9ICQoZ28uTGluaywge1xuICAgICAgICBzZWxlY3Rpb25BZG9ybmVkOiB0cnVlLFxuICAgICAgICBsYXllck5hbWU6IFwiRm9yZWdyb3VuZFwiLFxuICAgICAgICByZXNoYXBhYmxlOiB0cnVlLFxuICAgICAgICByb3V0aW5nOiBnby5MaW5rLkF2b2lkc05vZGVzLFxuICAgICAgICBjb3JuZXI6IDUsXG4gICAgICAgIGN1cnZlOiBnby5MaW5rLkp1bXBPdmVyXG4gICAgICB9LCAkKGdvLlNoYXBlLCB7XG4gICAgICAgIHN0cm9rZTogXCIjMzAzQjQ1XCIsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAyLjVcbiAgICAgIH0pLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgc3Ryb2tlOiBcIiMxOTY3QjNcIixcbiAgICAgICAgc2VnbWVudEluZGV4OiAwLFxuICAgICAgICBzZWdtZW50T2Zmc2V0OiBuZXcgZ28uUG9pbnQoTmFOLCBOYU4pLFxuICAgICAgICBzZWdtZW50T3JpZW50YXRpb246IGdvLkxpbmsuT3JpZW50VXByaWdodFxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwidGV4dFwiKSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgZm9udDogXCJib2xkIDE0cHggc2Fucy1zZXJpZlwiLFxuICAgICAgICBzdHJva2U6IFwiIzE5NjdCM1wiLFxuICAgICAgICBzZWdtZW50SW5kZXg6IC0xLFxuICAgICAgICBzZWdtZW50T2Zmc2V0OiBuZXcgZ28uUG9pbnQoTmFOLCBOYU4pLFxuICAgICAgICBzZWdtZW50T3JpZW50YXRpb246IGdvLkxpbmsuT3JpZW50VXByaWdodFxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwidG9UZXh0XCIpKSk7XG4gICAgICB2YXIgbm9kZURhdGFBcnJheSA9IFt7XG4gICAgICAgIGtleTogXCJQcm9kdWN0c1wiLFxuICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICBuYW1lOiBcIlByb2R1Y3RJRFwiLFxuICAgICAgICAgIGlza2V5OiB0cnVlLFxuICAgICAgICAgIGZpZ3VyZTogXCJEZWNpc2lvblwiLFxuICAgICAgICAgIGNvbG9yOiB5ZWxsb3dncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIlByb2R1Y3ROYW1lXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJDdWJlMVwiLFxuICAgICAgICAgIGNvbG9yOiBibHVlZ3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJTdXBwbGllcklEXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJEZWNpc2lvblwiLFxuICAgICAgICAgIGNvbG9yOiBcInB1cnBsZVwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkNhdGVnb3J5SURcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IFwicHVycGxlXCJcbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiBcIlN1cHBsaWVyc1wiLFxuICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICBuYW1lOiBcIlN1cHBsaWVySURcIixcbiAgICAgICAgICBpc2tleTogdHJ1ZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogeWVsbG93Z3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJDb21wYW55TmFtZVwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiQ3ViZTFcIixcbiAgICAgICAgICBjb2xvcjogYmx1ZWdyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiQ29udGFjdE5hbWVcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkN1YmUxXCIsXG4gICAgICAgICAgY29sb3I6IGJsdWVncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkFkZHJlc3NcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkN1YmUxXCIsXG4gICAgICAgICAgY29sb3I6IGJsdWVncmFkXG4gICAgICAgIH1dXG4gICAgICB9LCB7XG4gICAgICAgIGtleTogXCJDYXRlZ29yaWVzXCIsXG4gICAgICAgIGl0ZW1zOiBbe1xuICAgICAgICAgIG5hbWU6IFwiQ2F0ZWdvcnlJRFwiLFxuICAgICAgICAgIGlza2V5OiB0cnVlLFxuICAgICAgICAgIGZpZ3VyZTogXCJEZWNpc2lvblwiLFxuICAgICAgICAgIGNvbG9yOiB5ZWxsb3dncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkNhdGVnb3J5TmFtZVwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiQ3ViZTFcIixcbiAgICAgICAgICBjb2xvcjogYmx1ZWdyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiRGVzY3JpcHRpb25cIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkN1YmUxXCIsXG4gICAgICAgICAgY29sb3I6IGJsdWVncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIlBpY3R1cmVcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIlRyaWFuZ2xlVXBcIixcbiAgICAgICAgICBjb2xvcjogcmVkZ3JhZFxuICAgICAgICB9XVxuICAgICAgfSwge1xuICAgICAgICBrZXk6IFwiT3JkZXIgRGV0YWlsc1wiLFxuICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICBuYW1lOiBcIk9yZGVySURcIixcbiAgICAgICAgICBpc2tleTogdHJ1ZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogeWVsbG93Z3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJQcm9kdWN0SURcIixcbiAgICAgICAgICBpc2tleTogdHJ1ZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogeWVsbG93Z3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJVbml0UHJpY2VcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIk1hZ25ldGljRGF0YVwiLFxuICAgICAgICAgIGNvbG9yOiBncmVlbmdyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiUXVhbnRpdHlcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIk1hZ25ldGljRGF0YVwiLFxuICAgICAgICAgIGNvbG9yOiBncmVlbmdyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiRGlzY291bnRcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIk1hZ25ldGljRGF0YVwiLFxuICAgICAgICAgIGNvbG9yOiBncmVlbmdyYWRcbiAgICAgICAgfV1cbiAgICAgIH1dO1xuICAgICAgdmFyIGxpbmtEYXRhQXJyYXkgPSBbe1xuICAgICAgICBmcm9tOiBcIlByb2R1Y3RzXCIsXG4gICAgICAgIHRvOiBcIlN1cHBsaWVyc1wiLFxuICAgICAgICB0ZXh0OiBcIjAuLk5cIixcbiAgICAgICAgdG9UZXh0OiBcIjFcIlxuICAgICAgfSwge1xuICAgICAgICBmcm9tOiBcIlByb2R1Y3RzXCIsXG4gICAgICAgIHRvOiBcIkNhdGVnb3JpZXNcIixcbiAgICAgICAgdGV4dDogXCIwLi5OXCIsXG4gICAgICAgIHRvVGV4dDogXCIxXCJcbiAgICAgIH0sIHtcbiAgICAgICAgZnJvbTogXCJPcmRlciBEZXRhaWxzXCIsXG4gICAgICAgIHRvOiBcIlByb2R1Y3RzXCIsXG4gICAgICAgIHRleHQ6IFwiMC4uTlwiLFxuICAgICAgICB0b1RleHQ6IFwiMVwiXG4gICAgICB9XTtcbiAgICAgIG15RGlhZ3JhbS5tb2RlbCA9ICQoZ28uR3JhcGhMaW5rc01vZGVsLCB7XG4gICAgICAgIGNvcGllc0FycmF5czogdHJ1ZSxcbiAgICAgICAgY29waWVzQXJyYXlPYmplY3RzOiB0cnVlLFxuICAgICAgICBub2RlRGF0YUFycmF5OiBub2RlRGF0YUFycmF5LFxuICAgICAgICBsaW5rRGF0YUFycmF5OiBsaW5rRGF0YUFycmF5XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHNob3dTZWxlY3RUYWJsZURpYWxvZzogZnVuY3Rpb24gc2hvd1NlbGVjdFRhYmxlRGlhbG9nKCkge1xuICAgICAgdGhpcy4kcmVmcy5zZWxlY3RTaW5nbGVUYWJsZURpYWxvZy5iZWdpblNlbGVjdFRhYmxlKCk7XG4gICAgfSxcbiAgICBzaG93U2VsZWN0RmllbGRDb25uZWN0RGlhbG9nOiBmdW5jdGlvbiBzaG93U2VsZWN0RmllbGRDb25uZWN0RGlhbG9nKCkge1xuICAgICAgdmFyIGZyb21UYWJsZUlkID0gXCJcIjtcbiAgICAgIHZhciB0b1RhYmxlSWQgPSBcIlwiO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5zZWxlY3Rpb24uZWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICBpZiAocGFydCBpbnN0YW5jZW9mIGdvLk5vZGUpIHtcbiAgICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgICBmcm9tVGFibGVJZCA9IHBhcnQuZGF0YS50YWJsZUlkO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b1RhYmxlSWQgPSBwYXJ0LmRhdGEudGFibGVJZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRvVGFibGVJZCkge1xuICAgICAgICB0b1RhYmxlSWQgPSBmcm9tVGFibGVJZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZyb21UYWJsZUlkICE9IFwiXCIgJiYgdG9UYWJsZUlkICE9IFwiXCIpIHtcbiAgICAgICAgdGhpcy4kcmVmcy50YWJsZVJlbGF0aW9uQ29ubmVjdFR3b1RhYmxlRGlhbG9nLmJlZ2luU2VsZWN0Q29ubmVjdChmcm9tVGFibGVJZCwgdG9UYWJsZUlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+35YWI6YCJ5LitMuS4quiKgueCuVwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZFRhYmxlVG9EaWFncmFtOiBmdW5jdGlvbiBhZGRUYWJsZVRvRGlhZ3JhbSh0YWJsZURhdGEpIHtcbiAgICAgIHZhciB0YWJsZUlkID0gdGFibGVEYXRhLmlkO1xuICAgICAgdmFyIHRhYmxlSWRzID0gW3RhYmxlSWRdO1xuXG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBpZiAoIXRoaXMudGFibGVJc0V4aXN0SW5EaWFncmFtKHRhYmxlSWQpKSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzLCB7XG4gICAgICAgICAgXCJ0YWJsZUlkc1wiOiB0YWJsZUlkc1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICB2YXIgYWxsRmllbGRzID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICB2YXIgc2luZ2xlVGFibGUgPSByZXN1bHQuZXhLVkRhdGEuVGFibGVzWzBdO1xuICAgICAgICAgICAgdmFyIGFsbEZpZWxkc1N0eWxlID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGFsbEZpZWxkc1tpXS5kaXNwbGF5VGV4dCA9IGFsbEZpZWxkc1tpXS5maWVsZE5hbWUgKyBcIltcIiArIGFsbEZpZWxkc1tpXS5maWVsZENhcHRpb24gKyBcIl1cIjtcbiAgICAgICAgICAgICAgYWxsRmllbGRzU3R5bGUucHVzaChfc2VsZi5yZW5kZXJlckZpZWxkU3R5bGUoYWxsRmllbGRzW2ldKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtb2RlbE5vZGVEYXRhID0ge1xuICAgICAgICAgICAgICB0YWJsZUlkOiB0YWJsZUlkLFxuICAgICAgICAgICAgICBsb2M6IFwiMCAwXCIsXG4gICAgICAgICAgICAgIGZpZWxkczogYWxsRmllbGRzU3R5bGUsXG4gICAgICAgICAgICAgIHRhYmxlRGF0YTogc2luZ2xlVGFibGUsXG4gICAgICAgICAgICAgIHRhYmxlTmFtZTogc2luZ2xlVGFibGUudGFibGVOYW1lLFxuICAgICAgICAgICAgICB0YWJsZUNhcHRpb246IHNpbmdsZVRhYmxlLnRhYmxlQ2FwdGlvbixcbiAgICAgICAgICAgICAgdGFibGVEaXNwbGF5VGV4dDogc2luZ2xlVGFibGUudGFibGVOYW1lICsgXCJbXCIgKyBzaW5nbGVUYWJsZS50YWJsZUNhcHRpb24gKyBcIl1cIixcbiAgICAgICAgICAgICAga2V5OiBzaW5nbGVUYWJsZS50YWJsZUlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBfc2VsZi50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5zdGFydFRyYW5zYWN0aW9uKFwiZmxhc2hcIik7XG5cbiAgICAgICAgICAgIF9zZWxmLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLmFkZE5vZGVEYXRhKG1vZGVsTm9kZURhdGEpO1xuXG4gICAgICAgICAgICBfc2VsZi50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5jb21taXRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor6XnlLvluIPkuK3lt7Lnu4/lrZjlnKjooag6XCIgKyB0YWJsZURhdGEudGV4dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVTZWxlY3Rpb246IGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLmNvbW1hbmRIYW5kbGVyLmNhbkRlbGV0ZVNlbGVjdGlvbigpKSB7XG4gICAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0uY29tbWFuZEhhbmRsZXIuZGVsZXRlU2VsZWN0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbm5lY3RTZWxlY3Rpb25Ob2RlOiBmdW5jdGlvbiBjb25uZWN0U2VsZWN0aW9uTm9kZShjb25uZWN0RGF0YSkge1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5zdGFydFRyYW5zYWN0aW9uKFwiZmxhc2hcIik7XG4gICAgICB2YXIgbGluZURhdGEgPSB7XG4gICAgICAgIGxpbmVJZDogU3RyaW5nVXRpbGl0eS5HdWlkKCksXG4gICAgICAgIGZyb206IGNvbm5lY3REYXRhLmZyb20udGFibGVJZCxcbiAgICAgICAgdG86IGNvbm5lY3REYXRhLnRvLnRhYmxlSWQsXG4gICAgICAgIGZyb21UZXh0OiBjb25uZWN0RGF0YS5mcm9tLnRleHQsXG4gICAgICAgIHRvVGV4dDogY29ubmVjdERhdGEudG8udGV4dFxuICAgICAgfTtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuYWRkTGlua0RhdGEobGluZURhdGEpO1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5jb21taXRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuICAgIH0sXG4gICAgc2F2ZU1vZGVsVG9TZXJ2ZXI6IGZ1bmN0aW9uIHNhdmVNb2RlbFRvU2VydmVyKCkge1xuICAgICAgaWYgKHRoaXMucmVjb3JkSWQpIHtcbiAgICAgICAgdmFyIHNlbmREYXRhID0ge1xuICAgICAgICAgIHJlY29yZElkOiB0aGlzLnJlY29yZElkLFxuICAgICAgICAgIHJlbGF0aW9uQ29udGVudDogSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHRoaXMuZ2V0RGF0YUpzb24oKSksXG4gICAgICAgICAgcmVsYXRpb25EaWFncmFtSnNvbjogdGhpcy5nZXREaWFncmFtSnNvbigpXG4gICAgICAgIH07XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5zYXZlRGlhZ3JhbSwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbml0RGlhZ3JhbTogZnVuY3Rpb24gaW5pdERpYWdyYW0oKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBpZiAod2luZG93LmdvU2FtcGxlcykgZ29TYW1wbGVzKCk7XG4gICAgICB2YXIgJCA9IGdvLkdyYXBoT2JqZWN0Lm1ha2U7XG4gICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtID0gJChnby5EaWFncmFtLCBcInRhYmxlUmVsYXRpb25EaWFncmFtRGl2XCIsIHtcbiAgICAgICAgYWxsb3dEZWxldGU6IHRydWUsXG4gICAgICAgIGFsbG93Q29weTogZmFsc2UsXG4gICAgICAgIGxheW91dDogJChnby5Gb3JjZURpcmVjdGVkTGF5b3V0LCB7XG4gICAgICAgICAgaXNPbmdvaW5nOiBmYWxzZVxuICAgICAgICB9KSxcbiAgICAgICAgXCJ1bmRvTWFuYWdlci5pc0VuYWJsZWRcIjogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB2YXIgdGFibGVSZWxhdGlvbkRpYWdyYW0gPSB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtO1xuICAgICAgdmFyIGxpZ2h0Z3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMTogXCIjRTZFNkZBXCIsXG4gICAgICAgIDA6IFwiI0ZGRkFGMFwiXG4gICAgICB9KTtcbiAgICAgIHZhciBpdGVtVGVtcGwgPSAkKGdvLlBhbmVsLCBcIkhvcml6b250YWxcIiwgJChnby5TaGFwZSwge1xuICAgICAgICBkZXNpcmVkU2l6ZTogbmV3IGdvLlNpemUoMTAsIDEwKVxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJmaWd1cmVcIiwgXCJmaWd1cmVcIiksIG5ldyBnby5CaW5kaW5nKFwiZmlsbFwiLCBcImNvbG9yXCIpKSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgc3Ryb2tlOiBcIiMzMzMzMzNcIixcbiAgICAgICAgZm9udDogXCJib2xkIDE0cHggc2Fucy1zZXJpZlwiXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJkaXNwbGF5VGV4dFwiKSkpO1xuICAgICAgdGFibGVSZWxhdGlvbkRpYWdyYW0ubm9kZVRlbXBsYXRlID0gJChnby5Ob2RlLCBcIkF1dG9cIiwge1xuICAgICAgICBzZWxlY3Rpb25BZG9ybmVkOiB0cnVlLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGxheW91dENvbmRpdGlvbnM6IGdvLlBhcnQuTGF5b3V0U3RhbmRhcmQgJiB+Z28uUGFydC5MYXlvdXROb2RlU2l6ZWQsXG4gICAgICAgIGZyb21TcG90OiBnby5TcG90LkFsbFNpZGVzLFxuICAgICAgICB0b1Nwb3Q6IGdvLlNwb3QuQWxsU2lkZXMsXG4gICAgICAgIGlzU2hhZG93ZWQ6IHRydWUsXG4gICAgICAgIHNoYWRvd0NvbG9yOiBcIiNDNUMxQUFcIixcbiAgICAgICAgZG91YmxlQ2xpY2s6IGZ1bmN0aW9uIGRvdWJsZUNsaWNrKGUsIG5vZGUpIHtcbiAgICAgICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KF9zZWxmLmFjSW50ZXJmYWNlLnRhYmxlVmlldywge1xuICAgICAgICAgICAgXCJvcFwiOiBcInZpZXdcIixcbiAgICAgICAgICAgIFwicmVjb3JkSWRcIjogbm9kZS5kYXRhLnRhYmxlSWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgICAgIHRpdGxlOiBcIuihqOiuvuiuoVwiXG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwibG9jYXRpb25cIiwgXCJsb2NcIiwgZ28uUG9pbnQucGFyc2UpLCBuZXcgZ28uQmluZGluZyhcImRlc2lyZWRTaXplXCIsIFwidmlzaWJsZVwiLCBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gbmV3IGdvLlNpemUoTmFOLCBOYU4pO1xuICAgICAgfSkub2ZPYmplY3QoXCJMSVNUXCIpLCAkKGdvLlNoYXBlLCBcIlJvdW5kZWRSZWN0YW5nbGVcIiwge1xuICAgICAgICBmaWxsOiBsaWdodGdyYWQsXG4gICAgICAgIHN0cm9rZTogXCIjNzU2ODc1XCIsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxXG4gICAgICB9KSwgJChnby5QYW5lbCwgXCJUYWJsZVwiLCB7XG4gICAgICAgIG1hcmdpbjogOCxcbiAgICAgICAgc3RyZXRjaDogZ28uR3JhcGhPYmplY3QuRmlsbFxuICAgICAgfSwgJChnby5Sb3dDb2x1bW5EZWZpbml0aW9uLCB7XG4gICAgICAgIHJvdzogMCxcbiAgICAgICAgc2l6aW5nOiBnby5Sb3dDb2x1bW5EZWZpbml0aW9uLk5vbmVcbiAgICAgIH0pLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICByb3c6IDAsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5DZW50ZXIsXG4gICAgICAgIG1hcmdpbjogbmV3IGdvLk1hcmdpbigwLCAxNCwgMCwgMiksXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNnB4IHNhbnMtc2VyaWZcIlxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwidGFibGVEaXNwbGF5VGV4dFwiKSksICQoXCJQYW5lbEV4cGFuZGVyQnV0dG9uXCIsIFwiTElTVFwiLCB7XG4gICAgICAgIHJvdzogMCxcbiAgICAgICAgYWxpZ25tZW50OiBnby5TcG90LlRvcFJpZ2h0XG4gICAgICB9KSwgJChnby5QYW5lbCwgXCJWZXJ0aWNhbFwiLCB7XG4gICAgICAgIG5hbWU6IFwiTElTVFwiLFxuICAgICAgICByb3c6IDEsXG4gICAgICAgIHBhZGRpbmc6IDMsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5Ub3BMZWZ0LFxuICAgICAgICBkZWZhdWx0QWxpZ25tZW50OiBnby5TcG90LkxlZnQsXG4gICAgICAgIHN0cmV0Y2g6IGdvLkdyYXBoT2JqZWN0Lkhvcml6b250YWwsXG4gICAgICAgIGl0ZW1UZW1wbGF0ZTogaXRlbVRlbXBsXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcIml0ZW1BcnJheVwiLCBcImZpZWxkc1wiKSkpKTtcbiAgICAgIHRhYmxlUmVsYXRpb25EaWFncmFtLmxpbmtUZW1wbGF0ZSA9ICQoZ28uTGluaywge1xuICAgICAgICBzZWxlY3Rpb25BZG9ybmVkOiB0cnVlLFxuICAgICAgICBsYXllck5hbWU6IFwiRm9yZWdyb3VuZFwiLFxuICAgICAgICByZXNoYXBhYmxlOiB0cnVlLFxuICAgICAgICByb3V0aW5nOiBnby5MaW5rLkF2b2lkc05vZGVzLFxuICAgICAgICBjb3JuZXI6IDUsXG4gICAgICAgIGN1cnZlOiBnby5MaW5rLkp1bXBPdmVyXG4gICAgICB9LCAkKGdvLlNoYXBlLCB7XG4gICAgICAgIHN0cm9rZTogXCIjMzAzQjQ1XCIsXG4gICAgICAgIHN0cm9rZVdpZHRoOiAxLjVcbiAgICAgIH0pLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgc3Ryb2tlOiBcIiMxOTY3QjNcIixcbiAgICAgICAgc2VnbWVudEluZGV4OiAwLFxuICAgICAgICBzZWdtZW50T2Zmc2V0OiBuZXcgZ28uUG9pbnQoTmFOLCBOYU4pLFxuICAgICAgICBzZWdtZW50T3JpZW50YXRpb246IGdvLkxpbmsuT3JpZW50VXByaWdodFxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwiZnJvbVRleHRcIikpLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgc3Ryb2tlOiBcIiMxOTY3QjNcIixcbiAgICAgICAgc2VnbWVudEluZGV4OiAtMSxcbiAgICAgICAgc2VnbWVudE9mZnNldDogbmV3IGdvLlBvaW50KE5hTiwgTmFOKSxcbiAgICAgICAgc2VnbWVudE9yaWVudGF0aW9uOiBnby5MaW5rLk9yaWVudFVwcmlnaHRcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcInRvVGV4dFwiKSkpO1xuICAgIH0sXG4gICAgbG9hZFJlbGF0aW9uRGV0YWlsRGF0YTogZnVuY3Rpb24gbG9hZFJlbGF0aW9uRGV0YWlsRGF0YSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRTaW5nbGVEaWFncmFtRGF0YSwge1xuICAgICAgICByZWNvcmRJZDogdGhpcy5yZWNvcmRJZCxcbiAgICAgICAgb3A6IFwiRWRpdFwiXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YS5yZWxhdGlvbkNvbnRlbnQpIHtcbiAgICAgICAgICAgIHZhciBkYXRhSnNvbiA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihyZXN1bHQuZGF0YS5yZWxhdGlvbkNvbnRlbnQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YUpzb24pO1xuXG4gICAgICAgICAgICBfc2VsZi5zZXREYXRhSnNvbihkYXRhSnNvbik7XG5cbiAgICAgICAgICAgIF9zZWxmLmNvbnZlcnRUb0Z1bGxKc29uKGRhdGFKc29uLCBfc2VsZi5kcmF3T2JqSW5EaWFncmFtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgZHJhd09iakluRGlhZ3JhbTogZnVuY3Rpb24gZHJhd09iakluRGlhZ3JhbShmdWxsSnNvbikge1xuICAgICAgdmFyICQgPSBnby5HcmFwaE9iamVjdC5tYWtlO1xuICAgICAgdmFyIGJsdWVncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigxNTAsIDE1MCwgMjUwKVwiLFxuICAgICAgICAwLjU6IFwicmdiKDg2LCA4NiwgMTg2KVwiLFxuICAgICAgICAxOiBcInJnYig4NiwgODYsIDE4NilcIlxuICAgICAgfSk7XG4gICAgICB2YXIgZ3JlZW5ncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigxNTgsIDIwOSwgMTU5KVwiLFxuICAgICAgICAxOiBcInJnYig2NywgMTAxLCA1NilcIlxuICAgICAgfSk7XG4gICAgICB2YXIgcmVkZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMjA2LCAxMDYsIDEwMClcIixcbiAgICAgICAgMTogXCJyZ2IoMTgwLCA1NiwgNTApXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIHllbGxvd2dyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDI1NCwgMjIxLCA1MClcIixcbiAgICAgICAgMTogXCJyZ2IoMjU0LCAxODIsIDUwKVwiXG4gICAgICB9KTtcbiAgICAgIHZhciBsaW5rRGF0YUFycmF5ID0gZnVsbEpzb24ubGluZUxpc3Q7XG4gICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsID0gJChnby5HcmFwaExpbmtzTW9kZWwsIHtcbiAgICAgICAgY29waWVzQXJyYXlzOiB0cnVlLFxuICAgICAgICBjb3BpZXNBcnJheU9iamVjdHM6IHRydWUsXG4gICAgICAgIG5vZGVEYXRhQXJyYXk6IGZ1bGxKc29uLnRhYmxlTGlzdFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3NlbGYudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuc3RhcnRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnVsbEpzb24ubGluZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgbGluZURhdGEgPSBmdWxsSnNvbi5saW5lTGlzdFtpXTtcblxuICAgICAgICAgIF9zZWxmLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLmFkZExpbmtEYXRhKGxpbmVEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9zZWxmLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLmNvbW1pdFRyYW5zYWN0aW9uKFwiZmxhc2hcIik7XG4gICAgICB9LCA1MDApO1xuICAgIH0sXG4gICAgY29udmVydFRvRnVsbEpzb246IGZ1bmN0aW9uIGNvbnZlcnRUb0Z1bGxKc29uKHNpbXBsZUpzb24sIGZ1bmMpIHtcbiAgICAgIHZhciBmdWxsSnNvbiA9IEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHNpbXBsZUpzb24pO1xuICAgICAgdmFyIHRhYmxlSWRzID0gbmV3IEFycmF5KCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2ltcGxlSnNvbi50YWJsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGFibGVJZHMucHVzaChzaW1wbGVKc29uLnRhYmxlTGlzdFtpXS50YWJsZUlkKTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHMsIHtcbiAgICAgICAgXCJ0YWJsZUlkc1wiOiB0YWJsZUlkc1xuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICB2YXIgYWxsRmllbGRzID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgdmFyIGFsbFRhYmxlcyA9IHJlc3VsdC5leEtWRGF0YS5UYWJsZXM7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bGxKc29uLnRhYmxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNpbmdsZVRhYmxlRGF0YSA9IF9zZWxmLmdldFNpbmdsZVRhYmxlRGF0YShhbGxUYWJsZXMsIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS50YWJsZUlkKTtcblxuICAgICAgICAgICAgZnVsbEpzb24udGFibGVMaXN0W2ldLnRhYmxlRGF0YSA9IHNpbmdsZVRhYmxlRGF0YTtcbiAgICAgICAgICAgIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS50YWJsZU5hbWUgPSBzaW5nbGVUYWJsZURhdGEudGFibGVOYW1lO1xuICAgICAgICAgICAgZnVsbEpzb24udGFibGVMaXN0W2ldLnRhYmxlQ2FwdGlvbiA9IHNpbmdsZVRhYmxlRGF0YS50YWJsZUNhcHRpb247XG4gICAgICAgICAgICBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVEaXNwbGF5VGV4dCA9IHNpbmdsZVRhYmxlRGF0YS5kaXNwbGF5VGV4dDtcblxuICAgICAgICAgICAgdmFyIHNpbmdsZVRhYmxlRmllbGRzRGF0YSA9IF9zZWxmLmdldFNpbmdsZVRhYmxlRmllbGRzRGF0YShhbGxGaWVsZHMsIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS50YWJsZUlkKTtcblxuICAgICAgICAgICAgZnVsbEpzb24udGFibGVMaXN0W2ldLmZpZWxkcyA9IHNpbmdsZVRhYmxlRmllbGRzRGF0YTtcbiAgICAgICAgICAgIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS5rZXkgPSBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVJZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfc2VsZi5kcmF3T2JqSW5EaWFncmFtKGZ1bGxKc29uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICBnZXRTaW5nbGVUYWJsZURhdGE6IGZ1bmN0aW9uIGdldFNpbmdsZVRhYmxlRGF0YShhbGxUYWJsZXMsIHRhYmxlSWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsVGFibGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbGxUYWJsZXNbaV0udGFibGVJZCA9PSB0YWJsZUlkKSB7XG4gICAgICAgICAgYWxsVGFibGVzW2ldLmRpc3BsYXlUZXh0ID0gYWxsVGFibGVzW2ldLnRhYmxlTmFtZSArIFwiW1wiICsgYWxsVGFibGVzW2ldLnRhYmxlQ2FwdGlvbiArIFwiXVwiO1xuICAgICAgICAgIHJldHVybiBhbGxUYWJsZXNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBnZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGE6IGZ1bmN0aW9uIGdldFNpbmdsZVRhYmxlRmllbGRzRGF0YShhbGxGaWVsZHMsIHRhYmxlSWQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFsbEZpZWxkc1tpXS5maWVsZFRhYmxlSWQgPT0gdGFibGVJZCkge1xuICAgICAgICAgIGFsbEZpZWxkc1tpXS5kaXNwbGF5VGV4dCA9IGFsbEZpZWxkc1tpXS5maWVsZE5hbWUgKyBcIltcIiArIGFsbEZpZWxkc1tpXS5maWVsZENhcHRpb24gKyBcIl1cIjtcbiAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnJlbmRlcmVyRmllbGRTdHlsZShhbGxGaWVsZHNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgcmVuZGVyZXJGaWVsZFN0eWxlOiBmdW5jdGlvbiByZW5kZXJlckZpZWxkU3R5bGUoZmllbGQpIHtcbiAgICAgIGlmIChmaWVsZC5maWVsZElzUGsgPT0gXCLmmK9cIikge1xuICAgICAgICBmaWVsZC5jb2xvciA9IHRoaXMuZ2V0S2V5RmllbGRCcnVzaCgpO1xuICAgICAgICBmaWVsZC5maWd1cmUgPSBcIkRlY2lzaW9uXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWVsZC5jb2xvciA9IHRoaXMuZ2V0Tm9yRmllbGRCcnVzaCgpO1xuICAgICAgICBmaWVsZC5maWd1cmUgPSBcIkN1YmUxXCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaWVsZDtcbiAgICB9LFxuICAgIGdldEtleUZpZWxkQnJ1c2g6IGZ1bmN0aW9uIGdldEtleUZpZWxkQnJ1c2goKSB7XG4gICAgICByZXR1cm4gZ28uR3JhcGhPYmplY3QubWFrZShnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigyNTQsIDIyMSwgNTApXCIsXG4gICAgICAgIDE6IFwicmdiKDI1NCwgMTgyLCA1MClcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXROb3JGaWVsZEJydXNoOiBmdW5jdGlvbiBnZXROb3JGaWVsZEJydXNoKCkge1xuICAgICAgcmV0dXJuIGdvLkdyYXBoT2JqZWN0Lm1ha2UoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTUwLCAxNTAsIDI1MClcIixcbiAgICAgICAgMC41OiBcInJnYig4NiwgODYsIDE4NilcIixcbiAgICAgICAgMTogXCJyZ2IoODYsIDg2LCAxODYpXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0RGF0YUpzb246IGZ1bmN0aW9uIGdldERhdGFKc29uKCkge1xuICAgICAgdmFyIGRhdGFKc29uID0ge1xuICAgICAgICB0YWJsZUxpc3Q6IFtdLFxuICAgICAgICBsaW5lTGlzdDogW11cbiAgICAgIH07XG4gICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLm5vZGVzLmVhY2goZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgaWYgKHBhcnQgaW5zdGFuY2VvZiBnby5Ob2RlKSB7XG4gICAgICAgICAgZGF0YUpzb24udGFibGVMaXN0LnB1c2goe1xuICAgICAgICAgICAgdGFibGVJZDogcGFydC5kYXRhLnRhYmxlSWQsXG4gICAgICAgICAgICBsb2M6IHBhcnQubG9jYXRpb24ueCArIFwiIFwiICsgcGFydC5sb2NhdGlvbi55XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFydCBpbnN0YW5jZW9mIGdvLkxpbmspIHtcbiAgICAgICAgICBhbGVydChcImxpbmVcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5saW5rcy5lYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIGlmIChwYXJ0IGluc3RhbmNlb2YgZ28uTGluaykge1xuICAgICAgICAgIGRhdGFKc29uLmxpbmVMaXN0LnB1c2goe1xuICAgICAgICAgICAgbGluZUlkOiBwYXJ0LmRhdGEubGluZUlkLFxuICAgICAgICAgICAgZnJvbTogcGFydC5kYXRhLmZyb20sXG4gICAgICAgICAgICB0bzogcGFydC5kYXRhLnRvLFxuICAgICAgICAgICAgZnJvbVRleHQ6IHBhcnQuZGF0YS5mcm9tVGV4dCxcbiAgICAgICAgICAgIHRvVGV4dDogcGFydC5kYXRhLnRvVGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkYXRhSnNvbjtcbiAgICB9LFxuICAgIHNldERhdGFKc29uOiBmdW5jdGlvbiBzZXREYXRhSnNvbihqc29uKSB7XG4gICAgICB0aGlzLmZvcm1hdEpzb24gPSBqc29uO1xuICAgIH0sXG4gICAgZ2V0RGlhZ3JhbUpzb246IGZ1bmN0aW9uIGdldERpYWdyYW1Kc29uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwudG9Kc29uKCk7XG4gICAgfSxcbiAgICBhbGVydERhdGFKc29uOiBmdW5jdGlvbiBhbGVydERhdGFKc29uKCkge1xuICAgICAgdmFyIGRhdGFKc29uID0gdGhpcy5nZXREYXRhSnNvbigpO1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEpzb25Db2RlKGRhdGFKc29uKTtcbiAgICB9LFxuICAgIGFsZXJ0RGlhZ3JhbUpzb246IGZ1bmN0aW9uIGFsZXJ0RGlhZ3JhbUpzb24oKSB7XG4gICAgICB2YXIgZGlhZ3JhbUpzb24gPSB0aGlzLmdldERpYWdyYW1Kc29uKCk7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0SnNvbkNvZGUoZGlhZ3JhbUpzb24pO1xuICAgIH0sXG4gICAgdGFibGVJc0V4aXN0SW5EaWFncmFtOiBmdW5jdGlvbiB0YWJsZUlzRXhpc3RJbkRpYWdyYW0odGFibGVJZCkge1xuICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5ub2Rlcy5lYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIGlmIChwYXJ0IGluc3RhbmNlb2YgZ28uTm9kZSkge1xuICAgICAgICAgIGlmIChwYXJ0LmRhdGEudGFibGVJZCA9PSB0YWJsZUlkKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgZG93bkxvYWRNb2RlbFBORzogZnVuY3Rpb24gZG93bkxvYWRNb2RlbFBORygpIHtcbiAgICAgIGZ1bmN0aW9uIG15Q2FsbGJhY2soYmxvYikge1xuICAgICAgICB2YXIgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgIHZhciBmaWxlbmFtZSA9IFwibXlCbG9iRmlsZTEucG5nXCI7XG4gICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIGEuc3R5bGUgPSBcImRpc3BsYXk6IG5vbmVcIjtcbiAgICAgICAgYS5ocmVmID0gdXJsO1xuICAgICAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG5cbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgd2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iKGJsb2IsIGZpbGVuYW1lKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGEuY2xpY2soKTtcbiAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgYmxvYiA9IHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubWFrZUltYWdlRGF0YSh7XG4gICAgICAgIGJhY2tncm91bmQ6IFwid2hpdGVcIixcbiAgICAgICAgcmV0dXJuVHlwZTogXCJibG9iXCIsXG4gICAgICAgIHNjYWxlOiAxLFxuICAgICAgICBjYWxsYmFjazogbXlDYWxsYmFja1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwicmVsYXRpb25Db250ZW50T3V0ZXJXcmFwXFxcIiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tY29udGVudC1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLWNvbnRlbnQtaGVhZGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLWRlc2Mtb3V0ZXItd3JhcFxcXCIgdi1pZj1cXFwiZGlzcGxheURlc2NcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1yZWxhdGlvbi1kZXNjXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTU5MDdcXHU2Q0U4XFx1RkYxQXt7cmVsYXRpb24ucmVsYXRpb25EZXNjfX1cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tb3AtYnV0dG9ucy1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tb3AtYnV0dG9ucy1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXAgc2hhcGU9XFxcImNpcmNsZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwic2hvd1NlbGVjdFRhYmxlRGlhbG9nXFxcIiB0eXBlPVxcXCJzdWNjZXNzXFxcIiBpY29uPVxcXCJtZC1hZGRcXFwiPjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwic2hvd1NlbGVjdEZpZWxkQ29ubmVjdERpYWxvZ1xcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibG9nby1zdGVhbVxcXCI+XFx1OEZERVxcdTYzQTU8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBkaXNhYmxlZCB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1yZXR1cm4tbGVmdFxcXCI+XFx1NUYxNVxcdTUxNjU8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBkaXNhYmxlZCB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1xci1zY2FubmVyXFxcIj5cXHU1MTY4XFx1NUM0RjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIGRpc2FibGVkIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcIm1kLWdpdC1jb21wYXJlXFxcIj5cXHU1Mzg2XFx1NTNGMjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiYWxlcnREYXRhSnNvblxcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtY29kZVxcXCI+XFx1NjU3MFxcdTYzNkVKc29uPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJhbGVydERpYWdyYW1Kc29uXFxcIiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1jb2RlLXdvcmtpbmdcXFwiPlxcdTU2RkVcXHU1RjYySnNvbjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiZG93bkxvYWRNb2RlbFBOR1xcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtY2xvdWQtZG93bmxvYWRcXFwiPlxcdTRFMEJcXHU4RjdEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJzYXZlTW9kZWxUb1NlcnZlclxcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibG9nby1pbnN0YWdyYW1cXFwiPlxcdTRGRERcXHU1QjU4PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJkZWxldGVTZWxlY3Rpb25cXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1yZWxhdGlvbi1jb250ZW50LXdyYXBcXFwiIGlkPVxcXCJ0YWJsZVJlbGF0aW9uRGlhZ3JhbURpdlxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0LXNpbmdsZS10YWJsZS1kaWFsb2cgcmVmPVxcXCJzZWxlY3RTaW5nbGVUYWJsZURpYWxvZ1xcXCIgQG9uLXNlbGVjdGVkLXRhYmxlPVxcXCJhZGRUYWJsZVRvRGlhZ3JhbVxcXCI+PC9zZWxlY3Qtc2luZ2xlLXRhYmxlLWRpYWxvZz5cXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZS1yZWxhdGlvbi1jb25uZWN0LXR3by10YWJsZS1kaWFsb2cgcmVmPVxcXCJ0YWJsZVJlbGF0aW9uQ29ubmVjdFR3b1RhYmxlRGlhbG9nXFxcIiBAb24tY29tcGxldGVkLWNvbm5lY3Q9XFxcImNvbm5lY3RTZWxlY3Rpb25Ob2RlXFxcIj48L3RhYmxlLXJlbGF0aW9uLWNvbm5lY3QtdHdvLXRhYmxlLWRpYWxvZz5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LWRlcGFydG1lbnQtdXNlci1kaWFsb2dcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXREZXBhcnRtZW50VHJlZURhdGE6IFwiL1BsYXRGb3JtUmVzdC9TU08vRGVwYXJ0bWVudC9HZXREZXBhcnRtZW50c0J5T3JnYW5JZFwiLFxuICAgICAgICBkZXBhcnRtZW50RWRpdFZpZXc6IFwiL0hUTUwvU1NPL0RlcGFydG1lbnQvRGVwYXJ0bWVudEVkaXQuaHRtbFwiLFxuICAgICAgICBkZWxldGVEZXBhcnRtZW50OiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0RlcGFydG1lbnQvRGVsZXRlXCIsXG4gICAgICAgIG1vdmVEZXBhcnRtZW50OiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0RlcGFydG1lbnQvTW92ZVwiLFxuICAgICAgICBsaXN0RWRpdFZpZXc6IFwiL0hUTUwvU1NPL0RlcGFydG1lbnQvRGVwYXJ0bWVudFVzZXJFZGl0Lmh0bWxcIixcbiAgICAgICAgcmVsb2FkTGlzdERhdGE6IFwiL1BsYXRGb3JtUmVzdC9TU08vRGVwYXJ0bWVudFVzZXIvR2V0TGlzdERhdGFcIixcbiAgICAgICAgZGVsZXRlTGlzdFJlY29yZDogXCIvUGxhdEZvcm1SZXN0L1NTTy9EZXBhcnRtZW50VXNlci9EZWxldGVcIixcbiAgICAgICAgbGlzdFN0YXR1c0NoYW5nZTogXCIvUGxhdEZvcm1SZXN0L1NTTy9EZXBhcnRtZW50VXNlci9TdGF0dXNDaGFuZ2VcIixcbiAgICAgICAgbGlzdE1vdmU6IFwiL1BsYXRGb3JtUmVzdC9TU08vRGVwYXJ0bWVudFVzZXIvTW92ZVwiXG4gICAgICB9LFxuICAgICAgdHJlZUlkRmllbGROYW1lOiBcImRlcHRJZFwiLFxuICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgIHRyZWVTZWxlY3RlZE5vZGU6IG51bGwsXG4gICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICBhc3luYzoge1xuICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICB1cmw6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgbmFtZTogXCJkZXB0TmFtZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBpZEtleTogXCJkZXB0SWRcIixcbiAgICAgICAgICAgIHBJZEtleTogXCJkZXB0UGFyZW50SWRcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuX2hvc3Q7XG5cbiAgICAgICAgICAgIF9zZWxmLnRyZWVOb2RlU2VsZWN0ZWQoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHtcbiAgICAgICAgICAgIGFwcExpc3QudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaWRGaWVsZE5hbWU6IFwiRFVfSURcIixcbiAgICAgIHNlYXJjaENvbmRpdGlvbjoge1xuICAgICAgICB1c2VyTmFtZToge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLkxpa2VTdHJpbmdUeXBlXG4gICAgICAgIH0sXG4gICAgICAgIGFjY291bnQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5MaWtlU3RyaW5nVHlwZVxuICAgICAgICB9LFxuICAgICAgICB1c2VyUGhvbmVOdW1iZXI6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5MaWtlU3RyaW5nVHlwZVxuICAgICAgICB9LFxuICAgICAgICBkZXBhcnRtZW50SWQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH0sXG4gICAgICAgIHNlYXJjaEluQUxMOiB7XG4gICAgICAgICAgdmFsdWU6IFwi5ZCmXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn55So5oi35ZCNJyxcbiAgICAgICAga2V5OiAnVVNFUl9OQU1FJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfmiYvmnLrlj7fnoIEnLFxuICAgICAgICBrZXk6ICdVU0VSX1BIT05FX05VTUJFUicsXG4gICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57uE57uH5py65p6EJyxcbiAgICAgICAga2V5OiAnT1JHQU5fTkFNRScsXG4gICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn6YOo6ZeoJyxcbiAgICAgICAga2V5OiAnREVQVF9OQU1FJyxcbiAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfkuLvlsZ4nLFxuICAgICAgICBrZXk6ICdEVV9JU19NQUlOJyxcbiAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiAxMixcbiAgICAgIHBhZ2VOdW06IDEsXG4gICAgICBsaXN0SGVpZ2h0OiAyNzBcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHZhciBvbGRTZWxlY3RlZE9yZ2FuSWQgPSBDb29raWVVdGlsaXR5LkdldENvb2tpZShcIkRNT1JHU0lEXCIpO1xuXG4gICAgaWYgKG9sZFNlbGVjdGVkT3JnYW5JZCkge1xuICAgICAgdGhpcy4kcmVmcy5zZWxlY3RPcmdhbkNvbXAuc2V0T2xkU2VsZWN0ZWRPcmdhbihvbGRTZWxlY3RlZE9yZ2FuSWQpO1xuICAgICAgdGhpcy5pbml0VHJlZShvbGRTZWxlY3RlZE9yZ2FuSWQpO1xuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGNoYW5nZU9yZ2FuOiBmdW5jdGlvbiBjaGFuZ2VPcmdhbihvcmdhbkRhdGEpIHtcbiAgICAgIENvb2tpZVV0aWxpdHkuU2V0Q29va2llMU1vbnRoKFwiRE1PUkdTSURcIiwgb3JnYW5EYXRhLm9yZ2FuSWQpO1xuICAgICAgdGhpcy5pbml0VHJlZShvcmdhbkRhdGEub3JnYW5JZCk7XG4gICAgICB0aGlzLmNsZWFyU2VhcmNoQ29uZGl0aW9uKCk7XG4gICAgICB0aGlzLnRhYmxlRGF0YSA9IFtdO1xuICAgIH0sXG4gICAgaW5pdFRyZWU6IGZ1bmN0aW9uIGluaXRUcmVlKG9yZ2FuSWQpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXREZXBhcnRtZW50VHJlZURhdGEsIHtcbiAgICAgICAgXCJvcmdhbklkXCI6IG9yZ2FuSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuJHJlZnMuelRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1kZXBhcnRtZW50LXVzZXItZGlhbG9nLVwiICsgU3RyaW5nVXRpbGl0eS5HdWlkKCkpO1xuXG4gICAgICAgICAgX3NlbGYudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKF9zZWxmLiRyZWZzLnpUcmVlVUwpLCBfc2VsZi50cmVlU2V0dGluZywgcmVzdWx0LmRhdGEpO1xuXG4gICAgICAgICAgX3NlbGYudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG5cbiAgICAgICAgICBfc2VsZi50cmVlT2JqLl9ob3N0ID0gX3NlbGY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIHRyZWVOb2RlU2VsZWN0ZWQ6IGZ1bmN0aW9uIHRyZWVOb2RlU2VsZWN0ZWQoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgIHRoaXMudHJlZVNlbGVjdGVkTm9kZSA9IHRyZWVOb2RlO1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gbnVsbDtcbiAgICAgIHRoaXMucGFnZU51bSA9IDE7XG4gICAgICB0aGlzLmNsZWFyU2VhcmNoQ29uZGl0aW9uKCk7XG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5kZXBhcnRtZW50SWQudmFsdWUgPSB0aGlzLnRyZWVTZWxlY3RlZE5vZGVbdGhpcy50cmVlSWRGaWVsZE5hbWVdO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBhZGREZXBhcnRtZW50OiBmdW5jdGlvbiBhZGREZXBhcnRtZW50KCkge1xuICAgICAgaWYgKHRoaXMudHJlZVNlbGVjdGVkTm9kZSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5kZXBhcnRtZW50RWRpdFZpZXcsIHtcbiAgICAgICAgICBcIm9wXCI6IFwiYWRkXCIsXG4gICAgICAgICAgXCJwYXJlbnRJZFwiOiB0aGlzLnRyZWVTZWxlY3RlZE5vZGVbYXBwTGlzdC50cmVlSWRGaWVsZE5hbWVdXG4gICAgICAgIH0pO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgICB0aXRsZTogXCLpg6jpl6jnrqHnkIZcIlxuICAgICAgICB9LCAzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqeeItuiKgueCuSFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlZGl0RGVwYXJ0bWVudDogZnVuY3Rpb24gZWRpdERlcGFydG1lbnQoKSB7XG4gICAgICBpZiAodGhpcy50cmVlU2VsZWN0ZWROb2RlICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmRlcGFydG1lbnRFZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJ1cGRhdGVcIixcbiAgICAgICAgICBcInJlY29yZElkXCI6IHRoaXMudHJlZVNlbGVjdGVkTm9kZVthcHBMaXN0LnRyZWVJZEZpZWxkTmFtZV1cbiAgICAgICAgfSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICAgIHRpdGxlOiBcIumDqOmXqOeuoeeQhlwiXG4gICAgICAgIH0sIDMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup6ZyA6KaB57yW6L6R55qE6IqC54K5IVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHZpZXdEZXBhcnRtZW50OiBmdW5jdGlvbiB2aWV3RGVwYXJ0bWVudCgpIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5kZXBhcnRtZW50RWRpdFZpZXcsIHtcbiAgICAgICAgXCJvcFwiOiBcInZpZXdcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiB0aGlzLnRyZWVTZWxlY3RlZE5vZGVbYXBwTGlzdC50cmVlSWRGaWVsZE5hbWVdXG4gICAgICB9KTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogXCLpg6jpl6jnrqHnkIZcIlxuICAgICAgfSwgMyk7XG4gICAgfSxcbiAgICBkZWxEZXBhcnRtZW50OiBmdW5jdGlvbiBkZWxEZXBhcnRtZW50KCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgdmFyIHJlY29yZElkID0gdGhpcy50cmVlU2VsZWN0ZWROb2RlW2FwcExpc3QudHJlZUlkRmllbGROYW1lXTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k6KaB5Yig6Zmk6YCJ5a6a55qE6IqC54K55ZCX77yfXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgQWpheFV0aWxpdHkuRGVsZXRlKF9zZWxmLmFjSW50ZXJmYWNlLmRlbGV0ZURlcGFydG1lbnQsIHtcbiAgICAgICAgICByZWNvcmRJZDogcmVjb3JkSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGFwcExpc3QudHJlZU9iai5yZW1vdmVOb2RlKGFwcExpc3QudHJlZVNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICAgIGFwcExpc3QudHJlZVNlbGVjdGVkTm9kZSA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIG1vdmVEZXBhcnRtZW50OiBmdW5jdGlvbiBtb3ZlRGVwYXJ0bWVudCh0eXBlKSB7XG4gICAgICBpZiAodGhpcy50cmVlU2VsZWN0ZWROb2RlICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHJlY29yZElkID0gdGhpcy50cmVlU2VsZWN0ZWROb2RlW2FwcExpc3QudHJlZUlkRmllbGROYW1lXTtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLm1vdmVEZXBhcnRtZW50LCB7XG4gICAgICAgICAgcmVjb3JkSWQ6IHJlY29yZElkLFxuICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGlmICh0eXBlID09IFwiZG93blwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFwcExpc3QudHJlZVNlbGVjdGVkTm9kZS5nZXROZXh0Tm9kZSgpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGFwcExpc3QudHJlZU9iai5tb3ZlTm9kZShhcHBMaXN0LnRyZWVTZWxlY3RlZE5vZGUuZ2V0TmV4dE5vZGUoKSwgYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlLCBcIm5leHRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlLmdldFByZU5vZGUoKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBhcHBMaXN0LnRyZWVPYmoubW92ZU5vZGUoYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlLmdldFByZU5vZGUoKSwgYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlLCBcInByZXZcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6npnIDopoHnvJbovpHnmoToioLngrkhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbmV3VHJlZU5vZGU6IGZ1bmN0aW9uIG5ld1RyZWVOb2RlKG5ld05vZGVEYXRhKSB7XG4gICAgICB2YXIgc2lsZW50ID0gZmFsc2U7XG4gICAgICBhcHBMaXN0LnRyZWVPYmouYWRkTm9kZXModGhpcy50cmVlU2VsZWN0ZWROb2RlLCBuZXdOb2RlRGF0YSwgc2lsZW50KTtcbiAgICB9LFxuICAgIHVwZGF0ZU5vZGU6IGZ1bmN0aW9uIHVwZGF0ZU5vZGUobmV3Tm9kZURhdGEpIHtcbiAgICAgIHRoaXMudHJlZVNlbGVjdGVkTm9kZSA9ICQuZXh0ZW5kKHRydWUsIHRoaXMudHJlZVNlbGVjdGVkTm9kZSwgbmV3Tm9kZURhdGEpO1xuICAgICAgYXBwTGlzdC50cmVlT2JqLnVwZGF0ZU5vZGUodGhpcy50cmVlU2VsZWN0ZWROb2RlKTtcbiAgICB9LFxuICAgIGNsZWFyU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBjbGVhclNlYXJjaENvbmRpdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnNlYXJjaENvbmRpdGlvbikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbltrZXldLnZhbHVlID0gXCJcIjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb25bXCJzZWFyY2hJbkFMTFwiXS52YWx1ZSA9IFwi5ZCmXCI7XG4gICAgfSxcbiAgICBzZWxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZShzZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uUm93cyA9IHNlbGVjdGlvbjtcbiAgICB9LFxuICAgIHJlbG9hZERhdGE6IGZ1bmN0aW9uIHJlbG9hZERhdGEoKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoKHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkTGlzdERhdGEsIHRoaXMucGFnZU51bSwgdGhpcy5wYWdlU2l6ZSwgdGhpcy5zZWFyY2hDb25kaXRpb24sIHRoaXMsIHRoaXMuaWRGaWVsZE5hbWUsIHRydWUsIG51bGwsIGZhbHNlKTtcbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMudHJlZVNlbGVjdGVkTm9kZSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5saXN0RWRpdFZpZXcsIHtcbiAgICAgICAgICBcIm9wXCI6IFwiYWRkXCIsXG4gICAgICAgICAgXCJkZXBhcnRtZW50SWRcIjogdGhpcy50cmVlU2VsZWN0ZWROb2RlW2FwcExpc3QudHJlZUlkRmllbGROYW1lXVxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgICAgdGl0bGU6IFwi6YOo6Zeo55So5oi3566h55CGXCJcbiAgICAgICAgfSwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nliIbnu4QhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChyZWNvcmRJZCkge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmxpc3RFZGl0Vmlldywge1xuICAgICAgICBcIm9wXCI6IFwidXBkYXRlXCIsXG4gICAgICAgIFwicmVjb3JkSWRcIjogcmVjb3JkSWRcbiAgICAgIH0pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumDqOmXqOeUqOaIt+euoeeQhlwiXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIHZpZXc6IGZ1bmN0aW9uIHZpZXcocmVjb3JkSWQpIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5saXN0RWRpdFZpZXcsIHtcbiAgICAgICAgXCJvcFwiOiBcInZpZXdcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZFxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgdGl0bGU6IFwi6YOo6Zeo55So5oi3566h55CGXCJcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiBkZWwocmVjb3JkSWQpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlRGVsZXRlUm93KHRoaXMuYWNJbnRlcmZhY2UuZGVsZXRlTGlzdFJlY29yZCwgcmVjb3JkSWQsIGFwcExpc3QpO1xuICAgIH0sXG4gICAgc3RhdHVzRW5hYmxlOiBmdW5jdGlvbiBzdGF0dXNFbmFibGUoc3RhdHVzTmFtZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh0aGlzLmFjSW50ZXJmYWNlLmxpc3RTdGF0dXNDaGFuZ2UsIHRoaXMuc2VsZWN0aW9uUm93cywgYXBwTGlzdC5pZEZpZWxkTmFtZSwgc3RhdHVzTmFtZSwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKHR5cGUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld01vdmVGYWNlKHRoaXMuYWNJbnRlcmZhY2UubGlzdE1vdmUsIHRoaXMuc2VsZWN0aW9uUm93cywgYXBwTGlzdC5pZEZpZWxkTmFtZSwgdHlwZSwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBtb3ZlVG9Bbm90aGVyRGVwYXJ0bWVudDogZnVuY3Rpb24gbW92ZVRvQW5vdGhlckRlcGFydG1lbnQoKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Sb3dzICE9IG51bGwgJiYgdGhpcy5zZWxlY3Rpb25Sb3dzLmxlbmd0aCA+IDAgJiYgdGhpcy5zZWxlY3Rpb25Sb3dzLmxlbmd0aCA9PSAxKSB7fSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5Lit6ZyA6KaB5pON5L2c55qE6K6w5b2V77yM5q+P5qyh5Y+q6IO96YCJ5Lit5LiA6KGMIVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcnRUaW1lSm9iOiBmdW5jdGlvbiBwYXJ0VGltZUpvYigpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblJvd3MgIT0gbnVsbCAmJiB0aGlzLnNlbGVjdGlvblJvd3MubGVuZ3RoID4gMCAmJiB0aGlzLnNlbGVjdGlvblJvd3MubGVuZ3RoID09IDEpIHt9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInkuK3pnIDopoHmk43kvZznmoTorrDlvZXvvIzmr4/mrKHlj6rog73pgInkuK3kuIDooYwhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2hhbmdlUGFnZTogZnVuY3Rpb24gY2hhbmdlUGFnZShwYWdlTnVtKSB7XG4gICAgICB0aGlzLnBhZ2VOdW0gPSBwYWdlTnVtO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBudWxsO1xuICAgIH0sXG4gICAgc2VhcmNoOiBmdW5jdGlvbiBzZWFyY2goKSB7XG4gICAgICB0aGlzLnBhZ2VOdW0gPSAxO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3QoKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0RGVwYXJ0bWVudFVzZXJNb2RlbERpYWxvZ1dyYXA7XG4gICAgICB2YXIgZGlhbG9nSGVpZ2h0ID0gNDYwO1xuXG4gICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA3MDApIHtcbiAgICAgICAgZGlhbG9nSGVpZ2h0ID0gNjYwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RIZWlnaHQgPSBkaWFsb2dIZWlnaHQgLSAyMzA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDk3MCxcbiAgICAgICAgaGVpZ2h0OiBkaWFsb2dIZWlnaHQsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqee7hOe7h+acuuaehFwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gY29tcGxldGVkKCkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5zZWxlY3Rpb25Sb3dzKTtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUm93cykge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1jb21wbGV0ZWQnLCB0aGlzLnNlbGVjdGlvblJvd3MpO1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7flhYjpgInkuK3kurrlkZghXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3REZXBhcnRtZW50VXNlck1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwic2VsZWN0RGVwYXJ0bWVudFVzZXJNb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtd3JhcCBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LTJjb2x1bW5cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxlZnQtb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcIndpZHRoOiAxODBweDt0b3A6IDEwcHg7bGVmdDogMTBweDtib3R0b206IDU1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0LW9yZ2FuLXNpbmdsZS1jb21wIEBvbi1zZWxlY3RlZC1vcmdhbj1cXFwiY2hhbmdlT3JnYW5cXFwiIHJlZj1cXFwic2VsZWN0T3JnYW5Db21wXFxcIj48L3NlbGVjdC1vcmdhbi1zaW5nbGUtY29tcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5uZXItd3JhcFxcXCIgc3R5bGU9XFxcInBvc2l0aW9uOmFic29sdXRlO3RvcDogMzBweDtib3R0b206IDEwcHg7aGVpZ2h0OiBhdXRvO292ZXJmbG93OiBhdXRvXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwielRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJpZ2h0LW91dGVyLXdyYXAgaXYtbGlzdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nOiAxMHB4O2xlZnQ6IDIwMHB4O3RvcDogMTBweDtyaWdodDogMTBweDtib3R0b206IDU1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XFxcImxzLXRhYmxlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA4MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDgwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogODVweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA4MHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cXFwibHMtdGFibGUtcm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTc1MjhcXHU2MjM3XFx1NTQwRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJzZWFyY2hDb25kaXRpb24udXNlck5hbWUudmFsdWVcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTYyNEJcXHU2NzNBXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcInNlYXJjaENvbmRpdGlvbi51c2VyUGhvbmVOdW1iZXIudmFsdWVcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTUxNjhcXHU1QzQwXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVxcXCJzZWFyY2hDb25kaXRpb24uc2VhcmNoSW5BTEwudmFsdWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiXFx1NjYyRlxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJcXHU1NDI2XFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzZWFyY2hcXFwiPjxJY29uIHR5cGU9XFxcImFuZHJvaWQtc2VhcmNoXFxcIj48L0ljb24+IFxcdTY3RTVcXHU4QkUyIDwvaS1idXR0b24+PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XFxcImxpc3RIZWlnaHRcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJ0YWJsZURhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XFxcInNlbGVjdGlvbkNoYW5nZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogcmlnaHQ7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYWdlIEBvbi1jaGFuZ2U9XFxcImNoYW5nZVBhZ2VcXFwiIDpjdXJyZW50LnN5bmM9XFxcInBhZ2VOdW1cXFwiIDpwYWdlLXNpemU9XFxcInBhZ2VTaXplXFxcIiBzaG93LXRvdGFsXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dG90YWw9XFxcInBhZ2VUb3RhbFxcXCI+PC9wYWdlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJib3R0b206IDEycHg7cmlnaHQ6IDEycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNvbXBsZXRlZCgpXFxcIiBpY29uPVxcXCJtZC1jaGVja21hcmtcXFwiPlxcdTc4NkVcXHU4QkE0PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj5cXHU1MTczXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1zaW5nbGUtdGFibGUtZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0VGFibGVEYXRhVXJsOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGb3JaVHJlZU5vZGVMaXN0XCIsXG4gICAgICAgIGdldFNpbmdsZU9yZ2FuRGF0YVVybDogXCIvUGxhdEZvcm1SZXN0L1NTTy9Pcmdhbi9HZXREZXRhaWxEYXRhXCJcbiAgICAgIH0sXG4gICAgICBqc0VkaXRvckluc3RhbmNlOiBudWxsLFxuICAgICAgdGFibGVUcmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICBpZiAodHJlZU5vZGUubm9kZVR5cGVOYW1lID09IFwiVGFibGVcIikge1xuICAgICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkVGFibGUoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkVGFibGUoZXZlbnQsIHRyZWVJZCwgbnVsbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVEYXRhOiBudWxsLFxuICAgICAgICBjbGlja05vZGU6IG51bGxcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZFRhYmxlRGF0YTogbnVsbFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc2VsZWN0VGFibGVNb2RlbERpYWxvZ1dyYXApO1xuICAgIH0sXG4gICAgYmVnaW5TZWxlY3RUYWJsZTogZnVuY3Rpb24gYmVnaW5TZWxlY3RUYWJsZSgpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3RUYWJsZU1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHRoaXMuZ2V0VGFibGVEYXRhSW5pdFRyZWUoKTtcbiAgICAgIHZhciBoZWlnaHQgPSA0NTA7XG5cbiAgICAgIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA+IDU1MCkge1xuICAgICAgICBoZWlnaHQgPSA2MDA7XG4gICAgICB9XG5cbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNTcwLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup6KGoXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0VGFibGVEYXRhSW5pdFRyZWU6IGZ1bmN0aW9uIGdldFRhYmxlRGF0YUluaXRUcmVlKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYudGFibGVUcmVlLnRyZWVEYXRhID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICBfc2VsZi4kcmVmcy50YWJsZVpUcmVlVUwuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzZWxlY3QtdGFibGUtc2luZ2xlLWNvbXAtXCIgKyBTdHJpbmdVdGlsaXR5Lkd1aWQoKSk7XG5cbiAgICAgICAgICBfc2VsZi50YWJsZVRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKF9zZWxmLiRyZWZzLnRhYmxlWlRyZWVVTCksIF9zZWxmLnRhYmxlVHJlZS50cmVlU2V0dGluZywgX3NlbGYudGFibGVUcmVlLnRyZWVEYXRhKTtcblxuICAgICAgICAgIF9zZWxmLnRhYmxlVHJlZS50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcblxuICAgICAgICAgIF9zZWxmLnRhYmxlVHJlZS50cmVlT2JqLl9ob3N0ID0gX3NlbGY7XG4gICAgICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKF9zZWxmLnRhYmxlVHJlZS50cmVlT2JqLCBfc2VsZi4kcmVmcy50eHRfdGFibGVfc2VhcmNoX3RleHQuJHJlZnMuaW5wdXQsIG51bGwsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIHNlbGVjdGVkVGFibGU6IGZ1bmN0aW9uIHNlbGVjdGVkVGFibGUoZXZlbnQsIHRyZWVJZCwgdGFibGVEYXRhKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkVGFibGVEYXRhID0gdGFibGVEYXRhO1xuICAgIH0sXG4gICAgY29tcGxldGVkOiBmdW5jdGlvbiBjb21wbGV0ZWQoKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZFRhYmxlRGF0YSkge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC10YWJsZScsIHRoaXMuc2VsZWN0ZWRUYWJsZURhdGEpO1xuICAgICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+mAieaLqeihqCFcIik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwic2VsZWN0VGFibGVNb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtd3JhcCBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtc291cmNlLXdyYXAgYzEtc2VsZWN0LW1vZGVsLXNvdXJjZS1oYXMtYnV0dG9ucy13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XFxcImlucHV0X2JvcmRlcl9ib3R0b21cXFwiIHJlZj1cXFwidHh0X3RhYmxlX3NlYXJjaF90ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1OEJGN1xcdThGOTNcXHU1MTY1XFx1ODg2OFxcdTU0MERcXHU2MjE2XFx1ODAwNVxcdTY4MDdcXHU5ODk4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5uZXItd3JhcCBkaXYtY3VzdG9tLXNjcm9sbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCByZWY9XFxcInRhYmxlWlRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcImJvdHRvbTogMTJweDtyaWdodDogMTJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiY29tcGxldGVkKClcXFwiIGljb249XFxcIm1kLWNoZWNrbWFya1xcXCI+XFx1Nzg2RVxcdThCQTQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiPlxcdTUxNzNcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJ0YWJsZS1yZWxhdGlvbi1jb25uZWN0LXR3by10YWJsZS1kaWFsb2dcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzXCJcbiAgICAgIH0sXG4gICAgICBmcm9tVGFibGVGaWVsZDoge1xuICAgICAgICBmaWVsZERhdGE6IFtdLFxuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5a2X5q615ZCN56ewJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZE5hbWUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+agh+mimCcsXG4gICAgICAgICAga2V5OiAnZmllbGRDYXB0aW9uJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHRvVGFibGVGaWVsZDoge1xuICAgICAgICBmaWVsZERhdGE6IFtdLFxuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5a2X5q615ZCN56ewJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZE5hbWUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+agh+mimCcsXG4gICAgICAgICAga2V5OiAnZmllbGRDYXB0aW9uJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIGRpYWxvZ0hlaWdodDogMCxcbiAgICAgIHJlc3VsdERhdGE6IHtcbiAgICAgICAgZnJvbToge1xuICAgICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgICAgdGV4dDogXCJcIlxuICAgICAgICB9LFxuICAgICAgICB0bzoge1xuICAgICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgICAgdGV4dDogXCJcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5jb25uZWN0VGFibGVGaWVsZE1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBjb21wbGV0ZWQ6IGZ1bmN0aW9uIGNvbXBsZXRlZCgpIHtcbiAgICAgIGlmICh0aGlzLnJlc3VsdERhdGEuZnJvbS50ZXh0ICE9IFwiXCIgJiYgdGhpcy5yZXN1bHREYXRhLnRvLnRleHQgIT0gXCJcIikge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1jb21wbGV0ZWQtY29ubmVjdCcsIHRoaXMucmVzdWx0RGF0YSk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+36K6+572u5YWz6IGU5a2X5q61XCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RmllbGRzQW5kQmluZDogZnVuY3Rpb24gZ2V0RmllbGRzQW5kQmluZChmcm9tVGFibGVJZCwgdG9UYWJsZUlkKSB7XG4gICAgICB2YXIgdGFibGVJZHMgPSBbZnJvbVRhYmxlSWQsIHRvVGFibGVJZF07XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzLCB7XG4gICAgICAgIFwidGFibGVJZHNcIjogdGFibGVJZHNcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgdmFyIGFsbEZpZWxkcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIHZhciBhbGxUYWJsZXMgPSByZXN1bHQuZXhLVkRhdGEuVGFibGVzO1xuXG4gICAgICAgICAgdmFyIGZyb21UYWJsZUZpZWxkcyA9IF9zZWxmLmdldFNpbmdsZVRhYmxlRmllbGRzRGF0YShhbGxGaWVsZHMsIGZyb21UYWJsZUlkKTtcblxuICAgICAgICAgIHZhciB0b1RhYmxlRmllbGRzID0gX3NlbGYuZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhKGFsbEZpZWxkcywgdG9UYWJsZUlkKTtcblxuICAgICAgICAgIF9zZWxmLmZyb21UYWJsZUZpZWxkLmZpZWxkRGF0YSA9IGZyb21UYWJsZUZpZWxkcztcbiAgICAgICAgICBfc2VsZi50b1RhYmxlRmllbGQuZmllbGREYXRhID0gdG9UYWJsZUZpZWxkcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdENvbm5lY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0Q29ubmVjdChmcm9tVGFibGVJZCwgdG9UYWJsZUlkKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuY29ubmVjdFRhYmxlRmllbGRNb2RlbERpYWxvZ1dyYXA7XG4gICAgICB0aGlzLnJlc3VsdERhdGEuZnJvbS50YWJsZUlkID0gZnJvbVRhYmxlSWQ7XG4gICAgICB0aGlzLnJlc3VsdERhdGEudG8udGFibGVJZCA9IHRvVGFibGVJZDtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS5mcm9tLnRleHQgPSBcIlwiO1xuICAgICAgdGhpcy5yZXN1bHREYXRhLnRvLnRleHQgPSBcIlwiO1xuICAgICAgdGhpcy5nZXRGaWVsZHNBbmRCaW5kKGZyb21UYWJsZUlkLCB0b1RhYmxlSWQpO1xuICAgICAgdmFyIGhlaWdodCA9IDQ1MDtcblxuICAgICAgaWYgKFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpID4gNTUwKSB7XG4gICAgICAgIGhlaWdodCA9IDYwMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kaWFsb2dIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDg3MCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgIHRpdGxlOiBcIuiuvue9ruWFs+iBlFwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldFNpbmdsZVRhYmxlRmllbGRzRGF0YTogZnVuY3Rpb24gZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhKGFsbEZpZWxkcywgdGFibGVJZCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYWxsRmllbGRzW2ldLmZpZWxkVGFibGVJZCA9PSB0YWJsZUlkKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goYWxsRmllbGRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgc2VsZWN0ZWRGcm9tRmllbGQ6IGZ1bmN0aW9uIHNlbGVjdGVkRnJvbUZpZWxkKHJvdywgaW5kZXgpIHtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS5mcm9tLnRleHQgPSByb3cuZmllbGROYW1lICsgXCJbMV1cIjtcbiAgICB9LFxuICAgIHNlbGVjdGVkVG9GaWVsZDogZnVuY3Rpb24gc2VsZWN0ZWRUb0ZpZWxkKHJvdywgaW5kZXgpIHtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS50by50ZXh0ID0gcm93LmZpZWxkTmFtZSArIFwiWzAuLk5dXCI7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwiY29ubmVjdFRhYmxlRmllbGRNb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtd3JhcCBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtc291cmNlLXdyYXAgYzEtc2VsZWN0LW1vZGVsLXNvdXJjZS1oYXMtYnV0dG9ucy13cmFwXFxcIiBzdHlsZT1cXFwicGFkZGluZzogMTBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiZmxvYXQ6IGxlZnQ7d2lkdGg6IDQ5JTtoZWlnaHQ6IDEwMCU7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwicmVzdWx0RGF0YS5mcm9tLnRleHRcXFwiIHN1ZmZpeD1cXFwibWQtZG9uZS1hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU1RjAwXFx1NTlDQlxcdTUxNzNcXHU4MDU0XFx1NUI1N1xcdTZCQjVcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAxMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBAb24tcm93LWNsaWNrPVxcXCJzZWxlY3RlZEZyb21GaWVsZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIDpoZWlnaHQ9XFxcImRpYWxvZ0hlaWdodC0xODBcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImZyb21UYWJsZUZpZWxkLmNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJmcm9tVGFibGVGaWVsZC5maWVsZERhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDpyaWdodDt3aWR0aDogNDklO2hlaWdodDogMTAwJTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJyZXN1bHREYXRhLnRvLnRleHRcXFwiIHN1ZmZpeD1cXFwibWQtZG9uZS1hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU3RUQzXFx1Njc1RlxcdTUxNzNcXHU4MDU0XFx1NUI1N1xcdTZCQjVcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAxMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBAb24tcm93LWNsaWNrPVxcXCJzZWxlY3RlZFRvRmllbGRcXFwiIHNpemU9XFxcInNtYWxsXFxcIiA6aGVpZ2h0PVxcXCJkaWFsb2dIZWlnaHQtMTgwXFxcIiBzdHJpcGUgYm9yZGVyIDpjb2x1bW5zPVxcXCJ0b1RhYmxlRmllbGQuY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcInRvVGFibGVGaWVsZC5maWVsZERhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJib3R0b206IDEycHg7cmlnaHQ6IDEycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNvbXBsZXRlZCgpXFxcIiBpY29uPVxcXCJtZC1jaGVja21hcmtcXFwiPlxcdTc4NkVcXHU4QkE0PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj5cXHU1MTczXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZGItdGFibGUtcmVsYXRpb24tY29tcFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlc0RhdGFVcmw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZvclpUcmVlTm9kZUxpc3RcIixcbiAgICAgICAgZ2V0VGFibGVGaWVsZHNVcmw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlRmllbGRzQnlUYWJsZUlkXCJcbiAgICAgIH0sXG4gICAgICByZWxhdGlvblRhYmxlVHJlZToge1xuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0YWJsZVRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgdmFyIF9zZWxmID0gd2luZG93Ll9kYnRhYmxlcmVsYXRpb25jb21wO1xuXG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkUmVsYXRpb25UYWJsZU5vZGUodHJlZU5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdGFibGVUcmVlUm9vdERhdGE6IHtcbiAgICAgICAgICBpZDogXCItMVwiLFxuICAgICAgICAgIHRleHQ6IFwi5pWw5o2u5YWz6IGUXCIsXG4gICAgICAgICAgcGFyZW50SWQ6IFwiXCIsXG4gICAgICAgICAgbm9kZVR5cGVOYW1lOiBcIuagueiKgueCuVwiLFxuICAgICAgICAgIGljb246IFwiLi4vLi4vLi4vVGhlbWVzL1BuZzE2WDE2L2NvaW5zX2FkZC5wbmdcIixcbiAgICAgICAgICBfbm9kZUV4VHlwZTogXCJyb290XCIsXG4gICAgICAgICAgdGFibGVJZDogXCItMVwiXG4gICAgICAgIH0sXG4gICAgICAgIGN1cnJlbnRTZWxlY3RlZE5vZGU6IG51bGxcbiAgICAgIH0sXG4gICAgICByZWxhdGlvblRhYmxlRWRpdG9yVmlldzoge1xuICAgICAgICBpc1Nob3dUYWJsZUVkaXREZXRhaWw6IGZhbHNlLFxuICAgICAgICBpc1N1YkVkaXRUcjogZmFsc2UsXG4gICAgICAgIGlzTWFpbkVkaXRUcjogZmFsc2UsXG4gICAgICAgIHNlbFBLRGF0YTogW10sXG4gICAgICAgIHNlbFNlbGZLZXlEYXRhOiBbXSxcbiAgICAgICAgc2VsRm9yZWlnbktleURhdGE6IFtdXG4gICAgICB9LFxuICAgICAgZW1wdHlFZGl0b3JEYXRhOiB7XG4gICAgICAgIGlkOiBcIlwiLFxuICAgICAgICBwYXJlbnRJZDogXCJcIixcbiAgICAgICAgc2luZ2xlTmFtZTogXCJcIixcbiAgICAgICAgcGtGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIGRlc2M6IFwiXCIsXG4gICAgICAgIHNlbGZLZXlGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIG91dGVyS2V5RmllbGROYW1lOiBcIlwiLFxuICAgICAgICByZWxhdGlvblR5cGU6IFwiMVRvTlwiLFxuICAgICAgICBpc1NhdmU6IFwidHJ1ZVwiLFxuICAgICAgICBjb25kaXRpb246IFwiXCIsXG4gICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgIHRhYmxlTmFtZTogXCJcIixcbiAgICAgICAgdGFibGVDYXB0aW9uOiBcIlwiXG4gICAgICB9LFxuICAgICAgY3VycmVudEVkaXRvckRhdGE6IHtcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIHBhcmVudElkOiBcIlwiLFxuICAgICAgICBzaW5nbGVOYW1lOiBcIlwiLFxuICAgICAgICBwa0ZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgZGVzYzogXCJcIixcbiAgICAgICAgc2VsZktleUZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgb3V0ZXJLZXlGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIHJlbGF0aW9uVHlwZTogXCIxVG9OXCIsXG4gICAgICAgIGlzU2F2ZTogXCJ0cnVlXCIsXG4gICAgICAgIGNvbmRpdGlvbjogXCJcIixcbiAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgdGFibGVOYW1lOiBcIlwiLFxuICAgICAgICB0YWJsZUNhcHRpb246IFwiXCJcbiAgICAgIH0sXG4gICAgICBzZWxlY3RUYWJsZVRyZWU6IHtcbiAgICAgICAgdGFibGVUcmVlT2JqOiBudWxsLFxuICAgICAgICB0YWJsZVRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIGlmICh0cmVlTm9kZS5ub2RlVHlwZU5hbWUgPT0gXCJUYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gd2luZG93Ll9kYnRhYmxlcmVsYXRpb25jb21wO1xuICAgICAgICAgICAgICAgICQoXCIjZGl2U2VsZWN0VGFibGVcIikuZGlhbG9nKFwiY2xvc2VcIik7XG5cbiAgICAgICAgICAgICAgICBfc2VsZi5hZGRUYWJsZVRvUmVsYXRpb25UYWJsZVRyZWUodHJlZU5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVRyZWVEYXRhOiBudWxsLFxuICAgICAgICBzZWxlY3RlZFRhYmxlTmFtZTogXCLml6BcIlxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhU3RvcmU6IHt9LFxuICAgICAgcmVzdWx0RGF0YTogW10sXG4gICAgICB0cmVlTm9kZVNldHRpbmc6IHtcbiAgICAgICAgTWFpblRhYmxlTm9kZUltZzogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvcGFnZV9rZXkucG5nXCIsXG4gICAgICAgIFN1YlRhYmxlTm9kZUltZzogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvcGFnZV9yZWZyZXNoLnBuZ1wiXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJpbmRTZWxlY3RUYWJsZVRyZWUoKTtcbiAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNkYXRhUmVsYXRpb25aVHJlZVVMXCIpLCB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRhYmxlVHJlZVNldHRpbmcsIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudGFibGVUcmVlUm9vdERhdGEpO1xuICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlID0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmdldE5vZGVCeVBhcmFtKFwiaWRcIiwgXCItMVwiKTtcbiAgICB3aW5kb3cuX2RidGFibGVyZWxhdGlvbmNvbXAgPSB0aGlzO1xuICB9LFxuICB3YXRjaDoge1xuICAgIGN1cnJlbnRFZGl0b3JEYXRhOiB7XG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbiBoYW5kbGVyKHZhbCwgb2xkVmFsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZXN1bHREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMucmVzdWx0RGF0YVtpXS5pZCA9PSB2YWwuaWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodGhpcy5yZXN1bHREYXRhW2ldLCB2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZXA6IHRydWVcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICByZXN1bHRJdGVtQ29weUVkaXRFbmFibGVWYWx1ZTogZnVuY3Rpb24gcmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodG9PYmosIGZyb21PYmopIHtcbiAgICAgIHRvT2JqLnNpbmdsZU5hbWUgPSBmcm9tT2JqLnNpbmdsZU5hbWU7XG4gICAgICB0b09iai5wa0ZpZWxkTmFtZSA9IGZyb21PYmoucGtGaWVsZE5hbWU7XG4gICAgICB0b09iai5kZXNjID0gZnJvbU9iai5kZXNjO1xuICAgICAgdG9PYmouc2VsZktleUZpZWxkTmFtZSA9IGZyb21PYmouc2VsZktleUZpZWxkTmFtZTtcbiAgICAgIHRvT2JqLm91dGVyS2V5RmllbGROYW1lID0gZnJvbU9iai5vdXRlcktleUZpZWxkTmFtZTtcbiAgICAgIHRvT2JqLnJlbGF0aW9uVHlwZSA9IGZyb21PYmoucmVsYXRpb25UeXBlO1xuICAgICAgdG9PYmouaXNTYXZlID0gZnJvbU9iai5pc1NhdmU7XG4gICAgICB0b09iai5jb25kaXRpb24gPSBmcm9tT2JqLmNvbmRpdGlvbjtcbiAgICB9LFxuICAgIGdldFRhYmxlRmllbGRzQnlUYWJsZUlkOiBmdW5jdGlvbiBnZXRUYWJsZUZpZWxkc0J5VGFibGVJZCh0YWJsZUlkKSB7XG4gICAgICBpZiAodGFibGVJZCA9PSBcIi0xXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnRlbXBEYXRhU3RvcmVbXCJ0YWJsZUZpZWxkX1wiICsgdGFibGVJZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmModGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZUZpZWxkc1VybCwge1xuICAgICAgICAgIHRhYmxlSWQ6IHRhYmxlSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgX3NlbGYudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50ZW1wRGF0YVN0b3JlW1widGFibGVGaWVsZF9cIiArIHRhYmxlSWRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBEYXRhU3RvcmVbXCJ0YWJsZUZpZWxkX1wiICsgdGFibGVJZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldEVtcHR5UmVzdWx0SXRlbTogZnVuY3Rpb24gZ2V0RW1wdHlSZXN1bHRJdGVtKCkge1xuICAgICAgcmV0dXJuIEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHRoaXMuZW1wdHlFZGl0b3JEYXRhKTtcbiAgICB9LFxuICAgIGdldEV4aXN0UmVzdWx0SXRlbTogZnVuY3Rpb24gZ2V0RXhpc3RSZXN1bHRJdGVtKGlkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVzdWx0RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5yZXN1bHREYXRhW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0RGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGJpbmRTZWxlY3RUYWJsZVRyZWU6IGZ1bmN0aW9uIGJpbmRTZWxlY3RUYWJsZVRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVzRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZURhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICBfc2VsZi5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjc2VsZWN0VGFibGVaVHJlZVVMXCIpLCBfc2VsZi5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlU2V0dGluZywgX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG5cbiAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmooX3NlbGYuc2VsZWN0VGFibGVUcmVlLnRhYmxlVHJlZU9iaiwgX3NlbGYuJHJlZnMudHh0X3RhYmxlX3NlYXJjaF90ZXh0LiRyZWZzLmlucHV0LCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICBkZWxldGVTZWxlY3RlZFJlbGF0aW9uVHJlZU5vZGU6IGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkUmVsYXRpb25UcmVlTm9kZSgpIHtcbiAgICAgIGlmICh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGUoKSkge1xuICAgICAgICAgIGlmICghdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlzUGFyZW50KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVzdWx0RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAodGhpcy5yZXN1bHREYXRhW2ldLmlkID09IHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0RGF0YS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZXN1bHRJdGVtQ29weUVkaXRFbmFibGVWYWx1ZSh0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLCB0aGlzLmVtcHR5RWRpdG9yRGF0YSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLmlkID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEVkaXRvckRhdGEucGFyZW50SWQgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy4kcmVmcy5zcWxHZW5lcmFsRGVzaWduQ29tcC5zZXRWYWx1ZShcIlwiKTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsUEtEYXRhID0gW107XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFNlbGZLZXlEYXRhID0gW107XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbEZvcmVpZ25LZXlEYXRhID0gW107XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU2hvd1RhYmxlRWRpdERldGFpbCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLnJlbW92ZU5vZGUodGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUgPSBudWxsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuS4jeiDveWIoOmZpOeItuiKgueCuSFcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5LiN6IO95Yig6Zmk5qC56IqC54K5IVwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7fpgInmi6nopoHliKDpmaTnmoToioLngrkhXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYmVnaW5TZWxlY3RUYWJsZVRvUmVsYXRpb25UYWJsZTogZnVuY3Rpb24gYmVnaW5TZWxlY3RUYWJsZVRvUmVsYXRpb25UYWJsZSgpIHtcbiAgICAgIGlmICh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUpIHtcbiAgICAgICAgJChcIiNkaXZTZWxlY3RUYWJsZVwiKS5kaWFsb2coe1xuICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICAgIHdpZHRoOiA3MDBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLpgInmi6nkuIDkuKrniLboioLngrkhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXBwZW5kTWFpblRhYmxlTm9kZVByb3A6IGZ1bmN0aW9uIGFwcGVuZE1haW5UYWJsZU5vZGVQcm9wKG5vZGUpIHtcbiAgICAgIG5vZGUuX25vZGVFeFR5cGUgPSBcIk1haW5Ob2RlXCI7XG4gICAgICBub2RlLmljb24gPSB0aGlzLnRyZWVOb2RlU2V0dGluZy5NYWluVGFibGVOb2RlSW1nO1xuICAgIH0sXG4gICAgYXBwZW5kU3ViVGFibGVOb2RlUHJvcDogZnVuY3Rpb24gYXBwZW5kU3ViVGFibGVOb2RlUHJvcChub2RlKSB7XG4gICAgICBub2RlLl9ub2RlRXhUeXBlID0gXCJTdWJOb2RlXCI7XG4gICAgICBub2RlLmljb24gPSB0aGlzLnRyZWVOb2RlU2V0dGluZy5TdWJUYWJsZU5vZGVJbWc7XG4gICAgfSxcbiAgICBidWlsZFJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBidWlsZFJlbGF0aW9uVGFibGVOb2RlKHNvdXJjZU5vZGUsIHRyZWVOb2RlSWQpIHtcbiAgICAgIGlmICh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuX25vZGVFeFR5cGUgPT0gXCJyb290XCIpIHtcbiAgICAgICAgdGhpcy5hcHBlbmRNYWluVGFibGVOb2RlUHJvcChzb3VyY2VOb2RlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYXBwZW5kU3ViVGFibGVOb2RlUHJvcChzb3VyY2VOb2RlKTtcbiAgICAgIH1cblxuICAgICAgc291cmNlTm9kZS50YWJsZUlkID0gc291cmNlTm9kZS5pZDtcblxuICAgICAgaWYgKHRyZWVOb2RlSWQpIHtcbiAgICAgICAgc291cmNlTm9kZS5pZCA9IHRyZWVOb2RlSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb3VyY2VOb2RlLmlkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzb3VyY2VOb2RlO1xuICAgIH0sXG4gICAgZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBnZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iai5nZXROb2RlQnlQYXJhbShcIl9ub2RlRXhUeXBlXCIsIFwiTWFpbk5vZGVcIik7XG5cbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldE1haW5UYWJsZUlkOiBmdW5jdGlvbiBnZXRNYWluVGFibGVJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpID8gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKS50YWJsZUlkIDogXCJcIjtcbiAgICB9LFxuICAgIGdldE1haW5UYWJsZU5hbWU6IGZ1bmN0aW9uIGdldE1haW5UYWJsZU5hbWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSA/IHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkudmFsdWUgOiBcIlwiO1xuICAgIH0sXG4gICAgZ2V0TWFpblRhYmxlQ2FwdGlvbjogZnVuY3Rpb24gZ2V0TWFpblRhYmxlQ2FwdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpID8gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKS5hdHRyMSA6IFwiXCI7XG4gICAgfSxcbiAgICBpc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBpc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pZCA9PSBcIi0xXCI7XG4gICAgfSxcbiAgICBpc1NlbGVjdGVkTWFpblJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBpc1NlbGVjdGVkTWFpblJlbGF0aW9uVGFibGVOb2RlKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5fbm9kZUV4VHlwZSA9PSBcIk1haW5Ob2RlXCI7XG4gICAgfSxcbiAgICBhZGRUYWJsZVRvUmVsYXRpb25UYWJsZVRyZWU6IGZ1bmN0aW9uIGFkZFRhYmxlVG9SZWxhdGlvblRhYmxlVHJlZShuZXdOb2RlKSB7XG4gICAgICBuZXdOb2RlID0gdGhpcy5idWlsZFJlbGF0aW9uVGFibGVOb2RlKG5ld05vZGUpO1xuICAgICAgdmFyIHRlbXBOb2RlID0gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKTtcblxuICAgICAgaWYgKHRlbXBOb2RlICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi5Y+q5YWB6K645a2Y5Zyo5LiA5Liq5Li76K6w5b2VIVwiLCBudWxsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmFkZE5vZGVzKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSwgLTEsIG5ld05vZGUsIGZhbHNlKTtcbiAgICAgIHZhciBuZXdSZXN1bHRJdGVtID0gdGhpcy5nZXRFbXB0eVJlc3VsdEl0ZW0oKTtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0uaWQgPSBuZXdOb2RlLmlkO1xuICAgICAgbmV3UmVzdWx0SXRlbS5wYXJlbnRJZCA9IHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5pZDtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVJZCA9IG5ld05vZGUudGFibGVJZDtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVOYW1lID0gbmV3Tm9kZS52YWx1ZTtcbiAgICAgIG5ld1Jlc3VsdEl0ZW0udGFibGVDYXB0aW9uID0gbmV3Tm9kZS5hdHRyMTtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS5wdXNoKG5ld1Jlc3VsdEl0ZW0pO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRSZWxhdGlvblRhYmxlTm9kZTogZnVuY3Rpb24gc2VsZWN0ZWRSZWxhdGlvblRhYmxlTm9kZShub2RlKSB7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUgPSBub2RlO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1Nob3dUYWJsZUVkaXREZXRhaWwgPSAhdGhpcy5pc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzTWFpbkVkaXRUciA9IHRoaXMuaXNTZWxlY3RlZE1haW5SZWxhdGlvblRhYmxlTm9kZSgpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1N1YkVkaXRUciA9ICF0aGlzLmlzU2VsZWN0ZWRNYWluUmVsYXRpb25UYWJsZU5vZGUoKTtcblxuICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxQS0RhdGEgPSB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKG5vZGUudGFibGVJZCkgIT0gbnVsbCA/IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQobm9kZS50YWJsZUlkKSA6IFtdO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxTZWxmS2V5RGF0YSA9IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQobm9kZS50YWJsZUlkKSAhPSBudWxsID8gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChub2RlLnRhYmxlSWQpIDogW107XG4gICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUuZ2V0UGFyZW50Tm9kZSgpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxGb3JlaWduS2V5RGF0YSA9IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQocGFyZW50Tm9kZS50YWJsZUlkKSAhPSBudWxsID8gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChwYXJlbnROb2RlLnRhYmxlSWQpIDogW107XG4gICAgICB0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLmlkID0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlkO1xuICAgICAgdGhpcy5jdXJyZW50RWRpdG9yRGF0YS5wYXJlbnRJZCA9IHBhcmVudE5vZGUuaWQ7XG4gICAgICB2YXIgZXhpc3RSZXN1bHRJdGVtID0gdGhpcy5nZXRFeGlzdFJlc3VsdEl0ZW0obm9kZS5pZCk7XG5cbiAgICAgIGlmIChleGlzdFJlc3VsdEl0ZW0gIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlKHRoaXMuY3VycmVudEVkaXRvckRhdGEsIGV4aXN0UmVzdWx0SXRlbSk7XG5cbiAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3NlbGYuJHJlZnMuc3FsR2VuZXJhbERlc2lnbkNvbXAuc2V0VmFsdWUoX3NlbGYuY3VycmVudEVkaXRvckRhdGEuY29uZGl0aW9uKTtcblxuICAgICAgICAgIF9zZWxmLiRyZWZzLnNxbEdlbmVyYWxEZXNpZ25Db21wLnNldEFib3V0VGFibGVGaWVsZHMoX3NlbGYucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsU2VsZktleURhdGEsIF9zZWxmLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbEZvcmVpZ25LZXlEYXRhKTtcbiAgICAgICAgfSwgMzAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwi6YCa6L+HZ2V0RXhpc3RSZXN1bHRJdGVt6I635Y+W5LiN5Yiw5pWw5o2uIVwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFJlc3VsdERhdGE6IGZ1bmN0aW9uIGdldFJlc3VsdERhdGEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXN1bHREYXRhO1xuICAgIH0sXG4gICAgc2VyaWFsaXplUmVsYXRpb246IGZ1bmN0aW9uIHNlcmlhbGl6ZVJlbGF0aW9uKGlzRm9ybWF0KSB7XG4gICAgICBhbGVydChcInNlcmlhbGl6ZVJlbGF0aW9u5bey57uP5YGc55SoXCIpO1xuICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAoaXNGb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZ0Zvcm1hdCh0aGlzLnJlc3VsdERhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHRoaXMucmVzdWx0RGF0YSk7XG4gICAgfSxcbiAgICBkZXNlcmlhbGl6ZVJlbGF0aW9uOiBmdW5jdGlvbiBkZXNlcmlhbGl6ZVJlbGF0aW9uKGpzb25TdHJpbmcpIHtcbiAgICAgIGFsZXJ0KFwiZGVzZXJpYWxpemVSZWxhdGlvbuW3sue7j+WBnOeUqFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9LFxuICAgIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG1haW5UYWJsZUlkOiB0aGlzLmdldE1haW5UYWJsZUlkKCksXG4gICAgICAgIG1haW5UYWJsZU5hbWU6IHRoaXMuZ2V0TWFpblRhYmxlTmFtZSgpLFxuICAgICAgICBtYWluVGFibGVDYXB0aW9uOiB0aGlzLmdldE1haW5UYWJsZUNhcHRpb24oKSxcbiAgICAgICAgcmVsYXRpb25EYXRhOiB0aGlzLnJlc3VsdERhdGFcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKGpzb25TdHJpbmcpIHtcbiAgICAgIHZhciB0ZW1wRGF0YSA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihqc29uU3RyaW5nKTtcbiAgICAgIHRoaXMucmVzdWx0RGF0YSA9IHRlbXBEYXRhO1xuICAgICAgdmFyIHRyZWVOb2RlRGF0YSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0cmVlTm9kZSA9IHtcbiAgICAgICAgICBcInZhbHVlXCI6IHRlbXBEYXRhW2ldLnRhYmxlTmFtZSxcbiAgICAgICAgICBcImF0dHIxXCI6IHRlbXBEYXRhW2ldLnRhYmxlQ2FwdGlvbixcbiAgICAgICAgICBcInRleHRcIjogdGVtcERhdGFbaV0udGFibGVDYXB0aW9uICsgXCLjgJBcIiArIHRlbXBEYXRhW2ldLnRhYmxlTmFtZSArIFwi44CRXCIsXG4gICAgICAgICAgXCJpZFwiOiB0ZW1wRGF0YVtpXS5pZCxcbiAgICAgICAgICBcInBhcmVudElkXCI6IHRlbXBEYXRhW2ldLnBhcmVudElkXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRlbXBEYXRhW2ldLnBhcmVudElkID09IFwiLTFcIikge1xuICAgICAgICAgIHRoaXMuYXBwZW5kTWFpblRhYmxlTm9kZVByb3AodHJlZU5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYXBwZW5kU3ViVGFibGVOb2RlUHJvcCh0cmVlTm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0cmVlTm9kZURhdGEucHVzaCh0cmVlTm9kZSk7XG4gICAgICB9XG5cbiAgICAgIHRyZWVOb2RlRGF0YS5wdXNoKHRoaXMucmVsYXRpb25UYWJsZVRyZWUudGFibGVUcmVlUm9vdERhdGEpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjZGF0YVJlbGF0aW9uWlRyZWVVTFwiKSwgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50YWJsZVRyZWVTZXR0aW5nLCB0cmVlTm9kZURhdGEpO1xuICAgICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICB9LFxuICAgIGFsZXJ0U2VyaWFsaXplUmVsYXRpb246IGZ1bmN0aW9uIGFsZXJ0U2VyaWFsaXplUmVsYXRpb24oKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0SnNvbkNvZGUodGhpcy5yZXN1bHREYXRhKTtcbiAgICB9LFxuICAgIGlucHV0RGVzZXJpYWxpemVSZWxhdGlvbjogZnVuY3Rpb24gaW5wdXREZXNlcmlhbGl6ZVJlbGF0aW9uKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5Qcm9tcHQod2luZG93LCB7XG4gICAgICAgIHdpZHRoOiA5MDAsXG4gICAgICAgIGhlaWdodDogNjAwXG4gICAgICB9LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ1Byb21wdElkLCBcIuivt+i0tOWFpeaVsOaNruWFs+iBlEpzb27orr7nva7lrZfnrKbkuLJcIiwgZnVuY3Rpb24gKGpzb25TdHJpbmcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB3aW5kb3cuX2RidGFibGVyZWxhdGlvbmNvbXAuc2V0VmFsdWUoanNvblN0cmluZyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBhbGVydChcIuWPjeW6j+WIl+WMluWksei0pTpcIiArIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImRiLXRhYmxlLXJlbGF0aW9uLWNvbXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgPGRpdmlkZXIgb3JpZW50YXRpb249XCJsZWZ0XCIgOmRhc2hlZD1cInRydWVcIiBzdHlsZT1cImZvbnQtc2l6ZTogMTJweDttYXJnaW4tdG9wOiAwcHg7bWFyZ2luLWJvdHRvbTogMTBweFwiPuaVsOaNruWFs+ezu+WFs+iBlOiuvue9rjwvZGl2aWRlcj5cXFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0O3dpZHRoOiAzNTBweDtoZWlnaHQ6IDMzMHB4O2JvcmRlcjogI2RkZGRmMSAxcHggc29saWQ7Ym9yZGVyLXJhZGl1czogNHB4O3BhZGRpbmc6IDEwcHggMTBweCAxMHB4IDEwcHg7XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwIHNoYXBlPVwiY2lyY2xlXCIgc3R5bGU9XCJtYXJnaW46IGF1dG9cIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInN1Y2Nlc3NcIiBAY2xpY2s9XCJiZWdpblNlbGVjdFRhYmxlVG9SZWxhdGlvblRhYmxlXCI+Jm5ic3A75re75YqgJm5ic3A7PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVwiZGVsZXRlU2VsZWN0ZWRSZWxhdGlvblRyZWVOb2RlXCI+Jm5ic3A75Yig6ZmkJm5ic3A7PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVwiYWxlcnRTZXJpYWxpemVSZWxhdGlvblwiPuW6j+WIl+WMljwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cImlucHV0RGVzZXJpYWxpemVSZWxhdGlvblwiPuWPjeW6j+WIl+WMljwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uPuivtOaYjjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cImRhdGFSZWxhdGlvblpUcmVlVUxcIiBjbGFzcz1cInp0cmVlXCI+PC91bD5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogcmlnaHQ7d2lkdGg6IDYzMHB4O2hlaWdodDogMzMwcHg7Ym9yZGVyOiAjZGRkZGYxIDFweCBzb2xpZDtib3JkZXItcmFkaXVzOiA0cHg7cGFkZGluZzogMTBweCAxMHB4IDEwcHggMTBweDtcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cImxpZ2h0LWdyYXktdGFibGVcIiBjZWxscGFkZGluZz1cIjBcIiBjZWxsc3BhY2luZz1cIjBcIiBib3JkZXI9XCIwXCIgdi1pZj1cInJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU2hvd1RhYmxlRWRpdERldGFpbFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cIndpZHRoOiAxNyVcIiAvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVwid2lkdGg6IDMzJVwiIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XCJ3aWR0aDogMTUlXCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cIndpZHRoOiAzNSVcIiAvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYWJlbFwiPlNpbmdsZU5hbWXvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5zaW5nbGVOYW1lXCIgc2l6ZT1cInNtYWxsXCIgcGxhY2Vob2xkZXI9XCLmnKzlhbPogZTkuK3nmoTllK/kuIDlkI3np7As5Y+v5Lul5Li656m6XCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYWJlbFwiPlBLS2V577yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5wa0ZpZWxkTmFtZVwiIHNpemU9XCJzbWFsbFwiIHN0eWxlPVwid2lkdGg6MTk5cHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHYtZm9yPVwiaXRlbSBpbiByZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxQS0RhdGFcIiA6dmFsdWU9XCJpdGVtLmZpZWxkTmFtZVwiIDprZXk9XCJpdGVtLmZpZWxkTmFtZVwiPnt7aXRlbS5maWVsZENhcHRpb259fTwvaS1vcHRpb24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciB2LWlmPVwicmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTdWJFZGl0VHJcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+5pWw5o2u5YWz57O777yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLnJlbGF0aW9uVHlwZVwiIHR5cGU9XCJidXR0b25cIiBzaXplPVwic21hbGxcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVwiMVRvMVwiPjE6MTwvcmFkaW8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cIjFUb05cIj4xOk48L3JhZGlvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj7mmK/lkKbkv53lrZjvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEuaXNTYXZlXCIgdHlwZT1cImJ1dHRvblwiIHNpemU9XCJzbWFsbFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XCJ0cnVlXCI+5pivPC9yYWRpbz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVwiZmFsc2VcIj7lkKY8L3JhZGlvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgdi1pZj1cInJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU3ViRWRpdFRyXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYWJlbFwiPuacrOi6q+WFs+iBlOWtl+aute+8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCBwbGFjZWhvbGRlcj1cIum7mOiupOS9v+eUqElk5a2X5q61XCIgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLnNlbGZLZXlGaWVsZE5hbWVcIiBzaXplPVwic21hbGxcIiBzdHlsZT1cIndpZHRoOjE5OXB4XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gcmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsU2VsZktleURhdGFcIiA6dmFsdWU9XCJpdGVtLmZpZWxkTmFtZVwiIDprZXk9XCJpdGVtLmZpZWxkTmFtZVwiPnt7aXRlbS5maWVsZENhcHRpb259fTwvaS1vcHRpb24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXNlbGVjdD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYWJlbFwiPuWkluiBlOWtl+aute+8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCBwbGFjZWhvbGRlcj1cIum7mOiupOS9v+eUqElk5a2X5q61XCIgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLm91dGVyS2V5RmllbGROYW1lXCIgc2l6ZT1cInNtYWxsXCIgc3R5bGU9XCJ3aWR0aDoxOTlweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFBLRGF0YVwiIDp2YWx1ZT1cIml0ZW0uZmllbGROYW1lXCIgOmtleT1cIml0ZW0uZmllbGROYW1lXCI+e3tpdGVtLmZpZWxkQ2FwdGlvbn19PC9pLW9wdGlvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj5EZXNj77yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5kZXNjXCIgc2l6ZT1cInNtYWxsXCIgcGxhY2Vob2xkZXI9XCLor7TmmI5cIiAvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj7liqDovb3mnaHku7bvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNxbC1nZW5lcmFsLWRlc2lnbi1jb21wIHJlZj1cInNxbEdlbmVyYWxEZXNpZ25Db21wXCIgOnNxbERlc2lnbmVySGVpZ2h0PVwiNzRcIiB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEuY29uZGl0aW9uXCI+PC9zcWwtZ2VuZXJhbC1kZXNpZ24tY29tcD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiZGl2U2VsZWN0VGFibGVcIiB0aXRsZT1cIuivt+mAieaLqeihqFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVwiaW5wdXRfYm9yZGVyX2JvdHRvbVwiIHJlZj1cInR4dF90YWJsZV9zZWFyY2hfdGV4dFwiIHBsYWNlaG9sZGVyPVwi6K+36L6T5YWl6KGo5ZCN5oiW6ICF5qCH6aKYXCI+PC9pLWlucHV0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVwic2VsZWN0VGFibGVaVHJlZVVMXCIgY2xhc3M9XCJ6dHJlZVwiPjwvdWw+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJkZXNpZ24taHRtbC1lbGVtLWxpc3RcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7fSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiZGVzaWduLWh0bWwtZWxlbS1saXN0LXdyYXBcIj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzaWduLWh0bWwtZWxlbS1saXN0LWl0ZW1cIj7moLzlvI/ljJY8L2Rpdj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzaWduLWh0bWwtZWxlbS1saXN0LWl0ZW1cIj7or7TmmI48L2Rpdj5cXFxyXG4gICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZmQtY29udHJvbC1iYXNlLWluZm9cIiwge1xuICBwcm9wczogW1widmFsdWVcIl0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJhc2VJbmZvOiB7XG4gICAgICAgIGlkOiBcIlwiLFxuICAgICAgICBzZXJpYWxpemU6IFwiXCIsXG4gICAgICAgIG5hbWU6IFwiXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJcIixcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwiXCIsXG4gICAgICAgIHJlYWRvbmx5OiBcIlwiLFxuICAgICAgICBkaXNhYmxlZDogXCJcIixcbiAgICAgICAgc3R5bGU6IFwiXCIsXG4gICAgICAgIGRlc2M6IFwiXCJcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICB3YXRjaDoge1xuICAgIGJhc2VJbmZvOiBmdW5jdGlvbiBiYXNlSW5mbyhuZXdWYWwpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgbmV3VmFsKTtcbiAgICB9LFxuICAgIHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShuZXdWYWwpIHtcbiAgICAgIHRoaXMuYmFzZUluZm8gPSBuZXdWYWw7XG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuYmFzZUluZm8gPSB0aGlzLnZhbHVlO1xuICB9LFxuICBtZXRob2RzOiB7fSxcbiAgdGVtcGxhdGU6IFwiPHRhYmxlIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclxcXCIgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGNlbGxzcGFjaW5nPVxcXCIwXFxcIiBib3JkZXI9XFxcIjBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAxMDBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMjgwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDkwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDExMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA5MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPklEXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgdi1tb2RlbD1cXFwiYmFzZUluZm8uaWRcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+U2VyaWFsaXplXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5zZXJpYWxpemVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJ0cnVlXFxcIj5cXHU2NjJGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiZmFsc2VcXFwiPlxcdTU0MjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5OYW1lXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgdi1tb2RlbD1cXFwiYmFzZUluZm8ubmFtZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5DbGFzc05hbWVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiM1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5jbGFzc05hbWVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlBsYWNlaG9sZGVyPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5wbGFjZWhvbGRlclxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5SZWFkb25seVxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHR5cGU9XFxcImJ1dHRvblxcXCIgc3R5bGU9XFxcIm1hcmdpbjogYXV0b1xcXCIgdi1tb2RlbD1cXFwiYmFzZUluZm8ucmVhZG9ubHlcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJyZWFkb25seVxcXCI+XFx1NjYyRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIm5vcmVhZG9ubHlcXFwiPlxcdTU0MjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPkRpc2FibGVkXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5kaXNhYmxlZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImRpc2FibGVkXFxcIj5cXHU2NjJGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwibm9kaXNhYmxlZFxcXCI+XFx1NTQyNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTY4MzdcXHU1RjBGXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cXFwiN1xcXCIgdi1tb2RlbD1cXFwiYmFzZUluZm8uc3R5bGVcXFwiPjwvdGV4dGFyZWE+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTU5MDdcXHU2Q0U4XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cXFwiOFxcXCIgdi1tb2RlbD1cXFwiYmFzZUluZm8uZGVzY1xcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJmZC1jb250cm9sLWJpbmQtdG9cIiwge1xuICBwcm9wczogW1wiYmluZFRvRmllbGRQcm9wXCIsIFwiZGVmYXVsdFZhbHVlUHJvcFwiLCBcInZhbGlkYXRlUnVsZXNQcm9wXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBiaW5kVG9GaWVsZDoge1xuICAgICAgICB0YWJsZUlkOiBcIlwiLFxuICAgICAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIixcbiAgICAgICAgZmllbGROYW1lOiBcIlwiLFxuICAgICAgICBmaWVsZENhcHRpb246IFwiXCIsXG4gICAgICAgIGZpZWxkRGF0YVR5cGU6IFwiXCIsXG4gICAgICAgIGZpZWxkTGVuZ3RoOiBcIlwiXG4gICAgICB9LFxuICAgICAgdmFsaWRhdGVSdWxlczoge1xuICAgICAgICBtc2c6IFwiXCIsXG4gICAgICAgIHJ1bGVzOiBbXVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRWYWx1ZToge1xuICAgICAgICBkZWZhdWx0VHlwZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiLFxuICAgICAgICBkZWZhdWx0VGV4dDogXCJcIlxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhOiB7XG4gICAgICAgIGRlZmF1bHREaXNwbGF5VGV4dDogXCJcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgYmluZFRvUHJvcDogZnVuY3Rpb24gYmluZFRvUHJvcChuZXdWYWx1ZSkge1xuICAgICAgY29uc29sZS5sb2cobmV3VmFsdWUpO1xuICAgIH0sXG4gICAgYmluZFRvRmllbGRQcm9wOiBmdW5jdGlvbiBiaW5kVG9GaWVsZFByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuYmluZFRvRmllbGQgPSBuZXdWYWx1ZTtcbiAgICB9LFxuICAgIGRlZmF1bHRWYWx1ZVByb3A6IGZ1bmN0aW9uIGRlZmF1bHRWYWx1ZVByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlKSkge1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB2YWxpZGF0ZVJ1bGVzUHJvcDogZnVuY3Rpb24gdmFsaWRhdGVSdWxlc1Byb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMudmFsaWRhdGVSdWxlcyA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmJpbmRUb0ZpZWxkID0gdGhpcy5iaW5kVG9GaWVsZFByb3A7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBzZXRDb21wbGV0ZWQ6IGZ1bmN0aW9uIHNldENvbXBsZXRlZCgpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLXNldC1jb21wbGV0ZWQnLCB0aGlzLmJpbmRUb0ZpZWxkLCB0aGlzLmRlZmF1bHRWYWx1ZSwgdGhpcy52YWxpZGF0ZVJ1bGVzKTtcbiAgICB9LFxuICAgIHNlbGVjdEJpbmRGaWVsZFZpZXc6IGZ1bmN0aW9uIHNlbGVjdEJpbmRGaWVsZFZpZXcoKSB7XG4gICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB0aGlzO1xuICAgICAgd2luZG93LnBhcmVudC5hcHBGb3JtLnNlbGVjdEJpbmRUb1NpbmdsZUZpZWxkRGlhbG9nQmVnaW4od2luZG93LCB0aGlzLmdldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWUoKSk7XG4gICAgfSxcbiAgICBzZXRTZWxlY3RGaWVsZFJlc3VsdFZhbHVlOiBmdW5jdGlvbiBzZXRTZWxlY3RGaWVsZFJlc3VsdFZhbHVlKHJlc3VsdCkge1xuICAgICAgdGhpcy5iaW5kVG9GaWVsZCA9IHt9O1xuXG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZE5hbWUgPSByZXN1bHQuZmllbGROYW1lO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlSWQgPSByZXN1bHQudGFibGVJZDtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZU5hbWUgPSByZXN1bHQudGFibGVOYW1lO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlQ2FwdGlvbiA9IHJlc3VsdC50YWJsZUNhcHRpb247XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGRDYXB0aW9uID0gcmVzdWx0LmZpZWxkQ2FwdGlvbjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZERhdGFUeXBlID0gcmVzdWx0LmZpZWxkRGF0YVR5cGU7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGRMZW5ndGggPSByZXN1bHQuZmllbGRMZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkTmFtZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVJZCA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVOYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUNhcHRpb24gPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbiA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGREYXRhVHlwZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGRMZW5ndGggPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldENvbXBsZXRlZCgpO1xuICAgIH0sXG4gICAgZ2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZTogZnVuY3Rpb24gZ2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZSgpIHtcbiAgICAgIHJldHVybiBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZSh0aGlzLmJpbmRUb0ZpZWxkKTtcbiAgICB9LFxuICAgIHNlbGVjdERlZmF1bHRWYWx1ZVZpZXc6IGZ1bmN0aW9uIHNlbGVjdERlZmF1bHRWYWx1ZVZpZXcoKSB7XG4gICAgICBKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuYmVnaW5TZWxlY3RJbkZyYW1lKHdpbmRvdywgXCJfU2VsZWN0QmluZE9ialwiLCB7fSk7XG4gICAgICB3aW5kb3cuX1NlbGVjdEJpbmRPYmogPSB0aGlzO1xuICAgIH0sXG4gICAgc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZShyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSA9IHJlc3VsdC5UeXBlO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VmFsdWUgPSByZXN1bHQuVmFsdWU7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0ID0gcmVzdWx0LlRleHQ7XG4gICAgICAgIHRoaXMudGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0ID0gSkJ1aWxkNERTZWxlY3RWaWV3LlNlbGVjdEVudlZhcmlhYmxlLmZvcm1hdFRleHQodGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUsIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0Q29tcGxldGVkKCk7XG4gICAgfSxcbiAgICBzZWxlY3RWYWxpZGF0ZVJ1bGVWaWV3OiBmdW5jdGlvbiBzZWxlY3RWYWxpZGF0ZVJ1bGVWaWV3KCkge1xuICAgICAgSkJ1aWxkNERTZWxlY3RWaWV3LlNlbGVjdFZhbGlkYXRlUnVsZS5iZWdpblNlbGVjdEluRnJhbWUod2luZG93LCBcIl9TZWxlY3RCaW5kT2JqXCIsIHt9KTtcbiAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHRoaXM7XG4gICAgfSxcbiAgICBzZXRTZWxlY3RWYWxpZGF0ZVJ1bGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0VmFsaWRhdGVSdWxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVJ1bGVzID0gcmVzdWx0O1xuICAgICAgICB0aGlzLnNldENvbXBsZXRlZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVJ1bGVzLm1zZyA9IFwiXCI7XG4gICAgICAgIHRoaXMudmFsaWRhdGVSdWxlcy5ydWxlcyA9IFtdO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0U2VsZWN0VmFsaWRhdGVSdWxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIGdldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVSdWxlcztcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPHRhYmxlIGNlbGxwYWRkaW5nPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGJvcmRlcj1cIjBcIiBjbGFzcz1cImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXCI+JyArICc8Y29sZ3JvdXA+JyArICc8Y29sIHN0eWxlPVwid2lkdGg6IDEwMHB4XCIgLz4nICsgJzxjb2wgc3R5bGU9XCJ3aWR0aDogMjgwcHhcIiAvPicgKyAnPGNvbCBzdHlsZT1cIndpZHRoOiAxMDBweFwiIC8+JyArICc8Y29sIC8+JyArICc8L2NvbGdyb3VwPicgKyAnPHRyPicgKyAnPHRkIGNvbHNwYW49XCI0XCI+JyArICcgICAg57uR5a6a5Yiw6KGoPGJ1dHRvbiBjbGFzcz1cImJ0bi1zZWxlY3QgZnJpZ2h0XCIgdi1vbjpjbGljaz1cInNlbGVjdEJpbmRGaWVsZFZpZXdcIj4uLi48L2J1dHRvbj4nICsgJzwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkPuihqOe8luWPt++8mjwvdGQ+JyArICc8dGQgY29sc3Bhbj1cIjNcIj57e2JpbmRUb0ZpZWxkLnRhYmxlSWR9fTwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkPuihqOWQje+8mjwvdGQ+JyArICc8dGQ+e3tiaW5kVG9GaWVsZC50YWJsZU5hbWV9fTwvdGQ+JyArICc8dGQ+6KGo5qCH6aKY77yaPC90ZD4nICsgJzx0ZD57e2JpbmRUb0ZpZWxkLnRhYmxlQ2FwdGlvbn19PC90ZD4nICsgJzwvdHI+JyArICc8dHI+JyArICc8dGQ+5a2X5q615ZCN77yaPC90ZD4nICsgJzx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkTmFtZX19PC90ZD4nICsgJzx0ZD7lrZfmrrXmoIfpopjvvJo8L3RkPicgKyAnPHRkPnt7YmluZFRvRmllbGQuZmllbGRDYXB0aW9ufX08L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZD7nsbvlnovvvJo8L3RkPicgKyAnPHRkPnt7YmluZFRvRmllbGQuZmllbGREYXRhVHlwZX19PC90ZD4nICsgJzx0ZD7plb/luqbvvJo8L3RkPicgKyAnPHRkPnt7YmluZFRvRmllbGQuZmllbGRMZW5ndGh9fTwvdGQ+JyArICc8L3RyPicgKyAnPHRyPicgKyAnPHRkIGNvbHNwYW49XCI0XCI+6buY6K6k5YC8PGJ1dHRvbiBjbGFzcz1cImJ0bi1zZWxlY3QgZnJpZ2h0XCIgdi1vbjpjbGljaz1cInNlbGVjdERlZmF1bHRWYWx1ZVZpZXdcIj4uLi48L2J1dHRvbj48L3RkPicgKyAnPC90cj4nICsgJzx0ciBzdHlsZT1cImhlaWdodDogMzVweFwiPicgKyAnPHRkIGNvbHNwYW49XCI0XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1wiPicgKyAne3t0ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHR9fScgKyAnPC90ZD4nICsgJzwvdHI+JyArICc8dHI+JyArICc8dGQgY29sc3Bhbj1cIjRcIj4nICsgJyAgICDmoKHpqozop4TliJk8YnV0dG9uIGNsYXNzPVwiYnRuLXNlbGVjdCBmcmlnaHRcIiB2LW9uOmNsaWNrPVwic2VsZWN0VmFsaWRhdGVSdWxlVmlld1wiPi4uLjwvYnV0dG9uPicgKyAnPC90ZD4nICsgJzwvdHI+JyArICc8dHI+JyArICc8dGQgY29sc3Bhbj1cIjRcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNmZmZmZmZcIj4nICsgJzx0YWJsZSBjbGFzcz1cImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXCI+JyArICc8Y29sZ3JvdXA+JyArICc8Y29sIHN0eWxlPVwid2lkdGg6IDEwMHB4XCIgLz4nICsgJzxjb2wgLz4nICsgJzwvY29sZ3JvdXA+JyArICc8dHI+JyArICc8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+5o+Q56S65raI5oGv77yaPC90ZD4nICsgJzx0ZD57e3ZhbGlkYXRlUnVsZXMubXNnfX08L3RkPicgKyAnPC90cj4nICsgJzx0cj4nICsgJzx0ZCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIj7pqozor4Hnsbvlnos8L3RkPicgKyAnPHRkIHN0eWxlPVwiYmFja2dyb3VuZDogI2U4ZWFlYzt0ZXh0LWFsaWduOiBjZW50ZXI7XCI+5Y+C5pWwPC90ZD4nICsgJzwvdHI+JyArICc8dHIgdi1mb3I9XCJydWxlSXRlbSBpbiB2YWxpZGF0ZVJ1bGVzLnJ1bGVzXCI+JyArICc8dGQgc3R5bGU9XCJiYWNrZ3JvdW5kOiAjZmZmZmZmO3RleHQtYWxpZ246IGNlbnRlcjtjb2xvcjogI2FkOTM2MVwiPnt7cnVsZUl0ZW0udmFsaWRhdGVUeXBlfX08L3RkPicgKyAnPHRkIHN0eWxlPVwiYmFja2dyb3VuZDogI2ZmZmZmZjt0ZXh0LWFsaWduOiBjZW50ZXI7XCI+PHAgdi1pZj1cInJ1bGVJdGVtLnZhbGlkYXRlUGFyYXMgPT09IFxcJ1xcJ1wiPuaXoOWPguaVsDwvcD48cCB2LWVsc2U+e3tydWxlSXRlbS52YWxpZGF0ZVBhcmFzfX08L3A+PC90ZD4nICsgJzwvdHI+JyArICc8L3RhYmxlPicgKyAnPC90ZD4nICsgJzwvdHI+JyArICc8L3RhYmxlPidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZmQtY29udHJvbC1zZWxlY3QtYmluZC10by1zaW5nbGUtZmllbGQtZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlc0RhdGFVcmw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZvclpUcmVlTm9kZUxpc3RcIixcbiAgICAgICAgZ2V0VGFibGVGaWVsZHNEYXRhVXJsOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZUZpZWxkc0J5VGFibGVJZFwiLFxuICAgICAgICBnZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzXCJcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZERhdGE6IHtcbiAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgdGFibGVOYW1lOiBcIlwiLFxuICAgICAgICB0YWJsZUNhcHRpb246IFwiXCIsXG4gICAgICAgIGZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgZmllbGRDYXB0aW9uOiBcIlwiLFxuICAgICAgICBmaWVsZERhdGFUeXBlOiBcIlwiLFxuICAgICAgICBmaWVsZExlbmd0aDogXCJcIlxuICAgICAgfSxcbiAgICAgIHRhYmxlVHJlZToge1xuICAgICAgICB0YWJsZVRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRhYmxlVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiZGlzcGxheVRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEudGFibGVJZCA9IHRyZWVOb2RlLnRhYmxlSWQ7XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS50YWJsZU5hbWUgPSB0cmVlTm9kZS50YWJsZU5hbWU7XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS50YWJsZUNhcHRpb24gPSB0cmVlTm9kZS50YWJsZUNhcHRpb247XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS5maWVsZE5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEuZmllbGRDYXB0aW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWREYXRhLmZpZWxkRGF0YVR5cGUgPSBcIlwiO1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEuZmllbGRMZW5ndGggPSBcIlwiO1xuICAgICAgICAgICAgICBfc2VsZi5maWVsZFRhYmxlLmZpZWxkRGF0YSA9IFtdO1xuXG4gICAgICAgICAgICAgIF9zZWxmLmZpbHRlckFsbEZpZWxkc1RvVGFibGUoX3NlbGYuc2VsZWN0ZWREYXRhLnRhYmxlSWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9LFxuICAgICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVRyZWVEYXRhOiBudWxsLFxuICAgICAgICBzZWxlY3RlZFRhYmxlTmFtZTogXCLml6BcIlxuICAgICAgfSxcbiAgICAgIGZpZWxkVGFibGU6IHtcbiAgICAgICAgZmllbGREYXRhOiBbXSxcbiAgICAgICAgdGFibGVIZWlnaHQ6IDQ3MCxcbiAgICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgICB0aXRsZTogJyAnLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICBrZXk6ICdpc1NlbGVjdGVkVG9CaW5kJyxcbiAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMucm93LmlzU2VsZWN0ZWRUb0JpbmQgPT0gXCIxXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIHNlbGVjdGVkXCJcbiAgICAgICAgICAgICAgfSldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IFwiXCJcbiAgICAgICAgICAgICAgfSwgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICflkI3np7AnLFxuICAgICAgICAgIGtleTogJ2ZpZWxkTmFtZScsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5qCH6aKYJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZENhcHRpb24nLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgb2xkUmVsYXRpb25EYXRhU3RyaW5nOiBcIlwiLFxuICAgICAgcmVsYXRpb25EYXRhOiBudWxsLFxuICAgICAgYWxsRmllbGRzOiBudWxsLFxuICAgICAgb2xkQmluZEZpZWxkRGF0YTogbnVsbFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdChyZWxhdGlvbkRhdGEsIG9sZEJpbmRGaWVsZERhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwi5YWz6IGU6KGo5pWw5o2u77yaXCIpO1xuICAgICAgY29uc29sZS5sb2cocmVsYXRpb25EYXRhKTtcbiAgICAgIGNvbnNvbGUubG9nKFwi5bey57uP57uR5a6a5LqG55qE5pWw5o2u77yaXCIpO1xuICAgICAgY29uc29sZS5sb2cob2xkQmluZEZpZWxkRGF0YSk7XG5cbiAgICAgIGlmIChyZWxhdGlvbkRhdGEgPT0gbnVsbCB8fCByZWxhdGlvbkRhdGEgPT0gXCJcIiB8fCByZWxhdGlvbkRhdGEubGVuZ3RoID09IDApIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7flhYjorr7nva7ooajljZXnmoTmlbDmja7lhbPogZTvvIFcIik7XG4gICAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5mZENvbnRyb2xTZWxlY3RCaW5kVG9TaW5nbGVGaWVsZERpYWxvZ1dyYXA7XG4gICAgICB2YXIgaGVpZ2h0ID0gNDUwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICB3aWR0aDogOTgwLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nnu5HlrprlrZfmrrVcIlxuICAgICAgfSk7XG4gICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgICB0aGlzLm9sZEJpbmRGaWVsZERhdGEgPSBvbGRCaW5kRmllbGREYXRhO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEgPSBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZShvbGRCaW5kRmllbGREYXRhKTtcblxuICAgICAgaWYgKEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhyZWxhdGlvbkRhdGEpICE9IHRoaXMub2xkUmVsYXRpb25EYXRhU3RyaW5nKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVsYXRpb25EYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgcmVsYXRpb25EYXRhW2ldLmRpc3BsYXlUZXh0ID0gcmVsYXRpb25EYXRhW2ldLnRhYmxlTmFtZSArIFwiW1wiICsgcmVsYXRpb25EYXRhW2ldLnRhYmxlQ2FwdGlvbiArIFwiXShcIiArIHJlbGF0aW9uRGF0YVtpXS5yZWxhdGlvblR5cGUgKyBcIilcIjtcblxuICAgICAgICAgIGlmIChyZWxhdGlvbkRhdGFbaV0ucGFyZW50SWQgPT0gXCItMVwiKSB7XG4gICAgICAgICAgICByZWxhdGlvbkRhdGFbaV0uZGlzcGxheVRleHQgPSByZWxhdGlvbkRhdGFbaV0udGFibGVOYW1lICsgXCJbXCIgKyByZWxhdGlvbkRhdGFbaV0udGFibGVDYXB0aW9uICsgXCJdXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVsYXRpb25EYXRhW2ldLmljb24gPSBcIi4uLy4uLy4uL1RoZW1lcy9QbmcxNlgxNi90YWJsZS5wbmdcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFibGVUcmVlLnRhYmxlVHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI3RhYmxlWlRyZWVVTFwiKSwgdGhpcy50YWJsZVRyZWUudGFibGVUcmVlU2V0dGluZywgcmVsYXRpb25EYXRhKTtcbiAgICAgICAgdGhpcy50YWJsZVRyZWUudGFibGVUcmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgdGhpcy5vbGRSZWxhdGlvbkRhdGFTdHJpbmcgPSBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcocmVsYXRpb25EYXRhKTtcbiAgICAgICAgdGhpcy5yZWxhdGlvbkRhdGEgPSByZWxhdGlvbkRhdGE7XG4gICAgICAgIHRoaXMuZ2V0QWxsVGFibGVzRmllbGRzKHJlbGF0aW9uRGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0RmllbGRUb1NlbGVjdGVkU3RhdHVzKHRoaXMuYWxsRmllbGRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9sZEJpbmRGaWVsZERhdGEgJiYgb2xkQmluZEZpZWxkRGF0YS50YWJsZUlkICYmIG9sZEJpbmRGaWVsZERhdGEudGFibGVJZCAhPSBcIlwiKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZE5vZGUgPSB0aGlzLnRhYmxlVHJlZS50YWJsZVRyZWVPYmouZ2V0Tm9kZUJ5UGFyYW0oXCJ0YWJsZUlkXCIsIG9sZEJpbmRGaWVsZERhdGEudGFibGVJZCk7XG4gICAgICAgIHRoaXMudGFibGVUcmVlLnRhYmxlVHJlZU9iai5zZWxlY3ROb2RlKHNlbGVjdGVkTm9kZSwgZmFsc2UsIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXRGaWVsZFRvU2VsZWN0ZWRTdGF0dXM6IGZ1bmN0aW9uIHJlc2V0RmllbGRUb1NlbGVjdGVkU3RhdHVzKF9hbGxGaWVsZHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5maWVsZFRhYmxlLmZpZWxkRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmZpZWxkVGFibGUuZmllbGREYXRhW2ldLmlzU2VsZWN0ZWRUb0JpbmQgPSBcIjBcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKF9hbGxGaWVsZHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfYWxsRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgX2FsbEZpZWxkc1tpXS5pc1NlbGVjdGVkVG9CaW5kID0gXCIwXCI7XG5cbiAgICAgICAgICBpZiAoX2FsbEZpZWxkc1tpXS5maWVsZFRhYmxlSWQgPT0gdGhpcy5vbGRCaW5kRmllbGREYXRhLnRhYmxlSWQpIHtcbiAgICAgICAgICAgIGlmIChfYWxsRmllbGRzW2ldLmZpZWxkTmFtZSA9PSB0aGlzLm9sZEJpbmRGaWVsZERhdGEuZmllbGROYW1lKSB7XG4gICAgICAgICAgICAgIF9hbGxGaWVsZHNbaV0uaXNTZWxlY3RlZFRvQmluZCA9IFwiMVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWxsRmllbGRzID0gX2FsbEZpZWxkcztcbiAgICAgIH1cblxuICAgICAgdGhpcy5maWx0ZXJBbGxGaWVsZHNUb1RhYmxlKHRoaXMub2xkQmluZEZpZWxkRGF0YS50YWJsZUlkKTtcbiAgICB9LFxuICAgIGdldEFsbFRhYmxlc0ZpZWxkczogZnVuY3Rpb24gZ2V0QWxsVGFibGVzRmllbGRzKHJlbGF0aW9uRGF0YSkge1xuICAgICAgdmFyIHRhYmxlSWRzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVsYXRpb25EYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRhYmxlSWRzLnB1c2gocmVsYXRpb25EYXRhW2ldLnRhYmxlSWQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVzRmllbGRzQnlUYWJsZUlkcywge1xuICAgICAgICBcInRhYmxlSWRzXCI6IHRhYmxlSWRzXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIHZhciBhbGxGaWVsZHMgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB2YXIgc2luZ2xlVGFibGUgPSByZXN1bHQuZXhLVkRhdGEuVGFibGVzWzBdO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwi6YeN5paw6I635Y+W5pWw5o2uXCIpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGFsbEZpZWxkcyk7XG5cbiAgICAgICAgICBfc2VsZi5yZXNldEZpZWxkVG9TZWxlY3RlZFN0YXR1cyhhbGxGaWVsZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIGZpbHRlckFsbEZpZWxkc1RvVGFibGU6IGZ1bmN0aW9uIGZpbHRlckFsbEZpZWxkc1RvVGFibGUodGFibGVJZCkge1xuICAgICAgaWYgKHRhYmxlSWQpIHtcbiAgICAgICAgdmFyIGZpZWxkcyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hbGxGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy5hbGxGaWVsZHNbaV0uZmllbGRUYWJsZUlkID09IHRhYmxlSWQpIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKHRoaXMuYWxsRmllbGRzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpZWxkVGFibGUuZmllbGREYXRhID0gZmllbGRzO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmZpZWxkVGFibGUuZmllbGREYXRhKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNlbGVjdGVkRmllbGQ6IGZ1bmN0aW9uIHNlbGVjdGVkRmllbGQoc2VsZWN0aW9uLCBpbmRleCkge1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEuZmllbGROYW1lID0gc2VsZWN0aW9uLmZpZWxkTmFtZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLmZpZWxkQ2FwdGlvbiA9IHNlbGVjdGlvbi5maWVsZENhcHRpb247XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YS5maWVsZERhdGFUeXBlID0gc2VsZWN0aW9uLmZpZWxkRGF0YVR5cGU7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YS5maWVsZExlbmd0aCA9IHNlbGVjdGlvbi5maWVsZERhdGFMZW5ndGg7XG4gICAgICB2YXIgc2VsZWN0ZWROb2RlID0gdGhpcy50YWJsZVRyZWUudGFibGVUcmVlT2JqLmdldE5vZGVCeVBhcmFtKFwidGFibGVJZFwiLCBzZWxlY3Rpb24uZmllbGRUYWJsZUlkKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLnRhYmxlSWQgPSBzZWxlY3RlZE5vZGUudGFibGVJZDtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLnRhYmxlTmFtZSA9IHNlbGVjdGVkTm9kZS50YWJsZU5hbWU7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YS50YWJsZUNhcHRpb24gPSBzZWxlY3RlZE5vZGUudGFibGVDYXB0aW9uO1xuICAgIH0sXG4gICAgc2VsZWN0Q29tcGxldGU6IGZ1bmN0aW9uIHNlbGVjdENvbXBsZXRlKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuc2VsZWN0ZWREYXRhO1xuXG4gICAgICBpZiAoIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShyZXN1bHQudGFibGVJZCkgJiYgIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShyZXN1bHQuZmllbGROYW1lKSkge1xuICAgICAgICB0aGlzLiRlbWl0KCdvbi1zZWxlY3RlZC1iaW5kLXRvLXNpbmdsZS1maWVsZCcsIHJlc3VsdCk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqemcgOimgee7keWumueahOWtl+autSFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGVhckNvbXBsZXRlOiBmdW5jdGlvbiBjbGVhckNvbXBsZXRlKCkge1xuICAgICAgd2luZG93Lk9wZW5lcldpbmRvd09ialt0aGlzLmdldFNlbGVjdEluc3RhbmNlTmFtZSgpXS5zZXRTZWxlY3RGaWVsZFJlc3VsdFZhbHVlKG51bGwpO1xuICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5mZENvbnRyb2xTZWxlY3RCaW5kVG9TaW5nbGVGaWVsZERpYWxvZ1dyYXApO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcImZkQ29udHJvbFNlbGVjdEJpbmRUb1NpbmdsZUZpZWxkRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImdlbmVyYWwtZWRpdC1wYWdlLXdyYXAgZGVzaWduLWRpYWxvZy13cmFwZXItc2luZ2xlLWRpYWxvZ1xcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0LXRhYmxlLXdyYXBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdmlkZXIgb3JpZW50YXRpb249XFxcImxlZnRcXFwiIDpkYXNoZWQ9XFxcInRydWVcXFwiIHN0eWxlPVxcXCJmb250LXNpemU6IDEycHhcXFwiPlxcdTkwMDlcXHU2MkU5XFx1ODg2ODwvZGl2aWRlcj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGlkPVxcXCJ0eHRTZWFyY2hUYWJsZVRyZWVcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMTAwJTtoZWlnaHQ6IDMycHg7bWFyZ2luLXRvcDogMnB4XFxcIiAvPi0tPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cXFwidGFibGVaVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdC1maWVsZC13cmFwZXIgaXYtbGlzdC1wYWdlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZpZGVyIG9yaWVudGF0aW9uPVxcXCJsZWZ0XFxcIiA6ZGFzaGVkPVxcXCJ0cnVlXFxcIiBzdHlsZT1cXFwiZm9udC1zaXplOiAxMnB4XFxcIj5cXHU5MDA5XFx1NjJFOVxcdTVCNTdcXHU2QkI1PC9kaXZpZGVyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIGJvcmRlciA6Y29sdW1ucz1cXFwiZmllbGRUYWJsZS5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwiZmllbGRUYWJsZS5maWVsZERhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIDpoaWdobGlnaHQtcm93PVxcXCJ0cnVlXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBvbi1yb3ctY2xpY2s9XFxcInNlbGVjdGVkRmllbGRcXFwiIDpoZWlnaHQ9XFxcImZpZWxkVGFibGUudGFibGVIZWlnaHRcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBuby1kYXRhLXRleHQ9XFxcIlxcdThCRjdcXHU5MDA5XFx1NjJFOVxcdTg4NjhcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcInNlbGVjdENvbXBsZXRlKClcXFwiPiBcXHU3ODZFIFxcdThCQTQgPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcImNsZWFyQ29tcGxldGUoKVxcXCI+IFxcdTZFMDUgXFx1N0E3QSA8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCI+XFx1NTE3MyBcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gKGV2ZW50KSB7fSwgZmFsc2UpO1xuVnVlLmNvbXBvbmVudChcIm1vZHVsZS1saXN0LWZsb3ctY29tcFwiLCB7XG4gIHByb3BzOiBbJ2xpc3RIZWlnaHQnLCAnbW9kdWxlRGF0YScsICdhY3RpdmVUYWJOYW1lJ10sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIHNhdmVNb2RlbDogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRmxvd01vZGVsL1NhdmVNb2RlbFwiLFxuICAgICAgICBnZXRFZGl0TW9kZWxVUkw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zsb3dNb2RlbC9HZXRFZGl0TW9kZWxVUkxcIixcbiAgICAgICAgZ2V0Vmlld01vZGVsVVJMOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvR2V0Vmlld01vZGVsVVJMXCIsXG4gICAgICAgIHJlbG9hZERhdGE6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zsb3dNb2RlbC9HZXRMaXN0RGF0YVwiLFxuICAgICAgICBnZXRTaW5nbGVEYXRhOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvR2V0RGV0YWlsRGF0YVwiLFxuICAgICAgICBkZWxldGU6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zsb3dNb2RlbC9EZWxldGVNb2RlbFwiLFxuICAgICAgICBtb3ZlOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvTW92ZVwiLFxuICAgICAgICBkZWZhdWx0Rmxvd01vZGVsSW1hZ2U6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zsb3dNb2RlbC9HZXRQcm9jZXNzTW9kZWxNYWluSW1nXCJcbiAgICAgIH0sXG4gICAgICBpZEZpZWxkTmFtZTogXCJtb2RlbElkXCIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IHtcbiAgICAgICAgbW9kZWxNb2R1bGVJZDoge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLlN0cmluZ1R5cGVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgIHR5cGU6ICdzZWxlY3Rpb24nLFxuICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e8luWPtycsXG4gICAgICAgIGtleTogJ21vZGVsQ29kZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICB3aWR0aDogODBcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfmtYHnqIvlkI3np7AnLFxuICAgICAgICBrZXk6ICdtb2RlbE5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+WQr+WKqEtleScsXG4gICAgICAgIGtleTogJ21vZGVsU3RhcnRLZXknLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgIGtleTogJ21vZGVsRGVzYycsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW6L6R5pe26Ze0JyxcbiAgICAgICAga2V5OiAnbW9kZWxVcGRhdGVUaW1lJyxcbiAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZVJlbmRlcmVyLlRvRGF0ZVlZWVlfTU1fREQoaCwgcGFyYW1zLnJvdy5tb2RlbFVwZGF0ZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnbW9kZWxJZCcsXG4gICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFt3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcC5lZGl0TW9kZWxCdXR0b24oaCwgcGFyYW1zLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcC5pZEZpZWxkTmFtZSwgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXApLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcC52aWV3TW9kZWxCdXR0b24oaCwgcGFyYW1zLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcC5pZEZpZWxkTmFtZSwgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXApLCBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcC5pZEZpZWxkTmFtZSwgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXApLCBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkRlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wLmlkRmllbGROYW1lLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcCldKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgdGFibGVEYXRhT3JpZ2luYWw6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiA1MDAsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgc2VhcmNoVGV4dDogXCJcIixcbiAgICAgIGZsb3dNb2RlbEVudGl0eToge1xuICAgICAgICBtb2RlbElkOiBcIlwiLFxuICAgICAgICBtb2RlbERlSWQ6IFwiXCIsXG4gICAgICAgIG1vZGVsTW9kdWxlSWQ6IFwiXCIsXG4gICAgICAgIG1vZGVsR3JvdXBJZDogXCJcIixcbiAgICAgICAgbW9kZWxOYW1lOiBcIlwiLFxuICAgICAgICBtb2RlbENyZWF0ZVRpbWU6IERhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhKCksXG4gICAgICAgIG1vZGVsQ3JlYXRlcjogXCJcIixcbiAgICAgICAgbW9kZWxVcGRhdGVUaW1lOiBEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YSgpLFxuICAgICAgICBtb2RlbFVwZGF0ZXI6IFwiXCIsXG4gICAgICAgIG1vZGVsRGVzYzogXCJcIixcbiAgICAgICAgbW9kZWxTdGF0dXM6IFwi5ZCv55SoXCIsXG4gICAgICAgIG1vZGVsT3JkZXJOdW06IFwiXCIsXG4gICAgICAgIG1vZGVsRGVwbG95bWVudElkOiBcIlwiLFxuICAgICAgICBtb2RlbFN0YXJ0S2V5OiBcIlwiLFxuICAgICAgICBtb2RlbFJlc291cmNlTmFtZTogXCJcIixcbiAgICAgICAgbW9kZWxGcm9tVHlwZTogXCJcIixcbiAgICAgICAgbW9kZWxNYWluSW1hZ2VJZDogXCJEZWZNb2RlbE1haW5JbWFnZUlkXCJcbiAgICAgIH0sXG4gICAgICBlbXB0eUZsb3dNb2RlbEVudGl0eToge30sXG4gICAgICBpbXBvcnRFWERhdGE6IHtcbiAgICAgICAgbW9kZWxNb2R1bGVJZDogXCJcIlxuICAgICAgfSxcbiAgICAgIHJ1bGVWYWxpZGF0ZToge1xuICAgICAgICBtb2RlbE5hbWU6IFt7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogJ+OAkOaooeWei+WQjeensOOAkeS4jeiDveepuu+8gScsXG4gICAgICAgICAgdHJpZ2dlcjogJ2JsdXInXG4gICAgICAgIH1dLFxuICAgICAgICBtb2RlbFN0YXJ0S2V5OiBbe1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6ICfjgJDmqKHlnotLZXnjgJHkuI3og73nqbrvvIEnLFxuICAgICAgICAgIHRyaWdnZXI6ICdibHVyJ1xuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRGbG93TW9kZWxJbWFnZVNyYzogXCJcIixcbiAgICAgIHZhbHVlMTogZmFsc2VcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wID0gdGhpcztcblxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmZsb3dNb2RlbEVudGl0eSkge1xuICAgICAgdGhpcy5lbXB0eUZsb3dNb2RlbEVudGl0eVtrZXldID0gdGhpcy5mbG93TW9kZWxFbnRpdHlba2V5XTtcbiAgICB9XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgbW9kdWxlRGF0YTogZnVuY3Rpb24gbW9kdWxlRGF0YShuZXdWYWwpIHtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0sXG4gICAgYWN0aXZlVGFiTmFtZTogZnVuY3Rpb24gYWN0aXZlVGFiTmFtZShuZXdWYWwpIHtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0sXG4gICAgc2VhcmNoVGV4dDogZnVuY3Rpb24gc2VhcmNoVGV4dChuZXdWYWwpIHtcbiAgICAgIGlmIChuZXdWYWwpIHtcbiAgICAgICAgdmFyIGZpbHRlclRhYmxlRGF0YSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgcm93ID0gdGhpcy50YWJsZURhdGFbaV07XG5cbiAgICAgICAgICBpZiAocm93Lm1vZGVsQ29kZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5tb2RlbE5hbWUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YWJsZURhdGEgPSBmaWx0ZXJUYWJsZURhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IHRoaXMudGFibGVEYXRhT3JpZ2luYWw7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKGRpYWxvZ0lkKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKGRpYWxvZ0lkKTtcbiAgICB9LFxuICAgIGdldE1vZHVsZU5hbWU6IGZ1bmN0aW9uIGdldE1vZHVsZU5hbWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2R1bGVEYXRhID09IG51bGwgPyBcIuivt+mAieS4reaooeWdl1wiIDogdGhpcy5tb2R1bGVEYXRhLm1vZHVsZVRleHQ7XG4gICAgfSxcbiAgICBzdGF0dXNFbmFibGU6IGZ1bmN0aW9uIHN0YXR1c0VuYWJsZShzdGF0dXNOYW1lKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHRoaXMuYWNJbnRlcmZhY2Uuc3RhdHVzQ2hhbmdlLCB0aGlzLnNlbGVjdGlvblJvd3MsIGFwcExpc3QuaWRGaWVsZE5hbWUsIHN0YXR1c05hbWUsIGFwcExpc3QpO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24gbW92ZSh0eXBlKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdNb3ZlRmFjZSh0aGlzLmFjSW50ZXJmYWNlLm1vdmUsIHRoaXMuc2VsZWN0aW9uUm93cywgdGhpcy5pZEZpZWxkTmFtZSwgdHlwZSwgdGhpcyk7XG4gICAgfSxcbiAgICBzZWxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZShzZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uUm93cyA9IHNlbGVjdGlvbjtcbiAgICB9LFxuICAgIHJlbG9hZERhdGE6IGZ1bmN0aW9uIHJlbG9hZERhdGEoKSB7XG4gICAgICBpZiAodGhpcy5tb2R1bGVEYXRhICE9IG51bGwgJiYgdGhpcy5hY3RpdmVUYWJOYW1lID09IFwibGlzdC1mbG93XCIpIHtcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24ubW9kZWxNb2R1bGVJZC52YWx1ZSA9IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZDtcbiAgICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVMb2FkRGF0YVNlYXJjaCh0aGlzLmFjSW50ZXJmYWNlLnJlbG9hZERhdGEsIHRoaXMucGFnZU51bSwgdGhpcy5wYWdlU2l6ZSwgdGhpcy5zZWFyY2hDb25kaXRpb24sIHRoaXMsIHRoaXMuaWRGaWVsZE5hbWUsIHRydWUsIGZ1bmN0aW9uIChyZXN1bHQsIHBhZ2VBcHBPYmopIHtcbiAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YU9yaWdpbmFsID0gcmVzdWx0LmRhdGEubGlzdDtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbiBhZGQoKSB7XG4gICAgICBpZiAodGhpcy5tb2R1bGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuT3ZlcnJpZGVPYmplY3RWYWx1ZUZ1bGwodGhpcy5mbG93TW9kZWxFbnRpdHksIHRoaXMuZW1wdHlGbG93TW9kZWxFbnRpdHkpO1xuICAgICAgICB0aGlzLmRlZmF1bHRGbG93TW9kZWxJbWFnZVNyYyA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuYWNJbnRlcmZhY2UuZGVmYXVsdEZsb3dNb2RlbEltYWdlLCB7XG4gICAgICAgICAgZmlsZUlkOiBcImRlZmF1bHRGbG93TW9kZWxJbWFnZVwiXG4gICAgICAgIH0pO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW0oXCJkaXZOZXdGbG93TW9kZWxXcmFwXCIsIHtcbiAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICB3aWR0aDogNjcwLFxuICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgIHRpdGxlOiBcIuWIm+W7uua1geeoi+aooeWei1wiXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup5qih5Z2XIVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVkaXQ6IGZ1bmN0aW9uIGVkaXQocmVjb3JkSWQpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIF9zZWxmLiRyZWZzW1wiZmxvd01vZGVsRW50aXR5XCJdLnJlc2V0RmllbGRzKCk7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRTaW5nbGVEYXRhLCB7XG4gICAgICAgIHJlY29yZElkOiByZWNvcmRJZCxcbiAgICAgICAgb3A6IFwiZWRpdFwiXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIERldGFpbFBhZ2VVdGlsaXR5Lk92ZXJyaWRlT2JqZWN0VmFsdWVGdWxsKF9zZWxmLmZsb3dNb2RlbEVudGl0eSwgcmVzdWx0LmRhdGEpO1xuICAgICAgICAgIF9zZWxmLmRlZmF1bHRGbG93TW9kZWxJbWFnZVNyYyA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKF9zZWxmLmFjSW50ZXJmYWNlLmRlZmF1bHRGbG93TW9kZWxJbWFnZSwge1xuICAgICAgICAgICAgZmlsZUlkOiBfc2VsZi5mbG93TW9kZWxFbnRpdHkubW9kZWxNYWluSW1hZ2VJZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbShcImRpdk5ld0Zsb3dNb2RlbFdyYXBcIiwge1xuICAgICAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgICAgICB3aWR0aDogNjAwLFxuICAgICAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgICAgICB0aXRsZTogXCLnvJbovpHmtYHnqIvmqKHlnovmpoLlhrVcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gZGVsKHJlY29yZElkKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZURlbGV0ZVJvdyh0aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZSwgcmVjb3JkSWQsIHRoaXMpO1xuICAgIH0sXG4gICAgaGFuZGxlU3VibWl0Rmxvd01vZGVsRWRpdDogZnVuY3Rpb24gaGFuZGxlU3VibWl0Rmxvd01vZGVsRWRpdChuYW1lKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLiRyZWZzW25hbWVdLnZhbGlkYXRlKGZ1bmN0aW9uICh2YWxpZCkge1xuICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICBfc2VsZi5mbG93TW9kZWxFbnRpdHkubW9kZWxNb2R1bGVJZCA9IF9zZWxmLm1vZHVsZURhdGEubW9kdWxlSWQ7XG5cbiAgICAgICAgICB2YXIgX2Rlc2lnbk1vZGVsID0gX3NlbGYuZmxvd01vZGVsRW50aXR5Lm1vZGVsSWQgPT0gXCJcIiA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICAgIHZhciBzZW5kRGF0YSA9IEpTT04uc3RyaW5naWZ5KF9zZWxmLmZsb3dNb2RlbEVudGl0eSk7XG4gICAgICAgICAgQWpheFV0aWxpdHkuUG9zdFJlcXVlc3RCb2R5KF9zZWxmLmFjSW50ZXJmYWNlLnNhdmVNb2RlbCwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBfc2VsZi5oYW5kbGVDbG9zZShcImRpdk5ld0Zsb3dNb2RlbFdyYXBcIik7XG5cbiAgICAgICAgICAgICAgX3NlbGYucmVsb2FkRGF0YSgpO1xuXG4gICAgICAgICAgICAgIGlmIChfZGVzaWduTW9kZWwpIHtcbiAgICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdXaW5kb3cod2luZG93LCBcImVkaXRNb2RlbFdlYldpbmRvd1wiLCByZXN1bHQuZGF0YS5lZGl0TW9kZWxXZWJVcmwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy4kTWVzc2FnZS5lcnJvcignRmFpbCEnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBpbXBvcnRNb2RlbDogZnVuY3Rpb24gaW1wb3J0TW9kZWwoKSB7XG4gICAgICBpZiAodGhpcy5tb2R1bGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuT3ZlcnJpZGVPYmplY3RWYWx1ZUZ1bGwodGhpcy5mbG93TW9kZWxFbnRpdHksIHRoaXMuZW1wdHlGbG93TW9kZWxFbnRpdHkpO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW0oXCJkaXZJbXBvcnRGbG93TW9kZWxXcmFwXCIsIHtcbiAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICB3aWR0aDogNjAwLFxuICAgICAgICAgIGhlaWdodDogMzAwLFxuICAgICAgICAgIHRpdGxlOiBcIuWvvOWFpea1geeoi+aooeWei1wiXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup5qih5Z2XIVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHVwbG9hZFN1Y2Nlc3M6IGZ1bmN0aW9uIHVwbG9hZFN1Y2Nlc3MocmVzcG9uc2UsIGZpbGUsIGZpbGVMaXN0KSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzcG9uc2UubWVzc2FnZSwgbnVsbCk7XG5cbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzID09IHRydWUpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDbG9zZSgnZGl2SW1wb3J0Rmxvd01vZGVsV3JhcCcpO1xuICAgICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJpbmRVcGxvYWRFeERhdGE6IGZ1bmN0aW9uIGJpbmRVcGxvYWRFeERhdGEoKSB7XG4gICAgICB0aGlzLmltcG9ydEVYRGF0YS5tb2RlbE1vZHVsZUlkID0gdGhpcy5tb2R1bGVEYXRhLm1vZHVsZUlkO1xuICAgIH0sXG4gICAgdXBsb2FkRmxvd01vZGVsSW1hZ2VTdWNjZXNzOiBmdW5jdGlvbiB1cGxvYWRGbG93TW9kZWxJbWFnZVN1Y2Nlc3MocmVzcG9uc2UsIGZpbGUsIGZpbGVMaXN0KSB7XG4gICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB0aGlzLmZsb3dNb2RlbEVudGl0eS5tb2RlbE1haW5JbWFnZUlkID0gZGF0YS5maWxlSWQ7XG4gICAgICB0aGlzLmRlZmF1bHRGbG93TW9kZWxJbWFnZVNyYyA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuYWNJbnRlcmZhY2UuZGVmYXVsdEZsb3dNb2RlbEltYWdlLCB7XG4gICAgICAgIGZpbGVJZDogdGhpcy5mbG93TW9kZWxFbnRpdHkubW9kZWxNYWluSW1hZ2VJZFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBlZGl0TW9kZWxCdXR0b246IGZ1bmN0aW9uIGVkaXRNb2RlbEJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiBlZGl0LW1vZGVsXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5lZGl0TW9kZWwocGFyYW1zLnJvd1tpZEZpZWxkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHZpZXdNb2RlbEJ1dHRvbjogZnVuY3Rpb24gdmlld01vZGVsQnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIHZpZXctbW9kZWxcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnZpZXdNb2RlbChwYXJhbXMucm93W2lkRmllbGRdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZWRpdE1vZGVsOiBmdW5jdGlvbiBlZGl0TW9kZWwocmVjb3JkSWQpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRFZGl0TW9kZWxVUkwsIHtcbiAgICAgICAgbW9kZWxJZDogcmVjb3JkSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgcmVzdWx0LmRhdGEuZWRpdE1vZGVsV2ViVXJsLCB7XG4gICAgICAgICAgdGl0bGU6IFwi5rWB56iL6K6+6K6hXCIsXG4gICAgICAgICAgbW9kYWw6IHRydWVcbiAgICAgICAgfSwgMCk7XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICB2aWV3TW9kZWw6IGZ1bmN0aW9uIHZpZXdNb2RlbChyZWNvcmRJZCkge1xuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFZpZXdNb2RlbFVSTCwge1xuICAgICAgICBtb2RlbElkOiByZWNvcmRJZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCByZXN1bHQuZGF0YS5lZGl0TW9kZWxXZWJVcmwsIHtcbiAgICAgICAgICB0aXRsZTogXCLmtYHnqIvmtY/op4hcIixcbiAgICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm1vZHVsZS1saXN0LXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgaWQ9XCJkaXZOZXdGbG93TW9kZWxXcmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcIiBzdHlsZT1cInBhZGRpbmc6IDEwcHg7d2lkdGg6IDEwMCVcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiA3MCU7ZmxvYXQ6IGxlZnRcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gcmVmPVwiZmxvd01vZGVsRW50aXR5XCIgOm1vZGVsPVwiZmxvd01vZGVsRW50aXR5XCIgOnJ1bGVzPVwicnVsZVZhbGlkYXRlXCIgOmxhYmVsLXdpZHRoPVwiMTAwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cIuaooeWei+WQjeensO+8mlwiIHByb3A9XCJtb2RlbE5hbWVcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cImZsb3dNb2RlbEVudGl0eS5tb2RlbE5hbWVcIj48L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cIuaooeWei0tlee+8mlwiIHByb3A9XCJtb2RlbFN0YXJ0S2V5XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XCJmbG93TW9kZWxFbnRpdHkubW9kZWxTdGFydEtleVwiPjwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVwi5o+P6L+w77yaXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XCJmbG93TW9kZWxFbnRpdHkubW9kZWxEZXNjXCIgdHlwZT1cInRleHRhcmVhXCIgOmF1dG9zaXplPVwie21pblJvd3M6IDExLG1heFJvd3M6IDExfVwiPjwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiAyOSU7ZmxvYXQ6IHJpZ2h0XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgOnNyYz1cImRlZmF1bHRGbG93TW9kZWxJbWFnZVNyY1wiIGNsYXNzPVwiZmxvd01vZGVsSW1nXCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVwbG9hZCBzdHlsZT1cIm1hcmdpbjoxMHB4IDEycHggMCAyMHB4XCIgOmRhdGE9XCJpbXBvcnRFWERhdGFcIiA6YmVmb3JlLXVwbG9hZD1cImJpbmRVcGxvYWRFeERhdGFcIiA6b24tc3VjY2Vzcz1cInVwbG9hZEZsb3dNb2RlbEltYWdlU3VjY2Vzc1wiIG11bHRpcGxlIHR5cGU9XCJkcmFnXCIgbmFtZT1cImZpbGVcIiBhY3Rpb249XCIuLi8uLi8uLi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvVXBsb2FkUHJvY2Vzc01vZGVsTWFpbkltZy5kb1wiIGFjY2VwdD1cIi5wbmdcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwicGFkZGluZzoyMHB4IDBweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aWNvbiB0eXBlPVwiaW9zLWNsb3VkLXVwbG9hZFwiIHNpemU9XCI1MlwiIHN0eWxlPVwiY29sb3I6ICMzMzk5ZmZcIj48L2ljb24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPuS4iuS8oOa1geeoi+S4u+mimOWbvueJhzwvcD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdXBsb2FkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1vdXRlci13cmFwXCIgc3R5bGU9XCJoZWlnaHQ6IDQwcHg7cGFkZGluZy1yaWdodDogMTBweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1pbm5lci13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwiaGFuZGxlU3VibWl0Rmxvd01vZGVsRWRpdChcXCdmbG93TW9kZWxFbnRpdHlcXCcpXCI+IOS/nSDlrZg8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVwiaGFuZGxlQ2xvc2UoXFwnZGl2TmV3Rmxvd01vZGVsV3JhcFxcJylcIj7lhbMg6ZetPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBpZD1cImRpdkltcG9ydEZsb3dNb2RlbFdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFwiIHN0eWxlPVwicGFkZGluZzogMTBweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXBsb2FkIDpkYXRhPVwiaW1wb3J0RVhEYXRhXCIgOmJlZm9yZS11cGxvYWQ9XCJiaW5kVXBsb2FkRXhEYXRhXCIgOm9uLXN1Y2Nlc3M9XCJ1cGxvYWRTdWNjZXNzXCIgbXVsdGlwbGUgdHlwZT1cImRyYWdcIiBuYW1lPVwiZmlsZVwiIGFjdGlvbj1cIi4uLy4uLy4uL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zsb3dNb2RlbC9JbXBvcnRQcm9jZXNzTW9kZWwuZG9cIiBhY2NlcHQ9XCIuYnBtblwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cInBhZGRpbmc6IDIwcHggMFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpY29uIHR5cGU9XCJpb3MtY2xvdWQtdXBsb2FkXCIgc2l6ZT1cIjUyXCIgc3R5bGU9XCJjb2xvcjogIzMzOTlmZlwiPjwvaWNvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5DbGljayBvciBkcmFnIGZpbGVzIGhlcmUgdG8gdXBsb2FkPC9wPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdXBsb2FkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLW91dGVyLXdyYXBcIiBzdHlsZT1cImhlaWdodDogNDBweDtwYWRkaW5nLXJpZ2h0OiAxMHB4XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLWlubmVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVwiaGFuZGxlQ2xvc2UoXFwnZGl2SW1wb3J0Rmxvd01vZGVsV3JhcFxcJylcIj7lhbMg6ZetPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3QtYnV0dG9uLXdyYXBcIiBjbGFzcz1cImxpc3QtYnV0dG9uLW91dGVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kdWxlLWxpc3QtbmFtZVwiPjxJY29uIHR5cGU9XCJpb3MtYXJyb3ctZHJvcHJpZ2h0LWNpcmNsZVwiIC8+Jm5ic3A75qih5Z2X44CQe3tnZXRNb2R1bGVOYW1lKCl9feOAkTwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWJ1dHRvbi1pbm5lci13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiAgdHlwZT1cInN1Y2Nlc3NcIiBAY2xpY2s9XCJhZGQoKVwiIGljb249XCJtZC1hZGRcIj7mlrDlop48L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwiaW1wb3J0TW9kZWwoKVwiIGljb249XCJtZC1hZGRcIj7kuIrkvKDmqKHlnosgPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYWxidW1zXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+5aSN5Yi2PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYm9va21hcmtzXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+5Y6G5Y+y5qih5Z6LPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYnJ1c2hcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj7lpI3liLZJRDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ3VwXFwnKVwiIGljb249XCJtZC1hcnJvdy11cFwiPuS4iuenuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ2Rvd25cXCcpXCIgaWNvbj1cIm1kLWFycm93LWRvd25cIj7kuIvnp7s8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogcmlnaHQ7d2lkdGg6IDIwMHB4O21hcmdpbi1yaWdodDogMTBweDtcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVwiaW5wdXRfYm9yZGVyX2JvdHRvbVwiIHYtbW9kZWw9XCJzZWFyY2hUZXh0XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY2xlYXI6IGJvdGhcIj48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cImxpc3RIZWlnaHRcIiBzdHJpcGUgYm9yZGVyIDpjb2x1bW5zPVwiY29sdW1uc0NvbmZpZ1wiIDpkYXRhPVwidGFibGVEYXRhXCJcXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiaXYtbGlzdC10YWJsZVwiIDpoaWdobGlnaHQtcm93PVwidHJ1ZVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tc2VsZWN0aW9uLWNoYW5nZT1cInNlbGVjdGlvbkNoYW5nZVwiPjwvaS10YWJsZT5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJtb2R1bGUtbGlzdC13ZWJmb3JtLWNvbXBcIiwge1xuICBwcm9wczogWydsaXN0SGVpZ2h0JywgJ21vZHVsZURhdGEnLCAnYWN0aXZlVGFiTmFtZSddLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZWRpdFZpZXc6IFwiL0hUTUwvQnVpbGRlci9Gb3JtL0Zvcm1EZXNpZ24uaHRtbFwiLFxuICAgICAgICByZWxvYWREYXRhOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9Gb3JtL0dldExpc3REYXRhXCIsXG4gICAgICAgIGRlbGV0ZTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRm9ybS9EZWxldGVcIixcbiAgICAgICAgbW92ZTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRm9ybS9Nb3ZlXCJcbiAgICAgIH0sXG4gICAgICBpZEZpZWxkTmFtZTogXCJmb3JtSWRcIixcbiAgICAgIHNlYXJjaENvbmRpdGlvbjoge1xuICAgICAgICBmb3JtTW9kdWxlSWQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0eXBlOiAnc2VsZWN0aW9uJyxcbiAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJblj7cnLFxuICAgICAgICBrZXk6ICdmb3JtQ29kZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICB3aWR0aDogODBcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfooajljZXlkI3np7AnLFxuICAgICAgICBrZXk6ICdmb3JtTmFtZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5ZSv5LiA5ZCNJyxcbiAgICAgICAga2V5OiAnZm9ybVNpbmdsZU5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgIGtleTogJ2Zvcm1EZXNjJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJbovpHml7bpl7QnLFxuICAgICAgICBrZXk6ICdmb3JtVXBkYXRlVGltZScsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVSZW5kZXJlci5Ub0RhdGVZWVlZX01NX0REKGgsIHBhcmFtcy5yb3cuZm9ybVVwZGF0ZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAga2V5OiAnZm9ybUlkJyxcbiAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgfSwgW0xpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRWRpdEJ1dHRvbihoLCBwYXJhbXMsIF9zZWxmLmlkRmllbGROYW1lLCBfc2VsZiksIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgX3NlbGYuaWRGaWVsZE5hbWUsIF9zZWxmKV0pO1xuICAgICAgICB9XG4gICAgICB9XSxcbiAgICAgIHRhYmxlRGF0YTogW10sXG4gICAgICB0YWJsZURhdGFPcmlnaW5hbDogW10sXG4gICAgICBzZWxlY3Rpb25Sb3dzOiBudWxsLFxuICAgICAgcGFnZVRvdGFsOiAwLFxuICAgICAgcGFnZVNpemU6IDUwMCxcbiAgICAgIHBhZ2VOdW06IDEsXG4gICAgICBzZWFyY2hUZXh0OiBcIlwiXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB3aW5kb3cuX21vZHVsZWxpc3R3ZWJmb3JtY29tcCA9IHRoaXM7XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgbW9kdWxlRGF0YTogZnVuY3Rpb24gbW9kdWxlRGF0YShuZXdWYWwpIHtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0sXG4gICAgYWN0aXZlVGFiTmFtZTogZnVuY3Rpb24gYWN0aXZlVGFiTmFtZShuZXdWYWwpIHtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0sXG4gICAgc2VhcmNoVGV4dDogZnVuY3Rpb24gc2VhcmNoVGV4dChuZXdWYWwpIHtcbiAgICAgIGlmIChuZXdWYWwpIHtcbiAgICAgICAgdmFyIGZpbHRlclRhYmxlRGF0YSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgcm93ID0gdGhpcy50YWJsZURhdGFbaV07XG5cbiAgICAgICAgICBpZiAocm93LmZvcm1Db2RlLmluZGV4T2YobmV3VmFsKSA+PSAwKSB7XG4gICAgICAgICAgICBmaWx0ZXJUYWJsZURhdGEucHVzaChyb3cpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocm93LmZvcm1OYW1lLmluZGV4T2YobmV3VmFsKSA+PSAwKSB7XG4gICAgICAgICAgICBmaWx0ZXJUYWJsZURhdGEucHVzaChyb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gZmlsdGVyVGFibGVEYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50YWJsZURhdGEgPSB0aGlzLnRhYmxlRGF0YU9yaWdpbmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGdldE1vZHVsZU5hbWU6IGZ1bmN0aW9uIGdldE1vZHVsZU5hbWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2R1bGVEYXRhID09IG51bGwgPyBcIuivt+mAieS4reaooeWdl1wiIDogdGhpcy5tb2R1bGVEYXRhLm1vZHVsZVRleHQ7XG4gICAgfSxcbiAgICBzZWxlY3Rpb25DaGFuZ2U6IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZShzZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uUm93cyA9IHNlbGVjdGlvbjtcbiAgICB9LFxuICAgIHJlbG9hZERhdGE6IGZ1bmN0aW9uIHJlbG9hZERhdGEoKSB7XG4gICAgICBpZiAodGhpcy5tb2R1bGVEYXRhICE9IG51bGwgJiYgdGhpcy5hY3RpdmVUYWJOYW1lID09IFwibGlzdC13ZWJmb3JtXCIpIHtcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24uZm9ybU1vZHVsZUlkLnZhbHVlID0gdGhpcy5tb2R1bGVEYXRhLm1vZHVsZUlkO1xuICAgICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoKHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkRGF0YSwgdGhpcy5wYWdlTnVtLCB0aGlzLnBhZ2VTaXplLCB0aGlzLnNlYXJjaENvbmRpdGlvbiwgdGhpcywgdGhpcy5pZEZpZWxkTmFtZSwgdHJ1ZSwgZnVuY3Rpb24gKHJlc3VsdCwgcGFnZUFwcE9iaikge1xuICAgICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhT3JpZ2luYWwgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZCgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdFZpZXcsIHtcbiAgICAgICAgICBcIm9wXCI6IFwiYWRkXCIsXG4gICAgICAgICAgXCJtb2R1bGVJZFwiOiB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWRcbiAgICAgICAgfSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuT3Blbk5ld1dpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICB9LCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqeaooeWdlyFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlZGl0OiBmdW5jdGlvbiBlZGl0KHJlY29yZElkKSB7XG4gICAgICBkZWJ1Z2dlcjtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICBcIm9wXCI6IFwidXBkYXRlXCIsXG4gICAgICAgIFwicmVjb3JkSWRcIjogcmVjb3JkSWRcbiAgICAgIH0pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3V2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDBcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiBkZWwocmVjb3JkSWQpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlRGVsZXRlUm93KHRoaXMuYWNJbnRlcmZhY2UuZGVsZXRlLCByZWNvcmRJZCwgdGhpcyk7XG4gICAgfSxcbiAgICBzdGF0dXNFbmFibGU6IGZ1bmN0aW9uIHN0YXR1c0VuYWJsZShzdGF0dXNOYW1lKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHRoaXMuYWNJbnRlcmZhY2Uuc3RhdHVzQ2hhbmdlLCB0aGlzLnNlbGVjdGlvblJvd3MsIGFwcExpc3QuaWRGaWVsZE5hbWUsIHN0YXR1c05hbWUsIGFwcExpc3QpO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24gbW92ZSh0eXBlKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdNb3ZlRmFjZSh0aGlzLmFjSW50ZXJmYWNlLm1vdmUsIHRoaXMuc2VsZWN0aW9uUm93cywgdGhpcy5pZEZpZWxkTmFtZSwgdHlwZSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtb2R1bGUtbGlzdC13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibGlzdC1idXR0b24td3JhcFwiIGNsYXNzPVwibGlzdC1idXR0b24tb3V0ZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2R1bGUtbGlzdC1uYW1lXCI+PEljb24gdHlwZT1cImlvcy1hcnJvdy1kcm9wcmlnaHQtY2lyY2xlXCIgLz4mbmJzcDvmqKHlnZfjgJB7e2dldE1vZHVsZU5hbWUoKX1944CRPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtYnV0dG9uLWlubmVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uICB0eXBlPVwic3VjY2Vzc1wiIEBjbGljaz1cImFkZCgpXCIgaWNvbj1cIm1kLWFkZFwiPuaWsOWinjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBkaXNhYmxlZCBpY29uPVwibWQtYWRkXCI+5byV5YWlVVJMIDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBkaXNhYmxlZCBpY29uPVwibWQtYWxidW1zXCI+5aSN5Yi2PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIGRpc2FibGVkIGljb249XCJtZC1wcmljZXRhZ1wiPumihOiniDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBkaXNhYmxlZCBpY29uPVwibWQtYm9va21hcmtzXCI+5Y6G5Y+y54mI5pysPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIGRpc2FibGVkIGljb249XCJtZC1icnVzaFwiPuWkjeWItklEPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cIm1vdmUoXFwndXBcXCcpXCIgaWNvbj1cIm1kLWFycm93LXVwXCI+5LiK56e7PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cIm1vdmUoXFwnZG93blxcJylcIiBpY29uPVwibWQtYXJyb3ctZG93blwiPuS4i+enuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogcmlnaHQ7d2lkdGg6IDIwMHB4O21hcmdpbi1yaWdodDogMTBweDtcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVwiaW5wdXRfYm9yZGVyX2JvdHRvbVwiIHYtbW9kZWw9XCJzZWFyY2hUZXh0XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY2xlYXI6IGJvdGhcIj48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cImxpc3RIZWlnaHRcIiBzdHJpcGUgYm9yZGVyIDpjb2x1bW5zPVwiY29sdW1uc0NvbmZpZ1wiIDpkYXRhPVwidGFibGVEYXRhXCJcXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiaXYtbGlzdC10YWJsZVwiIDpoaWdobGlnaHQtcm93PVwidHJ1ZVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tc2VsZWN0aW9uLWNoYW5nZT1cInNlbGVjdGlvbkNoYW5nZVwiPjwvaS10YWJsZT5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJtb2R1bGUtbGlzdC13ZWJsaXN0LWNvbXBcIiwge1xuICBwcm9wczogWydsaXN0SGVpZ2h0JywgJ21vZHVsZURhdGEnLCAnYWN0aXZlVGFiTmFtZSddLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBlZGl0VmlldzogXCIvSFRNTC9CdWlsZGVyL0xpc3QvTGlzdERlc2lnbi5odG1sXCIsXG4gICAgICAgIHJlbG9hZERhdGE6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0xpc3QvR2V0TGlzdERhdGFcIixcbiAgICAgICAgZGVsZXRlOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9MaXN0L0RlbGV0ZVwiLFxuICAgICAgICBtb3ZlOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9MaXN0L01vdmVcIlxuICAgICAgfSxcbiAgICAgIGlkRmllbGROYW1lOiBcImZvcm1JZFwiLFxuICAgICAgc2VhcmNoQ29uZGl0aW9uOiB7XG4gICAgICAgIGZvcm1Nb2R1bGVJZDoge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLlN0cmluZ1R5cGVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgIHR5cGU6ICdzZWxlY3Rpb24nLFxuICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e8luWPtycsXG4gICAgICAgIGtleTogJ2Zvcm1Db2RlJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHdpZHRoOiA4MFxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+ihqOWNleWQjeensCcsXG4gICAgICAgIGtleTogJ2Zvcm1OYW1lJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfllK/kuIDlkI0nLFxuICAgICAgICBrZXk6ICdmb3JtU2luZ2xlTmFtZScsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5aSH5rOoJyxcbiAgICAgICAga2V5OiAnZm9ybURlc2MnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e8lui+keaXtumXtCcsXG4gICAgICAgIGtleTogJ2Zvcm1VcGRhdGVUaW1lJyxcbiAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZVJlbmRlcmVyLlRvRGF0ZVlZWVlfTU1fREQoaCwgcGFyYW1zLnJvdy5mb3JtVXBkYXRlVGltZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICBrZXk6ICdmb3JtSWQnLFxuICAgICAgICB3aWR0aDogMTIwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICB9LCBbTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5FZGl0QnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0d2ViZm9ybWNvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdHdlYmZvcm1jb21wKSwgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5EZWxldGVCdXR0b24oaCwgcGFyYW1zLCB3aW5kb3cuX21vZHVsZWxpc3R3ZWJmb3JtY29tcC5pZEZpZWxkTmFtZSwgd2luZG93Ll9tb2R1bGVsaXN0d2ViZm9ybWNvbXApXSk7XG4gICAgICAgIH1cbiAgICAgIH1dLFxuICAgICAgdGFibGVEYXRhOiBbXSxcbiAgICAgIHRhYmxlRGF0YU9yaWdpbmFsOiBbXSxcbiAgICAgIHNlbGVjdGlvblJvd3M6IG51bGwsXG4gICAgICBwYWdlVG90YWw6IDAsXG4gICAgICBwYWdlU2l6ZTogNTAwLFxuICAgICAgcGFnZU51bTogMSxcbiAgICAgIHNlYXJjaFRleHQ6IFwiXCJcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHdpbmRvdy5fbW9kdWxlbGlzdHdlYmxpc3Rjb21wID0gdGhpcztcbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBtb2R1bGVEYXRhOiBmdW5jdGlvbiBtb2R1bGVEYXRhKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBhY3RpdmVUYWJOYW1lOiBmdW5jdGlvbiBhY3RpdmVUYWJOYW1lKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBzZWFyY2hUZXh0OiBmdW5jdGlvbiBzZWFyY2hUZXh0KG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICB2YXIgZmlsdGVyVGFibGVEYXRhID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlRGF0YVtpXTtcblxuICAgICAgICAgIGlmIChyb3cuZm9ybUNvZGUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyb3cuZm9ybU5hbWUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YWJsZURhdGEgPSBmaWx0ZXJUYWJsZURhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IHRoaXMudGFibGVEYXRhT3JpZ2luYWw7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgZ2V0TW9kdWxlTmFtZTogZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vZHVsZURhdGEgPT0gbnVsbCA/IFwi6K+36YCJ5Lit5qih5Z2XXCIgOiB0aGlzLm1vZHVsZURhdGEubW9kdWxlVGV4dDtcbiAgICB9LFxuICAgIHNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlKHNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gc2VsZWN0aW9uO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCAmJiB0aGlzLmFjdGl2ZVRhYk5hbWUgPT0gXCJsaXN0LXdlYmZvcm1cIikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5mb3JtTW9kdWxlSWQudmFsdWUgPSB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWQ7XG4gICAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlTG9hZERhdGFTZWFyY2godGhpcy5hY0ludGVyZmFjZS5yZWxvYWREYXRhLCB0aGlzLnBhZ2VOdW0sIHRoaXMucGFnZVNpemUsIHRoaXMuc2VhcmNoQ29uZGl0aW9uLCB0aGlzLCB0aGlzLmlkRmllbGROYW1lLCB0cnVlLCBmdW5jdGlvbiAocmVzdWx0LCBwYWdlQXBwT2JqKSB7XG4gICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFPcmlnaW5hbCA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJhZGRcIixcbiAgICAgICAgICBcIm1vZHVsZUlkXCI6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3V2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgIH0sIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup5qih5Z2XIVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVkaXQ6IGZ1bmN0aW9uIGVkaXQocmVjb3JkSWQpIHtcbiAgICAgIGRlYnVnZ2VyO1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRWaWV3LCB7XG4gICAgICAgIFwib3BcIjogXCJ1cGRhdGVcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZFxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGhlaWdodDogMFxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBkZWw6IGZ1bmN0aW9uIGRlbChyZWNvcmRJZCkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVEZWxldGVSb3codGhpcy5hY0ludGVyZmFjZS5kZWxldGUsIHJlY29yZElkLCB0aGlzKTtcbiAgICB9LFxuICAgIHN0YXR1c0VuYWJsZTogZnVuY3Rpb24gc3RhdHVzRW5hYmxlKHN0YXR1c05hbWUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2UodGhpcy5hY0ludGVyZmFjZS5zdGF0dXNDaGFuZ2UsIHRoaXMuc2VsZWN0aW9uUm93cywgYXBwTGlzdC5pZEZpZWxkTmFtZSwgc3RhdHVzTmFtZSwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbiBtb3ZlKHR5cGUpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld01vdmVGYWNlKHRoaXMuYWNJbnRlcmZhY2UubW92ZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCB0aGlzLmlkRmllbGROYW1lLCB0eXBlLCB0aGlzKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm1vZHVsZS1saXN0LXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0LWJ1dHRvbi13cmFwXCIgY2xhc3M9XCJsaXN0LWJ1dHRvbi1vdXRlci13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZHVsZS1saXN0LW5hbWVcIj48SWNvbiB0eXBlPVwiaW9zLWFycm93LWRyb3ByaWdodC1jaXJjbGVcIiAvPiZuYnNwO+aooeWdl+OAkHt7Z2V0TW9kdWxlTmFtZSgpfX3jgJE8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1idXR0b24taW5uZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gIHR5cGU9XCJzdWNjZXNzXCIgQGNsaWNrPVwiYWRkKClcIiBpY29uPVwibWQtYWRkXCI+5paw5aKePC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYWxidW1zXCI+5aSN5Yi2PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtcHJpY2V0YWdcIj7pooTop4g8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJlcnJvclwiIGljb249XCJtZC1ib29rbWFya3NcIj7ljoblj7LniYjmnKw8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJlcnJvclwiIGljb249XCJtZC1icnVzaFwiPuWkjeWItklEPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cIm1vdmUoXFwndXBcXCcpXCIgaWNvbj1cIm1kLWFycm93LXVwXCI+5LiK56e7PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cIm1vdmUoXFwnZG93blxcJylcIiBpY29uPVwibWQtYXJyb3ctZG93blwiPuS4i+enuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogcmlnaHQ7d2lkdGg6IDIwMHB4O21hcmdpbi1yaWdodDogMTBweDtcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVwiaW5wdXRfYm9yZGVyX2JvdHRvbVwiIHYtbW9kZWw9XCJzZWFyY2hUZXh0XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY2xlYXI6IGJvdGhcIj48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cImxpc3RIZWlnaHRcIiBzdHJpcGUgYm9yZGVyIDpjb2x1bW5zPVwiY29sdW1uc0NvbmZpZ1wiIDpkYXRhPVwidGFibGVEYXRhXCJcXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiaXYtbGlzdC10YWJsZVwiIDpoaWdobGlnaHQtcm93PVwidHJ1ZVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tc2VsZWN0aW9uLWNoYW5nZT1cInNlbGVjdGlvbkNoYW5nZVwiPjwvaS10YWJsZT5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzZWxlY3Qtb3JnYW4tY29tcFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldE9yZ2FuRGF0YVVybDogXCIvUGxhdEZvcm1SZXN0L1NTTy9Pcmdhbi9HZXRGdWxsT3JnYW5cIlxuICAgICAgfSxcbiAgICAgIGpzRWRpdG9ySW5zdGFuY2U6IG51bGwsXG4gICAgICBvcmdhblRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJvcmdhbk5hbWVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJvcmdhbklkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJvcmdhblBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmVlRGF0YTogbnVsbCxcbiAgICAgICAgY2xpY2tOb2RlOiBudWxsXG4gICAgICB9LFxuICAgICAgc2VhcmNoT3JnYW5UZXh0OiBcIlwiLFxuICAgICAgc2VsZWN0ZWRPcmdhbkNvbmZpZzogW3tcbiAgICAgICAgdGl0bGU6ICfnu4Tnu4flkI3np7AnLFxuICAgICAgICBrZXk6ICdvcmdhbk5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgIGtleTogJ29yZ2FuSWQnLFxuICAgICAgICB3aWR0aDogNjUsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkRlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wLmlkRmllbGROYW1lLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcCldKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICBzZWxlY3RlZE9yZ2FuRGF0YTogW11cbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuZ2V0T3JnYW5EYXRhSW5pdFRyZWUoKTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGJlZ2luU2VsZWN0T3JnYW46IGZ1bmN0aW9uIGJlZ2luU2VsZWN0T3JnYW4oKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0T3JnYW5Nb2RlbERpYWxvZ1dyYXA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDY3MCxcbiAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqee7hOe7h+acuuaehFwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldE9yZ2FuRGF0YUluaXRUcmVlOiBmdW5jdGlvbiBnZXRPcmdhbkRhdGFJbml0VHJlZSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRPcmdhbkRhdGFVcmwsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLm9yZ2FuVHJlZS50cmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgX3NlbGYuJHJlZnMub3JnYW5aVHJlZVVMLnNldEF0dHJpYnV0ZShcImlkXCIsIFwic2VsZWN0LW9yZ2FuLWNvbXAtXCIgKyBTdHJpbmdVdGlsaXR5Lkd1aWQoKSk7XG5cbiAgICAgICAgICBfc2VsZi5vcmdhblRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKF9zZWxmLiRyZWZzLm9yZ2FuWlRyZWVVTCksIF9zZWxmLm9yZ2FuVHJlZS50cmVlU2V0dGluZywgX3NlbGYub3JnYW5UcmVlLnRyZWVEYXRhKTtcblxuICAgICAgICAgIF9zZWxmLm9yZ2FuVHJlZS50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcblxuICAgICAgICAgIGZ1enp5U2VhcmNoVHJlZU9iaihfc2VsZi5vcmdhblRyZWUudHJlZU9iaiwgX3NlbGYuJHJlZnMudHh0X29yZ2FuX3NlYXJjaF90ZXh0LiRyZWZzLmlucHV0LCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICBzZWxlY3RlZE9yZ2FuOiBmdW5jdGlvbiBzZWxlY3RlZE9yZ2FuKHRyZWVOb2RlKSB7XG4gICAgICBpZiAoIXRyZWVOb2RlKSB7fVxuXG4gICAgICB0aGlzLnNlbGVjdGVkT3JnYW5EYXRhLnB1c2godHJlZU5vZGUpO1xuICAgIH0sXG4gICAgcmVtb3ZlQWxsT3JnYW46IGZ1bmN0aW9uIHJlbW92ZUFsbE9yZ2FuKCkge30sXG4gICAgcmVtb3ZlU2luZ2xlT3JnYW46IGZ1bmN0aW9uIHJlbW92ZVNpbmdsZU9yZ2FuKCkge31cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdC12aWV3LW9yZ2FuLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRleHRcXFwiPlxcdThCRjdcXHU5MDA5XFx1NjJFOVxcdTdFQzRcXHU3RUM3PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidmFsdWVcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlkXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b25cXFwiIEBjbGljaz1cXFwiYmVnaW5TZWxlY3RPcmdhbigpXFxcIj48SWNvbiB0eXBlPVxcXCJpb3MtZnVubmVsXFxcIiAvPiZuYnNwO1xcdTkwMDlcXHU2MkU5PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPVxcXCJzZWxlY3RPcmdhbk1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMzLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjMy1zZWxlY3QtbW9kZWwtc291cmNlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XFxcImlucHV0X2JvcmRlcl9ib3R0b21cXFwiIHJlZj1cXFwidHh0X29yZ2FuX3NlYXJjaF90ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1OEJGN1xcdThGOTNcXHU1MTY1XFx1N0VDNFxcdTdFQzdcXHU2NzNBXFx1Njc4NFxcdTU0MERcXHU3OUYwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbm5lci13cmFwIGRpdi1jdXN0b20tc2Nyb2xsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCByZWY9XFxcIm9yZ2FuWlRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjMy1zZWxlY3QtbW9kZWwtYnV0dG9uLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0b19zZWxlY3RlZF9idXR0b25cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gdHlwZT1cXFwiaW9zLWFycm93LWRyb3ByaWdodC1jaXJjbGVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gdHlwZT1cXFwiaW9zLWFycm93LWRyb3BsZWZ0LWNpcmNsZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYzMtc2VsZWN0LW1vZGVsLXNlbGVjdGVkLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RlZC10aXRsZVxcXCI+PEljb24gdHlwZT1cXFwibWQtZG9uZS1hbGxcXFwiIC8+IFxcdTVERjJcXHU5MDA5XFx1N0VDNFxcdTdFQzc8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwibWFyZ2luOiAycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgc3RyaXBlIDpjb2x1bW5zPVxcXCJzZWxlY3RlZE9yZ2FuQ29uZmlnXFxcIiA6ZGF0YT1cXFwic2VsZWN0ZWRPcmdhbkRhdGFcXFwiIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCIgOnNob3ctaGVhZGVyPVxcXCJmYWxzZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcImhlaWdodDogNDBweDtwYWRkaW5nLXJpZ2h0OiAxMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJoYW5kbGVTdWJtaXRGbG93TW9kZWxFZGl0KCdmbG93TW9kZWxFbnRpdHknKVxcXCI+IFxcdTRGREQgXFx1NUI1ODwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoJ2Rpdk5ld0Zsb3dNb2RlbFdyYXAnKVxcXCI+XFx1NTE3MyBcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzZWxlY3Qtb3JnYW4tc2luZ2xlLWNvbXBcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRPcmdhbkRhdGFVcmw6IFwiL1BsYXRGb3JtUmVzdC9TU08vT3JnYW4vR2V0RnVsbE9yZ2FuXCIsXG4gICAgICAgIGdldFNpbmdsZU9yZ2FuRGF0YVVybDogXCIvUGxhdEZvcm1SZXN0L1NTTy9Pcmdhbi9HZXREZXRhaWxEYXRhXCJcbiAgICAgIH0sXG4gICAgICBqc0VkaXRvckluc3RhbmNlOiBudWxsLFxuICAgICAgb3JnYW5UcmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIGNoa1N0eWxlOiBcInJhZGlvXCIsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcIm9yZ2FuTmFtZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcIm9yZ2FuSWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcIm9yZ2FuUGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuX2hvc3Q7XG5cbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWRPcmdhbih0cmVlTm9kZSk7XG5cbiAgICAgICAgICAgICAgX3NlbGYuaGFuZGxlQ2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVEYXRhOiBudWxsLFxuICAgICAgICBjbGlja05vZGU6IG51bGxcbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZE9yZ2FuRGF0YTogbnVsbFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc2VsZWN0T3JnYW5Nb2RlbERpYWxvZ1dyYXApO1xuICAgIH0sXG4gICAgYmVnaW5TZWxlY3RPcmdhbjogZnVuY3Rpb24gYmVnaW5TZWxlY3RPcmdhbigpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3RPcmdhbk1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHRoaXMuZ2V0T3JnYW5EYXRhSW5pdFRyZWUoKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNDcwLFxuICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup57uE57uH5py65p6EXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0T3JnYW5EYXRhSW5pdFRyZWU6IGZ1bmN0aW9uIGdldE9yZ2FuRGF0YUluaXRUcmVlKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldE9yZ2FuRGF0YVVybCwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYub3JnYW5UcmVlLnRyZWVEYXRhID0gcmVzdWx0LmRhdGE7XG5cbiAgICAgICAgICBfc2VsZi4kcmVmcy5vcmdhblpUcmVlVUwuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzZWxlY3Qtb3JnYW4tc2luZ2xlLWNvbXAtXCIgKyBTdHJpbmdVdGlsaXR5Lkd1aWQoKSk7XG5cbiAgICAgICAgICBfc2VsZi5vcmdhblRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKF9zZWxmLiRyZWZzLm9yZ2FuWlRyZWVVTCksIF9zZWxmLm9yZ2FuVHJlZS50cmVlU2V0dGluZywgX3NlbGYub3JnYW5UcmVlLnRyZWVEYXRhKTtcblxuICAgICAgICAgIF9zZWxmLm9yZ2FuVHJlZS50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcblxuICAgICAgICAgIF9zZWxmLm9yZ2FuVHJlZS50cmVlT2JqLl9ob3N0ID0gX3NlbGY7XG4gICAgICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKF9zZWxmLm9yZ2FuVHJlZS50cmVlT2JqLCBfc2VsZi4kcmVmcy50eHRfb3JnYW5fc2VhcmNoX3RleHQuJHJlZnMuaW5wdXQsIG51bGwsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIHNlbGVjdGVkT3JnYW46IGZ1bmN0aW9uIHNlbGVjdGVkT3JnYW4ob3JnYW5EYXRhKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkT3JnYW5EYXRhID0gb3JnYW5EYXRhO1xuICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtb3JnYW4nLCBvcmdhbkRhdGEpO1xuICAgIH0sXG4gICAgZ2V0U2VsZWN0ZWRPcmdhbk5hbWU6IGZ1bmN0aW9uIGdldFNlbGVjdGVkT3JnYW5OYW1lKCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPcmdhbkRhdGEgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCLor7fpgInmi6nnu4Tnu4fmnLrmnoRcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkT3JnYW5EYXRhLm9yZ2FuTmFtZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldE9sZFNlbGVjdGVkT3JnYW46IGZ1bmN0aW9uIHNldE9sZFNlbGVjdGVkT3JnYW4ob3JnYW5JZCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFNpbmdsZU9yZ2FuRGF0YVVybCwge1xuICAgICAgICBcInJlY29yZElkXCI6IG9yZ2FuSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuc2VsZWN0ZWRPcmdhbkRhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0LXZpZXctb3JnYW4td3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGV4dFxcXCI+e3tnZXRTZWxlY3RlZE9yZ2FuTmFtZSgpfX08L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ2YWx1ZVxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaWRcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvblxcXCIgQGNsaWNrPVxcXCJiZWdpblNlbGVjdE9yZ2FuKClcXFwiPjxJY29uIHR5cGU9XFxcImlvcy1mdW5uZWxcXFwiIC8+Jm5ic3A7XFx1OTAwOVxcdTYyRTk8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9XFxcInNlbGVjdE9yZ2FuTW9kZWxEaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiYzEtc2VsZWN0LW1vZGVsLXdyYXAgZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC1zb3VyY2Utd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cXFwiaW5wdXRfYm9yZGVyX2JvdHRvbVxcXCIgcmVmPVxcXCJ0eHRfb3JnYW5fc2VhcmNoX3RleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVcXHU3RUM0XFx1N0VDN1xcdTY3M0FcXHU2Nzg0XFx1NTQwRFxcdTc5RjBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXAgZGl2LWN1c3RvbS1zY3JvbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwib3JnYW5aVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNzby1hcHAtZGV0YWlsLWZyb20tY29tcFwiLCB7XG4gIHByb3BzOiBbXCJzdGF0dXNcIiwgXCJhcHBJZFwiLCBcImlzU3ViU3lzdGVtXCJdLFxuICB3YXRjaDoge1xuICAgIGFwcElkOiBmdW5jdGlvbiBhcHBJZChuZXdWYWwpIHtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcElkID0gbmV3VmFsO1xuICAgIH0sXG4gICAgc3RhdHVzOiBmdW5jdGlvbiBzdGF0dXMobmV3VmFsKSB7XG4gICAgICB0aGlzLmlubmVyU3RhdHVzID0gbmV3VmFsO1xuICAgIH1cbiAgfSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgYXBwTG9nb1VybDogXCIvUGxhdEZvcm1SZXN0L1NTTy9BcHBsaWNhdGlvbi9HZXRBcHBMb2dvXCIsXG4gICAgICAgIGdldE5ld0tleXM6IFwiL1BsYXRGb3JtUmVzdC9TU08vQXBwbGljYXRpb24vR2V0TmV3S2V5c1wiXG4gICAgICB9LFxuICAgICAgYXBwRW50aXR5OiB7XG4gICAgICAgIGFwcElkOiBcIlwiLFxuICAgICAgICBhcHBDb2RlOiBcIlwiLFxuICAgICAgICBhcHBOYW1lOiBcIlwiLFxuICAgICAgICBhcHBQdWJsaWNLZXk6IFwiXCIsXG4gICAgICAgIGFwcFByaXZhdGVLZXk6IFwiXCIsXG4gICAgICAgIGFwcERvbWFpbjogXCJcIixcbiAgICAgICAgYXBwSW5kZXhVcmw6IFwiXCIsXG4gICAgICAgIGFwcE1haW5JbWFnZUlkOiBcIlwiLFxuICAgICAgICBhcHBUeXBlOiBcIlwiLFxuICAgICAgICBhcHBNYWluSWQ6IFwiXCIsXG4gICAgICAgIGFwcENhdGVnb3J5OiBcIndlYlwiLFxuICAgICAgICBhcHBEZXNjOiBcIlwiLFxuICAgICAgICBhcHBTdGF0dXM6IFwi5ZCv55SoXCIsXG4gICAgICAgIGFwcENyZWF0ZVRpbWU6IERhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhKClcbiAgICAgIH0sXG4gICAgICBydWxlVmFsaWRhdGU6IHtcbiAgICAgICAgYXBwQ29kZTogW3tcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAn44CQ57O757uf57yW56CB44CR5LiN6IO95Li656m677yBJyxcbiAgICAgICAgICB0cmlnZ2VyOiAnYmx1cidcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIHBhdHRlcm46IC9eW0EtWmEtejAtOV0rJC8sXG4gICAgICAgICAgbWVzc2FnZTogJ+ivt+S9v+eUqOWtl+avjeaIluaVsOWtlycsXG4gICAgICAgICAgdHJpZ2dlcjogJ2JsdXInXG4gICAgICAgIH1dLFxuICAgICAgICBhcHBOYW1lOiBbe1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6ICfjgJDns7vnu5/lkI3np7DjgJHkuI3og73kuLrnqbrvvIEnLFxuICAgICAgICAgIHRyaWdnZXI6ICdibHVyJ1xuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHN5c3RlbUxvZ29JbWFnZVNyYzogXCJcIixcbiAgICAgIGlubmVyU3RhdHVzOiBcImFkZFwiXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICBpZiAodGhpcy5pbm5lclN0YXR1cyA9PSBcImFkZFwiKSB7XG4gICAgICB0aGlzLnN5c3RlbUxvZ29JbWFnZVNyYyA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuYWNJbnRlcmZhY2UuYXBwTG9nb1VybCwge1xuICAgICAgICBmaWxlSWQ6IFwiZGVmYXVsdFNTT0FwcExvZ29JbWFnZVwiXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zeXN0ZW1Mb2dvSW1hZ2VTcmMgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLmFjSW50ZXJmYWNlLmFwcExvZ29VcmwsIHtcbiAgICAgICAgZmlsZUlkOiBcIlwiXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICByZXNldEFwcEVudGl0eTogZnVuY3Rpb24gcmVzZXRBcHBFbnRpdHkoKSB7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBJZCA9IFwiXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBDb2RlID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcE5hbWUgPSBcIlwiO1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwUHVibGljS2V5ID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcFByaXZhdGVLZXkgPSBcIlwiO1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwRG9tYWluID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcEluZGV4VXJsID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcE1haW5JbWFnZUlkID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcFR5cGUgPSBcIlwiO1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwTWFpbklkID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcENhdGVnb3J5ID0gXCJ3ZWJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcERlc2MgPSBcIlwiO1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwU3RhdHVzID0gXCLlkK/nlKhcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcENyZWF0ZVRpbWUgPSBEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YSgpO1xuICAgIH0sXG4gICAgdXBsb2FkU3lzdGVtTG9nb0ltYWdlU3VjY2VzczogZnVuY3Rpb24gdXBsb2FkU3lzdGVtTG9nb0ltYWdlU3VjY2VzcyhyZXNwb25zZSwgZmlsZSwgZmlsZUxpc3QpIHtcbiAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcE1haW5JbWFnZUlkID0gZGF0YS5maWxlSWQ7XG4gICAgICB0aGlzLnN5c3RlbUxvZ29JbWFnZVNyYyA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuYWNJbnRlcmZhY2UuYXBwTG9nb1VybCwge1xuICAgICAgICBmaWxlSWQ6IHRoaXMuYXBwRW50aXR5LmFwcE1haW5JbWFnZUlkXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldEFwcEVudGl0eTogZnVuY3Rpb24gZ2V0QXBwRW50aXR5KCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXBwRW50aXR5O1xuICAgIH0sXG4gICAgc2V0QXBwRW50aXR5OiBmdW5jdGlvbiBzZXRBcHBFbnRpdHkoYXBwRW50aXR5KSB7XG4gICAgICB0aGlzLmFwcEVudGl0eSA9IGFwcEVudGl0eTtcbiAgICB9LFxuICAgIGNyZWF0ZUtleXM6IGZ1bmN0aW9uIGNyZWF0ZUtleXMoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0TmV3S2V5cywge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuYXBwRW50aXR5LmFwcFB1YmxpY0tleSA9IHJlc3VsdC5kYXRhLnB1YmxpY0tleTtcbiAgICAgICAgICBfc2VsZi5hcHBFbnRpdHkuYXBwUHJpdmF0ZUtleSA9IHJlc3VsdC5kYXRhLnByaXZhdGVLZXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcIndpZHRoOiA4MCU7ZmxvYXQ6IGxlZnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gcmVmPVxcXCJhcHBFbnRpdHlcXFwiIDptb2RlbD1cXFwiYXBwRW50aXR5XFxcIiA6cnVsZXM9XFxcInJ1bGVWYWxpZGF0ZVxcXCIgOmxhYmVsLXdpZHRoPVxcXCIxMDBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU3Q0ZCXFx1N0VERlxcdTdGMTZcXHU3ODAxXFx1RkYxQVxcXCIgcHJvcD1cXFwiYXBwQ29kZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cm93PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gcHJvcD1cXFwiYXBwQ29kZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwQ29kZVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCI0XFxcIiBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj48c3BhbiBzdHlsZT1cXFwiY29sb3I6IHJlZFxcXCI+Kjwvc3Bhbj4gXFx1N0NGQlxcdTdFREZcXHU1NDBEXFx1NzlGMFxcdUZGMUE8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gcHJvcD1cXFwiYXBwTmFtZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwTmFtZVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU1N0RGXFx1NTQwRFxcdUZGMUFcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwRG9tYWluXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiNFxcXCIgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFx1N0NGQlxcdTdFREZcXHU3QzdCXFx1NTIyQlxcdUZGMUE8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwQ2F0ZWdvcnlcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcImFwcFxcXCI+XFx1NzlGQlxcdTUyQThBcHA8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJ3ZWJcXFwiPldlYlxcdTdDRkJcXHU3RURGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU1MTZDXFx1OTRBNVxcdUZGMUFcXFwiIHYtaWY9XFxcImlzU3ViU3lzdGVtPT0nMCdcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU1MjFCXFx1NUVGQVxcdTVCQzZcXHU5NEE1XFx1NUJGOSxcXHU3NTI4XFx1NEU4RVxcdTY1NzBcXHU2MzZFXFx1NzY4NFxcdTUyQTBcXHU1QkM2XFx1NEY3RlxcdTc1MjhcXFwiIHNlYXJjaCBlbnRlci1idXR0b249XFxcIlxcdTUyMUJcXHU1RUZBXFx1NUJDNlxcdTk0QTVcXHU1QkY5XFxcIiB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwUHVibGljS2V5XFxcIiBAb24tc2VhcmNoPVxcXCJjcmVhdGVLZXlzKClcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTc5QzFcXHU5NEE1XFx1RkYxQVxcXCIgdi1pZj1cXFwiaXNTdWJTeXN0ZW09PTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcFByaXZhdGVLZXlcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTUyMUJcXHU1RUZBXFx1NjVGNlxcdTk1RjRcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRhdGUtcGlja2VyIHR5cGU9XFxcImRhdGVcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU5MDA5XFx1NjJFOVxcdTUyMUJcXHU1RUZBXFx1NjVGNlxcdTk1RjRcXFwiIHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBDcmVhdGVUaW1lXFxcIiBkaXNhYmxlZFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZG9ubHk+PC9kYXRlLXBpY2tlcj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCI0XFxcIiBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cXHU3MkI2XFx1NjAwMVxcdUZGMUE8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcFN0YXR1c1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJcXHU1NDJGXFx1NzUyOFxcXCI+XFx1NTQyRlxcdTc1Mjg8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiXFx1Nzk4MVxcdTc1MjhcXFwiPlxcdTc5ODFcXHU3NTI4PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Jvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTlFRDhcXHU4QkE0XFx1NTczMFxcdTU3NDBcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBJbmRleFVybFxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NTkwN1xcdTZDRThcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBEZXNjXFxcIiB0eXBlPVxcXCJ0ZXh0YXJlYVxcXCIgOmF1dG9zaXplPVxcXCJ7bWluUm93czogNCxtYXhSb3dzOiA0fVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwid2lkdGg6IDE5JTtmbG9hdDogcmlnaHRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImJvcmRlci1yYWRpdXM6IDhweDt0ZXh0LWFsaWduOiBjZW50ZXI7bWFyZ2luLXRvcDogMHB4O21hcmdpbi1ib3R0b206IDMwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIDpzcmM9XFxcInN5c3RlbUxvZ29JbWFnZVNyY1xcXCIgc3R5bGU9XFxcIndpZHRoOiAxMTBweDtoZWlnaHQ6IDExMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1cGxvYWQgc3R5bGU9XFxcIm1hcmdpbjoxMHB4IDEycHggMCAyMHB4XFxcIiA6b24tc3VjY2Vzcz1cXFwidXBsb2FkU3lzdGVtTG9nb0ltYWdlU3VjY2Vzc1xcXCIgbXVsdGlwbGUgdHlwZT1cXFwiZHJhZ1xcXCIgbmFtZT1cXFwiZmlsZVxcXCIgYWN0aW9uPVxcXCIuLi8uLi8uLi8vUGxhdEZvcm1SZXN0L1NTTy9BcHBsaWNhdGlvbi9VcGxvYWRBcHBMb2dvLmRvXFxcIiBhY2NlcHQ9XFxcIi5wbmdcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJwYWRkaW5nOjEwcHggMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpY29uIHR5cGU9XFxcImlvcy1jbG91ZC11cGxvYWRcXFwiIHNpemU9XFxcIjUyXFxcIiBzdHlsZT1cXFwiY29sb3I6ICMzMzk5ZmZcXFwiPjwvaWNvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPlxcdTRFMEFcXHU0RjIwXFx1N0NGQlxcdTdFREZMb2dvPC9wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VwbG9hZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzc28tYXBwLWludGVyZmFjZS1saXN0LWNvbXBcIiwge1xuICBwcm9wczogW1wiaW50ZXJmYWNlQmVsb25nQXBwSWRcIl0sXG4gIHdhdGNoOiB7XG4gICAgaW50ZXJmYWNlQmVsb25nQXBwSWQ6IGZ1bmN0aW9uIGludGVyZmFjZUJlbG9uZ0FwcElkKG5ld1ZhbCkge1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQmVsb25nQXBwSWQgPSBuZXdWYWw7XG4gICAgfVxuICB9LFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZGVsZXRlOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0FwcGxpY2F0aW9uL0RlbGV0ZUludGVyZmFjZVwiXG4gICAgICB9LFxuICAgICAgaW50ZXJmYWNlRW50aXR5OiB7XG4gICAgICAgIGludGVyZmFjZUlkOiBcIlwiLFxuICAgICAgICBpbnRlcmZhY2VCZWxvbmdBcHBJZDogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlQ29kZTogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlTmFtZTogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlVXJsOiBcIlwiLFxuICAgICAgICBpbnRlcmZhY2VQYXJhczogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlRm9ybWF0OiBcIlwiLFxuICAgICAgICBpbnRlcmZhY2VEZXNjOiBcIlwiLFxuICAgICAgICBpbnRlcmZhY2VPcmRlck51bTogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlQ3JlYXRlVGltZTogRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGEoKSxcbiAgICAgICAgaW50ZXJmYWNlU3RhdHVzOiBcIuWQr+eUqFwiLFxuICAgICAgICBpbnRlcmZhY2VDcmVhdGVySWQ6IFwiXCIsXG4gICAgICAgIGludGVyZmFjZU9yZ2FuSWQ6IFwiXCJcbiAgICAgIH0sXG4gICAgICBsaXN0OiB7XG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmjqXlj6PnsbvlnosnLFxuICAgICAgICAgIGtleTogJ2ludGVyZmFjZUNvZGUnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgIHdpZHRoOiAxMDBcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5o6l5Y+j5ZCN56ewJyxcbiAgICAgICAgICBrZXk6ICdpbnRlcmZhY2VOYW1lJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICB3aWR0aDogMjgwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+Wkh+azqCcsXG4gICAgICAgICAga2V5OiAnaW50ZXJmYWNlRGVzYycsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAgICBrZXk6ICdpbnRlcmZhY2VJZCcsXG4gICAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCBcImludGVyZmFjZUlkXCIsIF9zZWxmKSwgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5EZWxldGVCdXR0b24oaCwgcGFyYW1zLCBcImludGVyZmFjZUlkXCIsIF9zZWxmKV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfV0sXG4gICAgICAgIHRhYmxlRGF0YTogW11cbiAgICAgIH0sXG4gICAgICBpbm5lclN0YXR1czogXCJhZGRcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgbWV0aG9kczoge1xuICAgIHJlc2V0TGlzdERhdGE6IGZ1bmN0aW9uIHJlc2V0TGlzdERhdGEoKSB7XG4gICAgICB0aGlzLmxpc3QudGFibGVEYXRhID0gW107XG4gICAgfSxcbiAgICBhZGRJbnRlcmZhY2U6IGZ1bmN0aW9uIGFkZEludGVyZmFjZSgpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zc29BcHBJbnRlcmZhY2VFZGl0TW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5pbm5lclN0YXR1cyA9PSBcImFkZFwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlSWQgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQmVsb25nQXBwSWQgPSB0aGlzLmludGVyZmFjZUJlbG9uZ0FwcElkO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQ29kZSA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VOYW1lID0gXCJcIjtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZVVybCA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VQYXJhcyA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VGb3JtYXQgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlRGVzYyA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VPcmRlck51bSA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VDcmVhdGVUaW1lID0gRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGEoKTtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZVN0YXR1cyA9IFwi5ZCv55SoXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VDcmVhdGVySWQgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlT3JnYW5JZCA9IFwiXCI7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDU3MCxcbiAgICAgICAgaGVpZ2h0OiAzMzAsXG4gICAgICAgIHRpdGxlOiBcIuaOpeWPo+iuvue9rlwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc3NvQXBwSW50ZXJmYWNlRWRpdE1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBzYXZlSW50ZXJmYWNlRWRpdDogZnVuY3Rpb24gc2F2ZUludGVyZmFjZUVkaXQoKSB7XG4gICAgICBpZiAodGhpcy5pbm5lclN0YXR1cyA9PSBcImFkZFwiKSB7XG4gICAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUlkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICAgIHRoaXMubGlzdC50YWJsZURhdGEucHVzaChKc29uVXRpbGl0eS5DbG9uZVNpbXBsZSh0aGlzLmludGVyZmFjZUVudGl0eSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3QudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMubGlzdC50YWJsZURhdGFbaV0uaW50ZXJmYWNlSWQgPT0gdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlSWQpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdC50YWJsZURhdGFbaV0uaW50ZXJmYWNlQ29kZSA9IHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNvZGU7XG4gICAgICAgICAgICB0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZU5hbWUgPSB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VOYW1lO1xuICAgICAgICAgICAgdGhpcy5saXN0LnRhYmxlRGF0YVtpXS5pbnRlcmZhY2VVcmwgPSB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VVcmw7XG4gICAgICAgICAgICB0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZVBhcmFzID0gdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlUGFyYXM7XG4gICAgICAgICAgICB0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZUZvcm1hdCA9IHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUZvcm1hdDtcbiAgICAgICAgICAgIHRoaXMubGlzdC50YWJsZURhdGFbaV0uaW50ZXJmYWNlRGVzYyA9IHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZURlc2M7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgIH0sXG4gICAgY2hhbmdlSW50ZXJmYWNlQ29kZTogZnVuY3Rpb24gY2hhbmdlSW50ZXJmYWNlQ29kZSh2YWx1ZSkge1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQ29kZSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0SW50ZXJmYWNlTGlzdERhdGE6IGZ1bmN0aW9uIGdldEludGVyZmFjZUxpc3REYXRhKCkge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdC50YWJsZURhdGE7XG4gICAgfSxcbiAgICBzZXRJbnRlcmZhY2VMaXN0RGF0YTogZnVuY3Rpb24gc2V0SW50ZXJmYWNlTGlzdERhdGEoZGF0YSkge1xuICAgICAgdGhpcy5saXN0LnRhYmxlRGF0YSA9IGRhdGE7XG4gICAgfSxcbiAgICBlZGl0OiBmdW5jdGlvbiBlZGl0KGludGVyZmFjZUlkLCBwYXJhbXMpIHtcbiAgICAgIHRoaXMuaW5uZXJTdGF0dXMgPSBcInVwZGF0ZVwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlSWQgPSBwYXJhbXMucm93LmludGVyZmFjZUlkO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQ29kZSA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlQ29kZTtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZU5hbWUgPSBwYXJhbXMucm93LmludGVyZmFjZU5hbWU7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VVcmwgPSBwYXJhbXMucm93LmludGVyZmFjZVVybDtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZVBhcmFzID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VQYXJhcztcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUZvcm1hdCA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlRm9ybWF0O1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlRGVzYyA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlRGVzYztcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZU9yZGVyTnVtID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VPcmRlck51bTtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNyZWF0ZVRpbWUgPSBwYXJhbXMucm93LmludGVyZmFjZUNyZWF0ZVRpbWU7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VTdGF0dXMgPSBwYXJhbXMucm93LmludGVyZmFjZVN0YXR1cztcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNyZWF0ZXJJZCA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlQ3JlYXRlcklkO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlT3JnYW5JZCA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlT3JnYW5JZDtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUJlbG9uZ0FwcElkID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VCZWxvbmdBcHBJZDtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zc29BcHBJbnRlcmZhY2VFZGl0TW9kZWxEaWFsb2dXcmFwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA1NzAsXG4gICAgICAgIGhlaWdodDogMzMwLFxuICAgICAgICB0aXRsZTogXCLmjqXlj6Porr7nva5cIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWw6IGZ1bmN0aW9uIGRlbChpbnRlcmZhY2VJZCwgcGFyYW1zKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGlzdC50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdC50YWJsZURhdGFbaV0uaW50ZXJmYWNlSWQgPT0gaW50ZXJmYWNlSWQpIHtcbiAgICAgICAgICBfc2VsZi5saXN0LnRhYmxlRGF0YS5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeWIoOmZpOivpeaOpeWPo+WQl++8n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBamF4VXRpbGl0eS5EZWxldGUoX3NlbGYuYWNJbnRlcmZhY2UuZGVsZXRlLCB7XG4gICAgICAgICAgICAgIFwiaW50ZXJmYWNlSWRcIjogaW50ZXJmYWNlSWRcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7fSBlbHNlIHtcbiAgICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9XFxcIml2LWxpc3QtcGFnZS13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPVxcXCJzc29BcHBJbnRlcmZhY2VFZGl0TW9kZWxEaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmU7bWFyZ2luLXRvcDogMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1mb3JtIHJlZj1cXFwiaW50ZXJmYWNlRW50aXR5XFxcIiA6bW9kZWw9XFxcImludGVyZmFjZUVudGl0eVxcXCIgOmxhYmVsLXdpZHRoPVxcXCIxMzBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc2xvdD1cXFwibGFiZWxcXFwiPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjogcmVkXFxcIj4qPC9zcGFuPiZuYnNwO1xcdTYzQTVcXHU1M0UzXFx1N0M3QlxcdTU3OEJcXHVGRjFBPC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNvZGVcXFwiIHNpemU9XFxcInNtYWxsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U2VsZWN0IHNsb3Q9XFxcImFwcGVuZFxcXCIgc3R5bGU9XFxcIndpZHRoOiA5MHB4XFxcIiBAb24tY2hhbmdlPVxcXCJjaGFuZ2VJbnRlcmZhY2VDb2RlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE9wdGlvbiB2YWx1ZT1cXFwiXFx1NzY3QlxcdTVGNTVcXHU2M0E1XFx1NTNFM1xcXCI+XFx1NzY3QlxcdTVGNTVcXHU2M0E1XFx1NTNFMzwvT3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8T3B0aW9uIHZhbHVlPVxcXCJcXHU1MTc2XFx1NEVENlxcXCI+XFx1NTE3NlxcdTRFRDY8L09wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1NlbGVjdD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzbG90PVxcXCJsYWJlbFxcXCI+PHNwYW4gc3R5bGU9XFxcImNvbG9yOiByZWRcXFwiPio8L3NwYW4+Jm5ic3A7XFx1NjNBNVxcdTUzRTNcXHU1NDBEXFx1NzlGMFxcdUZGMUE8L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlTmFtZVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTYzQTVcXHU1M0UzXFx1NTczMFxcdTU3NDBcXHVGRjFBXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VVcmxcXFwiIHNpemU9XFxcInNtYWxsXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU1M0MyXFx1NjU3MFxcdUZGMUFcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZVBhcmFzXFxcIiB0eXBlPVxcXCJ0ZXh0YXJlYVxcXCIgOmF1dG9zaXplPVxcXCJ7bWluUm93czogMixtYXhSb3dzOiAyfVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPjwvaS1pbnB1dD4gICAgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU2ODNDXFx1NUYwRlxcdTUzMTZcXHU2NUI5XFx1NkNENVxcdUZGMUFcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUZvcm1hdFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTU5MDdcXHU2Q0U4XFx1RkYxQVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlRGVzY1xcXCIgc2l6ZT1cXFwic21hbGxcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWZvcm0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJtYXJnaW4tbGVmdDogOHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cCBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwic2F2ZUludGVyZmFjZUVkaXQoJ2ludGVyZmFjZUVudGl0eScpXFxcIiBpY29uPVxcXCJtZC1jaGVja21hcmtcXFwiPjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiPjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XFxcImxpc3QtYnV0dG9uLXdyYXBcXFwiIGNsYXNzPVxcXCJsaXN0LWJ1dHRvbi1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uICB0eXBlPVxcXCJzdWNjZXNzXFxcIiBAY2xpY2s9XFxcImFkZEludGVyZmFjZSgpXFxcIiBpY29uPVxcXCJtZC1hZGRcXFwiPlxcdTY1QjBcXHU1ODlFPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Hcm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJjbGVhcjogYm90aFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XFxcImxpc3QubGlzdEhlaWdodFxcXCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cXFwibGlzdC5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwibGlzdC50YWJsZURhdGFcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzc28tYXBwLXN1Yi1zeXN0ZW0tbGlzdC1jb21wXCIsIHtcbiAgcHJvcHM6IFtcInN0YXR1c1wiLCBcImJlbG9uZ0FwcElkXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBzYXZlU3ViQXBwVXJsOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0FwcGxpY2F0aW9uL1NhdmVTdWJBcHBcIixcbiAgICAgICAgcmVsb2FkRGF0YTogXCIvUGxhdEZvcm1SZXN0L1NTTy9BcHBsaWNhdGlvbi9HZXRBbGxTdWJTc29BcHBcIixcbiAgICAgICAgYXBwTG9nb1VybDogXCIvUGxhdEZvcm1SZXN0L1NTTy9BcHBsaWNhdGlvbi9HZXRBcHBMb2dvXCIsXG4gICAgICAgIGRlbGV0ZTogXCIvUGxhdEZvcm1SZXN0L1NTTy9BcHBsaWNhdGlvbi9EZWxldGVcIixcbiAgICAgICAgZ2V0RGF0YVVybDogXCIvUGxhdEZvcm1SZXN0L1NTTy9BcHBsaWNhdGlvbi9HZXRBcHBWb1wiXG4gICAgICB9LFxuICAgICAgYXBwTGlzdDogW10sXG4gICAgICBpbm5lckVkaXRNb2RlbERpYWxvZ1N0YXR1czogXCJhZGRcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBhZGRJbnRlZ3JhdGVkU3lzdGVtOiBmdW5jdGlvbiBhZGRJbnRlZ3JhdGVkU3lzdGVtKCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNzb0FwcFN1YlN5c3RlbUVkaXRNb2RlbERpYWxvZ1dyYXA7XG4gICAgICB0aGlzLiRyZWZzLnN1YkFwcERldGFpbEZyb21Db21wLnJlc2V0QXBwRW50aXR5KCk7XG4gICAgICB0aGlzLiRyZWZzLnN1YkFwcEludGVyZmFjZUxpc3RDb21wLnJlc2V0TGlzdERhdGEoKTtcbiAgICAgIHRoaXMuaW5uZXJFZGl0TW9kZWxEaWFsb2dTdGF0dXMgPSBcImFkZFwiO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA5MDAsXG4gICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICB0aXRsZTogXCLlrZDns7vnu5/orr7nva5cIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBzYXZlU3ViU3lzdGVtU2V0dGluZzogZnVuY3Rpb24gc2F2ZVN1YlN5c3RlbVNldHRpbmcoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICB2YXIgc3NvQXBwRW50aXR5ID0gdGhpcy4kcmVmcy5zdWJBcHBEZXRhaWxGcm9tQ29tcC5nZXRBcHBFbnRpdHkoKTtcbiAgICAgIHZhciBzc29BcHBJbnRlcmZhY2VFbnRpdHlMaXN0ID0gdGhpcy4kcmVmcy5zdWJBcHBJbnRlcmZhY2VMaXN0Q29tcC5nZXRJbnRlcmZhY2VMaXN0RGF0YSgpO1xuICAgICAgc3NvQXBwRW50aXR5LmFwcE1haW5JZCA9IHRoaXMuYmVsb25nQXBwSWQ7XG5cbiAgICAgIGlmICh0aGlzLmlubmVyRWRpdE1vZGVsRGlhbG9nU3RhdHVzID09IFwiYWRkXCIpIHtcbiAgICAgICAgc3NvQXBwRW50aXR5LmFwcElkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzc29BcHBJbnRlcmZhY2VFbnRpdHlMaXN0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3NvQXBwSW50ZXJmYWNlRW50aXR5TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHNzb0FwcEludGVyZmFjZUVudGl0eUxpc3RbaV0uaW50ZXJmYWNlQmVsb25nQXBwSWQgPSBzc29BcHBFbnRpdHkuYXBwSWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHZvID0ge1xuICAgICAgICBcInNzb0FwcEVudGl0eVwiOiBzc29BcHBFbnRpdHksXG4gICAgICAgIFwic3NvQXBwSW50ZXJmYWNlRW50aXR5TGlzdFwiOiBzc29BcHBJbnRlcmZhY2VFbnRpdHlMaXN0XG4gICAgICB9O1xuICAgICAgdmFyIHNlbmREYXRhID0gSlNPTi5zdHJpbmdpZnkodm8pO1xuICAgICAgQWpheFV0aWxpdHkuUG9zdFJlcXVlc3RCb2R5KHRoaXMuYWNJbnRlcmZhY2Uuc2F2ZVN1YkFwcFVybCwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfc2VsZi5yZWxvYWREYXRhKCk7XG5cbiAgICAgICAgICAgIF9zZWxmLmhhbmRsZUNsb3NlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zc29BcHBTdWJTeXN0ZW1FZGl0TW9kZWxEaWFsb2dXcmFwKTtcbiAgICB9LFxuICAgIHJlbG9hZERhdGE6IGZ1bmN0aW9uIHJlbG9hZERhdGEoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UucmVsb2FkRGF0YSwge1xuICAgICAgICBhcHBJZDogX3NlbGYuYmVsb25nQXBwSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuYXBwTGlzdCA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIGJ1aWxkTG9nb1VybDogZnVuY3Rpb24gYnVpbGRMb2dvVXJsKGFwcCkge1xuICAgICAgaWYgKGFwcC5hcHBNYWluSW1hZ2VJZCA9PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLmFjSW50ZXJmYWNlLmFwcExvZ29VcmwsIHtcbiAgICAgICAgICBmaWxlSWQ6IFwiZGVmYXVsdFNTT0FwcExvZ29JbWFnZVwiXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuYWNJbnRlcmZhY2UuYXBwTG9nb1VybCwge1xuICAgICAgICAgIGZpbGVJZDogYXBwLmFwcE1haW5JbWFnZUlkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0dGluZ0FwcDogZnVuY3Rpb24gc2V0dGluZ0FwcChhcHApIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zc29BcHBTdWJTeXN0ZW1FZGl0TW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5pbm5lckVkaXRNb2RlbERpYWxvZ1N0YXR1cyA9IFwidXBkYXRlXCI7XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXREYXRhVXJsLCB7XG4gICAgICAgIGFwcElkOiBhcHAuYXBwSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi4kcmVmcy5zdWJBcHBEZXRhaWxGcm9tQ29tcC5zZXRBcHBFbnRpdHkocmVzdWx0LmRhdGEuc3NvQXBwRW50aXR5KTtcblxuICAgICAgICAgIF9zZWxmLiRyZWZzLnN1YkFwcEludGVyZmFjZUxpc3RDb21wLnNldEludGVyZmFjZUxpc3REYXRhKHJlc3VsdC5kYXRhLnNzb0FwcEludGVyZmFjZUVudGl0eUxpc3QpO1xuXG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgICAgdGl0bGU6IFwi5a2Q57O757uf6K6+572uXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICByZW1vdmVBcHA6IGZ1bmN0aW9uIHJlbW92ZUFwcChhcHApIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k6KaB5rOo6ZSA57O757ufW1wiICsgYXBwLmFwcE5hbWUgKyBcIl3lkJfvvJ9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBBamF4VXRpbGl0eS5EZWxldGUoX3NlbGYuYWNJbnRlcmZhY2UuZGVsZXRlLCB7XG4gICAgICAgICAgYXBwSWQ6IGFwcC5hcHBJZFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgX3NlbGYucmVsb2FkRGF0YSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj1cXFwic3NvQXBwU3ViU3lzdGVtRWRpdE1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lO21hcmdpbi10b3A6IDBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRhYnM+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWItcGFuZSBsYWJlbD1cXFwiXFx1N0NGQlxcdTdFREZcXHU4QkJFXFx1N0Y2RVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3NvLWFwcC1kZXRhaWwtZnJvbS1jb21wIHJlZj1cXFwic3ViQXBwRGV0YWlsRnJvbUNvbXBcXFwiIDppcy1zdWItc3lzdGVtPVxcXCJ0cnVlXFxcIiA6c3RhdHVzPVxcXCJpbm5lckVkaXRNb2RlbERpYWxvZ1N0YXR1c1xcXCI+PC9zc28tYXBwLWRldGFpbC1mcm9tLWNvbXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFiLXBhbmU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWItcGFuZSBsYWJlbD1cXFwiXFx1NjNBNVxcdTUzRTNcXHU4QkJFXFx1N0Y2RVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3NvLWFwcC1pbnRlcmZhY2UtbGlzdC1jb21wIHJlZj1cXFwic3ViQXBwSW50ZXJmYWNlTGlzdENvbXBcXFwiPjwvc3NvLWFwcC1pbnRlcmZhY2UtbGlzdC1jb21wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFicz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcIm1hcmdpbi1yaWdodDogMTBweDttYXJnaW4tYm90dG9tOiAxMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgdi1pZj1cXFwic3RhdHVzIT0ndmlldydcXFwiIEBjbGljaz1cXFwic2F2ZVN1YlN5c3RlbVNldHRpbmcoKVxcXCIgaWNvbj1cXFwibWQtY2hlY2ttYXJrXFxcIj5cXHU0RkREXFx1NUI1OFxcdTVCNTBcXHU3Q0ZCXFx1N0VERlxcdThCQkVcXHU3RjZFPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdi1pZj1cXFwic3RhdHVzIT0ndmlldydcXFwiIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiPlxcdTUxNzNcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYXBwcy1tYW5hZ2VyLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFwcHMtb3V0ZXItd3JhcFxcXCIgcmVmPVxcXCJhcHBzT3V0ZXJXcmFwXFxcIiB2LWlmPVxcXCJzdGF0dXMhPSdhZGQnXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiAgdi1mb3I9XFxcImFwcCBpbiBhcHBMaXN0XFxcIiBjbGFzcz1cXFwiYXBwLW91dGVyLXdyYXAgYXBwLW91dGVyLXdyYXAtc3ViLXN5c3RlbVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0aXRsZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3thcHAuYXBwTmFtZX19PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtYWluSW1nXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyA6c3JjPVxcXCJidWlsZExvZ29VcmwoYXBwKVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24td3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiBzZXR0aW5nLWJ1dHRvblxcXCIgQGNsaWNrPVxcXCJzZXR0aW5nQXBwKGFwcClcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1OEJCRVxcdTdGNkVcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbiByZW1vdmUtYnV0dG9uXFxcIiBAY2xpY2s9XFxcInJlbW92ZUFwcChhcHApXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTZDRThcXHU5NTAwXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhcHAtb3V0ZXItd3JhcCBhcHAtb3V0ZXItd3JhcC1zdWItc3lzdGVtIG5ldy1zeXN0ZW0tb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhZGQtc3lzdGVtLWJ1dHRvblxcXCIgQGNsaWNrPVxcXCJhZGRJbnRlZ3JhdGVkU3lzdGVtKClcXFwiIHN0eWxlPVxcXCJtYXJnaW4tdG9wOiA2MHB4XFxcIj5cXHU2NUIwXFx1NTg5RTwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHYtaWY9XFxcInN0YXR1cz09J2FkZCdcXFwiPlxcdThCRjdcXHU1MTQ4XFx1NEZERFxcdTVCNThcXHU0RTNCXFx1N0NGQlxcdTdFREYsXFx1NTE4RFxcdThCQkVcXHU3RjZFXFx1NTE3NlxcdTRFMkRcXHU3Njg0XFx1NUI1MFxcdTdDRkJcXHU3RURGITwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7Il19
