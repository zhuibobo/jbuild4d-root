<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/7/5
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
            <i-input v-model="formValidate.dictGroupParentId"></i-input>
        </form-item>
        <form-item label="分 组 值：" prop="dictGroupValue">
            <i-input v-model="formValidate.dictGroupValue"></i-input>
        </form-item>
        <form-item label="分组名称：" prop="dictGroupText">
            <i-input v-model="formValidate.dictGroupText"></i-input>
        </form-item>
        <form-item label="是否系统：">
            <row>
                <i-col span="6">
                    <form-item>
                        <radio-group v-model="formValidate.dictGroupIssystem">
                            <radio label="是">是</radio>
                            <radio label="否">否</radio>
                        </radio-group>
                    </form-item>
                </i-col>
                <i-col span="3" style="text-align: center">能否删除：</i-col>
                <i-col span="6">
                    <form-item>
                        <radio-group v-model="formValidate.dictGroupDelEnable">
                            <radio label="是">是</radio>
                            <radio label="否">否</radio>
                        </radio-group>
                    </form-item>
                </i-col>
                <i-col span="3" style="text-align: center">空选项：</i-col>
                <i-col span="6">
                    <form-item>
                        <radio-group v-model="formValidate.dictGroupEnpItem">
                            <radio label="是">是</radio>
                            <radio label="否">否</radio>
                        </radio-group>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="创建时间：">
            <date-picker type="date" placeholder="选择创建时间" v-model="formValidate.dictGroupCreateTime" disabled
                         readonly></date-picker>
        </form-item>
        <form-item label="备注：">
            <i-input v-model="formValidate.dictGroupDesc" type="textarea" :autosize="{minRows: 7,maxRows: 7}"></i-input>
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
                dictGroupId: '${recordId}',
                dictGroupValue: '${entity.dictGroupValue}',
                dictGroupText: '${entity.dictGroupText}',
                dictGroupCreateTime: '<fmt:formatDate value="${entity.dictGroupCreateTime}" pattern="yyyy-MM-dd" />' == '' ? DateUtility.GetCurrentDataString("-") : '<fmt:formatDate value="${entity.dictGroupCreateTime}" pattern="yyyy-MM-dd" />',
                dictGroupDesc: '${entity.dictGroupDesc}',
                dictGroupParentId: '${entity.dictGroupParentId}' == '' ? StringUtility.QueryString("parentId") : '${entity.dictGroupParentId}',
                dictGroupIssystem: '${entity.dictGroupIssystem}' == '' ? '否' : '${entity.dictGroupIssystem}',
                dictGroupDelEnable: '${entity.dictGroupDelEnable}' == '' ? '是' : '${entity.dictGroupDelEnable}',
                dictGroupEnpItem: '${entity.dictGroupEnpItem}' == '' ? '是' : '${entity.dictGroupEnpItem}'
            },
            ruleValidate: {
                dictGroupValue: [
                    {required: true, message: '【分组值】不能空！', trigger: 'blur'}
                ],
                dictGroupText: [
                    {required: true, message: '【分组名称】不能空！', trigger: 'blur'}
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
                        var url = '/PlatForm/System/DictionaryGroup/SaveEdit.do';
                        AjaxUtility.PostRequestBody(url, sendData, function (result) {
                            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                                if(result.success) {
                                    if (appForm.status == "add") {
                                        window.OpenerWindowObj.appList.newTreeNode(_self.formValidate.dictGroupId, _self.formValidate.dictGroupValue, _self.formValidate.dictGroupText, _self.formValidate.dictGroupParentId);
                                    }
                                    else if (appForm.status == "update") {
                                        window.OpenerWindowObj.appList.updateNode(_self.formValidate.dictGroupValue, _self.formValidate.dictGroupText);
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
