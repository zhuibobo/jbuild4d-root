/*SSO系统集成详情页面*/
Vue.component("sso-app-detail-from-comp", {
    props:["status","appId","isSubSystem"],
    watch: {
        appId:function (newVal) {
            this.appEntity.appId=newVal;
        },
        status:function (newVal) {
            this.innerStatus=newVal;
        }
    },
    data: function () {
        return {
            acInterface:{
                appLogoUrl:"/PlatFormRest/SSO/Application/GetAppLogo",
                getNewKeys:"/PlatFormRest/SSO/Application/GetNewKeys"
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
                appMainId:"",
                appCategory:"web",
                appDesc:"",
                appStatus:"启用",
                appCreateTime:DateUtility.GetCurrentData()
            },
            ruleValidate:{
                appCode: [
                    {required: true, message: '【系统编码】不能为空！', trigger: 'blur'},
                    { type: 'string',pattern:/^[A-Za-z0-9]+$/, message:'请使用字母或数字', trigger:'blur'},
                ],
                appName:[
                    {required: true, message: '【系统名称】不能为空！', trigger: 'blur'}
                ]
            },
            systemLogoImageSrc:"",
            innerStatus:"add"
        }
    },
    mounted:function(){
        //
        //alert(this.isSubSystem);
        if(this.innerStatus=="add") {
            //this.appEntity.appId=this.appId;
            //alert(this.status);
            this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {fileId: "defaultSSOAppLogoImage"});
        }
        else {

            this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {fileId: ""});
        }
    },
    methods:{
        resetAppEntity:function(){
            this.appEntity.appId="";
            this.appEntity.appCode="";
            this.appEntity.appName="";
            this.appEntity.appPublicKey="";
            this.appEntity.appPrivateKey="";
            this.appEntity.appDomain="";
            this.appEntity.appIndexUrl="";
            this.appEntity.appMainImageId="";
            this.appEntity.appType="";
            this.appEntity.appMainId="";
            this.appEntity.appCategory="web";
            this.appEntity.appDesc="";
            this.appEntity.appStatus="启用";
            this.appEntity.appCreateTime=DateUtility.GetCurrentData();
        },
        uploadSystemLogoImageSuccess:function (response, file, fileList) {
            var data = response.data;
            this.appEntity.appMainImageId = data.fileId;
            this.systemLogoImageSrc = BaseUtility.BuildAction(this.acInterface.appLogoUrl, {fileId: this.appEntity.appMainImageId});
        },
        getAppEntity:function () {
            return this.appEntity;
        },
        setAppEntity:function (appEntity) {
            this.appEntity=appEntity;
        },
        createKeys:function () {
            var _self=this;
            AjaxUtility.Post(this.acInterface.getNewKeys, {}, function (result) {
                if (result.success) {
                    _self.appEntity.appPublicKey=result.data.publicKey;
                    _self.appEntity.appPrivateKey=result.data.privateKey;
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message,null);
                }
            }, "json");
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
                            <form-item label="公钥：" v-if="isSubSystem=='0'">
                                <i-input placeholder="请创建密钥对,用于数据的加密使用" search enter-button="创建密钥对" v-model="appEntity.appPublicKey" @on-search="createKeys()"></i-input>
                            </form-item>
                            <form-item label="私钥：" v-if="isSubSystem==0">
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