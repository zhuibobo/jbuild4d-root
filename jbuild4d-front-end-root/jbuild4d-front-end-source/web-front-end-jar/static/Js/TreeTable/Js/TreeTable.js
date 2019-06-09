/**
 * Created by zhuangrb on 2018/8/18.
 */
var TreeTable={
    _$Prop_TableElem: null,
    _$Prop_RendererToElem: null,
    _Prop_Config:null,
    _Prop_JsonData:null,
    _Prop_AutoOpenLevel:0,
    _Prop_FirstColumn_Inden:20,
    _Prop_CurrentSelectedRowId:null,
    Initialization: function (_config) {
        this._Prop_Config=_config;
        this._$Prop_RendererToElem = $("#" + this._Prop_Config.RendererTo);
        this._$Prop_TableElem = this.CreateTable();
        this._$Prop_TableElem.append(this.CreateTableTitleRow());
        this._$Prop_RendererToElem.append(this._$Prop_TableElem);
    },

    LoadJsonData:function(jsonDatas){
        if (jsonDatas != null && jsonDatas != undefined) {
            this._Prop_JsonData=jsonDatas;
            this._Prop_AutoOpenLevel=this._Prop_Config.OpenLevel;

            var rowId=this._GetRowDataId(jsonDatas);
            this._CreateRootRow(jsonDatas,rowId);
            this._LoopCreateRow(jsonDatas,jsonDatas.Nodes,1,rowId);
            this.RendererStyle();
        }
        else {
            alert("Json Data Object Error");
        }
    },
    _CreateRootRow:function(parentjsonNode,parentIdList){
        var rowElem=this.CreateRowElem(parentjsonNode,0,null,true,parentIdList);
        this._$Prop_TableElem.append(rowElem);

        this.SetJsonDataExtendAttr_CurrentLevel(parentjsonNode,0);
        this.SetJsonDataExtendAttr_ParentIdList(parentjsonNode,parentIdList);
    },
    _LoopCreateRow:function(parentjsonNode,jsonNodeArray,currentLevel,parentIdList){
        this._Prop_Config.IsOpenALL;
        if(jsonNodeArray != undefined) {
            for (var i = 0; i < jsonNodeArray.length; i++) {
                var item = jsonNodeArray[i];

                //item._Extend_CurrentLevel=currentLevel;
                //var _cl=currentLevel;

                var rowIsOpen = this._TestRowIsOpen(currentLevel);
                var rowId = this._GetRowDataId(item);
                var _pIdList = this._CreateParentIdList(parentIdList, rowId);

                this.SetJsonDataExtendAttr_CurrentLevel(item, currentLevel);
                this.SetJsonDataExtendAttr_ParentIdList(item, _pIdList);

                var rowElem = this.CreateRowElem(item, currentLevel, parentjsonNode, rowIsOpen, _pIdList);
                this._$Prop_TableElem.append(rowElem);
                if (item.Nodes != undefined && item.Nodes != null && item.Nodes.length > 0) {
                    var _tp = currentLevel + 1;
                    this._LoopCreateRow(item, item.Nodes, _tp, _pIdList);
                }
            }
        }
    },

    CreateTable:function(){
        var _C = this._Prop_Config;
        var _editTable = $("<table />");
        _editTable.addClass(_C.TableClass);
        _editTable.attr("Id", _C.TableId);
        _editTable.attr(_C.TableAttrs);
        return _editTable;
    },

    SetJsonDataExtendAttr_CurrentLevel:function(jsonData,value){
        jsonData._Extend_CurrentLevel=value;
    },

    GetJsonDataExtendAttr_CurrentLevel:function(jsonData){
        return jsonData._Extend_CurrentLevel;
    },

    SetJsonDataExtendAttr_ParentIdList:function(jsonData,value){
        jsonData._Extend_ParentIdList=value;
    },

    GetJsonDataExtendAttr_ParentIdList:function(jsonData){
        return jsonData._Extend_ParentIdList;
    },

    //创建表头
    CreateTableTitleRow: function () {
        var _C = this._Prop_Config;
        var _thead = $("<thead>\
                                <tr isHeader='true' />\
                            </thead>");
        var _titleRow=_thead.find("tr");
        for (var i = 0; i < _C.Templates.length; i++) {
            var template = _C.Templates[i];
            var title = template.Title;
            var th = $("<th>" + title + "</th>");
            if (template.TitleCellClassName) {
                th.addClass(template.TitleCellClassName);
            }
            if (template.TitleCellAttrs) {
                th.attr(template.TitleCellAttrs);
            }
            if(typeof (template.Hidden) != 'undefined' && template.Hidden==true){
                th.hide();
            }
            if(template.Style){
                th.css(template.Style)
            }
            _titleRow.append(th);
        }
        return _thead;
    },

    /*
    *
    * parentIdList 包含自身id※id※id
    * */
    CreateRowElem:function(rowData,currentLevel,parentRowData,rowIsOpen,parentIdList){
        //alert(currentLevel);
        //alert(currentLevel);
        var _c=this._Prop_Config;
        var $tr=$("<tr />");
        var elemId=this._CreateElemId(rowData);
        var rowId=this._GetRowDataId(rowData);
        var prowId=this._CreateParentRowId(parentRowData);
        $tr.attr("rowId",rowId).attr("pid",prowId).attr("id",elemId).attr("currentLevel",currentLevel).attr("isdatarow","true");
        //$tr;

        var _testfield=_c.ChildTestField;
        var hasChild=rowData[_testfield];
        if(hasChild==true||hasChild=="true"||hasChild>0){
            $tr.attr("hasChild","true");
        }
        $tr.attr("rowIsOpen",rowIsOpen).attr("parentIdList",parentIdList);

        for(var i=0;i<_c.Templates.length;i++) {
            var _cc = _c.Templates[i];
            var _cd = rowData[_cc.FieldName];
            var _width=_cc.Width;
            var _renderer=_cc.Renderer;
            //debugger;
            var $td=$("<td bindField=\""+_cc.FieldName+"\" Renderer='"+_renderer+"'>" + _cd + "</td>").css("width",_width);
            if(_renderer=="DateTime"){
                var date=new Date(_cd);
                var dateStr=DateUtility.Format(date,'yyyy-MM-dd');
                $td.text(dateStr);
            }
            if(_cc.TextAlign){
                $td.css("textAlign",_cc.TextAlign);
            }

            if (i == 0) {
                //$td=$("<td></td>").append(this._CreateRowSwitchElem(hasChild,rowIsOpen,rowId)).append(_cd);
                //$td.css("padding-left",this._Prop_FirstColumn_Inden*currentLevel);
            }
            if(typeof (_cc.Hidden) != 'undefined' && _cc.Hidden==true){
                $td.hide();
            }
            if(typeof (_cc.Style) != 'undefined') {
                $td.css(_cc.Style);
            }
            $tr.append($td);
        }

        //Row Event
        var _self=this;
        $tr.bind("click",null,function(event){
            $(".tr-selected").removeClass("tr-selected");
            $(this).addClass("tr-selected");
            _self._Prop_CurrentSelectedRowId=$(this).attr("rowId");
            if(typeof (_c.ClickRowEvent) !=='undefined' && typeof (_c.ClickRowEvent)== 'function') {
                _c.ClickRowEvent(rowId);
            }
        });

        $tr.hover(function(){
            if(!$(this).hasClass("tr-selected")){
                $(this).addClass("tr-hover");
            }
        },function(){
            $(".tr-hover").removeClass("tr-hover");
        })

        return $tr;
    },

    _TestRowIsOpen:function(currentLevel){
        if(this._Prop_Config.OpenLevel>currentLevel){
            return true;
        }
        return false;
    },

    _CreateElemId:function(rowData){
        var rowIdPrefix="";
        if(this._Prop_Config.RowIdPrefix!=undefined&&this._Prop_Config.RowIdPrefix!=undefined!=null) {
            rowIdPrefix = this._Prop_Config.RowIdPrefix;
        }
        return rowIdPrefix+this._GetRowDataId(rowData)
        /*var idField=this._Prop_Config.IdField;
        if(rowData[idField]!=undefined&&rowData[idField]!=null){
            return rowIdPrefix+rowData[idField];
        }
        else{
            alert("在数据源中找不到用于构建Id的字段，请检查配置及数据源");
            return null;
        }*/
    },

    _CreateParentIdList:function(parentIdList,rowId){
        return parentIdList+"※"+rowId;
    },

    _CreateParentIdListByParentJsonData:function(parentJsonData,selfJsonData){
        var parentIdList=this.GetJsonDataExtendAttr_ParentIdList(parentJsonData);
        //alert(parentIdList);
        var rowId=this._GetRowDataId(selfJsonData);
        return this._CreateParentIdList(parentIdList,rowId);
    },

    _GetRowDataId:function(rowData){
        var idField=this._Prop_Config.IdField;
        if(rowData[idField]!=undefined&&rowData[idField]!=null){
            return rowData[idField];
        }
        else{
            alert("在数据源中找不到用于构建Id的字段，请检查配置及数据源");
            return null;
        }
    },

    _CreateParentRowId:function(parentRowData){
        if(parentRowData==null){
            return "Root";
        }
        else {
            return this._GetRowDataId(parentRowData);
        }
    },

    RendererStyle:function(){
        var _self=this;
        $("tr[isdatarow='true']").each(function(){
            var $tr=$(this);
            var $firsttd=$(this).find("td:first");
            var rowid=$tr.attr("rowId");
            var sourceText=$firsttd.text();
            $firsttd.css("padding-left",_self._Prop_FirstColumn_Inden*parseInt($(this).attr("currentLevel")));

            var hasChild=false;
            if($tr.attr("hasChild")=="true"){
                hasChild=true;
            }
            var rowIsOpen=false;
            if($tr.attr("rowIsOpen")=="true"){
                rowIsOpen=true;
            }
            var switchElem=_self._CreateRowSwitchElem(hasChild,rowIsOpen,rowid);
            $firsttd.html("");
            $firsttd.append(switchElem).append("<span>"+sourceText+"</span>");
            if(!rowIsOpen){
                $("tr[pid='"+rowid+"']").hide();
            }
        })
    },
    _GetIndenClass:function(hasChild,isOpen){
        if(hasChild&&isOpen){
            return "img-switch-open";//-
        }
        if(hasChild&&!isOpen){
            return "img-switch-close";//+
        }
        if(!hasChild){
            return "img-switch-open";//-
        }
        return "img-switch-close";//+
    },
    _CreateRowSwitchElem:function(hasChild,isOpen,rowId){
        var elem=$("<div isswitch=\"true\"></div>");
        var cls=this._GetIndenClass(hasChild,isOpen);
        //elem.append(cls);
        elem.addClass(cls);
        var senddata={
            RowId:rowId
        };
        elem.bind("click",senddata,function(event){
            if(!hasChild){return;}
            var $tr=$(this).parent().parent();
            var rowid=$tr.attr("rowId");
            var rowIsOpen=false;
            if($tr.attr("rowIsOpen")=="true"){
                rowIsOpen=true;
            }
            if(rowIsOpen){
                rowIsOpen=false;//收缩
                $("tr[parentIdList*='"+rowid+"※']").hide();
                $(this).removeClass("img-switch-open").addClass("img-switch-close");
                //查找子孙节点，如果存在子节点的，则切换到收缩的状态；
                $("tr[parentIdList*='"+rowid+"※'][haschild='true']").find("[isswitch='true']").removeClass("img-switch-open").addClass("img-switch-close");
                $("tr[parentIdList*='"+rowid+"※'][haschild='true']").attr("rowisopen",false);
            }
            else {
                rowIsOpen=true;//展开
                $("tr[pid='"+rowid+"']").show();
                $(this).removeClass("img-switch-close").addClass("img-switch-open");
            }
            $tr.attr("rowIsOpen",rowIsOpen);
        });
        return elem;
    },

    GetChildsRowElem:function(loop,id){
        if(loop){
            return $("tr[parentIdList*='"+id+"']");
        }
        else {
           return $("tr[pid='"+id+"']");
        }
    },

    _Prop_SelectedRowData:null,
    _Prop_TempGetRowData:null,
    _GetSelectedRowData:function(node,id,isSetSelected){
        var fieldName=this._Prop_Config.IdField;
        var fieldValue=node[fieldName];
        if(fieldValue==id){
            if(isSetSelected){
                this._Prop_SelectedRowData=node;
            }
            else {
                this._Prop_TempGetRowData=node;
            }
        }
        else {
            if(node.Nodes!=undefined&&node.Nodes!=null) {
                for (var i = 0; i < node.Nodes.length; i++) {
                    this._GetSelectedRowData(node.Nodes[i], id,isSetSelected);
                }
            }
        }
    },
    // 获取选中行数据
    GetSelectedRowData:function(){
        if(this._Prop_CurrentSelectedRowId==null){
            //alert("当前没有选中的行！");
            return null;
        }
        //console.log(this._Prop_CurrentSelectedRowId);
        //console.log(this._Prop_JsonData);
        this._GetSelectedRowData(this._Prop_JsonData,this._Prop_CurrentSelectedRowId,true);
        return this._Prop_SelectedRowData;
    },
    GetRowDataByRowId:function(rowId){
        this._Prop_TempGetRowData=null;
        this._GetSelectedRowData(this._Prop_JsonData,rowId,false);
        return this._Prop_TempGetRowData;
    },

    AppendChildRowToCurrentSelectedRow:function(rowData){
        var selectedRowData=this.GetSelectedRowData();
        if(selectedRowData.Nodes!=undefined&&selectedRowData.Nodes!=null){
            selectedRowData.Nodes.push(rowData);
        }
        else {
            selectedRowData.Nodes=new Array();
            selectedRowData.Nodes.push(rowData);
        }
        this.SetJsonDataExtendAttr_CurrentLevel(rowData,this.GetJsonDataExtendAttr_CurrentLevel(selectedRowData)+1);
        this.SetJsonDataExtendAttr_ParentIdList(rowData,this._CreateParentIdListByParentJsonData(selectedRowData,rowData));

        var $tr=this.CreateRowElem(rowData,this.GetJsonDataExtendAttr_CurrentLevel(selectedRowData)+1,selectedRowData,true,this.GetJsonDataExtendAttr_ParentIdList(rowData));
        var selectedRowId=this._GetRowDataId(selectedRowData);
        var currentSelectElem=$("tr[rowId='"+selectedRowId+"']");
        currentSelectElem.attr("haschild","true");

        //var lastChilds=$("tr[pid='"+selectedRowId+"']:last");
        var lastChilds=$("tr[parentidlist*='"+selectedRowId+"※']:last");
        if(lastChilds.length>0){
            lastChilds.after($tr);
        }
        else {
            currentSelectElem.attr("rowisopen",true);
            currentSelectElem.after($tr);
        }

        //this._$Prop_TableElem.append($tr);
        this.RendererStyle();
    },

    UpdateToRow:function(rowId,rowData){
        var selectedRowData=this.GetRowDataByRowId(rowId);
        for(var attrName in rowData){
            if(attrName!="Nodes"){
                selectedRowData[attrName]=rowData[attrName];
            }
        }

        var rowId=this._GetRowDataId(selectedRowData);
        var $tr=$("tr[rowid='"+rowId+"']");
        $tr.find("td").each(function(){
            var bindField=$(this).attr("bindField");
            var newtext=selectedRowData[bindField];
            var renderer=$(this).attr("Renderer");
            if(renderer=="DateTime"){
                var date=new Date(newtext);
                newtext=DateUtility.Format(date,'yyyy-MM-dd');
            }
            if($(this).find("[isswitch='true']").length>0) {
                //$(this).text();
                $(this).find("span").text(newtext);
            }
            else {
                $(this).text(newtext);
            }
        });
    },

    LoadChildByAjax:function(){

    },

    DeleteRow:function(rowId){
        var hasChild=false;
        if($("tr[pid='"+rowId+"']").length>0){
            if(!this._Prop_Config.CanDeleteWhenHasChild){
                alert("指定的节点存在子节点，请先删除子节点！");
            }
        }
        //删除子孙节点
        //删除自己
        $("tr[parentidlist*='※"+rowId+"']").remove();
        // 删除以后没有选中的行
        this._Prop_CurrentSelectedRowId = null;
        //$("tr[pid='"+rowId+"']").remove();
    },

    MoveUpRow:function(rowId){
        //查找相同父ID的临近元素
        //将所有idlist符合规则的移动到该元素下

        //var thisidlist=$("tr[rowid='"+rowId+"']").attr("parentidlist");
        //var prevElem=null;
        /*for(var i=0;i<prevtrs.length;i++){
            //alert($(prevtrs[i]).attr("parentidlist"));
            if($(prevtrs[i]).attr("parentidlist").split('※').length==thisidlist.split('※').length) {
                prevElem=$(prevtrs[i]);
                break;
            }
        }*/

        var thistr=$("tr[rowid='"+rowId+"']");
        var pid=thistr.attr("pid");
        var neartr=$(thistr.prevAll("[pid='"+pid+"']")[0]);
        var movetrs=$("tr[parentidlist*='※"+rowId+"']");
        movetrs.insertBefore(neartr);
    },

    MoveDownRow:function(rowId){
        var thistr=$("tr[rowid='"+rowId+"']");
        var pid=thistr.attr("pid");
        var neartr=$(thistr.nextAll("[pid='"+pid+"']")[0]);
        //查找下一个tr的最后一个子孙tr
        var neartrrid=neartr.attr("rowid");
        var offtrs=$("tr[parentidlist*='※"+neartrrid+"']");
        var offlasttr=$(offtrs[offtrs.length-1]);
        var movetrs=$("tr[parentidlist*='※"+rowId+"']");
        movetrs.insertAfter(offlasttr);
    },

    GetBrothersNodeDatasByParentId:function (rowId) {
        //debugger;
        var thistr=$("tr[rowid='"+rowId+"']");
        var pid=thistr.attr("pid");
        var brotherstr=$(thistr.parent().find("[pid='"+pid+"']"));
        var result=new Array();
        for(var i=0;i<brotherstr.length;i++){
            result.push(this.GetRowDataByRowId($(brotherstr[i]).attr("rowid")));
        }
        return result;
    },

    // 移除所有行(不包括表头)
    RemoveAllRow : function(){
        if (this._$Prop_TableElem != null) {
            this._$Prop_TableElem.find("tr:not(:first)").each(function(){
                $(this).remove();
            });
        }
    },
}