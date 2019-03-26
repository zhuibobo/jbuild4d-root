/*表关系内容*/
Vue.component("table-relation-content-comp", {
    props:["relation"],
    data: function () {
        return {
        }
    },
    mounted:function(){
        //alert(PageStyleUtility.GetPageHeight());
        $(this.$refs.relationContentOuterWrap).css("height",PageStyleUtility.GetPageHeight()-80);
    },
    methods:{
    },
    template: `<div ref="relationContentOuterWrap" class="table-relation-content-outer-wrap">
                    <div>{{relation.relationDesc}}</div>
                </div>`
});
