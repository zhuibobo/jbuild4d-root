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
                    <div ref="ssoAppInterfaceEditModelDialogWrap" class="general-edit-page-wrap" style="display: none">
                        <tabs>
                            <tab-pane label="系统设置">
                                <sso-app-detail-from-comp></sso-app-detail-from-comp>
                            </tab-pane>
                            <tab-pane label="接口设置">
                                <sso-app-interface-list-comp></sso-app-interface-list-comp>
                            </tab-pane>
                        </tabs>
                    </div>
                    <div class="apps-manager-outer-wrap">
                        <div class="apps-outer-wrap" ref="appsOuterWrap" v-if="status!='add'">
                            <div v-for="item in items" class="app-outer-wrap">
                                <div class="title">
                                    <span>深圳市明天不知道干什么可能会下雨科技有限股份未明公司</span>
                                </div>
                                <div class="content">
                                    <div class="mainImg">
                                        <img src="../../../Themes/Default/Css/Images/DefaultSSOAppLogo.png" />
                                    </div>
                                    <div class="button">
                                        系统设置
                                    </div>
                                </div>
                            </div>
                            <div class="app-outer-wrap new-system-outer-wrap">
                                <div class="add-system-button" @click="addIntegratedSystem()">添加集成系统</div>
                                <div class="add-system-button" @click="addPostSystem()">添加模拟系统</div>
                            </div>
                        </div>
                        <div v-if="status=='add'">请先保存主系统,再设置其中的子系统!</div>
                    </div>
                 </div>`
});
