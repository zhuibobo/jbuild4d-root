package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table tb4d_module
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class ModuleEntity {
    //MODULE_ID
    @DBKeyField
    private String moduleId;

    //MODULE_VALUE
    private String moduleValue;

    //MODULE_TEXT
    private String moduleText;

    //MODULE_ORDER_NUM
    private Integer moduleOrderNum;

    //MODULE_CREATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date moduleCreateTime;

    //MODULE_DESC
    private String moduleDesc;

    //MODULE_STATUS
    private String moduleStatus;

    //MODULE_PARENT_ID
    private String moduleParentId;

    //MODULE_ISSYSTEM
    private String moduleIssystem;

    //MODULE_DEL_ENABLE
    private String moduleDelEnable;

    //MODULE_PID_LIST
    private String modulePidList;

    //MODULE_CHILD_COUNT
    private Integer moduleChildCount;

    //MODULE_ORGAN_ID
    private String moduleOrganId;

    //MODULE_ORGAN_NAME
    private String moduleOrganName;

    public ModuleEntity(String moduleId, String moduleValue, String moduleText, Integer moduleOrderNum, Date moduleCreateTime, String moduleDesc, String moduleStatus, String moduleParentId, String moduleIssystem, String moduleDelEnable, String modulePidList, Integer moduleChildCount, String moduleOrganId, String moduleOrganName) {
        this.moduleId = moduleId;
        this.moduleValue = moduleValue;
        this.moduleText = moduleText;
        this.moduleOrderNum = moduleOrderNum;
        this.moduleCreateTime = moduleCreateTime;
        this.moduleDesc = moduleDesc;
        this.moduleStatus = moduleStatus;
        this.moduleParentId = moduleParentId;
        this.moduleIssystem = moduleIssystem;
        this.moduleDelEnable = moduleDelEnable;
        this.modulePidList = modulePidList;
        this.moduleChildCount = moduleChildCount;
        this.moduleOrganId = moduleOrganId;
        this.moduleOrganName = moduleOrganName;
    }

    public ModuleEntity() {
        super();
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId == null ? null : moduleId.trim();
    }

    public String getModuleValue() {
        return moduleValue;
    }

    public void setModuleValue(String moduleValue) {
        this.moduleValue = moduleValue == null ? null : moduleValue.trim();
    }

    public String getModuleText() {
        return moduleText;
    }

    public void setModuleText(String moduleText) {
        this.moduleText = moduleText == null ? null : moduleText.trim();
    }

    public Integer getModuleOrderNum() {
        return moduleOrderNum;
    }

    public void setModuleOrderNum(Integer moduleOrderNum) {
        this.moduleOrderNum = moduleOrderNum;
    }

    public Date getModuleCreateTime() {
        return moduleCreateTime;
    }

    public void setModuleCreateTime(Date moduleCreateTime) {
        this.moduleCreateTime = moduleCreateTime;
    }

    public String getModuleDesc() {
        return moduleDesc;
    }

    public void setModuleDesc(String moduleDesc) {
        this.moduleDesc = moduleDesc == null ? null : moduleDesc.trim();
    }

    public String getModuleStatus() {
        return moduleStatus;
    }

    public void setModuleStatus(String moduleStatus) {
        this.moduleStatus = moduleStatus == null ? null : moduleStatus.trim();
    }

    public String getModuleParentId() {
        return moduleParentId;
    }

    public void setModuleParentId(String moduleParentId) {
        this.moduleParentId = moduleParentId == null ? null : moduleParentId.trim();
    }

    public String getModuleIssystem() {
        return moduleIssystem;
    }

    public void setModuleIssystem(String moduleIssystem) {
        this.moduleIssystem = moduleIssystem == null ? null : moduleIssystem.trim();
    }

    public String getModuleDelEnable() {
        return moduleDelEnable;
    }

    public void setModuleDelEnable(String moduleDelEnable) {
        this.moduleDelEnable = moduleDelEnable == null ? null : moduleDelEnable.trim();
    }

    public String getModulePidList() {
        return modulePidList;
    }

    public void setModulePidList(String modulePidList) {
        this.modulePidList = modulePidList == null ? null : modulePidList.trim();
    }

    public Integer getModuleChildCount() {
        return moduleChildCount;
    }

    public void setModuleChildCount(Integer moduleChildCount) {
        this.moduleChildCount = moduleChildCount;
    }

    public String getModuleOrganId() {
        return moduleOrganId;
    }

    public void setModuleOrganId(String moduleOrganId) {
        this.moduleOrganId = moduleOrganId == null ? null : moduleOrganId.trim();
    }

    public String getModuleOrganName() {
        return moduleOrganName;
    }

    public void setModuleOrganName(String moduleOrganName) {
        this.moduleOrganName = moduleOrganName == null ? null : moduleOrganName.trim();
    }
}