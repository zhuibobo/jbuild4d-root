//列表页面处理工具类
var ListPageUtility={
    DefaultListHeight:function(){
        //alert(PageStyleUtility.GetPageHeight());
        if(PageStyleUtility.GetPageHeight()>780)
        {
            return 678;
        }
        else if(PageStyleUtility.GetPageHeight()>680){
            return 578;
        }
        else {
            return 378;
        }
    },
    DefaultListHeight_50:function(){
        return this.DefaultListHeight()-50;
    },
    DefaultListHeight_80:function(){
        return this.DefaultListHeight()-80;
    },
    DefaultListHeight_100:function(){
        return this.DefaultListHeight()-100;
    },
    GetGeneralPageHeight:function (fixHeight) {
        var pageHeight=jQuery(document).height();
        //alert(pageHeight);
        //alert(pageHeight);
        //debugger;
        if($("#list-simple-search-wrap").length>0){
            //alert($("#list-button-wrap").height()+"||"+$("#list-simple-search-wrap").outerHeight());
            pageHeight=pageHeight-$("#list-simple-search-wrap").outerHeight()+fixHeight-$("#list-button-wrap").outerHeight()-$("#list-pager-wrap").outerHeight()-30;
        }
        else {
            pageHeight=pageHeight-$("#list-button-wrap").outerHeight()+fixHeight-($("#list-pager-wrap").length>0?$("#list-pager-wrap").outerHeight():0)-30;
        }
        //alert(pageHeight);
        return pageHeight;
    },
    GetFixHeight:function () {
        return -70;
    },
    IViewTableRenderer:{
        ToDateYYYY_MM_DD:function (h,datetime) {
            //debugger;
            var date=new Date(datetime);
            var dateStr=DateUtility.Format(date,'yyyy-MM-dd');
            //var dateStr=datetime.split(" ")[0];
            return h('div',dateStr);
        },
        StringToDateYYYY_MM_DD:function (h,datetime) {
            //debugger;
            //debugger;
            //var date=new Date(datetime);
            //var dateStr=DateUtility.Format(date,'yyyy-MM-dd');
            var dateStr=datetime.split(" ")[0];
            return h('div',dateStr);
        },
        ToStatusEnable:function (h,status) {
            if(status==0){
                return h('div',"禁用");
            }
            else if(status==1){
                return h('div',"启用");
            }
        },
        ToYesNoEnable:function (h,status) {
            if(status==0){
                return h('div',"否");
            }
            else if(status==1){
                return h('div',"是");
            }
        },
        ToDictionaryText:function (h,dictionaryJson,groupValue,dictionaryValue) {
            //debugger;
            var simpleDictionaryJson=DictionaryUtility.GroupValueListJsonToSimpleJson(dictionaryJson);
            if(dictionaryValue==null||dictionaryValue==""){
                return h('div', "");
            }
            if(simpleDictionaryJson[groupValue]!=undefined) {
                if (simpleDictionaryJson[groupValue]) {
                    if(simpleDictionaryJson[groupValue][dictionaryValue]) {
                        return h('div', simpleDictionaryJson[groupValue][dictionaryValue]);
                    }
                    else {
                        return h('div', "找不到装换的TEXT");
                    }
                }
                else {
                    return h('div', "找不到装换的分组");
                }
            }
            else {
                return h('div', "找不到装换的分组");
            }
        }
    },
    IViewTableMareSureSelected:function (selectionRows) {
        if(selectionRows!=null&&selectionRows.length>0) {
            return {
                then:function (func) {
                    func(selectionRows);
                }
            }
        }
        else{
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行!", null);
            return {
                then:function (func) {
                }
            }
        }
    },
    IViewTableMareSureSelectedOne:function (selectionRows) {
        if(selectionRows!=null&&selectionRows.length>0&&selectionRows.length==1) {
            return {
                then:function (func) {
                    func(selectionRows);
                }
            }
        }
        else{
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行，每次只能选中一行!", null);
            return {
                then:function (func) {
                }
            }
        }
    },
    IViewChangeServerStatus:function (url,selectionRows,idField, statusName,pageAppObj) {
        var idArray=new Array();
        for (var i=0;i<selectionRows.length;i++){
            idArray.push(selectionRows[i][idField]);
        }
        AjaxUtility.Post(url,
            {
                ids: idArray.join(";"),
                status: statusName
            },
            function (result) {
                if (result.success) {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                    });
                    pageAppObj.reloadData();
                }
                else{
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},result.message,null);
                }
            }, "json"
        );
    },
    //上下移动封装
    IViewMoveFace:function (url,selectionRows,idField, type,pageAppObj) {
        this.IViewTableMareSureSelectedOne(selectionRows).then(function (selectionRows) {
            //debugger;
            AjaxUtility.Post(url,
                {
                    recordId: selectionRows[0][idField],
                    type: type
                },
                function (result) {
                    if (result.success) {
                        pageAppObj.reloadData();
                    }
                    else{
                        DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},result.message,null);
                    }
                }, "json"
            );
        });
    },
    //改变状态封装
    IViewChangeServerStatusFace:function (url,selectionRows,idField, statusName,pageAppObj) {
        this.IViewTableMareSureSelected(selectionRows).then(function (selectionRows) {
            ListPageUtility.IViewChangeServerStatus(url,selectionRows,idField,statusName,pageAppObj);
        });
    },
    IViewTableDeleteRow:function (url, recordId,pageAppObj) {
        DialogUtility.Confirm(window, "确认要删除当前记录吗？", function () {
            AjaxUtility.Delete(url, {recordId: recordId}, function (result) {
                if (result.success) {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                        pageAppObj.reloadData();
                    });
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, "json");
        });
    },

    IViewTableLoadDataSearch:function (url,pageNum,pageSize,searchCondition,pageAppObj,idField,autoSelectedOldRows,successFunc,loadDict) {
        //var loadDict=false;
        //if(pageNum===1) {
        //    loadDict = true;
        //}
        if(loadDict==undefined||loadDict==null){
            loadDict=false;
        }
        //debugger;
        AjaxUtility.Post(url,
            {
                "pageNum": pageNum,
                "pageSize": pageSize,
                "searchCondition":SearchUtility.SerializationSearchCondition(searchCondition),
                "loadDict":loadDict
            },
            function (result) {
                if (result.success) {
                    if(typeof (successFunc)=="function") {
                        successFunc(result,pageAppObj);
                    }
                    pageAppObj.tableData = new Array();
                    pageAppObj.tableData = result.data.list;
                    pageAppObj.pageTotal = result.data.total;
                    if(autoSelectedOldRows){
                        if(pageAppObj.selectionRows!=null) {
                            for (var i = 0; i < pageAppObj.tableData.length; i++) {
                                for (var j = 0; j < pageAppObj.selectionRows.length;j++) {
                                    if(pageAppObj.selectionRows[j][idField]==pageAppObj.tableData[i][idField]){
                                        pageAppObj.tableData[i]._checked=true;
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    DialogUtility.AlertError(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, "json");
    },
    IViewTableLoadDataNoSearch:function (url,pageNum,pageSize,pageAppObj,idField,autoSelectedOldRows,successFunc) {
        //debugger;
        AjaxUtility.Post(url,
            {
                pageNum: pageNum,
                pageSize: pageSize
            },
            function (result) {
                if (result.success) {
                    pageAppObj.tableData = new Array();
                    pageAppObj.tableData = result.data.list;
                    pageAppObj.pageTotal = result.data.total;
                    if(autoSelectedOldRows){
                        if(pageAppObj.selectionRows!=null) {
                            for (var i = 0; i < pageAppObj.tableData.length; i++) {
                                for (var j = 0; j < pageAppObj.selectionRows.length;j++) {
                                    if(pageAppObj.selectionRows[j][idField]==pageAppObj.tableData[i][idField]){
                                        pageAppObj.tableData[i]._checked=true;
                                    }
                                }
                            }
                        }
                    }
                    if(typeof (successFunc)=="function") {
                        successFunc(result,pageAppObj);
                    }
                }
            }, "json");
    },
    IViewTableInnerButton:{
        ViewButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button view",
                on: {
                    click: function () {
                        //debugger;
                        pageAppObj.view(params.row[idField],params);
                    }
                }
            });
        },
        EditButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button edit",
                on: {
                    click: function () {
                        //this;
                        //debugger;
                        pageAppObj.edit(params.row[idField],params);
                    }
                }
            });
        },
        DeleteButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button del",
                on: {
                    click: function () {
                        //debugger;
                        pageAppObj.del(params.row[idField],params);
                    }
                }
            });
        },
        MoveUpButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button move-up",
                on: {
                    click: function () {
                        //debugger;
                        pageAppObj.moveUp(params.row[idField],params);
                    }
                }
            });
        },
        MoveDownButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button move-down",
                on: {
                    click: function () {
                        //debugger;
                        pageAppObj.moveDown(params.row[idField],params);
                    }
                }
            });
        },
        SelectedButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button selected",
                on: {
                    click: function () {
                        //debugger;
                        pageAppObj.selected(params.row[idField],params);
                    }
                }
            });
        }
    }
}