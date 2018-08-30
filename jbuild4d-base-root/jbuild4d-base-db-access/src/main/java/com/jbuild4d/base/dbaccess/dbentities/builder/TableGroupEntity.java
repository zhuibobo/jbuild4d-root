package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table TB4D_TABLE_GROUP
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class TableGroupEntity {
    //TABLE_GROUP_ID
    @DBKeyField
    private String tableGroupId;

    //TABLE_GROUP_VALUE
    private String tableGroupValue;

    //TABLE_GROUP_TEXT
    private String tableGroupText;

    //TABLE_GROUP_ORDER_NUM
    private Integer tableGroupOrderNum;

    //TABLE_GROUP_CREATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date tableGroupCreateTime;

    //TABLE_GROUP_DESC
    private String tableGroupDesc;

    //TABLE_GROUP_STATUS
    private String tableGroupStatus;

    //TABLE_GROUP_PARENT_ID
    private String tableGroupParentId;

    //TABLE_GROUP_ISSYSTEM
    private String tableGroupIssystem;

    //TABLE_GROUP_DEL_ENABLE
    private String tableGroupDelEnable;

    //TABLE_GROUP_PID_LIST
    private String tableGroupPidList;

    //TABLE_GROUP_CHILD_COUNT
    private Integer tableGroupChildCount;

    public TableGroupEntity(String tableGroupId, String tableGroupValue, String tableGroupText, Integer tableGroupOrderNum, Date tableGroupCreateTime, String tableGroupDesc, String tableGroupStatus, String tableGroupParentId, String tableGroupIssystem, String tableGroupDelEnable, String tableGroupPidList, Integer tableGroupChildCount) {
        this.tableGroupId = tableGroupId;
        this.tableGroupValue = tableGroupValue;
        this.tableGroupText = tableGroupText;
        this.tableGroupOrderNum = tableGroupOrderNum;
        this.tableGroupCreateTime = tableGroupCreateTime;
        this.tableGroupDesc = tableGroupDesc;
        this.tableGroupStatus = tableGroupStatus;
        this.tableGroupParentId = tableGroupParentId;
        this.tableGroupIssystem = tableGroupIssystem;
        this.tableGroupDelEnable = tableGroupDelEnable;
        this.tableGroupPidList = tableGroupPidList;
        this.tableGroupChildCount = tableGroupChildCount;
    }

    public TableGroupEntity() {
        super();
    }

    public String getTableGroupId() {
        return tableGroupId;
    }

    public void setTableGroupId(String tableGroupId) {
        this.tableGroupId = tableGroupId == null ? null : tableGroupId.trim();
    }

    public String getTableGroupValue() {
        return tableGroupValue;
    }

    public void setTableGroupValue(String tableGroupValue) {
        this.tableGroupValue = tableGroupValue == null ? null : tableGroupValue.trim();
    }

    public String getTableGroupText() {
        return tableGroupText;
    }

    public void setTableGroupText(String tableGroupText) {
        this.tableGroupText = tableGroupText == null ? null : tableGroupText.trim();
    }

    public Integer getTableGroupOrderNum() {
        return tableGroupOrderNum;
    }

    public void setTableGroupOrderNum(Integer tableGroupOrderNum) {
        this.tableGroupOrderNum = tableGroupOrderNum;
    }

    public Date getTableGroupCreateTime() {
        return tableGroupCreateTime;
    }

    public void setTableGroupCreateTime(Date tableGroupCreateTime) {
        this.tableGroupCreateTime = tableGroupCreateTime;
    }

    public String getTableGroupDesc() {
        return tableGroupDesc;
    }

    public void setTableGroupDesc(String tableGroupDesc) {
        this.tableGroupDesc = tableGroupDesc == null ? null : tableGroupDesc.trim();
    }

    public String getTableGroupStatus() {
        return tableGroupStatus;
    }

    public void setTableGroupStatus(String tableGroupStatus) {
        this.tableGroupStatus = tableGroupStatus == null ? null : tableGroupStatus.trim();
    }

    public String getTableGroupParentId() {
        return tableGroupParentId;
    }

    public void setTableGroupParentId(String tableGroupParentId) {
        this.tableGroupParentId = tableGroupParentId == null ? null : tableGroupParentId.trim();
    }

    public String getTableGroupIssystem() {
        return tableGroupIssystem;
    }

    public void setTableGroupIssystem(String tableGroupIssystem) {
        this.tableGroupIssystem = tableGroupIssystem == null ? null : tableGroupIssystem.trim();
    }

    public String getTableGroupDelEnable() {
        return tableGroupDelEnable;
    }

    public void setTableGroupDelEnable(String tableGroupDelEnable) {
        this.tableGroupDelEnable = tableGroupDelEnable == null ? null : tableGroupDelEnable.trim();
    }

    public String getTableGroupPidList() {
        return tableGroupPidList;
    }

    public void setTableGroupPidList(String tableGroupPidList) {
        this.tableGroupPidList = tableGroupPidList == null ? null : tableGroupPidList.trim();
    }

    public Integer getTableGroupChildCount() {
        return tableGroupChildCount;
    }

    public void setTableGroupChildCount(Integer tableGroupChildCount) {
        this.tableGroupChildCount = tableGroupChildCount;
    }
}