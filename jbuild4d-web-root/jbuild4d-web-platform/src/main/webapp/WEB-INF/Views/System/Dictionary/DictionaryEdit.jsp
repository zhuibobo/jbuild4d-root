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
        <form-item label="dictGroupId：">
            <row>
                <i-col span="10">
                    <form-item>
                        <i-input v-model="formValidate.dictGroupId"></i-input>
                    </form-item>
                </i-col>
                <i-col span="4" style="text-align: center">dictParentId：</i-col>
                <i-col span="10">
                    <form-item>
                        <i-input v-model="formValidate.dictParentId"></i-input>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="Key：">
            <row>
                <i-col span="10">
                    <form-item prop="dictKey">
                        <i-input v-model="formValidate.dictKey"></i-input>
                    </form-item>
                </i-col>
                <i-col span="4" style="text-align: center">状态：</i-col>
                <i-col span="10">
                    <form-item>
                        <radio-group v-model="formValidate.dictStatus">
                            <radio label="启用">启用</radio>
                            <radio label="禁用">禁用</radio>
                        </radio-group>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="值：" prop="dictValue">
            <row>
                <i-col span="10">
                    <form-item prop="dictValue">
                        <i-input v-model="formValidate.dictValue"></i-input>
                    </form-item>
                </i-col>
                <i-col span="4" style="text-align: center"><span style="color: red">*</span> 文本：</i-col>
                <i-col span="10">
                    <form-item prop="dictText">
                        <i-input v-model="formValidate.dictText"></i-input>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="是否系统：">
            <row>
                <i-col span="10">
                    <form-item>
                        <radio-group v-model="formValidate.dictIssystem">
                            <radio label="是">是</radio>
                            <radio label="否">否</radio>
                        </radio-group>
                    </form-item>
                </i-col>
                <i-col span="4" style="text-align: center">能否删除：</i-col>
                <i-col span="10">
                    <form-item>
                        <radio-group v-model="formValidate.dictDelEnable">
                            <radio label="是">是</radio>
                            <radio label="否">否</radio>
                        </radio-group>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="创建时间：">
            <row>
                <i-col span="10">
                    <form-item prop="date">
                        <date-picker type="date" placeholder="选择创建时间" v-model="formValidate.dictCreateTime"></date-picker>
                    </form-item>
                </i-col>
                <i-col span="4" style="text-align: center">默认选中：</i-col>
                <i-col span="10">
                    <form-item>
                        <radio-group v-model="formValidate.dictIsSelected">
                            <radio label="是">是</radio>
                            <radio label="否">否</radio>
                        </radio-group>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="备注：">
            <i-input v-model="formValidate.dictDesc" type="textarea" :autosize="{minRows: 7,maxRows: 7}"></i-input>
        </form-item>
        <form-item class="general-edit-page-bottom-wrap">
            <i-button type="primary" v-if="status!='view'" @click="handleSubmit('formValidate')"> 保  存 </i-button>
            <i-button type="ghost" v-if="status!='view'" @click="handleReset('formValidate')" style="margin-left: 8px"> 关  闭 </i-button>
        </form-item>
    </i-form>
</div>
<script>
    var appForm = new Vue({
        el:"#appForm",
        data: {
                formValidate: {
                    dictId: '${recordId}',
                    dictParentId:'${entity.dictParentId}' == '' ? StringUtility.QueryString("dictParentId") : '${entity.dictParentId}',
                    dictGroupId:'${entity.dictGroupId}' == '' ? StringUtility.QueryString("dictGroupId") : '${entity.dictGroupId}',
                    dictKey: '${entity.dictKey}',
                    dictValue: '${entity.dictValue}',
                    dictText: '${entity.dictText}',
                    dictDesc: '${entity.dictDesc}',
                    dictStatus: '${entity.dictStatus}'==''?'启用':'${entity.dictStatus}',
                    dictIsSelected:'${entity.dictIsSelected}'==''?'否':'${entity.dictIsSelected}',
                    dictCreateTime:'<fmt:formatDate value="${entity.dictCreateTime}" pattern="yyyy-MM-dd" />'==''?DateUtility.GetCurrentDataString("-"): '<fmt:formatDate value="${entity.dictCreateTime}" pattern="yyyy-MM-dd" />',
                    dictIssystem: '${entity.dictIssystem}' == '' ? '否' : '${entity.dictIssystem}',
                    dictDelEnable: '${entity.dictDelEnable}' == '' ? '是' : '${entity.dictDelEnable}'
                },
                ruleValidate: {
                    dictValue: [
                        { required: true, message: '【字典-值】不能空！', trigger: 'blur' }
                    ],
                    dictText: [
                        { required: true, message: '【字典-字】不能空！', trigger: 'blur' }
                    ]
                },
                status:'${op}'
        },
        mounted:function () {
            if(this.status=="view") {
                DetailPageUtility.IViewPageToViewStatus();
            }
        },
        methods: {
            handleSubmit: function (name) {
                var _self=this;
                this.$refs[name].validate(function (valid) {
                    if (valid) {
                        var sendData=JSON.stringify(_self.formValidate);
                        //debugger;
                        var url='/PlatForm/System/Dictionary/SaveEdit.do';
                        AjaxUtility.PostRequestBody(url,sendData,function (result) {
                            DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},result.message,function () {
                                //debugger;
                                if (appForm.status=="add") {
                                    window.OpenerWindowObj.appList.newTreeTableNode(_self.formValidate.dictId, _self.formValidate.dictKey,
                                        _self.formValidate.dictValue, _self.formValidate.dictText, _self.formValidate.dictGroupId, _self.formValidate.dictCreateTime, _self.formValidate.dictStatus, _self.formValidate.dictIsSelected);
                                }
                                else if(appForm.status=="update"){
                                    window.OpenerWindowObj.appList.updateTreeTableNode(_self.formValidate.dictId, _self.formValidate.dictKey,
                                        _self.formValidate.dictValue, _self.formValidate.dictText, _self.formValidate.dictStatus, _self.formValidate.dictIsSelected);
                                }
                                DialogUtility.Frame_CloseDialog(window);
                            });
                        },"json");
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset: function (name) {
                this.$refs[name].resetFields();
            }
        }
    });
</script>
</body>
</html>
