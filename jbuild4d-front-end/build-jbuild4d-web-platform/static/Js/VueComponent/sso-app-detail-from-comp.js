/*SSO系统集成详情页面*/
Vue.component("sso-app-detail-from-comp", {
    data: function () {
        return {
            acInterface:{
                appLogoUrl:"/PlatFormRest/SSO/Application/GetAppLogo"
            },
            appEntity:{
                appId:"",
                appCode:"",
                appName:"",
                appPublicKey:"",
                appPrivateKey:"",
                appDomain:"",
                appIndexUrl:"",
                appMainImageId:"",
                appType:"",
                appTypeMainId:"",
                appCategory:"web",
                appDesc:"",
                appStatus:"启用",
                appCreateTime:""
            },
            ruleValidate:{
                appCode: [
                    {required: true, message: '【系统编码】不能为空！', trigger: 'blur'}
                ],
                appName:[
                    {required: true, message: '【系统名称】不能为空！', trigger: 'blur'}
                ]
            },
            systemLogoImageSrc:"",
            status:"add",
        }
    },
    mounted:function(){
        if(this.status=="add") {
            this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {fileId: "defaultSSOAppLogoImage"});
        }
        else {
            this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {fileId: ""});
        }
    },
    methods:{
        uploadSystemLogoImageSuccess:function (response, file, fileList) {

        }
    },
    template: `<div>
                    <div style="width: 80%;float: left">
                        <i-form ref="appEntity" :model="appEntity" :rules="ruleValidate" :label-width="100">
                            <form-item label="系统编码：" prop="appCode">
                                <row>
                                    <i-col span="10">
                                        <form-item prop="appCode">
                                            <i-input v-model="appEntity.appCode"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="4" style="text-align: center"><span style="color: red">*</span> 系统名称：</i-col>
                                    <i-col span="10">
                                        <form-item prop="appName">
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
                            <form-item label="创建时间：">
                                <row>
                                    <i-col span="10">
                                        <date-picker type="date" placeholder="选择创建时间" v-model="appEntity.appCreateTime" disabled
                                                     readonly></date-picker>
                                    </i-col>
                                    <i-col span="4" style="text-align: center">状态：</i-col>
                                    <i-col span="10">
                                        <form-item>
                                            <radio-group v-model="appEntity.appStatus">
                                                <radio label="启用">启用</radio>
                                                <radio label="禁用">禁用</radio>
                                            </radio-group>
                                        </form-item>
                                    </i-col>
                                </row>
                            </form-item>
                            <form-item label="默认地址：">
                                <i-input v-model="appEntity.appIndexUrl"></i-input>
                            </form-item>
                            <form-item label="备注：">
                                <i-input v-model="appEntity.appDesc" type="textarea" :autosize="{minRows: 4,maxRows: 4}"></i-input>
                            </form-item>
                        </i-form>
                    </div>
                    <div style="width: 19%;float: right">
                        <div style="border-radius: 8px;text-align: center;margin-top: 0px;margin-bottom: 30px">
                            <img :src="systemLogoImageSrc" style="width: 110px;height: 110px" />
                        </div>
                        <upload style="margin:10px 12px 0 20px" :on-success="uploadSystemLogoImageSuccess" multiple type="drag" name="file" action="../../..//PlatFormRest/SSO/Application/UploadAppLogo.do" accept=".png">
                            <div style="padding:10px 0px">
                                <icon type="ios-cloud-upload" size="52" style="color: #3399ff"></icon>
                                <p>上传系统Logo</p>
                            </div>
                        </upload>
                    </div>
                </div>`
});