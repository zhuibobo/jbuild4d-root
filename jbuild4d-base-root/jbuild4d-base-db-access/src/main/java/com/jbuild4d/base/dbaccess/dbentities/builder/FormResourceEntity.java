package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table TBUILD_FORM_RESOURCE
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class FormResourceEntity {
    //FORM_ID
    @DBKeyField
    private String formId;

    //FORM_CODE
    private String formCode;

    //FORM_NAME
    private String formName;

    //FORM_SINGLE_NAME
    private String formSingleName;

    //FORM_CREATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date formCreateTime;

    //FORM_CREATER
    private String formCreater;

    //FORM_UPDATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date formUpdateTime;

    //FORM_UPDATER
    private String formUpdater;

    //FORM_TYPE
    private String formType;

    //FORM_ISSYSTEM
    private String formIssystem;

    //FORM_ORDER_NUM
    private Integer formOrderNum;

    //FORM_DESC
    private String formDesc;

    //FORM_MODULE_ID
    private String formModuleId;

    //FORM_STATUS
    private String formStatus;

    //FORM_ORGAN_ID
    private String formOrganId;

    //FORM_ORGAN_NAME
    private String formOrganName;

    //FORM_MAIN_TABLE_NAME
    private String formMainTableName;

    //FORM_MAIN_TABLE_CAPTION
    private String formMainTableCaption;

    //FORM_DATA_RELATION
    private String formDataRelation;

    //FORM_IS_TEMPLATE
    private String formIsTemplate;

    //FORM_IS_RESOLVE
    private String formIsResolve;

    //FORM_CONTENT_URL
    private String formContentUrl;

    public FormResourceEntity(String formId, String formCode, String formName, String formSingleName, Date formCreateTime, String formCreater, Date formUpdateTime, String formUpdater, String formType, String formIssystem, Integer formOrderNum, String formDesc, String formModuleId, String formStatus, String formOrganId, String formOrganName, String formMainTableName, String formMainTableCaption, String formDataRelation, String formIsTemplate, String formIsResolve, String formContentUrl) {
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
        this.formContentUrl = formContentUrl;
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

    public String getFormContentUrl() {
        return formContentUrl;
    }

    public void setFormContentUrl(String formContentUrl) {
        this.formContentUrl = formContentUrl == null ? null : formContentUrl.trim();
    }
}