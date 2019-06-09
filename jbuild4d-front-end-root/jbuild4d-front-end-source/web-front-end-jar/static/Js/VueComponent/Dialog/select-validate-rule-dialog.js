Vue.component("select-validate-rule-dialog", {
    data:function () {
        var _self=this;

        return {
            selectValidateType:"NoEmpty",
            ruleParas:{
                msg:"字段",
                numLength:4,
                decimalLength:0,
                jsMethodName:"",
                regularText:"",
                regularMsg:""
            },
            addedValidateRule:[],
            validateColumnsConfig: [
                {
                    title: '类型',
                    key: 'validateType',
                    width: 150,
                    align: "center"
                },{
                    title: '参数',
                    key: 'validateParas',
                    align: "center"
                }, {
                    title: '删除',
                    key: 'validateId',
                    width: 120,
                    align: "center",
                    render: function (h, params) {
                        return h('div',{class: "list-row-button-wrap"},[
                            h('div', {
                                class: "list-row-button del",
                                on: {
                                    click: function () {
                                        _self.delValidate(params.row["validateId"]);
                                    }
                                }
                            })
                        ]);
                    }
                }
            ]
        }
    },
    mounted:function (){
        //this.loadData();
    },
    methods:{
        beginSelect:function(oldData) {
            //debugger;
            var elem = this.$refs.selectValidateRuleDialogWrap;
            //debugger;
            //this.getTableDataInitTree();

            var height = 450;
            /*if(PageStyleUtility.GetPageHeight()>550){
                height=600;
            }*/

            DialogUtility.DialogElemObj(elem, {
                modal: true,
                height: 680,
                width: 980,
                title: "设置验证规则"
            });

            $(window.document).find(".ui-widget-overlay").css("zIndex", 10100);
            $(window.document).find(".ui-dialog").css("zIndex", 10101);

            this.ruleParas.msg = "字段";
            this.ruleParas.numLength = 4;
            this.ruleParas.decimalLength = 0;
            this.ruleParas.jsMethodName = "";
            this.ruleParas.regularText = "";
            this.ruleParas.regularMsg = "";
            this.addedValidateRule=[];

            this.bindOldSelectedValue(oldData);
        },
        bindOldSelectedValue:function(oldData){
            var oldSelectedValue= oldData;
            //debugger;
            if(oldSelectedValue.rules.length>0) {
                this.addedValidateRule=oldSelectedValue.rules;
                this.msg=oldSelectedValue.msg;
            }
        },
        getSelectInstanceName:function () {
            return BaseUtility.GetUrlParaValue("instanceName");
        },
        selectComplete:function(){
            var result=this.addedValidateRule;
            if(this.addedValidateRule.length>0) {
                var result={
                    msg:this.ruleParas.msg,
                    rules:this.addedValidateRule
                };
                //window.OpenerWindowObj[this.getSelectInstanceName()].setSelectValidateRuleResultValue(result);

                this.$emit('on-selected-validate-rule', JsonUtility.CloneSimple(result));
                this.handleClose();
            }
            else{
                this.clearComplete();
            }
        },
        clearComplete:function(){
            window.OpenerWindowObj[this.getSelectInstanceName()].setSelectValidateRuleResultValue(null);
            this.handleClose();
        },
        handleClose:function(){
            /*if(window.IsOpenForFrame){
                DialogUtility.Frame_CloseDialog(window)
            }
            else {
                DialogUtility.CloseOpenIframeWindow(window, DialogUtility.DialogId);
            }*/
            DialogUtility.CloseDialogElem(this.$refs.selectValidateRuleDialogWrap);
        },
        addValidateRule:function(){
            //debugger;
            var validateParas="";
            if(this.selectValidateType=="Number"){
                validateParas=JsonUtility.JsonToString({
                    numLength:this.ruleParas.numLength,
                    decimalLength:this.ruleParas.decimalLength
                });
            }
            else if(this.selectValidateType=="Regular"){
                validateParas=JsonUtility.JsonToString({
                    regularText:this.ruleParas.regularText,
                    regularMsg:this.ruleParas.regularMsg
                });
            }
            else if(this.selectValidateType=="JsMethod"){
                validateParas=JsonUtility.JsonToString({
                    jsMethodName:this.ruleParas.jsMethodName
                });
            }
            var newValidateRule={
                "validateId":StringUtility.Timestamp(),
                "validateType":this.selectValidateType,
                "validateParas":validateParas
            };
            this.addedValidateRule.push(newValidateRule);
        },
        delValidate:function (validateId) {
            //debugger;
            for(var i=0;i<this.addedValidateRule.length;i++){
                if(this.addedValidateRule[i].validateId==validateId){
                    this.addedValidateRule.splice(i,1);
                }
            }
        }
    },
    template: `<div ref="selectValidateRuleDialogWrap" v-cloak class="general-edit-page-wrap" style="display: none">
                    <card style="margin-top: 10px" >
                        <p slot="title">设置验证规则</p>
                        <div>
                            <radio-group type="button" style="margin: auto" v-model="selectValidateType">
                                <radio label="NoEmpty">不能为空</radio>
                                <radio label="Number">数字</radio>
                                <radio label="Mobile">手机</radio>
                                <radio label="Date">日期</radio>
                                <radio label="Time">时间</radio>
                                <radio label="DateTime">日期时间</radio>
                                <radio label="EMail">邮件</radio>
                                <radio label="IDCard">身份证</radio>
                                <radio label="URL">URL</radio>
                                <radio label="ENCode">英文</radio>
                                <radio label="SimpleCode">特殊字符</radio>
                                <radio label="Regular">正则表达式</radio>
                                <radio label="JsMethod">JS方法</radio>
                            </radio-group>
                            <i-button type="success" shape="circle" icon="md-add" style="margin-left: 15px;cursor: pointer" @click="addValidateRule"></i-button>
                        </div>
                        <div>
                            <divider orientation="left" :dashed="true" style="font-size: 12px">参数设置</divider>
                            <!--数字类型参数设置-->
                            <div v-if="selectValidateType=='Number'">
                                <i-form :label-width="80">
                                    <form-item label="长度：">
                                        <row>
                                            <i-col span="10">
                                                <form-item>
                                                    <input-number :max="10" :min="1" v-model="ruleParas.numLength" size="small" style="width: 80%"></input-number>
                                                </form-item>
                                            </i-col>
                                            <i-col span="4" style="text-align: center">小数位数：</i-col>
                                            <i-col span="10">
                                                <form-item>
                                                    <input-number :max="10" :min="0" v-model="ruleParas.decimalLength" size="small" style="width: 80%"></input-number>
                                                </form-item>
                                            </i-col>
                                        </row>
                                    </form-item>
                                </i-form>
                            </div>
                            <!--正则表达式类型参数设置-->
                            <div v-if="selectValidateType=='Regular'">
                                <i-form :label-width="80">
                                    <form-item label="表达式：">
                                        <row>
                                            <i-col span="10">
                                                <form-item>
                                                    <i-input size="small" placeholder="Enter something..." v-model="ruleParas.regularText" style="width: 80%"></i-input>
                                                </form-item>
                                            </i-col>
                                            <i-col span="4" style="text-align: center">提示信息：</i-col>
                                            <i-col span="10">
                                                <form-item>
                                                    <i-input size="small" placeholder="Enter something..." v-model="ruleParas.regularMsg" style="width: 80%"></i-input>
                                                </form-item>
                                            </i-col>
                                        </row>
                                    </form-item>
                                </i-form>
                            </div>
                            <!--JS方法类型参数设置-->
                            <div v-if="selectValidateType=='JsMethod'">
                                <i-form :label-width="80">
                                    <form-item label="方法名：">
                                        <i-input size="small" placeholder="Enter something..." v-model="ruleParas.jsMethodName" style="width: 90%"></i-input>
                                    </form-item>
                                </i-form>
                            </div>
                        </div>
                    </card>
                    <card style="margin-top: 10px">
                        <p slot="title">已添加规则</p>
                        <div>
                            <divider orientation="left" :dashed="true" style="font-size: 12px;margin-top: 0px;margin-bottom: 6px">提示信息</divider>
                            <i-form :label-width="0">
                                <form-item label="">
                                    <i-input  placeholder="请输入提示信息..."  v-model="ruleParas.msg"></i-input>
                                </form-item>
                            </i-form>
                        </div>
                        <div style="margin-bottom: 10px;max-height: 220px;overflow: auto" class="iv-list-page-wrap">
                            <divider orientation="left" :dashed="true" style="font-size: 12px;margin-top: 0px;margin-bottom: 6px">验证规则</divider>
                            <i-table border :columns="validateColumnsConfig" :data="addedValidateRule"
                                     class="iv-list-table" :highlight-row="true" size="small" no-data-text="请添加验证规则"></i-table>
                        </div>
                    </card>
                    <div class="button-outer-wrap">
                        <div class="button-inner-wrap">
                            <button-group>
                                <i-button type="primary" @click="selectComplete()"> 确 认 </i-button>
                                <i-button type="primary" @click="clearComplete()"> 清 空 </i-button>
                                <i-button @click="handleClose()">关 闭</i-button>
                            </button-group>
                        </div>
                    </div>
                </div>`
});
