/*SSO系统集成接口列表页面*/
Vue.component("sso-app-interface-list-comp", {
    data: function () {
        return {
            interfaceEntity:{

            }
        }
    },
    mounted:function(){

    },
    methods:{

    },
    template: `<div>
        <div>
            <div>
                <table>
                    <tr>
                        <td>接口类型：</td>
                        <td>
                            <i-input v-model="interfaceEntity.appCode" size="small"></i-input>
                        </td>
                        <td>接口名称：</td>
                        <td>
                            <i-input v-model="interfaceEntity.appCode" size="small"></i-input>
                        </td>
                    </tr>
                    <tr>
                        <td>接口地址：</td>
                        <td>
                            <i-input v-model="interfaceEntity.appCode" size="small"></i-input>
                        </td>
                    </tr>
                    <tr>
                        <td>参数：</td>
                        <td>
                             <i-input v-model="interfaceEntity.appDesc" type="textarea" :autosize="{minRows: 2,maxRows: 2}" size="small"></i-input>    
                        </td>
                    </tr>
                    <tr>
                        <td>格式化方法：</td>
                        <td>
                            <i-input v-model="interfaceEntity.appCode" size="small"></i-input>
                        </td>
                    </tr>
                    <tr>
                        <td>备注：</td>
                        <td>
                            <i-input v-model="interfaceEntity.appCode" size="small"></i-input>
                        </td>
                    </tr>
                </table>
            </div>
            <div>
                <i-table :height="roleList.listHeight" stripe border :columns="roleList.columnsConfig" :data="roleList.tableData"
                     class="iv-list-table" :highlight-row="true"
                     @on-selection-change="selectionChange"></i-table>
            </div>
        </div>
        <div>2</div>
    </div>`
});
