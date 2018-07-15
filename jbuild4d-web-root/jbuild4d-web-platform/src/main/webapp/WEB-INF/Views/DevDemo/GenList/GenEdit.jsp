<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/15
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/Views/TagLibs/TagLib.jsp" %>
<html>
<head>
    <title>Title</title>
    <%@ include file="/WEB-INF/Views/TagLibs/GeneralLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/IViewLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/JQueryUILib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
</head>
<body>
<div id="appForm" class="general-edit-page-wrap" v-cloak>
    <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <form-item label="ddglValue：" prop="ddglValue">
            <i-input v-model="formValidate.ddglValue"></i-input>
        </form-item>
        <form-item label="ddglName：" prop="ddglName">
            <i-input v-model="formValidate.ddglName"></i-input>
        </form-item>
        <form-item label="ddglCreatetime：">
            <date-picker type="date" placeholder="选择创建时间" v-model="formValidate.ddglCreatetime" disabled readonly></date-picker>
        </form-item>
        <form-item label="dictGroupDesc：">
            <i-input v-model="formValidate.dictGroupDesc" type="textarea" :autosize="{minRows: 3,maxRows: 3}"></i-input>
        </form-item>
        <form-item class="general-edit-page-bottom-wrap">
            <i-button type="primary" v-if="status!='view'" @click="handleSubmit('formValidate')"> 保 存</i-button>
            <i-button type="ghost" @click="handleClose('formValidate')" style="margin-left: 8px"> 关 闭</i-button>
        </form-item>
    </i-form>
</div>

<script>
    var appForm =new Vue({
        el: "#appForm",
        mounted:function () {
           if(this.status=="view") {
               DetailPageUtility.IViewPageToViewSatatus();
           }
        },
        data: {
            formValidate: {
                ddglId: '${recordId}',
                ddglValue: '${entity.ddglValue}',
                ddglName: '${entity.ddglName}',
                ddglCreatetime: '<fmt:formatDate value="${entity.ddglCreatetime}" pattern="yyyy-MM-dd" />' == '' ? JB4D.DateUtility.GetCurrentDataString("-") : '<fmt:formatDate value="${entity.ddglCreatetime}" pattern="yyyy-MM-dd" />',
                ddglDesc: '${entity.ddglDesc}'
            },
            ruleValidate: {
                ddglValue: [
                    {required: true, message: '【ddglValue】不能空！', trigger: 'blur'}
                ],
                ddglName: [
                    {required: true, message: '【ddglName】不能空！', trigger: 'blur'}
                ]
            },
            status: '${op}'
        },
        methods: {
            handleSubmit: function (name) {
                var _self = this;
                this.$refs[name].validate(function (valid) {
                    if (valid) {
                        var sendData = JSON.stringify(_self.formValidate);
                        //debugger;
                        var url = '/PlatForm/DevDemo/DevDemoGenList/SaveEdit.do';
                        AjaxUtility.PostRequestBody(url, sendData, function (result) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                //debugger;
                                window.OpenerWindowObj.app.reloadData();
                                DialogUtility.Frame_CloseDialog(window);
                            });
                        }, "json");
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleClose: function (name) {
                DialogUtility.Frame_CloseDialog(window);
            }
        }
    });
</script>
</body>
</html>
