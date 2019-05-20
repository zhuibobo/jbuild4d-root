/*绑定一般信息的Vue组件*/
Vue.component("fd-control-base-info", {
    props: ["value"],
    data: function () {
        return {
            baseInfo: {
                id: "",
                serialize: "",
                name: "",
                className: "",
                placeholder: "",
                custReadonly: "",
                custDisabled: "",
                style: "",
                desc: ""
            }
        }
    },
    //新增result的watch，监听变更同步到openStatus
    //监听父组件对props属性result的修改，并同步到组件内的data属性
    watch: {
        baseInfo: function (newVal) {
            // 必须是input
            this.$emit('input', newVal)
        },
        value: function (newVal) {
            this.baseInfo = newVal;
        }
    },
    mounted: function () {
        //debugger;
        this.baseInfo = this.value;
    },
    methods: {},
    template: `<table class="html-design-plugin-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
                    <colgroup>
                        <col style="width: 100px" />
                        <col style="width: 240px" />
                        <col style="width: 90px" />
                        <col style="width: 120px" />
                        <col style="width: 90px" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>ID：</td>
                            <td>
                                <input type="text" v-model="baseInfo.id" />
                            </td>
                            <td>Serialize：</td>
                            <td colspan="3">
                                <radio-group type="button" style="margin: auto" v-model="baseInfo.serialize">
                                    <radio label="true">是</radio>
                                    <radio label="false">否</radio>
                                </radio-group>
                            </td>
                        </tr>
                        <tr>
                            <td>Name：</td>
                            <td>
                                <input type="text" v-model="baseInfo.name" />
                            </td>
                            <td>ClassName：</td>
                            <td colspan="3">
                                <input type="text" v-model="baseInfo.className" />
                            </td>
                        </tr>
                        <tr>
                            <td>Placeholder</td>
                            <td>
                                <input type="text" v-model="baseInfo.placeholder" />
                            </td>
                            <td>Readonly：</td>
                            <td style="text-align: center">
                                <radio-group type="button" style="margin: auto" v-model="baseInfo.custReadonly">
                                    <radio label="readonly">是</radio>
                                    <radio label="noreadonly">否</radio>
                                </radio-group>
                            </td>
                            <td>Disabled：</td>
                            <td style="text-align: center">
                                <radio-group type="button" style="margin: auto" v-model="baseInfo.custDisabled">
                                    <radio label="disabled">是</radio>
                                    <radio label="nodisabled">否</radio>
                                </radio-group>
                            </td>
                        </tr>
                        <tr>
                            <td>样式：</td>
                            <td colspan="5">
                                <textarea rows="7" v-model="baseInfo.style"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td>备注：</td>
                            <td colspan="5">
                                <textarea rows="8" v-model="baseInfo.desc"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>`
});
