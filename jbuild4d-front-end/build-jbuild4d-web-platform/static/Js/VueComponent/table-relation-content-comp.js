/*表关系内容*/
Vue.component("table-relation-content-comp", {
    props:["relation"],
    data: function () {
        return {
        }
    },
    mounted:function(){
        alert(PageStyleUtility.GetPageHeight());
        $(this.$refs.relationContentOuterWrap).css("height",PageStyleUtility.GetPageHeight()-75);
    },
    methods:{
    },
    template: `<div ref="relationContentOuterWrap" class="table-relation-content-outer-wrap">
                    <div class="">{{relation.relationDesc}}</div>
                    <div></div>
                </div>`
});
