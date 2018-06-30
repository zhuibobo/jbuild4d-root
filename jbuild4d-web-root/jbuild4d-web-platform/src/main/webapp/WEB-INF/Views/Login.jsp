<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/6/7
  Time: 16:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/Views/TagLibs/TagLib.jsp" %>
<html>
<head>
    <title>MYWebApp</title>
    <%@ include file="/WEB-INF/Views/TagLibs/GeneralLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/IViewLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/JQueryUILib.jsp" %>
</head>
<body>
    ${theme}
    <div id="app">
        <row>
            <i-col span="6" offset="9">
                <card style="margin-top: 200px">
                    <p slot="title">登陆系统</p>
                    <i-form :model="formItem" :label-width="80">
                        <form-item label="账    号">
                            <i-input v-model="formItem.account" placeholder="Enter something..."></i-input>
                        </form-item>
                        <form-item label="密    码">
                            <i-input v-model="formItem.password" placeholder="Enter something..."></i-input>
                        </form-item>
                        <form-item class="general-edit-page-bottom-wrap">
                            <i-button type="primary" @click="handleSubmit('formValidate')">登陆</i-button>
                            <i-button type="ghost" style="margin-left: 8px">重置</i-button>
                        </form-item>
                    </i-form>
                </card>
            </i-col>
        </row>
    </div>
    <script type="application/javascript">
        new Vue({
            el:"#app",
            data:{
                formItem: {
                    account: 'Alex',
                    password: '4D'
                }
            },
            methods:{
                handleSubmit: function (name) {
                    var url='/ValidateAccount.do';
                    var _self=this;
                    //debugger;
                    var senddata={
                        account:_self.formItem.account,
                        password:_self.formItem.password
                    }
                    AjaxUtility.Post(url, senddata , function (result) {
                        if (result.success) {
                            window.location.href=B4D.BaseUtility.GetRootPath()+"/Frame.do"
                        }
                        else
                        {
                            DialogUtility.Alert(window,"LoginAlert",{},"帐号密码错误")
                        }
                    },"json");

                },
                handleReset: function (name) {
                    this.$refs[name].resetFields();
                }
            }
        });
    </script>
</body>
</html>
