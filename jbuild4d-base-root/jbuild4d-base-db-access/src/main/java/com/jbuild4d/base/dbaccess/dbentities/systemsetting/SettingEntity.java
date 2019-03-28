package com.jbuild4d.base.dbaccess.dbentities.systemsetting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :TSYS_SETTING
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class SettingEntity {
    //SETTING_ID:
    @DBKeyField
    private String settingId;

    //SETTING_KEY:
    private String settingKey;

    //SETTING_NAME:
    private String settingName;

    //SETTING_VALUE:
    private String settingValue;

    //SETTING_STATUS:
    private String settingStatus;

    //SETTING_DESC:
    private String settingDesc;

    //SETTING_CREATETIME:
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date settingCreatetime;

    //SETTING_USER_ID:
    private String settingUserId;

    //SETTING_USER_NAME:
    private String settingUserName;

    //SETTING_ORGAN_ID:
    private String settingOrganId;

    //SETTING_ORGAN_NAME:
    private String settingOrganName;

    //SETTING_API:
    private String settingApi;

    //SETTING_IS_SYSTEM:
    private String settingIsSystem;

    //SETTING_ORDER_NUM:排序号
    private Integer settingOrderNum;

    public SettingEntity(String settingId, String settingKey, String settingName, String settingValue, String settingStatus, String settingDesc, Date settingCreatetime, String settingUserId, String settingUserName, String settingOrganId, String settingOrganName, String settingApi, String settingIsSystem, Integer settingOrderNum) {
        this.settingId = settingId;
        this.settingKey = settingKey;
        this.settingName = settingName;
        this.settingValue = settingValue;
        this.settingStatus = settingStatus;
        this.settingDesc = settingDesc;
        this.settingCreatetime = settingCreatetime;
        this.settingUserId = settingUserId;
        this.settingUserName = settingUserName;
        this.settingOrganId = settingOrganId;
        this.settingOrganName = settingOrganName;
        this.settingApi = settingApi;
        this.settingIsSystem = settingIsSystem;
        this.settingOrderNum = settingOrderNum;
    }

    public SettingEntity() {
        super();
    }

    public String getSettingId() {
        return settingId;
    }

    public void setSettingId(String settingId) {
        this.settingId = settingId == null ? null : settingId.trim();
    }

    public String getSettingKey() {
        return settingKey;
    }

    public void setSettingKey(String settingKey) {
        this.settingKey = settingKey == null ? null : settingKey.trim();
    }

    public String getSettingName() {
        return settingName;
    }

    public void setSettingName(String settingName) {
        this.settingName = settingName == null ? null : settingName.trim();
    }

    public String getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(String settingValue) {
        this.settingValue = settingValue == null ? null : settingValue.trim();
    }

    public String getSettingStatus() {
        return settingStatus;
    }

    public void setSettingStatus(String settingStatus) {
        this.settingStatus = settingStatus == null ? null : settingStatus.trim();
    }

    public String getSettingDesc() {
        return settingDesc;
    }

    public void setSettingDesc(String settingDesc) {
        this.settingDesc = settingDesc == null ? null : settingDesc.trim();
    }

    public Date getSettingCreatetime() {
        return settingCreatetime;
    }

    public void setSettingCreatetime(Date settingCreatetime) {
        this.settingCreatetime = settingCreatetime;
    }

    public String getSettingUserId() {
        return settingUserId;
    }

    public void setSettingUserId(String settingUserId) {
        this.settingUserId = settingUserId == null ? null : settingUserId.trim();
    }

    public String getSettingUserName() {
        return settingUserName;
    }

    public void setSettingUserName(String settingUserName) {
        this.settingUserName = settingUserName == null ? null : settingUserName.trim();
    }

    public String getSettingOrganId() {
        return settingOrganId;
    }

    public void setSettingOrganId(String settingOrganId) {
        this.settingOrganId = settingOrganId == null ? null : settingOrganId.trim();
    }

    public String getSettingOrganName() {
        return settingOrganName;
    }

    public void setSettingOrganName(String settingOrganName) {
        this.settingOrganName = settingOrganName == null ? null : settingOrganName.trim();
    }

    public String getSettingApi() {
        return settingApi;
    }

    public void setSettingApi(String settingApi) {
        this.settingApi = settingApi == null ? null : settingApi.trim();
    }

    public String getSettingIsSystem() {
        return settingIsSystem;
    }

    public void setSettingIsSystem(String settingIsSystem) {
        this.settingIsSystem = settingIsSystem == null ? null : settingIsSystem.trim();
    }

    public Integer getSettingOrderNum() {
        return settingOrderNum;
    }

    public void setSettingOrderNum(Integer settingOrderNum) {
        this.settingOrderNum = settingOrderNum;
    }
}