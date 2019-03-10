/*SSO子系统列表页面*/
Vue.component("sso-app-sub-system-list-comp", {
    data: function () {
        return {
            appEntity:{

            },
            ruleValidate:{

            }
        }
    },
    mounted:function(){

    },
    methods:{

    },
    template: `<div>
                    <div style="width: 80%;float: left">
                        <i-form ref="appEntity" :model="appEntity" :rules="ruleValidate" :label-width="100">
                            <form-item label="系统编码：" prop="appEntity.appCode">
                                <row>
                                    <i-col span="10">
                                        <form-item prop="appEntity.appCode">
                                            <i-input v-model="appEntity.appCode"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="4" style="text-align: center"><span style="color: red">*</span> 系统名称：</i-col>
                                    <i-col span="10">
                                        <form-item prop="appEntity.appName">
                                            <i-input v-model="appEntity.appName"></i-input>
                                        </form-item>
                                    </i-col>
                                </row>
                            </form-item>
                            <form-item label="域名：">
                                <row>
                                    <i-col span="10">
                                        <i-input v-model="appEntity.appDomain"></i-input>
                                    </i-col>
                                    <i-col span="4" style="text-align: center">系统类别：</i-col>
                                    <i-col span="10">
                                        <radio-group v-model="appEntity.appCategory" type="button">
                                            <radio label="app">移动App</radio>
                                            <radio label="web">Web系统</radio>
                                        </radio-group>
                                    </i-col>
                                </row>
                            </form-item>
                            <form-item label="公钥：">
                                <i-input v-model="appEntity.appPublicKey"></i-input>
                            </form-item>
                            <form-item label="私钥：">
                                <i-input v-model="appEntity.appPrivateKey"></i-input>
                            </form-item>
                            <form-item label="默认地址：">
                                <i-input v-model="appEntity.appIndexUrl"></i-input>
                            </form-item>
                            <form-item label="备注：">
                                <i-input v-model="appEntity.appDesc" type="textarea" :autosize="{minRows: 6,maxRows: 6}"></i-input>
                            </form-item>
                        </i-form>
                    </div>
                    <div style="width: 19%;float: right">
                        <div style="border-radius: 8px;text-align: center;margin-top: 20px;margin-bottom: 30px">
                            <img :src="userHeadImageSrc" style="width: 110px;height: 120px" />
                        </div>
                        <upload style="margin:10px 12px 0 20px" :on-success="uploadUserHeadImageSuccess" multiple type="drag" name="file" action="../../../PlatFormRest/SSO/DepartmentUser/UploadUserHeadIMG.do" accept=".png">
                            <div style="padding:10px 0px">
                                <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>
                                <p>上传系统Logo</p>
                            </div>
                        </upload>
                    </div>
                </div>`
});
