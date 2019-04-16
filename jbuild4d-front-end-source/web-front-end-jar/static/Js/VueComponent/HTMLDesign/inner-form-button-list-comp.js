/*窗体内按钮*/
Vue.component("inner-form-button-list-comp", {
    data: function () {
        var _self=this;

        return {
            columnsConfig: [
                {
                    title: '表单名称',
                    key: 'formName',
                    align: "center"
                }, {
                    title: '唯一名',
                    key: 'formSingleName',
                    align: "center"
                }, {
                    title: '操作',
                    key: 'formId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        //console.log(params);
                        //console.log(this);
                        return h('div',{class: "list-row-button-wrap"},[
                            //ListPageUtility.IViewTableInnerButton.EditButton(h,params,_self.idFieldName,_self),
                            //ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,_self.idFieldName,_self)
                        ]);
                    }
                }
            ],
            tableData: [
                {
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                },{
                    formName:"123"
                }
            ],
            normalProps:{}
        }
    },
    mounted:function(){

    },
    methods:{
        getJson:function () {

        },
        setJson:function () {

        },
        addInnerFormButton:function(){
            var elem=this.$refs.innerFormButtonEdit;

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 520,
                width: 620,
                title: "窗体内按钮"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex",10100);
            $(window.document).find(".ui-dialog").css("zIndex",10101);
        }
    },
    template: `<div style="height: 210px" class="">
                    <div ref="innerFormButtonEdit" class="html-design-plugin-dialog-wraper" style="display: none">
                        <tabs size="small">
                            <tab-pane label="绑定信息">
                                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                                    <colgroup>
                                        <col style="width: 100px" />
                                        <col style="width: 280px" />
                                        <col style="width: 100px" />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                            <tab-pane label="开发扩展">
                                <table cellpadding="0" cellspacing="0" border="0" class="html-design-plugin-dialog-table-wraper">
                                    <colgroup>
                                        <col style="width: 150px" />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>
                                                服务端解析类：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.serverResolveMethod" placeholder="按钮进行服务端解析时,类全称,将调用该类,需要实现接口IFormButtonCustResolve" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.serverResolveMethodPara" placeholder="服务端解析类的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                客户端渲染方法：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientRendererMethod" placeholder="客户端渲染方法,按钮将经由该方法渲染,最终形成页面元素,需要返回最终元素的HTML对象" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientRendererMethodPara" placeholder="客户端渲染方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                客户端渲染后方法：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientRendererAfterMethod" placeholder="客户端渲染后调用方法,经过默认的渲染,无返回值" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientRendererAfterMethodPara" placeholder="客户端渲染后方法的参数" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                客户端点击前方法：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientClickBeforeMethod" placeholder="客户端点击该按钮时的前置方法,如果返回false将阻止默认调用" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                参数：
                                            </td>
                                            <td>
                                                <i-input v-model="normalProps.clientClickBeforeMethodPara" placeholder="客户端点击前方法的参数" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </tab-pane>
                        </tabs>
                    </div>
                    <div style="height: 30px">
                        <div style="float: right;">
                            <ButtonGroup size="small">
                                <i-button type="success" @click="addInnerFormButton()" icon="md-add">保存按钮</i-button>
                                <i-button type="primary" icon="md-add">关闭按钮</i-button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <i-table :height="180" :width="660" stripe border :columns="columnsConfig" :data="tableData"
                                                 class="iv-list-table" :highlight-row="true"
                                                 size="small" :show-header="false"></i-table>
                </div>`
});