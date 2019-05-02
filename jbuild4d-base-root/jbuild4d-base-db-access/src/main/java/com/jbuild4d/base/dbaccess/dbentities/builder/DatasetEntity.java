package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :nullTBUILD_DATASET
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class DatasetEntity {
    //DS_ID:主键:UUID
    @DBKeyField
    private String dsId;

    //DS_CODE:数据集编号:无特殊作用,序列生成,便于查找,禁止用于开发
    private String dsCode;

    //DS_CAPTION:数据集标题
    private String dsCaption;

    //DS_NAME:数据集名称
    private String dsName;

    //DS_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dsCreateTime;

    //DS_CREATER:创建人
    private String dsCreater;

    //DS_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dsUpdateTime;

    //DS_UPDATER:更新人
    private String dsUpdater;

    //DS_TYPE:类型
    private String dsType;

    //DS_ISSYSTEM:是否系统所有
    private String dsIssystem;

    //DS_ORDER_NUM:排序号
    private Integer dsOrderNum;

    //DS_DESC:备注
    private String dsDesc;

    //DS_GROUP_ID:所属分组ID
    private String dsGroupId;

    //DS_STATUS:状态
    private String dsStatus;

    //DS_SQL_SELECT_TEXT:查询的SQL原始文本
    private String dsSqlSelectText;

    //DS_SQL_SELECT_VALUE:实际用于查询的SQL
    private String dsSqlSelectValue;

    //DS_SQL_DB_LINK_ID:数据库连接ID:数据集为SQL形成时,目标库的ID
    private String dsSqlDbLinkId;

    //DS_CLASS_NAME:API类的名称
    private String dsClassName;

    //DS_REST_STRUCTURE_URL:REST数据集结构的接口地址
    private String dsRestStructureUrl;

    //DS_REST_DATA_URL:REST数据集的接口地址
    private String dsRestDataUrl;

    //DS_ORGAN_ID:组织ID
    private String dsOrganId;

    //DS_ORGAN_NAME:组织名称
    private String dsOrganName;

    public DatasetEntity(String dsId, String dsCode, String dsCaption, String dsName, Date dsCreateTime, String dsCreater, Date dsUpdateTime, String dsUpdater, String dsType, String dsIssystem, Integer dsOrderNum, String dsDesc, String dsGroupId, String dsStatus, String dsSqlSelectText, String dsSqlSelectValue, String dsSqlDbLinkId, String dsClassName, String dsRestStructureUrl, String dsRestDataUrl, String dsOrganId, String dsOrganName) {
        this.dsId = dsId;
        this.dsCode = dsCode;
        this.dsCaption = dsCaption;
        this.dsName = dsName;
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
        this.dsSqlDbLinkId = dsSqlDbLinkId;
        this.dsClassName = dsClassName;
        this.dsRestStructureUrl = dsRestStructureUrl;
        this.dsRestDataUrl = dsRestDataUrl;
        this.dsOrganId = dsOrganId;
        this.dsOrganName = dsOrganName;
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

    public String getDsCode() {
        return dsCode;
    }

    public void setDsCode(String dsCode) {
        this.dsCode = dsCode == null ? null : dsCode.trim();
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

    public String getDsSqlDbLinkId() {
        return dsSqlDbLinkId;
    }

    public void setDsSqlDbLinkId(String dsSqlDbLinkId) {
        this.dsSqlDbLinkId = dsSqlDbLinkId == null ? null : dsSqlDbLinkId.trim();
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

    public String getDsOrganId() {
        return dsOrganId;
    }

    public void setDsOrganId(String dsOrganId) {
        this.dsOrganId = dsOrganId == null ? null : dsOrganId.trim();
    }

    public String getDsOrganName() {
        return dsOrganName;
    }

    public void setDsOrganName(String dsOrganName) {
        this.dsOrganName = dsOrganName == null ? null : dsOrganName.trim();
    }
}