/*表关系内容*/
Vue.component("table-relation-content-comp", {
    props:["relation"],
    data: function () {
        return {
        }
    },
    mounted:function(){
    },
    methods:{

    },
    template: `<div>
                    <div>{{relation.relationDesc}}</div>
                </div>`
});
