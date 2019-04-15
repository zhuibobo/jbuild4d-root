"use strict";

Vue.component("dataset-simple-select-comp", {
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        getDataSetData: "/PlatFormRest/Builder/DataSet/DataSetMain/GetDataSetsForZTreeNodeList"
      },
      dataSetTree: {
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
              if (treeNode.nodeTypeName == "DataSet") {
                _self.selectedNode(treeNode);
              }
            }
          }
        },
        treeData: null,
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
          if (result.data != null && result.data.length > 0) {
            for (var i = 0; i < result.data.length; i++) {
              if (result.data[i].nodeTypeName == "DataSetGroup") {
                result.data[i].icon = BaseUtility.GetRootPath() + "/static/Themes/Png16X16/package.png";
              } else {
                result.data[i].icon = BaseUtility.GetRootPath() + "/static/Themes/Png16X16/application_view_columns.png";
              }
            }
          }

          _self.dataSetTree.treeData = result.data;
          _self.dataSetTree.treeObj = $.fn.zTree.init($("#dataSetZTreeUL"), _self.dataSetTree.treeSetting, _self.dataSetTree.treeData);

          _self.dataSetTree.treeObj.expandAll(true);

          fuzzySearchTreeObj(_self.dataSetTree.treeObj, _self.$refs.txt_search_text.$refs.input, null, true);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    },
    selectedNode: function selectedNode(treeNode) {
      this.$emit('on-selected-dataset', treeNode);
    }
  },
  template: '<div class="js-code-fragment-wrap">\
                    <i-input search class="input_border_bottom" ref="txt_search_text" placeholder="请输入表名或者标题"></i-input>\
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

Vue.component("select-default-value-dialog", {
  data: function data() {
    var _self = this;

    return {
      acInterface: {
        getSelectData: "/PlatFormRest/SelectView/SelectEnvVariable/GetSelectData"
      },
      selectType: "Const",
      selectValue: "",
      selectText: "",
      tree: {
        datetimeTreeObj: null,
        datetimeTreeSetting: {
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
            onClick: function onClick(event, treeId, treeNode) {},
            onDblClick: function onDblClick(event, treeId, treeNode) {},
            onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {}
          }
        },
        datetimeTreeData: null,
        envVarTreeObj: null,
        envVarTreeSetting: {
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
            onClick: function onClick(event, treeId, treeNode) {},
            onDblClick: function onDblClick(event, treeId, treeNode) {},
            onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {}
          }
        },
        envVarTreeData: null,
        numberCodeTreeObj: null,
        numberCodeTreeSetting: {},
        numberCodeTreeData: {}
      }
    };
  },
  mounted: function mounted() {
    this.loadData();
  },
  methods: {
    beginSelect: function beginSelect(oldData) {
      var elem = this.$refs.selectDefaultValueDialogWrap;
      var height = 450;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        height: 680,
        width: 980,
        title: "设置默认值"
      });
      $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.document).find(".ui-dialog").css("zIndex", 10101);

      if (oldData == null) {
        this.selectType = "Const";
        this.selectValue = "";
        this.selectText = "";
      }
    },
    loadData: function loadData() {
      var _self = this;

      AjaxUtility.Post(this.acInterface.getSelectData, {}, function (result) {
        _self.tree.datetimeTreeData = result.data.datetimeTreeData;
        _self.tree.envVarTreeData = result.data.envVarTreeData;
        _self.tree.datetimeTreeObj = $.fn.zTree.init($("#datetimeZTreeUL"), _self.tree.datetimeTreeSetting, _self.tree.datetimeTreeData);

        _self.tree.datetimeTreeObj.expandAll(true);

        _self.tree.envVarTreeObj = $.fn.zTree.init($("#envVarZTreeUL"), _self.tree.envVarTreeSetting, _self.tree.envVarTreeData);

        _self.tree.envVarTreeObj.expandAll(true);
      }, "json");
    },
    getSelectInstanceName: function getSelectInstanceName() {
      return BaseUtility.GetUrlParaValue("instanceName");
    },
    selectComplete: function selectComplete() {
      var result = {};

      if (this.selectType == "Const") {
        if (this.selectValue == "") {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请设置常量默认值！", null);
          return;
        }

        result.Type = "Const";
        result.Value = this.selectValue;
        result.Text = this.selectValue;
      } else if (this.selectType == "DateTime") {
        var selectNodes = this.tree.datetimeTreeObj.getSelectedNodes();

        if (selectNodes.length == 0) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择一种时间类型！", null);
          return;
        } else {
          result.Type = "DateTime";
          result.Value = selectNodes[0].value;
          result.Text = selectNodes[0].text;
        }
      } else if (this.selectType == "ApiVar") {
        var selectNodes = this.tree.envVarTreeObj.getSelectedNodes();

        if (selectNodes.length == 0) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选择一种API类型！", null);
          return;
        } else {
          if (selectNodes[0].group == true) {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "不能选择分组！", null);
            return;
          } else {
            result.Type = "ApiVar";
            result.Value = selectNodes[0].value;
            result.Text = selectNodes[0].text;
          }
        }
      } else if (this.selectType == "NumberCode") {
        result.Type = "NumberCode";
      }

      this.$emit('on-selected-default-value', result);
      this.handleClose();
    },
    clearComplete: function clearComplete() {
      this.$emit('on-selected-default-value', null);
      this.handleClose();
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectDefaultValueDialogWrap);
    }
  },
  template: "<div  ref=\"selectDefaultValueDialogWrap\" class=\"general-edit-page-wrap\" style=\"display: none\">\n                    <tabs :value=\"selectType\" v-model=\"selectType\">\n                        <tab-pane label=\"\u9759\u6001\u503C\" name=\"Const\" >\n                            <i-form :label-width=\"80\" style=\"width: 80%;margin: 50px auto auto;\">\n                                <form-item label=\"\u9759\u6001\u503C\uFF1A\">\n                                    <i-input v-model=\"selectValue\"></i-input>\n                                </form-item>\n                            </i-form>\n                        </tab-pane>\n                        <tab-pane label=\"\u65E5\u671F\u65F6\u95F4\" name=\"DateTime\">\n                            <ul id=\"datetimeZTreeUL\" class=\"ztree\"></ul>\n                        </tab-pane>\n                        <tab-pane label=\"API\u53D8\u91CF\" name=\"ApiVar\">\n                            <ul id=\"envVarZTreeUL\" class=\"ztree\"></ul>\n                        </tab-pane>\n                        <tab-pane label=\"\u5E8F\u53F7\u7F16\u7801\" name=\"NumberCode\">\n                            <ul id=\"numberCodeZTreeUL\" class=\"ztree\"></ul>\n                        </tab-pane>\n                        <tab-pane label=\"\u4E3B\u952E\u751F\u6210\" name=\"IdCoder\">\n                            <ul id=\"numberCodeZTreeUL1\" class=\"ztree\"></ul>\n                        </tab-pane>\n                    </tabs>\n                    <div class=\"button-outer-wrap\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"selectComplete()\"> \u786E \u8BA4 </i-button>\n                                <i-button type=\"primary\" @click=\"clearComplete()\"> \u6E05 \u7A7A </i-button>\n                                <i-button @click=\"handleClose()\">\u5173 \u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
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

Vue.component("select-validate-rule-dialog", {
  data: function data() {
    var _self = this;

    return {
      selectValidateType: "NoEmpty",
      ruleParas: {
        msg: "字段",
        numLength: 4,
        decimalLength: 0,
        jsMethodName: "",
        regularText: "",
        regularMsg: ""
      },
      addedValidateRule: [],
      validateColumnsConfig: [{
        title: '类型',
        key: 'validateType',
        width: 150,
        align: "center"
      }, {
        title: '参数',
        key: 'validateParas',
        align: "center"
      }, {
        title: '删除',
        key: 'validateId',
        width: 120,
        align: "center",
        render: function render(h, params) {
          return h('div', {
            class: "list-row-button-wrap"
          }, [h('div', {
            class: "list-row-button del",
            on: {
              click: function click() {
                _self.delValidate(params.row["validateId"]);
              }
            }
          })]);
        }
      }]
    };
  },
  mounted: function mounted() {},
  methods: {
    beginSelect: function beginSelect(oldData) {
      var elem = this.$refs.selectValidateRuleDialogWrap;
      var height = 450;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        height: 680,
        width: 980,
        title: "设置验证规则"
      });
      $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.document).find(".ui-dialog").css("zIndex", 10101);
      this.ruleParas.msg = "字段";
      this.ruleParas.numLength = 4;
      this.ruleParas.decimalLength = 0;
      this.ruleParas.jsMethodName = "";
      this.ruleParas.regularText = "";
      this.ruleParas.regularMsg = "";
      this.addedValidateRule = [];
      this.bindOldSelectedValue(oldData);
    },
    bindOldSelectedValue: function bindOldSelectedValue(oldData) {
      var oldSelectedValue = oldData;

      if (oldSelectedValue.rules.length > 0) {
        this.addedValidateRule = oldSelectedValue.rules;
        this.msg = oldSelectedValue.msg;
      }
    },
    getSelectInstanceName: function getSelectInstanceName() {
      return BaseUtility.GetUrlParaValue("instanceName");
    },
    selectComplete: function selectComplete() {
      var result = this.addedValidateRule;

      if (this.addedValidateRule.length > 0) {
        var result = {
          msg: this.ruleParas.msg,
          rules: this.addedValidateRule
        };
        this.$emit('on-selected-validate-rule', JsonUtility.CloneSimple(result));
        this.handleClose();
      } else {
        this.clearComplete();
      }
    },
    clearComplete: function clearComplete() {
      window.OpenerWindowObj[this.getSelectInstanceName()].setSelectValidateRuleResultValue(null);
      this.handleClose();
    },
    handleClose: function handleClose() {
      DialogUtility.CloseDialogElem(this.$refs.selectValidateRuleDialogWrap);
    },
    addValidateRule: function addValidateRule() {
      var validateParas = "";

      if (this.selectValidateType == "Number") {
        validateParas = JsonUtility.JsonToString({
          numLength: this.ruleParas.numLength,
          decimalLength: this.ruleParas.decimalLength
        });
      } else if (this.selectValidateType == "Regular") {
        validateParas = JsonUtility.JsonToString({
          regularText: this.ruleParas.regularText,
          regularMsg: this.ruleParas.regularMsg
        });
      } else if (this.selectValidateType == "JsMethod") {
        validateParas = JsonUtility.JsonToString({
          jsMethodName: this.ruleParas.jsMethodName
        });
      }

      var newValidateRule = {
        "validateId": StringUtility.Timestamp(),
        "validateType": this.selectValidateType,
        "validateParas": validateParas
      };
      this.addedValidateRule.push(newValidateRule);
    },
    delValidate: function delValidate(validateId) {
      for (var i = 0; i < this.addedValidateRule.length; i++) {
        if (this.addedValidateRule[i].validateId == validateId) {
          this.addedValidateRule.splice(i, 1);
        }
      }
    }
  },
  template: "<div ref=\"selectValidateRuleDialogWrap\" v-cloak class=\"general-edit-page-wrap\" style=\"display: none\">\n                    <card style=\"margin-top: 10px\" >\n                        <p slot=\"title\">\u8BBE\u7F6E\u9A8C\u8BC1\u89C4\u5219</p>\n                        <div>\n                            <radio-group type=\"button\" style=\"margin: auto\" v-model=\"selectValidateType\">\n                                <radio label=\"NoEmpty\">\u4E0D\u80FD\u4E3A\u7A7A</radio>\n                                <radio label=\"Number\">\u6570\u5B57</radio>\n                                <radio label=\"Mobile\">\u624B\u673A</radio>\n                                <radio label=\"Date\">\u65E5\u671F</radio>\n                                <radio label=\"Time\">\u65F6\u95F4</radio>\n                                <radio label=\"DateTime\">\u65E5\u671F\u65F6\u95F4</radio>\n                                <radio label=\"EMail\">\u90AE\u4EF6</radio>\n                                <radio label=\"IDCard\">\u8EAB\u4EFD\u8BC1</radio>\n                                <radio label=\"URL\">URL</radio>\n                                <radio label=\"ENCode\">\u82F1\u6587</radio>\n                                <radio label=\"SimpleCode\">\u7279\u6B8A\u5B57\u7B26</radio>\n                                <radio label=\"Regular\">\u6B63\u5219\u8868\u8FBE\u5F0F</radio>\n                                <radio label=\"JsMethod\">JS\u65B9\u6CD5</radio>\n                            </radio-group>\n                            <i-button type=\"success\" shape=\"circle\" icon=\"md-add\" style=\"margin-left: 15px;cursor: pointer\" @click=\"addValidateRule\"></i-button>\n                        </div>\n                        <div>\n                            <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px\">\u53C2\u6570\u8BBE\u7F6E</divider>\n                            <!--\u6570\u5B57\u7C7B\u578B\u53C2\u6570\u8BBE\u7F6E-->\n                            <div v-if=\"selectValidateType=='Number'\">\n                                <i-form :label-width=\"80\">\n                                    <form-item label=\"\u957F\u5EA6\uFF1A\">\n                                        <row>\n                                            <i-col span=\"10\">\n                                                <form-item>\n                                                    <input-number :max=\"10\" :min=\"1\" v-model=\"ruleParas.numLength\" size=\"small\" style=\"width: 80%\"></input-number>\n                                                </form-item>\n                                            </i-col>\n                                            <i-col span=\"4\" style=\"text-align: center\">\u5C0F\u6570\u4F4D\u6570\uFF1A</i-col>\n                                            <i-col span=\"10\">\n                                                <form-item>\n                                                    <input-number :max=\"10\" :min=\"0\" v-model=\"ruleParas.decimalLength\" size=\"small\" style=\"width: 80%\"></input-number>\n                                                </form-item>\n                                            </i-col>\n                                        </row>\n                                    </form-item>\n                                </i-form>\n                            </div>\n                            <!--\u6B63\u5219\u8868\u8FBE\u5F0F\u7C7B\u578B\u53C2\u6570\u8BBE\u7F6E-->\n                            <div v-if=\"selectValidateType=='Regular'\">\n                                <i-form :label-width=\"80\">\n                                    <form-item label=\"\u8868\u8FBE\u5F0F\uFF1A\">\n                                        <row>\n                                            <i-col span=\"10\">\n                                                <form-item>\n                                                    <i-input size=\"small\" placeholder=\"Enter something...\" v-model=\"ruleParas.regularText\" style=\"width: 80%\"></i-input>\n                                                </form-item>\n                                            </i-col>\n                                            <i-col span=\"4\" style=\"text-align: center\">\u63D0\u793A\u4FE1\u606F\uFF1A</i-col>\n                                            <i-col span=\"10\">\n                                                <form-item>\n                                                    <i-input size=\"small\" placeholder=\"Enter something...\" v-model=\"ruleParas.regularMsg\" style=\"width: 80%\"></i-input>\n                                                </form-item>\n                                            </i-col>\n                                        </row>\n                                    </form-item>\n                                </i-form>\n                            </div>\n                            <!--JS\u65B9\u6CD5\u7C7B\u578B\u53C2\u6570\u8BBE\u7F6E-->\n                            <div v-if=\"selectValidateType=='JsMethod'\">\n                                <i-form :label-width=\"80\">\n                                    <form-item label=\"\u65B9\u6CD5\u540D\uFF1A\">\n                                        <i-input size=\"small\" placeholder=\"Enter something...\" v-model=\"ruleParas.jsMethodName\" style=\"width: 90%\"></i-input>\n                                    </form-item>\n                                </i-form>\n                            </div>\n                        </div>\n                    </card>\n                    <card style=\"margin-top: 10px\">\n                        <p slot=\"title\">\u5DF2\u6DFB\u52A0\u89C4\u5219</p>\n                        <div>\n                            <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px;margin-top: 0px;margin-bottom: 6px\">\u63D0\u793A\u4FE1\u606F</divider>\n                            <i-form :label-width=\"0\">\n                                <form-item label=\"\">\n                                    <i-input  placeholder=\"\u8BF7\u8F93\u5165\u63D0\u793A\u4FE1\u606F...\"  v-model=\"ruleParas.msg\"></i-input>\n                                </form-item>\n                            </i-form>\n                        </div>\n                        <div style=\"margin-bottom: 10px;max-height: 220px;overflow: auto\" class=\"iv-list-page-wrap\">\n                            <divider orientation=\"left\" :dashed=\"true\" style=\"font-size: 12px;margin-top: 0px;margin-bottom: 6px\">\u9A8C\u8BC1\u89C4\u5219</divider>\n                            <i-table border :columns=\"validateColumnsConfig\" :data=\"addedValidateRule\"\n                                     class=\"iv-list-table\" :highlight-row=\"true\" size=\"small\" no-data-text=\"\u8BF7\u6DFB\u52A0\u9A8C\u8BC1\u89C4\u5219\"></i-table>\n                        </div>\n                    </card>\n                    <div class=\"button-outer-wrap\">\n                        <div class=\"button-inner-wrap\">\n                            <button-group>\n                                <i-button type=\"primary\" @click=\"selectComplete()\"> \u786E \u8BA4 </i-button>\n                                <i-button type=\"primary\" @click=\"clearComplete()\"> \u6E05 \u7A7A </i-button>\n                                <i-button @click=\"handleClose()\">\u5173 \u95ED</i-button>\n                            </button-group>\n                        </div>\n                    </div>\n                </div>"
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
      window._SelectBindObj = this;
      window.parent.appForm.selectDefaultValueDialogBegin(window, null);
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
      window._SelectBindObj = this;
      window.parent.appForm.selectValidateRuleDialogBegin(window, this.getSelectValidateRuleResultValue());
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
  template: "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 280px\" />\n                        <col style=\"width: 100px\" />\n                        <col />\n                    </colgroup>\n                    <tr>\n                        <td colspan=\"4\">\n                            \u7ED1\u5B9A\u5230\u8868<button class=\"btn-select fright\" v-on:click=\"selectBindFieldView\">...</button>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\u8868\u7F16\u53F7\uFF1A</td>\n                        <td colspan=\"3\">{{bindToField.tableId}}</td>\n                    </tr>\n                    <tr>\n                        <td>\u8868\u540D\uFF1A</td>\n                        <td>{{bindToField.tableName}}</td>\n                        <td>\u8868\u6807\u9898\uFF1A</td>\n                        <td>{{bindToField.tableCaption}}</td>\n                    </tr>\n                    <tr>\n                        <td>\u5B57\u6BB5\u540D\uFF1A</td>\n                        <td>{{bindToField.fieldName}}</td>\n                        <td>\u5B57\u6BB5\u6807\u9898\uFF1A</td>\n                        <td>{{bindToField.fieldCaption}}</td>\n                    </tr>\n                    <tr>\n                        <td>\u7C7B\u578B\uFF1A</td>\n                        <td>{{bindToField.fieldDataType}}</td>\n                        <td>\u957F\u5EA6\uFF1A</td>\n                        <td>{{bindToField.fieldLength}}</td>\n                    </tr>\n                    <tr>\n                        <td colspan=\"4\">\u9ED8\u8BA4\u503C<button class=\"btn-select fright\" v-on:click=\"selectDefaultValueView\">...</button></td>\n                    </tr>\n                    <tr style=\"height: 35px\">\n                        <td colspan=\"4\" style=\"background-color: #ffffff;\">\n                        {{tempData.defaultDisplayText}}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td colspan=\"4\">\n                            \u6821\u9A8C\u89C4\u5219<button class=\"btn-select fright\" v-on:click=\"selectValidateRuleView\">...</button>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td colspan=\"4\" style=\"background-color: #ffffff\">\n                            <table class=\"html-design-plugin-dialog-table-wraper\">\n                                <colgroup>\n                                    <col style=\"width: 100px\" />\n                                    <col />\n                                </colgroup>\n                                <tr>\n                                    <td style=\"text-align: center;\">\u63D0\u793A\u6D88\u606F\uFF1A</td>\n                                    <td>{{validateRules.msg}}</td>\n                                </tr>\n                                <tr>\n                                    <td style=\"text-align: center;\">\u9A8C\u8BC1\u7C7B\u578B</td>\n                                    <td style=\"background: #e8eaec;text-align: center;\">\u53C2\u6570</td>\n                                </tr>\n                                <tr v-for=\"ruleItem in validateRules.rules\">\n                                    <td style=\"background: #ffffff;text-align: center;color: #ad9361\">{{ruleItem.validateType}}</td>\n                                    <td style=\"background: #ffffff;text-align: center;\"><p v-if=\"ruleItem.validateParas === ''\">\u65E0\u53C2\u6570</p><p v-else>{{ruleItem.validateParas}}</p></td>\n                                </tr>\n                            </table>\n                        </td>\n                    </tr>\n                </table>"
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

Vue.component("list-search-control-bind-to", {
  props: ["bindToSearchFieldProp", "dataSetId"],
  data: function data() {
    var _self = this;

    return {
      bindToSearchField: {
        columnTitle: "",
        columnTableName: "",
        columnName: "",
        columnCaption: "",
        columnDataTypeName: "",
        columnOperator: "匹配"
      },
      defaultValue: {
        defaultType: "",
        defaultValue: "",
        defaultText: ""
      },
      tree: {
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
              name: "text"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
              rootPId: "-1"
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {
              _self.selectColumn(treeNode);
            },
            onDblClick: function onDblClick(event, treeId, treeNode) {},
            onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {}
          }
        },
        treeData: null
      },
      tempData: {
        defaultDisplayText: ""
      }
    };
  },
  watch: {
    bindToSearchFieldProp: function bindToSearchFieldProp(newValue) {
      console.log(newValue);
    },
    defaultValueProp: function defaultValueProp(newValue) {
      this.defaultValue = newValue;

      if (!StringUtility.IsNullOrEmpty(this.defaultValue.defaultType)) {
        this.tempData.defaultDisplayText = JBuild4DSelectView.SelectEnvVariable.formatText(this.defaultValue.defaultType, this.defaultValue.defaultText);
      }
    }
  },
  mounted: function mounted() {
    this.bindToField = this.bindToFieldProp;
  },
  methods: {
    init: function init(dataSetVo) {
      console.log(dataSetVo);
      var treeNodeArray = [];
      var treeNodeData = dataSetVo.columnVoList;

      for (var i = 0; i < treeNodeData.length; i++) {
        var singleNode = treeNodeData[i];
        singleNode.pid = dataSetVo.dsId;
        singleNode.text = singleNode.columnCaption + "[" + singleNode.columnName + "]";
        singleNode.nodeType = "DataSetColumn";
        singleNode.id = singleNode.columnId;
        singleNode.icon = BaseUtility.GetRootPath() + "/static/Themes/Png16X16/page.png";
        treeNodeArray.push(singleNode);
      }

      var rootNode = {
        pid: "-1",
        text: dataSetVo.dsName,
        id: dataSetVo.dsId,
        nodeType: "DataSet"
      };
      treeNodeArray.push(rootNode);
      this.tree.treeObj = $.fn.zTree.init($(this.$refs.zTreeUL), this.tree.treeSetting, treeNodeArray);
      this.tree.treeObj.expandAll(true);
    },
    selectColumn: function selectColumn(columnVo) {
      this.bindToSearchField.columnTableName = columnVo.columnTableName;
      this.bindToSearchField.columnName = columnVo.columnName;
      this.bindToSearchField.columnCaption = columnVo.columnCaption;
      this.bindToSearchField.columnDataTypeName = columnVo.columnDataTypeName;
    },
    getData: function getData() {
      console.log(this.bindToSearchField);
      return {
        bindToSearchField: this.bindToSearchField,
        defaultValue: this.defaultValue
      };
    },
    setData: function setData(bindToSearchField, defaultValue) {
      console.log(bindToSearchField);
      this.bindToSearchField = bindToSearchField;
      this.defaultValue = defaultValue;
    },
    selectDefaultValueView: function selectDefaultValueView() {
      window._SelectBindObj = this;
      window.parent.listDesign.selectDefaultValueDialogBegin(window, null);
    }
  },
  template: "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"html-design-plugin-dialog-table-wraper\">\n                    <colgroup>\n                        <col style=\"width: 100px\" />\n                        <col style=\"width: 280px\" />\n                        <col />\n                    </colgroup>\n                    <tr>\n                        <td>\n                            \u6807\u9898\uFF1A\n                        </td>\n                        <td>\n                            <input type=\"text\" v-model=\"bindToSearchField.columnTitle\" />\n                        </td>\n                        <td rowspan=\"9\" valign=\"top\">\n                            <ul ref=\"zTreeUL\" class=\"ztree\"></ul>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            \u6240\u5C5E\u8868\uFF1A\n                        </td>\n                        <td>\n                            {{bindToSearchField.columnTableName}}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            \u7ED1\u5B9A\u5B57\u6BB5\uFF1A\n                        </td>\n                        <td>\n                            {{bindToSearchField.columnCaption}}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            \u5B57\u6BB5\u540D\u79F0\uFF1A\n                        </td>\n                        <td>\n                            {{bindToSearchField.columnName}}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            \u5B57\u6BB5\u7C7B\u578B\uFF1A\n                        </td>\n                        <td>\n                            {{bindToSearchField.columnDataTypeName}}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            \u8FD0\u7B97\u7B26\uFF1A\n                        </td>\n                        <td>\n                            <i-select v-model=\"bindToSearchField.columnOperator\" style=\"width:260px\">\n                                <i-option value=\"\u7B49\u4E8E\">\u7B49\u4E8E</i-option>\n                                <i-option value=\"\u5339\u914D\">\u5339\u914D</i-option>\n                                <i-option value=\"\u4E0D\u7B49\u4E8E\">\u4E0D\u7B49\u4E8E</i-option>\n                                <i-option value=\"\u5927\u4E8E\">\u5927\u4E8E</i-option>\n                                <i-option value=\"\u5927\u4E8E\u7B49\u4E8E\">\u5927\u4E8E\u7B49\u4E8E</i-option>\n                                <i-option value=\"\u5C0F\u4E8E\">\u5C0F\u4E8E</i-option>\n                                <i-option value=\"\u5C0F\u4E8E\u7B49\u4E8E\">\u5C0F\u4E8E\u7B49\u4E8E</i-option>\n                                <i-option value=\"\u5DE6\u5339\u914D\">\u5DE6\u5339\u914D</i-option>\n                                <i-option value=\"\u53F3\u5339\u914D\">\u53F3\u5339\u914D</i-option>\n                                <i-option value=\"\u5305\u542B\">\u5305\u542B</i-option>\n                            </i-select>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td colspan=\"2\">\u9ED8\u8BA4\u503C<button class=\"btn-select fright\" v-on:click=\"selectDefaultValueView\">...</button></td>\n                    </tr>\n                    <tr style=\"height: 35px\">\n                        <td colspan=\"2\" style=\"background-color: #ffffff;\">\n                            {{tempData.defaultDisplayText}}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            \u5907\u6CE8\uFF1A\n                        </td>\n                        <td>\n                            <textarea rows=\"8\"></textarea>\n                        </td>\n                    </tr>\n                </table>"
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
    var _self = this;

    return {
      acInterface: {
        editView: "/HTML/Builder/List/ListDesign.html",
        reloadData: "/PlatFormRest/Builder/List/GetListData",
        delete: "/PlatFormRest/Builder/List/Delete",
        move: "/PlatFormRest/Builder/List/Move"
      },
      idFieldName: "listId",
      searchCondition: {
        listModuleId: {
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
        key: 'listCode',
        align: "center",
        width: 80
      }, {
        title: '列表名称',
        key: 'listName',
        align: "center"
      }, {
        title: '唯一名',
        key: 'listSingleName',
        align: "center"
      }, {
        title: '备注',
        key: 'listDesc',
        align: "center"
      }, {
        title: '编辑时间',
        key: 'listUpdateTime',
        width: 100,
        align: "center",
        render: function render(h, params) {
          return ListPageUtility.IViewTableRenderer.ToDateYYYY_MM_DD(h, params.row.listUpdateTime);
        }
      }, {
        title: '操作',
        key: 'listId',
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
  mounted: function mounted() {},
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
      if (this.moduleData != null && this.activeTabName == "list-weblist") {
        this.searchCondition.listModuleId.value = this.moduleData.moduleId;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXAvZGF0YXNldC1zaW1wbGUtc2VsZWN0LWNvbXAuanMiLCJDb21wL2pzLWRlc2lnbi1jb2RlLWZyYWdtZW50LmpzIiwiQ29tcC9zcWwtZ2VuZXJhbC1kZXNpZ24tY29tcC5qcyIsIkNvbXAvdGFibGUtcmVsYXRpb24tY29udGVudC1jb21wLmpzIiwiRGlhbG9nL3NlbGVjdC1kZWZhdWx0LXZhbHVlLWRpYWxvZy5qcyIsIkRpYWxvZy9zZWxlY3QtZGVwYXJ0bWVudC11c2VyLWRpYWxvZy5qcyIsIkRpYWxvZy9zZWxlY3Qtc2luZ2xlLXRhYmxlLWRpYWxvZy5qcyIsIkRpYWxvZy9zZWxlY3QtdmFsaWRhdGUtcnVsZS1kaWFsb2cuanMiLCJEaWFsb2cvdGFibGUtcmVsYXRpb24tY29ubmVjdC10d28tdGFibGUtZGlhbG9nLmpzIiwiSFRNTERlc2lnbi9kYi10YWJsZS1yZWxhdGlvbi1jb21wLmpzIiwiSFRNTERlc2lnbi9kZXNpZ24taHRtbC1lbGVtLWxpc3QuanMiLCJIVE1MRGVzaWduL2ZkLWNvbnRyb2wtYmFzZS1pbmZvLmpzIiwiSFRNTERlc2lnbi9mZC1jb250cm9sLWJpbmQtdG8uanMiLCJIVE1MRGVzaWduL2ZkLWNvbnRyb2wtc2VsZWN0LWJpbmQtdG8tc2luZ2xlLWZpZWxkLWRpYWxvZy5qcyIsIkhUTUxEZXNpZ24vbGlzdC1zZWFyY2gtY29udHJvbC1iaW5kLXRvLmpzIiwiTW9kdWxlL21vZHVsZS1saXN0LWFib3V0Y29uZmlnLWNvbXAuanMiLCJNb2R1bGUvbW9kdWxlLWxpc3QtYXBwZm9ybS1jb21wLmpzIiwiTW9kdWxlL21vZHVsZS1saXN0LWFwcGxpc3QtY29tcC5qcyIsIk1vZHVsZS9tb2R1bGUtbGlzdC1mbG93LWNvbXAuanMiLCJNb2R1bGUvbW9kdWxlLWxpc3QtcmVwb3J0LWNvbXAuanMiLCJNb2R1bGUvbW9kdWxlLWxpc3Qtd2ViZm9ybS1jb21wLmpzIiwiTW9kdWxlL21vZHVsZS1saXN0LXdlYmxpc3QtY29tcC5qcyIsIlNlbGVjdEJ1dHRvbi9zZWxlY3Qtb3JnYW4tY29tcC5qcyIsIlNlbGVjdEJ1dHRvbi9zZWxlY3Qtb3JnYW4tc2luZ2xlLWNvbXAuanMiLCJTU08vc3NvLWFwcC1kZXRhaWwtZnJvbS1jb21wLmpzIiwiU1NPL3Nzby1hcHAtaW50ZXJmYWNlLWxpc3QtY29tcC5qcyIsIlNTTy9zc28tYXBwLXN1Yi1zeXN0ZW0tbGlzdC1jb21wLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25xQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pJQTtBQ0FBO0FDQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcFlBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJWdWVFWENvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwiZGF0YXNldC1zaW1wbGUtc2VsZWN0LWNvbXBcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0RGF0YVNldERhdGE6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTZXQvRGF0YVNldE1haW4vR2V0RGF0YVNldHNGb3JaVHJlZU5vZGVMaXN0XCJcbiAgICAgIH0sXG4gICAgICBkYXRhU2V0VHJlZToge1xuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgaWYgKHRyZWVOb2RlLm5vZGVUeXBlTmFtZSA9PSBcIkRhdGFTZXRcIikge1xuICAgICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkTm9kZSh0cmVlTm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVEYXRhOiBudWxsLFxuICAgICAgICBzZWxlY3RlZFRhYmxlTmFtZTogXCLml6BcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5iaW5kRGF0YVNldFRyZWUoKTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGJpbmREYXRhU2V0VHJlZTogZnVuY3Rpb24gYmluZERhdGFTZXRUcmVlKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldERhdGFTZXREYXRhLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LmRhdGEgIT0gbnVsbCAmJiByZXN1bHQuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChyZXN1bHQuZGF0YVtpXS5ub2RlVHlwZU5hbWUgPT0gXCJEYXRhU2V0R3JvdXBcIikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhW2ldLmljb24gPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvc3RhdGljL1RoZW1lcy9QbmcxNlgxNi9wYWNrYWdlLnBuZ1wiO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhW2ldLmljb24gPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvc3RhdGljL1RoZW1lcy9QbmcxNlgxNi9hcHBsaWNhdGlvbl92aWV3X2NvbHVtbnMucG5nXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfc2VsZi5kYXRhU2V0VHJlZS50cmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIF9zZWxmLmRhdGFTZXRUcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNkYXRhU2V0WlRyZWVVTFwiKSwgX3NlbGYuZGF0YVNldFRyZWUudHJlZVNldHRpbmcsIF9zZWxmLmRhdGFTZXRUcmVlLnRyZWVEYXRhKTtcblxuICAgICAgICAgIF9zZWxmLmRhdGFTZXRUcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuXG4gICAgICAgICAgZnV6enlTZWFyY2hUcmVlT2JqKF9zZWxmLmRhdGFTZXRUcmVlLnRyZWVPYmosIF9zZWxmLiRyZWZzLnR4dF9zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgc2VsZWN0ZWROb2RlOiBmdW5jdGlvbiBzZWxlY3RlZE5vZGUodHJlZU5vZGUpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLWRhdGFzZXQnLCB0cmVlTm9kZSk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cImlucHV0X2JvcmRlcl9ib3R0b21cIiByZWY9XCJ0eHRfc2VhcmNoX3RleHRcIiBwbGFjZWhvbGRlcj1cIuivt+i+k+WFpeihqOWQjeaIluiAheagh+mimFwiPjwvaS1pbnB1dD5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cImRhdGFTZXRaVHJlZVVMXCIgY2xhc3M9XCJ6dHJlZVwiPjwvdWw+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwianMtZGVzaWduLWNvZGUtZnJhZ21lbnRcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBqc0VkaXRvckluc3RhbmNlOiBudWxsXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgc2V0SlNFZGl0b3JJbnN0YW5jZTogZnVuY3Rpb24gc2V0SlNFZGl0b3JJbnN0YW5jZShvYmopIHtcbiAgICAgIHRoaXMuanNFZGl0b3JJbnN0YW5jZSA9IG9iajtcbiAgICB9LFxuICAgIGdldEpzRWRpdG9ySW5zdDogZnVuY3Rpb24gZ2V0SnNFZGl0b3JJbnN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuanNFZGl0b3JJbnN0YW5jZTtcbiAgICB9LFxuICAgIGluc2VydEpzOiBmdW5jdGlvbiBpbnNlcnRKcyhqcykge1xuICAgICAgdmFyIGRvYyA9IHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkuZ2V0RG9jKCk7XG4gICAgICB2YXIgY3Vyc29yID0gZG9jLmdldEN1cnNvcigpO1xuICAgICAgZG9jLnJlcGxhY2VSYW5nZShqcywgY3Vyc29yKTtcbiAgICB9LFxuICAgIGZvcm1hdEpTOiBmdW5jdGlvbiBmb3JtYXRKUygpIHtcbiAgICAgIENvZGVNaXJyb3IuY29tbWFuZHNbXCJzZWxlY3RBbGxcIl0odGhpcy5nZXRKc0VkaXRvckluc3QoKSk7XG4gICAgICB2YXIgcmFuZ2UgPSB7XG4gICAgICAgIGZyb206IHRoaXMuZ2V0SnNFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKHRydWUpLFxuICAgICAgICB0bzogdGhpcy5nZXRKc0VkaXRvckluc3QoKS5nZXRDdXJzb3IoZmFsc2UpXG4gICAgICB9O1xuICAgICAgO1xuICAgICAgdGhpcy5nZXRKc0VkaXRvckluc3QoKS5hdXRvRm9ybWF0UmFuZ2UocmFuZ2UuZnJvbSwgcmFuZ2UudG8pO1xuICAgIH0sXG4gICAgYWxlcnREZXNjOiBmdW5jdGlvbiBhbGVydERlc2MoKSB7fSxcbiAgICByZWZTY3JpcHQ6IGZ1bmN0aW9uIHJlZlNjcmlwdCgpIHtcbiAgICAgIHZhciBqcyA9IFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2phdmFzY3JpcHRcXFwiIHNyYz1cXFwiJHtjb250ZXh0UGF0aH0vVUlDb21wb25lbnQvVHJlZVRhYmxlL0pzL1RyZWVUYWJsZS5qc1xcXCI+PC9zY3JpcHQ+XCI7XG4gICAgICB0aGlzLmluc2VydEpzKGpzKTtcbiAgICB9LFxuICAgIGNhbGxTZXJ2aWNlTWV0aG9kOiBmdW5jdGlvbiBjYWxsU2VydmljZU1ldGhvZCgpIHt9XG4gIH0sXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtd3JhcFwiPlxcXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIiBAY2xpY2s9XCJmb3JtYXRKU1wiPuagvOW8j+WMljwvZGl2PlxcXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIj7or7TmmI48L2Rpdj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCIgQGNsaWNrPVwicmVmU2NyaXB0XCI+5byV5YWl6ISa5pysPC9kaXY+XFxcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzLWNvZGUtZnJhZ21lbnQtaXRlbVwiPuiOt+WPllVSTOWPguaVsDwvZGl2PlxcXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqcy1jb2RlLWZyYWdtZW50LWl0ZW1cIj7osIPnlKjmnI3liqHmlrnms5U8L2Rpdj5cXFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwianMtY29kZS1mcmFnbWVudC1pdGVtXCI+5Yqg6L295pWw5o2u5a2X5YW4PC9kaXY+XFxcclxuICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNxbC1nZW5lcmFsLWRlc2lnbi1jb21wXCIsIHtcbiAgcHJvcHM6IFtcInNxbERlc2lnbmVySGVpZ2h0XCIsIFwidmFsdWVcIl0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNxbFRleHQ6IFwiXCIsXG4gICAgICBzZWxlY3RlZEl0ZW1WYWx1ZTogXCLor7TmmI5cIixcbiAgICAgIHNlbGZUYWJsZUZpZWxkczogW10sXG4gICAgICBwYXJlbnRUYWJsZUZpZWxkczogW11cbiAgICB9O1xuICB9LFxuICB3YXRjaDoge1xuICAgIHNxbFRleHQ6IGZ1bmN0aW9uIHNxbFRleHQobmV3VmFsKSB7XG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG5ld1ZhbCk7XG4gICAgfSxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnNxbFRleHQgPSBuZXdWYWw7XG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuc3FsQ29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKCQoXCIjVGV4dEFyZWFTUUxFZGl0b3JcIilbMF0sIHtcbiAgICAgIG1vZGU6IFwidGV4dC94LXNxbFwiLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICBmb2xkR3V0dGVyOiB0cnVlLFxuICAgICAgdGhlbWU6IFwibW9ub2thaVwiXG4gICAgfSk7XG4gICAgdGhpcy5zcWxDb2RlTWlycm9yLnNldFNpemUoXCIxMDAlXCIsIHRoaXMuc3FsRGVzaWduZXJIZWlnaHQpO1xuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHRoaXMuc3FsQ29kZU1pcnJvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoY01pcnJvcikge1xuICAgICAgY29uc29sZS5sb2coY01pcnJvci5nZXRWYWx1ZSgpKTtcbiAgICAgIF9zZWxmLnNxbFRleHQgPSBjTWlycm9yLmdldFZhbHVlKCk7XG4gICAgfSk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XG4gICAgICB0aGlzLnNxbENvZGVNaXJyb3IuZ2V0VmFsdWUoKTtcbiAgICB9LFxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgdGhpcy5zcWxDb2RlTWlycm9yLnNldFZhbHVlKHZhbHVlKTtcbiAgICB9LFxuICAgIHNldEFib3V0VGFibGVGaWVsZHM6IGZ1bmN0aW9uIHNldEFib3V0VGFibGVGaWVsZHMoc2VsZlRhYmxlRmllbGRzLCBwYXJlbnRUYWJsZUZpZWxkcykge1xuICAgICAgdGhpcy5zZWxmVGFibGVGaWVsZHMgPSBzZWxmVGFibGVGaWVsZHM7XG4gICAgICB0aGlzLnBhcmVudFRhYmxlRmllbGRzID0gcGFyZW50VGFibGVGaWVsZHM7XG4gICAgfSxcbiAgICBpbnNlcnRFbnZUb0VkaXRvcjogZnVuY3Rpb24gaW5zZXJ0RW52VG9FZGl0b3IoY29kZSkge1xuICAgICAgdGhpcy5pbnNlcnRDb2RlQXRDdXJzb3IoY29kZSk7XG4gICAgfSxcbiAgICBpbnNlcnRGaWVsZFRvRWRpdG9yOiBmdW5jdGlvbiBpbnNlcnRGaWVsZFRvRWRpdG9yKHNvdXJjZVR5cGUsIGV2ZW50KSB7XG4gICAgICB2YXIgc291cmNlRmllbGRzID0gbnVsbDtcblxuICAgICAgaWYgKHNvdXJjZVR5cGUgPT0gXCJzZWxmVGFibGVGaWVsZHNcIikge1xuICAgICAgICBzb3VyY2VGaWVsZHMgPSB0aGlzLnNlbGZUYWJsZUZpZWxkcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvdXJjZUZpZWxkcyA9IHRoaXMucGFyZW50VGFibGVGaWVsZHM7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VGaWVsZHNbaV0uZmllbGROYW1lID09IGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5pbnNlcnRDb2RlQXRDdXJzb3Ioc291cmNlRmllbGRzW2ldLnRhYmxlTmFtZSArIFwiLlwiICsgc291cmNlRmllbGRzW2ldLmZpZWxkTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGluc2VydENvZGVBdEN1cnNvcjogZnVuY3Rpb24gaW5zZXJ0Q29kZUF0Q3Vyc29yKGNvZGUpIHtcbiAgICAgIHZhciBkb2MgPSB0aGlzLnNxbENvZGVNaXJyb3IuZ2V0RG9jKCk7XG4gICAgICB2YXIgY3Vyc29yID0gZG9jLmdldEN1cnNvcigpO1xuICAgICAgZG9jLnJlcGxhY2VSYW5nZShjb2RlLCBjdXJzb3IpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2PlxcXHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJUZXh0QXJlYVNRTEVkaXRvclwiPjwvdGV4dGFyZWE+XFxcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDttYXJnaW4tdG9wOiA4cHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cCBzaXplPVwic21hbGxcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIEBjbGljaz1cImluc2VydEVudlRvRWRpdG9yKFxcJyN7QXBpVmFyLuW9k+WJjeeUqOaIt+aJgOWcqOe7hOe7h0lEfVxcJylcIj7nu4Tnu4dJZDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi35omA5Zyo57uE57uH5ZCN56ewfVxcJylcIj7nu4Tnu4flkI3np7A8L0J1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIEBjbGljaz1cImluc2VydEVudlRvRWRpdG9yKFxcJyN7QXBpVmFyLuW9k+WJjeeUqOaIt0lEfVxcJylcIj7nlKjmiLdJZDwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gQGNsaWNrPVwiaW5zZXJ0RW52VG9FZGl0b3IoXFwnI3tBcGlWYXIu5b2T5YmN55So5oi35ZCN56ewfVxcJylcIj7nlKjmiLflkI3np7A8L0J1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIEBjbGljaz1cImluc2VydEVudlRvRWRpdG9yKFxcJyN7RGF0ZVRpbWUu5bm05bm05bm05bm0LeaciOaciC3ml6Xml6V9XFwnKVwiPnl5eXktTU0tZGQ8L0J1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uPuivtOaYjjwvQnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Hcm91cD5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOiA4cHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdDttYXJnaW46IDRweCAxMHB4XCI+5pys6KGo5a2X5q61PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnRcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1zZWxlY3QgcGxhY2Vob2xkZXI9XCLpu5jorqTkvb/nlKhJZOWtl+autVwiIHNpemU9XCJzbWFsbFwiIHN0eWxlPVwid2lkdGg6MTc1cHhcIiBAb24tY2hhbmdlPVwiaW5zZXJ0RmllbGRUb0VkaXRvcihcXCdzZWxmVGFibGVGaWVsZHNcXCcsJGV2ZW50KVwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHNlbGZUYWJsZUZpZWxkc1wiIDp2YWx1ZT1cIml0ZW0uZmllbGROYW1lXCIgOmtleT1cIml0ZW0uZmllbGROYW1lXCI+e3tpdGVtLmZpZWxkQ2FwdGlvbn19PC9pLW9wdGlvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnQ7bWFyZ2luOiA0cHggMTBweFwiPueItuihqOWtl+autTwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHBsYWNlaG9sZGVyPVwi6buY6K6k5L2/55SoSWTlrZfmrrVcIiBzaXplPVwic21hbGxcIiBzdHlsZT1cIndpZHRoOjE3N3B4XCIgQG9uLWNoYW5nZT1cImluc2VydEZpZWxkVG9FZGl0b3IoXFwncGFyZW50VGFibGVGaWVsZHNcXCcsJGV2ZW50KVwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHBhcmVudFRhYmxlRmllbGRzXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInRhYmxlLXJlbGF0aW9uLWNvbnRlbnQtY29tcFwiLCB7XG4gIHByb3BzOiBbXCJyZWxhdGlvblwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0VGFibGVzRmllbGRzQnlUYWJsZUlkczogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVzRmllbGRzQnlUYWJsZUlkc1wiLFxuICAgICAgICBzYXZlRGlhZ3JhbTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvVGFibGVSZWxhdGlvbi9UYWJsZVJlbGF0aW9uL1NhdmVEaWFncmFtXCIsXG4gICAgICAgIGdldFNpbmdsZURpYWdyYW1EYXRhOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9UYWJsZVJlbGF0aW9uL1RhYmxlUmVsYXRpb24vR2V0RGV0YWlsRGF0YVwiLFxuICAgICAgICB0YWJsZVZpZXc6IFwiL0hUTUwvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZUVkaXQuaHRtbFwiXG4gICAgICB9LFxuICAgICAgdGFibGVSZWxhdGlvbkRpYWdyYW06IG51bGwsXG4gICAgICBkaXNwbGF5RGVzYzogdHJ1ZSxcbiAgICAgIGZvcm1hdEpzb246IG51bGwsXG4gICAgICByZWNvcmRJZDogdGhpcy5yZWxhdGlvbi5yZWxhdGlvbklkXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICAkKHRoaXMuJHJlZnMucmVsYXRpb25Db250ZW50T3V0ZXJXcmFwKS5jc3MoXCJoZWlnaHRcIiwgUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSA3NSk7XG5cbiAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSA8IDEwMDApIHtcbiAgICAgIHRoaXMuZGlzcGxheURlc2MgPSBmYWxzZTtcbiAgICAgICQoXCIudGFibGUtcmVsYXRpb24tb3AtYnV0dG9ucy1vdXRlci13cmFwXCIpLmNzcyhcIndpZHRoXCIsIFwiMTAwJVwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXREaWFncmFtKCk7XG4gICAgdGhpcy5sb2FkUmVsYXRpb25EZXRhaWxEYXRhKCk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgaWYgKHdpbmRvdy5nb1NhbXBsZXMpIGdvU2FtcGxlcygpO1xuICAgICAgdmFyICQgPSBnby5HcmFwaE9iamVjdC5tYWtlO1xuICAgICAgdmFyIG15RGlhZ3JhbSA9ICQoZ28uRGlhZ3JhbSwgXCJ0YWJsZVJlbGF0aW9uRGlhZ3JhbURpdlwiLCB7XG4gICAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgICAgYWxsb3dDb3B5OiBmYWxzZSxcbiAgICAgICAgbGF5b3V0OiAkKGdvLkZvcmNlRGlyZWN0ZWRMYXlvdXQpLFxuICAgICAgICBcInVuZG9NYW5hZ2VyLmlzRW5hYmxlZFwiOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHZhciBibHVlZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTUwLCAxNTAsIDI1MClcIixcbiAgICAgICAgMC41OiBcInJnYig4NiwgODYsIDE4NilcIixcbiAgICAgICAgMTogXCJyZ2IoODYsIDg2LCAxODYpXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIGdyZWVuZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTU4LCAyMDksIDE1OSlcIixcbiAgICAgICAgMTogXCJyZ2IoNjcsIDEwMSwgNTYpXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIHJlZGdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDIwNiwgMTA2LCAxMDApXCIsXG4gICAgICAgIDE6IFwicmdiKDE4MCwgNTYsIDUwKVwiXG4gICAgICB9KTtcbiAgICAgIHZhciB5ZWxsb3dncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigyNTQsIDIyMSwgNTApXCIsXG4gICAgICAgIDE6IFwicmdiKDI1NCwgMTgyLCA1MClcIlxuICAgICAgfSk7XG4gICAgICB2YXIgbGlnaHRncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAxOiBcIiNFNkU2RkFcIixcbiAgICAgICAgMDogXCIjRkZGQUYwXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIGl0ZW1UZW1wbCA9ICQoZ28uUGFuZWwsIFwiSG9yaXpvbnRhbFwiLCAkKGdvLlNoYXBlLCB7XG4gICAgICAgIGRlc2lyZWRTaXplOiBuZXcgZ28uU2l6ZSgxMCwgMTApXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcImZpZ3VyZVwiLCBcImZpZ3VyZVwiKSwgbmV3IGdvLkJpbmRpbmcoXCJmaWxsXCIsIFwiY29sb3JcIikpLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICBzdHJva2U6IFwiIzMzMzMzM1wiLFxuICAgICAgICBmb250OiBcImJvbGQgMTRweCBzYW5zLXNlcmlmXCJcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcIm5hbWVcIikpKTtcbiAgICAgIG15RGlhZ3JhbS5ub2RlVGVtcGxhdGUgPSAkKGdvLk5vZGUsIFwiQXV0b1wiLCB7XG4gICAgICAgIHNlbGVjdGlvbkFkb3JuZWQ6IHRydWUsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgbGF5b3V0Q29uZGl0aW9uczogZ28uUGFydC5MYXlvdXRTdGFuZGFyZCAmIH5nby5QYXJ0LkxheW91dE5vZGVTaXplZCxcbiAgICAgICAgZnJvbVNwb3Q6IGdvLlNwb3QuQWxsU2lkZXMsXG4gICAgICAgIHRvU3BvdDogZ28uU3BvdC5BbGxTaWRlcyxcbiAgICAgICAgaXNTaGFkb3dlZDogdHJ1ZSxcbiAgICAgICAgc2hhZG93Q29sb3I6IFwiI0M1QzFBQVwiXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcImxvY2F0aW9uXCIsIFwibG9jYXRpb25cIikubWFrZVR3b1dheSgpLCBuZXcgZ28uQmluZGluZyhcImRlc2lyZWRTaXplXCIsIFwidmlzaWJsZVwiLCBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gbmV3IGdvLlNpemUoTmFOLCBOYU4pO1xuICAgICAgfSkub2ZPYmplY3QoXCJMSVNUXCIpLCAkKGdvLlNoYXBlLCBcIlJlY3RhbmdsZVwiLCB7XG4gICAgICAgIGZpbGw6IGxpZ2h0Z3JhZCxcbiAgICAgICAgc3Ryb2tlOiBcIiM3NTY4NzVcIixcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDNcbiAgICAgIH0pLCAkKGdvLlBhbmVsLCBcIlRhYmxlXCIsIHtcbiAgICAgICAgbWFyZ2luOiA4LFxuICAgICAgICBzdHJldGNoOiBnby5HcmFwaE9iamVjdC5GaWxsXG4gICAgICB9LCAkKGdvLlJvd0NvbHVtbkRlZmluaXRpb24sIHtcbiAgICAgICAgcm93OiAwLFxuICAgICAgICBzaXppbmc6IGdvLlJvd0NvbHVtbkRlZmluaXRpb24uTm9uZVxuICAgICAgfSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIHJvdzogMCxcbiAgICAgICAgYWxpZ25tZW50OiBnby5TcG90LkNlbnRlcixcbiAgICAgICAgbWFyZ2luOiBuZXcgZ28uTWFyZ2luKDAsIDE0LCAwLCAyKSxcbiAgICAgICAgZm9udDogXCJib2xkIDE2cHggc2Fucy1zZXJpZlwiXG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJrZXlcIikpLCAkKFwiUGFuZWxFeHBhbmRlckJ1dHRvblwiLCBcIkxJU1RcIiwge1xuICAgICAgICByb3c6IDAsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5Ub3BSaWdodFxuICAgICAgfSksICQoZ28uUGFuZWwsIFwiVmVydGljYWxcIiwge1xuICAgICAgICBuYW1lOiBcIkxJU1RcIixcbiAgICAgICAgcm93OiAxLFxuICAgICAgICBwYWRkaW5nOiAzLFxuICAgICAgICBhbGlnbm1lbnQ6IGdvLlNwb3QuVG9wTGVmdCxcbiAgICAgICAgZGVmYXVsdEFsaWdubWVudDogZ28uU3BvdC5MZWZ0LFxuICAgICAgICBzdHJldGNoOiBnby5HcmFwaE9iamVjdC5Ib3Jpem9udGFsLFxuICAgICAgICBpdGVtVGVtcGxhdGU6IGl0ZW1UZW1wbFxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJpdGVtQXJyYXlcIiwgXCJpdGVtc1wiKSkpKTtcbiAgICAgIG15RGlhZ3JhbS5saW5rVGVtcGxhdGUgPSAkKGdvLkxpbmssIHtcbiAgICAgICAgc2VsZWN0aW9uQWRvcm5lZDogdHJ1ZSxcbiAgICAgICAgbGF5ZXJOYW1lOiBcIkZvcmVncm91bmRcIixcbiAgICAgICAgcmVzaGFwYWJsZTogdHJ1ZSxcbiAgICAgICAgcm91dGluZzogZ28uTGluay5Bdm9pZHNOb2RlcyxcbiAgICAgICAgY29ybmVyOiA1LFxuICAgICAgICBjdXJ2ZTogZ28uTGluay5KdW1wT3ZlclxuICAgICAgfSwgJChnby5TaGFwZSwge1xuICAgICAgICBzdHJva2U6IFwiIzMwM0I0NVwiLFxuICAgICAgICBzdHJva2VXaWR0aDogMi41XG4gICAgICB9KSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICBmb250OiBcImJvbGQgMTRweCBzYW5zLXNlcmlmXCIsXG4gICAgICAgIHN0cm9rZTogXCIjMTk2N0IzXCIsXG4gICAgICAgIHNlZ21lbnRJbmRleDogMCxcbiAgICAgICAgc2VnbWVudE9mZnNldDogbmV3IGdvLlBvaW50KE5hTiwgTmFOKSxcbiAgICAgICAgc2VnbWVudE9yaWVudGF0aW9uOiBnby5MaW5rLk9yaWVudFVwcmlnaHRcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcInRleHRcIikpLCAkKGdvLlRleHRCbG9jaywge1xuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIixcbiAgICAgICAgc3Ryb2tlOiBcIiMxOTY3QjNcIixcbiAgICAgICAgc2VnbWVudEluZGV4OiAtMSxcbiAgICAgICAgc2VnbWVudE9mZnNldDogbmV3IGdvLlBvaW50KE5hTiwgTmFOKSxcbiAgICAgICAgc2VnbWVudE9yaWVudGF0aW9uOiBnby5MaW5rLk9yaWVudFVwcmlnaHRcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcInRvVGV4dFwiKSkpO1xuICAgICAgdmFyIG5vZGVEYXRhQXJyYXkgPSBbe1xuICAgICAgICBrZXk6IFwiUHJvZHVjdHNcIixcbiAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgbmFtZTogXCJQcm9kdWN0SURcIixcbiAgICAgICAgICBpc2tleTogdHJ1ZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogeWVsbG93Z3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJQcm9kdWN0TmFtZVwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiQ3ViZTFcIixcbiAgICAgICAgICBjb2xvcjogYmx1ZWdyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiU3VwcGxpZXJJRFwiLFxuICAgICAgICAgIGlza2V5OiBmYWxzZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogXCJwdXJwbGVcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJDYXRlZ29yeUlEXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJEZWNpc2lvblwiLFxuICAgICAgICAgIGNvbG9yOiBcInB1cnBsZVwiXG4gICAgICAgIH1dXG4gICAgICB9LCB7XG4gICAgICAgIGtleTogXCJTdXBwbGllcnNcIixcbiAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgbmFtZTogXCJTdXBwbGllcklEXCIsXG4gICAgICAgICAgaXNrZXk6IHRydWUsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IHllbGxvd2dyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiQ29tcGFueU5hbWVcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkN1YmUxXCIsXG4gICAgICAgICAgY29sb3I6IGJsdWVncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkNvbnRhY3ROYW1lXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJDdWJlMVwiLFxuICAgICAgICAgIGNvbG9yOiBibHVlZ3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJBZGRyZXNzXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJDdWJlMVwiLFxuICAgICAgICAgIGNvbG9yOiBibHVlZ3JhZFxuICAgICAgICB9XVxuICAgICAgfSwge1xuICAgICAgICBrZXk6IFwiQ2F0ZWdvcmllc1wiLFxuICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICBuYW1lOiBcIkNhdGVnb3J5SURcIixcbiAgICAgICAgICBpc2tleTogdHJ1ZSxcbiAgICAgICAgICBmaWd1cmU6IFwiRGVjaXNpb25cIixcbiAgICAgICAgICBjb2xvcjogeWVsbG93Z3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJDYXRlZ29yeU5hbWVcIixcbiAgICAgICAgICBpc2tleTogZmFsc2UsXG4gICAgICAgICAgZmlndXJlOiBcIkN1YmUxXCIsXG4gICAgICAgICAgY29sb3I6IGJsdWVncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJDdWJlMVwiLFxuICAgICAgICAgIGNvbG9yOiBibHVlZ3JhZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogXCJQaWN0dXJlXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJUcmlhbmdsZVVwXCIsXG4gICAgICAgICAgY29sb3I6IHJlZGdyYWRcbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiBcIk9yZGVyIERldGFpbHNcIixcbiAgICAgICAgaXRlbXM6IFt7XG4gICAgICAgICAgbmFtZTogXCJPcmRlcklEXCIsXG4gICAgICAgICAgaXNrZXk6IHRydWUsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IHllbGxvd2dyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiUHJvZHVjdElEXCIsXG4gICAgICAgICAgaXNrZXk6IHRydWUsXG4gICAgICAgICAgZmlndXJlOiBcIkRlY2lzaW9uXCIsXG4gICAgICAgICAgY29sb3I6IHllbGxvd2dyYWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIG5hbWU6IFwiVW5pdFByaWNlXCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJNYWduZXRpY0RhdGFcIixcbiAgICAgICAgICBjb2xvcjogZ3JlZW5ncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIlF1YW50aXR5XCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJNYWduZXRpY0RhdGFcIixcbiAgICAgICAgICBjb2xvcjogZ3JlZW5ncmFkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiBcIkRpc2NvdW50XCIsXG4gICAgICAgICAgaXNrZXk6IGZhbHNlLFxuICAgICAgICAgIGZpZ3VyZTogXCJNYWduZXRpY0RhdGFcIixcbiAgICAgICAgICBjb2xvcjogZ3JlZW5ncmFkXG4gICAgICAgIH1dXG4gICAgICB9XTtcbiAgICAgIHZhciBsaW5rRGF0YUFycmF5ID0gW3tcbiAgICAgICAgZnJvbTogXCJQcm9kdWN0c1wiLFxuICAgICAgICB0bzogXCJTdXBwbGllcnNcIixcbiAgICAgICAgdGV4dDogXCIwLi5OXCIsXG4gICAgICAgIHRvVGV4dDogXCIxXCJcbiAgICAgIH0sIHtcbiAgICAgICAgZnJvbTogXCJQcm9kdWN0c1wiLFxuICAgICAgICB0bzogXCJDYXRlZ29yaWVzXCIsXG4gICAgICAgIHRleHQ6IFwiMC4uTlwiLFxuICAgICAgICB0b1RleHQ6IFwiMVwiXG4gICAgICB9LCB7XG4gICAgICAgIGZyb206IFwiT3JkZXIgRGV0YWlsc1wiLFxuICAgICAgICB0bzogXCJQcm9kdWN0c1wiLFxuICAgICAgICB0ZXh0OiBcIjAuLk5cIixcbiAgICAgICAgdG9UZXh0OiBcIjFcIlxuICAgICAgfV07XG4gICAgICBteURpYWdyYW0ubW9kZWwgPSAkKGdvLkdyYXBoTGlua3NNb2RlbCwge1xuICAgICAgICBjb3BpZXNBcnJheXM6IHRydWUsXG4gICAgICAgIGNvcGllc0FycmF5T2JqZWN0czogdHJ1ZSxcbiAgICAgICAgbm9kZURhdGFBcnJheTogbm9kZURhdGFBcnJheSxcbiAgICAgICAgbGlua0RhdGFBcnJheTogbGlua0RhdGFBcnJheVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBzaG93U2VsZWN0VGFibGVEaWFsb2c6IGZ1bmN0aW9uIHNob3dTZWxlY3RUYWJsZURpYWxvZygpIHtcbiAgICAgIHRoaXMuJHJlZnMuc2VsZWN0U2luZ2xlVGFibGVEaWFsb2cuYmVnaW5TZWxlY3RUYWJsZSgpO1xuICAgIH0sXG4gICAgc2hvd1NlbGVjdEZpZWxkQ29ubmVjdERpYWxvZzogZnVuY3Rpb24gc2hvd1NlbGVjdEZpZWxkQ29ubmVjdERpYWxvZygpIHtcbiAgICAgIHZhciBmcm9tVGFibGVJZCA9IFwiXCI7XG4gICAgICB2YXIgdG9UYWJsZUlkID0gXCJcIjtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0uc2VsZWN0aW9uLmVhY2goZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgaWYgKHBhcnQgaW5zdGFuY2VvZiBnby5Ob2RlKSB7XG4gICAgICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgZnJvbVRhYmxlSWQgPSBwYXJ0LmRhdGEudGFibGVJZDtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9UYWJsZUlkID0gcGFydC5kYXRhLnRhYmxlSWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCF0b1RhYmxlSWQpIHtcbiAgICAgICAgdG9UYWJsZUlkID0gZnJvbVRhYmxlSWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmcm9tVGFibGVJZCAhPSBcIlwiICYmIHRvVGFibGVJZCAhPSBcIlwiKSB7XG4gICAgICAgIHRoaXMuJHJlZnMudGFibGVSZWxhdGlvbkNvbm5lY3RUd29UYWJsZURpYWxvZy5iZWdpblNlbGVjdENvbm5lY3QoZnJvbVRhYmxlSWQsIHRvVGFibGVJZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+WFiOmAieS4rTLkuKroioLngrlcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRUYWJsZVRvRGlhZ3JhbTogZnVuY3Rpb24gYWRkVGFibGVUb0RpYWdyYW0odGFibGVEYXRhKSB7XG4gICAgICB2YXIgdGFibGVJZCA9IHRhYmxlRGF0YS5pZDtcbiAgICAgIHZhciB0YWJsZUlkcyA9IFt0YWJsZUlkXTtcblxuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgaWYgKCF0aGlzLnRhYmxlSXNFeGlzdEluRGlhZ3JhbSh0YWJsZUlkKSkge1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVzRmllbGRzQnlUYWJsZUlkcywge1xuICAgICAgICAgIFwidGFibGVJZHNcIjogdGFibGVJZHNcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgdmFyIGFsbEZpZWxkcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgICAgdmFyIHNpbmdsZVRhYmxlID0gcmVzdWx0LmV4S1ZEYXRhLlRhYmxlc1swXTtcbiAgICAgICAgICAgIHZhciBhbGxGaWVsZHNTdHlsZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBhbGxGaWVsZHNbaV0uZGlzcGxheVRleHQgPSBhbGxGaWVsZHNbaV0uZmllbGROYW1lICsgXCJbXCIgKyBhbGxGaWVsZHNbaV0uZmllbGRDYXB0aW9uICsgXCJdXCI7XG4gICAgICAgICAgICAgIGFsbEZpZWxkc1N0eWxlLnB1c2goX3NlbGYucmVuZGVyZXJGaWVsZFN0eWxlKGFsbEZpZWxkc1tpXSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbW9kZWxOb2RlRGF0YSA9IHtcbiAgICAgICAgICAgICAgdGFibGVJZDogdGFibGVJZCxcbiAgICAgICAgICAgICAgbG9jOiBcIjAgMFwiLFxuICAgICAgICAgICAgICBmaWVsZHM6IGFsbEZpZWxkc1N0eWxlLFxuICAgICAgICAgICAgICB0YWJsZURhdGE6IHNpbmdsZVRhYmxlLFxuICAgICAgICAgICAgICB0YWJsZU5hbWU6IHNpbmdsZVRhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgICAgICAgdGFibGVDYXB0aW9uOiBzaW5nbGVUYWJsZS50YWJsZUNhcHRpb24sXG4gICAgICAgICAgICAgIHRhYmxlRGlzcGxheVRleHQ6IHNpbmdsZVRhYmxlLnRhYmxlTmFtZSArIFwiW1wiICsgc2luZ2xlVGFibGUudGFibGVDYXB0aW9uICsgXCJdXCIsXG4gICAgICAgICAgICAgIGtleTogc2luZ2xlVGFibGUudGFibGVJZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgX3NlbGYudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuc3RhcnRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuXG4gICAgICAgICAgICBfc2VsZi50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5hZGROb2RlRGF0YShtb2RlbE5vZGVEYXRhKTtcblxuICAgICAgICAgICAgX3NlbGYudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuY29tbWl0VHJhbnNhY3Rpb24oXCJmbGFzaFwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFwianNvblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+l55S75biD5Lit5bey57uP5a2Y5Zyo6KGoOlwiICsgdGFibGVEYXRhLnRleHQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVsZXRlU2VsZWN0aW9uOiBmdW5jdGlvbiBkZWxldGVTZWxlY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5jb21tYW5kSGFuZGxlci5jYW5EZWxldGVTZWxlY3Rpb24oKSkge1xuICAgICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLmNvbW1hbmRIYW5kbGVyLmRlbGV0ZVNlbGVjdGlvbigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSxcbiAgICBjb25uZWN0U2VsZWN0aW9uTm9kZTogZnVuY3Rpb24gY29ubmVjdFNlbGVjdGlvbk5vZGUoY29ubmVjdERhdGEpIHtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuc3RhcnRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuICAgICAgdmFyIGxpbmVEYXRhID0ge1xuICAgICAgICBsaW5lSWQ6IFN0cmluZ1V0aWxpdHkuR3VpZCgpLFxuICAgICAgICBmcm9tOiBjb25uZWN0RGF0YS5mcm9tLnRhYmxlSWQsXG4gICAgICAgIHRvOiBjb25uZWN0RGF0YS50by50YWJsZUlkLFxuICAgICAgICBmcm9tVGV4dDogY29ubmVjdERhdGEuZnJvbS50ZXh0LFxuICAgICAgICB0b1RleHQ6IGNvbm5lY3REYXRhLnRvLnRleHRcbiAgICAgIH07XG4gICAgICB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLmFkZExpbmtEYXRhKGxpbmVEYXRhKTtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubW9kZWwuY29tbWl0VHJhbnNhY3Rpb24oXCJmbGFzaFwiKTtcbiAgICB9LFxuICAgIHNhdmVNb2RlbFRvU2VydmVyOiBmdW5jdGlvbiBzYXZlTW9kZWxUb1NlcnZlcigpIHtcbiAgICAgIGlmICh0aGlzLnJlY29yZElkKSB7XG4gICAgICAgIHZhciBzZW5kRGF0YSA9IHtcbiAgICAgICAgICByZWNvcmRJZDogdGhpcy5yZWNvcmRJZCxcbiAgICAgICAgICByZWxhdGlvbkNvbnRlbnQ6IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh0aGlzLmdldERhdGFKc29uKCkpLFxuICAgICAgICAgIHJlbGF0aW9uRGlhZ3JhbUpzb246IHRoaXMuZ2V0RGlhZ3JhbUpzb24oKVxuICAgICAgICB9O1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2Uuc2F2ZURpYWdyYW0sIHNlbmREYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5pdERpYWdyYW06IGZ1bmN0aW9uIGluaXREaWFncmFtKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgaWYgKHdpbmRvdy5nb1NhbXBsZXMpIGdvU2FtcGxlcygpO1xuICAgICAgdmFyICQgPSBnby5HcmFwaE9iamVjdC5tYWtlO1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbSA9ICQoZ28uRGlhZ3JhbSwgXCJ0YWJsZVJlbGF0aW9uRGlhZ3JhbURpdlwiLCB7XG4gICAgICAgIGFsbG93RGVsZXRlOiB0cnVlLFxuICAgICAgICBhbGxvd0NvcHk6IGZhbHNlLFxuICAgICAgICBsYXlvdXQ6ICQoZ28uRm9yY2VEaXJlY3RlZExheW91dCwge1xuICAgICAgICAgIGlzT25nb2luZzogZmFsc2VcbiAgICAgICAgfSksXG4gICAgICAgIFwidW5kb01hbmFnZXIuaXNFbmFibGVkXCI6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdmFyIHRhYmxlUmVsYXRpb25EaWFncmFtID0gdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbTtcbiAgICAgIHZhciBsaWdodGdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDE6IFwiI0U2RTZGQVwiLFxuICAgICAgICAwOiBcIiNGRkZBRjBcIlxuICAgICAgfSk7XG4gICAgICB2YXIgaXRlbVRlbXBsID0gJChnby5QYW5lbCwgXCJIb3Jpem9udGFsXCIsICQoZ28uU2hhcGUsIHtcbiAgICAgICAgZGVzaXJlZFNpemU6IG5ldyBnby5TaXplKDEwLCAxMClcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwiZmlndXJlXCIsIFwiZmlndXJlXCIpLCBuZXcgZ28uQmluZGluZyhcImZpbGxcIiwgXCJjb2xvclwiKSksICQoZ28uVGV4dEJsb2NrLCB7XG4gICAgICAgIHN0cm9rZTogXCIjMzMzMzMzXCIsXG4gICAgICAgIGZvbnQ6IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIlxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJ0ZXh0XCIsIFwiZGlzcGxheVRleHRcIikpKTtcbiAgICAgIHRhYmxlUmVsYXRpb25EaWFncmFtLm5vZGVUZW1wbGF0ZSA9ICQoZ28uTm9kZSwgXCJBdXRvXCIsIHtcbiAgICAgICAgc2VsZWN0aW9uQWRvcm5lZDogdHJ1ZSxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICBsYXlvdXRDb25kaXRpb25zOiBnby5QYXJ0LkxheW91dFN0YW5kYXJkICYgfmdvLlBhcnQuTGF5b3V0Tm9kZVNpemVkLFxuICAgICAgICBmcm9tU3BvdDogZ28uU3BvdC5BbGxTaWRlcyxcbiAgICAgICAgdG9TcG90OiBnby5TcG90LkFsbFNpZGVzLFxuICAgICAgICBpc1NoYWRvd2VkOiB0cnVlLFxuICAgICAgICBzaGFkb3dDb2xvcjogXCIjQzVDMUFBXCIsXG4gICAgICAgIGRvdWJsZUNsaWNrOiBmdW5jdGlvbiBkb3VibGVDbGljayhlLCBub2RlKSB7XG4gICAgICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyhfc2VsZi5hY0ludGVyZmFjZS50YWJsZVZpZXcsIHtcbiAgICAgICAgICAgIFwib3BcIjogXCJ2aWV3XCIsXG4gICAgICAgICAgICBcInJlY29yZElkXCI6IG5vZGUuZGF0YS50YWJsZUlkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgICAgICB0aXRsZTogXCLooajorr7orqFcIlxuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcImxvY2F0aW9uXCIsIFwibG9jXCIsIGdvLlBvaW50LnBhcnNlKSwgbmV3IGdvLkJpbmRpbmcoXCJkZXNpcmVkU2l6ZVwiLCBcInZpc2libGVcIiwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBnby5TaXplKE5hTiwgTmFOKTtcbiAgICAgIH0pLm9mT2JqZWN0KFwiTElTVFwiKSwgJChnby5TaGFwZSwgXCJSb3VuZGVkUmVjdGFuZ2xlXCIsIHtcbiAgICAgICAgZmlsbDogbGlnaHRncmFkLFxuICAgICAgICBzdHJva2U6IFwiIzc1Njg3NVwiLFxuICAgICAgICBzdHJva2VXaWR0aDogMVxuICAgICAgfSksICQoZ28uUGFuZWwsIFwiVGFibGVcIiwge1xuICAgICAgICBtYXJnaW46IDgsXG4gICAgICAgIHN0cmV0Y2g6IGdvLkdyYXBoT2JqZWN0LkZpbGxcbiAgICAgIH0sICQoZ28uUm93Q29sdW1uRGVmaW5pdGlvbiwge1xuICAgICAgICByb3c6IDAsXG4gICAgICAgIHNpemluZzogZ28uUm93Q29sdW1uRGVmaW5pdGlvbi5Ob25lXG4gICAgICB9KSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgcm93OiAwLFxuICAgICAgICBhbGlnbm1lbnQ6IGdvLlNwb3QuQ2VudGVyLFxuICAgICAgICBtYXJnaW46IG5ldyBnby5NYXJnaW4oMCwgMTQsIDAsIDIpLFxuICAgICAgICBmb250OiBcImJvbGQgMTZweCBzYW5zLXNlcmlmXCJcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcInRhYmxlRGlzcGxheVRleHRcIikpLCAkKFwiUGFuZWxFeHBhbmRlckJ1dHRvblwiLCBcIkxJU1RcIiwge1xuICAgICAgICByb3c6IDAsXG4gICAgICAgIGFsaWdubWVudDogZ28uU3BvdC5Ub3BSaWdodFxuICAgICAgfSksICQoZ28uUGFuZWwsIFwiVmVydGljYWxcIiwge1xuICAgICAgICBuYW1lOiBcIkxJU1RcIixcbiAgICAgICAgcm93OiAxLFxuICAgICAgICBwYWRkaW5nOiAzLFxuICAgICAgICBhbGlnbm1lbnQ6IGdvLlNwb3QuVG9wTGVmdCxcbiAgICAgICAgZGVmYXVsdEFsaWdubWVudDogZ28uU3BvdC5MZWZ0LFxuICAgICAgICBzdHJldGNoOiBnby5HcmFwaE9iamVjdC5Ib3Jpem9udGFsLFxuICAgICAgICBpdGVtVGVtcGxhdGU6IGl0ZW1UZW1wbFxuICAgICAgfSwgbmV3IGdvLkJpbmRpbmcoXCJpdGVtQXJyYXlcIiwgXCJmaWVsZHNcIikpKSk7XG4gICAgICB0YWJsZVJlbGF0aW9uRGlhZ3JhbS5saW5rVGVtcGxhdGUgPSAkKGdvLkxpbmssIHtcbiAgICAgICAgc2VsZWN0aW9uQWRvcm5lZDogdHJ1ZSxcbiAgICAgICAgbGF5ZXJOYW1lOiBcIkZvcmVncm91bmRcIixcbiAgICAgICAgcmVzaGFwYWJsZTogdHJ1ZSxcbiAgICAgICAgcm91dGluZzogZ28uTGluay5Bdm9pZHNOb2RlcyxcbiAgICAgICAgY29ybmVyOiA1LFxuICAgICAgICBjdXJ2ZTogZ28uTGluay5KdW1wT3ZlclxuICAgICAgfSwgJChnby5TaGFwZSwge1xuICAgICAgICBzdHJva2U6IFwiIzMwM0I0NVwiLFxuICAgICAgICBzdHJva2VXaWR0aDogMS41XG4gICAgICB9KSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICBmb250OiBcImJvbGQgMTRweCBzYW5zLXNlcmlmXCIsXG4gICAgICAgIHN0cm9rZTogXCIjMTk2N0IzXCIsXG4gICAgICAgIHNlZ21lbnRJbmRleDogMCxcbiAgICAgICAgc2VnbWVudE9mZnNldDogbmV3IGdvLlBvaW50KE5hTiwgTmFOKSxcbiAgICAgICAgc2VnbWVudE9yaWVudGF0aW9uOiBnby5MaW5rLk9yaWVudFVwcmlnaHRcbiAgICAgIH0sIG5ldyBnby5CaW5kaW5nKFwidGV4dFwiLCBcImZyb21UZXh0XCIpKSwgJChnby5UZXh0QmxvY2ssIHtcbiAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICBmb250OiBcImJvbGQgMTRweCBzYW5zLXNlcmlmXCIsXG4gICAgICAgIHN0cm9rZTogXCIjMTk2N0IzXCIsXG4gICAgICAgIHNlZ21lbnRJbmRleDogLTEsXG4gICAgICAgIHNlZ21lbnRPZmZzZXQ6IG5ldyBnby5Qb2ludChOYU4sIE5hTiksXG4gICAgICAgIHNlZ21lbnRPcmllbnRhdGlvbjogZ28uTGluay5PcmllbnRVcHJpZ2h0XG4gICAgICB9LCBuZXcgZ28uQmluZGluZyhcInRleHRcIiwgXCJ0b1RleHRcIikpKTtcbiAgICB9LFxuICAgIGxvYWRSZWxhdGlvbkRldGFpbERhdGE6IGZ1bmN0aW9uIGxvYWRSZWxhdGlvbkRldGFpbERhdGEoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0U2luZ2xlRGlhZ3JhbURhdGEsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHRoaXMucmVjb3JkSWQsXG4gICAgICAgIG9wOiBcIkVkaXRcIlxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LmRhdGEucmVsYXRpb25Db250ZW50KSB7XG4gICAgICAgICAgICB2YXIgZGF0YUpzb24gPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24ocmVzdWx0LmRhdGEucmVsYXRpb25Db250ZW50KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGFKc29uKTtcblxuICAgICAgICAgICAgX3NlbGYuc2V0RGF0YUpzb24oZGF0YUpzb24pO1xuXG4gICAgICAgICAgICBfc2VsZi5jb252ZXJ0VG9GdWxsSnNvbihkYXRhSnNvbiwgX3NlbGYuZHJhd09iakluRGlhZ3JhbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIGRyYXdPYmpJbkRpYWdyYW06IGZ1bmN0aW9uIGRyYXdPYmpJbkRpYWdyYW0oZnVsbEpzb24pIHtcbiAgICAgIHZhciAkID0gZ28uR3JhcGhPYmplY3QubWFrZTtcbiAgICAgIHZhciBibHVlZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTUwLCAxNTAsIDI1MClcIixcbiAgICAgICAgMC41OiBcInJnYig4NiwgODYsIDE4NilcIixcbiAgICAgICAgMTogXCJyZ2IoODYsIDg2LCAxODYpXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIGdyZWVuZ3JhZCA9ICQoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMTU4LCAyMDksIDE1OSlcIixcbiAgICAgICAgMTogXCJyZ2IoNjcsIDEwMSwgNTYpXCJcbiAgICAgIH0pO1xuICAgICAgdmFyIHJlZGdyYWQgPSAkKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDIwNiwgMTA2LCAxMDApXCIsXG4gICAgICAgIDE6IFwicmdiKDE4MCwgNTYsIDUwKVwiXG4gICAgICB9KTtcbiAgICAgIHZhciB5ZWxsb3dncmFkID0gJChnby5CcnVzaCwgXCJMaW5lYXJcIiwge1xuICAgICAgICAwOiBcInJnYigyNTQsIDIyMSwgNTApXCIsXG4gICAgICAgIDE6IFwicmdiKDI1NCwgMTgyLCA1MClcIlxuICAgICAgfSk7XG4gICAgICB2YXIgbGlua0RhdGFBcnJheSA9IGZ1bGxKc29uLmxpbmVMaXN0O1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbCA9ICQoZ28uR3JhcGhMaW5rc01vZGVsLCB7XG4gICAgICAgIGNvcGllc0FycmF5czogdHJ1ZSxcbiAgICAgICAgY29waWVzQXJyYXlPYmplY3RzOiB0cnVlLFxuICAgICAgICBub2RlRGF0YUFycmF5OiBmdWxsSnNvbi50YWJsZUxpc3RcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9zZWxmLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLnN0YXJ0VHJhbnNhY3Rpb24oXCJmbGFzaFwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bGxKc29uLmxpbmVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGxpbmVEYXRhID0gZnVsbEpzb24ubGluZUxpc3RbaV07XG5cbiAgICAgICAgICBfc2VsZi50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5hZGRMaW5rRGF0YShsaW5lRGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBfc2VsZi50YWJsZVJlbGF0aW9uRGlhZ3JhbS5tb2RlbC5jb21taXRUcmFuc2FjdGlvbihcImZsYXNoXCIpO1xuICAgICAgfSwgNTAwKTtcbiAgICB9LFxuICAgIGNvbnZlcnRUb0Z1bGxKc29uOiBmdW5jdGlvbiBjb252ZXJ0VG9GdWxsSnNvbihzaW1wbGVKc29uLCBmdW5jKSB7XG4gICAgICB2YXIgZnVsbEpzb24gPSBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZShzaW1wbGVKc29uKTtcbiAgICAgIHZhciB0YWJsZUlkcyA9IG5ldyBBcnJheSgpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpbXBsZUpzb24udGFibGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRhYmxlSWRzLnB1c2goc2ltcGxlSnNvbi50YWJsZUxpc3RbaV0udGFibGVJZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzLCB7XG4gICAgICAgIFwidGFibGVJZHNcIjogdGFibGVJZHNcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgdmFyIGFsbEZpZWxkcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIHZhciBhbGxUYWJsZXMgPSByZXN1bHQuZXhLVkRhdGEuVGFibGVzO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdWxsSnNvbi50YWJsZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzaW5nbGVUYWJsZURhdGEgPSBfc2VsZi5nZXRTaW5nbGVUYWJsZURhdGEoYWxsVGFibGVzLCBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVJZCk7XG5cbiAgICAgICAgICAgIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS50YWJsZURhdGEgPSBzaW5nbGVUYWJsZURhdGE7XG4gICAgICAgICAgICBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVOYW1lID0gc2luZ2xlVGFibGVEYXRhLnRhYmxlTmFtZTtcbiAgICAgICAgICAgIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS50YWJsZUNhcHRpb24gPSBzaW5nbGVUYWJsZURhdGEudGFibGVDYXB0aW9uO1xuICAgICAgICAgICAgZnVsbEpzb24udGFibGVMaXN0W2ldLnRhYmxlRGlzcGxheVRleHQgPSBzaW5nbGVUYWJsZURhdGEuZGlzcGxheVRleHQ7XG5cbiAgICAgICAgICAgIHZhciBzaW5nbGVUYWJsZUZpZWxkc0RhdGEgPSBfc2VsZi5nZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGEoYWxsRmllbGRzLCBmdWxsSnNvbi50YWJsZUxpc3RbaV0udGFibGVJZCk7XG5cbiAgICAgICAgICAgIGZ1bGxKc29uLnRhYmxlTGlzdFtpXS5maWVsZHMgPSBzaW5nbGVUYWJsZUZpZWxkc0RhdGE7XG4gICAgICAgICAgICBmdWxsSnNvbi50YWJsZUxpc3RbaV0ua2V5ID0gZnVsbEpzb24udGFibGVMaXN0W2ldLnRhYmxlSWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3NlbGYuZHJhd09iakluRGlhZ3JhbShmdWxsSnNvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgZ2V0U2luZ2xlVGFibGVEYXRhOiBmdW5jdGlvbiBnZXRTaW5nbGVUYWJsZURhdGEoYWxsVGFibGVzLCB0YWJsZUlkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbFRhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYWxsVGFibGVzW2ldLnRhYmxlSWQgPT0gdGFibGVJZCkge1xuICAgICAgICAgIGFsbFRhYmxlc1tpXS5kaXNwbGF5VGV4dCA9IGFsbFRhYmxlc1tpXS50YWJsZU5hbWUgKyBcIltcIiArIGFsbFRhYmxlc1tpXS50YWJsZUNhcHRpb24gKyBcIl1cIjtcbiAgICAgICAgICByZXR1cm4gYWxsVGFibGVzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhOiBmdW5jdGlvbiBnZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGEoYWxsRmllbGRzLCB0YWJsZUlkKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbGxGaWVsZHNbaV0uZmllbGRUYWJsZUlkID09IHRhYmxlSWQpIHtcbiAgICAgICAgICBhbGxGaWVsZHNbaV0uZGlzcGxheVRleHQgPSBhbGxGaWVsZHNbaV0uZmllbGROYW1lICsgXCJbXCIgKyBhbGxGaWVsZHNbaV0uZmllbGRDYXB0aW9uICsgXCJdXCI7XG4gICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5yZW5kZXJlckZpZWxkU3R5bGUoYWxsRmllbGRzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIHJlbmRlcmVyRmllbGRTdHlsZTogZnVuY3Rpb24gcmVuZGVyZXJGaWVsZFN0eWxlKGZpZWxkKSB7XG4gICAgICBpZiAoZmllbGQuZmllbGRJc1BrID09IFwi5pivXCIpIHtcbiAgICAgICAgZmllbGQuY29sb3IgPSB0aGlzLmdldEtleUZpZWxkQnJ1c2goKTtcbiAgICAgICAgZmllbGQuZmlndXJlID0gXCJEZWNpc2lvblwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmllbGQuY29sb3IgPSB0aGlzLmdldE5vckZpZWxkQnJ1c2goKTtcbiAgICAgICAgZmllbGQuZmlndXJlID0gXCJDdWJlMVwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmllbGQ7XG4gICAgfSxcbiAgICBnZXRLZXlGaWVsZEJydXNoOiBmdW5jdGlvbiBnZXRLZXlGaWVsZEJydXNoKCkge1xuICAgICAgcmV0dXJuIGdvLkdyYXBoT2JqZWN0Lm1ha2UoZ28uQnJ1c2gsIFwiTGluZWFyXCIsIHtcbiAgICAgICAgMDogXCJyZ2IoMjU0LCAyMjEsIDUwKVwiLFxuICAgICAgICAxOiBcInJnYigyNTQsIDE4MiwgNTApXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0Tm9yRmllbGRCcnVzaDogZnVuY3Rpb24gZ2V0Tm9yRmllbGRCcnVzaCgpIHtcbiAgICAgIHJldHVybiBnby5HcmFwaE9iamVjdC5tYWtlKGdvLkJydXNoLCBcIkxpbmVhclwiLCB7XG4gICAgICAgIDA6IFwicmdiKDE1MCwgMTUwLCAyNTApXCIsXG4gICAgICAgIDAuNTogXCJyZ2IoODYsIDg2LCAxODYpXCIsXG4gICAgICAgIDE6IFwicmdiKDg2LCA4NiwgMTg2KVwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldERhdGFKc29uOiBmdW5jdGlvbiBnZXREYXRhSnNvbigpIHtcbiAgICAgIHZhciBkYXRhSnNvbiA9IHtcbiAgICAgICAgdGFibGVMaXN0OiBbXSxcbiAgICAgICAgbGluZUxpc3Q6IFtdXG4gICAgICB9O1xuICAgICAgdGhpcy50YWJsZVJlbGF0aW9uRGlhZ3JhbS5ub2Rlcy5lYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIGlmIChwYXJ0IGluc3RhbmNlb2YgZ28uTm9kZSkge1xuICAgICAgICAgIGRhdGFKc29uLnRhYmxlTGlzdC5wdXNoKHtcbiAgICAgICAgICAgIHRhYmxlSWQ6IHBhcnQuZGF0YS50YWJsZUlkLFxuICAgICAgICAgICAgbG9jOiBwYXJ0LmxvY2F0aW9uLnggKyBcIiBcIiArIHBhcnQubG9jYXRpb24ueVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcnQgaW5zdGFuY2VvZiBnby5MaW5rKSB7XG4gICAgICAgICAgYWxlcnQoXCJsaW5lXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubGlua3MuZWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICBpZiAocGFydCBpbnN0YW5jZW9mIGdvLkxpbmspIHtcbiAgICAgICAgICBkYXRhSnNvbi5saW5lTGlzdC5wdXNoKHtcbiAgICAgICAgICAgIGxpbmVJZDogcGFydC5kYXRhLmxpbmVJZCxcbiAgICAgICAgICAgIGZyb206IHBhcnQuZGF0YS5mcm9tLFxuICAgICAgICAgICAgdG86IHBhcnQuZGF0YS50byxcbiAgICAgICAgICAgIGZyb21UZXh0OiBwYXJ0LmRhdGEuZnJvbVRleHQsXG4gICAgICAgICAgICB0b1RleHQ6IHBhcnQuZGF0YS50b1RleHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGF0YUpzb247XG4gICAgfSxcbiAgICBzZXREYXRhSnNvbjogZnVuY3Rpb24gc2V0RGF0YUpzb24oanNvbikge1xuICAgICAgdGhpcy5mb3JtYXRKc29uID0ganNvbjtcbiAgICB9LFxuICAgIGdldERpYWdyYW1Kc29uOiBmdW5jdGlvbiBnZXREaWFncmFtSnNvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLm1vZGVsLnRvSnNvbigpO1xuICAgIH0sXG4gICAgYWxlcnREYXRhSnNvbjogZnVuY3Rpb24gYWxlcnREYXRhSnNvbigpIHtcbiAgICAgIHZhciBkYXRhSnNvbiA9IHRoaXMuZ2V0RGF0YUpzb24oKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRKc29uQ29kZShkYXRhSnNvbik7XG4gICAgfSxcbiAgICBhbGVydERpYWdyYW1Kc29uOiBmdW5jdGlvbiBhbGVydERpYWdyYW1Kc29uKCkge1xuICAgICAgdmFyIGRpYWdyYW1Kc29uID0gdGhpcy5nZXREaWFncmFtSnNvbigpO1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEpzb25Db2RlKGRpYWdyYW1Kc29uKTtcbiAgICB9LFxuICAgIHRhYmxlSXNFeGlzdEluRGlhZ3JhbTogZnVuY3Rpb24gdGFibGVJc0V4aXN0SW5EaWFncmFtKHRhYmxlSWQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgIHRoaXMudGFibGVSZWxhdGlvbkRpYWdyYW0ubm9kZXMuZWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICBpZiAocGFydCBpbnN0YW5jZW9mIGdvLk5vZGUpIHtcbiAgICAgICAgICBpZiAocGFydC5kYXRhLnRhYmxlSWQgPT0gdGFibGVJZCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIGRvd25Mb2FkTW9kZWxQTkc6IGZ1bmN0aW9uIGRvd25Mb2FkTW9kZWxQTkcoKSB7XG4gICAgICBmdW5jdGlvbiBteUNhbGxiYWNrKGJsb2IpIHtcbiAgICAgICAgdmFyIHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICB2YXIgZmlsZW5hbWUgPSBcIm15QmxvYkZpbGUxLnBuZ1wiO1xuICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBhLnN0eWxlID0gXCJkaXNwbGF5OiBub25lXCI7XG4gICAgICAgIGEuaHJlZiA9IHVybDtcbiAgICAgICAgYS5kb3dubG9hZCA9IGZpbGVuYW1lO1xuXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlQmxvYihibG9iLCBmaWxlbmFtZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhLmNsaWNrKCk7XG4gICAgICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIGJsb2IgPSB0aGlzLnRhYmxlUmVsYXRpb25EaWFncmFtLm1ha2VJbWFnZURhdGEoe1xuICAgICAgICBiYWNrZ3JvdW5kOiBcIndoaXRlXCIsXG4gICAgICAgIHJldHVyblR5cGU6IFwiYmxvYlwiLFxuICAgICAgICBzY2FsZTogMSxcbiAgICAgICAgY2FsbGJhY2s6IG15Q2FsbGJhY2tcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcInJlbGF0aW9uQ29udGVudE91dGVyV3JhcFxcXCIgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLWNvbnRlbnQtb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1yZWxhdGlvbi1jb250ZW50LWhlYWRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0YWJsZS1yZWxhdGlvbi1kZXNjLW91dGVyLXdyYXBcXFwiIHYtaWY9XFxcImRpc3BsYXlEZXNjXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tZGVzY1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU1OTA3XFx1NkNFOFxcdUZGMUF7e3JlbGF0aW9uLnJlbGF0aW9uRGVzY319XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLW9wLWJ1dHRvbnMtb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRhYmxlLXJlbGF0aW9uLW9wLWJ1dHRvbnMtaW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwIHNoYXBlPVxcXCJjaXJjbGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcInNob3dTZWxlY3RUYWJsZURpYWxvZ1xcXCIgdHlwZT1cXFwic3VjY2Vzc1xcXCIgaWNvbj1cXFwibWQtYWRkXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcInNob3dTZWxlY3RGaWVsZENvbm5lY3REaWFsb2dcXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcImxvZ28tc3RlYW1cXFwiPlxcdThGREVcXHU2M0E1PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gZGlzYWJsZWQgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtcmV0dXJuLWxlZnRcXFwiPlxcdTVGMTVcXHU1MTY1PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gZGlzYWJsZWQgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtcXItc2Nhbm5lclxcXCI+XFx1NTE2OFxcdTVDNEY8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBkaXNhYmxlZCB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1naXQtY29tcGFyZVxcXCI+XFx1NTM4NlxcdTUzRjI8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImFsZXJ0RGF0YUpzb25cXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcIm1kLWNvZGVcXFwiPlxcdTY1NzBcXHU2MzZFSnNvbjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiYWxlcnREaWFncmFtSnNvblxcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwibWQtY29kZS13b3JraW5nXFxcIj5cXHU1NkZFXFx1NUY2Mkpzb248L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImRvd25Mb2FkTW9kZWxQTkdcXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcIm1kLWNsb3VkLWRvd25sb2FkXFxcIj5cXHU0RTBCXFx1OEY3RDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwic2F2ZU1vZGVsVG9TZXJ2ZXJcXFwiIHR5cGU9XFxcInByaW1hcnlcXFwiIGljb249XFxcImxvZ28taW5zdGFncmFtXFxcIj5cXHU0RkREXFx1NUI1ODwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiZGVsZXRlU2VsZWN0aW9uXFxcIiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCI+PC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGFibGUtcmVsYXRpb24tY29udGVudC13cmFwXFxcIiBpZD1cXFwidGFibGVSZWxhdGlvbkRpYWdyYW1EaXZcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdC1zaW5nbGUtdGFibGUtZGlhbG9nIHJlZj1cXFwic2VsZWN0U2luZ2xlVGFibGVEaWFsb2dcXFwiIEBvbi1zZWxlY3RlZC10YWJsZT1cXFwiYWRkVGFibGVUb0RpYWdyYW1cXFwiPjwvc2VsZWN0LXNpbmdsZS10YWJsZS1kaWFsb2c+XFxuICAgICAgICAgICAgICAgICAgICA8dGFibGUtcmVsYXRpb24tY29ubmVjdC10d28tdGFibGUtZGlhbG9nIHJlZj1cXFwidGFibGVSZWxhdGlvbkNvbm5lY3RUd29UYWJsZURpYWxvZ1xcXCIgQG9uLWNvbXBsZXRlZC1jb25uZWN0PVxcXCJjb25uZWN0U2VsZWN0aW9uTm9kZVxcXCI+PC90YWJsZS1yZWxhdGlvbi1jb25uZWN0LXR3by10YWJsZS1kaWFsb2c+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC1kZWZhdWx0LXZhbHVlLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRTZWxlY3REYXRhOiBcIi9QbGF0Rm9ybVJlc3QvU2VsZWN0Vmlldy9TZWxlY3RFbnZWYXJpYWJsZS9HZXRTZWxlY3REYXRhXCJcbiAgICAgIH0sXG4gICAgICBzZWxlY3RUeXBlOiBcIkNvbnN0XCIsXG4gICAgICBzZWxlY3RWYWx1ZTogXCJcIixcbiAgICAgIHNlbGVjdFRleHQ6IFwiXCIsXG4gICAgICB0cmVlOiB7XG4gICAgICAgIGRhdGV0aW1lVHJlZU9iajogbnVsbCxcbiAgICAgICAgZGF0ZXRpbWVUcmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7fSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9LFxuICAgICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYXRldGltZVRyZWVEYXRhOiBudWxsLFxuICAgICAgICBlbnZWYXJUcmVlT2JqOiBudWxsLFxuICAgICAgICBlbnZWYXJUcmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7fSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9LFxuICAgICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnZWYXJUcmVlRGF0YTogbnVsbCxcbiAgICAgICAgbnVtYmVyQ29kZVRyZWVPYmo6IG51bGwsXG4gICAgICAgIG51bWJlckNvZGVUcmVlU2V0dGluZzoge30sXG4gICAgICAgIG51bWJlckNvZGVUcmVlRGF0YToge31cbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMubG9hZERhdGEoKTtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdChvbGREYXRhKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nV3JhcDtcbiAgICAgIHZhciBoZWlnaHQgPSA0NTA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgaGVpZ2h0OiA2ODAsXG4gICAgICAgIHdpZHRoOiA5ODAsXG4gICAgICAgIHRpdGxlOiBcIuiuvue9rum7mOiupOWAvFwiXG4gICAgICB9KTtcbiAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIDEwMTAxKTtcblxuICAgICAgaWYgKG9sZERhdGEgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnNlbGVjdFR5cGUgPSBcIkNvbnN0XCI7XG4gICAgICAgIHRoaXMuc2VsZWN0VmFsdWUgPSBcIlwiO1xuICAgICAgICB0aGlzLnNlbGVjdFRleHQgPSBcIlwiO1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9hZERhdGE6IGZ1bmN0aW9uIGxvYWREYXRhKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFNlbGVjdERhdGEsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIF9zZWxmLnRyZWUuZGF0ZXRpbWVUcmVlRGF0YSA9IHJlc3VsdC5kYXRhLmRhdGV0aW1lVHJlZURhdGE7XG4gICAgICAgIF9zZWxmLnRyZWUuZW52VmFyVHJlZURhdGEgPSByZXN1bHQuZGF0YS5lbnZWYXJUcmVlRGF0YTtcbiAgICAgICAgX3NlbGYudHJlZS5kYXRldGltZVRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNkYXRldGltZVpUcmVlVUxcIiksIF9zZWxmLnRyZWUuZGF0ZXRpbWVUcmVlU2V0dGluZywgX3NlbGYudHJlZS5kYXRldGltZVRyZWVEYXRhKTtcblxuICAgICAgICBfc2VsZi50cmVlLmRhdGV0aW1lVHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG5cbiAgICAgICAgX3NlbGYudHJlZS5lbnZWYXJUcmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjZW52VmFyWlRyZWVVTFwiKSwgX3NlbGYudHJlZS5lbnZWYXJUcmVlU2V0dGluZywgX3NlbGYudHJlZS5lbnZWYXJUcmVlRGF0YSk7XG5cbiAgICAgICAgX3NlbGYudHJlZS5lbnZWYXJUcmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIGdldFNlbGVjdEluc3RhbmNlTmFtZTogZnVuY3Rpb24gZ2V0U2VsZWN0SW5zdGFuY2VOYW1lKCkge1xuICAgICAgcmV0dXJuIEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZShcImluc3RhbmNlTmFtZVwiKTtcbiAgICB9LFxuICAgIHNlbGVjdENvbXBsZXRlOiBmdW5jdGlvbiBzZWxlY3RDb21wbGV0ZSgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0VHlwZSA9PSBcIkNvbnN0XCIpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0VmFsdWUgPT0gXCJcIikge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+iuvue9ruW4uOmHj+m7mOiupOWAvO+8gVwiLCBudWxsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQuVHlwZSA9IFwiQ29uc3RcIjtcbiAgICAgICAgcmVzdWx0LlZhbHVlID0gdGhpcy5zZWxlY3RWYWx1ZTtcbiAgICAgICAgcmVzdWx0LlRleHQgPSB0aGlzLnNlbGVjdFZhbHVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdFR5cGUgPT0gXCJEYXRlVGltZVwiKSB7XG4gICAgICAgIHZhciBzZWxlY3ROb2RlcyA9IHRoaXMudHJlZS5kYXRldGltZVRyZWVPYmouZ2V0U2VsZWN0ZWROb2RlcygpO1xuXG4gICAgICAgIGlmIChzZWxlY3ROb2Rlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqeS4gOenjeaXtumXtOexu+Wei++8gVwiLCBudWxsKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LlR5cGUgPSBcIkRhdGVUaW1lXCI7XG4gICAgICAgICAgcmVzdWx0LlZhbHVlID0gc2VsZWN0Tm9kZXNbMF0udmFsdWU7XG4gICAgICAgICAgcmVzdWx0LlRleHQgPSBzZWxlY3ROb2Rlc1swXS50ZXh0O1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0VHlwZSA9PSBcIkFwaVZhclwiKSB7XG4gICAgICAgIHZhciBzZWxlY3ROb2RlcyA9IHRoaXMudHJlZS5lbnZWYXJUcmVlT2JqLmdldFNlbGVjdGVkTm9kZXMoKTtcblxuICAgICAgICBpZiAoc2VsZWN0Tm9kZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nkuIDnp41BUEnnsbvlnovvvIFcIiwgbnVsbCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChzZWxlY3ROb2Rlc1swXS5ncm91cCA9PSB0cnVlKSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLkuI3og73pgInmi6nliIbnu4TvvIFcIiwgbnVsbCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5UeXBlID0gXCJBcGlWYXJcIjtcbiAgICAgICAgICAgIHJlc3VsdC5WYWx1ZSA9IHNlbGVjdE5vZGVzWzBdLnZhbHVlO1xuICAgICAgICAgICAgcmVzdWx0LlRleHQgPSBzZWxlY3ROb2Rlc1swXS50ZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdFR5cGUgPT0gXCJOdW1iZXJDb2RlXCIpIHtcbiAgICAgICAgcmVzdWx0LlR5cGUgPSBcIk51bWJlckNvZGVcIjtcbiAgICAgIH1cblxuICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtZGVmYXVsdC12YWx1ZScsIHJlc3VsdCk7XG4gICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgfSxcbiAgICBjbGVhckNvbXBsZXRlOiBmdW5jdGlvbiBjbGVhckNvbXBsZXRlKCkge1xuICAgICAgdGhpcy4kZW1pdCgnb24tc2VsZWN0ZWQtZGVmYXVsdC12YWx1ZScsIG51bGwpO1xuICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgIH0sXG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3REZWZhdWx0VmFsdWVEaWFsb2dXcmFwKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgIHJlZj1cXFwic2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDx0YWJzIDp2YWx1ZT1cXFwic2VsZWN0VHlwZVxcXCIgdi1tb2RlbD1cXFwic2VsZWN0VHlwZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIGxhYmVsPVxcXCJcXHU5NzU5XFx1NjAwMVxcdTUwM0NcXFwiIG5hbWU9XFxcIkNvbnN0XFxcIiA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gOmxhYmVsLXdpZHRoPVxcXCI4MFxcXCIgc3R5bGU9XFxcIndpZHRoOiA4MCU7bWFyZ2luOiA1MHB4IGF1dG8gYXV0bztcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1OTc1OVxcdTYwMDFcXHU1MDNDXFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwic2VsZWN0VmFsdWVcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWItcGFuZSBsYWJlbD1cXFwiXFx1NjVFNVxcdTY3MUZcXHU2NUY2XFx1OTVGNFxcXCIgbmFtZT1cXFwiRGF0ZVRpbWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XFxcImRhdGV0aW1lWlRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFiLXBhbmU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIGxhYmVsPVxcXCJBUElcXHU1M0Q4XFx1OTFDRlxcXCIgbmFtZT1cXFwiQXBpVmFyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVxcXCJlbnZWYXJaVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgbGFiZWw9XFxcIlxcdTVFOEZcXHU1M0Y3XFx1N0YxNlxcdTc4MDFcXFwiIG5hbWU9XFxcIk51bWJlckNvZGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XFxcIm51bWJlckNvZGVaVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgbGFiZWw9XFxcIlxcdTRFM0JcXHU5NTJFXFx1NzUxRlxcdTYyMTBcXFwiIG5hbWU9XFxcIklkQ29kZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XFxcIm51bWJlckNvZGVaVHJlZVVMMVxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFiLXBhbmU+XFxuICAgICAgICAgICAgICAgICAgICA8L3RhYnM+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwic2VsZWN0Q29tcGxldGUoKVxcXCI+IFxcdTc4NkUgXFx1OEJBNCA8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiY2xlYXJDb21wbGV0ZSgpXFxcIj4gXFx1NkUwNSBcXHU3QTdBIDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJoYW5kbGVDbG9zZSgpXFxcIj5cXHU1MTczIFxcdTk1RUQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzZWxlY3QtZGVwYXJ0bWVudC11c2VyLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldERlcGFydG1lbnRUcmVlRGF0YTogXCIvUGxhdEZvcm1SZXN0L1NTTy9EZXBhcnRtZW50L0dldERlcGFydG1lbnRzQnlPcmdhbklkXCIsXG4gICAgICAgIGRlcGFydG1lbnRFZGl0VmlldzogXCIvSFRNTC9TU08vRGVwYXJ0bWVudC9EZXBhcnRtZW50RWRpdC5odG1sXCIsXG4gICAgICAgIGRlbGV0ZURlcGFydG1lbnQ6IFwiL1BsYXRGb3JtUmVzdC9TU08vRGVwYXJ0bWVudC9EZWxldGVcIixcbiAgICAgICAgbW92ZURlcGFydG1lbnQ6IFwiL1BsYXRGb3JtUmVzdC9TU08vRGVwYXJ0bWVudC9Nb3ZlXCIsXG4gICAgICAgIGxpc3RFZGl0VmlldzogXCIvSFRNTC9TU08vRGVwYXJ0bWVudC9EZXBhcnRtZW50VXNlckVkaXQuaHRtbFwiLFxuICAgICAgICByZWxvYWRMaXN0RGF0YTogXCIvUGxhdEZvcm1SZXN0L1NTTy9EZXBhcnRtZW50VXNlci9HZXRMaXN0RGF0YVwiLFxuICAgICAgICBkZWxldGVMaXN0UmVjb3JkOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0RlcGFydG1lbnRVc2VyL0RlbGV0ZVwiLFxuICAgICAgICBsaXN0U3RhdHVzQ2hhbmdlOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0RlcGFydG1lbnRVc2VyL1N0YXR1c0NoYW5nZVwiLFxuICAgICAgICBsaXN0TW92ZTogXCIvUGxhdEZvcm1SZXN0L1NTTy9EZXBhcnRtZW50VXNlci9Nb3ZlXCJcbiAgICAgIH0sXG4gICAgICB0cmVlSWRGaWVsZE5hbWU6IFwiZGVwdElkXCIsXG4gICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgdHJlZVNlbGVjdGVkTm9kZTogbnVsbCxcbiAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgIGFzeW5jOiB7XG4gICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgIHVybDogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICBuYW1lOiBcImRlcHROYW1lXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGlkS2V5OiBcImRlcHRJZFwiLFxuICAgICAgICAgICAgcElkS2V5OiBcImRlcHRQYXJlbnRJZFwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgIHZhciBfc2VsZiA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgX3NlbGYudHJlZU5vZGVTZWxlY3RlZChldmVudCwgdHJlZUlkLCB0cmVlTm9kZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkFzeW5jU3VjY2VzczogZnVuY3Rpb24gb25Bc3luY1N1Y2Nlc3MoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUsIG1zZykge1xuICAgICAgICAgICAgYXBwTGlzdC50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpZEZpZWxkTmFtZTogXCJEVV9JRFwiLFxuICAgICAgc2VhcmNoQ29uZGl0aW9uOiB7XG4gICAgICAgIHVzZXJOYW1lOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuTGlrZVN0cmluZ1R5cGVcbiAgICAgICAgfSxcbiAgICAgICAgYWNjb3VudDoge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLkxpa2VTdHJpbmdUeXBlXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJQaG9uZU51bWJlcjoge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLkxpa2VTdHJpbmdUeXBlXG4gICAgICAgIH0sXG4gICAgICAgIGRlcGFydG1lbnRJZDoge1xuICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgIHR5cGU6IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLlN0cmluZ1R5cGVcbiAgICAgICAgfSxcbiAgICAgICAgc2VhcmNoSW5BTEw6IHtcbiAgICAgICAgICB2YWx1ZTogXCLlkKZcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0eXBlOiAnc2VsZWN0aW9uJyxcbiAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnlKjmiLflkI0nLFxuICAgICAgICBrZXk6ICdVU0VSX05BTUUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aJi+acuuWPt+eggScsXG4gICAgICAgIGtleTogJ1VTRVJfUEhPTkVfTlVNQkVSJyxcbiAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnu4Tnu4fmnLrmnoQnLFxuICAgICAgICBrZXk6ICdPUkdBTl9OQU1FJyxcbiAgICAgICAgd2lkdGg6IDE0MCxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfpg6jpl6gnLFxuICAgICAgICBrZXk6ICdERVBUX05BTUUnLFxuICAgICAgICB3aWR0aDogMTQwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+S4u+WxnicsXG4gICAgICAgIGtleTogJ0RVX0lTX01BSU4nLFxuICAgICAgICB3aWR0aDogNzAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9XSxcbiAgICAgIHRhYmxlRGF0YTogW10sXG4gICAgICBzZWxlY3Rpb25Sb3dzOiBudWxsLFxuICAgICAgcGFnZVRvdGFsOiAwLFxuICAgICAgcGFnZVNpemU6IDEyLFxuICAgICAgcGFnZU51bTogMSxcbiAgICAgIGxpc3RIZWlnaHQ6IDI3MFxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdmFyIG9sZFNlbGVjdGVkT3JnYW5JZCA9IENvb2tpZVV0aWxpdHkuR2V0Q29va2llKFwiRE1PUkdTSURcIik7XG5cbiAgICBpZiAob2xkU2VsZWN0ZWRPcmdhbklkKSB7XG4gICAgICB0aGlzLiRyZWZzLnNlbGVjdE9yZ2FuQ29tcC5zZXRPbGRTZWxlY3RlZE9yZ2FuKG9sZFNlbGVjdGVkT3JnYW5JZCk7XG4gICAgICB0aGlzLmluaXRUcmVlKG9sZFNlbGVjdGVkT3JnYW5JZCk7XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgY2hhbmdlT3JnYW46IGZ1bmN0aW9uIGNoYW5nZU9yZ2FuKG9yZ2FuRGF0YSkge1xuICAgICAgQ29va2llVXRpbGl0eS5TZXRDb29raWUxTW9udGgoXCJETU9SR1NJRFwiLCBvcmdhbkRhdGEub3JnYW5JZCk7XG4gICAgICB0aGlzLmluaXRUcmVlKG9yZ2FuRGF0YS5vcmdhbklkKTtcbiAgICAgIHRoaXMuY2xlYXJTZWFyY2hDb25kaXRpb24oKTtcbiAgICAgIHRoaXMudGFibGVEYXRhID0gW107XG4gICAgfSxcbiAgICBpbml0VHJlZTogZnVuY3Rpb24gaW5pdFRyZWUob3JnYW5JZCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldERlcGFydG1lbnRUcmVlRGF0YSwge1xuICAgICAgICBcIm9yZ2FuSWRcIjogb3JnYW5JZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi4kcmVmcy56VHJlZVVMLnNldEF0dHJpYnV0ZShcImlkXCIsIFwic2VsZWN0LWRlcGFydG1lbnQtdXNlci1kaWFsb2ctXCIgKyBTdHJpbmdVdGlsaXR5Lkd1aWQoKSk7XG5cbiAgICAgICAgICBfc2VsZi50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoX3NlbGYuJHJlZnMuelRyZWVVTCksIF9zZWxmLnRyZWVTZXR0aW5nLCByZXN1bHQuZGF0YSk7XG5cbiAgICAgICAgICBfc2VsZi50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcblxuICAgICAgICAgIF9zZWxmLnRyZWVPYmouX2hvc3QgPSBfc2VsZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgdHJlZU5vZGVTZWxlY3RlZDogZnVuY3Rpb24gdHJlZU5vZGVTZWxlY3RlZChldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgdGhpcy50cmVlU2VsZWN0ZWROb2RlID0gdHJlZU5vZGU7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBudWxsO1xuICAgICAgdGhpcy5wYWdlTnVtID0gMTtcbiAgICAgIHRoaXMuY2xlYXJTZWFyY2hDb25kaXRpb24oKTtcbiAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmRlcGFydG1lbnRJZC52YWx1ZSA9IHRoaXMudHJlZVNlbGVjdGVkTm9kZVt0aGlzLnRyZWVJZEZpZWxkTmFtZV07XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGFkZERlcGFydG1lbnQ6IGZ1bmN0aW9uIGFkZERlcGFydG1lbnQoKSB7XG4gICAgICBpZiAodGhpcy50cmVlU2VsZWN0ZWROb2RlICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmRlcGFydG1lbnRFZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJhZGRcIixcbiAgICAgICAgICBcInBhcmVudElkXCI6IHRoaXMudHJlZVNlbGVjdGVkTm9kZVthcHBMaXN0LnRyZWVJZEZpZWxkTmFtZV1cbiAgICAgICAgfSk7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICAgIHRpdGxlOiBcIumDqOmXqOeuoeeQhlwiXG4gICAgICAgIH0sIDMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup54i26IqC54K5IVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVkaXREZXBhcnRtZW50OiBmdW5jdGlvbiBlZGl0RGVwYXJ0bWVudCgpIHtcbiAgICAgIGlmICh0aGlzLnRyZWVTZWxlY3RlZE5vZGUgIT0gbnVsbCkge1xuICAgICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZGVwYXJ0bWVudEVkaXRWaWV3LCB7XG4gICAgICAgICAgXCJvcFwiOiBcInVwZGF0ZVwiLFxuICAgICAgICAgIFwicmVjb3JkSWRcIjogdGhpcy50cmVlU2VsZWN0ZWROb2RlW2FwcExpc3QudHJlZUlkRmllbGROYW1lXVxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgICAgdGl0bGU6IFwi6YOo6Zeo566h55CGXCJcbiAgICAgICAgfSwgMyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6npnIDopoHnvJbovpHnmoToioLngrkhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdmlld0RlcGFydG1lbnQ6IGZ1bmN0aW9uIHZpZXdEZXBhcnRtZW50KCkge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmRlcGFydG1lbnRFZGl0Vmlldywge1xuICAgICAgICBcIm9wXCI6IFwidmlld1wiLFxuICAgICAgICBcInJlY29yZElkXCI6IHRoaXMudHJlZVNlbGVjdGVkTm9kZVthcHBMaXN0LnRyZWVJZEZpZWxkTmFtZV1cbiAgICAgIH0pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumDqOmXqOeuoeeQhlwiXG4gICAgICB9LCAzKTtcbiAgICB9LFxuICAgIGRlbERlcGFydG1lbnQ6IGZ1bmN0aW9uIGRlbERlcGFydG1lbnQoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICB2YXIgcmVjb3JkSWQgPSB0aGlzLnRyZWVTZWxlY3RlZE5vZGVbYXBwTGlzdC50cmVlSWRGaWVsZE5hbWVdO1xuICAgICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTopoHliKDpmaTpgInlrprnmoToioLngrnlkJfvvJ9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBBamF4VXRpbGl0eS5EZWxldGUoX3NlbGYuYWNJbnRlcmZhY2UuZGVsZXRlRGVwYXJ0bWVudCwge1xuICAgICAgICAgIHJlY29yZElkOiByZWNvcmRJZFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgYXBwTGlzdC50cmVlT2JqLnJlbW92ZU5vZGUoYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlKTtcbiAgICAgICAgICAgICAgYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFwianNvblwiKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgbW92ZURlcGFydG1lbnQ6IGZ1bmN0aW9uIG1vdmVEZXBhcnRtZW50KHR5cGUpIHtcbiAgICAgIGlmICh0aGlzLnRyZWVTZWxlY3RlZE5vZGUgIT0gbnVsbCkge1xuICAgICAgICB2YXIgcmVjb3JkSWQgPSB0aGlzLnRyZWVTZWxlY3RlZE5vZGVbYXBwTGlzdC50cmVlSWRGaWVsZE5hbWVdO1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UubW92ZURlcGFydG1lbnQsIHtcbiAgICAgICAgICByZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJkb3duXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXBwTGlzdC50cmVlU2VsZWN0ZWROb2RlLmdldE5leHROb2RlKCkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgYXBwTGlzdC50cmVlT2JqLm1vdmVOb2RlKGFwcExpc3QudHJlZVNlbGVjdGVkTm9kZS5nZXROZXh0Tm9kZSgpLCBhcHBMaXN0LnRyZWVTZWxlY3RlZE5vZGUsIFwibmV4dFwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhcHBMaXN0LnRyZWVTZWxlY3RlZE5vZGUuZ2V0UHJlTm9kZSgpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGFwcExpc3QudHJlZU9iai5tb3ZlTm9kZShhcHBMaXN0LnRyZWVTZWxlY3RlZE5vZGUuZ2V0UHJlTm9kZSgpLCBhcHBMaXN0LnRyZWVTZWxlY3RlZE5vZGUsIFwicHJldlwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFwianNvblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqemcgOimgee8lui+keeahOiKgueCuSFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBuZXdUcmVlTm9kZTogZnVuY3Rpb24gbmV3VHJlZU5vZGUobmV3Tm9kZURhdGEpIHtcbiAgICAgIHZhciBzaWxlbnQgPSBmYWxzZTtcbiAgICAgIGFwcExpc3QudHJlZU9iai5hZGROb2Rlcyh0aGlzLnRyZWVTZWxlY3RlZE5vZGUsIG5ld05vZGVEYXRhLCBzaWxlbnQpO1xuICAgIH0sXG4gICAgdXBkYXRlTm9kZTogZnVuY3Rpb24gdXBkYXRlTm9kZShuZXdOb2RlRGF0YSkge1xuICAgICAgdGhpcy50cmVlU2VsZWN0ZWROb2RlID0gJC5leHRlbmQodHJ1ZSwgdGhpcy50cmVlU2VsZWN0ZWROb2RlLCBuZXdOb2RlRGF0YSk7XG4gICAgICBhcHBMaXN0LnRyZWVPYmoudXBkYXRlTm9kZSh0aGlzLnRyZWVTZWxlY3RlZE5vZGUpO1xuICAgIH0sXG4gICAgY2xlYXJTZWFyY2hDb25kaXRpb246IGZ1bmN0aW9uIGNsZWFyU2VhcmNoQ29uZGl0aW9uKCkge1xuICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuc2VhcmNoQ29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uW2tleV0udmFsdWUgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbltcInNlYXJjaEluQUxMXCJdLnZhbHVlID0gXCLlkKZcIjtcbiAgICB9LFxuICAgIHNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlKHNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gc2VsZWN0aW9uO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlTG9hZERhdGFTZWFyY2godGhpcy5hY0ludGVyZmFjZS5yZWxvYWRMaXN0RGF0YSwgdGhpcy5wYWdlTnVtLCB0aGlzLnBhZ2VTaXplLCB0aGlzLnNlYXJjaENvbmRpdGlvbiwgdGhpcywgdGhpcy5pZEZpZWxkTmFtZSwgdHJ1ZSwgbnVsbCwgZmFsc2UpO1xuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbiBhZGQoKSB7XG4gICAgICBpZiAodGhpcy50cmVlU2VsZWN0ZWROb2RlICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmxpc3RFZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJhZGRcIixcbiAgICAgICAgICBcImRlcGFydG1lbnRJZFwiOiB0aGlzLnRyZWVTZWxlY3RlZE5vZGVbYXBwTGlzdC50cmVlSWRGaWVsZE5hbWVdXG4gICAgICAgIH0pO1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgICB0aXRsZTogXCLpg6jpl6jnlKjmiLfnrqHnkIZcIlxuICAgICAgICB9LCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqeWIhue7hCFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlZGl0OiBmdW5jdGlvbiBlZGl0KHJlY29yZElkKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UubGlzdEVkaXRWaWV3LCB7XG4gICAgICAgIFwib3BcIjogXCJ1cGRhdGVcIixcbiAgICAgICAgXCJyZWNvcmRJZFwiOiByZWNvcmRJZFxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgdGl0bGU6IFwi6YOo6Zeo55So5oi3566h55CGXCJcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgdmlldzogZnVuY3Rpb24gdmlldyhyZWNvcmRJZCkge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmxpc3RFZGl0Vmlldywge1xuICAgICAgICBcIm9wXCI6IFwidmlld1wiLFxuICAgICAgICBcInJlY29yZElkXCI6IHJlY29yZElkXG4gICAgICB9KTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogXCLpg6jpl6jnlKjmiLfnrqHnkIZcIlxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBkZWw6IGZ1bmN0aW9uIGRlbChyZWNvcmRJZCkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVEZWxldGVSb3codGhpcy5hY0ludGVyZmFjZS5kZWxldGVMaXN0UmVjb3JkLCByZWNvcmRJZCwgYXBwTGlzdCk7XG4gICAgfSxcbiAgICBzdGF0dXNFbmFibGU6IGZ1bmN0aW9uIHN0YXR1c0VuYWJsZShzdGF0dXNOYW1lKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHRoaXMuYWNJbnRlcmZhY2UubGlzdFN0YXR1c0NoYW5nZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCBhcHBMaXN0LmlkRmllbGROYW1lLCBzdGF0dXNOYW1lLCBhcHBMaXN0KTtcbiAgICB9LFxuICAgIG1vdmU6IGZ1bmN0aW9uIG1vdmUodHlwZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3TW92ZUZhY2UodGhpcy5hY0ludGVyZmFjZS5saXN0TW92ZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCBhcHBMaXN0LmlkRmllbGROYW1lLCB0eXBlLCBhcHBMaXN0KTtcbiAgICB9LFxuICAgIG1vdmVUb0Fub3RoZXJEZXBhcnRtZW50OiBmdW5jdGlvbiBtb3ZlVG9Bbm90aGVyRGVwYXJ0bWVudCgpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvblJvd3MgIT0gbnVsbCAmJiB0aGlzLnNlbGVjdGlvblJvd3MubGVuZ3RoID4gMCAmJiB0aGlzLnNlbGVjdGlvblJvd3MubGVuZ3RoID09IDEpIHt9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInkuK3pnIDopoHmk43kvZznmoTorrDlvZXvvIzmr4/mrKHlj6rog73pgInkuK3kuIDooYwhXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFydFRpbWVKb2I6IGZ1bmN0aW9uIHBhcnRUaW1lSm9iKCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uUm93cyAhPSBudWxsICYmIHRoaXMuc2VsZWN0aW9uUm93cy5sZW5ndGggPiAwICYmIHRoaXMuc2VsZWN0aW9uUm93cy5sZW5ndGggPT0gMSkge30gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieS4remcgOimgeaTjeS9nOeahOiusOW9le+8jOavj+asoeWPquiDvemAieS4reS4gOihjCFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjaGFuZ2VQYWdlOiBmdW5jdGlvbiBjaGFuZ2VQYWdlKHBhZ2VOdW0pIHtcbiAgICAgIHRoaXMucGFnZU51bSA9IHBhZ2VOdW07XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uUm93cyA9IG51bGw7XG4gICAgfSxcbiAgICBzZWFyY2g6IGZ1bmN0aW9uIHNlYXJjaCgpIHtcbiAgICAgIHRoaXMucGFnZU51bSA9IDE7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdCgpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zZWxlY3REZXBhcnRtZW50VXNlck1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHZhciBkaWFsb2dIZWlnaHQgPSA0NjA7XG5cbiAgICAgIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA+IDcwMCkge1xuICAgICAgICBkaWFsb2dIZWlnaHQgPSA2NjA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdEhlaWdodCA9IGRpYWxvZ0hlaWdodCAtIDIzMDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogOTcwLFxuICAgICAgICBoZWlnaHQ6IGRpYWxvZ0hlaWdodCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup57uE57uH5py65p6EXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY29tcGxldGVkOiBmdW5jdGlvbiBjb21wbGV0ZWQoKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnNlbGVjdGlvblJvd3MpO1xuXG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb25Sb3dzKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLWNvbXBsZXRlZCcsIHRoaXMuc2VsZWN0aW9uUm93cyk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+WFiOmAieS4reS6uuWRmCFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzLnNlbGVjdERlcGFydG1lbnRVc2VyTW9kZWxEaWFsb2dXcmFwKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJzZWxlY3REZXBhcnRtZW50VXNlck1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtMmNvbHVtblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGVmdC1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwid2lkdGg6IDE4MHB4O3RvcDogMTBweDtsZWZ0OiAxMHB4O2JvdHRvbTogNTVweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3Qtb3JnYW4tc2luZ2xlLWNvbXAgQG9uLXNlbGVjdGVkLW9yZ2FuPVxcXCJjaGFuZ2VPcmdhblxcXCIgcmVmPVxcXCJzZWxlY3RPcmdhbkNvbXBcXFwiPjwvc2VsZWN0LW9yZ2FuLXNpbmdsZS1jb21wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbm5lci13cmFwXFxcIiBzdHlsZT1cXFwicG9zaXRpb246YWJzb2x1dGU7dG9wOiAzMHB4O2JvdHRvbTogMTBweDtoZWlnaHQ6IGF1dG87b3ZlcmZsb3c6IGF1dG9cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgcmVmPVxcXCJ6VHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicmlnaHQtb3V0ZXItd3JhcCBpdi1saXN0LXBhZ2Utd3JhcFxcXCIgc3R5bGU9XFxcInBhZGRpbmc6IDEwcHg7bGVmdDogMjAwcHg7dG9wOiAxMHB4O3JpZ2h0OiAxMHB4O2JvdHRvbTogNTVweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3Qtc2ltcGxlLXNlYXJjaC13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cXFwibHMtdGFibGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDgwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogODBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiA4NXB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDgwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzPVxcXCJscy10YWJsZS1yb3dcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NzUyOFxcdTYyMzdcXHU1NDBEXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcInNlYXJjaENvbmRpdGlvbi51c2VyTmFtZS52YWx1ZVxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NjI0QlxcdTY3M0FcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwic2VhcmNoQ29uZGl0aW9uLnVzZXJQaG9uZU51bWJlci52YWx1ZVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NTE2OFxcdTVDNDBcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHYtbW9kZWw9XFxcInNlYXJjaENvbmRpdGlvbi5zZWFyY2hJbkFMTC52YWx1ZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJcXHU2NjJGXFxcIj5cXHU2NjJGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIlxcdTU0MjZcXFwiPlxcdTU0MjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcInNlYXJjaFxcXCI+PEljb24gdHlwZT1cXFwiYW5kcm9pZC1zZWFyY2hcXFwiPjwvSWNvbj4gXFx1NjdFNVxcdThCRTIgPC9pLWJ1dHRvbj48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgOmhlaWdodD1cXFwibGlzdEhlaWdodFxcXCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cXFwiY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcInRhYmxlRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIDpoaWdobGlnaHQtcm93PVxcXCJ0cnVlXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAb24tc2VsZWN0aW9uLWNoYW5nZT1cXFwic2VsZWN0aW9uQ2hhbmdlXFxcIj48L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OiByaWdodDtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhZ2UgQG9uLWNoYW5nZT1cXFwiY2hhbmdlUGFnZVxcXCIgOmN1cnJlbnQuc3luYz1cXFwicGFnZU51bVxcXCIgOnBhZ2Utc2l6ZT1cXFwicGFnZVNpemVcXFwiIHNob3ctdG90YWxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0b3RhbD1cXFwicGFnZVRvdGFsXFxcIj48L3BhZ2U+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcImJvdHRvbTogMTJweDtyaWdodDogMTJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiY29tcGxldGVkKClcXFwiIGljb249XFxcIm1kLWNoZWNrbWFya1xcXCI+XFx1Nzg2RVxcdThCQTQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiPlxcdTUxNzNcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LXNpbmdsZS10YWJsZS1kaWFsb2dcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRUYWJsZURhdGFVcmw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZvclpUcmVlTm9kZUxpc3RcIixcbiAgICAgICAgZ2V0U2luZ2xlT3JnYW5EYXRhVXJsOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL09yZ2FuL0dldERldGFpbERhdGFcIlxuICAgICAgfSxcbiAgICAgIGpzRWRpdG9ySW5zdGFuY2U6IG51bGwsXG4gICAgICB0YWJsZVRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLl9ob3N0O1xuXG4gICAgICAgICAgICAgIGlmICh0cmVlTm9kZS5ub2RlVHlwZU5hbWUgPT0gXCJUYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWRUYWJsZShldmVudCwgdHJlZUlkLCB0cmVlTm9kZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWRUYWJsZShldmVudCwgdHJlZUlkLCBudWxsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZURhdGE6IG51bGwsXG4gICAgICAgIGNsaWNrTm9kZTogbnVsbFxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkVGFibGVEYXRhOiBudWxsXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgaGFuZGxlQ2xvc2U6IGZ1bmN0aW9uIGhhbmRsZUNsb3NlKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odGhpcy4kcmVmcy5zZWxlY3RUYWJsZU1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdFRhYmxlOiBmdW5jdGlvbiBiZWdpblNlbGVjdFRhYmxlKCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNlbGVjdFRhYmxlTW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy5nZXRUYWJsZURhdGFJbml0VHJlZSgpO1xuICAgICAgdmFyIGhlaWdodCA9IDQ1MDtcblxuICAgICAgaWYgKFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpID4gNTUwKSB7XG4gICAgICAgIGhlaWdodCA9IDYwMDtcbiAgICAgIH1cblxuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA1NzAsXG4gICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICB0aXRsZTogXCLpgInmi6nooahcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRUYWJsZURhdGFJbml0VHJlZTogZnVuY3Rpb24gZ2V0VGFibGVEYXRhSW5pdFRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0VGFibGVEYXRhVXJsLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi50YWJsZVRyZWUudHJlZURhdGEgPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgIF9zZWxmLiRyZWZzLnRhYmxlWlRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC10YWJsZS1zaW5nbGUtY29tcC1cIiArIFN0cmluZ1V0aWxpdHkuR3VpZCgpKTtcblxuICAgICAgICAgIF9zZWxmLnRhYmxlVHJlZS50cmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoX3NlbGYuJHJlZnMudGFibGVaVHJlZVVMKSwgX3NlbGYudGFibGVUcmVlLnRyZWVTZXR0aW5nLCBfc2VsZi50YWJsZVRyZWUudHJlZURhdGEpO1xuXG4gICAgICAgICAgX3NlbGYudGFibGVUcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuXG4gICAgICAgICAgX3NlbGYudGFibGVUcmVlLnRyZWVPYmouX2hvc3QgPSBfc2VsZjtcbiAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmooX3NlbGYudGFibGVUcmVlLnRyZWVPYmosIF9zZWxmLiRyZWZzLnR4dF90YWJsZV9zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRUYWJsZTogZnVuY3Rpb24gc2VsZWN0ZWRUYWJsZShldmVudCwgdHJlZUlkLCB0YWJsZURhdGEpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRUYWJsZURhdGEgPSB0YWJsZURhdGE7XG4gICAgfSxcbiAgICBjb21wbGV0ZWQ6IGZ1bmN0aW9uIGNvbXBsZXRlZCgpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkVGFibGVEYXRhKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLXRhYmxlJywgdGhpcy5zZWxlY3RlZFRhYmxlRGF0YSk7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+36YCJ5oup6KGoIVwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJzZWxlY3RUYWJsZU1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC1zb3VyY2Utd3JhcCBjMS1zZWxlY3QtbW9kZWwtc291cmNlLWhhcy1idXR0b25zLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cXFwiaW5wdXRfYm9yZGVyX2JvdHRvbVxcXCIgcmVmPVxcXCJ0eHRfdGFibGVfc2VhcmNoX3RleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1OEY5M1xcdTUxNjVcXHU4ODY4XFx1NTQwRFxcdTYyMTZcXHU4MDA1XFx1NjgwN1xcdTk4OThcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbm5lci13cmFwIGRpdi1jdXN0b20tc2Nyb2xsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwidGFibGVaVHJlZVVMXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwiYm90dG9tOiAxMnB4O3JpZ2h0OiAxMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJjb21wbGV0ZWQoKVxcXCIgaWNvbj1cXFwibWQtY2hlY2ttYXJrXFxcIj5cXHU3ODZFXFx1OEJBNDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJoYW5kbGVDbG9zZSgpXFxcIiBpY29uPVxcXCJtZC1jbG9zZVxcXCI+XFx1NTE3M1xcdTk1RUQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInNlbGVjdC12YWxpZGF0ZS1ydWxlLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3RWYWxpZGF0ZVR5cGU6IFwiTm9FbXB0eVwiLFxuICAgICAgcnVsZVBhcmFzOiB7XG4gICAgICAgIG1zZzogXCLlrZfmrrVcIixcbiAgICAgICAgbnVtTGVuZ3RoOiA0LFxuICAgICAgICBkZWNpbWFsTGVuZ3RoOiAwLFxuICAgICAgICBqc01ldGhvZE5hbWU6IFwiXCIsXG4gICAgICAgIHJlZ3VsYXJUZXh0OiBcIlwiLFxuICAgICAgICByZWd1bGFyTXNnOiBcIlwiXG4gICAgICB9LFxuICAgICAgYWRkZWRWYWxpZGF0ZVJ1bGU6IFtdLFxuICAgICAgdmFsaWRhdGVDb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0aXRsZTogJ+exu+WeiycsXG4gICAgICAgIGtleTogJ3ZhbGlkYXRlVHlwZScsXG4gICAgICAgIHdpZHRoOiAxNTAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5Y+C5pWwJyxcbiAgICAgICAga2V5OiAndmFsaWRhdGVQYXJhcycsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5Yig6ZmkJyxcbiAgICAgICAga2V5OiAndmFsaWRhdGVJZCcsXG4gICAgICAgIHdpZHRoOiAxMjAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZGVsXCIsXG4gICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICAgICAgX3NlbGYuZGVsVmFsaWRhdGUocGFyYW1zLnJvd1tcInZhbGlkYXRlSWRcIl0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSldKTtcbiAgICAgICAgfVxuICAgICAgfV1cbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBiZWdpblNlbGVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3Qob2xkRGF0YSkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNlbGVjdFZhbGlkYXRlUnVsZURpYWxvZ1dyYXA7XG4gICAgICB2YXIgaGVpZ2h0ID0gNDUwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICB3aWR0aDogOTgwLFxuICAgICAgICB0aXRsZTogXCLorr7nva7pqozor4Hop4TliJlcIlxuICAgICAgfSk7XG4gICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgICB0aGlzLnJ1bGVQYXJhcy5tc2cgPSBcIuWtl+autVwiO1xuICAgICAgdGhpcy5ydWxlUGFyYXMubnVtTGVuZ3RoID0gNDtcbiAgICAgIHRoaXMucnVsZVBhcmFzLmRlY2ltYWxMZW5ndGggPSAwO1xuICAgICAgdGhpcy5ydWxlUGFyYXMuanNNZXRob2ROYW1lID0gXCJcIjtcbiAgICAgIHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJUZXh0ID0gXCJcIjtcbiAgICAgIHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJNc2cgPSBcIlwiO1xuICAgICAgdGhpcy5hZGRlZFZhbGlkYXRlUnVsZSA9IFtdO1xuICAgICAgdGhpcy5iaW5kT2xkU2VsZWN0ZWRWYWx1ZShvbGREYXRhKTtcbiAgICB9LFxuICAgIGJpbmRPbGRTZWxlY3RlZFZhbHVlOiBmdW5jdGlvbiBiaW5kT2xkU2VsZWN0ZWRWYWx1ZShvbGREYXRhKSB7XG4gICAgICB2YXIgb2xkU2VsZWN0ZWRWYWx1ZSA9IG9sZERhdGE7XG5cbiAgICAgIGlmIChvbGRTZWxlY3RlZFZhbHVlLnJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5hZGRlZFZhbGlkYXRlUnVsZSA9IG9sZFNlbGVjdGVkVmFsdWUucnVsZXM7XG4gICAgICAgIHRoaXMubXNnID0gb2xkU2VsZWN0ZWRWYWx1ZS5tc2c7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRTZWxlY3RJbnN0YW5jZU5hbWU6IGZ1bmN0aW9uIGdldFNlbGVjdEluc3RhbmNlTmFtZSgpIHtcbiAgICAgIHJldHVybiBCYXNlVXRpbGl0eS5HZXRVcmxQYXJhVmFsdWUoXCJpbnN0YW5jZU5hbWVcIik7XG4gICAgfSxcbiAgICBzZWxlY3RDb21wbGV0ZTogZnVuY3Rpb24gc2VsZWN0Q29tcGxldGUoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdGhpcy5hZGRlZFZhbGlkYXRlUnVsZTtcblxuICAgICAgaWYgKHRoaXMuYWRkZWRWYWxpZGF0ZVJ1bGUubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgIG1zZzogdGhpcy5ydWxlUGFyYXMubXNnLFxuICAgICAgICAgIHJ1bGVzOiB0aGlzLmFkZGVkVmFsaWRhdGVSdWxlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLXZhbGlkYXRlLXJ1bGUnLCBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZShyZXN1bHQpKTtcbiAgICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGVhckNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGVhckNvbXBsZXRlOiBmdW5jdGlvbiBjbGVhckNvbXBsZXRlKCkge1xuICAgICAgd2luZG93Lk9wZW5lcldpbmRvd09ialt0aGlzLmdldFNlbGVjdEluc3RhbmNlTmFtZSgpXS5zZXRTZWxlY3RWYWxpZGF0ZVJ1bGVSZXN1bHRWYWx1ZShudWxsKTtcbiAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc2VsZWN0VmFsaWRhdGVSdWxlRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICBhZGRWYWxpZGF0ZVJ1bGU6IGZ1bmN0aW9uIGFkZFZhbGlkYXRlUnVsZSgpIHtcbiAgICAgIHZhciB2YWxpZGF0ZVBhcmFzID0gXCJcIjtcblxuICAgICAgaWYgKHRoaXMuc2VsZWN0VmFsaWRhdGVUeXBlID09IFwiTnVtYmVyXCIpIHtcbiAgICAgICAgdmFsaWRhdGVQYXJhcyA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh7XG4gICAgICAgICAgbnVtTGVuZ3RoOiB0aGlzLnJ1bGVQYXJhcy5udW1MZW5ndGgsXG4gICAgICAgICAgZGVjaW1hbExlbmd0aDogdGhpcy5ydWxlUGFyYXMuZGVjaW1hbExlbmd0aFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RWYWxpZGF0ZVR5cGUgPT0gXCJSZWd1bGFyXCIpIHtcbiAgICAgICAgdmFsaWRhdGVQYXJhcyA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh7XG4gICAgICAgICAgcmVndWxhclRleHQ6IHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJUZXh0LFxuICAgICAgICAgIHJlZ3VsYXJNc2c6IHRoaXMucnVsZVBhcmFzLnJlZ3VsYXJNc2dcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0VmFsaWRhdGVUeXBlID09IFwiSnNNZXRob2RcIikge1xuICAgICAgICB2YWxpZGF0ZVBhcmFzID0gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHtcbiAgICAgICAgICBqc01ldGhvZE5hbWU6IHRoaXMucnVsZVBhcmFzLmpzTWV0aG9kTmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld1ZhbGlkYXRlUnVsZSA9IHtcbiAgICAgICAgXCJ2YWxpZGF0ZUlkXCI6IFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKCksXG4gICAgICAgIFwidmFsaWRhdGVUeXBlXCI6IHRoaXMuc2VsZWN0VmFsaWRhdGVUeXBlLFxuICAgICAgICBcInZhbGlkYXRlUGFyYXNcIjogdmFsaWRhdGVQYXJhc1xuICAgICAgfTtcbiAgICAgIHRoaXMuYWRkZWRWYWxpZGF0ZVJ1bGUucHVzaChuZXdWYWxpZGF0ZVJ1bGUpO1xuICAgIH0sXG4gICAgZGVsVmFsaWRhdGU6IGZ1bmN0aW9uIGRlbFZhbGlkYXRlKHZhbGlkYXRlSWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hZGRlZFZhbGlkYXRlUnVsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5hZGRlZFZhbGlkYXRlUnVsZVtpXS52YWxpZGF0ZUlkID09IHZhbGlkYXRlSWQpIHtcbiAgICAgICAgICB0aGlzLmFkZGVkVmFsaWRhdGVSdWxlLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiByZWY9XFxcInNlbGVjdFZhbGlkYXRlUnVsZURpYWxvZ1dyYXBcXFwiIHYtY2xvYWsgY2xhc3M9XFxcImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjYXJkIHN0eWxlPVxcXCJtYXJnaW4tdG9wOiAxMHB4XFxcIiA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc2xvdD1cXFwidGl0bGVcXFwiPlxcdThCQkVcXHU3RjZFXFx1OUE4Q1xcdThCQzFcXHU4OUM0XFx1NTIxOTwvcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJzZWxlY3RWYWxpZGF0ZVR5cGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJOb0VtcHR5XFxcIj5cXHU0RTBEXFx1ODBGRFxcdTRFM0FcXHU3QTdBPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiTnVtYmVyXFxcIj5cXHU2NTcwXFx1NUI1NzwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIk1vYmlsZVxcXCI+XFx1NjI0QlxcdTY3M0E8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJEYXRlXFxcIj5cXHU2NUU1XFx1NjcxRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIlRpbWVcXFwiPlxcdTY1RjZcXHU5NUY0PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiRGF0ZVRpbWVcXFwiPlxcdTY1RTVcXHU2NzFGXFx1NjVGNlxcdTk1RjQ8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJFTWFpbFxcXCI+XFx1OTBBRVxcdTRFRjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJJRENhcmRcXFwiPlxcdThFQUJcXHU0RUZEXFx1OEJDMTwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIlVSTFxcXCI+VVJMPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiRU5Db2RlXFxcIj5cXHU4MkYxXFx1NjU4NzwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIlNpbXBsZUNvZGVcXFwiPlxcdTcyNzlcXHU2QjhBXFx1NUI1N1xcdTdCMjY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJSZWd1bGFyXFxcIj5cXHU2QjYzXFx1NTIxOVxcdTg4NjhcXHU4RkJFXFx1NUYwRjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIkpzTWV0aG9kXFxcIj5KU1xcdTY1QjlcXHU2Q0Q1PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInN1Y2Nlc3NcXFwiIHNoYXBlPVxcXCJjaXJjbGVcXFwiIGljb249XFxcIm1kLWFkZFxcXCIgc3R5bGU9XFxcIm1hcmdpbi1sZWZ0OiAxNXB4O2N1cnNvcjogcG9pbnRlclxcXCIgQGNsaWNrPVxcXCJhZGRWYWxpZGF0ZVJ1bGVcXFwiPjwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdmlkZXIgb3JpZW50YXRpb249XFxcImxlZnRcXFwiIDpkYXNoZWQ9XFxcInRydWVcXFwiIHN0eWxlPVxcXCJmb250LXNpemU6IDEycHhcXFwiPlxcdTUzQzJcXHU2NTcwXFx1OEJCRVxcdTdGNkU8L2RpdmlkZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS1cXHU2NTcwXFx1NUI1N1xcdTdDN0JcXHU1NzhCXFx1NTNDMlxcdTY1NzBcXHU4QkJFXFx1N0Y2RS0tPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHYtaWY9XFxcInNlbGVjdFZhbGlkYXRlVHlwZT09J051bWJlcidcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktZm9ybSA6bGFiZWwtd2lkdGg9XFxcIjgwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU5NTdGXFx1NUVBNlxcdUZGMUFcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cm93PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQtbnVtYmVyIDptYXg9XFxcIjEwXFxcIiA6bWluPVxcXCIxXFxcIiB2LW1vZGVsPVxcXCJydWxlUGFyYXMubnVtTGVuZ3RoXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgc3R5bGU9XFxcIndpZHRoOiA4MCVcXFwiPjwvaW5wdXQtbnVtYmVyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCI0XFxcIiBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cXHU1QzBGXFx1NjU3MFxcdTRGNERcXHU2NTcwXFx1RkYxQTwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dC1udW1iZXIgOm1heD1cXFwiMTBcXFwiIDptaW49XFxcIjBcXFwiIHYtbW9kZWw9XFxcInJ1bGVQYXJhcy5kZWNpbWFsTGVuZ3RoXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgc3R5bGU9XFxcIndpZHRoOiA4MCVcXFwiPjwvaW5wdXQtbnVtYmVyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS1cXHU2QjYzXFx1NTIxOVxcdTg4NjhcXHU4RkJFXFx1NUYwRlxcdTdDN0JcXHU1NzhCXFx1NTNDMlxcdTY1NzBcXHU4QkJFXFx1N0Y2RS0tPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHYtaWY9XFxcInNlbGVjdFZhbGlkYXRlVHlwZT09J1JlZ3VsYXInXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gOmxhYmVsLXdpZHRoPVxcXCI4MFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1ODg2OFxcdThGQkVcXHU1RjBGXFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNpemU9XFxcInNtYWxsXFxcIiBwbGFjZWhvbGRlcj1cXFwiRW50ZXIgc29tZXRoaW5nLi4uXFxcIiB2LW1vZGVsPVxcXCJydWxlUGFyYXMucmVndWxhclRleHRcXFwiIHN0eWxlPVxcXCJ3aWR0aDogODAlXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjRcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlxcdTYzRDBcXHU3OTNBXFx1NEZFMVxcdTYwNkZcXHVGRjFBPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2l6ZT1cXFwic21hbGxcXFwiIHBsYWNlaG9sZGVyPVxcXCJFbnRlciBzb21ldGhpbmcuLi5cXFwiIHYtbW9kZWw9XFxcInJ1bGVQYXJhcy5yZWd1bGFyTXNnXFxcIiBzdHlsZT1cXFwid2lkdGg6IDgwJVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS1KU1xcdTY1QjlcXHU2Q0Q1XFx1N0M3QlxcdTU3OEJcXHU1M0MyXFx1NjU3MFxcdThCQkVcXHU3RjZFLS0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgdi1pZj1cXFwic2VsZWN0VmFsaWRhdGVUeXBlPT0nSnNNZXRob2QnXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWZvcm0gOmxhYmVsLXdpZHRoPVxcXCI4MFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NjVCOVxcdTZDRDVcXHU1NDBEXFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNpemU9XFxcInNtYWxsXFxcIiBwbGFjZWhvbGRlcj1cXFwiRW50ZXIgc29tZXRoaW5nLi4uXFxcIiB2LW1vZGVsPVxcXCJydWxlUGFyYXMuanNNZXRob2ROYW1lXFxcIiBzdHlsZT1cXFwid2lkdGg6IDkwJVxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWZvcm0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9jYXJkPlxcbiAgICAgICAgICAgICAgICAgICAgPGNhcmQgc3R5bGU9XFxcIm1hcmdpbi10b3A6IDEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIHNsb3Q9XFxcInRpdGxlXFxcIj5cXHU1REYyXFx1NkRGQlxcdTUyQTBcXHU4OUM0XFx1NTIxOTwvcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2aWRlciBvcmllbnRhdGlvbj1cXFwibGVmdFxcXCIgOmRhc2hlZD1cXFwidHJ1ZVxcXCIgc3R5bGU9XFxcImZvbnQtc2l6ZTogMTJweDttYXJnaW4tdG9wOiAwcHg7bWFyZ2luLWJvdHRvbTogNnB4XFxcIj5cXHU2M0QwXFx1NzkzQVxcdTRGRTFcXHU2MDZGPC9kaXZpZGVyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1mb3JtIDpsYWJlbC13aWR0aD1cXFwiMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0ICBwbGFjZWhvbGRlcj1cXFwiXFx1OEJGN1xcdThGOTNcXHU1MTY1XFx1NjNEMFxcdTc5M0FcXHU0RkUxXFx1NjA2Ri4uLlxcXCIgIHYtbW9kZWw9XFxcInJ1bGVQYXJhcy5tc2dcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAxMHB4O21heC1oZWlnaHQ6IDIyMHB4O292ZXJmbG93OiBhdXRvXFxcIiBjbGFzcz1cXFwiaXYtbGlzdC1wYWdlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2aWRlciBvcmllbnRhdGlvbj1cXFwibGVmdFxcXCIgOmRhc2hlZD1cXFwidHJ1ZVxcXCIgc3R5bGU9XFxcImZvbnQtc2l6ZTogMTJweDttYXJnaW4tdG9wOiAwcHg7bWFyZ2luLWJvdHRvbTogNnB4XFxcIj5cXHU5QThDXFx1OEJDMVxcdTg5QzRcXHU1MjE5PC9kaXZpZGVyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBib3JkZXIgOmNvbHVtbnM9XFxcInZhbGlkYXRlQ29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcImFkZGVkVmFsaWRhdGVSdWxlXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiIHNpemU9XFxcInNtYWxsXFxcIiBuby1kYXRhLXRleHQ9XFxcIlxcdThCRjdcXHU2REZCXFx1NTJBMFxcdTlBOENcXHU4QkMxXFx1ODlDNFxcdTUyMTlcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvY2FyZD5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzZWxlY3RDb21wbGV0ZSgpXFxcIj4gXFx1Nzg2RSBcXHU4QkE0IDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJjbGVhckNvbXBsZXRlKClcXFwiPiBcXHU2RTA1IFxcdTdBN0EgPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiPlxcdTUxNzMgXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcInRhYmxlLXJlbGF0aW9uLWNvbm5lY3QtdHdvLXRhYmxlLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHM6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHNcIlxuICAgICAgfSxcbiAgICAgIGZyb21UYWJsZUZpZWxkOiB7XG4gICAgICAgIGZpZWxkRGF0YTogW10sXG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdGl0bGU6ICflrZfmrrXlkI3np7AnLFxuICAgICAgICAgIGtleTogJ2ZpZWxkTmFtZScsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5qCH6aKYJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZENhcHRpb24nLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgdG9UYWJsZUZpZWxkOiB7XG4gICAgICAgIGZpZWxkRGF0YTogW10sXG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdGl0bGU6ICflrZfmrrXlkI3np7AnLFxuICAgICAgICAgIGtleTogJ2ZpZWxkTmFtZScsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5qCH6aKYJyxcbiAgICAgICAgICBrZXk6ICdmaWVsZENhcHRpb24nLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgZGlhbG9nSGVpZ2h0OiAwLFxuICAgICAgcmVzdWx0RGF0YToge1xuICAgICAgICBmcm9tOiB7XG4gICAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgICB0ZXh0OiBcIlwiXG4gICAgICAgIH0sXG4gICAgICAgIHRvOiB7XG4gICAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgICB0ZXh0OiBcIlwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzLmNvbm5lY3RUYWJsZUZpZWxkTW9kZWxEaWFsb2dXcmFwKTtcbiAgICB9LFxuICAgIGNvbXBsZXRlZDogZnVuY3Rpb24gY29tcGxldGVkKCkge1xuICAgICAgaWYgKHRoaXMucmVzdWx0RGF0YS5mcm9tLnRleHQgIT0gXCJcIiAmJiB0aGlzLnJlc3VsdERhdGEudG8udGV4dCAhPSBcIlwiKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ29uLWNvbXBsZXRlZC1jb25uZWN0JywgdGhpcy5yZXN1bHREYXRhKTtcbiAgICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7forr7nva7lhbPogZTlrZfmrrVcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRGaWVsZHNBbmRCaW5kOiBmdW5jdGlvbiBnZXRGaWVsZHNBbmRCaW5kKGZyb21UYWJsZUlkLCB0b1RhYmxlSWQpIHtcbiAgICAgIHZhciB0YWJsZUlkcyA9IFtmcm9tVGFibGVJZCwgdG9UYWJsZUlkXTtcblxuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHMsIHtcbiAgICAgICAgXCJ0YWJsZUlkc1wiOiB0YWJsZUlkc1xuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICB2YXIgYWxsRmllbGRzID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgdmFyIGFsbFRhYmxlcyA9IHJlc3VsdC5leEtWRGF0YS5UYWJsZXM7XG5cbiAgICAgICAgICB2YXIgZnJvbVRhYmxlRmllbGRzID0gX3NlbGYuZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhKGFsbEZpZWxkcywgZnJvbVRhYmxlSWQpO1xuXG4gICAgICAgICAgdmFyIHRvVGFibGVGaWVsZHMgPSBfc2VsZi5nZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGEoYWxsRmllbGRzLCB0b1RhYmxlSWQpO1xuXG4gICAgICAgICAgX3NlbGYuZnJvbVRhYmxlRmllbGQuZmllbGREYXRhID0gZnJvbVRhYmxlRmllbGRzO1xuICAgICAgICAgIF9zZWxmLnRvVGFibGVGaWVsZC5maWVsZERhdGEgPSB0b1RhYmxlRmllbGRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0Q29ubmVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3RDb25uZWN0KGZyb21UYWJsZUlkLCB0b1RhYmxlSWQpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5jb25uZWN0VGFibGVGaWVsZE1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS5mcm9tLnRhYmxlSWQgPSBmcm9tVGFibGVJZDtcbiAgICAgIHRoaXMucmVzdWx0RGF0YS50by50YWJsZUlkID0gdG9UYWJsZUlkO1xuICAgICAgdGhpcy5yZXN1bHREYXRhLmZyb20udGV4dCA9IFwiXCI7XG4gICAgICB0aGlzLnJlc3VsdERhdGEudG8udGV4dCA9IFwiXCI7XG4gICAgICB0aGlzLmdldEZpZWxkc0FuZEJpbmQoZnJvbVRhYmxlSWQsIHRvVGFibGVJZCk7XG4gICAgICB2YXIgaGVpZ2h0ID0gNDUwO1xuXG4gICAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA1NTApIHtcbiAgICAgICAgaGVpZ2h0ID0gNjAwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRpYWxvZ0hlaWdodCA9IGhlaWdodDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogODcwLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgdGl0bGU6IFwi6K6+572u5YWz6IGUXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0U2luZ2xlVGFibGVGaWVsZHNEYXRhOiBmdW5jdGlvbiBnZXRTaW5nbGVUYWJsZUZpZWxkc0RhdGEoYWxsRmllbGRzLCB0YWJsZUlkKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsRmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbGxGaWVsZHNbaV0uZmllbGRUYWJsZUlkID09IHRhYmxlSWQpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChhbGxGaWVsZHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICBzZWxlY3RlZEZyb21GaWVsZDogZnVuY3Rpb24gc2VsZWN0ZWRGcm9tRmllbGQocm93LCBpbmRleCkge1xuICAgICAgdGhpcy5yZXN1bHREYXRhLmZyb20udGV4dCA9IHJvdy5maWVsZE5hbWUgKyBcIlsxXVwiO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRUb0ZpZWxkOiBmdW5jdGlvbiBzZWxlY3RlZFRvRmllbGQocm93LCBpbmRleCkge1xuICAgICAgdGhpcy5yZXN1bHREYXRhLnRvLnRleHQgPSByb3cuZmllbGROYW1lICsgXCJbMC4uTl1cIjtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgcmVmPVxcXCJjb25uZWN0VGFibGVGaWVsZE1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC1zb3VyY2Utd3JhcCBjMS1zZWxlY3QtbW9kZWwtc291cmNlLWhhcy1idXR0b25zLXdyYXBcXFwiIHN0eWxlPVxcXCJwYWRkaW5nOiAxMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJmbG9hdDogbGVmdDt3aWR0aDogNDklO2hlaWdodDogMTAwJTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJyZXN1bHREYXRhLmZyb20udGV4dFxcXCIgc3VmZml4PVxcXCJtZC1kb25lLWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTVGMDBcXHU1OUNCXFx1NTE3M1xcdTgwNTRcXHU1QjU3XFx1NkJCNVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIEBvbi1yb3ctY2xpY2s9XFxcInNlbGVjdGVkRnJvbUZpZWxkXFxcIiBzaXplPVxcXCJzbWFsbFxcXCIgOmhlaWdodD1cXFwiZGlhbG9nSGVpZ2h0LTE4MFxcXCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cXFwiZnJvbVRhYmxlRmllbGQuY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcImZyb21UYWJsZUZpZWxkLmZpZWxkRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcImZsb2F0OnJpZ2h0O3dpZHRoOiA0OSU7aGVpZ2h0OiAxMDAlO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcInJlc3VsdERhdGEudG8udGV4dFxcXCIgc3VmZml4PVxcXCJtZC1kb25lLWFsbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdTdFRDNcXHU2NzVGXFx1NTE3M1xcdTgwNTRcXHU1QjU3XFx1NkJCNVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIEBvbi1yb3ctY2xpY2s9XFxcInNlbGVjdGVkVG9GaWVsZFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIDpoZWlnaHQ9XFxcImRpYWxvZ0hlaWdodC0xODBcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcInRvVGFibGVGaWVsZC5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwidG9UYWJsZUZpZWxkLmZpZWxkRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiA6aGlnaGxpZ2h0LXJvdz1cXFwidHJ1ZVxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCIgc3R5bGU9XFxcImJvdHRvbTogMTJweDtyaWdodDogMTJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiY29tcGxldGVkKClcXFwiIGljb249XFxcIm1kLWNoZWNrbWFya1xcXCI+XFx1Nzg2RVxcdThCQTQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cXFwiaGFuZGxlQ2xvc2UoKVxcXCIgaWNvbj1cXFwibWQtY2xvc2VcXFwiPlxcdTUxNzNcXHU5NUVEPC9pLWJ1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJkYi10YWJsZS1yZWxhdGlvbi1jb21wXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0VGFibGVzRGF0YVVybDogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVzRm9yWlRyZWVOb2RlTGlzdFwiLFxuICAgICAgICBnZXRUYWJsZUZpZWxkc1VybDogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVGaWVsZHNCeVRhYmxlSWRcIlxuICAgICAgfSxcbiAgICAgIHJlbGF0aW9uVGFibGVUcmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRhYmxlVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB3aW5kb3cuX2RidGFibGVyZWxhdGlvbmNvbXA7XG5cbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWRSZWxhdGlvblRhYmxlTm9kZSh0cmVlTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0YWJsZVRyZWVSb290RGF0YToge1xuICAgICAgICAgIGlkOiBcIi0xXCIsXG4gICAgICAgICAgdGV4dDogXCLmlbDmja7lhbPogZRcIixcbiAgICAgICAgICBwYXJlbnRJZDogXCJcIixcbiAgICAgICAgICBub2RlVHlwZU5hbWU6IFwi5qC56IqC54K5XCIsXG4gICAgICAgICAgaWNvbjogXCIuLi8uLi8uLi9UaGVtZXMvUG5nMTZYMTYvY29pbnNfYWRkLnBuZ1wiLFxuICAgICAgICAgIF9ub2RlRXhUeXBlOiBcInJvb3RcIixcbiAgICAgICAgICB0YWJsZUlkOiBcIi0xXCJcbiAgICAgICAgfSxcbiAgICAgICAgY3VycmVudFNlbGVjdGVkTm9kZTogbnVsbFxuICAgICAgfSxcbiAgICAgIHJlbGF0aW9uVGFibGVFZGl0b3JWaWV3OiB7XG4gICAgICAgIGlzU2hvd1RhYmxlRWRpdERldGFpbDogZmFsc2UsXG4gICAgICAgIGlzU3ViRWRpdFRyOiBmYWxzZSxcbiAgICAgICAgaXNNYWluRWRpdFRyOiBmYWxzZSxcbiAgICAgICAgc2VsUEtEYXRhOiBbXSxcbiAgICAgICAgc2VsU2VsZktleURhdGE6IFtdLFxuICAgICAgICBzZWxGb3JlaWduS2V5RGF0YTogW11cbiAgICAgIH0sXG4gICAgICBlbXB0eUVkaXRvckRhdGE6IHtcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIHBhcmVudElkOiBcIlwiLFxuICAgICAgICBzaW5nbGVOYW1lOiBcIlwiLFxuICAgICAgICBwa0ZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgZGVzYzogXCJcIixcbiAgICAgICAgc2VsZktleUZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgb3V0ZXJLZXlGaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIHJlbGF0aW9uVHlwZTogXCIxVG9OXCIsXG4gICAgICAgIGlzU2F2ZTogXCJ0cnVlXCIsXG4gICAgICAgIGNvbmRpdGlvbjogXCJcIixcbiAgICAgICAgdGFibGVJZDogXCJcIixcbiAgICAgICAgdGFibGVOYW1lOiBcIlwiLFxuICAgICAgICB0YWJsZUNhcHRpb246IFwiXCJcbiAgICAgIH0sXG4gICAgICBjdXJyZW50RWRpdG9yRGF0YToge1xuICAgICAgICBpZDogXCJcIixcbiAgICAgICAgcGFyZW50SWQ6IFwiXCIsXG4gICAgICAgIHNpbmdsZU5hbWU6IFwiXCIsXG4gICAgICAgIHBrRmllbGROYW1lOiBcIlwiLFxuICAgICAgICBkZXNjOiBcIlwiLFxuICAgICAgICBzZWxmS2V5RmllbGROYW1lOiBcIlwiLFxuICAgICAgICBvdXRlcktleUZpZWxkTmFtZTogXCJcIixcbiAgICAgICAgcmVsYXRpb25UeXBlOiBcIjFUb05cIixcbiAgICAgICAgaXNTYXZlOiBcInRydWVcIixcbiAgICAgICAgY29uZGl0aW9uOiBcIlwiLFxuICAgICAgICB0YWJsZUlkOiBcIlwiLFxuICAgICAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIlxuICAgICAgfSxcbiAgICAgIHNlbGVjdFRhYmxlVHJlZToge1xuICAgICAgICB0YWJsZVRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRhYmxlVHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJ0ZXh0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgaWYgKHRyZWVOb2RlLm5vZGVUeXBlTmFtZSA9PSBcIlRhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB3aW5kb3cuX2RidGFibGVyZWxhdGlvbmNvbXA7XG4gICAgICAgICAgICAgICAgJChcIiNkaXZTZWxlY3RUYWJsZVwiKS5kaWFsb2coXCJjbG9zZVwiKTtcblxuICAgICAgICAgICAgICAgIF9zZWxmLmFkZFRhYmxlVG9SZWxhdGlvblRhYmxlVHJlZSh0cmVlTm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRhYmxlVHJlZURhdGE6IG51bGwsXG4gICAgICAgIHNlbGVjdGVkVGFibGVOYW1lOiBcIuaXoFwiXG4gICAgICB9LFxuICAgICAgdGVtcERhdGFTdG9yZToge30sXG4gICAgICByZXN1bHREYXRhOiBbXSxcbiAgICAgIHRyZWVOb2RlU2V0dGluZzoge1xuICAgICAgICBNYWluVGFibGVOb2RlSW1nOiBcIi4uLy4uLy4uL1RoZW1lcy9QbmcxNlgxNi9wYWdlX2tleS5wbmdcIixcbiAgICAgICAgU3ViVGFibGVOb2RlSW1nOiBcIi4uLy4uLy4uL1RoZW1lcy9QbmcxNlgxNi9wYWdlX3JlZnJlc2gucG5nXCJcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuYmluZFNlbGVjdFRhYmxlVHJlZSgpO1xuICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI2RhdGFSZWxhdGlvblpUcmVlVUxcIiksIHRoaXMucmVsYXRpb25UYWJsZVRyZWUudGFibGVUcmVlU2V0dGluZywgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50YWJsZVRyZWVSb290RGF0YSk7XG4gICAgdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcbiAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUgPSB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmouZ2V0Tm9kZUJ5UGFyYW0oXCJpZFwiLCBcIi0xXCIpO1xuICAgIHdpbmRvdy5fZGJ0YWJsZXJlbGF0aW9uY29tcCA9IHRoaXM7XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgY3VycmVudEVkaXRvckRhdGE6IHtcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIGhhbmRsZXIodmFsLCBvbGRWYWwpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlc3VsdERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy5yZXN1bHREYXRhW2ldLmlkID09IHZhbC5pZCkge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRJdGVtQ29weUVkaXRFbmFibGVWYWx1ZSh0aGlzLnJlc3VsdERhdGFbaV0sIHZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVlcDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIHJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlOiBmdW5jdGlvbiByZXN1bHRJdGVtQ29weUVkaXRFbmFibGVWYWx1ZSh0b09iaiwgZnJvbU9iaikge1xuICAgICAgdG9PYmouc2luZ2xlTmFtZSA9IGZyb21PYmouc2luZ2xlTmFtZTtcbiAgICAgIHRvT2JqLnBrRmllbGROYW1lID0gZnJvbU9iai5wa0ZpZWxkTmFtZTtcbiAgICAgIHRvT2JqLmRlc2MgPSBmcm9tT2JqLmRlc2M7XG4gICAgICB0b09iai5zZWxmS2V5RmllbGROYW1lID0gZnJvbU9iai5zZWxmS2V5RmllbGROYW1lO1xuICAgICAgdG9PYmoub3V0ZXJLZXlGaWVsZE5hbWUgPSBmcm9tT2JqLm91dGVyS2V5RmllbGROYW1lO1xuICAgICAgdG9PYmoucmVsYXRpb25UeXBlID0gZnJvbU9iai5yZWxhdGlvblR5cGU7XG4gICAgICB0b09iai5pc1NhdmUgPSBmcm9tT2JqLmlzU2F2ZTtcbiAgICAgIHRvT2JqLmNvbmRpdGlvbiA9IGZyb21PYmouY29uZGl0aW9uO1xuICAgIH0sXG4gICAgZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQ6IGZ1bmN0aW9uIGdldFRhYmxlRmllbGRzQnlUYWJsZUlkKHRhYmxlSWQpIHtcbiAgICAgIGlmICh0YWJsZUlkID09IFwiLTFcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXSkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wRGF0YVN0b3JlW1widGFibGVGaWVsZF9cIiArIHRhYmxlSWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0U3luYyh0aGlzLmFjSW50ZXJmYWNlLmdldFRhYmxlRmllbGRzVXJsLCB7XG4gICAgICAgICAgdGFibGVJZDogdGFibGVJZFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBfc2VsZi50ZW1wRGF0YVN0b3JlW1widGFibGVGaWVsZF9cIiArIHRhYmxlSWRdID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnRlbXBEYXRhU3RvcmVbXCJ0YWJsZUZpZWxkX1wiICsgdGFibGVJZF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcERhdGFTdG9yZVtcInRhYmxlRmllbGRfXCIgKyB0YWJsZUlkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RW1wdHlSZXN1bHRJdGVtOiBmdW5jdGlvbiBnZXRFbXB0eVJlc3VsdEl0ZW0oKSB7XG4gICAgICByZXR1cm4gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUodGhpcy5lbXB0eUVkaXRvckRhdGEpO1xuICAgIH0sXG4gICAgZ2V0RXhpc3RSZXN1bHRJdGVtOiBmdW5jdGlvbiBnZXRFeGlzdFJlc3VsdEl0ZW0oaWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZXN1bHREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc3VsdERhdGFbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHREYXRhW2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgYmluZFNlbGVjdFRhYmxlVHJlZTogZnVuY3Rpb24gYmluZFNlbGVjdFRhYmxlVHJlZSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZXNEYXRhVXJsLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIF9zZWxmLnNlbGVjdFRhYmxlVHJlZS50YWJsZVRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNzZWxlY3RUYWJsZVpUcmVlVUxcIiksIF9zZWxmLnNlbGVjdFRhYmxlVHJlZS50YWJsZVRyZWVTZXR0aW5nLCBfc2VsZi5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlRGF0YSk7XG5cbiAgICAgICAgICBfc2VsZi5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlT2JqLmV4cGFuZEFsbCh0cnVlKTtcblxuICAgICAgICAgIGZ1enp5U2VhcmNoVHJlZU9iaihfc2VsZi5zZWxlY3RUYWJsZVRyZWUudGFibGVUcmVlT2JqLCBfc2VsZi4kcmVmcy50eHRfdGFibGVfc2VhcmNoX3RleHQuJHJlZnMuaW5wdXQsIG51bGwsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIGRlbGV0ZVNlbGVjdGVkUmVsYXRpb25UcmVlTm9kZTogZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWRSZWxhdGlvblRyZWVOb2RlKCkge1xuICAgICAgaWYgKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZFJvb3RSZWxhdGlvblRhYmxlTm9kZSgpKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaXNQYXJlbnQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZXN1bHREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlc3VsdERhdGFbaV0uaWQgPT0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bHREYXRhLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc3VsdEl0ZW1Db3B5RWRpdEVuYWJsZVZhbHVlKHRoaXMuY3VycmVudEVkaXRvckRhdGEsIHRoaXMuZW1wdHlFZGl0b3JEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEVkaXRvckRhdGEuaWQgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RWRpdG9yRGF0YS5wYXJlbnRJZCA9IFwiXCI7XG4gICAgICAgICAgICB0aGlzLiRyZWZzLnNxbEdlbmVyYWxEZXNpZ25Db21wLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxQS0RhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsU2VsZktleURhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsRm9yZWlnbktleURhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTaG93VGFibGVFZGl0RGV0YWlsID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmoucmVtb3ZlTm9kZSh0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSA9IG51bGw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5LiN6IO95Yig6Zmk54i26IqC54K5IVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLkuI3og73liKDpmaTmoLnoioLngrkhXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+mAieaLqeimgeWIoOmZpOeahOiKgueCuSFcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdFRhYmxlVG9SZWxhdGlvblRhYmxlOiBmdW5jdGlvbiBiZWdpblNlbGVjdFRhYmxlVG9SZWxhdGlvblRhYmxlKCkge1xuICAgICAgaWYgKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSkge1xuICAgICAgICAkKFwiI2RpdlNlbGVjdFRhYmxlXCIpLmRpYWxvZyh7XG4gICAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgICAgd2lkdGg6IDcwMFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIumAieaLqeS4gOS4queItuiKgueCuSFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhcHBlbmRNYWluVGFibGVOb2RlUHJvcDogZnVuY3Rpb24gYXBwZW5kTWFpblRhYmxlTm9kZVByb3Aobm9kZSkge1xuICAgICAgbm9kZS5fbm9kZUV4VHlwZSA9IFwiTWFpbk5vZGVcIjtcbiAgICAgIG5vZGUuaWNvbiA9IHRoaXMudHJlZU5vZGVTZXR0aW5nLk1haW5UYWJsZU5vZGVJbWc7XG4gICAgfSxcbiAgICBhcHBlbmRTdWJUYWJsZU5vZGVQcm9wOiBmdW5jdGlvbiBhcHBlbmRTdWJUYWJsZU5vZGVQcm9wKG5vZGUpIHtcbiAgICAgIG5vZGUuX25vZGVFeFR5cGUgPSBcIlN1Yk5vZGVcIjtcbiAgICAgIG5vZGUuaWNvbiA9IHRoaXMudHJlZU5vZGVTZXR0aW5nLlN1YlRhYmxlTm9kZUltZztcbiAgICB9LFxuICAgIGJ1aWxkUmVsYXRpb25UYWJsZU5vZGU6IGZ1bmN0aW9uIGJ1aWxkUmVsYXRpb25UYWJsZU5vZGUoc291cmNlTm9kZSwgdHJlZU5vZGVJZCkge1xuICAgICAgaWYgKHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZS5fbm9kZUV4VHlwZSA9PSBcInJvb3RcIikge1xuICAgICAgICB0aGlzLmFwcGVuZE1haW5UYWJsZU5vZGVQcm9wKHNvdXJjZU5vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hcHBlbmRTdWJUYWJsZU5vZGVQcm9wKHNvdXJjZU5vZGUpO1xuICAgICAgfVxuXG4gICAgICBzb3VyY2VOb2RlLnRhYmxlSWQgPSBzb3VyY2VOb2RlLmlkO1xuXG4gICAgICBpZiAodHJlZU5vZGVJZCkge1xuICAgICAgICBzb3VyY2VOb2RlLmlkID0gdHJlZU5vZGVJZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvdXJjZU5vZGUuaWQgPSBTdHJpbmdVdGlsaXR5Lkd1aWQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNvdXJjZU5vZGU7XG4gICAgfSxcbiAgICBnZXRNYWluUmVsYXRpb25UYWJsZU5vZGU6IGZ1bmN0aW9uIGdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS50cmVlT2JqLmdldE5vZGVCeVBhcmFtKFwiX25vZGVFeFR5cGVcIiwgXCJNYWluTm9kZVwiKTtcblxuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZ2V0TWFpblRhYmxlSWQ6IGZ1bmN0aW9uIGdldE1haW5UYWJsZUlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkgPyB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpLnRhYmxlSWQgOiBcIlwiO1xuICAgIH0sXG4gICAgZ2V0TWFpblRhYmxlTmFtZTogZnVuY3Rpb24gZ2V0TWFpblRhYmxlTmFtZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpID8gdGhpcy5nZXRNYWluUmVsYXRpb25UYWJsZU5vZGUoKS52YWx1ZSA6IFwiXCI7XG4gICAgfSxcbiAgICBnZXRNYWluVGFibGVDYXB0aW9uOiBmdW5jdGlvbiBnZXRNYWluVGFibGVDYXB0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFpblJlbGF0aW9uVGFibGVOb2RlKCkgPyB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpLmF0dHIxIDogXCJcIjtcbiAgICB9LFxuICAgIGlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGU6IGZ1bmN0aW9uIGlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlkID09IFwiLTFcIjtcbiAgICB9LFxuICAgIGlzU2VsZWN0ZWRNYWluUmVsYXRpb25UYWJsZU5vZGU6IGZ1bmN0aW9uIGlzU2VsZWN0ZWRNYWluUmVsYXRpb25UYWJsZU5vZGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLl9ub2RlRXhUeXBlID09IFwiTWFpbk5vZGVcIjtcbiAgICB9LFxuICAgIGFkZFRhYmxlVG9SZWxhdGlvblRhYmxlVHJlZTogZnVuY3Rpb24gYWRkVGFibGVUb1JlbGF0aW9uVGFibGVUcmVlKG5ld05vZGUpIHtcbiAgICAgIG5ld05vZGUgPSB0aGlzLmJ1aWxkUmVsYXRpb25UYWJsZU5vZGUobmV3Tm9kZSk7XG4gICAgICB2YXIgdGVtcE5vZGUgPSB0aGlzLmdldE1haW5SZWxhdGlvblRhYmxlTm9kZSgpO1xuXG4gICAgICBpZiAodGVtcE5vZGUgIT0gbnVsbCkge1xuICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCkpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLlj6rlhYHorrjlrZjlnKjkuIDkuKrkuLvorrDlvZUhXCIsIG51bGwpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmouYWRkTm9kZXModGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLCAtMSwgbmV3Tm9kZSwgZmFsc2UpO1xuICAgICAgdmFyIG5ld1Jlc3VsdEl0ZW0gPSB0aGlzLmdldEVtcHR5UmVzdWx0SXRlbSgpO1xuICAgICAgbmV3UmVzdWx0SXRlbS5pZCA9IG5ld05vZGUuaWQ7XG4gICAgICBuZXdSZXN1bHRJdGVtLnBhcmVudElkID0gdGhpcy5yZWxhdGlvblRhYmxlVHJlZS5jdXJyZW50U2VsZWN0ZWROb2RlLmlkO1xuICAgICAgbmV3UmVzdWx0SXRlbS50YWJsZUlkID0gbmV3Tm9kZS50YWJsZUlkO1xuICAgICAgbmV3UmVzdWx0SXRlbS50YWJsZU5hbWUgPSBuZXdOb2RlLnZhbHVlO1xuICAgICAgbmV3UmVzdWx0SXRlbS50YWJsZUNhcHRpb24gPSBuZXdOb2RlLmF0dHIxO1xuICAgICAgdGhpcy5yZXN1bHREYXRhLnB1c2gobmV3UmVzdWx0SXRlbSk7XG4gICAgfSxcbiAgICBzZWxlY3RlZFJlbGF0aW9uVGFibGVOb2RlOiBmdW5jdGlvbiBzZWxlY3RlZFJlbGF0aW9uVGFibGVOb2RlKG5vZGUpIHtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZVRyZWUuY3VycmVudFNlbGVjdGVkTm9kZSA9IG5vZGU7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU2hvd1RhYmxlRWRpdERldGFpbCA9ICF0aGlzLmlzU2VsZWN0ZWRSb290UmVsYXRpb25UYWJsZU5vZGUoKTtcbiAgICAgIHRoaXMucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNNYWluRWRpdFRyID0gdGhpcy5pc1NlbGVjdGVkTWFpblJlbGF0aW9uVGFibGVOb2RlKCk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LmlzU3ViRWRpdFRyID0gIXRoaXMuaXNTZWxlY3RlZE1haW5SZWxhdGlvblRhYmxlTm9kZSgpO1xuXG4gICAgICBpZiAodGhpcy5pc1NlbGVjdGVkUm9vdFJlbGF0aW9uVGFibGVOb2RlKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFBLRGF0YSA9IHRoaXMuZ2V0VGFibGVGaWVsZHNCeVRhYmxlSWQobm9kZS50YWJsZUlkKSAhPSBudWxsID8gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChub2RlLnRhYmxlSWQpIDogW107XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFNlbGZLZXlEYXRhID0gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChub2RlLnRhYmxlSWQpICE9IG51bGwgPyB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKG5vZGUudGFibGVJZCkgOiBbXTtcbiAgICAgIHZhciBwYXJlbnROb2RlID0gbm9kZS5nZXRQYXJlbnROb2RlKCk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbEZvcmVpZ25LZXlEYXRhID0gdGhpcy5nZXRUYWJsZUZpZWxkc0J5VGFibGVJZChwYXJlbnROb2RlLnRhYmxlSWQpICE9IG51bGwgPyB0aGlzLmdldFRhYmxlRmllbGRzQnlUYWJsZUlkKHBhcmVudE5vZGUudGFibGVJZCkgOiBbXTtcbiAgICAgIHRoaXMuY3VycmVudEVkaXRvckRhdGEuaWQgPSB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLmN1cnJlbnRTZWxlY3RlZE5vZGUuaWQ7XG4gICAgICB0aGlzLmN1cnJlbnRFZGl0b3JEYXRhLnBhcmVudElkID0gcGFyZW50Tm9kZS5pZDtcbiAgICAgIHZhciBleGlzdFJlc3VsdEl0ZW0gPSB0aGlzLmdldEV4aXN0UmVzdWx0SXRlbShub2RlLmlkKTtcblxuICAgICAgaWYgKGV4aXN0UmVzdWx0SXRlbSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVzdWx0SXRlbUNvcHlFZGl0RW5hYmxlVmFsdWUodGhpcy5jdXJyZW50RWRpdG9yRGF0YSwgZXhpc3RSZXN1bHRJdGVtKTtcblxuICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfc2VsZi4kcmVmcy5zcWxHZW5lcmFsRGVzaWduQ29tcC5zZXRWYWx1ZShfc2VsZi5jdXJyZW50RWRpdG9yRGF0YS5jb25kaXRpb24pO1xuXG4gICAgICAgICAgX3NlbGYuJHJlZnMuc3FsR2VuZXJhbERlc2lnbkNvbXAuc2V0QWJvdXRUYWJsZUZpZWxkcyhfc2VsZi5yZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxTZWxmS2V5RGF0YSwgX3NlbGYucmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsRm9yZWlnbktleURhdGEpO1xuICAgICAgICB9LCAzMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCLpgJrov4dnZXRFeGlzdFJlc3VsdEl0ZW3ojrflj5bkuI3liLDmlbDmja4hXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0UmVzdWx0RGF0YTogZnVuY3Rpb24gZ2V0UmVzdWx0RGF0YSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc3VsdERhdGE7XG4gICAgfSxcbiAgICBzZXJpYWxpemVSZWxhdGlvbjogZnVuY3Rpb24gc2VyaWFsaXplUmVsYXRpb24oaXNGb3JtYXQpIHtcbiAgICAgIGFsZXJ0KFwic2VyaWFsaXplUmVsYXRpb27lt7Lnu4/lgZznlKhcIik7XG4gICAgICByZXR1cm47XG5cbiAgICAgIGlmIChpc0Zvcm1hdCkge1xuICAgICAgICByZXR1cm4gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nRm9ybWF0KHRoaXMucmVzdWx0RGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcodGhpcy5yZXN1bHREYXRhKTtcbiAgICB9LFxuICAgIGRlc2VyaWFsaXplUmVsYXRpb246IGZ1bmN0aW9uIGRlc2VyaWFsaXplUmVsYXRpb24oanNvblN0cmluZykge1xuICAgICAgYWxlcnQoXCJkZXNlcmlhbGl6ZVJlbGF0aW9u5bey57uP5YGc55SoXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH0sXG4gICAgZ2V0VmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbWFpblRhYmxlSWQ6IHRoaXMuZ2V0TWFpblRhYmxlSWQoKSxcbiAgICAgICAgbWFpblRhYmxlTmFtZTogdGhpcy5nZXRNYWluVGFibGVOYW1lKCksXG4gICAgICAgIG1haW5UYWJsZUNhcHRpb246IHRoaXMuZ2V0TWFpblRhYmxlQ2FwdGlvbigpLFxuICAgICAgICByZWxhdGlvbkRhdGE6IHRoaXMucmVzdWx0RGF0YVxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUoanNvblN0cmluZykge1xuICAgICAgdmFyIHRlbXBEYXRhID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKGpzb25TdHJpbmcpO1xuICAgICAgdGhpcy5yZXN1bHREYXRhID0gdGVtcERhdGE7XG4gICAgICB2YXIgdHJlZU5vZGVEYXRhID0gbmV3IEFycmF5KCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRyZWVOb2RlID0ge1xuICAgICAgICAgIFwidmFsdWVcIjogdGVtcERhdGFbaV0udGFibGVOYW1lLFxuICAgICAgICAgIFwiYXR0cjFcIjogdGVtcERhdGFbaV0udGFibGVDYXB0aW9uLFxuICAgICAgICAgIFwidGV4dFwiOiB0ZW1wRGF0YVtpXS50YWJsZUNhcHRpb24gKyBcIuOAkFwiICsgdGVtcERhdGFbaV0udGFibGVOYW1lICsgXCLjgJFcIixcbiAgICAgICAgICBcImlkXCI6IHRlbXBEYXRhW2ldLmlkLFxuICAgICAgICAgIFwicGFyZW50SWRcIjogdGVtcERhdGFbaV0ucGFyZW50SWRcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGVtcERhdGFbaV0ucGFyZW50SWQgPT0gXCItMVwiKSB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRNYWluVGFibGVOb2RlUHJvcCh0cmVlTm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hcHBlbmRTdWJUYWJsZU5vZGVQcm9wKHRyZWVOb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyZWVOb2RlRGF0YS5wdXNoKHRyZWVOb2RlKTtcbiAgICAgIH1cblxuICAgICAgdHJlZU5vZGVEYXRhLnB1c2godGhpcy5yZWxhdGlvblRhYmxlVHJlZS50YWJsZVRyZWVSb290RGF0YSk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChcIiNkYXRhUmVsYXRpb25aVHJlZVVMXCIpLCB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRhYmxlVHJlZVNldHRpbmcsIHRyZWVOb2RlRGF0YSk7XG4gICAgICB0aGlzLnJlbGF0aW9uVGFibGVUcmVlLnRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgIH0sXG4gICAgYWxlcnRTZXJpYWxpemVSZWxhdGlvbjogZnVuY3Rpb24gYWxlcnRTZXJpYWxpemVSZWxhdGlvbigpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRKc29uQ29kZSh0aGlzLnJlc3VsdERhdGEpO1xuICAgIH0sXG4gICAgaW5wdXREZXNlcmlhbGl6ZVJlbGF0aW9uOiBmdW5jdGlvbiBpbnB1dERlc2VyaWFsaXplUmVsYXRpb24oKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LlByb21wdCh3aW5kb3csIHtcbiAgICAgICAgd2lkdGg6IDkwMCxcbiAgICAgICAgaGVpZ2h0OiA2MDBcbiAgICAgIH0sIERpYWxvZ1V0aWxpdHkuRGlhbG9nUHJvbXB0SWQsIFwi6K+36LS05YWl5pWw5o2u5YWz6IGUSnNvbuiuvue9ruWtl+espuS4slwiLCBmdW5jdGlvbiAoanNvblN0cmluZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHdpbmRvdy5fZGJ0YWJsZXJlbGF0aW9uY29tcC5zZXRWYWx1ZShqc29uU3RyaW5nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGFsZXJ0KFwi5Y+N5bqP5YiX5YyW5aSx6LSlOlwiICsgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiZGItdGFibGUtcmVsYXRpb24tY29tcFwiPlxcXHJcbiAgICAgICAgICAgICAgICA8ZGl2aWRlciBvcmllbnRhdGlvbj1cImxlZnRcIiA6ZGFzaGVkPVwidHJ1ZVwiIHN0eWxlPVwiZm9udC1zaXplOiAxMnB4O21hcmdpbi10b3A6IDBweDttYXJnaW4tYm90dG9tOiAxMHB4XCI+5pWw5o2u5YWz57O75YWz6IGU6K6+572uPC9kaXZpZGVyPlxcXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnQ7d2lkdGg6IDM1MHB4O2hlaWdodDogMzMwcHg7Ym9yZGVyOiAjZGRkZGYxIDFweCBzb2xpZDtib3JkZXItcmFkaXVzOiA0cHg7cGFkZGluZzogMTBweCAxMHB4IDEwcHggMTBweDtcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXAgc2hhcGU9XCJjaXJjbGVcIiBzdHlsZT1cIm1hcmdpbjogYXV0b1wiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwic3VjY2Vzc1wiIEBjbGljaz1cImJlZ2luU2VsZWN0VGFibGVUb1JlbGF0aW9uVGFibGVcIj4mbmJzcDvmt7vliqAmbmJzcDs8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XCJkZWxldGVTZWxlY3RlZFJlbGF0aW9uVHJlZU5vZGVcIj4mbmJzcDvliKDpmaQmbmJzcDs8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XCJhbGVydFNlcmlhbGl6ZVJlbGF0aW9uXCI+5bqP5YiX5YyWPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVwiaW5wdXREZXNlcmlhbGl6ZVJlbGF0aW9uXCI+5Y+N5bqP5YiX5YyWPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24+6K+05piOPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uLWdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVwiZGF0YVJlbGF0aW9uWlRyZWVVTFwiIGNsYXNzPVwienRyZWVcIj48L3VsPlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiByaWdodDt3aWR0aDogNjMwcHg7aGVpZ2h0OiAzMzBweDtib3JkZXI6ICNkZGRkZjEgMXB4IHNvbGlkO2JvcmRlci1yYWRpdXM6IDRweDtwYWRkaW5nOiAxMHB4IDEwcHggMTBweCAxMHB4O1wiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwibGlnaHQtZ3JheS10YWJsZVwiIGNlbGxwYWRkaW5nPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGJvcmRlcj1cIjBcIiB2LWlmPVwicmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTaG93VGFibGVFZGl0RGV0YWlsXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVwid2lkdGg6IDE3JVwiIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XCJ3aWR0aDogMzMlXCIgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cIndpZHRoOiAxNSVcIiAvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVwid2lkdGg6IDM1JVwiIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+U2luZ2xlTmFtZe+8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLnNpbmdsZU5hbWVcIiBzaXplPVwic21hbGxcIiBwbGFjZWhvbGRlcj1cIuacrOWFs+iBlOS4reeahOWUr+S4gOWQjeensCzlj6/ku6XkuLrnqbpcIiAvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+UEtLZXnvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXNlbGVjdCBwbGFjZWhvbGRlcj1cIum7mOiupOS9v+eUqElk5a2X5q61XCIgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLnBrRmllbGROYW1lXCIgc2l6ZT1cInNtYWxsXCIgc3R5bGU9XCJ3aWR0aDoxOTlweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdi1mb3I9XCJpdGVtIGluIHJlbGF0aW9uVGFibGVFZGl0b3JWaWV3LnNlbFBLRGF0YVwiIDp2YWx1ZT1cIml0ZW0uZmllbGROYW1lXCIgOmtleT1cIml0ZW0uZmllbGROYW1lXCI+e3tpdGVtLmZpZWxkQ2FwdGlvbn19PC9pLW9wdGlvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIHYtaWY9XCJyZWxhdGlvblRhYmxlRWRpdG9yVmlldy5pc1N1YkVkaXRUclwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibGFiZWxcIj7mlbDmja7lhbPns7vvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEucmVsYXRpb25UeXBlXCIgdHlwZT1cImJ1dHRvblwiIHNpemU9XCJzbWFsbFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XCIxVG8xXCI+MToxPC9yYWRpbz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVwiMVRvTlwiPjE6TjwvcmFkaW8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYWJlbFwiPuaYr+WQpuS/neWtmO+8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5pc1NhdmVcIiB0eXBlPVwiYnV0dG9uXCIgc2l6ZT1cInNtYWxsXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cInRydWVcIj7mmK88L3JhZGlvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XCJmYWxzZVwiPuWQpjwvcmFkaW8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciB2LWlmPVwicmVsYXRpb25UYWJsZUVkaXRvclZpZXcuaXNTdWJFZGl0VHJcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+5pys6Lqr5YWz6IGU5a2X5q6177yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHBsYWNlaG9sZGVyPVwi6buY6K6k5L2/55SoSWTlrZfmrrVcIiB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEuc2VsZktleUZpZWxkTmFtZVwiIHNpemU9XCJzbWFsbFwiIHN0eWxlPVwid2lkdGg6MTk5cHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHYtZm9yPVwiaXRlbSBpbiByZWxhdGlvblRhYmxlRWRpdG9yVmlldy5zZWxTZWxmS2V5RGF0YVwiIDp2YWx1ZT1cIml0ZW0uZmllbGROYW1lXCIgOmtleT1cIml0ZW0uZmllbGROYW1lXCI+e3tpdGVtLmZpZWxkQ2FwdGlvbn19PC9pLW9wdGlvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktc2VsZWN0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImxhYmVsXCI+5aSW6IGU5a2X5q6177yaPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHBsYWNlaG9sZGVyPVwi6buY6K6k5L2/55SoSWTlrZfmrrVcIiB2LW1vZGVsPVwiY3VycmVudEVkaXRvckRhdGEub3V0ZXJLZXlGaWVsZE5hbWVcIiBzaXplPVwic21hbGxcIiBzdHlsZT1cIndpZHRoOjE5OXB4XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2LWZvcj1cIml0ZW0gaW4gcmVsYXRpb25UYWJsZUVkaXRvclZpZXcuc2VsUEtEYXRhXCIgOnZhbHVlPVwiaXRlbS5maWVsZE5hbWVcIiA6a2V5PVwiaXRlbS5maWVsZE5hbWVcIj57e2l0ZW0uZmllbGRDYXB0aW9ufX08L2ktb3B0aW9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYWJlbFwiPkRlc2PvvJo8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cImN1cnJlbnRFZGl0b3JEYXRhLmRlc2NcIiBzaXplPVwic21hbGxcIiBwbGFjZWhvbGRlcj1cIuivtOaYjlwiIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJsYWJlbFwiPuWKoOi9veadoeS7tu+8mjwvdGQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3FsLWdlbmVyYWwtZGVzaWduLWNvbXAgcmVmPVwic3FsR2VuZXJhbERlc2lnbkNvbXBcIiA6c3FsRGVzaWduZXJIZWlnaHQ9XCI3NFwiIHYtbW9kZWw9XCJjdXJyZW50RWRpdG9yRGF0YS5jb25kaXRpb25cIj48L3NxbC1nZW5lcmFsLWRlc2lnbi1jb21wPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJkaXZTZWxlY3RUYWJsZVwiIHRpdGxlPVwi6K+36YCJ5oup6KGoXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XCJpbnB1dF9ib3JkZXJfYm90dG9tXCIgcmVmPVwidHh0X3RhYmxlX3NlYXJjaF90ZXh0XCIgcGxhY2Vob2xkZXI9XCLor7fovpPlhaXooajlkI3miJbogIXmoIfpophcIj48L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XCJzZWxlY3RUYWJsZVpUcmVlVUxcIiBjbGFzcz1cInp0cmVlXCI+PC91bD5cXFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICA8L2Rpdj4nXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImRlc2lnbi1odG1sLWVsZW0tbGlzdFwiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHt9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkZXNpZ24taHRtbC1lbGVtLWxpc3Qtd3JhcFwiPlxcXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNpZ24taHRtbC1lbGVtLWxpc3QtaXRlbVwiPuagvOW8j+WMljwvZGl2PlxcXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXNpZ24taHRtbC1lbGVtLWxpc3QtaXRlbVwiPuivtOaYjjwvZGl2PlxcXHJcbiAgICAgICAgPC9kaXY+J1xufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJmZC1jb250cm9sLWJhc2UtaW5mb1wiLCB7XG4gIHByb3BzOiBbXCJ2YWx1ZVwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmFzZUluZm86IHtcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICAgIHNlcmlhbGl6ZTogXCJcIixcbiAgICAgICAgbmFtZTogXCJcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcIlwiLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJcIixcbiAgICAgICAgcmVhZG9ubHk6IFwiXCIsXG4gICAgICAgIGRpc2FibGVkOiBcIlwiLFxuICAgICAgICBzdHlsZTogXCJcIixcbiAgICAgICAgZGVzYzogXCJcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgYmFzZUluZm86IGZ1bmN0aW9uIGJhc2VJbmZvKG5ld1ZhbCkge1xuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBuZXdWYWwpO1xuICAgIH0sXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlKG5ld1ZhbCkge1xuICAgICAgdGhpcy5iYXNlSW5mbyA9IG5ld1ZhbDtcbiAgICB9XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5iYXNlSW5mbyA9IHRoaXMudmFsdWU7XG4gIH0sXG4gIG1ldGhvZHM6IHt9LFxuICB0ZW1wbGF0ZTogXCI8dGFibGUgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIiBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAyODBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogOTBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTEwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDkwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCAvPlxcbiAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+SURcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5pZFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5TZXJpYWxpemVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiM1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLnNlcmlhbGl6ZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcInRydWVcXFwiPlxcdTY2MkY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJmYWxzZVxcXCI+XFx1NTQyNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPk5hbWVcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5uYW1lXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPkNsYXNzTmFtZVxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLmNsYXNzTmFtZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+UGxhY2Vob2xkZXI8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLnBsYWNlaG9sZGVyXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlJlYWRvbmx5XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdHlwZT1cXFwiYnV0dG9uXFxcIiBzdHlsZT1cXFwibWFyZ2luOiBhdXRvXFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5yZWFkb25seVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcInJlYWRvbmx5XFxcIj5cXHU2NjJGPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwibm9yZWFkb25seVxcXCI+XFx1NTQyNjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+RGlzYWJsZWRcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpby1ncm91cCB0eXBlPVxcXCJidXR0b25cXFwiIHN0eWxlPVxcXCJtYXJnaW46IGF1dG9cXFwiIHYtbW9kZWw9XFxcImJhc2VJbmZvLmRpc2FibGVkXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiZGlzYWJsZWRcXFwiPlxcdTY2MkY8L3JhZGlvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJub2Rpc2FibGVkXFxcIj5cXHU1NDI2PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yYWRpby1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NjgzN1xcdTVGMEZcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVxcXCI3XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5zdHlsZVxcXCI+PC90ZXh0YXJlYT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NTkwN1xcdTZDRThcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVxcXCI4XFxcIiB2LW1vZGVsPVxcXCJiYXNlSW5mby5kZXNjXFxcIj48L3RleHRhcmVhPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuVnVlLmNvbXBvbmVudChcImZkLWNvbnRyb2wtYmluZC10b1wiLCB7XG4gIHByb3BzOiBbXCJiaW5kVG9GaWVsZFByb3BcIiwgXCJkZWZhdWx0VmFsdWVQcm9wXCIsIFwidmFsaWRhdGVSdWxlc1Byb3BcIl0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJpbmRUb0ZpZWxkOiB7XG4gICAgICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgICAgIHRhYmxlTmFtZTogXCJcIixcbiAgICAgICAgdGFibGVDYXB0aW9uOiBcIlwiLFxuICAgICAgICBmaWVsZE5hbWU6IFwiXCIsXG4gICAgICAgIGZpZWxkQ2FwdGlvbjogXCJcIixcbiAgICAgICAgZmllbGREYXRhVHlwZTogXCJcIixcbiAgICAgICAgZmllbGRMZW5ndGg6IFwiXCJcbiAgICAgIH0sXG4gICAgICB2YWxpZGF0ZVJ1bGVzOiB7XG4gICAgICAgIG1zZzogXCJcIixcbiAgICAgICAgcnVsZXM6IFtdXG4gICAgICB9LFxuICAgICAgZGVmYXVsdFZhbHVlOiB7XG4gICAgICAgIGRlZmF1bHRUeXBlOiBcIlwiLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IFwiXCIsXG4gICAgICAgIGRlZmF1bHRUZXh0OiBcIlwiXG4gICAgICB9LFxuICAgICAgdGVtcERhdGE6IHtcbiAgICAgICAgZGVmYXVsdERpc3BsYXlUZXh0OiBcIlwiXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgd2F0Y2g6IHtcbiAgICBiaW5kVG9Qcm9wOiBmdW5jdGlvbiBiaW5kVG9Qcm9wKG5ld1ZhbHVlKSB7XG4gICAgICBjb25zb2xlLmxvZyhuZXdWYWx1ZSk7XG4gICAgfSxcbiAgICBiaW5kVG9GaWVsZFByb3A6IGZ1bmN0aW9uIGJpbmRUb0ZpZWxkUHJvcChuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5iaW5kVG9GaWVsZCA9IG5ld1ZhbHVlO1xuICAgIH0sXG4gICAgZGVmYXVsdFZhbHVlUHJvcDogZnVuY3Rpb24gZGVmYXVsdFZhbHVlUHJvcChuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgaWYgKCFTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkodGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUpKSB7XG4gICAgICAgIHRoaXMudGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0ID0gSkJ1aWxkNERTZWxlY3RWaWV3LlNlbGVjdEVudlZhcmlhYmxlLmZvcm1hdFRleHQodGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUsIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHZhbGlkYXRlUnVsZXNQcm9wOiBmdW5jdGlvbiB2YWxpZGF0ZVJ1bGVzUHJvcChuZXdWYWx1ZSkge1xuICAgICAgdGhpcy52YWxpZGF0ZVJ1bGVzID0gbmV3VmFsdWU7XG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuYmluZFRvRmllbGQgPSB0aGlzLmJpbmRUb0ZpZWxkUHJvcDtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIHNldENvbXBsZXRlZDogZnVuY3Rpb24gc2V0Q29tcGxldGVkKCkge1xuICAgICAgdGhpcy4kZW1pdCgnb24tc2V0LWNvbXBsZXRlZCcsIHRoaXMuYmluZFRvRmllbGQsIHRoaXMuZGVmYXVsdFZhbHVlLCB0aGlzLnZhbGlkYXRlUnVsZXMpO1xuICAgIH0sXG4gICAgc2VsZWN0QmluZEZpZWxkVmlldzogZnVuY3Rpb24gc2VsZWN0QmluZEZpZWxkVmlldygpIHtcbiAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHRoaXM7XG4gICAgICB3aW5kb3cucGFyZW50LmFwcEZvcm0uc2VsZWN0QmluZFRvU2luZ2xlRmllbGREaWFsb2dCZWdpbih3aW5kb3csIHRoaXMuZ2V0U2VsZWN0RmllbGRSZXN1bHRWYWx1ZSgpKTtcbiAgICB9LFxuICAgIHNldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICB0aGlzLmJpbmRUb0ZpZWxkID0ge307XG5cbiAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkTmFtZSA9IHJlc3VsdC5maWVsZE5hbWU7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVJZCA9IHJlc3VsdC50YWJsZUlkO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlTmFtZSA9IHJlc3VsdC50YWJsZU5hbWU7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQudGFibGVDYXB0aW9uID0gcmVzdWx0LnRhYmxlQ2FwdGlvbjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZENhcHRpb24gPSByZXN1bHQuZmllbGRDYXB0aW9uO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLmZpZWxkRGF0YVR5cGUgPSByZXN1bHQuZmllbGREYXRhVHlwZTtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZExlbmd0aCA9IHJlc3VsdC5maWVsZExlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGROYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZUlkID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC50YWJsZU5hbWUgPSBcIlwiO1xuICAgICAgICB0aGlzLmJpbmRUb0ZpZWxkLnRhYmxlQ2FwdGlvbiA9IFwiXCI7XG4gICAgICAgIHRoaXMuYmluZFRvRmllbGQuZmllbGRDYXB0aW9uID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZERhdGFUeXBlID0gXCJcIjtcbiAgICAgICAgdGhpcy5iaW5kVG9GaWVsZC5maWVsZExlbmd0aCA9IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0Q29tcGxldGVkKCk7XG4gICAgfSxcbiAgICBnZXRTZWxlY3RGaWVsZFJlc3VsdFZhbHVlOiBmdW5jdGlvbiBnZXRTZWxlY3RGaWVsZFJlc3VsdFZhbHVlKCkge1xuICAgICAgcmV0dXJuIEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHRoaXMuYmluZFRvRmllbGQpO1xuICAgIH0sXG4gICAgc2VsZWN0RGVmYXVsdFZhbHVlVmlldzogZnVuY3Rpb24gc2VsZWN0RGVmYXVsdFZhbHVlVmlldygpIHtcbiAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHRoaXM7XG4gICAgICB3aW5kb3cucGFyZW50LmFwcEZvcm0uc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nQmVnaW4od2luZG93LCBudWxsKTtcbiAgICB9LFxuICAgIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFR5cGUgPSByZXN1bHQuVHlwZTtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUuZGVmYXVsdFZhbHVlID0gcmVzdWx0LlZhbHVlO1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCA9IHJlc3VsdC5UZXh0O1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VHlwZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRWYWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUZXh0ID0gXCJcIjtcbiAgICAgICAgdGhpcy50ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHQgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldENvbXBsZXRlZCgpO1xuICAgIH0sXG4gICAgc2VsZWN0VmFsaWRhdGVSdWxlVmlldzogZnVuY3Rpb24gc2VsZWN0VmFsaWRhdGVSdWxlVmlldygpIHtcbiAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHRoaXM7XG4gICAgICB3aW5kb3cucGFyZW50LmFwcEZvcm0uc2VsZWN0VmFsaWRhdGVSdWxlRGlhbG9nQmVnaW4od2luZG93LCB0aGlzLmdldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlKCkpO1xuICAgIH0sXG4gICAgc2V0U2VsZWN0VmFsaWRhdGVSdWxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVSdWxlcyA9IHJlc3VsdDtcbiAgICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVSdWxlcy5tc2cgPSBcIlwiO1xuICAgICAgICB0aGlzLnZhbGlkYXRlUnVsZXMucnVsZXMgPSBbXTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFNlbGVjdFZhbGlkYXRlUnVsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBnZXRTZWxlY3RWYWxpZGF0ZVJ1bGVSZXN1bHRWYWx1ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlUnVsZXM7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8dGFibGUgY2VsbHBhZGRpbmc9XFxcIjBcXFwiIGNlbGxzcGFjaW5nPVxcXCIwXFxcIiBib3JkZXI9XFxcIjBcXFwiIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgc3R5bGU9XFxcIndpZHRoOiAyODBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCAvPlxcbiAgICAgICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTdFRDFcXHU1QjlBXFx1NTIzMFxcdTg4Njg8YnV0dG9uIGNsYXNzPVxcXCJidG4tc2VsZWN0IGZyaWdodFxcXCIgdi1vbjpjbGljaz1cXFwic2VsZWN0QmluZEZpZWxkVmlld1xcXCI+Li4uPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcdTg4NjhcXHU3RjE2XFx1NTNGN1xcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCIzXFxcIj57e2JpbmRUb0ZpZWxkLnRhYmxlSWR9fTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU4ODY4XFx1NTQwRFxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2JpbmRUb0ZpZWxkLnRhYmxlTmFtZX19PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1ODg2OFxcdTY4MDdcXHU5ODk4XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7YmluZFRvRmllbGQudGFibGVDYXB0aW9ufX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1NUI1N1xcdTZCQjVcXHU1NDBEXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7YmluZFRvRmllbGQuZmllbGROYW1lfX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU1QjU3XFx1NkJCNVxcdTY4MDdcXHU5ODk4XFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7YmluZFRvRmllbGQuZmllbGRDYXB0aW9ufX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFx1N0M3QlxcdTU3OEJcXHVGRjFBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tiaW5kVG9GaWVsZC5maWVsZERhdGFUeXBlfX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXHU5NTdGXFx1NUVBNlxcdUZGMUE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2JpbmRUb0ZpZWxkLmZpZWxkTGVuZ3RofX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNFxcXCI+XFx1OUVEOFxcdThCQTRcXHU1MDNDPGJ1dHRvbiBjbGFzcz1cXFwiYnRuLXNlbGVjdCBmcmlnaHRcXFwiIHYtb246Y2xpY2s9XFxcInNlbGVjdERlZmF1bHRWYWx1ZVZpZXdcXFwiPi4uLjwvYnV0dG9uPjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRyIHN0eWxlPVxcXCJoZWlnaHQ6IDM1cHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVxcXCI0XFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIHt7dGVtcERhdGEuZGVmYXVsdERpc3BsYXlUZXh0fX1cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiNFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTY4MjFcXHU5QThDXFx1ODlDNFxcdTUyMTk8YnV0dG9uIGNsYXNzPVxcXCJidG4tc2VsZWN0IGZyaWdodFxcXCIgdi1vbjpjbGljaz1cXFwic2VsZWN0VmFsaWRhdGVSdWxlVmlld1xcXCI+Li4uPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjRcXFwiIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVxcXCJodG1sLWRlc2lnbi1wbHVnaW4tZGlhbG9nLXRhYmxlLXdyYXBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIj5cXHU2M0QwXFx1NzkzQVxcdTZEODhcXHU2MDZGXFx1RkYxQTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7dmFsaWRhdGVSdWxlcy5tc2d9fTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyO1xcXCI+XFx1OUE4Q1xcdThCQzFcXHU3QzdCXFx1NTc4QjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPVxcXCJiYWNrZ3JvdW5kOiAjZThlYWVjO3RleHQtYWxpZ246IGNlbnRlcjtcXFwiPlxcdTUzQzJcXHU2NTcwPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgdi1mb3I9XFxcInJ1bGVJdGVtIGluIHZhbGlkYXRlUnVsZXMucnVsZXNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwiYmFja2dyb3VuZDogI2ZmZmZmZjt0ZXh0LWFsaWduOiBjZW50ZXI7Y29sb3I6ICNhZDkzNjFcXFwiPnt7cnVsZUl0ZW0udmFsaWRhdGVUeXBlfX08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cXFwiYmFja2dyb3VuZDogI2ZmZmZmZjt0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIj48cCB2LWlmPVxcXCJydWxlSXRlbS52YWxpZGF0ZVBhcmFzID09PSAnJ1xcXCI+XFx1NjVFMFxcdTUzQzJcXHU2NTcwPC9wPjxwIHYtZWxzZT57e3J1bGVJdGVtLnZhbGlkYXRlUGFyYXN9fTwvcD48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJmZC1jb250cm9sLXNlbGVjdC1iaW5kLXRvLXNpbmdsZS1maWVsZC1kaWFsb2dcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0VGFibGVzRGF0YVVybDogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVzRm9yWlRyZWVOb2RlTGlzdFwiLFxuICAgICAgICBnZXRUYWJsZUZpZWxkc0RhdGFVcmw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlRmllbGRzQnlUYWJsZUlkXCIsXG4gICAgICAgIGdldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHM6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlc0ZpZWxkc0J5VGFibGVJZHNcIlxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkRGF0YToge1xuICAgICAgICB0YWJsZUlkOiBcIlwiLFxuICAgICAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgICAgIHRhYmxlQ2FwdGlvbjogXCJcIixcbiAgICAgICAgZmllbGROYW1lOiBcIlwiLFxuICAgICAgICBmaWVsZENhcHRpb246IFwiXCIsXG4gICAgICAgIGZpZWxkRGF0YVR5cGU6IFwiXCIsXG4gICAgICAgIGZpZWxkTGVuZ3RoOiBcIlwiXG4gICAgICB9LFxuICAgICAgdGFibGVUcmVlOiB7XG4gICAgICAgIHRhYmxlVHJlZU9iajogbnVsbCxcbiAgICAgICAgdGFibGVUcmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJkaXNwbGF5VGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS50YWJsZUlkID0gdHJlZU5vZGUudGFibGVJZDtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWREYXRhLnRhYmxlTmFtZSA9IHRyZWVOb2RlLnRhYmxlTmFtZTtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWREYXRhLnRhYmxlQ2FwdGlvbiA9IHRyZWVOb2RlLnRhYmxlQ2FwdGlvbjtcbiAgICAgICAgICAgICAgX3NlbGYuc2VsZWN0ZWREYXRhLmZpZWxkTmFtZSA9IFwiXCI7XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS5maWVsZENhcHRpb24gPSBcIlwiO1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RlZERhdGEuZmllbGREYXRhVHlwZSA9IFwiXCI7XG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkRGF0YS5maWVsZExlbmd0aCA9IFwiXCI7XG4gICAgICAgICAgICAgIF9zZWxmLmZpZWxkVGFibGUuZmllbGREYXRhID0gW107XG5cbiAgICAgICAgICAgICAgX3NlbGYuZmlsdGVyQWxsRmllbGRzVG9UYWJsZShfc2VsZi5zZWxlY3RlZERhdGEudGFibGVJZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25EYmxDbGljazogZnVuY3Rpb24gb25EYmxDbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge30sXG4gICAgICAgICAgICBvbkFzeW5jU3VjY2VzczogZnVuY3Rpb24gb25Bc3luY1N1Y2Nlc3MoZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUsIG1zZykge31cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRhYmxlVHJlZURhdGE6IG51bGwsXG4gICAgICAgIHNlbGVjdGVkVGFibGVOYW1lOiBcIuaXoFwiXG4gICAgICB9LFxuICAgICAgZmllbGRUYWJsZToge1xuICAgICAgICBmaWVsZERhdGE6IFtdLFxuICAgICAgICB0YWJsZUhlaWdodDogNDcwLFxuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAnICcsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIGtleTogJ2lzU2VsZWN0ZWRUb0JpbmQnLFxuICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKGgsIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5yb3cuaXNTZWxlY3RlZFRvQmluZCA9PSBcIjFcIikge1xuICAgICAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gc2VsZWN0ZWRcIlxuICAgICAgICAgICAgICB9KV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgICAgICBjbGFzczogXCJcIlxuICAgICAgICAgICAgICB9LCBcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+WQjeensCcsXG4gICAgICAgICAga2V5OiAnZmllbGROYW1lJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmoIfpopgnLFxuICAgICAgICAgIGtleTogJ2ZpZWxkQ2FwdGlvbicsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICBvbGRSZWxhdGlvbkRhdGFTdHJpbmc6IFwiXCIsXG4gICAgICByZWxhdGlvbkRhdGE6IG51bGwsXG4gICAgICBhbGxGaWVsZHM6IG51bGwsXG4gICAgICBvbGRCaW5kRmllbGREYXRhOiBudWxsXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBtZXRob2RzOiB7XG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KHJlbGF0aW9uRGF0YSwgb2xkQmluZEZpZWxkRGF0YSkge1xuICAgICAgY29uc29sZS5sb2coXCLlhbPogZTooajmlbDmja7vvJpcIik7XG4gICAgICBjb25zb2xlLmxvZyhyZWxhdGlvbkRhdGEpO1xuICAgICAgY29uc29sZS5sb2coXCLlt7Lnu4/nu5HlrprkuobnmoTmlbDmja7vvJpcIik7XG4gICAgICBjb25zb2xlLmxvZyhvbGRCaW5kRmllbGREYXRhKTtcblxuICAgICAgaWYgKHJlbGF0aW9uRGF0YSA9PSBudWxsIHx8IHJlbGF0aW9uRGF0YSA9PSBcIlwiIHx8IHJlbGF0aW9uRGF0YS5sZW5ndGggPT0gMCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+WFiOiuvue9ruihqOWNleeahOaVsOaNruWFs+iBlO+8gVwiKTtcbiAgICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIDEwMTAwKTtcbiAgICAgICAgJCh3aW5kb3cuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLmZkQ29udHJvbFNlbGVjdEJpbmRUb1NpbmdsZUZpZWxkRGlhbG9nV3JhcDtcbiAgICAgIHZhciBoZWlnaHQgPSA0NTA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgaGVpZ2h0OiA2ODAsXG4gICAgICAgIHdpZHRoOiA5ODAsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqee7keWumuWtl+autVwiXG4gICAgICB9KTtcbiAgICAgICQod2luZG93LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAkKHdpbmRvdy5kb2N1bWVudCkuZmluZChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIDEwMTAxKTtcbiAgICAgIHRoaXMub2xkQmluZEZpZWxkRGF0YSA9IG9sZEJpbmRGaWVsZERhdGE7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YSA9IEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKG9sZEJpbmRGaWVsZERhdGEpO1xuXG4gICAgICBpZiAoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHJlbGF0aW9uRGF0YSkgIT0gdGhpcy5vbGRSZWxhdGlvbkRhdGFTdHJpbmcpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWxhdGlvbkRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICByZWxhdGlvbkRhdGFbaV0uZGlzcGxheVRleHQgPSByZWxhdGlvbkRhdGFbaV0udGFibGVOYW1lICsgXCJbXCIgKyByZWxhdGlvbkRhdGFbaV0udGFibGVDYXB0aW9uICsgXCJdKFwiICsgcmVsYXRpb25EYXRhW2ldLnJlbGF0aW9uVHlwZSArIFwiKVwiO1xuXG4gICAgICAgICAgaWYgKHJlbGF0aW9uRGF0YVtpXS5wYXJlbnRJZCA9PSBcIi0xXCIpIHtcbiAgICAgICAgICAgIHJlbGF0aW9uRGF0YVtpXS5kaXNwbGF5VGV4dCA9IHJlbGF0aW9uRGF0YVtpXS50YWJsZU5hbWUgKyBcIltcIiArIHJlbGF0aW9uRGF0YVtpXS50YWJsZUNhcHRpb24gKyBcIl1cIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZWxhdGlvbkRhdGFbaV0uaWNvbiA9IFwiLi4vLi4vLi4vVGhlbWVzL1BuZzE2WDE2L3RhYmxlLnBuZ1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YWJsZVRyZWUudGFibGVUcmVlT2JqID0gJC5mbi56VHJlZS5pbml0KCQoXCIjdGFibGVaVHJlZVVMXCIpLCB0aGlzLnRhYmxlVHJlZS50YWJsZVRyZWVTZXR0aW5nLCByZWxhdGlvbkRhdGEpO1xuICAgICAgICB0aGlzLnRhYmxlVHJlZS50YWJsZVRyZWVPYmouZXhwYW5kQWxsKHRydWUpO1xuICAgICAgICB0aGlzLm9sZFJlbGF0aW9uRGF0YVN0cmluZyA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhyZWxhdGlvbkRhdGEpO1xuICAgICAgICB0aGlzLnJlbGF0aW9uRGF0YSA9IHJlbGF0aW9uRGF0YTtcbiAgICAgICAgdGhpcy5nZXRBbGxUYWJsZXNGaWVsZHMocmVsYXRpb25EYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVzZXRGaWVsZFRvU2VsZWN0ZWRTdGF0dXModGhpcy5hbGxGaWVsZHMpO1xuICAgICAgfVxuXG4gICAgICBpZiAob2xkQmluZEZpZWxkRGF0YSAmJiBvbGRCaW5kRmllbGREYXRhLnRhYmxlSWQgJiYgb2xkQmluZEZpZWxkRGF0YS50YWJsZUlkICE9IFwiXCIpIHtcbiAgICAgICAgdmFyIHNlbGVjdGVkTm9kZSA9IHRoaXMudGFibGVUcmVlLnRhYmxlVHJlZU9iai5nZXROb2RlQnlQYXJhbShcInRhYmxlSWRcIiwgb2xkQmluZEZpZWxkRGF0YS50YWJsZUlkKTtcbiAgICAgICAgdGhpcy50YWJsZVRyZWUudGFibGVUcmVlT2JqLnNlbGVjdE5vZGUoc2VsZWN0ZWROb2RlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZXNldEZpZWxkVG9TZWxlY3RlZFN0YXR1czogZnVuY3Rpb24gcmVzZXRGaWVsZFRvU2VsZWN0ZWRTdGF0dXMoX2FsbEZpZWxkcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZpZWxkVGFibGUuZmllbGREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZmllbGRUYWJsZS5maWVsZERhdGFbaV0uaXNTZWxlY3RlZFRvQmluZCA9IFwiMFwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2FsbEZpZWxkcykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9hbGxGaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBfYWxsRmllbGRzW2ldLmlzU2VsZWN0ZWRUb0JpbmQgPSBcIjBcIjtcblxuICAgICAgICAgIGlmIChfYWxsRmllbGRzW2ldLmZpZWxkVGFibGVJZCA9PSB0aGlzLm9sZEJpbmRGaWVsZERhdGEudGFibGVJZCkge1xuICAgICAgICAgICAgaWYgKF9hbGxGaWVsZHNbaV0uZmllbGROYW1lID09IHRoaXMub2xkQmluZEZpZWxkRGF0YS5maWVsZE5hbWUpIHtcbiAgICAgICAgICAgICAgX2FsbEZpZWxkc1tpXS5pc1NlbGVjdGVkVG9CaW5kID0gXCIxXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hbGxGaWVsZHMgPSBfYWxsRmllbGRzO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZpbHRlckFsbEZpZWxkc1RvVGFibGUodGhpcy5vbGRCaW5kRmllbGREYXRhLnRhYmxlSWQpO1xuICAgIH0sXG4gICAgZ2V0QWxsVGFibGVzRmllbGRzOiBmdW5jdGlvbiBnZXRBbGxUYWJsZXNGaWVsZHMocmVsYXRpb25EYXRhKSB7XG4gICAgICB2YXIgdGFibGVJZHMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWxhdGlvbkRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGFibGVJZHMucHVzaChyZWxhdGlvbkRhdGFbaV0udGFibGVJZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRUYWJsZXNGaWVsZHNCeVRhYmxlSWRzLCB7XG4gICAgICAgIFwidGFibGVJZHNcIjogdGFibGVJZHNcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgdmFyIGFsbEZpZWxkcyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIHZhciBzaW5nbGVUYWJsZSA9IHJlc3VsdC5leEtWRGF0YS5UYWJsZXNbMF07XG4gICAgICAgICAgY29uc29sZS5sb2coXCLph43mlrDojrflj5bmlbDmja5cIik7XG4gICAgICAgICAgY29uc29sZS5sb2coYWxsRmllbGRzKTtcblxuICAgICAgICAgIF9zZWxmLnJlc2V0RmllbGRUb1NlbGVjdGVkU3RhdHVzKGFsbEZpZWxkcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgZmlsdGVyQWxsRmllbGRzVG9UYWJsZTogZnVuY3Rpb24gZmlsdGVyQWxsRmllbGRzVG9UYWJsZSh0YWJsZUlkKSB7XG4gICAgICBpZiAodGFibGVJZCkge1xuICAgICAgICB2YXIgZmllbGRzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFsbEZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLmFsbEZpZWxkc1tpXS5maWVsZFRhYmxlSWQgPT0gdGFibGVJZCkge1xuICAgICAgICAgICAgZmllbGRzLnB1c2godGhpcy5hbGxGaWVsZHNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmllbGRUYWJsZS5maWVsZERhdGEgPSBmaWVsZHM7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZmllbGRUYWJsZS5maWVsZERhdGEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2VsZWN0ZWRGaWVsZDogZnVuY3Rpb24gc2VsZWN0ZWRGaWVsZChzZWxlY3Rpb24sIGluZGV4KSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0YS5maWVsZE5hbWUgPSBzZWxlY3Rpb24uZmllbGROYW1lO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEuZmllbGRDYXB0aW9uID0gc2VsZWN0aW9uLmZpZWxkQ2FwdGlvbjtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLmZpZWxkRGF0YVR5cGUgPSBzZWxlY3Rpb24uZmllbGREYXRhVHlwZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLmZpZWxkTGVuZ3RoID0gc2VsZWN0aW9uLmZpZWxkRGF0YUxlbmd0aDtcbiAgICAgIHZhciBzZWxlY3RlZE5vZGUgPSB0aGlzLnRhYmxlVHJlZS50YWJsZVRyZWVPYmouZ2V0Tm9kZUJ5UGFyYW0oXCJ0YWJsZUlkXCIsIHNlbGVjdGlvbi5maWVsZFRhYmxlSWQpO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEudGFibGVJZCA9IHNlbGVjdGVkTm9kZS50YWJsZUlkO1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGEudGFibGVOYW1lID0gc2VsZWN0ZWROb2RlLnRhYmxlTmFtZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRhLnRhYmxlQ2FwdGlvbiA9IHNlbGVjdGVkTm9kZS50YWJsZUNhcHRpb247XG4gICAgfSxcbiAgICBzZWxlY3RDb21wbGV0ZTogZnVuY3Rpb24gc2VsZWN0Q29tcGxldGUoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdGhpcy5zZWxlY3RlZERhdGE7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHJlc3VsdC50YWJsZUlkKSAmJiAhU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHJlc3VsdC5maWVsZE5hbWUpKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLWJpbmQtdG8tc2luZ2xlLWZpZWxkJywgcmVzdWx0KTtcbiAgICAgICAgdGhpcy5oYW5kbGVDbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup6ZyA6KaB57uR5a6a55qE5a2X5q61IVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyQ29tcGxldGU6IGZ1bmN0aW9uIGNsZWFyQ29tcGxldGUoKSB7XG4gICAgICB3aW5kb3cuT3BlbmVyV2luZG93T2JqW3RoaXMuZ2V0U2VsZWN0SW5zdGFuY2VOYW1lKCldLnNldFNlbGVjdEZpZWxkUmVzdWx0VmFsdWUobnVsbCk7XG4gICAgICB0aGlzLmhhbmRsZUNsb3NlKCk7XG4gICAgfSxcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzLmZkQ29udHJvbFNlbGVjdEJpbmRUb1NpbmdsZUZpZWxkRGlhbG9nV3JhcCk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IHJlZj1cXFwiZmRDb250cm9sU2VsZWN0QmluZFRvU2luZ2xlRmllbGREaWFsb2dXcmFwXFxcIiBjbGFzcz1cXFwiZ2VuZXJhbC1lZGl0LXBhZ2Utd3JhcCBkZXNpZ24tZGlhbG9nLXdyYXBlci1zaW5nbGUtZGlhbG9nXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3QtdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2aWRlciBvcmllbnRhdGlvbj1cXFwibGVmdFxcXCIgOmRhc2hlZD1cXFwidHJ1ZVxcXCIgc3R5bGU9XFxcImZvbnQtc2l6ZTogMTJweFxcXCI+XFx1OTAwOVxcdTYyRTlcXHU4ODY4PC9kaXZpZGVyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS08aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgaWQ9XFxcInR4dFNlYXJjaFRhYmxlVHJlZVxcXCIgc3R5bGU9XFxcIndpZHRoOiAxMDAlO2hlaWdodDogMzJweDttYXJnaW4tdG9wOiAycHhcXFwiIC8+LS0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVxcXCJ0YWJsZVpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0LWZpZWxkLXdyYXBlciBpdi1saXN0LXBhZ2Utd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdmlkZXIgb3JpZW50YXRpb249XFxcImxlZnRcXFwiIDpkYXNoZWQ9XFxcInRydWVcXFwiIHN0eWxlPVxcXCJmb250LXNpemU6IDEycHhcXFwiPlxcdTkwMDlcXHU2MkU5XFx1NUI1N1xcdTZCQjU8L2RpdmlkZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgYm9yZGVyIDpjb2x1bW5zPVxcXCJmaWVsZFRhYmxlLmNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJmaWVsZFRhYmxlLmZpZWxkRGF0YVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXJvdy1jbGljaz1cXFwic2VsZWN0ZWRGaWVsZFxcXCIgOmhlaWdodD1cXFwiZmllbGRUYWJsZS50YWJsZUhlaWdodFxcXCIgc2l6ZT1cXFwic21hbGxcXFwiIG5vLWRhdGEtdGV4dD1cXFwiXFx1OEJGN1xcdTkwMDlcXHU2MkU5XFx1ODg2OFxcXCI+PC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24tb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLWlubmVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwic2VsZWN0Q29tcGxldGUoKVxcXCI+IFxcdTc4NkUgXFx1OEJBNCA8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiY2xlYXJDb21wbGV0ZSgpXFxcIj4gXFx1NkUwNSBcXHU3QTdBIDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gQGNsaWNrPVxcXCJoYW5kbGVDbG9zZSgpXFxcIj5cXHU1MTczIFxcdTk1RUQ8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJsaXN0LXNlYXJjaC1jb250cm9sLWJpbmQtdG9cIiwge1xuICBwcm9wczogW1wiYmluZFRvU2VhcmNoRmllbGRQcm9wXCIsIFwiZGF0YVNldElkXCJdLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYmluZFRvU2VhcmNoRmllbGQ6IHtcbiAgICAgICAgY29sdW1uVGl0bGU6IFwiXCIsXG4gICAgICAgIGNvbHVtblRhYmxlTmFtZTogXCJcIixcbiAgICAgICAgY29sdW1uTmFtZTogXCJcIixcbiAgICAgICAgY29sdW1uQ2FwdGlvbjogXCJcIixcbiAgICAgICAgY29sdW1uRGF0YVR5cGVOYW1lOiBcIlwiLFxuICAgICAgICBjb2x1bW5PcGVyYXRvcjogXCLljLnphY1cIlxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRWYWx1ZToge1xuICAgICAgICBkZWZhdWx0VHlwZTogXCJcIixcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBcIlwiLFxuICAgICAgICBkZWZhdWx0VGV4dDogXCJcIlxuICAgICAgfSxcbiAgICAgIHRyZWU6IHtcbiAgICAgICAgdHJlZU9iajogbnVsbCxcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwidGV4dFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwaWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogXCItMVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBfc2VsZi5zZWxlY3RDb2x1bW4odHJlZU5vZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9LFxuICAgICAgICAgICAgb25Bc3luY1N1Y2Nlc3M6IGZ1bmN0aW9uIG9uQXN5bmNTdWNjZXNzKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlLCBtc2cpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmVlRGF0YTogbnVsbFxuICAgICAgfSxcbiAgICAgIHRlbXBEYXRhOiB7XG4gICAgICAgIGRlZmF1bHREaXNwbGF5VGV4dDogXCJcIlxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgYmluZFRvU2VhcmNoRmllbGRQcm9wOiBmdW5jdGlvbiBiaW5kVG9TZWFyY2hGaWVsZFByb3AobmV3VmFsdWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKG5ld1ZhbHVlKTtcbiAgICB9LFxuICAgIGRlZmF1bHRWYWx1ZVByb3A6IGZ1bmN0aW9uIGRlZmF1bHRWYWx1ZVByb3AobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlKSkge1xuICAgICAgICB0aGlzLnRlbXBEYXRhLmRlZmF1bHREaXNwbGF5VGV4dCA9IEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KHRoaXMuZGVmYXVsdFZhbHVlLmRlZmF1bHRUeXBlLCB0aGlzLmRlZmF1bHRWYWx1ZS5kZWZhdWx0VGV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMuYmluZFRvRmllbGQgPSB0aGlzLmJpbmRUb0ZpZWxkUHJvcDtcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoZGF0YVNldFZvKSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhU2V0Vm8pO1xuICAgICAgdmFyIHRyZWVOb2RlQXJyYXkgPSBbXTtcbiAgICAgIHZhciB0cmVlTm9kZURhdGEgPSBkYXRhU2V0Vm8uY29sdW1uVm9MaXN0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWVOb2RlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2luZ2xlTm9kZSA9IHRyZWVOb2RlRGF0YVtpXTtcbiAgICAgICAgc2luZ2xlTm9kZS5waWQgPSBkYXRhU2V0Vm8uZHNJZDtcbiAgICAgICAgc2luZ2xlTm9kZS50ZXh0ID0gc2luZ2xlTm9kZS5jb2x1bW5DYXB0aW9uICsgXCJbXCIgKyBzaW5nbGVOb2RlLmNvbHVtbk5hbWUgKyBcIl1cIjtcbiAgICAgICAgc2luZ2xlTm9kZS5ub2RlVHlwZSA9IFwiRGF0YVNldENvbHVtblwiO1xuICAgICAgICBzaW5nbGVOb2RlLmlkID0gc2luZ2xlTm9kZS5jb2x1bW5JZDtcbiAgICAgICAgc2luZ2xlTm9kZS5pY29uID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL3N0YXRpYy9UaGVtZXMvUG5nMTZYMTYvcGFnZS5wbmdcIjtcbiAgICAgICAgdHJlZU5vZGVBcnJheS5wdXNoKHNpbmdsZU5vZGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcm9vdE5vZGUgPSB7XG4gICAgICAgIHBpZDogXCItMVwiLFxuICAgICAgICB0ZXh0OiBkYXRhU2V0Vm8uZHNOYW1lLFxuICAgICAgICBpZDogZGF0YVNldFZvLmRzSWQsXG4gICAgICAgIG5vZGVUeXBlOiBcIkRhdGFTZXRcIlxuICAgICAgfTtcbiAgICAgIHRyZWVOb2RlQXJyYXkucHVzaChyb290Tm9kZSk7XG4gICAgICB0aGlzLnRyZWUudHJlZU9iaiA9ICQuZm4uelRyZWUuaW5pdCgkKHRoaXMuJHJlZnMuelRyZWVVTCksIHRoaXMudHJlZS50cmVlU2V0dGluZywgdHJlZU5vZGVBcnJheSk7XG4gICAgICB0aGlzLnRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG4gICAgfSxcbiAgICBzZWxlY3RDb2x1bW46IGZ1bmN0aW9uIHNlbGVjdENvbHVtbihjb2x1bW5Wbykge1xuICAgICAgdGhpcy5iaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5UYWJsZU5hbWUgPSBjb2x1bW5Wby5jb2x1bW5UYWJsZU5hbWU7XG4gICAgICB0aGlzLmJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbk5hbWUgPSBjb2x1bW5Wby5jb2x1bW5OYW1lO1xuICAgICAgdGhpcy5iaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5DYXB0aW9uID0gY29sdW1uVm8uY29sdW1uQ2FwdGlvbjtcbiAgICAgIHRoaXMuYmluZFRvU2VhcmNoRmllbGQuY29sdW1uRGF0YVR5cGVOYW1lID0gY29sdW1uVm8uY29sdW1uRGF0YVR5cGVOYW1lO1xuICAgIH0sXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYmluZFRvU2VhcmNoRmllbGQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYmluZFRvU2VhcmNoRmllbGQ6IHRoaXMuYmluZFRvU2VhcmNoRmllbGQsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdGhpcy5kZWZhdWx0VmFsdWVcbiAgICAgIH07XG4gICAgfSxcbiAgICBzZXREYXRhOiBmdW5jdGlvbiBzZXREYXRhKGJpbmRUb1NlYXJjaEZpZWxkLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGJpbmRUb1NlYXJjaEZpZWxkKTtcbiAgICAgIHRoaXMuYmluZFRvU2VhcmNoRmllbGQgPSBiaW5kVG9TZWFyY2hGaWVsZDtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIH0sXG4gICAgc2VsZWN0RGVmYXVsdFZhbHVlVmlldzogZnVuY3Rpb24gc2VsZWN0RGVmYXVsdFZhbHVlVmlldygpIHtcbiAgICAgIHdpbmRvdy5fU2VsZWN0QmluZE9iaiA9IHRoaXM7XG4gICAgICB3aW5kb3cucGFyZW50Lmxpc3REZXNpZ24uc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nQmVnaW4od2luZG93LCBudWxsKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjx0YWJsZSBjZWxscGFkZGluZz1cXFwiMFxcXCIgY2VsbHNwYWNpbmc9XFxcIjBcXFwiIGJvcmRlcj1cXFwiMFxcXCIgY2xhc3M9XFxcImh0bWwtZGVzaWduLXBsdWdpbi1kaWFsb2ctdGFibGUtd3JhcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sIHN0eWxlPVxcXCJ3aWR0aDogMTAwcHhcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbCBzdHlsZT1cXFwid2lkdGg6IDI4MHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2wgLz5cXG4gICAgICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2ODA3XFx1OTg5OFxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHYtbW9kZWw9XFxcImJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtblRpdGxlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHJvd3NwYW49XFxcIjlcXFwiIHZhbGlnbj1cXFwidG9wXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIHJlZj1cXFwielRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NjI0MFxcdTVDNUVcXHU4ODY4XFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2JpbmRUb1NlYXJjaEZpZWxkLmNvbHVtblRhYmxlTmFtZX19XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU3RUQxXFx1NUI5QVxcdTVCNTdcXHU2QkI1XFx1RkYxQVxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2JpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbkNhcHRpb259fVxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NUI1N1xcdTZCQjVcXHU1NDBEXFx1NzlGMFxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3tiaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5OYW1lfX1cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTVCNTdcXHU2QkI1XFx1N0M3QlxcdTU3OEJcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7YmluZFRvU2VhcmNoRmllbGQuY29sdW1uRGF0YVR5cGVOYW1lfX1cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdThGRDBcXHU3Qjk3XFx1N0IyNlxcdUZGMUFcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktc2VsZWN0IHYtbW9kZWw9XFxcImJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbk9wZXJhdG9yXFxcIiBzdHlsZT1cXFwid2lkdGg6MjYwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJcXHU3QjQ5XFx1NEU4RVxcXCI+XFx1N0I0OVxcdTRFOEU8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJcXHU1MzM5XFx1OTE0RFxcXCI+XFx1NTMzOVxcdTkxNEQ8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJcXHU0RTBEXFx1N0I0OVxcdTRFOEVcXFwiPlxcdTRFMERcXHU3QjQ5XFx1NEU4RTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcIlxcdTU5MjdcXHU0RThFXFxcIj5cXHU1OTI3XFx1NEU4RTwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcIlxcdTU5MjdcXHU0RThFXFx1N0I0OVxcdTRFOEVcXFwiPlxcdTU5MjdcXHU0RThFXFx1N0I0OVxcdTRFOEU8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJcXHU1QzBGXFx1NEU4RVxcXCI+XFx1NUMwRlxcdTRFOEU8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJcXHU1QzBGXFx1NEU4RVxcdTdCNDlcXHU0RThFXFxcIj5cXHU1QzBGXFx1NEU4RVxcdTdCNDlcXHU0RThFPC9pLW9wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLW9wdGlvbiB2YWx1ZT1cXFwiXFx1NURFNlxcdTUzMzlcXHU5MTREXFxcIj5cXHU1REU2XFx1NTMzOVxcdTkxNEQ8L2ktb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktb3B0aW9uIHZhbHVlPVxcXCJcXHU1M0YzXFx1NTMzOVxcdTkxNERcXFwiPlxcdTUzRjNcXHU1MzM5XFx1OTE0RDwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1vcHRpb24gdmFsdWU9XFxcIlxcdTUzMDVcXHU1NDJCXFxcIj5cXHU1MzA1XFx1NTQyQjwvaS1vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1zZWxlY3Q+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjJcXFwiPlxcdTlFRDhcXHU4QkE0XFx1NTAzQzxidXR0b24gY2xhc3M9XFxcImJ0bi1zZWxlY3QgZnJpZ2h0XFxcIiB2LW9uOmNsaWNrPVxcXCJzZWxlY3REZWZhdWx0VmFsdWVWaWV3XFxcIj4uLi48L2J1dHRvbj48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0ciBzdHlsZT1cXFwiaGVpZ2h0OiAzNXB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cXFwiMlxcXCIgc3R5bGU9XFxcImJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3t0ZW1wRGF0YS5kZWZhdWx0RGlzcGxheVRleHR9fVxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NTkwN1xcdTZDRThcXHVGRjFBXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVxcXCI4XFxcIj48L3RleHRhcmVhPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIChldmVudCkge30sIGZhbHNlKTtcblZ1ZS5jb21wb25lbnQoXCJtb2R1bGUtbGlzdC1mbG93LWNvbXBcIiwge1xuICBwcm9wczogWydsaXN0SGVpZ2h0JywgJ21vZHVsZURhdGEnLCAnYWN0aXZlVGFiTmFtZSddLFxuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBzYXZlTW9kZWw6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zsb3dNb2RlbC9TYXZlTW9kZWxcIixcbiAgICAgICAgZ2V0RWRpdE1vZGVsVVJMOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvR2V0RWRpdE1vZGVsVVJMXCIsXG4gICAgICAgIGdldFZpZXdNb2RlbFVSTDogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRmxvd01vZGVsL0dldFZpZXdNb2RlbFVSTFwiLFxuICAgICAgICByZWxvYWREYXRhOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvR2V0TGlzdERhdGFcIixcbiAgICAgICAgZ2V0U2luZ2xlRGF0YTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRmxvd01vZGVsL0dldERldGFpbERhdGFcIixcbiAgICAgICAgZGVsZXRlOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvRGVsZXRlTW9kZWxcIixcbiAgICAgICAgbW92ZTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRmxvd01vZGVsL01vdmVcIixcbiAgICAgICAgZGVmYXVsdEZsb3dNb2RlbEltYWdlOiBcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvR2V0UHJvY2Vzc01vZGVsTWFpbkltZ1wiXG4gICAgICB9LFxuICAgICAgaWRGaWVsZE5hbWU6IFwibW9kZWxJZFwiLFxuICAgICAgc2VhcmNoQ29uZGl0aW9uOiB7XG4gICAgICAgIG1vZGVsTW9kdWxlSWQ6IHtcbiAgICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgICB0eXBlOiBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5TdHJpbmdUeXBlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICB0eXBlOiAnc2VsZWN0aW9uJyxcbiAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfnvJblj7cnLFxuICAgICAgICBrZXk6ICdtb2RlbENvZGUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgd2lkdGg6IDgwXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5rWB56iL5ZCN56ewJyxcbiAgICAgICAga2V5OiAnbW9kZWxOYW1lJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflkK/liqhLZXknLFxuICAgICAgICBrZXk6ICdtb2RlbFN0YXJ0S2V5JyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflpIfms6gnLFxuICAgICAgICBrZXk6ICdtb2RlbERlc2MnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+e8lui+keaXtumXtCcsXG4gICAgICAgIGtleTogJ21vZGVsVXBkYXRlVGltZScsXG4gICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVSZW5kZXJlci5Ub0RhdGVZWVlZX01NX0REKGgsIHBhcmFtcy5yb3cubW9kZWxVcGRhdGVUaW1lKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgIGtleTogJ21vZGVsSWQnLFxuICAgICAgICB3aWR0aDogMTQwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICB9LCBbd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAuZWRpdE1vZGVsQnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wKSwgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAudmlld01vZGVsQnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wKSwgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5FZGl0QnV0dG9uKGgsIHBhcmFtcywgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXAuaWRGaWVsZE5hbWUsIHdpbmRvdy5fbW9kdWxlbGlzdGZsb3djb21wKSwgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5EZWxldGVCdXR0b24oaCwgcGFyYW1zLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcC5pZEZpZWxkTmFtZSwgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXApXSk7XG4gICAgICAgIH1cbiAgICAgIH1dLFxuICAgICAgdGFibGVEYXRhOiBbXSxcbiAgICAgIHRhYmxlRGF0YU9yaWdpbmFsOiBbXSxcbiAgICAgIHNlbGVjdGlvblJvd3M6IG51bGwsXG4gICAgICBwYWdlVG90YWw6IDAsXG4gICAgICBwYWdlU2l6ZTogNTAwLFxuICAgICAgcGFnZU51bTogMSxcbiAgICAgIHNlYXJjaFRleHQ6IFwiXCIsXG4gICAgICBmbG93TW9kZWxFbnRpdHk6IHtcbiAgICAgICAgbW9kZWxJZDogXCJcIixcbiAgICAgICAgbW9kZWxEZUlkOiBcIlwiLFxuICAgICAgICBtb2RlbE1vZHVsZUlkOiBcIlwiLFxuICAgICAgICBtb2RlbEdyb3VwSWQ6IFwiXCIsXG4gICAgICAgIG1vZGVsTmFtZTogXCJcIixcbiAgICAgICAgbW9kZWxDcmVhdGVUaW1lOiBEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YSgpLFxuICAgICAgICBtb2RlbENyZWF0ZXI6IFwiXCIsXG4gICAgICAgIG1vZGVsVXBkYXRlVGltZTogRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGEoKSxcbiAgICAgICAgbW9kZWxVcGRhdGVyOiBcIlwiLFxuICAgICAgICBtb2RlbERlc2M6IFwiXCIsXG4gICAgICAgIG1vZGVsU3RhdHVzOiBcIuWQr+eUqFwiLFxuICAgICAgICBtb2RlbE9yZGVyTnVtOiBcIlwiLFxuICAgICAgICBtb2RlbERlcGxveW1lbnRJZDogXCJcIixcbiAgICAgICAgbW9kZWxTdGFydEtleTogXCJcIixcbiAgICAgICAgbW9kZWxSZXNvdXJjZU5hbWU6IFwiXCIsXG4gICAgICAgIG1vZGVsRnJvbVR5cGU6IFwiXCIsXG4gICAgICAgIG1vZGVsTWFpbkltYWdlSWQ6IFwiRGVmTW9kZWxNYWluSW1hZ2VJZFwiXG4gICAgICB9LFxuICAgICAgZW1wdHlGbG93TW9kZWxFbnRpdHk6IHt9LFxuICAgICAgaW1wb3J0RVhEYXRhOiB7XG4gICAgICAgIG1vZGVsTW9kdWxlSWQ6IFwiXCJcbiAgICAgIH0sXG4gICAgICBydWxlVmFsaWRhdGU6IHtcbiAgICAgICAgbW9kZWxOYW1lOiBbe1xuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6ICfjgJDmqKHlnovlkI3np7DjgJHkuI3og73nqbrvvIEnLFxuICAgICAgICAgIHRyaWdnZXI6ICdibHVyJ1xuICAgICAgICB9XSxcbiAgICAgICAgbW9kZWxTdGFydEtleTogW3tcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAn44CQ5qih5Z6LS2V544CR5LiN6IO956m677yBJyxcbiAgICAgICAgICB0cmlnZ2VyOiAnYmx1cidcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0Rmxvd01vZGVsSW1hZ2VTcmM6IFwiXCIsXG4gICAgICB2YWx1ZTE6IGZhbHNlXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcCA9IHRoaXM7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5mbG93TW9kZWxFbnRpdHkpIHtcbiAgICAgIHRoaXMuZW1wdHlGbG93TW9kZWxFbnRpdHlba2V5XSA9IHRoaXMuZmxvd01vZGVsRW50aXR5W2tleV07XG4gICAgfVxuICB9LFxuICB3YXRjaDoge1xuICAgIG1vZHVsZURhdGE6IGZ1bmN0aW9uIG1vZHVsZURhdGEobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGFjdGl2ZVRhYk5hbWU6IGZ1bmN0aW9uIGFjdGl2ZVRhYk5hbWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIHNlYXJjaFRleHQ6IGZ1bmN0aW9uIHNlYXJjaFRleHQobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgIHZhciBmaWx0ZXJUYWJsZURhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGVEYXRhW2ldO1xuXG4gICAgICAgICAgaWYgKHJvdy5tb2RlbENvZGUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyb3cubW9kZWxOYW1lLmluZGV4T2YobmV3VmFsKSA+PSAwKSB7XG4gICAgICAgICAgICBmaWx0ZXJUYWJsZURhdGEucHVzaChyb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gZmlsdGVyVGFibGVEYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50YWJsZURhdGEgPSB0aGlzLnRhYmxlRGF0YU9yaWdpbmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZShkaWFsb2dJZCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhkaWFsb2dJZCk7XG4gICAgfSxcbiAgICBnZXRNb2R1bGVOYW1lOiBmdW5jdGlvbiBnZXRNb2R1bGVOYW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kdWxlRGF0YSA9PSBudWxsID8gXCLor7fpgInkuK3mqKHlnZdcIiA6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVUZXh0O1xuICAgIH0sXG4gICAgc3RhdHVzRW5hYmxlOiBmdW5jdGlvbiBzdGF0dXNFbmFibGUoc3RhdHVzTmFtZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh0aGlzLmFjSW50ZXJmYWNlLnN0YXR1c0NoYW5nZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCBhcHBMaXN0LmlkRmllbGROYW1lLCBzdGF0dXNOYW1lLCBhcHBMaXN0KTtcbiAgICB9LFxuICAgIG1vdmU6IGZ1bmN0aW9uIG1vdmUodHlwZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3TW92ZUZhY2UodGhpcy5hY0ludGVyZmFjZS5tb3ZlLCB0aGlzLnNlbGVjdGlvblJvd3MsIHRoaXMuaWRGaWVsZE5hbWUsIHR5cGUsIHRoaXMpO1xuICAgIH0sXG4gICAgc2VsZWN0aW9uQ2hhbmdlOiBmdW5jdGlvbiBzZWxlY3Rpb25DaGFuZ2Uoc2VsZWN0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBzZWxlY3Rpb247XG4gICAgfSxcbiAgICByZWxvYWREYXRhOiBmdW5jdGlvbiByZWxvYWREYXRhKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsICYmIHRoaXMuYWN0aXZlVGFiTmFtZSA9PSBcImxpc3QtZmxvd1wiKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLm1vZGVsTW9kdWxlSWQudmFsdWUgPSB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWQ7XG4gICAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlTG9hZERhdGFTZWFyY2godGhpcy5hY0ludGVyZmFjZS5yZWxvYWREYXRhLCB0aGlzLnBhZ2VOdW0sIHRoaXMucGFnZVNpemUsIHRoaXMuc2VhcmNoQ29uZGl0aW9uLCB0aGlzLCB0aGlzLmlkRmllbGROYW1lLCB0cnVlLCBmdW5jdGlvbiAocmVzdWx0LCBwYWdlQXBwT2JqKSB7XG4gICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFPcmlnaW5hbCA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIERldGFpbFBhZ2VVdGlsaXR5Lk92ZXJyaWRlT2JqZWN0VmFsdWVGdWxsKHRoaXMuZmxvd01vZGVsRW50aXR5LCB0aGlzLmVtcHR5Rmxvd01vZGVsRW50aXR5KTtcbiAgICAgICAgdGhpcy5kZWZhdWx0Rmxvd01vZGVsSW1hZ2VTcmMgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLmFjSW50ZXJmYWNlLmRlZmF1bHRGbG93TW9kZWxJbWFnZSwge1xuICAgICAgICAgIGZpbGVJZDogXCJkZWZhdWx0Rmxvd01vZGVsSW1hZ2VcIlxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtKFwiZGl2TmV3Rmxvd01vZGVsV3JhcFwiLCB7XG4gICAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgICAgd2lkdGg6IDY3MCxcbiAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICB0aXRsZTogXCLliJvlu7rmtYHnqIvmqKHlnotcIlxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqeaooeWdlyFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBlZGl0OiBmdW5jdGlvbiBlZGl0KHJlY29yZElkKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBfc2VsZi4kcmVmc1tcImZsb3dNb2RlbEVudGl0eVwiXS5yZXNldEZpZWxkcygpO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0U2luZ2xlRGF0YSwge1xuICAgICAgICByZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICAgIG9wOiBcImVkaXRcIlxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBEZXRhaWxQYWdlVXRpbGl0eS5PdmVycmlkZU9iamVjdFZhbHVlRnVsbChfc2VsZi5mbG93TW9kZWxFbnRpdHksIHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICBfc2VsZi5kZWZhdWx0Rmxvd01vZGVsSW1hZ2VTcmMgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbihfc2VsZi5hY0ludGVyZmFjZS5kZWZhdWx0Rmxvd01vZGVsSW1hZ2UsIHtcbiAgICAgICAgICAgIGZpbGVJZDogX3NlbGYuZmxvd01vZGVsRW50aXR5Lm1vZGVsTWFpbkltYWdlSWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW0oXCJkaXZOZXdGbG93TW9kZWxXcmFwXCIsIHtcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICAgICAgdGl0bGU6IFwi57yW6L6R5rWB56iL5qih5Z6L5qaC5Ya1XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICBkZWw6IGZ1bmN0aW9uIGRlbChyZWNvcmRJZCkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVEZWxldGVSb3codGhpcy5hY0ludGVyZmFjZS5kZWxldGUsIHJlY29yZElkLCB0aGlzKTtcbiAgICB9LFxuICAgIGhhbmRsZVN1Ym1pdEZsb3dNb2RlbEVkaXQ6IGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdEZsb3dNb2RlbEVkaXQobmFtZSkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgdGhpcy4kcmVmc1tuYW1lXS52YWxpZGF0ZShmdW5jdGlvbiAodmFsaWQpIHtcbiAgICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgICAgX3NlbGYuZmxvd01vZGVsRW50aXR5Lm1vZGVsTW9kdWxlSWQgPSBfc2VsZi5tb2R1bGVEYXRhLm1vZHVsZUlkO1xuXG4gICAgICAgICAgdmFyIF9kZXNpZ25Nb2RlbCA9IF9zZWxmLmZsb3dNb2RlbEVudGl0eS5tb2RlbElkID09IFwiXCIgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAgICAgICB2YXIgc2VuZERhdGEgPSBKU09OLnN0cmluZ2lmeShfc2VsZi5mbG93TW9kZWxFbnRpdHkpO1xuICAgICAgICAgIEFqYXhVdGlsaXR5LlBvc3RSZXF1ZXN0Qm9keShfc2VsZi5hY0ludGVyZmFjZS5zYXZlTW9kZWwsIHNlbmREYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgX3NlbGYuaGFuZGxlQ2xvc2UoXCJkaXZOZXdGbG93TW9kZWxXcmFwXCIpO1xuXG4gICAgICAgICAgICAgIF9zZWxmLnJlbG9hZERhdGEoKTtcblxuICAgICAgICAgICAgICBpZiAoX2Rlc2lnbk1vZGVsKSB7XG4gICAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3V2luZG93KHdpbmRvdywgXCJlZGl0TW9kZWxXZWJXaW5kb3dcIiwgcmVzdWx0LmRhdGEuZWRpdE1vZGVsV2ViVXJsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuJE1lc3NhZ2UuZXJyb3IoJ0ZhaWwhJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgaW1wb3J0TW9kZWw6IGZ1bmN0aW9uIGltcG9ydE1vZGVsKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIERldGFpbFBhZ2VVdGlsaXR5Lk92ZXJyaWRlT2JqZWN0VmFsdWVGdWxsKHRoaXMuZmxvd01vZGVsRW50aXR5LCB0aGlzLmVtcHR5Rmxvd01vZGVsRW50aXR5KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtKFwiZGl2SW1wb3J0Rmxvd01vZGVsV3JhcFwiLCB7XG4gICAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgICAgICB0aXRsZTogXCLlr7zlhaXmtYHnqIvmqKHlnotcIlxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieaLqeaooeWdlyFcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGxvYWRTdWNjZXNzOiBmdW5jdGlvbiB1cGxvYWRTdWNjZXNzKHJlc3BvbnNlLCBmaWxlLCBmaWxlTGlzdCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3BvbnNlLm1lc3NhZ2UsIG51bGwpO1xuXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2VzcyA9PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoJ2RpdkltcG9ydEZsb3dNb2RlbFdyYXAnKTtcbiAgICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBiaW5kVXBsb2FkRXhEYXRhOiBmdW5jdGlvbiBiaW5kVXBsb2FkRXhEYXRhKCkge1xuICAgICAgdGhpcy5pbXBvcnRFWERhdGEubW9kZWxNb2R1bGVJZCA9IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZDtcbiAgICB9LFxuICAgIHVwbG9hZEZsb3dNb2RlbEltYWdlU3VjY2VzczogZnVuY3Rpb24gdXBsb2FkRmxvd01vZGVsSW1hZ2VTdWNjZXNzKHJlc3BvbnNlLCBmaWxlLCBmaWxlTGlzdCkge1xuICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgdGhpcy5mbG93TW9kZWxFbnRpdHkubW9kZWxNYWluSW1hZ2VJZCA9IGRhdGEuZmlsZUlkO1xuICAgICAgdGhpcy5kZWZhdWx0Rmxvd01vZGVsSW1hZ2VTcmMgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLmFjSW50ZXJmYWNlLmRlZmF1bHRGbG93TW9kZWxJbWFnZSwge1xuICAgICAgICBmaWxlSWQ6IHRoaXMuZmxvd01vZGVsRW50aXR5Lm1vZGVsTWFpbkltYWdlSWRcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZWRpdE1vZGVsQnV0dG9uOiBmdW5jdGlvbiBlZGl0TW9kZWxCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZWRpdC1tb2RlbFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouZWRpdE1vZGVsKHBhcmFtcy5yb3dbaWRGaWVsZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICB2aWV3TW9kZWxCdXR0b246IGZ1bmN0aW9uIHZpZXdNb2RlbEJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiB2aWV3LW1vZGVsXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai52aWV3TW9kZWwocGFyYW1zLnJvd1tpZEZpZWxkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGVkaXRNb2RlbDogZnVuY3Rpb24gZWRpdE1vZGVsKHJlY29yZElkKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0RWRpdE1vZGVsVVJMLCB7XG4gICAgICAgIG1vZGVsSWQ6IHJlY29yZElkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHJlc3VsdC5kYXRhLmVkaXRNb2RlbFdlYlVybCwge1xuICAgICAgICAgIHRpdGxlOiBcIua1geeoi+iuvuiuoVwiLFxuICAgICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICAgIH0sIDApO1xuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgdmlld01vZGVsOiBmdW5jdGlvbiB2aWV3TW9kZWwocmVjb3JkSWQpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRWaWV3TW9kZWxVUkwsIHtcbiAgICAgICAgbW9kZWxJZDogcmVjb3JkSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgcmVzdWx0LmRhdGEuZWRpdE1vZGVsV2ViVXJsLCB7XG4gICAgICAgICAgdGl0bGU6IFwi5rWB56iL5rWP6KeIXCIsXG4gICAgICAgICAgbW9kYWw6IHRydWVcbiAgICAgICAgfSwgMCk7XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtb2R1bGUtbGlzdC13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTogbm9uZVwiIGlkPVwiZGl2TmV3Rmxvd01vZGVsV3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJnZW5lcmFsLWVkaXQtcGFnZS13cmFwXCIgc3R5bGU9XCJwYWRkaW5nOiAxMHB4O3dpZHRoOiAxMDAlXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogNzAlO2Zsb2F0OiBsZWZ0XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1mb3JtIHJlZj1cImZsb3dNb2RlbEVudGl0eVwiIDptb2RlbD1cImZsb3dNb2RlbEVudGl0eVwiIDpydWxlcz1cInJ1bGVWYWxpZGF0ZVwiIDpsYWJlbC13aWR0aD1cIjEwMFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XCLmqKHlnovlkI3np7DvvJpcIiBwcm9wPVwibW9kZWxOYW1lXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XCJmbG93TW9kZWxFbnRpdHkubW9kZWxOYW1lXCI+PC9pLWlucHV0PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XCLmqKHlnotLZXnvvJpcIiBwcm9wPVwibW9kZWxTdGFydEtleVwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVwiZmxvd01vZGVsRW50aXR5Lm1vZGVsU3RhcnRLZXlcIj48L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cIuaPj+i/sO+8mlwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVwiZmxvd01vZGVsRW50aXR5Lm1vZGVsRGVzY1wiIHR5cGU9XCJ0ZXh0YXJlYVwiIDphdXRvc2l6ZT1cInttaW5Sb3dzOiAxMSxtYXhSb3dzOiAxMX1cIj48L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktZm9ybT5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogMjklO2Zsb2F0OiByaWdodFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIDpzcmM9XCJkZWZhdWx0Rmxvd01vZGVsSW1hZ2VTcmNcIiBjbGFzcz1cImZsb3dNb2RlbEltZ1wiIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1cGxvYWQgc3R5bGU9XCJtYXJnaW46MTBweCAxMnB4IDAgMjBweFwiIDpkYXRhPVwiaW1wb3J0RVhEYXRhXCIgOmJlZm9yZS11cGxvYWQ9XCJiaW5kVXBsb2FkRXhEYXRhXCIgOm9uLXN1Y2Nlc3M9XCJ1cGxvYWRGbG93TW9kZWxJbWFnZVN1Y2Nlc3NcIiBtdWx0aXBsZSB0eXBlPVwiZHJhZ1wiIG5hbWU9XCJmaWxlXCIgYWN0aW9uPVwiLi4vLi4vLi4vUGxhdEZvcm1SZXN0L0J1aWxkZXIvRmxvd01vZGVsL1VwbG9hZFByb2Nlc3NNb2RlbE1haW5JbWcuZG9cIiBhY2NlcHQ9XCIucG5nXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cInBhZGRpbmc6MjBweCAwcHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGljb24gdHlwZT1cImlvcy1jbG91ZC11cGxvYWRcIiBzaXplPVwiNTJcIiBzdHlsZT1cImNvbG9yOiAjMzM5OWZmXCI+PC9pY29uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD7kuIrkvKDmtYHnqIvkuLvpopjlm77niYc8L3A+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VwbG9hZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tb3V0ZXItd3JhcFwiIHN0eWxlPVwiaGVpZ2h0OiA0MHB4O3BhZGRpbmctcmlnaHQ6IDEwcHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24taW5uZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cImhhbmRsZVN1Ym1pdEZsb3dNb2RlbEVkaXQoXFwnZmxvd01vZGVsRW50aXR5XFwnKVwiPiDkv50g5a2YPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cImhhbmRsZUNsb3NlKFxcJ2Rpdk5ld0Zsb3dNb2RlbFdyYXBcXCcpXCI+5YWzIOmXrTwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgaWQ9XCJkaXZJbXBvcnRGbG93TW9kZWxXcmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcIiBzdHlsZT1cInBhZGRpbmc6IDEwcHhcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVwbG9hZCA6ZGF0YT1cImltcG9ydEVYRGF0YVwiIDpiZWZvcmUtdXBsb2FkPVwiYmluZFVwbG9hZEV4RGF0YVwiIDpvbi1zdWNjZXNzPVwidXBsb2FkU3VjY2Vzc1wiIG11bHRpcGxlIHR5cGU9XCJkcmFnXCIgbmFtZT1cImZpbGVcIiBhY3Rpb249XCIuLi8uLi8uLi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9GbG93TW9kZWwvSW1wb3J0UHJvY2Vzc01vZGVsLmRvXCIgYWNjZXB0PVwiLmJwbW5cIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJwYWRkaW5nOiAyMHB4IDBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aWNvbiB0eXBlPVwiaW9zLWNsb3VkLXVwbG9hZFwiIHNpemU9XCI1MlwiIHN0eWxlPVwiY29sb3I6ICMzMzk5ZmZcIj48L2ljb24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+Q2xpY2sgb3IgZHJhZyBmaWxlcyBoZXJlIHRvIHVwbG9hZDwvcD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VwbG9hZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1vdXRlci13cmFwXCIgc3R5bGU9XCJoZWlnaHQ6IDQwcHg7cGFkZGluZy1yaWdodDogMTBweFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbi1pbm5lci13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbi1ncm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIEBjbGljaz1cImhhbmRsZUNsb3NlKFxcJ2RpdkltcG9ydEZsb3dNb2RlbFdyYXBcXCcpXCI+5YWzIOmXrTwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0LWJ1dHRvbi13cmFwXCIgY2xhc3M9XCJsaXN0LWJ1dHRvbi1vdXRlci13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZHVsZS1saXN0LW5hbWVcIj48SWNvbiB0eXBlPVwiaW9zLWFycm93LWRyb3ByaWdodC1jaXJjbGVcIiAvPiZuYnNwO+aooeWdl+OAkHt7Z2V0TW9kdWxlTmFtZSgpfX3jgJE8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1idXR0b24taW5uZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uR3JvdXA+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gIHR5cGU9XCJzdWNjZXNzXCIgQGNsaWNrPVwiYWRkKClcIiBpY29uPVwibWQtYWRkXCI+5paw5aKePC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cImltcG9ydE1vZGVsKClcIiBpY29uPVwibWQtYWRkXCI+5LiK5Lyg5qih5Z6LIDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLWFsYnVtc1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPuWkjeWItjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLWJvb2ttYXJrc1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPuWOhuWPsuaooeWeizwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLWJydXNoXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+5aSN5Yi2SUQ8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwibW92ZShcXCd1cFxcJylcIiBpY29uPVwibWQtYXJyb3ctdXBcIj7kuIrnp7s8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwibW92ZShcXCdkb3duXFwnKVwiIGljb249XCJtZC1hcnJvdy1kb3duXCI+5LiL56e7PC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b25Hcm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiAyMDBweDttYXJnaW4tcmlnaHQ6IDEwcHg7XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cImlucHV0X2JvcmRlcl9ib3R0b21cIiB2LW1vZGVsPVwic2VhcmNoVGV4dFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImNsZWFyOiBib3RoXCI+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XCJsaXN0SGVpZ2h0XCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cImNvbHVtbnNDb25maWdcIiA6ZGF0YT1cInRhYmxlRGF0YVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIml2LWxpc3QtdGFibGVcIiA6aGlnaGxpZ2h0LXJvdz1cInRydWVcIlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XCJzZWxlY3Rpb25DaGFuZ2VcIj48L2ktdGFibGU+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwibW9kdWxlLWxpc3Qtd2ViZm9ybS1jb21wXCIsIHtcbiAgcHJvcHM6IFsnbGlzdEhlaWdodCcsICdtb2R1bGVEYXRhJywgJ2FjdGl2ZVRhYk5hbWUnXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGVkaXRWaWV3OiBcIi9IVE1ML0J1aWxkZXIvRm9ybS9Gb3JtRGVzaWduLmh0bWxcIixcbiAgICAgICAgcmVsb2FkRGF0YTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRm9ybS9HZXRMaXN0RGF0YVwiLFxuICAgICAgICBkZWxldGU6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zvcm0vRGVsZXRlXCIsXG4gICAgICAgIG1vdmU6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zvcm0vTW92ZVwiXG4gICAgICB9LFxuICAgICAgaWRGaWVsZE5hbWU6IFwiZm9ybUlkXCIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IHtcbiAgICAgICAgZm9ybU1vZHVsZUlkOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW5Y+3JyxcbiAgICAgICAga2V5OiAnZm9ybUNvZGUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgd2lkdGg6IDgwXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn6KGo5Y2V5ZCN56ewJyxcbiAgICAgICAga2V5OiAnZm9ybU5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+WUr+S4gOWQjScsXG4gICAgICAgIGtleTogJ2Zvcm1TaW5nbGVOYW1lJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflpIfms6gnLFxuICAgICAgICBrZXk6ICdmb3JtRGVzYycsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW6L6R5pe26Ze0JyxcbiAgICAgICAga2V5OiAnZm9ybVVwZGF0ZVRpbWUnLFxuICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlUmVuZGVyZXIuVG9EYXRlWVlZWV9NTV9ERChoLCBwYXJhbXMucm93LmZvcm1VcGRhdGVUaW1lKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgIGtleTogJ2Zvcm1JZCcsXG4gICAgICAgIHdpZHRoOiAxMjAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCBfc2VsZi5pZEZpZWxkTmFtZSwgX3NlbGYpLCBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkRlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIF9zZWxmLmlkRmllbGROYW1lLCBfc2VsZildKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgdGFibGVEYXRhT3JpZ2luYWw6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiA1MDAsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgc2VhcmNoVGV4dDogXCJcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgd2luZG93Ll9tb2R1bGVsaXN0d2ViZm9ybWNvbXAgPSB0aGlzO1xuICB9LFxuICB3YXRjaDoge1xuICAgIG1vZHVsZURhdGE6IGZ1bmN0aW9uIG1vZHVsZURhdGEobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIGFjdGl2ZVRhYk5hbWU6IGZ1bmN0aW9uIGFjdGl2ZVRhYk5hbWUobmV3VmFsKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9LFxuICAgIHNlYXJjaFRleHQ6IGZ1bmN0aW9uIHNlYXJjaFRleHQobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgIHZhciBmaWx0ZXJUYWJsZURhdGEgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJvdyA9IHRoaXMudGFibGVEYXRhW2ldO1xuXG4gICAgICAgICAgaWYgKHJvdy5mb3JtQ29kZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5mb3JtTmFtZS5pbmRleE9mKG5ld1ZhbCkgPj0gMCkge1xuICAgICAgICAgICAgZmlsdGVyVGFibGVEYXRhLnB1c2gocm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IGZpbHRlclRhYmxlRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRhID0gdGhpcy50YWJsZURhdGFPcmlnaW5hbDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRNb2R1bGVOYW1lOiBmdW5jdGlvbiBnZXRNb2R1bGVOYW1lKCkge1xuICAgICAgcmV0dXJuIHRoaXMubW9kdWxlRGF0YSA9PSBudWxsID8gXCLor7fpgInkuK3mqKHlnZdcIiA6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVUZXh0O1xuICAgIH0sXG4gICAgc2VsZWN0aW9uQ2hhbmdlOiBmdW5jdGlvbiBzZWxlY3Rpb25DaGFuZ2Uoc2VsZWN0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvblJvd3MgPSBzZWxlY3Rpb247XG4gICAgfSxcbiAgICByZWxvYWREYXRhOiBmdW5jdGlvbiByZWxvYWREYXRhKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsICYmIHRoaXMuYWN0aXZlVGFiTmFtZSA9PSBcImxpc3Qtd2ViZm9ybVwiKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmZvcm1Nb2R1bGVJZC52YWx1ZSA9IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZDtcbiAgICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVMb2FkRGF0YVNlYXJjaCh0aGlzLmFjSW50ZXJmYWNlLnJlbG9hZERhdGEsIHRoaXMucGFnZU51bSwgdGhpcy5wYWdlU2l6ZSwgdGhpcy5zZWFyY2hDb25kaXRpb24sIHRoaXMsIHRoaXMuaWRGaWVsZE5hbWUsIHRydWUsIGZ1bmN0aW9uIChyZXN1bHQsIHBhZ2VBcHBPYmopIHtcbiAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YU9yaWdpbmFsID0gcmVzdWx0LmRhdGEubGlzdDtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbiBhZGQoKSB7XG4gICAgICBpZiAodGhpcy5tb2R1bGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLmFjSW50ZXJmYWNlLmVkaXRWaWV3LCB7XG4gICAgICAgICAgXCJvcFwiOiBcImFkZFwiLFxuICAgICAgICAgIFwibW9kdWxlSWRcIjogdGhpcy5tb2R1bGVEYXRhLm1vZHVsZUlkXG4gICAgICAgIH0pO1xuICAgICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5OZXdXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgfSwgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInmi6nmqKHlnZchXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChyZWNvcmRJZCkge1xuICAgICAgZGVidWdnZXI7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuYWNJbnRlcmZhY2UuZWRpdFZpZXcsIHtcbiAgICAgICAgXCJvcFwiOiBcInVwZGF0ZVwiLFxuICAgICAgICBcInJlY29yZElkXCI6IHJlY29yZElkXG4gICAgICB9KTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3Blbk5ld1dpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gZGVsKHJlY29yZElkKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZURlbGV0ZVJvdyh0aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZSwgcmVjb3JkSWQsIHRoaXMpO1xuICAgIH0sXG4gICAgc3RhdHVzRW5hYmxlOiBmdW5jdGlvbiBzdGF0dXNFbmFibGUoc3RhdHVzTmFtZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh0aGlzLmFjSW50ZXJmYWNlLnN0YXR1c0NoYW5nZSwgdGhpcy5zZWxlY3Rpb25Sb3dzLCBhcHBMaXN0LmlkRmllbGROYW1lLCBzdGF0dXNOYW1lLCBhcHBMaXN0KTtcbiAgICB9LFxuICAgIG1vdmU6IGZ1bmN0aW9uIG1vdmUodHlwZSkge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3TW92ZUZhY2UodGhpcy5hY0ludGVyZmFjZS5tb3ZlLCB0aGlzLnNlbGVjdGlvblJvd3MsIHRoaXMuaWRGaWVsZE5hbWUsIHR5cGUsIHRoaXMpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibW9kdWxlLWxpc3Qtd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3QtYnV0dG9uLXdyYXBcIiBjbGFzcz1cImxpc3QtYnV0dG9uLW91dGVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kdWxlLWxpc3QtbmFtZVwiPjxJY29uIHR5cGU9XCJpb3MtYXJyb3ctZHJvcHJpZ2h0LWNpcmNsZVwiIC8+Jm5ic3A75qih5Z2X44CQe3tnZXRNb2R1bGVOYW1lKCl9feOAkTwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0LWJ1dHRvbi1pbm5lci13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiAgdHlwZT1cInN1Y2Nlc3NcIiBAY2xpY2s9XCJhZGQoKVwiIGljb249XCJtZC1hZGRcIj7mlrDlop48L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgZGlzYWJsZWQgaWNvbj1cIm1kLWFkZFwiPuW8leWFpVVSTCA8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgZGlzYWJsZWQgaWNvbj1cIm1kLWFsYnVtc1wiPuWkjeWItjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBkaXNhYmxlZCBpY29uPVwibWQtcHJpY2V0YWdcIj7pooTop4g8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgZGlzYWJsZWQgaWNvbj1cIm1kLWJvb2ttYXJrc1wiPuWOhuWPsueJiOacrDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBkaXNhYmxlZCBpY29uPVwibWQtYnJ1c2hcIj7lpI3liLZJRDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ3VwXFwnKVwiIGljb249XCJtZC1hcnJvdy11cFwiPuS4iuenuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ2Rvd25cXCcpXCIgaWNvbj1cIm1kLWFycm93LWRvd25cIj7kuIvnp7s8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiAyMDBweDttYXJnaW4tcmlnaHQ6IDEwcHg7XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cImlucHV0X2JvcmRlcl9ib3R0b21cIiB2LW1vZGVsPVwic2VhcmNoVGV4dFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImNsZWFyOiBib3RoXCI+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XCJsaXN0SGVpZ2h0XCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cImNvbHVtbnNDb25maWdcIiA6ZGF0YT1cInRhYmxlRGF0YVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIml2LWxpc3QtdGFibGVcIiA6aGlnaGxpZ2h0LXJvdz1cInRydWVcIlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XCJzZWxlY3Rpb25DaGFuZ2VcIj48L2ktdGFibGU+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwibW9kdWxlLWxpc3Qtd2VibGlzdC1jb21wXCIsIHtcbiAgcHJvcHM6IFsnbGlzdEhlaWdodCcsICdtb2R1bGVEYXRhJywgJ2FjdGl2ZVRhYk5hbWUnXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGVkaXRWaWV3OiBcIi9IVE1ML0J1aWxkZXIvTGlzdC9MaXN0RGVzaWduLmh0bWxcIixcbiAgICAgICAgcmVsb2FkRGF0YTogXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvTGlzdC9HZXRMaXN0RGF0YVwiLFxuICAgICAgICBkZWxldGU6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0xpc3QvRGVsZXRlXCIsXG4gICAgICAgIG1vdmU6IFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0xpc3QvTW92ZVwiXG4gICAgICB9LFxuICAgICAgaWRGaWVsZE5hbWU6IFwibGlzdElkXCIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IHtcbiAgICAgICAgbGlzdE1vZHVsZUlkOiB7XG4gICAgICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICAgICAgdHlwZTogU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuU3RyaW5nVHlwZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgdHlwZTogJ3NlbGVjdGlvbicsXG4gICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW5Y+3JyxcbiAgICAgICAga2V5OiAnbGlzdENvZGUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgd2lkdGg6IDgwXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn5YiX6KGo5ZCN56ewJyxcbiAgICAgICAga2V5OiAnbGlzdE5hbWUnLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+WUr+S4gOWQjScsXG4gICAgICAgIGtleTogJ2xpc3RTaW5nbGVOYW1lJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICflpIfms6gnLFxuICAgICAgICBrZXk6ICdsaXN0RGVzYycsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICB9LCB7XG4gICAgICAgIHRpdGxlOiAn57yW6L6R5pe26Ze0JyxcbiAgICAgICAga2V5OiAnbGlzdFVwZGF0ZVRpbWUnLFxuICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlUmVuZGVyZXIuVG9EYXRlWVlZWV9NTV9ERChoLCBwYXJhbXMucm93Lmxpc3RVcGRhdGVUaW1lKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgIGtleTogJ2xpc3RJZCcsXG4gICAgICAgIHdpZHRoOiAxMjAsXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcihoLCBwYXJhbXMpIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uLXdyYXBcIlxuICAgICAgICAgIH0sIFtMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkVkaXRCdXR0b24oaCwgcGFyYW1zLCBfc2VsZi5pZEZpZWxkTmFtZSwgX3NlbGYpLCBMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUlubmVyQnV0dG9uLkRlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIF9zZWxmLmlkRmllbGROYW1lLCBfc2VsZildKTtcbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgICAgdGFibGVEYXRhT3JpZ2luYWw6IFtdLFxuICAgICAgc2VsZWN0aW9uUm93czogbnVsbCxcbiAgICAgIHBhZ2VUb3RhbDogMCxcbiAgICAgIHBhZ2VTaXplOiA1MDAsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgc2VhcmNoVGV4dDogXCJcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgd2F0Y2g6IHtcbiAgICBtb2R1bGVEYXRhOiBmdW5jdGlvbiBtb2R1bGVEYXRhKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBhY3RpdmVUYWJOYW1lOiBmdW5jdGlvbiBhY3RpdmVUYWJOYW1lKG5ld1ZhbCkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSxcbiAgICBzZWFyY2hUZXh0OiBmdW5jdGlvbiBzZWFyY2hUZXh0KG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICB2YXIgZmlsdGVyVGFibGVEYXRhID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciByb3cgPSB0aGlzLnRhYmxlRGF0YVtpXTtcblxuICAgICAgICAgIGlmIChyb3cuZm9ybUNvZGUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyb3cuZm9ybU5hbWUuaW5kZXhPZihuZXdWYWwpID49IDApIHtcbiAgICAgICAgICAgIGZpbHRlclRhYmxlRGF0YS5wdXNoKHJvdyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YWJsZURhdGEgPSBmaWx0ZXJUYWJsZURhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRhYmxlRGF0YSA9IHRoaXMudGFibGVEYXRhT3JpZ2luYWw7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgZ2V0TW9kdWxlTmFtZTogZnVuY3Rpb24gZ2V0TW9kdWxlTmFtZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vZHVsZURhdGEgPT0gbnVsbCA/IFwi6K+36YCJ5Lit5qih5Z2XXCIgOiB0aGlzLm1vZHVsZURhdGEubW9kdWxlVGV4dDtcbiAgICB9LFxuICAgIHNlbGVjdGlvbkNoYW5nZTogZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlKHNlbGVjdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb25Sb3dzID0gc2VsZWN0aW9uO1xuICAgIH0sXG4gICAgcmVsb2FkRGF0YTogZnVuY3Rpb24gcmVsb2FkRGF0YSgpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZURhdGEgIT0gbnVsbCAmJiB0aGlzLmFjdGl2ZVRhYk5hbWUgPT0gXCJsaXN0LXdlYmxpc3RcIikge1xuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5saXN0TW9kdWxlSWQudmFsdWUgPSB0aGlzLm1vZHVsZURhdGEubW9kdWxlSWQ7XG4gICAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlTG9hZERhdGFTZWFyY2godGhpcy5hY0ludGVyZmFjZS5yZWxvYWREYXRhLCB0aGlzLnBhZ2VOdW0sIHRoaXMucGFnZVNpemUsIHRoaXMuc2VhcmNoQ29uZGl0aW9uLCB0aGlzLCB0aGlzLmlkRmllbGROYW1lLCB0cnVlLCBmdW5jdGlvbiAocmVzdWx0LCBwYWdlQXBwT2JqKSB7XG4gICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFPcmlnaW5hbCA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKCkge1xuICAgICAgaWYgKHRoaXMubW9kdWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICAgIFwib3BcIjogXCJhZGRcIixcbiAgICAgICAgICBcIm1vZHVsZUlkXCI6IHRoaXMubW9kdWxlRGF0YS5tb2R1bGVJZFxuICAgICAgICB9KTtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3V2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgIH0sIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5oup5qih5Z2XIVwiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGVkaXQ6IGZ1bmN0aW9uIGVkaXQocmVjb3JkSWQpIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5hY0ludGVyZmFjZS5lZGl0Vmlldywge1xuICAgICAgICBcIm9wXCI6IFwidXBkYXRlXCIsXG4gICAgICAgIFwicmVjb3JkSWRcIjogcmVjb3JkSWRcbiAgICAgIH0pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuTmV3V2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDBcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiBkZWwocmVjb3JkSWQpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlRGVsZXRlUm93KHRoaXMuYWNJbnRlcmZhY2UuZGVsZXRlLCByZWNvcmRJZCwgdGhpcyk7XG4gICAgfSxcbiAgICBzdGF0dXNFbmFibGU6IGZ1bmN0aW9uIHN0YXR1c0VuYWJsZShzdGF0dXNOYW1lKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHRoaXMuYWNJbnRlcmZhY2Uuc3RhdHVzQ2hhbmdlLCB0aGlzLnNlbGVjdGlvblJvd3MsIGFwcExpc3QuaWRGaWVsZE5hbWUsIHN0YXR1c05hbWUsIGFwcExpc3QpO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24gbW92ZSh0eXBlKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdNb3ZlRmFjZSh0aGlzLmFjSW50ZXJmYWNlLm1vdmUsIHRoaXMuc2VsZWN0aW9uUm93cywgdGhpcy5pZEZpZWxkTmFtZSwgdHlwZSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJtb2R1bGUtbGlzdC13cmFwXCI+XFxcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibGlzdC1idXR0b24td3JhcFwiIGNsYXNzPVwibGlzdC1idXR0b24tb3V0ZXItd3JhcFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2R1bGUtbGlzdC1uYW1lXCI+PEljb24gdHlwZT1cImlvcy1hcnJvdy1kcm9wcmlnaHQtY2lyY2xlXCIgLz4mbmJzcDvmqKHlnZfjgJB7e2dldE1vZHVsZU5hbWUoKX1944CRPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxpc3QtYnV0dG9uLWlubmVyLXdyYXBcIj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uICB0eXBlPVwic3VjY2Vzc1wiIEBjbGljaz1cImFkZCgpXCIgaWNvbj1cIm1kLWFkZFwiPuaWsOWinjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLWFsYnVtc1wiPuWkjeWItjwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cImVycm9yXCIgaWNvbj1cIm1kLXByaWNldGFnXCI+6aKE6KeIPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYm9va21hcmtzXCI+5Y6G5Y+y54mI5pysPC9pLWJ1dHRvbj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVwiZXJyb3JcIiBpY29uPVwibWQtYnJ1c2hcIj7lpI3liLZJRDwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ3VwXFwnKVwiIGljb249XCJtZC1hcnJvdy11cFwiPuS4iuenuzwvaS1idXR0b24+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1idXR0b24gdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJtb3ZlKFxcJ2Rvd25cXCcpXCIgaWNvbj1cIm1kLWFycm93LWRvd25cIj7kuIvnp7s8L2ktYnV0dG9uPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbkdyb3VwPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O3dpZHRoOiAyMDBweDttYXJnaW4tcmlnaHQ6IDEwcHg7XCI+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHNlYXJjaCBjbGFzcz1cImlucHV0X2JvcmRlcl9ib3R0b21cIiB2LW1vZGVsPVwic2VhcmNoVGV4dFwiPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cImNsZWFyOiBib3RoXCI+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIDpoZWlnaHQ9XCJsaXN0SGVpZ2h0XCIgc3RyaXBlIGJvcmRlciA6Y29sdW1ucz1cImNvbHVtbnNDb25maWdcIiA6ZGF0YT1cInRhYmxlRGF0YVwiXFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIml2LWxpc3QtdGFibGVcIiA6aGlnaGxpZ2h0LXJvdz1cInRydWVcIlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9uLXNlbGVjdGlvbi1jaGFuZ2U9XCJzZWxlY3Rpb25DaGFuZ2VcIj48L2ktdGFibGU+XFxcclxuICAgICAgICAgICAgICAgIDwvZGl2Pidcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LW9yZ2FuLWNvbXBcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICBnZXRPcmdhbkRhdGFVcmw6IFwiL1BsYXRGb3JtUmVzdC9TU08vT3JnYW4vR2V0RnVsbE9yZ2FuXCJcbiAgICAgIH0sXG4gICAgICBqc0VkaXRvckluc3RhbmNlOiBudWxsLFxuICAgICAgb3JnYW5UcmVlOiB7XG4gICAgICAgIHRyZWVPYmo6IG51bGwsXG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY2hrU3R5bGU6IFwicmFkaW9cIixcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwib3JnYW5OYW1lXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwib3JnYW5JZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwib3JnYW5QYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBcIi0xXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZURhdGE6IG51bGwsXG4gICAgICAgIGNsaWNrTm9kZTogbnVsbFxuICAgICAgfSxcbiAgICAgIHNlYXJjaE9yZ2FuVGV4dDogXCJcIixcbiAgICAgIHNlbGVjdGVkT3JnYW5Db25maWc6IFt7XG4gICAgICAgIHRpdGxlOiAn57uE57uH5ZCN56ewJyxcbiAgICAgICAga2V5OiAnb3JnYW5OYW1lJyxcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICBrZXk6ICdvcmdhbklkJyxcbiAgICAgICAgd2lkdGg6IDY1LFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbi13cmFwXCJcbiAgICAgICAgICB9LCBbTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5EZWxldGVCdXR0b24oaCwgcGFyYW1zLCB3aW5kb3cuX21vZHVsZWxpc3RmbG93Y29tcC5pZEZpZWxkTmFtZSwgd2luZG93Ll9tb2R1bGVsaXN0Zmxvd2NvbXApXSk7XG4gICAgICAgIH1cbiAgICAgIH1dLFxuICAgICAgc2VsZWN0ZWRPcmdhbkRhdGE6IFtdXG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB0aGlzLmdldE9yZ2FuRGF0YUluaXRUcmVlKCk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBiZWdpblNlbGVjdE9yZ2FuOiBmdW5jdGlvbiBiZWdpblNlbGVjdE9yZ2FuKCkge1xuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnNlbGVjdE9yZ2FuTW9kZWxEaWFsb2dXcmFwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA2NzAsXG4gICAgICAgIGhlaWdodDogNTAwLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nnu4Tnu4fmnLrmnoRcIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRPcmdhbkRhdGFJbml0VHJlZTogZnVuY3Rpb24gZ2V0T3JnYW5EYXRhSW5pdFRyZWUoKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0T3JnYW5EYXRhVXJsLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBfc2VsZi5vcmdhblRyZWUudHJlZURhdGEgPSByZXN1bHQuZGF0YTtcblxuICAgICAgICAgIF9zZWxmLiRyZWZzLm9yZ2FuWlRyZWVVTC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNlbGVjdC1vcmdhbi1jb21wLVwiICsgU3RyaW5nVXRpbGl0eS5HdWlkKCkpO1xuXG4gICAgICAgICAgX3NlbGYub3JnYW5UcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChfc2VsZi4kcmVmcy5vcmdhblpUcmVlVUwpLCBfc2VsZi5vcmdhblRyZWUudHJlZVNldHRpbmcsIF9zZWxmLm9yZ2FuVHJlZS50cmVlRGF0YSk7XG5cbiAgICAgICAgICBfc2VsZi5vcmdhblRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG5cbiAgICAgICAgICBmdXp6eVNlYXJjaFRyZWVPYmooX3NlbGYub3JnYW5UcmVlLnRyZWVPYmosIF9zZWxmLiRyZWZzLnR4dF9vcmdhbl9zZWFyY2hfdGV4dC4kcmVmcy5pbnB1dCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgc2VsZWN0ZWRPcmdhbjogZnVuY3Rpb24gc2VsZWN0ZWRPcmdhbih0cmVlTm9kZSkge1xuICAgICAgaWYgKCF0cmVlTm9kZSkge31cblxuICAgICAgdGhpcy5zZWxlY3RlZE9yZ2FuRGF0YS5wdXNoKHRyZWVOb2RlKTtcbiAgICB9LFxuICAgIHJlbW92ZUFsbE9yZ2FuOiBmdW5jdGlvbiByZW1vdmVBbGxPcmdhbigpIHt9LFxuICAgIHJlbW92ZVNpbmdsZU9yZ2FuOiBmdW5jdGlvbiByZW1vdmVTaW5nbGVPcmdhbigpIHt9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3Qtdmlldy1vcmdhbi13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ0ZXh0XFxcIj5cXHU4QkY3XFx1OTAwOVxcdTYyRTlcXHU3RUM0XFx1N0VDNzwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInZhbHVlXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpZFxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uXFxcIiBAY2xpY2s9XFxcImJlZ2luU2VsZWN0T3JnYW4oKVxcXCI+PEljb24gdHlwZT1cXFwiaW9zLWZ1bm5lbFxcXCIgLz4mbmJzcDtcXHU5MDA5XFx1NjJFOTwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj1cXFwic2VsZWN0T3JnYW5Nb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJjMy1zZWxlY3QtbW9kZWwtd3JhcCBnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYzMtc2VsZWN0LW1vZGVsLXNvdXJjZS13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgc2VhcmNoIGNsYXNzPVxcXCJpbnB1dF9ib3JkZXJfYm90dG9tXFxcIiByZWY9XFxcInR4dF9vcmdhbl9zZWFyY2hfdGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcdThCRjdcXHU4RjkzXFx1NTE2NVxcdTdFQzRcXHU3RUM3XFx1NjczQVxcdTY3ODRcXHU1NDBEXFx1NzlGMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5uZXItd3JhcCBkaXYtY3VzdG9tLXNjcm9sbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgcmVmPVxcXCJvcmdhblpUcmVlVUxcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYzMtc2VsZWN0LW1vZGVsLWJ1dHRvbi13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidG9fc2VsZWN0ZWRfYnV0dG9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJY29uIHR5cGU9XFxcImlvcy1hcnJvdy1kcm9wcmlnaHQtY2lyY2xlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJY29uIHR5cGU9XFxcImlvcy1hcnJvdy1kcm9wbGVmdC1jaXJjbGVcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImMzLXNlbGVjdC1tb2RlbC1zZWxlY3RlZC13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0ZWQtdGl0bGVcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWRvbmUtYWxsXFxcIiAvPiBcXHU1REYyXFx1OTAwOVxcdTdFQzRcXHU3RUM3PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcIm1hcmdpbjogMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIHN0cmlwZSA6Y29sdW1ucz1cXFwic2VsZWN0ZWRPcmdhbkNvbmZpZ1xcXCIgOmRhdGE9XFxcInNlbGVjdGVkT3JnYW5EYXRhXFxcIiBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiIDpzaG93LWhlYWRlcj1cXFwiZmFsc2VcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6IDQwcHg7cGFkZGluZy1yaWdodDogMTBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiaGFuZGxlU3VibWl0Rmxvd01vZGVsRWRpdCgnZmxvd01vZGVsRW50aXR5JylcXFwiPiBcXHU0RkREIFxcdTVCNTg8L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKCdkaXZOZXdGbG93TW9kZWxXcmFwJylcXFwiPlxcdTUxNzMgXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic2VsZWN0LW9yZ2FuLXNpbmdsZS1jb21wXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgZ2V0T3JnYW5EYXRhVXJsOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL09yZ2FuL0dldEZ1bGxPcmdhblwiLFxuICAgICAgICBnZXRTaW5nbGVPcmdhbkRhdGFVcmw6IFwiL1BsYXRGb3JtUmVzdC9TU08vT3JnYW4vR2V0RGV0YWlsRGF0YVwiXG4gICAgICB9LFxuICAgICAganNFZGl0b3JJbnN0YW5jZTogbnVsbCxcbiAgICAgIG9yZ2FuVHJlZToge1xuICAgICAgICB0cmVlT2JqOiBudWxsLFxuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICBjaGtTdHlsZTogXCJyYWRpb1wiLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJvcmdhbk5hbWVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJvcmdhbklkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJvcmdhblBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IFwiLTFcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLl9ob3N0O1xuXG4gICAgICAgICAgICAgIF9zZWxmLnNlbGVjdGVkT3JnYW4odHJlZU5vZGUpO1xuXG4gICAgICAgICAgICAgIF9zZWxmLmhhbmRsZUNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmVlRGF0YTogbnVsbCxcbiAgICAgICAgY2xpY2tOb2RlOiBudWxsXG4gICAgICB9LFxuICAgICAgc2VsZWN0ZWRPcmdhbkRhdGE6IG51bGxcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzLnNlbGVjdE9yZ2FuTW9kZWxEaWFsb2dXcmFwKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0T3JnYW46IGZ1bmN0aW9uIGJlZ2luU2VsZWN0T3JnYW4oKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc2VsZWN0T3JnYW5Nb2RlbERpYWxvZ1dyYXA7XG4gICAgICB0aGlzLmdldE9yZ2FuRGF0YUluaXRUcmVlKCk7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDQ3MCxcbiAgICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqee7hOe7h+acuuaehFwiXG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldE9yZ2FuRGF0YUluaXRUcmVlOiBmdW5jdGlvbiBnZXRPcmdhbkRhdGFJbml0VHJlZSgpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRPcmdhbkRhdGFVcmwsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLm9yZ2FuVHJlZS50cmVlRGF0YSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgICAgICAgX3NlbGYuJHJlZnMub3JnYW5aVHJlZVVMLnNldEF0dHJpYnV0ZShcImlkXCIsIFwic2VsZWN0LW9yZ2FuLXNpbmdsZS1jb21wLVwiICsgU3RyaW5nVXRpbGl0eS5HdWlkKCkpO1xuXG4gICAgICAgICAgX3NlbGYub3JnYW5UcmVlLnRyZWVPYmogPSAkLmZuLnpUcmVlLmluaXQoJChfc2VsZi4kcmVmcy5vcmdhblpUcmVlVUwpLCBfc2VsZi5vcmdhblRyZWUudHJlZVNldHRpbmcsIF9zZWxmLm9yZ2FuVHJlZS50cmVlRGF0YSk7XG5cbiAgICAgICAgICBfc2VsZi5vcmdhblRyZWUudHJlZU9iai5leHBhbmRBbGwodHJ1ZSk7XG5cbiAgICAgICAgICBfc2VsZi5vcmdhblRyZWUudHJlZU9iai5faG9zdCA9IF9zZWxmO1xuICAgICAgICAgIGZ1enp5U2VhcmNoVHJlZU9iaihfc2VsZi5vcmdhblRyZWUudHJlZU9iaiwgX3NlbGYuJHJlZnMudHh0X29yZ2FuX3NlYXJjaF90ZXh0LiRyZWZzLmlucHV0LCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICBzZWxlY3RlZE9yZ2FuOiBmdW5jdGlvbiBzZWxlY3RlZE9yZ2FuKG9yZ2FuRGF0YSkge1xuICAgICAgdGhpcy5zZWxlY3RlZE9yZ2FuRGF0YSA9IG9yZ2FuRGF0YTtcbiAgICAgIHRoaXMuJGVtaXQoJ29uLXNlbGVjdGVkLW9yZ2FuJywgb3JnYW5EYXRhKTtcbiAgICB9LFxuICAgIGdldFNlbGVjdGVkT3JnYW5OYW1lOiBmdW5jdGlvbiBnZXRTZWxlY3RlZE9yZ2FuTmFtZSgpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkT3JnYW5EYXRhID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFwi6K+36YCJ5oup57uE57uH5py65p6EXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZE9yZ2FuRGF0YS5vcmdhbk5hbWU7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRPbGRTZWxlY3RlZE9yZ2FuOiBmdW5jdGlvbiBzZXRPbGRTZWxlY3RlZE9yZ2FuKG9yZ2FuSWQpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRTaW5nbGVPcmdhbkRhdGFVcmwsIHtcbiAgICAgICAgXCJyZWNvcmRJZFwiOiBvcmdhbklkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLnNlbGVjdGVkT3JnYW5EYXRhID0gcmVzdWx0LmRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdC12aWV3LW9yZ2FuLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInRleHRcXFwiPnt7Z2V0U2VsZWN0ZWRPcmdhbk5hbWUoKX19PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidmFsdWVcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlkXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b25cXFwiIEBjbGljaz1cXFwiYmVnaW5TZWxlY3RPcmdhbigpXFxcIj48SWNvbiB0eXBlPVxcXCJpb3MtZnVubmVsXFxcIiAvPiZuYnNwO1xcdTkwMDlcXHU2MkU5PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPVxcXCJzZWxlY3RPcmdhbk1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImMxLXNlbGVjdC1tb2RlbC13cmFwIGdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjMS1zZWxlY3QtbW9kZWwtc291cmNlLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCBzZWFyY2ggY2xhc3M9XFxcImlucHV0X2JvcmRlcl9ib3R0b21cXFwiIHJlZj1cXFwidHh0X29yZ2FuX3NlYXJjaF90ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1OEJGN1xcdThGOTNcXHU1MTY1XFx1N0VDNFxcdTdFQzdcXHU2NzNBXFx1Njc4NFxcdTU0MERcXHU3OUYwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbm5lci13cmFwIGRpdi1jdXN0b20tc2Nyb2xsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCByZWY9XFxcIm9yZ2FuWlRyZWVVTFxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblZ1ZS5jb21wb25lbnQoXCJzc28tYXBwLWRldGFpbC1mcm9tLWNvbXBcIiwge1xuICBwcm9wczogW1wic3RhdHVzXCIsIFwiYXBwSWRcIiwgXCJpc1N1YlN5c3RlbVwiXSxcbiAgd2F0Y2g6IHtcbiAgICBhcHBJZDogZnVuY3Rpb24gYXBwSWQobmV3VmFsKSB7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBJZCA9IG5ld1ZhbDtcbiAgICB9LFxuICAgIHN0YXR1czogZnVuY3Rpb24gc3RhdHVzKG5ld1ZhbCkge1xuICAgICAgdGhpcy5pbm5lclN0YXR1cyA9IG5ld1ZhbDtcbiAgICB9XG4gIH0sXG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGFwcExvZ29Vcmw6IFwiL1BsYXRGb3JtUmVzdC9TU08vQXBwbGljYXRpb24vR2V0QXBwTG9nb1wiLFxuICAgICAgICBnZXROZXdLZXlzOiBcIi9QbGF0Rm9ybVJlc3QvU1NPL0FwcGxpY2F0aW9uL0dldE5ld0tleXNcIlxuICAgICAgfSxcbiAgICAgIGFwcEVudGl0eToge1xuICAgICAgICBhcHBJZDogXCJcIixcbiAgICAgICAgYXBwQ29kZTogXCJcIixcbiAgICAgICAgYXBwTmFtZTogXCJcIixcbiAgICAgICAgYXBwUHVibGljS2V5OiBcIlwiLFxuICAgICAgICBhcHBQcml2YXRlS2V5OiBcIlwiLFxuICAgICAgICBhcHBEb21haW46IFwiXCIsXG4gICAgICAgIGFwcEluZGV4VXJsOiBcIlwiLFxuICAgICAgICBhcHBNYWluSW1hZ2VJZDogXCJcIixcbiAgICAgICAgYXBwVHlwZTogXCJcIixcbiAgICAgICAgYXBwTWFpbklkOiBcIlwiLFxuICAgICAgICBhcHBDYXRlZ29yeTogXCJ3ZWJcIixcbiAgICAgICAgYXBwRGVzYzogXCJcIixcbiAgICAgICAgYXBwU3RhdHVzOiBcIuWQr+eUqFwiLFxuICAgICAgICBhcHBDcmVhdGVUaW1lOiBEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YSgpXG4gICAgICB9LFxuICAgICAgcnVsZVZhbGlkYXRlOiB7XG4gICAgICAgIGFwcENvZGU6IFt7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogJ+OAkOezu+e7n+e8lueggeOAkeS4jeiDveS4uuepuu+8gScsXG4gICAgICAgICAgdHJpZ2dlcjogJ2JsdXInXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBwYXR0ZXJuOiAvXltBLVphLXowLTldKyQvLFxuICAgICAgICAgIG1lc3NhZ2U6ICfor7fkvb/nlKjlrZfmr43miJbmlbDlrZcnLFxuICAgICAgICAgIHRyaWdnZXI6ICdibHVyJ1xuICAgICAgICB9XSxcbiAgICAgICAgYXBwTmFtZTogW3tcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiAn44CQ57O757uf5ZCN56ew44CR5LiN6IO95Li656m677yBJyxcbiAgICAgICAgICB0cmlnZ2VyOiAnYmx1cidcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICBzeXN0ZW1Mb2dvSW1hZ2VTcmM6IFwiXCIsXG4gICAgICBpbm5lclN0YXR1czogXCJhZGRcIlxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7XG4gICAgaWYgKHRoaXMuaW5uZXJTdGF0dXMgPT0gXCJhZGRcIikge1xuICAgICAgdGhpcy5zeXN0ZW1Mb2dvSW1hZ2VTcmMgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLmFjSW50ZXJmYWNlLmFwcExvZ29VcmwsIHtcbiAgICAgICAgZmlsZUlkOiBcImRlZmF1bHRTU09BcHBMb2dvSW1hZ2VcIlxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3lzdGVtTG9nb0ltYWdlU3JjID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5hY0ludGVyZmFjZS5hcHBMb2dvVXJsLCB7XG4gICAgICAgIGZpbGVJZDogXCJcIlxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgcmVzZXRBcHBFbnRpdHk6IGZ1bmN0aW9uIHJlc2V0QXBwRW50aXR5KCkge1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwSWQgPSBcIlwiO1xuICAgICAgdGhpcy5hcHBFbnRpdHkuYXBwQ29kZSA9IFwiXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBOYW1lID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcFB1YmxpY0tleSA9IFwiXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBQcml2YXRlS2V5ID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcERvbWFpbiA9IFwiXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBJbmRleFVybCA9IFwiXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBNYWluSW1hZ2VJZCA9IFwiXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBUeXBlID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcE1haW5JZCA9IFwiXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBDYXRlZ29yeSA9IFwid2ViXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBEZXNjID0gXCJcIjtcbiAgICAgIHRoaXMuYXBwRW50aXR5LmFwcFN0YXR1cyA9IFwi5ZCv55SoXCI7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBDcmVhdGVUaW1lID0gRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGEoKTtcbiAgICB9LFxuICAgIHVwbG9hZFN5c3RlbUxvZ29JbWFnZVN1Y2Nlc3M6IGZ1bmN0aW9uIHVwbG9hZFN5c3RlbUxvZ29JbWFnZVN1Y2Nlc3MocmVzcG9uc2UsIGZpbGUsIGZpbGVMaXN0KSB7XG4gICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB0aGlzLmFwcEVudGl0eS5hcHBNYWluSW1hZ2VJZCA9IGRhdGEuZmlsZUlkO1xuICAgICAgdGhpcy5zeXN0ZW1Mb2dvSW1hZ2VTcmMgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLmFjSW50ZXJmYWNlLmFwcExvZ29VcmwsIHtcbiAgICAgICAgZmlsZUlkOiB0aGlzLmFwcEVudGl0eS5hcHBNYWluSW1hZ2VJZFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRBcHBFbnRpdHk6IGZ1bmN0aW9uIGdldEFwcEVudGl0eSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmFwcEVudGl0eTtcbiAgICB9LFxuICAgIHNldEFwcEVudGl0eTogZnVuY3Rpb24gc2V0QXBwRW50aXR5KGFwcEVudGl0eSkge1xuICAgICAgdGhpcy5hcHBFbnRpdHkgPSBhcHBFbnRpdHk7XG4gICAgfSxcbiAgICBjcmVhdGVLZXlzOiBmdW5jdGlvbiBjcmVhdGVLZXlzKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldE5ld0tleXMsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLmFwcEVudGl0eS5hcHBQdWJsaWNLZXkgPSByZXN1bHQuZGF0YS5wdWJsaWNLZXk7XG4gICAgICAgICAgX3NlbGYuYXBwRW50aXR5LmFwcFByaXZhdGVLZXkgPSByZXN1bHQuZGF0YS5wcml2YXRlS2V5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJ3aWR0aDogODAlO2Zsb2F0OiBsZWZ0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aS1mb3JtIHJlZj1cXFwiYXBwRW50aXR5XFxcIiA6bW9kZWw9XFxcImFwcEVudGl0eVxcXCIgOnJ1bGVzPVxcXCJydWxlVmFsaWRhdGVcXFwiIDpsYWJlbC13aWR0aD1cXFwiMTAwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1N0NGQlxcdTdFREZcXHU3RjE2XFx1NzgwMVxcdUZGMUFcXFwiIHByb3A9XFxcImFwcENvZGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJvdz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIHByb3A9XFxcImFwcENvZGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcENvZGVcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiNFxcXCIgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+PHNwYW4gc3R5bGU9XFxcImNvbG9yOiByZWRcXFwiPio8L3NwYW4+IFxcdTdDRkJcXHU3RURGXFx1NTQwRFxcdTc5RjBcXHVGRjFBPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIHByb3A9XFxcImFwcE5hbWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcE5hbWVcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcm93PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NTdERlxcdTU0MERcXHVGRjFBXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjEwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcERvbWFpblxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1jb2w+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktY29sIHNwYW49XFxcIjRcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlxcdTdDRkJcXHU3RURGXFx1N0M3QlxcdTUyMkJcXHVGRjFBPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8tZ3JvdXAgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcENhdGVnb3J5XFxcIiB0eXBlPVxcXCJidXR0b25cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvIGxhYmVsPVxcXCJhcHBcXFwiPlxcdTc5RkJcXHU1MkE4QXBwPC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwid2ViXFxcIj5XZWJcXHU3Q0ZCXFx1N0VERjwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcmFkaW8tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcm93PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NTE2Q1xcdTk0QTVcXHVGRjFBXFxcIiB2LWlmPVxcXCJpc1N1YlN5c3RlbT09JzAnXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHBsYWNlaG9sZGVyPVxcXCJcXHU4QkY3XFx1NTIxQlxcdTVFRkFcXHU1QkM2XFx1OTRBNVxcdTVCRjksXFx1NzUyOFxcdTRFOEVcXHU2NTcwXFx1NjM2RVxcdTc2ODRcXHU1MkEwXFx1NUJDNlxcdTRGN0ZcXHU3NTI4XFxcIiBzZWFyY2ggZW50ZXItYnV0dG9uPVxcXCJcXHU1MjFCXFx1NUVGQVxcdTVCQzZcXHU5NEE1XFx1NUJGOVxcXCIgdi1tb2RlbD1cXFwiYXBwRW50aXR5LmFwcFB1YmxpY0tleVxcXCIgQG9uLXNlYXJjaD1cXFwiY3JlYXRlS2V5cygpXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU3OUMxXFx1OTRBNVxcdUZGMUFcXFwiIHYtaWY9XFxcImlzU3ViU3lzdGVtPT0wXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBQcml2YXRlS2V5XFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU1MjFCXFx1NUVGQVxcdTY1RjZcXHU5NUY0XFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cm93PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWNvbCBzcGFuPVxcXCIxMFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkYXRlLXBpY2tlciB0eXBlPVxcXCJkYXRlXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFx1OTAwOVxcdTYyRTlcXHU1MjFCXFx1NUVGQVxcdTY1RjZcXHU5NUY0XFxcIiB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwQ3JlYXRlVGltZVxcXCIgZGlzYWJsZWRcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRvbmx5PjwvZGF0ZS1waWNrZXI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiNFxcXCIgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XFx1NzJCNlxcdTYwMDFcXHVGRjFBPC9pLWNvbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1jb2wgc3Bhbj1cXFwiMTBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJhZGlvLWdyb3VwIHYtbW9kZWw9XFxcImFwcEVudGl0eS5hcHBTdGF0dXNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyYWRpbyBsYWJlbD1cXFwiXFx1NTQyRlxcdTc1MjhcXFwiPlxcdTU0MkZcXHU3NTI4PC9yYWRpbz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmFkaW8gbGFiZWw9XFxcIlxcdTc5ODFcXHU3NTI4XFxcIj5cXHU3OTgxXFx1NzUyODwvcmFkaW8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3JhZGlvLWdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktY29sPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9yb3c+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU5RUQ4XFx1OEJBNFxcdTU3MzBcXHU1NzQwXFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwSW5kZXhVcmxcXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtLWl0ZW0gbGFiZWw9XFxcIlxcdTU5MDdcXHU2Q0U4XFx1RkYxQVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJhcHBFbnRpdHkuYXBwRGVzY1xcXCIgdHlwZT1cXFwidGV4dGFyZWFcXFwiIDphdXRvc2l6ZT1cXFwie21pblJvd3M6IDQsbWF4Um93czogNH1cXFwiPjwvaS1pbnB1dD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtLWl0ZW0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pLWZvcm0+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XFxcIndpZHRoOiAxOSU7ZmxvYXQ6IHJpZ2h0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVxcXCJib3JkZXItcmFkaXVzOiA4cHg7dGV4dC1hbGlnbjogY2VudGVyO21hcmdpbi10b3A6IDBweDttYXJnaW4tYm90dG9tOiAzMHB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyA6c3JjPVxcXCJzeXN0ZW1Mb2dvSW1hZ2VTcmNcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMTEwcHg7aGVpZ2h0OiAxMTBweFxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8dXBsb2FkIHN0eWxlPVxcXCJtYXJnaW46MTBweCAxMnB4IDAgMjBweFxcXCIgOm9uLXN1Y2Nlc3M9XFxcInVwbG9hZFN5c3RlbUxvZ29JbWFnZVN1Y2Nlc3NcXFwiIG11bHRpcGxlIHR5cGU9XFxcImRyYWdcXFwiIG5hbWU9XFxcImZpbGVcXFwiIGFjdGlvbj1cXFwiLi4vLi4vLi4vL1BsYXRGb3JtUmVzdC9TU08vQXBwbGljYXRpb24vVXBsb2FkQXBwTG9nby5kb1xcXCIgYWNjZXB0PVxcXCIucG5nXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwicGFkZGluZzoxMHB4IDBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aWNvbiB0eXBlPVxcXCJpb3MtY2xvdWQtdXBsb2FkXFxcIiBzaXplPVxcXCI1MlxcXCIgc3R5bGU9XFxcImNvbG9yOiAjMzM5OWZmXFxcIj48L2ljb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5cXHU0RTBBXFx1NEYyMFxcdTdDRkJcXHU3RURGTG9nbzwvcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC91cGxvYWQ+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic3NvLWFwcC1pbnRlcmZhY2UtbGlzdC1jb21wXCIsIHtcbiAgcHJvcHM6IFtcImludGVyZmFjZUJlbG9uZ0FwcElkXCJdLFxuICB3YXRjaDoge1xuICAgIGludGVyZmFjZUJlbG9uZ0FwcElkOiBmdW5jdGlvbiBpbnRlcmZhY2VCZWxvbmdBcHBJZChuZXdWYWwpIHtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUJlbG9uZ0FwcElkID0gbmV3VmFsO1xuICAgIH1cbiAgfSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgIGRlbGV0ZTogXCIvUGxhdEZvcm1SZXN0L1NTTy9BcHBsaWNhdGlvbi9EZWxldGVJbnRlcmZhY2VcIlxuICAgICAgfSxcbiAgICAgIGludGVyZmFjZUVudGl0eToge1xuICAgICAgICBpbnRlcmZhY2VJZDogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlQmVsb25nQXBwSWQ6IFwiXCIsXG4gICAgICAgIGludGVyZmFjZUNvZGU6IFwiXCIsXG4gICAgICAgIGludGVyZmFjZU5hbWU6IFwiXCIsXG4gICAgICAgIGludGVyZmFjZVVybDogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlUGFyYXM6IFwiXCIsXG4gICAgICAgIGludGVyZmFjZUZvcm1hdDogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlRGVzYzogXCJcIixcbiAgICAgICAgaW50ZXJmYWNlT3JkZXJOdW06IFwiXCIsXG4gICAgICAgIGludGVyZmFjZUNyZWF0ZVRpbWU6IERhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhKCksXG4gICAgICAgIGludGVyZmFjZVN0YXR1czogXCLlkK/nlKhcIixcbiAgICAgICAgaW50ZXJmYWNlQ3JlYXRlcklkOiBcIlwiLFxuICAgICAgICBpbnRlcmZhY2VPcmdhbklkOiBcIlwiXG4gICAgICB9LFxuICAgICAgbGlzdDoge1xuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHR5cGU6ICdzZWxlY3Rpb24nLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5o6l5Y+j57G75Z6LJyxcbiAgICAgICAgICBrZXk6ICdpbnRlcmZhY2VDb2RlJyxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICB3aWR0aDogMTAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+aOpeWPo+WQjeensCcsXG4gICAgICAgICAga2V5OiAnaW50ZXJmYWNlTmFtZScsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgd2lkdGg6IDI4MFxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICflpIfms6gnLFxuICAgICAgICAgIGtleTogJ2ludGVyZmFjZURlc2MnLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgICAga2V5OiAnaW50ZXJmYWNlSWQnLFxuICAgICAgICAgIHdpZHRoOiAxNDAsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoaCwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24td3JhcFwiXG4gICAgICAgICAgICB9LCBbTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVJbm5lckJ1dHRvbi5FZGl0QnV0dG9uKGgsIHBhcmFtcywgXCJpbnRlcmZhY2VJZFwiLCBfc2VsZiksIExpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlSW5uZXJCdXR0b24uRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgXCJpbnRlcmZhY2VJZFwiLCBfc2VsZildKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICB0YWJsZURhdGE6IFtdXG4gICAgICB9LFxuICAgICAgaW5uZXJTdGF0dXM6IFwiYWRkXCJcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIG1ldGhvZHM6IHtcbiAgICByZXNldExpc3REYXRhOiBmdW5jdGlvbiByZXNldExpc3REYXRhKCkge1xuICAgICAgdGhpcy5saXN0LnRhYmxlRGF0YSA9IFtdO1xuICAgIH0sXG4gICAgYWRkSW50ZXJmYWNlOiBmdW5jdGlvbiBhZGRJbnRlcmZhY2UoKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc3NvQXBwSW50ZXJmYWNlRWRpdE1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHRoaXMuaW5uZXJTdGF0dXMgPT0gXCJhZGRcIjtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUlkID0gXCJcIjtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUJlbG9uZ0FwcElkID0gdGhpcy5pbnRlcmZhY2VCZWxvbmdBcHBJZDtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNvZGUgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlTmFtZSA9IFwiXCI7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VVcmwgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlUGFyYXMgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlRm9ybWF0ID0gXCJcIjtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZURlc2MgPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlT3JkZXJOdW0gPSBcIlwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQ3JlYXRlVGltZSA9IERhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhKCk7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VTdGF0dXMgPSBcIuWQr+eUqFwiO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlQ3JlYXRlcklkID0gXCJcIjtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZU9yZ2FuSWQgPSBcIlwiO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA1NzAsXG4gICAgICAgIGhlaWdodDogMzMwLFxuICAgICAgICB0aXRsZTogXCLmjqXlj6Porr7nva5cIlxuICAgICAgfSk7XG4gICAgfSxcbiAgICBoYW5kbGVDbG9zZTogZnVuY3Rpb24gaGFuZGxlQ2xvc2UoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh0aGlzLiRyZWZzLnNzb0FwcEludGVyZmFjZUVkaXRNb2RlbERpYWxvZ1dyYXApO1xuICAgIH0sXG4gICAgc2F2ZUludGVyZmFjZUVkaXQ6IGZ1bmN0aW9uIHNhdmVJbnRlcmZhY2VFZGl0KCkge1xuICAgICAgaWYgKHRoaXMuaW5uZXJTdGF0dXMgPT0gXCJhZGRcIikge1xuICAgICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VJZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgICAgICB0aGlzLmxpc3QudGFibGVEYXRhLnB1c2goSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUodGhpcy5pbnRlcmZhY2VFbnRpdHkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saXN0LnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZUlkID09IHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUlkKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZUNvZGUgPSB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VDb2RlO1xuICAgICAgICAgICAgdGhpcy5saXN0LnRhYmxlRGF0YVtpXS5pbnRlcmZhY2VOYW1lID0gdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlTmFtZTtcbiAgICAgICAgICAgIHRoaXMubGlzdC50YWJsZURhdGFbaV0uaW50ZXJmYWNlVXJsID0gdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlVXJsO1xuICAgICAgICAgICAgdGhpcy5saXN0LnRhYmxlRGF0YVtpXS5pbnRlcmZhY2VQYXJhcyA9IHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZVBhcmFzO1xuICAgICAgICAgICAgdGhpcy5saXN0LnRhYmxlRGF0YVtpXS5pbnRlcmZhY2VGb3JtYXQgPSB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VGb3JtYXQ7XG4gICAgICAgICAgICB0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZURlc2MgPSB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VEZXNjO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoKTtcbiAgICB9LFxuICAgIGNoYW5nZUludGVyZmFjZUNvZGU6IGZ1bmN0aW9uIGNoYW5nZUludGVyZmFjZUNvZGUodmFsdWUpIHtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNvZGUgPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldEludGVyZmFjZUxpc3REYXRhOiBmdW5jdGlvbiBnZXRJbnRlcmZhY2VMaXN0RGF0YSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpc3QudGFibGVEYXRhO1xuICAgIH0sXG4gICAgc2V0SW50ZXJmYWNlTGlzdERhdGE6IGZ1bmN0aW9uIHNldEludGVyZmFjZUxpc3REYXRhKGRhdGEpIHtcbiAgICAgIHRoaXMubGlzdC50YWJsZURhdGEgPSBkYXRhO1xuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24gZWRpdChpbnRlcmZhY2VJZCwgcGFyYW1zKSB7XG4gICAgICB0aGlzLmlubmVyU3RhdHVzID0gXCJ1cGRhdGVcIjtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUlkID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VJZDtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZUNvZGUgPSBwYXJhbXMucm93LmludGVyZmFjZUNvZGU7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VOYW1lID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VOYW1lO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlVXJsID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VVcmw7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VQYXJhcyA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlUGFyYXM7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VGb3JtYXQgPSBwYXJhbXMucm93LmludGVyZmFjZUZvcm1hdDtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZURlc2MgPSBwYXJhbXMucm93LmludGVyZmFjZURlc2M7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VPcmRlck51bSA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlT3JkZXJOdW07XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VDcmVhdGVUaW1lID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VDcmVhdGVUaW1lO1xuICAgICAgdGhpcy5pbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlU3RhdHVzID0gcGFyYW1zLnJvdy5pbnRlcmZhY2VTdGF0dXM7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VDcmVhdGVySWQgPSBwYXJhbXMucm93LmludGVyZmFjZUNyZWF0ZXJJZDtcbiAgICAgIHRoaXMuaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZU9yZ2FuSWQgPSBwYXJhbXMucm93LmludGVyZmFjZU9yZ2FuSWQ7XG4gICAgICB0aGlzLmludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VCZWxvbmdBcHBJZCA9IHBhcmFtcy5yb3cuaW50ZXJmYWNlQmVsb25nQXBwSWQ7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc3NvQXBwSW50ZXJmYWNlRWRpdE1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNTcwLFxuICAgICAgICBoZWlnaHQ6IDMzMCxcbiAgICAgICAgdGl0bGU6IFwi5o6l5Y+j6K6+572uXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiBkZWwoaW50ZXJmYWNlSWQsIHBhcmFtcykge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3QudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3QudGFibGVEYXRhW2ldLmludGVyZmFjZUlkID09IGludGVyZmFjZUlkKSB7XG4gICAgICAgICAgX3NlbGYubGlzdC50YWJsZURhdGEuc3BsaWNlKGksIDEpO1xuXG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTopoHliKDpmaTor6XmjqXlj6PlkJfvvJ9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQWpheFV0aWxpdHkuRGVsZXRlKF9zZWxmLmFjSW50ZXJmYWNlLmRlbGV0ZSwge1xuICAgICAgICAgICAgICBcImludGVyZmFjZUlkXCI6IGludGVyZmFjZUlkXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge30gZWxzZSB7XG4gICAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPVxcXCJpdi1saXN0LXBhZ2Utd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj1cXFwic3NvQXBwSW50ZXJmYWNlRWRpdE1vZGVsRGlhbG9nV3JhcFxcXCIgY2xhc3M9XFxcImdlbmVyYWwtZWRpdC1wYWdlLXdyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lO21hcmdpbi10b3A6IDBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGktZm9ybSByZWY9XFxcImludGVyZmFjZUVudGl0eVxcXCIgOm1vZGVsPVxcXCJpbnRlcmZhY2VFbnRpdHlcXFwiIDpsYWJlbC13aWR0aD1cXFwiMTMwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHNsb3Q9XFxcImxhYmVsXFxcIj48c3BhbiBzdHlsZT1cXFwiY29sb3I6IHJlZFxcXCI+Kjwvc3Bhbj4mbmJzcDtcXHU2M0E1XFx1NTNFM1xcdTdDN0JcXHU1NzhCXFx1RkYxQTwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VDb2RlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFNlbGVjdCBzbG90PVxcXCJhcHBlbmRcXFwiIHN0eWxlPVxcXCJ3aWR0aDogOTBweFxcXCIgQG9uLWNoYW5nZT1cXFwiY2hhbmdlSW50ZXJmYWNlQ29kZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxPcHRpb24gdmFsdWU9XFxcIlxcdTc2N0JcXHU1RjU1XFx1NjNBNVxcdTUzRTNcXFwiPlxcdTc2N0JcXHU1RjU1XFx1NjNBNVxcdTUzRTM8L09wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE9wdGlvbiB2YWx1ZT1cXFwiXFx1NTE3NlxcdTRFRDZcXFwiPlxcdTUxNzZcXHU0RUQ2PC9PcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9TZWxlY3Q+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc2xvdD1cXFwibGFiZWxcXFwiPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjogcmVkXFxcIj4qPC9zcGFuPiZuYnNwO1xcdTYzQTVcXHU1M0UzXFx1NTQwRFxcdTc5RjBcXHVGRjFBPC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZU5hbWVcXFwiIHNpemU9XFxcInNtYWxsXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU2M0E1XFx1NTNFM1xcdTU3MzBcXHU1NzQwXFx1RkYxQVxcXCIgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDJweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS1pbnB1dCB2LW1vZGVsPVxcXCJpbnRlcmZhY2VFbnRpdHkuaW50ZXJmYWNlVXJsXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+PC9pLWlucHV0PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NTNDMlxcdTY1NzBcXHVGRjFBXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VQYXJhc1xcXCIgdHlwZT1cXFwidGV4dGFyZWFcXFwiIDphdXRvc2l6ZT1cXFwie21pblJvd3M6IDIsbWF4Um93czogMn1cXFwiIHNpemU9XFxcInNtYWxsXFxcIj48L2ktaW5wdXQ+ICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0taXRlbT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0taXRlbSBsYWJlbD1cXFwiXFx1NjgzQ1xcdTVGMEZcXHU1MzE2XFx1NjVCOVxcdTZDRDVcXHVGRjFBXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTogMnB4XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWlucHV0IHYtbW9kZWw9XFxcImludGVyZmFjZUVudGl0eS5pbnRlcmZhY2VGb3JtYXRcXFwiIHNpemU9XFxcInNtYWxsXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybS1pdGVtIGxhYmVsPVxcXCJcXHU1OTA3XFx1NkNFOFxcdUZGMUFcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAycHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktaW5wdXQgdi1tb2RlbD1cXFwiaW50ZXJmYWNlRW50aXR5LmludGVyZmFjZURlc2NcXFwiIHNpemU9XFxcInNtYWxsXFxcIj48L2ktaW5wdXQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybS1pdGVtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaS1mb3JtPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1vdXRlci13cmFwXFxcIiBzdHlsZT1cXFwibWFyZ2luLWxlZnQ6IDhweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXAgc2l6ZT1cXFwic21hbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcInNhdmVJbnRlcmZhY2VFZGl0KCdpbnRlcmZhY2VFbnRpdHknKVxcXCIgaWNvbj1cXFwibWQtY2hlY2ttYXJrXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj48L2ktYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVxcXCJsaXN0LWJ1dHRvbi13cmFwXFxcIiBjbGFzcz1cXFwibGlzdC1idXR0b24tb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1idXR0b24taW5uZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25Hcm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLWJ1dHRvbiAgdHlwZT1cXFwic3VjY2Vzc1xcXCIgQGNsaWNrPVxcXCJhZGRJbnRlcmZhY2UoKVxcXCIgaWNvbj1cXFwibWQtYWRkXFxcIj5cXHU2NUIwXFx1NTg5RTwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uR3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwiY2xlYXI6IGJvdGhcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSA6aGVpZ2h0PVxcXCJsaXN0Lmxpc3RIZWlnaHRcXFwiIHN0cmlwZSBib3JkZXIgOmNvbHVtbnM9XFxcImxpc3QuY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcImxpc3QudGFibGVEYXRhXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgOmhpZ2hsaWdodC1yb3c9XFxcInRydWVcXFwiPjwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG5WdWUuY29tcG9uZW50KFwic3NvLWFwcC1zdWItc3lzdGVtLWxpc3QtY29tcFwiLCB7XG4gIHByb3BzOiBbXCJzdGF0dXNcIiwgXCJiZWxvbmdBcHBJZFwiXSxcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgc2F2ZVN1YkFwcFVybDogXCIvUGxhdEZvcm1SZXN0L1NTTy9BcHBsaWNhdGlvbi9TYXZlU3ViQXBwXCIsXG4gICAgICAgIHJlbG9hZERhdGE6IFwiL1BsYXRGb3JtUmVzdC9TU08vQXBwbGljYXRpb24vR2V0QWxsU3ViU3NvQXBwXCIsXG4gICAgICAgIGFwcExvZ29Vcmw6IFwiL1BsYXRGb3JtUmVzdC9TU08vQXBwbGljYXRpb24vR2V0QXBwTG9nb1wiLFxuICAgICAgICBkZWxldGU6IFwiL1BsYXRGb3JtUmVzdC9TU08vQXBwbGljYXRpb24vRGVsZXRlXCIsXG4gICAgICAgIGdldERhdGFVcmw6IFwiL1BsYXRGb3JtUmVzdC9TU08vQXBwbGljYXRpb24vR2V0QXBwVm9cIlxuICAgICAgfSxcbiAgICAgIGFwcExpc3Q6IFtdLFxuICAgICAgaW5uZXJFZGl0TW9kZWxEaWFsb2dTdGF0dXM6IFwiYWRkXCJcbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYWRkSW50ZWdyYXRlZFN5c3RlbTogZnVuY3Rpb24gYWRkSW50ZWdyYXRlZFN5c3RlbSgpIHtcbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy5zc29BcHBTdWJTeXN0ZW1FZGl0TW9kZWxEaWFsb2dXcmFwO1xuICAgICAgdGhpcy4kcmVmcy5zdWJBcHBEZXRhaWxGcm9tQ29tcC5yZXNldEFwcEVudGl0eSgpO1xuICAgICAgdGhpcy4kcmVmcy5zdWJBcHBJbnRlcmZhY2VMaXN0Q29tcC5yZXNldExpc3REYXRhKCk7XG4gICAgICB0aGlzLmlubmVyRWRpdE1vZGVsRGlhbG9nU3RhdHVzID0gXCJhZGRcIjtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgdGl0bGU6IFwi5a2Q57O757uf6K6+572uXCJcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgc2F2ZVN1YlN5c3RlbVNldHRpbmc6IGZ1bmN0aW9uIHNhdmVTdWJTeXN0ZW1TZXR0aW5nKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgdmFyIHNzb0FwcEVudGl0eSA9IHRoaXMuJHJlZnMuc3ViQXBwRGV0YWlsRnJvbUNvbXAuZ2V0QXBwRW50aXR5KCk7XG4gICAgICB2YXIgc3NvQXBwSW50ZXJmYWNlRW50aXR5TGlzdCA9IHRoaXMuJHJlZnMuc3ViQXBwSW50ZXJmYWNlTGlzdENvbXAuZ2V0SW50ZXJmYWNlTGlzdERhdGEoKTtcbiAgICAgIHNzb0FwcEVudGl0eS5hcHBNYWluSWQgPSB0aGlzLmJlbG9uZ0FwcElkO1xuXG4gICAgICBpZiAodGhpcy5pbm5lckVkaXRNb2RlbERpYWxvZ1N0YXR1cyA9PSBcImFkZFwiKSB7XG4gICAgICAgIHNzb0FwcEVudGl0eS5hcHBJZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3NvQXBwSW50ZXJmYWNlRW50aXR5TGlzdCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNzb0FwcEludGVyZmFjZUVudGl0eUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBzc29BcHBJbnRlcmZhY2VFbnRpdHlMaXN0W2ldLmludGVyZmFjZUJlbG9uZ0FwcElkID0gc3NvQXBwRW50aXR5LmFwcElkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2byA9IHtcbiAgICAgICAgXCJzc29BcHBFbnRpdHlcIjogc3NvQXBwRW50aXR5LFxuICAgICAgICBcInNzb0FwcEludGVyZmFjZUVudGl0eUxpc3RcIjogc3NvQXBwSW50ZXJmYWNlRW50aXR5TGlzdFxuICAgICAgfTtcbiAgICAgIHZhciBzZW5kRGF0YSA9IEpTT04uc3RyaW5naWZ5KHZvKTtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3RSZXF1ZXN0Qm9keSh0aGlzLmFjSW50ZXJmYWNlLnNhdmVTdWJBcHBVcmwsIHNlbmREYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3NlbGYucmVsb2FkRGF0YSgpO1xuXG4gICAgICAgICAgICBfc2VsZi5oYW5kbGVDbG9zZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9LFxuICAgIGhhbmRsZUNsb3NlOiBmdW5jdGlvbiBoYW5kbGVDbG9zZSgpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuJHJlZnMuc3NvQXBwU3ViU3lzdGVtRWRpdE1vZGVsRGlhbG9nV3JhcCk7XG4gICAgfSxcbiAgICByZWxvYWREYXRhOiBmdW5jdGlvbiByZWxvYWREYXRhKCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLnJlbG9hZERhdGEsIHtcbiAgICAgICAgYXBwSWQ6IF9zZWxmLmJlbG9uZ0FwcElkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIF9zZWxmLmFwcExpc3QgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSxcbiAgICBidWlsZExvZ29Vcmw6IGZ1bmN0aW9uIGJ1aWxkTG9nb1VybChhcHApIHtcbiAgICAgIGlmIChhcHAuYXBwTWFpbkltYWdlSWQgPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5hY0ludGVyZmFjZS5hcHBMb2dvVXJsLCB7XG4gICAgICAgICAgZmlsZUlkOiBcImRlZmF1bHRTU09BcHBMb2dvSW1hZ2VcIlxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLmFjSW50ZXJmYWNlLmFwcExvZ29VcmwsIHtcbiAgICAgICAgICBmaWxlSWQ6IGFwcC5hcHBNYWluSW1hZ2VJZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldHRpbmdBcHA6IGZ1bmN0aW9uIHNldHRpbmdBcHAoYXBwKSB7XG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMuc3NvQXBwU3ViU3lzdGVtRWRpdE1vZGVsRGlhbG9nV3JhcDtcbiAgICAgIHRoaXMuaW5uZXJFZGl0TW9kZWxEaWFsb2dTdGF0dXMgPSBcInVwZGF0ZVwiO1xuXG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0RGF0YVVybCwge1xuICAgICAgICBhcHBJZDogYXBwLmFwcElkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgX3NlbGYuJHJlZnMuc3ViQXBwRGV0YWlsRnJvbUNvbXAuc2V0QXBwRW50aXR5KHJlc3VsdC5kYXRhLnNzb0FwcEVudGl0eSk7XG5cbiAgICAgICAgICBfc2VsZi4kcmVmcy5zdWJBcHBJbnRlcmZhY2VMaXN0Q29tcC5zZXRJbnRlcmZhY2VMaXN0RGF0YShyZXN1bHQuZGF0YS5zc29BcHBJbnRlcmZhY2VFbnRpdHlMaXN0KTtcblxuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgIHdpZHRoOiA5MDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgICAgIHRpdGxlOiBcIuWtkOezu+e7n+iuvue9rlwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0sXG4gICAgcmVtb3ZlQXBwOiBmdW5jdGlvbiByZW1vdmVBcHAoYXBwKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeazqOmUgOezu+e7n1tcIiArIGFwcC5hcHBOYW1lICsgXCJd5ZCX77yfXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgQWpheFV0aWxpdHkuRGVsZXRlKF9zZWxmLmFjSW50ZXJmYWNlLmRlbGV0ZSwge1xuICAgICAgICAgIGFwcElkOiBhcHAuYXBwSWRcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIF9zZWxmLnJlbG9hZERhdGEoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9XFxcInNzb0FwcFN1YlN5c3RlbUVkaXRNb2RlbERpYWxvZ1dyYXBcXFwiIGNsYXNzPVxcXCJnZW5lcmFsLWVkaXQtcGFnZS13cmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTttYXJnaW4tdG9wOiAwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJzPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgbGFiZWw9XFxcIlxcdTdDRkJcXHU3RURGXFx1OEJCRVxcdTdGNkVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNzby1hcHAtZGV0YWlsLWZyb20tY29tcCByZWY9XFxcInN1YkFwcERldGFpbEZyb21Db21wXFxcIiA6aXMtc3ViLXN5c3RlbT1cXFwidHJ1ZVxcXCIgOnN0YXR1cz1cXFwiaW5uZXJFZGl0TW9kZWxEaWFsb2dTdGF0dXNcXFwiPjwvc3NvLWFwcC1kZXRhaWwtZnJvbS1jb21wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgbGFiZWw9XFxcIlxcdTYzQTVcXHU1M0UzXFx1OEJCRVxcdTdGNkVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNzby1hcHAtaW50ZXJmYWNlLWxpc3QtY29tcCByZWY9XFxcInN1YkFwcEludGVyZmFjZUxpc3RDb21wXFxcIj48L3Nzby1hcHAtaW50ZXJmYWNlLWxpc3QtY29tcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RhYnM+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLW91dGVyLXdyYXBcXFwiIHN0eWxlPVxcXCJtYXJnaW4tcmlnaHQ6IDEwcHg7bWFyZ2luLWJvdHRvbTogMTBweFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ1dHRvbi1pbm5lci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24tZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIHYtaWY9XFxcInN0YXR1cyE9J3ZpZXcnXFxcIiBAY2xpY2s9XFxcInNhdmVTdWJTeXN0ZW1TZXR0aW5nKClcXFwiIGljb249XFxcIm1kLWNoZWNrbWFya1xcXCI+XFx1NEZERFxcdTVCNThcXHU1QjUwXFx1N0NGQlxcdTdFREZcXHU4QkJFXFx1N0Y2RTwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktYnV0dG9uIHYtaWY9XFxcInN0YXR1cyE9J3ZpZXcnXFxcIiBAY2xpY2s9XFxcImhhbmRsZUNsb3NlKClcXFwiIGljb249XFxcIm1kLWNsb3NlXFxcIj5cXHU1MTczXFx1OTVFRDwvaS1idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbi1ncm91cD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFwcHMtbWFuYWdlci1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhcHBzLW91dGVyLXdyYXBcXFwiIHJlZj1cXFwiYXBwc091dGVyV3JhcFxcXCIgdi1pZj1cXFwic3RhdHVzIT0nYWRkJ1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgIHYtZm9yPVxcXCJhcHAgaW4gYXBwTGlzdFxcXCIgY2xhc3M9XFxcImFwcC1vdXRlci13cmFwIGFwcC1vdXRlci13cmFwLXN1Yi1zeXN0ZW1cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidGl0bGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPnt7YXBwLmFwcE5hbWV9fTwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29udGVudFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibWFpbkltZ1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgOnNyYz1cXFwiYnVpbGRMb2dvVXJsKGFwcClcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnV0dG9uLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24gc2V0dGluZy1idXR0b25cXFwiIEBjbGljaz1cXFwic2V0dGluZ0FwcChhcHApXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdThCQkVcXHU3RjZFXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidXR0b24gcmVtb3ZlLWJ1dHRvblxcXCIgQGNsaWNrPVxcXCJyZW1vdmVBcHAoYXBwKVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2Q0U4XFx1OTUwMFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYXBwLW91dGVyLXdyYXAgYXBwLW91dGVyLXdyYXAtc3ViLXN5c3RlbSBuZXctc3lzdGVtLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYWRkLXN5c3RlbS1idXR0b25cXFwiIEBjbGljaz1cXFwiYWRkSW50ZWdyYXRlZFN5c3RlbSgpXFxcIiBzdHlsZT1cXFwibWFyZ2luLXRvcDogNjBweFxcXCI+XFx1NjVCMFxcdTU4OUU8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiB2LWlmPVxcXCJzdGF0dXM9PSdhZGQnXFxcIj5cXHU4QkY3XFx1NTE0OFxcdTRGRERcXHU1QjU4XFx1NEUzQlxcdTdDRkJcXHU3RURGLFxcdTUxOERcXHU4QkJFXFx1N0Y2RVxcdTUxNzZcXHU0RTJEXFx1NzY4NFxcdTVCNTBcXHU3Q0ZCXFx1N0VERiE8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyJdfQ==
