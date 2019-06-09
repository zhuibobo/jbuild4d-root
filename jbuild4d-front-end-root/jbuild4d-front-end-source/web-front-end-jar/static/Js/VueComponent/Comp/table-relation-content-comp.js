/*表关系内容*/
Vue.component("table-relation-content-comp", {
    props:["relation"],
    data: function () {
        return {
            acInterface:{
                getTablesFieldsByTableIds:"/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTablesFieldsByTableIds",
                saveDiagram:"/PlatFormRest/Builder/DataStorage/TableRelation/TableRelation/SaveDiagram",
                getSingleDiagramData:"/PlatFormRest/Builder/DataStorage/TableRelation/TableRelation/GetDetailData",
                tableView:"/HTML/Builder/DataStorage/DataBase/TableEdit.html"
            },
            tableRelationDiagram:null,
            displayDesc:true,
            formatJson:null,
            recordId:this.relation.relationId
        }
    },
    mounted:function(){
        //alert(PageStyleUtility.GetPageHeight());
        $(this.$refs.relationContentOuterWrap).css("height",PageStyleUtility.GetPageHeight()-75);
        //this.init();
        if(PageStyleUtility.GetPageWidth()<1000){
            this.displayDesc=false;
            $(".table-relation-op-buttons-outer-wrap").css("width","100%");
        }
        this.initDiagram();
        this.loadRelationDetailData();
        //this.setDataJson(this.relation.relationContent);
        //this.loadData();
    },
    methods:{
        init:function () {

            if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make;  // for conciseness in defining templates

            var myDiagram =
                $(go.Diagram, "tableRelationDiagramDiv",  // must name or refer to the DIV HTML element
                    {
                        allowDelete: false,
                        allowCopy: false,
                        layout: $(go.ForceDirectedLayout),
                        "undoManager.isEnabled": true
                    });

            // define several shared Brushes
            var bluegrad = $(go.Brush, "Linear", { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
            var greengrad = $(go.Brush, "Linear", { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
            var redgrad = $(go.Brush, "Linear", { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
            var yellowgrad = $(go.Brush, "Linear", { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
            var lightgrad = $(go.Brush, "Linear", { 1: "#E6E6FA", 0: "#FFFAF0" });

            // the template for each attribute in a node's array of item data
            var itemTempl =
                $(go.Panel, "Horizontal",
                    $(go.Shape,
                        { desiredSize: new go.Size(10, 10) },
                        new go.Binding("figure", "figure"),
                        new go.Binding("fill", "color")),
                    $(go.TextBlock,
                        {
                            stroke: "#333333",
                            font: "bold 14px sans-serif"
                        },
                        new go.Binding("text", "name"))
                );

            // define the Node template, representing an entity
            myDiagram.nodeTemplate =
                $(go.Node, "Auto",  // the whole node panel
                    {
                        selectionAdorned: true,
                        resizable: true,
                        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
                        fromSpot: go.Spot.AllSides,
                        toSpot: go.Spot.AllSides,
                        isShadowed: true,
                        shadowColor: "#C5C1AA"
                    },
                    new go.Binding("location", "location").makeTwoWay(),
                    // whenever the PanelExpanderButton changes the visible property of the "LIST" panel,
                    // clear out any desiredSize set by the ResizingTool.
                    new go.Binding("desiredSize", "visible", function(v) { return new go.Size(NaN, NaN); }).ofObject("LIST"),
                    // define the node's outer shape, which will surround the Table
                    $(go.Shape, "Rectangle",
                        { fill: lightgrad, stroke: "#756875", strokeWidth: 3 }),
                    $(go.Panel, "Table",
                        { margin: 8, stretch: go.GraphObject.Fill },
                        $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
                        // the table header
                        $(go.TextBlock,
                            {
                                row: 0, alignment: go.Spot.Center,
                                margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
                                font: "bold 16px sans-serif"
                            },
                            new go.Binding("text", "key")),
                        // the collapse/expand button
                        $("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
                            { row: 0, alignment: go.Spot.TopRight }),
                        // the list of Panels, each showing an attribute
                        $(go.Panel, "Vertical",
                            {
                                name: "LIST",
                                row: 1,
                                padding: 3,
                                alignment: go.Spot.TopLeft,
                                defaultAlignment: go.Spot.Left,
                                stretch: go.GraphObject.Horizontal,
                                itemTemplate: itemTempl
                            },
                            new go.Binding("itemArray", "items"))
                    )  // end Table Panel
                );  // end Node

            // define the Link template, representing a relationship
            myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                    {
                        selectionAdorned: true,
                        layerName: "Foreground",
                        reshapable: true,
                        routing: go.Link.AvoidsNodes,
                        corner: 5,
                        curve: go.Link.JumpOver
                    },
                    $(go.Shape,  // the link shape
                        { stroke: "#303B45", strokeWidth: 2.5 }),
                    $(go.TextBlock,  // the "from" label
                        {
                            textAlign: "center",
                            font: "bold 14px sans-serif",
                            stroke: "#1967B3",
                            segmentIndex: 0,
                            segmentOffset: new go.Point(NaN, NaN),
                            segmentOrientation: go.Link.OrientUpright
                        },
                        new go.Binding("text", "text")),
                    $(go.TextBlock,  // the "to" label
                        {
                            textAlign: "center",
                            font: "bold 14px sans-serif",
                            stroke: "#1967B3",
                            segmentIndex: -1,
                            segmentOffset: new go.Point(NaN, NaN),
                            segmentOrientation: go.Link.OrientUpright
                        },
                        new go.Binding("text", "toText"))
                );

            // create the model for the E-R diagram
            var nodeDataArray = [
                {
                    key: "Products",
                    items: [{ name: "ProductID", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "ProductName", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "SupplierID", iskey: false, figure: "Decision", color: "purple" },
                        { name: "CategoryID", iskey: false, figure: "Decision", color: "purple" }]
                },
                {
                    key: "Suppliers",
                    items: [{ name: "SupplierID", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "CompanyName", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "ContactName", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "Address", iskey: false, figure: "Cube1", color: bluegrad }]
                },
                {
                    key: "Categories",
                    items: [{ name: "CategoryID", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "CategoryName", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "Description", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "Picture", iskey: false, figure: "TriangleUp", color: redgrad }]
                },
                {
                    key: "Order Details",
                    items: [{ name: "OrderID", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "ProductID", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "UnitPrice", iskey: false, figure: "MagneticData", color: greengrad },
                        { name: "Quantity", iskey: false, figure: "MagneticData", color: greengrad },
                        { name: "Discount", iskey: false, figure: "MagneticData", color: greengrad }]
                },
            ];
            var linkDataArray = [
                { from: "Products", to: "Suppliers", text: "0..N", toText: "1" },
                { from: "Products", to: "Categories", text: "0..N", toText: "1" },
                { from: "Order Details", to: "Products", text: "0..N", toText: "1" }
            ];
            myDiagram.model = $(go.GraphLinksModel,
                {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    nodeDataArray: nodeDataArray,
                    linkDataArray: linkDataArray
                });


        },
        showSelectTableDialog:function(){
            //DialogUtility.AlertText("1111111");
            this.$refs.selectSingleTableDialog.beginSelectTable();
        },
        showSelectFieldConnectDialog:function(){
            var fromTableId="";
            var toTableId="";
            //debugger;
            var i=0;
            this.tableRelationDiagram.selection.each(function (part) {
                if (part instanceof go.Node) {
                    //console.log(part.data);
                    if(i==0){
                        fromTableId=part.data.tableId;
                        i++;
                    }
                    else{
                        toTableId=part.data.tableId;
                    }
                }
            });

            if(!toTableId){
                toTableId=fromTableId;
            }
            //debugger;
            if(fromTableId!=""&&toTableId!=""){
                this.$refs.tableRelationConnectTwoTableDialog.beginSelectConnect(fromTableId,toTableId);
            }
            else{
                DialogUtility.AlertText("请先选中2个节点");
            }
        },
        addTableToDiagram:function(tableData){
            //debugger;
            var tableId=tableData.id;
            var tableIds =[tableId];
            var _self=this;

            if(!this.tableIsExistInDiagram(tableId)) {
                AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds, {"tableIds": tableIds}, function (result) {
                    if (result.success) {
                        var allFields = result.data;
                        var singleTable = result.exKVData.Tables[0];

                        //console.log(allFields);
                        //console.log(singleTable);
                        var allFieldsStyle = [];
                        for (var i = 0; i < allFields.length; i++) {
                            allFields[i].displayText=allFields[i].fieldName+"["+allFields[i].fieldCaption+"]";
                            allFieldsStyle.push(_self.rendererFieldStyle(allFields[i]));
                        }

                        var modelNodeData = {
                            tableId: tableId,
                            loc: "0 0",
                            fields: allFieldsStyle,
                            tableData: singleTable,
                            tableName: singleTable.tableName,
                            tableCaption: singleTable.tableCaption,
                            tableDisplayText:singleTable.tableName+"["+singleTable.tableCaption+"]",
                            key: singleTable.tableId
                        }
                        _self.tableRelationDiagram.model.startTransaction("flash");
                        _self.tableRelationDiagram.model.addNodeData(modelNodeData);
                        _self.tableRelationDiagram.model.commitTransaction("flash");
                    }
                    else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                    }
                }, "json");
            }
            else{
                DialogUtility.AlertText("该画布中已经存在表:"+tableData.text);
            }
        },
        deleteSelection:function () {
            //debugger;
            if (this.tableRelationDiagram.commandHandler.canDeleteSelection()) {
                //alert("candel");
                this.tableRelationDiagram.commandHandler.deleteSelection();
                return;
            }
        },
        connectSelectionNode:function (connectData) {
            /*var fromTableId=null;
            var toTableId=null;

            var i=0;
            this.tableRelationDiagram.selection.each(function (part) {
                if (part instanceof go.Node) {
                    //console.log(part.data);
                    if(i==0){
                        fromTableId=part.data.tableId;
                        i++;
                    }
                    else{
                        toTableId=part.data.tableId;
                    }
                }
            });*/

            /*this.tableRelationDiagram.model.startTransaction("flash");
            this.tableRelationDiagram.model.addLinkData({
                lineId:"1",
                from:"T_S_S_O___A_U_T_H_O_R_I_T_Y",
                to:"T_S_S_O___R_O_L_E",
                fromText:"100_TSSO_ROLE",
                toText:"101_TSSO_USER_ROLE",
            });
            this.tableRelationDiagram.model.addLinkData({
                lineId:"2",
                from:"T_S_S_O___R_O_L_E",
                to:"T_S_S_O___R_O_L_E___G_R_O_U_P",
                fromText:"101_TSSO_USER_ROLE",
                toText:"102_TSSO_AUTHORITY",
            });
            this.tableRelationDiagram.model.commitTransaction("flash");*/
            /*fromTableId="T_S_S_O___R_O_L_E";
            toTableId="T_S_S_O___R_O_L_E___G_R_O_U_P";

            this.$refs.tableRelationConnectTwoTableDialog.beginSelectConnect(fromTableId,toTableId);*/

            this.tableRelationDiagram.model.startTransaction("flash");
             var lineData= {
                 lineId: StringUtility.Guid(),
                 from: connectData.from.tableId,
                 to: connectData.to.tableId,
                 fromText: connectData.from.text,
                 toText: connectData.to.text,
             };
            this.tableRelationDiagram.model.addLinkData(lineData);
            this.tableRelationDiagram.model.commitTransaction("flash");
        },
        saveModelToServer:function () {
            //alert(this.recordId);
            if(this.recordId) {
                var sendData = {
                    recordId: this.recordId,
                    relationContent:JsonUtility.JsonToString(this.getDataJson()),
                    relationDiagramJson: this.getDiagramJson()
                };
                //var _self=this;
                AjaxUtility.Post(this.acInterface.saveDiagram, sendData, function (result) {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }, "json");
            }
        },
        initDiagram:function(){
            var _self=this;

            if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make;  // for conciseness in defining templates
            //alert("1");
            this.tableRelationDiagram =
                $(go.Diagram, "tableRelationDiagramDiv",
                    {
                        allowDelete: true,
                        allowCopy: false,
                        layout: $(go.ForceDirectedLayout,{isOngoing: false}),
                        /*initialContentAlignment: go.Spot.Center,*/
                        "undoManager.isEnabled": true/*,
                        initialPosition:new go.Point(0,0)*/
                    });
            var tableRelationDiagram=this.tableRelationDiagram;

            // define several shared Brushes

            var lightgrad = $(go.Brush, "Linear", { 1: "#E6E6FA", 0: "#FFFAF0" });

            // the template for each attribute in a node's array of item data
            var itemTempl =
                $(go.Panel, "Horizontal",
                    $(go.Shape,
                        { desiredSize: new go.Size(10, 10) },
                        new go.Binding("figure", "figure"),
                        new go.Binding("fill", "color")),
                    $(go.TextBlock,
                        {
                            stroke: "#333333",
                            font: "bold 14px sans-serif"
                        },
                        new go.Binding("text", "displayText"))
                );

            // define the Node template, representing an entity
            tableRelationDiagram.nodeTemplate =
                $(go.Node, "Auto",  // the whole node panel
                    {
                        selectionAdorned: true,
                        resizable: true,
                        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
                        fromSpot: go.Spot.AllSides,
                        toSpot: go.Spot.AllSides,
                        isShadowed: true,
                        shadowColor: "#C5C1AA",
                        doubleClick: function(e, node) {
                            //console.log(node);
                            //alert(node.data.key);
                            var url = BaseUtility.BuildView(_self.acInterface.tableView, {
                                "op": "view",
                                "recordId": node.data.tableId
                            });
                            DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "表设计"}, 0);
                        }
                    },
                    new go.Binding("location", "loc", go.Point.parse),
                    // whenever the PanelExpanderButton changes the visible property of the "LIST" panel,
                    // clear out any desiredSize set by the ResizingTool.
                    new go.Binding("desiredSize", "visible", function(v) { return new go.Size(NaN, NaN); }).ofObject("LIST"),
                    // define the node's outer shape, which will surround the Table
                    $(go.Shape, "RoundedRectangle",
                        { fill: lightgrad, stroke: "#756875", strokeWidth: 1 }),
                    $(go.Panel, "Table",
                        { margin: 8, stretch: go.GraphObject.Fill },
                        $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
                        // the table header
                        $(go.TextBlock,
                            {
                                row: 0, alignment: go.Spot.Center,
                                margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
                                font: "bold 16px sans-serif"
                            },
                            new go.Binding("text", "tableDisplayText")),
                        // the collapse/expand button
                        $("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
                            { row: 0, alignment: go.Spot.TopRight }),
                        // the list of Panels, each showing an attribute
                        $(go.Panel, "Vertical",
                            {
                                name: "LIST",
                                row: 1,
                                padding: 3,
                                alignment: go.Spot.TopLeft,
                                defaultAlignment: go.Spot.Left,
                                stretch: go.GraphObject.Horizontal,
                                itemTemplate: itemTempl
                            },
                            new go.Binding("itemArray", "fields"))
                    )  // end Table Panel
                );  // end Node

            // define the Link template, representing a relationship
            tableRelationDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                    {
                        selectionAdorned: true,
                        layerName: "Foreground",
                        reshapable: true,
                        routing: go.Link.AvoidsNodes,
                        corner: 5,
                        curve: go.Link.JumpOver
                    },
                    $(go.Shape,  // the link shape
                        { stroke: "#303B45", strokeWidth: 1.5 }),
                    $(go.TextBlock,  // the "from" label
                        {
                            textAlign: "center",
                            font: "bold 14px sans-serif",
                            stroke: "#1967B3",
                            segmentIndex: 0,
                            segmentOffset: new go.Point(NaN, NaN),
                            segmentOrientation: go.Link.OrientUpright
                        },
                        new go.Binding("text", "fromText")),
                    $(go.TextBlock,  // the "to" label
                        {
                            textAlign: "center",
                            font: "bold 14px sans-serif",
                            stroke: "#1967B3",
                            segmentIndex: -1,
                            segmentOffset: new go.Point(NaN, NaN),
                            segmentOrientation: go.Link.OrientUpright
                        },
                        new go.Binding("text", "toText"))
                );
        },
        loadRelationDetailData:function(){
            var _self=this;
            AjaxUtility.Post(this.acInterface.getSingleDiagramData, {recordId:this.recordId,op:"Edit"}, function (result) {
                //console.log(result);
                if(result.success){
                    if(result.data.relationContent) {
                        var dataJson = JsonUtility.StringToJson(result.data.relationContent);
                        console.log(dataJson);
                        _self.setDataJson(dataJson);
                        _self.convertToFullJson(dataJson,_self.drawObjInDiagram)
                    }
                }
                else{
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, "json");
        },
        drawObjInDiagram:function(fullJson){

            //if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make;  // for conciseness in defining templates

            var bluegrad = $(go.Brush, "Linear", { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
            var greengrad = $(go.Brush, "Linear", { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
            var redgrad = $(go.Brush, "Linear", { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
            var yellowgrad = $(go.Brush, "Linear", { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
            var linkDataArray = fullJson.lineList;
            //alert("1");
            //console.log(fullJson);
            this.tableRelationDiagram.model = $(go.GraphLinksModel,
                {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    nodeDataArray: fullJson.tableList/*,
                    linkDataArray: linkDataArray*/
                });

            var _self=this;
            window.setTimeout(function () {
                //_self.connectSelectionNode();
                _self.tableRelationDiagram.model.startTransaction("flash");
                for(var i=0;i<fullJson.lineList.length;i++){
                    var lineData= fullJson.lineList[i];
                    _self.tableRelationDiagram.model.addLinkData(lineData);
                }
                _self.tableRelationDiagram.model.commitTransaction("flash");
            },500);

        },
        convertToFullJson:function(simpleJson,func){
            //将simpleJson装换为fullJson;
            var fullJson=JsonUtility.CloneSimple(simpleJson);
            var tableIds = new Array();
            for(var i=0;i<simpleJson.tableList.length;i++){
                tableIds.push(simpleJson.tableList[i].tableId);
            }
            var _self=this;
            //debugger;
            AjaxUtility.Post(this.acInterface.getTablesFieldsByTableIds,{"tableIds":tableIds},function (result) {
                if(result.success){
                    var allFields=result.data;
                    var allTables=result.exKVData.Tables;

                    for(var i=0;i<fullJson.tableList.length;i++){
                        var singleTableData=_self.getSingleTableData(allTables,fullJson.tableList[i].tableId);
                        fullJson.tableList[i].tableData=singleTableData;
                        fullJson.tableList[i].tableName=singleTableData.tableName;
                        fullJson.tableList[i].tableCaption=singleTableData.tableCaption;
                        fullJson.tableList[i].tableDisplayText=singleTableData.displayText;
                        var singleTableFieldsData=_self.getSingleTableFieldsData(allFields,fullJson.tableList[i].tableId);
                        fullJson.tableList[i].fields=singleTableFieldsData;
                        fullJson.tableList[i].key=fullJson.tableList[i].tableId;
                    }
                    //console.log(fullJson);
                    _self.drawObjInDiagram(fullJson);

                }
                else{
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
                //console.log(result);
            },"json");
        },
        getSingleTableData:function(allTables,tableId){
            for(var i=0;i<allTables.length;i++){
                if(allTables[i].tableId==tableId){
                    allTables[i].displayText=allTables[i].tableName+"["+allTables[i].tableCaption+"]";
                    //console.log(allTables[i]);
                    return allTables[i];
                }
            }
            return null;
        },
        getSingleTableFieldsData:function(allFields,tableId){
            var result=[];
            for(var i=0;i<allFields.length;i++){
                if(allFields[i].fieldTableId==tableId){
                    allFields[i].displayText=allFields[i].fieldName+"["+allFields[i].fieldCaption+"]";
                    result.push(this.rendererFieldStyle(allFields[i]));
                }
            }
            return result;
        },
        rendererFieldStyle:function(field){
            if(field.fieldIsPk=="是"){
                field.color=this.getKeyFieldBrush();
                field.figure="Decision";
            }
            else{
                field.color=this.getNorFieldBrush();
                field.figure="Cube1";
            }
            return field;
        },
        getKeyFieldBrush:function(){
            return go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
        },
        getNorFieldBrush:function(){
            return go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
        },
        getDataJson:function () {
            var dataJson={
                tableList:[],
                lineList:[]
            };
            this.tableRelationDiagram.nodes.each(function (part) {
                if (part instanceof go.Node) {
                    dataJson.tableList.push({
                        tableId:part.data.tableId,
                        loc:part.location.x+" "+part.location.y
                    })
                }
                else if (part instanceof go.Link) {
                    alert("line");
                }
            });
            this.tableRelationDiagram.links.each(function (part) {
                if (part instanceof go.Link) {
                    dataJson.lineList.push({
                        lineId:part.data.lineId,
                        from:part.data.from,
                        to:part.data.to,
                        fromText:part.data.fromText,
                        toText:part.data.toText,
                    })
                }
            });
            return dataJson;
        },
        setDataJson:function (json) {
            /*var json= {
                tableList: [
                    {
                        tableId: "T_S_S_O___A_U_T_H_O_R_I_T_Y",
                        loc:"-442.56007570334174 -177.30728902591756"
                    },
                    {
                        tableId: "T_S_S_O___R_O_L_E",
                        loc:"74.57063403264958 66.25488464739941"
                    },
                    {
                        tableId: "T_S_S_O___R_O_L_E___G_R_O_U_P",
                        loc:"599.883570676006 -101.30323462238496"
                    }
                ],
                lineList: [
                    {
                        lineId:"1",
                        from:"T_S_S_O___A_U_T_H_O_R_I_T_Y",
                        to:"T_S_S_O___R_O_L_E",
                        fromText:"100_TSSO_ROLE",
                        toText:"101_TSSO_USER_ROLE",
                    },
                    {
                        lineId:"2",
                        from:"T_S_S_O___R_O_L_E",
                        to:"T_S_S_O___R_O_L_E___G_R_O_U_P",
                        fromText:"101_TSSO_USER_ROLE",
                        toText:"102_TSSO_AUTHORITY",
                    }
                ]
            }*/
            //console.log(json);
            this.formatJson=json;
        },
        getDiagramJson:function () {
            return this.tableRelationDiagram.model.toJson();
        },
        alertDataJson:function () {
            var dataJson=this.getDataJson();
            DialogUtility.AlertJsonCode(dataJson);
        },
        alertDiagramJson:function () {
            var diagramJson=this.getDiagramJson();
            DialogUtility.AlertJsonCode(diagramJson);
        },
        tableIsExistInDiagram:function (tableId) {
            var result=false;
            this.tableRelationDiagram.nodes.each(function (part) {
                if (part instanceof go.Node) {
                    if(part.data.tableId==tableId){
                        result=true;
                    }
                }
            });
            return result;
        },
        downLoadModelPNG:function () {
            function myCallback(blob) {
                var url = window.URL.createObjectURL(blob);
                var filename = "myBlobFile1.png";

                var a = document.createElement("a");
                a.style = "display: none";
                a.href = url;
                a.download = filename;

                // IE 11
                if (window.navigator.msSaveBlob !== undefined) {
                    window.navigator.msSaveBlob(blob, filename);
                    return;
                }

                document.body.appendChild(a);
                requestAnimationFrame(function() {
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                });
            }
            var blob = this.tableRelationDiagram.makeImageData({
                background: "white",
                returnType: "blob",
                scale: 1,
                callback: myCallback });

            /*var img = this.tableRelationDiagram.makeImage({scale: 1,});
            var url = img.src;
            var a = document.createElement('a');
            var event = new MouseEvent('click');
            a.download = '下载图片名称';
            a.href = url;
            a.dispatchEvent(event);*/
        }
    },
    template: `<div ref="relationContentOuterWrap" class="table-relation-content-outer-wrap">
                    <div class="table-relation-content-header-wrap">
                        <div class="table-relation-desc-outer-wrap" v-if="displayDesc">
                            <div class="table-relation-desc">
                                备注：{{relation.relationDesc}}
                            </div>
                        </div>
                        <div class="table-relation-op-buttons-outer-wrap">
                            <div class="table-relation-op-buttons-inner-wrap">
                                <button-group shape="circle">
                                    <i-button @click="showSelectTableDialog" type="success" icon="md-add"></i-button>
                                    <i-button @click="showSelectFieldConnectDialog" type="primary" icon="logo-steam">连接</i-button>
                                    <i-button disabled type="primary" icon="md-return-left">引入</i-button>
                                    <i-button disabled type="primary" icon="md-qr-scanner">全屏</i-button>
                                    <i-button disabled type="primary" icon="md-git-compare">历史</i-button>
                                    <i-button @click="alertDataJson" type="primary" icon="md-code">数据Json</i-button>
                                    <i-button @click="alertDiagramJson" type="primary" icon="md-code-working">图形Json</i-button>
                                    <i-button @click="downLoadModelPNG" type="primary" icon="md-cloud-download">下载</i-button>
                                    <i-button @click="saveModelToServer" type="primary" icon="logo-instagram">保存</i-button>
                                    <i-button @click="deleteSelection" type="primary" icon="md-close"></i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                    <div class="table-relation-content-wrap" id="tableRelationDiagramDiv"></div>
                    <select-single-table-dialog ref="selectSingleTableDialog" @on-selected-table="addTableToDiagram"></select-single-table-dialog>
                    <table-relation-connect-two-table-dialog ref="tableRelationConnectTwoTableDialog" @on-completed-connect="connectSelectionNode"></table-relation-connect-two-table-dialog>
                </div>`
});
