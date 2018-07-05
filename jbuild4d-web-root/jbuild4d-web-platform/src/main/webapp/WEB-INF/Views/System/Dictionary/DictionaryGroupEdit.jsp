<%--
  Created by IntelliJ IDEA.
  User: zhuibobo
  Date: 2018/5/10
  Time: 12:21
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
<div id="app" class="general-edit-page-wrap">
    <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <form-item label="分 组 值：" prop="dictGroupValue">
            <i-input v-model="formValidate.dictGroupValue"></i-input>
        </form-item>
        <form-item label="分组名称：" prop="dictGroupText">
            <i-input v-model="formValidate.dictGroupText"></i-input>
        </form-item>
        <form-item label="创建时间：">
            <date-picker type="date" placeholder="选择创建时间" v-model="formValidate.dictGroupCreateTime" disabled readonly></date-picker>
        </form-item>
        <form-item class="general-edit-page-bottom-wrap">
            <i-button type="primary" v-if="status!='view'" @click="handleSubmit('formValidate')"> 保  存 </i-button>
            <i-button type="ghost" v-if="status!='view'" @click="handleReset('formValidate')" style="margin-left: 8px"> 关  闭 </i-button>
        </form-item>
    </i-form>
</div>

<script>
    var Main = {
        data:function () {
            return {
                formValidate: {
                    dictGroupId: '${recordId}',
                    dictGroupValue: '${entity.dictGroupValue}',
                    dictGroupText: '${entity.dictGroupText}',
                    dictGroupCreateTime:'<fmt:formatDate value="${entity.dictGroupCreateTime}" pattern="yyyy-MM-dd" />'==''?JB4D.DateUtility.GetCurrentDataString("-"):'<fmt:formatDate value="${entity.dictGroupCreateTime}" pattern="yyyy-MM-dd" />'
                },
                ruleValidate: {
                    dictGroupValue: [
                        { required: true, message: '【分组值】不能空！', trigger: 'blur' }
                    ],
                    dictGroupText: [
                        { required: true, message: '【分组名称】不能空！', trigger: 'blur' }
                    ]
                },
                status:'${op}'
            };
        },
        methods: {
            handleSubmit: function (name) {
                var _self=this;
                this.$refs[name].validate(function (valid) {
                    if (valid) {
                        var sendData=JSON.stringify(_self.formValidate);
                        //debugger;
                        var url='/PlatForm/System/DictionaryGroup/SaveEdit.do';
                        AjaxUtility.PostRequestBody(url,sendData,function (result) {
                            DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},result.message,function () {
                                //debugger;
                                window.OpenerWindowObj.app.refreshPage();
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
    }
    var Component = Vue.extend(Main)
    new Component().$mount('#app')
</script>
</body>
</html>
