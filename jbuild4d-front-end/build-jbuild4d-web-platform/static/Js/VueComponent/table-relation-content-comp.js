/*表关系内容*/
Vue.component("table-relation-content-comp", {
    props:["relation"],
    data: function () {
        return {
            tableRelationDiagram:null,
            displayDesc:true
        }
    },
    mounted:function(){
        //alert(PageStyleUtility.GetPageHeight());
        $(this.$refs.relationContentOuterWrap).css("height",PageStyleUtility.GetPageHeight()-75);
        this.init();
        if(PageStyleUtility.GetPageWidth()<1000){
            this.displayDesc=false;
            $(".table-relation-op-buttons-outer-wrap").css("width","100%");
        }
    },
    methods:{
        init:function () {
            if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make;  // for conciseness in defining templates
            //alert("1");
            this.tableRelationDiagram =
                $(go.Diagram, "tableRelationDiagramDiv",
                    {
                        allowDelete: true,
                        allowCopy: false,
                        layout: $(go.ForceDirectedLayout,{isOngoing: false}),
                        "undoManager.isEnabled": true
                    });
            var tableRelationDiagram=this.tableRelationDiagram;

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
            tableRelationDiagram.nodeTemplate =
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
                    new go.Binding("location", "loc", go.Point.parse),
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
                            new go.Binding("text", "name")),
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
                    name:"表",
                    items: [{ name: "就是不知道表", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "就是不知道表", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "就是不知道表", iskey: false, figure: "Decision", color: "purple" },
                        { name: "就是不知道表", iskey: false, figure: "Decision", color: "purple" }]
                },
                {
                    key: "Suppliers",
                    name:"表",
                    items: [{ name: "SupplierID", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "CompanyName", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "ContactName", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "Address", iskey: false, figure: "Cube1", color: bluegrad }]
                },
                {
                    key: "Categories",
                    name:"表",
                    items: [{ name: "CategoryID", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "CategoryName", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "Description", iskey: false, figure: "Cube1", color: bluegrad },
                        { name: "Picture", iskey: false, figure: "TriangleUp", color: redgrad }],
                    "loc": "-600.0094814408964 -104.49635001967278"
                },
                {
                    key: "Order Details",
                    name:"表",
                    items: [{ name: "OrderID", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "ProductID", iskey: true, figure: "Decision", color: yellowgrad },
                        { name: "UnitPrice", iskey: false, figure: "MagneticData", color: greengrad },
                        { name: "Quantity", iskey: false, figure: "MagneticData", color: greengrad },
                        { name: "Discount", iskey: false, figure: "MagneticData", color: greengrad }]
                },
            ];
            var linkDataArray = [
                { from: "Products", to: "Suppliers", text: "[ProductID]0..N", toText: "[Discount]1",items:[{cdata:"1"}],cdata:"1" },
                { from: "Products", to: "Categories", text: "[ProductID]0..N", toText: "[Discount]1",items:[{cdata:"1"}],cdata:"3" },
                { from: "Order Details", to: "Products", text: "[ProductID]0..N", toText: "[Discount]1",items:[{cdata:"1"}],cdata:"2" }
            ];
            tableRelationDiagram.model = $(go.GraphLinksModel,
                {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    nodeDataArray: nodeDataArray,
                    linkDataArray: linkDataArray
                });
        },
        addTable:function(){
            //DialogUtility.AlertText("1111111");
            this.$refs.selectSingleTableDialog.beginSelectTable();
        },
        selectedTable:function(tableData){
            console.log(tableData);
        },
        deleteSelection:function () {
            //debugger;
            if (this.tableRelationDiagram.commandHandler.canDeleteSelection()) {
                //alert("candel");
                this.tableRelationDiagram.commandHandler.deleteSelection();
                return;
            }
        },
        connectSelectionNode:function () {
            /*var statrData=null;
            var endData=null;

            var i=0;
            this.tableRelationDiagram.selection.each(function (part) {
                if (part instanceof go.Node) {
                    console.log(part.data);
                    if(i==0){
                        statrData=part.data;
                        i++;
                    }
                    else{
                        endData=part.data;
                    }
                }
                else if (part instanceof go.Link) {
                    console.log(part.data);
                }
            });*/

            this.tableRelationDiagram.model.startTransaction("flash");
            this.tableRelationDiagram.model.addLinkData({ from: "Categories", to: "Order Details", text: "[ProductID]0..N", toText: "[Discount]1",items:[{cdata:"1"}],cdata:"1" });
            this.tableRelationDiagram.model.commitTransaction("flash");
        },
        saveModel:function () {
            alert("location -202 -170");
            var node={
                key: "Order Details11111",
                loc:"-202 -170",
                items: [{ name: "OrderID", iskey: true, figure: "Decision" },
                    { name: "ProductID", iskey: true, figure: "Decision" },
                    { name: "UnitPrice", iskey: false, figure: "MagneticData" },
                    { name: "Quantity", iskey: false, figure: "MagneticData" },
                    { name: "Discount", iskey: false, figure: "MagneticData" }]
            };
            this.tableRelationDiagram.model.addNodeData(node);

            var json=this.tableRelationDiagram.model.toJson();
            console.log(json);
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
                                <radio-group type="button">
                                    <radio label="列名"></radio>
                                    <radio label="标题"></radio>
                                    <radio label="全部"></radio>
                                </radio-group>
                                <button-group shape="circle">
                                    <i-button @click="addTable" type="success" icon="md-add"></i-button>
                                    <i-button @click="saveModel" type="primary" icon="logo-instagram">保存</i-button>
                                    <i-button @click="connectSelectionNode" type="primary" icon="md-add">连接</i-button>
                                    <i-button @click="connectSelectionNode" type="primary" icon="md-return-left">引入</i-button>
                                    <i-button @click="connectSelectionNode" type="primary" icon="md-return-left">全屏</i-button>
                                    <i-button @click="connectSelectionNode" type="primary" icon="md-git-compare">历史</i-button>
                                    <i-button @click="deleteSelection" type="primary" icon="md-close"></i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                    <div class="table-relation-content-wrap" id="tableRelationDiagramDiv"></div>
                    <select-single-table-dialog ref="selectSingleTableDialog" @on-selected-table="selectedTable"></select-single-table-dialog>
                </div>`
});
