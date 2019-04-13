package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :nullTBUILD_TABLE
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class TableEntity {
    //TABLE_ID:主键:UUID
    @DBKeyField
    private String tableId;

    //TABLE_CODE:表编号:无特殊作用,序列生成,便于查找,禁止用于开发
    private String tableCode;

    //TABLE_CAPTION:表标题
    private String tableCaption;

    //TABLE_NAME:表名称:在数据库中的名称
    private String tableName;

    //TABLE_DBNAME:所属库名
    private String tableDbname;

    //TABLE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date tableCreateTime;

    //TABLE_CREATER:创建人
    private String tableCreater;

    //TABLE_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date tableUpdateTime;

    //TABLE_UPDATER:更新人
    private String tableUpdater;

    //TABLE_SERVICE_VALUE:连接服务值
    private String tableServiceValue;

    //TABLE_TYPE:表类型:DBDesign=直接在数据库中设计的,Builder=通过表设计器设计
    private String tableType;

    //TABLE_ISSYSTEM:是否系统表:系统表不允许修改
    private String tableIssystem;

    //TABLE_ORDER_NUM:排序号
    private Integer tableOrderNum;

    //TABLE_DESC:备注
    private String tableDesc;

    //TABLE_GROUP_ID:所属分组ID
    private String tableGroupId;

    //TABLE_STATUS:状态
    private String tableStatus;

    //TABLE_LINK_ID:连接服务ID
    private String tableLinkId;

    //TABLE_ORGAN_ID:组织ID
    private String tableOrganId;

    //TABLE_ORGAN_NAME:组织名称
    private String tableOrganName;

    public TableEntity(String tableId, String tableCode, String tableCaption, String tableName, String tableDbname, Date tableCreateTime, String tableCreater, Date tableUpdateTime, String tableUpdater, String tableServiceValue, String tableType, String tableIssystem, Integer tableOrderNum, String tableDesc, String tableGroupId, String tableStatus, String tableLinkId, String tableOrganId, String tableOrganName) {
        this.tableId = tableId;
        this.tableCode = tableCode;
        this.tableCaption = tableCaption;
        this.tableName = tableName;
        this.tableDbname = tableDbname;
        this.tableCreateTime = tableCreateTime;
        this.tableCreater = tableCreater;
        this.tableUpdateTime = tableUpdateTime;
        this.tableUpdater = tableUpdater;
        this.tableServiceValue = tableServiceValue;
        this.tableType = tableType;
        this.tableIssystem = tableIssystem;
        this.tableOrderNum = tableOrderNum;
        this.tableDesc = tableDesc;
        this.tableGroupId = tableGroupId;
        this.tableStatus = tableStatus;
        this.tableLinkId = tableLinkId;
        this.tableOrganId = tableOrganId;
        this.tableOrganName = tableOrganName;
    }

    public TableEntity() {
        super();
    }

    public String getTableId() {
        return tableId;
    }

    public void setTableId(String tableId) {
        this.tableId = tableId == null ? null : tableId.trim();
    }

    public String getTableCode() {
        return tableCode;
    }

    public void setTableCode(String tableCode) {
        this.tableCode = tableCode == null ? null : tableCode.trim();
    }

    public String getTableCaption() {
        return tableCaption;
    }

    public void setTableCaption(String tableCaption) {
        this.tableCaption = tableCaption == null ? null : tableCaption.trim();
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName == null ? null : tableName.trim();
    }

    public String getTableDbname() {
        return tableDbname;
    }

    public void setTableDbname(String tableDbname) {
        this.tableDbname = tableDbname == null ? null : tableDbname.trim();
    }

    public Date getTableCreateTime() {
        return tableCreateTime;
    }

    public void setTableCreateTime(Date tableCreateTime) {
        this.tableCreateTime = tableCreateTime;
    }

    public String getTableCreater() {
        return tableCreater;
    }

    public void setTableCreater(String tableCreater) {
        this.tableCreater = tableCreater == null ? null : tableCreater.trim();
    }

    public Date getTableUpdateTime() {
        return tableUpdateTime;
    }

    public void setTableUpdateTime(Date tableUpdateTime) {
        this.tableUpdateTime = tableUpdateTime;
    }

    public String getTableUpdater() {
        return tableUpdater;
    }

    public void setTableUpdater(String tableUpdater) {
        this.tableUpdater = tableUpdater == null ? null : tableUpdater.trim();
    }

    public String getTableServiceValue() {
        return tableServiceValue;
    }

    public void setTableServiceValue(String tableServiceValue) {
        this.tableServiceValue = tableServiceValue == null ? null : tableServiceValue.trim();
    }

    public String getTableType() {
        return tableType;
    }

    public void setTableType(String tableType) {
        this.tableType = tableType == null ? null : tableType.trim();
    }

    public String getTableIssystem() {
        return tableIssystem;
    }

    public void setTableIssystem(String tableIssystem) {
        this.tableIssystem = tableIssystem == null ? null : tableIssystem.trim();
    }

    public Integer getTableOrderNum() {
        return tableOrderNum;
    }

    public void setTableOrderNum(Integer tableOrderNum) {
        this.tableOrderNum = tableOrderNum;
    }

    public String getTableDesc() {
        return tableDesc;
    }

    public void setTableDesc(String tableDesc) {
        this.tableDesc = tableDesc == null ? null : tableDesc.trim();
    }

    public String getTableGroupId() {
        return tableGroupId;
    }

    public void setTableGroupId(String tableGroupId) {
        this.tableGroupId = tableGroupId == null ? null : tableGroupId.trim();
    }

    public String getTableStatus() {
        return tableStatus;
    }

    public void setTableStatus(String tableStatus) {
        this.tableStatus = tableStatus == null ? null : tableStatus.trim();
    }

    public String getTableLinkId() {
        return tableLinkId;
    }

    public void setTableLinkId(String tableLinkId) {
        this.tableLinkId = tableLinkId == null ? null : tableLinkId.trim();
    }

    public String getTableOrganId() {
        return tableOrganId;
    }

    public void setTableOrganId(String tableOrganId) {
        this.tableOrganId = tableOrganId == null ? null : tableOrganId.trim();
    }

    public String getTableOrganName() {
        return tableOrganName;
    }

    public void setTableOrganName(String tableOrganName) {
        this.tableOrganName = tableOrganName == null ? null : tableOrganName.trim();
    }
}