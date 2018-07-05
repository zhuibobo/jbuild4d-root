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
</head>
<body>
<div id="app" class="general-edit-page-wrap">
    <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <form-item label="字典-值：" prop="dictValue">
            <i-input v-model="formValidate.dictValue"></i-input>
        </form-item>
        <form-item label="字典-字：" prop="dictText">
            <i-input v-model="formValidate.dictText"></i-input>
        </form-item>
        <form-item label="父节点：" prop="dictParentId">
            <i-input v-model="formValidate.dictParentId"></i-input>
        </form-item>
        <form-item label="状态：">
            <radio-group v-model="formValidate.dictStatus">
                <radio label="1">启动</radio>
                <radio label="2">禁用</radio>
            </radio-group>
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
                            <radio label="1">是</radio>
                            <radio label="0">否</radio>
                        </radio-group>
                    </form-item>
                </i-col>
            </row>
        </form-item>
        <form-item label="备注：" prop="desc">
            <i-input v-model="formValidate.dictDesc" type="textarea" :autosize="{minRows: 7,maxRows: 7}"></i-input>
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
                    dictSid: '${sId}',
                    dictValue: '${entity.dictValue}',
                    dictText: '${entity.dictText}',
                    dictParentId: '${entity.dictParentId}'==""?'${dictParentId}':'${entity.dictParentId}',
                    dictDesc: '${entity.dictDesc}',
                    dictStatus: '${entity.dictStatus}'==''?'1':'${entity.dictStatus}',
                    dictIsSelected:'${entity.dictIsSelected}'==''?'0':'${entity.dictIsSelected}',
                    dictCreateTime:'${entity.dictCreateTime}'==''?B4D.DateUtility.GetCurrentDataString("-"):'${entity.dictCreateTime}'
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
            };
        },
        methods: {
            handleSubmit: function (name) {
                var _self=this;
                this.$refs[name].validate(function (valid) {
                    if (valid) {
                        var sendData=JSON.stringify(_self.formValidate);
                        //debugger;
                        var url='/project/system/dictionary/saveedit.do';
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
