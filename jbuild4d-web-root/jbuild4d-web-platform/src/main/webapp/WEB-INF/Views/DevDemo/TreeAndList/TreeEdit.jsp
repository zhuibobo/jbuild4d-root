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
        <form-item label="ParentId：">
            <i-input v-model="formValidate.ddttParentId"></i-input>
        </form-item>
        <form-item label="分 组 值：" prop="ddttValue">
            <i-input v-model="formValidate.ddttValue"></i-input>
        </form-item>
        <form-item label="分组名称：" prop="ddttName">
            <i-input v-model="formValidate.ddttName"></i-input>
        </form-item>
        <form-item label="创建时间：">
            <row>
                <i-col span="10">
                    <date-picker type="date" placeholder="选择创建时间" v-model="formValidate.ddttCreatetime" disabled
                                 readonly></date-picker>
                </i-col>
                <i-col span="4" style="text-align: center">状态：</i-col>
                <i-col span="10">
                    <form-item>
                        <radio-group v-model="formValidate.ddttStatus">
                            <radio label="启用">启用</radio>
                            <radio label="禁用">禁用</radio>
                        </radio-group>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="备注：">
            <i-input v-model="formValidate.ddttDesc" type="textarea" :autosize="{minRows: 7,maxRows: 7}"></i-input>
        </form-item>
        <form-item class="general-edit-page-bottom-wrap">
            <i-button type="primary" v-if="status!='view'" @click="handleSubmit('formValidate')"> 保 存</i-button>
            <i-button type="ghost" @click="handleClose()" style="margin-left: 8px">
                关 闭
            </i-button>
        </form-item>
    </i-form>
</div>

<script>
    var appForm = new Vue({
        el:"#appForm",
        data: {
            formValidate: {
                ddttId: '${recordId}',
                ddttValue: '${entity.ddttValue}',
                ddttName: '${entity.ddttName}',
                ddttCreatetime: '<fmt:formatDate value="${entity.ddttCreatetime}" pattern="yyyy-MM-dd" />' == '' ? DateUtility.GetCurrentDataString("-") : '<fmt:formatDate value="${entity.ddttCreatetime}" pattern="yyyy-MM-dd" />',
                ddttDesc: '${entity.ddttDesc}',
                ddttParentId: '${entity.ddttParentId}' == '' ? StringUtility.QueryString("parentId") : '${entity.ddttParentId}',
                ddttStatus: '${entity.ddttStatus}' == '' ? '启用' : '${entity.ddttStatus}'
            },
            ruleValidate: {
                ddttValue: [
                    {required: true, message: '【值】不能空！', trigger: 'blur'}
                ],
                ddttName: [
                    {required: true, message: '【名称】不能空！', trigger: 'blur'}
                ]
            },
            status: '${op}'
        },
        mounted:function () {
            if(this.status=="view") {
                DetailPageUtility.IViewPageToViewStatus();
            }
        },
        methods: {
            handleSubmit: function (name) {
                var _self = this;
                this.$refs[name].validate(function (valid) {
                    if (valid) {
                        var sendData = JSON.stringify(_self.formValidate);
                        //debugger;
                        var url = '/PlatForm/DevDemo/TreeAndList/DevDemoTLTree/SaveEdit.do';
                        AjaxUtility.PostRequestBody(url, sendData, function (result) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                if(result.success) {
                                    if (appForm.status == "add") {
                                        window.OpenerWindowObj.appList.newTreeNode(_self.formValidate);
                                    }
                                    else if (appForm.status == "update") {
                                        window.OpenerWindowObj.appList.updateNode(_self.formValidate);
                                    }
                                }
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
    })
</script>
</body>
</html>