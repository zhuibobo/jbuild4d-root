<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/21
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
        <form-item label="Key：" prop="settingKey">
            <i-input v-model="formValidate.settingKey"></i-input>
        </form-item>
        <form-item label="名称：" prop="settingName">
            <i-input v-model="formValidate.settingName"></i-input>
        </form-item>
        <form-item label="值：" prop="settingValue">
            <i-input v-model="formValidate.settingValue"></i-input>
        </form-item>
        <form-item label="创建时间：">
            <row>
                <i-col span="10">
                    <form-item>
                        <date-picker type="date" placeholder="选择创建时间" v-model="formValidate.settingCreatetime" disabled readonly></date-picker>
                    </form-item>
                </i-col>
                <i-col span="4" style="text-align: center">状态：</i-col>
                <i-col span="10">
                    <form-item>
                        <radio-group v-model="formValidate.settingStatus">
                            <radio label="启用">启用</radio>
                            <radio label="禁用">禁用</radio>
                        </radio-group>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="系统：">
            <radio-group v-model="formValidate.settingIsSystem">
                <radio label="是">是</radio>
                <radio label="否">否</radio>
            </radio-group>
        </form-item>
        <form-item label="API：">
            <i-input v-model="formValidate.settingApi"></i-input>
        </form-item>
        <form-item label="备注：">
            <i-input v-model="formValidate.settingDesc" type="textarea" :autosize="{minRows: 4,maxRows: 4}"></i-input>
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
                settingId: '${recordId}',
                settingKey: '${entity.settingKey}',
                settingValue: '${entity.settingValue}',
                settingName: '${entity.settingName}',
                settingApi:'${entity.settingApi}',
                settingStatus: '${entity.settingStatus}'==''?'启用':'${entity.settingStatus}',
                settingCreatetime: '<fmt:formatDate value="${entity.settingCreatetime}" pattern="yyyy-MM-dd" />' == '' ? DateUtility.GetCurrentDataString("-") : '<fmt:formatDate value="${entity.settingCreatetime}" pattern="yyyy-MM-dd" />',
                settingDesc: '${entity.settingDesc}',
                settingIsSystem:'${entity.settingIsSystem}'==''?'否':'${entity.settingIsSystem}'
            },
            ruleValidate: {
                settingKey: [
                    {required: true, message: '【settingKey】不能空！', trigger: 'blur'}
                ],
                settingName: [
                    {required: true, message: '【settingName】不能空！', trigger: 'blur'}
                ],
                settingValue: [
                    {required: true, message: '【settingValue】不能空！', trigger: 'blur'}
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
                        var url = '/PlatForm/System/ParasSetting/SaveEdit.do';
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
