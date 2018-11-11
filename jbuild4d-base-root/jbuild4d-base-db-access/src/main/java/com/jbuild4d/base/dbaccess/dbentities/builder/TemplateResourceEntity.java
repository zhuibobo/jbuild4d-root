package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table tb4d_template_resource
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class TemplateResourceEntity {
    //TEMPLATE_ID
    @DBKeyField
    private String templateId;

    //TEMPLATE_NAME
    private String templateName;

    //TEMPLATE_CREATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date templateCreateTime;

    //TEMPLATE_CREATER
    private String templateCreater;

    //TEMPLATE_UPDATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date templateUpdateTime;

    //TEMPLATE_UPDATER
    private String templateUpdater;

    //TEMPLATE_TYPE
    private String templateType;

    //TEMPLATE_ISSYSTEM
    private String templateIssystem;

    //TEMPLATE_ORDER_NUM
    private Integer templateOrderNum;

    //TEMPLATE_DESC
    private String templateDesc;

    //TEMPLATE_MODULE_ID
    private String templateModuleId;

    //TEMPLATE_STATUS
    private String templateStatus;

    //TEMPLATE_ORGAN_ID
    private String templateOrganId;

    //TEMPLATE_ORGAN_NAME
    private String templateOrganName;

    //TEMPLATE_IS_TEMPLATE
    private String templateIsTemplate;

    //TEMPLATE_CONTENT_URL
    private String templateContentUrl;

    public TemplateResourceEntity(String templateId, String templateName, Date templateCreateTime, String templateCreater, Date templateUpdateTime, String templateUpdater, String templateType, String templateIssystem, Integer templateOrderNum, String templateDesc, String templateModuleId, String templateStatus, String templateOrganId, String templateOrganName, String templateIsTemplate, String templateContentUrl) {
        this.templateId = templateId;
        this.templateName = templateName;
        this.templateCreateTime = templateCreateTime;
        this.templateCreater = templateCreater;
        this.templateUpdateTime = templateUpdateTime;
        this.templateUpdater = templateUpdater;
        this.templateType = templateType;
        this.templateIssystem = templateIssystem;
        this.templateOrderNum = templateOrderNum;
        this.templateDesc = templateDesc;
        this.templateModuleId = templateModuleId;
        this.templateStatus = templateStatus;
        this.templateOrganId = templateOrganId;
        this.templateOrganName = templateOrganName;
        this.templateIsTemplate = templateIsTemplate;
        this.templateContentUrl = templateContentUrl;
    }

    public TemplateResourceEntity() {
        super();
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId == null ? null : templateId.trim();
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName == null ? null : templateName.trim();
    }

    public Date getTemplateCreateTime() {
        return templateCreateTime;
    }

    public void setTemplateCreateTime(Date templateCreateTime) {
        this.templateCreateTime = templateCreateTime;
    }

    public String getTemplateCreater() {
        return templateCreater;
    }

    public void setTemplateCreater(String templateCreater) {
        this.templateCreater = templateCreater == null ? null : templateCreater.trim();
    }

    public Date getTemplateUpdateTime() {
        return templateUpdateTime;
    }

    public void setTemplateUpdateTime(Date templateUpdateTime) {
        this.templateUpdateTime = templateUpdateTime;
    }

    public String getTemplateUpdater() {
        return templateUpdater;
    }

    public void setTemplateUpdater(String templateUpdater) {
        this.templateUpdater = templateUpdater == null ? null : templateUpdater.trim();
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType == null ? null : templateType.trim();
    }

    public String getTemplateIssystem() {
        return templateIssystem;
    }

    public void setTemplateIssystem(String templateIssystem) {
        this.templateIssystem = templateIssystem == null ? null : templateIssystem.trim();
    }

    public Integer getTemplateOrderNum() {
        return templateOrderNum;
    }

    public void setTemplateOrderNum(Integer templateOrderNum) {
        this.templateOrderNum = templateOrderNum;
    }

    public String getTemplateDesc() {
        return templateDesc;
    }

    public void setTemplateDesc(String templateDesc) {
        this.templateDesc = templateDesc == null ? null : templateDesc.trim();
    }

    public String getTemplateModuleId() {
        return templateModuleId;
    }

    public void setTemplateModuleId(String templateModuleId) {
        this.templateModuleId = templateModuleId == null ? null : templateModuleId.trim();
    }

    public String getTemplateStatus() {
        return templateStatus;
    }

    public void setTemplateStatus(String templateStatus) {
        this.templateStatus = templateStatus == null ? null : templateStatus.trim();
    }

    public String getTemplateOrganId() {
        return templateOrganId;
    }

    public void setTemplateOrganId(String templateOrganId) {
        this.templateOrganId = templateOrganId == null ? null : templateOrganId.trim();
    }

    public String getTemplateOrganName() {
        return templateOrganName;
    }

    public void setTemplateOrganName(String templateOrganName) {
        this.templateOrganName = templateOrganName == null ? null : templateOrganName.trim();
    }

    public String getTemplateIsTemplate() {
        return templateIsTemplate;
    }

    public void setTemplateIsTemplate(String templateIsTemplate) {
        this.templateIsTemplate = templateIsTemplate == null ? null : templateIsTemplate.trim();
    }

    public String getTemplateContentUrl() {
        return templateContentUrl;
    }

    public void setTemplateContentUrl(String templateContentUrl) {
        this.templateContentUrl = templateContentUrl == null ? null : templateContentUrl.trim();
    }
}