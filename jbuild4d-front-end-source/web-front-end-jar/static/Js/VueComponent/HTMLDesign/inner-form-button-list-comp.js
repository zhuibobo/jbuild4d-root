/*窗体内按钮*/
Vue.component("inner-form-button-list-comp", {
    data: function () {
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
                            ListPageUtility.IViewTableInnerButton.EditButton(h,params,_self.idFieldName,_self),
                            ListPageUtility.IViewTableInnerButton.DeleteButton(h,params,_self.idFieldName,_self)
                        ]);
                    }
                }
            ],
            tableData: [
                {
                    formName:"123"
                }
            ]
        }
    },
    mounted:function(){

    },
    methods:{
        getJson:function () {

        },
        setJson:function () {

        }
    },
    template: `<div style="height: 170px" class="">
                    <div style="height: 30px">
                        <div style="float: right;">
                            <ButtonGroup size="small">
                                <i-button  type="success" @click="add()" icon="md-add">新增</i-button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
                                                 class="iv-list-table" :highlight-row="true"
                                                 @on-selection-change="selectionChange" size="small" :show-header="false"></i-table>
                </div>`
});