package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tbuild_form_resource
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class FormResourceEntity {
    //FORM_ID:
    @DBKeyField
    private String formId;

    //FORM_CODE:窗体编号:无特殊作用,序列生成,便于查找
    private String formCode;

    //FORM_NAME:窗体名称
    private String formName;

    //FORM_SINGLE_NAME:唯一名称:可以为空,如果存在则必须唯一
    private String formSingleName;

    //FORM_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date formCreateTime;

    //FORM_CREATER:创建人
    private String formCreater;

    //FORM_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date formUpdateTime;

    //FORM_UPDATER:更新人
    private String formUpdater;

    //FORM_TYPE:表单类型:业务表单.....
    private String formType;

    //FORM_ISSYSTEM:是否系统
    private String formIssystem;

    //FORM_ORDER_NUM:排序号
    private Integer formOrderNum;

    //FORM_DESC:备注
    private String formDesc;

    //FORM_MODULE_ID:所属模块ID
    private String formModuleId;

    //FORM_STATUS:状态
    private String formStatus;

    //FORM_ORGAN_ID:创建组织ID
    private String formOrganId;

    //FORM_ORGAN_NAME:创建组织名称
    private String formOrganName;

    //FORM_MAIN_TABLE_NAME:表单的主表名称:从数据关系字段FORM_DATA_RELATION提取
    private String formMainTableName;

    //FORM_MAIN_TABLE_CAPTION:表单的主表标题:从数据关系字段FORM_DATA_RELATION提取
    private String formMainTableCaption;

    //FORM_DATA_RELATION:数据关系的设置:根节点为主表
    private String formDataRelation;

    //FORM_IS_TEMPLATE:是否模版:未使用
    private String formIsTemplate;

    //FORM_IS_RESOLVE:是否进行了解析:解析过的表单将不再进行服务端的解析
    private String formIsResolve;

    //FORM_EVERY_TIME_RESOLVE:是否每次都进行服务端解析:默认为否,只解析一次
    private String formEveryTimeResolve;

    //FORM_SOURCE:表单的来源:Web设计器,URL引入...
    private String formSource;

    //FORM_CONTENT_URL:引入表单的URL地址
    private String formContentUrl;

    //FORM_THEME:风格主题:基于配置文件中的配置
    private String formTheme;

    //FORM_CUST_SERVER_RENDERER:服务端自定义的渲染方法:继承IFormSeverRenderer
    private String formCustServerRenderer;

    //FORM_CUST_REF_JS:引入的脚本:多个通过;分割
    private String formCustRefJs;

    //FORM_CUST_CLIENT_RENDERER:客户端自定义的渲染方法:需要指明具体的方法名称
    private String formCustClientRenderer;

    //FORM_CUST_DESC:自定义设置备注:使用了自定义设置相关方法的备注说明
    private String formCustDesc;

    public FormResourceEntity(String formId, String formCode, String formName, String formSingleName, Date formCreateTime, String formCreater, Date formUpdateTime, String formUpdater, String formType, String formIssystem, Integer formOrderNum, String formDesc, String formModuleId, String formStatus, String formOrganId, String formOrganName, String formMainTableName, String formMainTableCaption, String formDataRelation, String formIsTemplate, String formIsResolve, String formEveryTimeResolve, String formSource, String formContentUrl, String formTheme, String formCustServerRenderer, String formCustRefJs, String formCustClientRenderer, String formCustDesc) {
        this.formId = formId;
        this.formCode = formCode;
        this.formName = formName;
        this.formSingleName = formSingleName;
        this.formCreateTime = formCreateTime;
        this.formCreater = formCreater;
        this.formUpdateTime = formUpdateTime;
        this.formUpdater = formUpdater;
        this.formType = formType;
        this.formIssystem = formIssystem;
        this.formOrderNum = formOrderNum;
        this.formDesc = formDesc;
        this.formModuleId = formModuleId;
        this.formStatus = formStatus;
        this.formOrganId = formOrganId;
        this.formOrganName = formOrganName;
        this.formMainTableName = formMainTableName;
        this.formMainTableCaption = formMainTableCaption;
        this.formDataRelation = formDataRelation;
        this.formIsTemplate = formIsTemplate;
        this.formIsResolve = formIsResolve;
        this.formEveryTimeResolve = formEveryTimeResolve;
        this.formSource = formSource;
        this.formContentUrl = formContentUrl;
        this.formTheme = formTheme;
        this.formCustServerRenderer = formCustServerRenderer;
        this.formCustRefJs = formCustRefJs;
        this.formCustClientRenderer = formCustClientRenderer;
        this.formCustDesc = formCustDesc;
    }

    public FormResourceEntity() {
        super();
    }

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId == null ? null : formId.trim();
    }

    public String getFormCode() {
        return formCode;
    }

    public void setFormCode(String formCode) {
        this.formCode = formCode == null ? null : formCode.trim();
    }

    public String getFormName() {
        return formName;
    }

    public void setFormName(String formName) {
        this.formName = formName == null ? null : formName.trim();
    }

    public String getFormSingleName() {
        return formSingleName;
    }

    public void setFormSingleName(String formSingleName) {
        this.formSingleName = formSingleName == null ? null : formSingleName.trim();
    }

    public Date getFormCreateTime() {
        return formCreateTime;
    }

    public void setFormCreateTime(Date formCreateTime) {
        this.formCreateTime = formCreateTime;
    }

    public String getFormCreater() {
        return formCreater;
    }

    public void setFormCreater(String formCreater) {
        this.formCreater = formCreater == null ? null : formCreater.trim();
    }

    public Date getFormUpdateTime() {
        return formUpdateTime;
    }

    public void setFormUpdateTime(Date formUpdateTime) {
        this.formUpdateTime = formUpdateTime;
    }

    public String getFormUpdater() {
        return formUpdater;
    }

    public void setFormUpdater(String formUpdater) {
        this.formUpdater = formUpdater == null ? null : formUpdater.trim();
    }

    public String getFormType() {
        return formType;
    }

    public void setFormType(String formType) {
        this.formType = formType == null ? null : formType.trim();
    }

    public String getFormIssystem() {
        return formIssystem;
    }

    public void setFormIssystem(String formIssystem) {
        this.formIssystem = formIssystem == null ? null : formIssystem.trim();
    }

    public Integer getFormOrderNum() {
        return formOrderNum;
    }

    public void setFormOrderNum(Integer formOrderNum) {
        this.formOrderNum = formOrderNum;
    }

    public String getFormDesc() {
        return formDesc;
    }

    public void setFormDesc(String formDesc) {
        this.formDesc = formDesc == null ? null : formDesc.trim();
    }

    public String getFormModuleId() {
        return formModuleId;
    }

    public void setFormModuleId(String formModuleId) {
        this.formModuleId = formModuleId == null ? null : formModuleId.trim();
    }

    public String getFormStatus() {
        return formStatus;
    }

    public void setFormStatus(String formStatus) {
        this.formStatus = formStatus == null ? null : formStatus.trim();
    }

    public String getFormOrganId() {
        return formOrganId;
    }

    public void setFormOrganId(String formOrganId) {
        this.formOrganId = formOrganId == null ? null : formOrganId.trim();
    }

    public String getFormOrganName() {
        return formOrganName;
    }

    public void setFormOrganName(String formOrganName) {
        this.formOrganName = formOrganName == null ? null : formOrganName.trim();
    }

    public String getFormMainTableName() {
        return formMainTableName;
    }

    public void setFormMainTableName(String formMainTableName) {
        this.formMainTableName = formMainTableName == null ? null : formMainTableName.trim();
    }

    public String getFormMainTableCaption() {
        return formMainTableCaption;
    }

    public void setFormMainTableCaption(String formMainTableCaption) {
        this.formMainTableCaption = formMainTableCaption == null ? null : formMainTableCaption.trim();
    }

    public String getFormDataRelation() {
        return formDataRelation;
    }

    public void setFormDataRelation(String formDataRelation) {
        this.formDataRelation = formDataRelation == null ? null : formDataRelation.trim();
    }

    public String getFormIsTemplate() {
        return formIsTemplate;
    }

    public void setFormIsTemplate(String formIsTemplate) {
        this.formIsTemplate = formIsTemplate == null ? null : formIsTemplate.trim();
    }

    public String getFormIsResolve() {
        return formIsResolve;
    }

    public void setFormIsResolve(String formIsResolve) {
        this.formIsResolve = formIsResolve == null ? null : formIsResolve.trim();
    }

    public String getFormEveryTimeResolve() {
        return formEveryTimeResolve;
    }

    public void setFormEveryTimeResolve(String formEveryTimeResolve) {
        this.formEveryTimeResolve = formEveryTimeResolve == null ? null : formEveryTimeResolve.trim();
    }

    public String getFormSource() {
        return formSource;
    }

    public void setFormSource(String formSource) {
        this.formSource = formSource == null ? null : formSource.trim();
    }

    public String getFormContentUrl() {
        return formContentUrl;
    }

    public void setFormContentUrl(String formContentUrl) {
        this.formContentUrl = formContentUrl == null ? null : formContentUrl.trim();
    }

    public String getFormTheme() {
        return formTheme;
    }

    public void setFormTheme(String formTheme) {
        this.formTheme = formTheme == null ? null : formTheme.trim();
    }

    public String getFormCustServerRenderer() {
        return formCustServerRenderer;
    }

    public void setFormCustServerRenderer(String formCustServerRenderer) {
        this.formCustServerRenderer = formCustServerRenderer == null ? null : formCustServerRenderer.trim();
    }

    public String getFormCustRefJs() {
        return formCustRefJs;
    }

    public void setFormCustRefJs(String formCustRefJs) {
        this.formCustRefJs = formCustRefJs == null ? null : formCustRefJs.trim();
    }

    public String getFormCustClientRenderer() {
        return formCustClientRenderer;
    }

    public void setFormCustClientRenderer(String formCustClientRenderer) {
        this.formCustClientRenderer = formCustClientRenderer == null ? null : formCustClientRenderer.trim();
    }

    public String getFormCustDesc() {
        return formCustDesc;
    }

    public void setFormCustDesc(String formCustDesc) {
        this.formCustDesc = formCustDesc == null ? null : formCustDesc.trim();
    }
}