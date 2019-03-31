/*选择组织组件*/
Vue.component("table-relation-connect-two-table-dialog", {
    data: function () {
        return {
            acInterface: {

            }
        }
    },
    mounted:function(){

    },
    methods:{
        handleClose: function () {
            DialogUtility.CloseDialogElem(this.$refs.selectTableModelDialogWrap);
        },
        completed:function () {

        },
        beginSelectConnect:function (fromTableId,toTableId) {
            var elem=this.$refs.connectTableFieldModelDialogWrap;
            //debugger;
            //this.getTableDataInitTree();

            var height=450;
            if(PageStyleUtility.GetPageHeight()>550){
                height=600;
            }

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                width: 670,
                height: height,
                title: "设置关联"
            });
        }
    },
    template: `<div ref="connectTableFieldModelDialogWrap" class="c1-select-model-wrap general-edit-page-wrap" style="display: none">
                    <div class="c1-select-model-source-wrap c1-select-model-source-has-buttons-wrap">
                        <i-input search class="input_border_bottom" ref="txt_table_search_text" placeholder="请输入表名或者标题">
                        </i-input>
                        <div class="inner-wrap div-custom-scroll">
                            <ul ref="tableZTreeUL" class="ztree"></ul>
                        </div>
                    </div>
                    <div class="button-outer-wrap" style="bottom: 12px;right: 12px">
                        <div class="button-inner-wrap">
                            <button-group>
                                <i-button type="primary" @click="completed()" icon="md-checkmark">确认</i-button>
                                <i-button @click="handleClose()" icon="md-close">关闭</i-button>
                            </button-group>
                        </div>
                    </div>
               </div>`
});
