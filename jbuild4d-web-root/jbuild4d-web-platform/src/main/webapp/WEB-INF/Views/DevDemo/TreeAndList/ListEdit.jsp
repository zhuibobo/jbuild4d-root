<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/24
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
        <form-item label="ddtlKey：" prop="ddtlKey">
            <i-input v-model="formValidate.ddtlKey"></i-input>
        </form-item>
        <form-item label="ddtlValue：" prop="ddtlValue">
            <i-input v-model="formValidate.ddtlValue"></i-input>
        </form-item>
        <form-item label="ddtlName：" prop="ddtlName">
            <i-input v-model="formValidate.ddtlName"></i-input>
        </form-item>
        <form-item label="创建时间：">
            <row>
                <i-col span="10">
                    <date-picker type="date" placeholder="选择创建时间" v-model="formValidate.ddtlCreatetime" disabled
                                 readonly></date-picker>
                </i-col>
                <i-col span="4" style="text-align: center">状态：</i-col>
                <i-col span="10">
                    <form-item>
                        <radio-group v-model="formValidate.ddtlStatus">
                            <radio label="启用">启用</radio>
                            <radio label="禁用">禁用</radio>
                        </radio-group>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="ddtlDesc：">
            <i-input v-model="formValidate.ddtlDesc" type="textarea" :autosize="{minRows: 7,maxRows: 7}"></i-input>
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
                DetailPageUtility.IViewPageToViewStatus();
            }
        },
        data: {
            formValidate: {
                ddtlId: '${recordId}',
                ddtlKey: '${entity.ddtlKey}',
                ddtlValue: '${entity.ddtlValue}',
                ddtlName: '${entity.ddtlName}',
                ddtlStatus: '${entity.ddtlStatus}' == '' ? '启用' : '${entity.ddtlStatus}',
                ddtlCreatetime: '<fmt:formatDate value="${entity.ddtlCreatetime}" pattern="yyyy-MM-dd" />' == '' ? DateUtility.GetCurrentDataString("-") : '<fmt:formatDate value="${entity.ddtlCreatetime}" pattern="yyyy-MM-dd" />',
                ddtlDesc: '${entity.ddtlDesc}'
            },
            ruleValidate: {
                ddtlValue: [
                    {required: true, message: '【ddtlValue】不能空！', trigger: 'blur'}
                ],
                ddtlName: [
                    {required: true, message: '【ddtlName】不能空！', trigger: 'blur'}
                ],
                ddtlKey: [
                    {required: true, message: '【ddtlKey】不能空！', trigger: 'blur'}
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
                        var url = '/PlatForm/DevDemo/TreeAndList/DevDemoTLList/SaveEdit.do';
                        AjaxUtility.PostRequestBody(url, sendData, function (result) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                //debugger;
                                window.OpenerWindowObj.appList.reloadData();
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
