/*SSO子系统列表页面*/
Vue.component("sso-app-sub-system-list-comp", {
    props:["status"],
    data: function () {
        return {
            items: [
                { message: 'Foo' },
                { message: 'Bar' }
            ]
        }
    },
    mounted:function(){
        if(this.status=="add"){

        }
    },
    methods:{
        addIntegratedSystem:function() {
            var elem=this.$refs.ssoAppInterfaceEditModelDialogWrap;
            //debugger;
            //this.getOrganDataInitTree();
            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 900,
                height: 500,
                title: "接口设置"
            });
        },
    },
    template: `<div>
                    <div ref="ssoAppInterfaceEditModelDialogWrap" class="general-edit-page-wrap" style="display: none;margin-top: 0px">
                        <tabs>
                            <tab-pane label="系统设置">
                                <sso-app-detail-from-comp :is-sub-system="true"></sso-app-detail-from-comp>
                            </tab-pane>
                            <tab-pane label="接口设置">
                                <sso-app-interface-list-comp></sso-app-interface-list-comp>
                            </tab-pane>
                        </tabs>
                        <div class="button-outer-wrap" style="margin-right: 10px;margin-bottom: 10px">
                            <div class="button-inner-wrap">
                                <button-group>
                                    <i-button type="primary" v-if="status!='view'" @click="handleSubmit()" icon="md-checkmark">保存</i-button>
                                    <i-button v-if="status!='view'" @click="handleClose()" icon="md-close">取消</i-button>
                                </button-group>
                            </div>
                        </div>
                    </div>
                    <div class="apps-manager-outer-wrap">
                        <div class="apps-outer-wrap" ref="appsOuterWrap" v-if="status!='add'">
                            <div v-for="item in items" class="app-outer-wrap app-outer-wrap-sub-system">
                                <div class="title">
                                    <span>深圳市明天不知道干什么可能会下雨科技有限股份未明公司</span>
                                </div>
                                <div class="content">
                                    <div class="mainImg">
                                        <img src="../../../Themes/Default/Css/Images/DefaultSSOAppLogo.png" />
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
