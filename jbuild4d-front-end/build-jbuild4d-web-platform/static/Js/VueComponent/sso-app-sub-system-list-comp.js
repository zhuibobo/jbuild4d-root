/*SSO子系统列表页面*/
Vue.component("sso-app-sub-system-list-comp", {
    props:["status","belongAppId"],
    data: function () {
        return {
            acInterface:{
                saveSubAppUrl:"/PlatFormRest/SSO/Application/SaveSubApp",
                reloadData:"/PlatFormRest/SSO/Application/GetAllSubSsoApp",
                appLogoUrl:"/PlatFormRest/SSO/Application/GetAppLogo",
                delete:"/PlatFormRest/SSO/Application/Delete",
                getDataUrl:"/PlatFormRest/SSO/Application/GetAppVo"
            },
            appList: [
            ],
            innerEditModelDialogStatus:"add"
        }
    },
    mounted:function(){
        this.reloadData();
    },
    methods:{
        addIntegratedSystem:function() {
            var elem=this.$refs.ssoAppSubSystemEditModelDialogWrap;
            //debugger;
            //this.getOrganDataInitTree();
            this.$refs.subAppDetailFromComp.resetAppEntity();
            this.$refs.subAppInterfaceListComp.resetListData();
            this.innerEditModelDialogStatus="add";
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 900,
                height: 500,
                title: "子系统设置"
            });
        },
        saveSubSystemSetting:function () {
            var _self=this;
            var ssoAppEntity=this.$refs.subAppDetailFromComp.getAppEntity();
            var ssoAppInterfaceEntityList=this.$refs.subAppInterfaceListComp.getInterfaceListData();
            ssoAppEntity.appMainId=this.belongAppId;
            //alert(this.belongAppId);
            if(this.innerEditModelDialogStatus=="add"){
                ssoAppEntity.appId=StringUtility.Guid();
            }
            if(ssoAppInterfaceEntityList){
                for(var i=0;i<ssoAppInterfaceEntityList.length;i++){
                    ssoAppInterfaceEntityList[i].interfaceBelongAppId=ssoAppEntity.appId;
                }
            }
            //debugger;
            var vo={
                "ssoAppEntity":ssoAppEntity,
                "ssoAppInterfaceEntityList":ssoAppInterfaceEntityList
            };
            var sendData=JSON.stringify(vo);
            AjaxUtility.PostRequestBody(this.acInterface.saveSubAppUrl,sendData,function (result) {
                if(result.success){
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                        _self.reloadData();
                        _self.handleClose();
                    });
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }

            },"json");
        },
        handleClose:function () {
            DialogUtility.CloseDialogElem(this.$refs.ssoAppSubSystemEditModelDialogWrap);
        },
        reloadData:function () {
            var _self=this;
            AjaxUtility.Post(this.acInterface.reloadData,{appId:_self.belongAppId},function (result) {
                if(result.success){
                    _self.appList=result.data;
                }
                else{
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            },"json");
        },
        buildLogoUrl:function (app) {
            if(app.appMainImageId==""){
                return BaseUtility.BuildAction(this.acInterface.appLogoUrl, {fileId: "defaultSSOAppLogoImage"});
            }
            else{
                return BaseUtility.BuildAction(this.acInterface.appLogoUrl, {fileId:app.appMainImageId});
            }
        },
        settingApp:function (app) {
            var elem=this.$refs.ssoAppSubSystemEditModelDialogWrap;
            this.innerEditModelDialogStatus="update";

            var _self=this;
            AjaxUtility.Post(this.acInterface.getDataUrl,{appId:app.appId},function (result) {
                console.log(result);
                if(result.success){
                    _self.$refs.subAppDetailFromComp.setAppEntity(result.data.ssoAppEntity);
                    _self.$refs.subAppInterfaceListComp.setInterfaceListData(result.data.ssoAppInterfaceEntityList);

                    DialogUtility.DialogElemObj(elem, {
                        modal: true,
                        width: 900,
                        height: 500,
                        title: "子系统设置"
                    });
                }
                else{
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            },"json");
        },
        removeApp:function (app) {
            var _self=this;
            DialogUtility.Confirm(window, "确认要注销系统["+app.appName+"]吗？", function () {
                AjaxUtility.Delete(_self.acInterface.delete, {appId: app.appId}, function (result) {
                    if (result.success) {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                            _self.reloadData();
                        });
                    }
                    else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                    }
                }, "json");
            });
        }
    },
    template: `<div>
                    <div ref="ssoAppSubSystemEditModelDialogWrap" class="general-edit-page-wrap" style="display: none;margin-top: 0px">
                        <tabs>
                            <tab-pane label="系统设置">
                                <sso-app-detail-from-comp ref="subAppDetailFromComp" :is-sub-system="true" :status="innerEditModelDialogStatus"></sso-app-detail-from-comp>
                            </tab-pane>
                            <tab-pane label="接口设置">
                                <sso-app-interface-list-comp ref="subAppInterfaceListComp"></sso-app-interface-list-comp>
                            </tab-pane>
                        </tabs>
                        <div class="button-outer-wrap" style="margin-right: 10px;margin-bottom: 10px">
                            <div class="button-inner-wrap">
                                <button-group>
                                    <i-button type="primary" v-if="status!='view'" @click="saveSubSystemSetting()" icon="md-checkmark">保存子系统设置</i-button>
                                    <i-button v-if="status!='view'" @click="handleClose()" icon="md-close">关闭</i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                    <div class="apps-manager-outer-wrap">
                        <div class="apps-outer-wrap" ref="appsOuterWrap" v-if="status!='add'">
                            <div  v-for="app in appList" class="app-outer-wrap app-outer-wrap-sub-system">
                                <div class="title">
                                    <span>{{app.appName}}</span>
                                </div>
                                <div class="content">
                                    <div class="mainImg">
                                        <img :src="buildLogoUrl(app)" />
                                    </div>
                                    <div class="button-wrap">
                                        <div class="button setting-button" @click="settingApp(app)">
                                            设置
                                        </div>
                                        <div class="button remove-button" @click="removeApp(app)">
                                            注销
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="app-outer-wrap app-outer-wrap-sub-system new-system-outer-wrap">
                                <div class="add-system-button" @click="addIntegratedSystem()" style="margin-top: 60px">新增</div>
                            </div>
                        </div>
                        <div v-if="status=='add'">请先保存主系统,再设置其中的子系统!</div>
                    </div>
                 </div>`
});
