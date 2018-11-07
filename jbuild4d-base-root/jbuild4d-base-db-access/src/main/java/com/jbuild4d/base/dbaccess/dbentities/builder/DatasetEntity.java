package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table tb4d_dataset
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class DatasetEntity {
    //DS_ID
    @DBKeyField
    private String dsId;

    //DS_CAPTION
    private String dsCaption;

    //DS_NAME
    private String dsName;

    //DS_ORGAN_ID
    private String dsOrganId;

    //DS_CREATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dsCreateTime;

    //DS_CREATER
    private String dsCreater;

    //DS_UPDATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dsUpdateTime;

    //DS_UPDATER
    private String dsUpdater;

    //DS_TYPE
    private String dsType;

    //DS_ISSYSTEM
    private String dsIssystem;

    //DS_ORDER_NUM
    private Integer dsOrderNum;

    //DS_DESC
    private String dsDesc;

    //DS_GROUP_ID
    private String dsGroupId;

    //DS_STATUS
    private String dsStatus;

    //DS_SQL_SELECT_TEXT
    private String dsSqlSelectText;

    //DS_SQL_SELECT_VALUE
    private String dsSqlSelectValue;

    //DS_CLASS_NAME
    private String dsClassName;

    //DS_REST_STRUCTURE_URL
    private String dsRestStructureUrl;

    //DS_REST_DATA_URL
    private String dsRestDataUrl;

    public DatasetEntity(String dsId, String dsCaption, String dsName, String dsOrganId, Date dsCreateTime, String dsCreater, Date dsUpdateTime, String dsUpdater, String dsType, String dsIssystem, Integer dsOrderNum, String dsDesc, String dsGroupId, String dsStatus, String dsSqlSelectText, String dsSqlSelectValue, String dsClassName, String dsRestStructureUrl, String dsRestDataUrl) {
        this.dsId = dsId;
        this.dsCaption = dsCaption;
        this.dsName = dsName;
        this.dsOrganId = dsOrganId;
        this.dsCreateTime = dsCreateTime;
        this.dsCreater = dsCreater;
        this.dsUpdateTime = dsUpdateTime;
        this.dsUpdater = dsUpdater;
        this.dsType = dsType;
        this.dsIssystem = dsIssystem;
        this.dsOrderNum = dsOrderNum;
        this.dsDesc = dsDesc;
        this.dsGroupId = dsGroupId;
        this.dsStatus = dsStatus;
        this.dsSqlSelectText = dsSqlSelectText;
        this.dsSqlSelectValue = dsSqlSelectValue;
        this.dsClassName = dsClassName;
        this.dsRestStructureUrl = dsRestStructureUrl;
        this.dsRestDataUrl = dsRestDataUrl;
    }

    public DatasetEntity() {
        super();
    }

    public String getDsId() {
        return dsId;
    }

    public void setDsId(String dsId) {
        this.dsId = dsId == null ? null : dsId.trim();
    }

    public String getDsCaption() {
        return dsCaption;
    }

    public void setDsCaption(String dsCaption) {
        this.dsCaption = dsCaption == null ? null : dsCaption.trim();
    }

    public String getDsName() {
        return dsName;
    }

    public void setDsName(String dsName) {
        this.dsName = dsName == null ? null : dsName.trim();
    }

    public String getDsOrganId() {
        return dsOrganId;
    }

    public void setDsOrganId(String dsOrganId) {
        this.dsOrganId = dsOrganId == null ? null : dsOrganId.trim();
    }

    public Date getDsCreateTime() {
        return dsCreateTime;
    }

    public void setDsCreateTime(Date dsCreateTime) {
        this.dsCreateTime = dsCreateTime;
    }

    public String getDsCreater() {
        return dsCreater;
    }

    public void setDsCreater(String dsCreater) {
        this.dsCreater = dsCreater == null ? null : dsCreater.trim();
    }

    public Date getDsUpdateTime() {
        return dsUpdateTime;
    }

    public void setDsUpdateTime(Date dsUpdateTime) {
        this.dsUpdateTime = dsUpdateTime;
    }

    public String getDsUpdater() {
        return dsUpdater;
    }

    public void setDsUpdater(String dsUpdater) {
        this.dsUpdater = dsUpdater == null ? null : dsUpdater.trim();
    }

    public String getDsType() {
        return dsType;
    }

    public void setDsType(String dsType) {
        this.dsType = dsType == null ? null : dsType.trim();
    }

    public String getDsIssystem() {
        return dsIssystem;
    }

    public void setDsIssystem(String dsIssystem) {
        this.dsIssystem = dsIssystem == null ? null : dsIssystem.trim();
    }

    public Integer getDsOrderNum() {
        return dsOrderNum;
    }

    public void setDsOrderNum(Integer dsOrderNum) {
        this.dsOrderNum = dsOrderNum;
    }

    public String getDsDesc() {
        return dsDesc;
    }

    public void setDsDesc(String dsDesc) {
        this.dsDesc = dsDesc == null ? null : dsDesc.trim();
    }

    public String getDsGroupId() {
        return dsGroupId;
    }

    public void setDsGroupId(String dsGroupId) {
        this.dsGroupId = dsGroupId == null ? null : dsGroupId.trim();
    }

    public String getDsStatus() {
        return dsStatus;
    }

    public void setDsStatus(String dsStatus) {
        this.dsStatus = dsStatus == null ? null : dsStatus.trim();
    }

    public String getDsSqlSelectText() {
        return dsSqlSelectText;
    }

    public void setDsSqlSelectText(String dsSqlSelectText) {
        this.dsSqlSelectText = dsSqlSelectText == null ? null : dsSqlSelectText.trim();
    }

    public String getDsSqlSelectValue() {
        return dsSqlSelectValue;
    }

    public void setDsSqlSelectValue(String dsSqlSelectValue) {
        this.dsSqlSelectValue = dsSqlSelectValue == null ? null : dsSqlSelectValue.trim();
    }

    public String getDsClassName() {
        return dsClassName;
    }

    public void setDsClassName(String dsClassName) {
        this.dsClassName = dsClassName == null ? null : dsClassName.trim();
    }

    public String getDsRestStructureUrl() {
        return dsRestStructureUrl;
    }

    public void setDsRestStructureUrl(String dsRestStructureUrl) {
        this.dsRestStructureUrl = dsRestStructureUrl == null ? null : dsRestStructureUrl.trim();
    }

    public String getDsRestDataUrl() {
        return dsRestDataUrl;
    }

    public void setDsRestDataUrl(String dsRestDataUrl) {
        this.dsRestDataUrl = dsRestDataUrl == null ? null : dsRestDataUrl.trim();
    }
}