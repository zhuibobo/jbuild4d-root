package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_table_relation_group
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class TableRelationGroupEntity {
    //REL_GROUP_ID:
    @DBKeyField
    private String relGroupId;

    //REL_GROUP_VALUE:关联分组值
    private String relGroupValue;

    //REL_GROUP_TEXT:关联分组标题
    private String relGroupText;

    //REL_GROUP_ORDER_NUM:排序号
    private Integer relGroupOrderNum;

    //REL_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date relGroupCreateTime;

    //REL_GROUP_DESC:描述
    private String relGroupDesc;

    //REL_GROUP_STATUS:状态
    private String relGroupStatus;

    //REL_GROUP_PARENT_ID:父节点ID
    private String relGroupParentId;

    //REL_GROUP_ISSYSTEM:是否系统
    private String relGroupIssystem;

    //REL_GROUP_DEL_ENABLE:是否允许删除
    private String relGroupDelEnable;

    //REL_GROUP_PID_LIST:父节点列表
    private String relGroupPidList;

    //REL_GROUP_CHILD_COUNT:子节点数量
    private Integer relGroupChildCount;

    //REL_GROUP_USER_ID:创建人ID
    private String relGroupUserId;

    //REL_GROUP_USER_NAME:创建人
    private String relGroupUserName;

    public TableRelationGroupEntity(String relGroupId, String relGroupValue, String relGroupText, Integer relGroupOrderNum, Date relGroupCreateTime, String relGroupDesc, String relGroupStatus, String relGroupParentId, String relGroupIssystem, String relGroupDelEnable, String relGroupPidList, Integer relGroupChildCount, String relGroupUserId, String relGroupUserName) {
        this.relGroupId = relGroupId;
        this.relGroupValue = relGroupValue;
        this.relGroupText = relGroupText;
        this.relGroupOrderNum = relGroupOrderNum;
        this.relGroupCreateTime = relGroupCreateTime;
        this.relGroupDesc = relGroupDesc;
        this.relGroupStatus = relGroupStatus;
        this.relGroupParentId = relGroupParentId;
        this.relGroupIssystem = relGroupIssystem;
        this.relGroupDelEnable = relGroupDelEnable;
        this.relGroupPidList = relGroupPidList;
        this.relGroupChildCount = relGroupChildCount;
        this.relGroupUserId = relGroupUserId;
        this.relGroupUserName = relGroupUserName;
    }

    public TableRelationGroupEntity() {
        super();
    }

    public String getRelGroupId() {
        return relGroupId;
    }

    public void setRelGroupId(String relGroupId) {
        this.relGroupId = relGroupId == null ? null : relGroupId.trim();
    }

    public String getRelGroupValue() {
        return relGroupValue;
    }

    public void setRelGroupValue(String relGroupValue) {
        this.relGroupValue = relGroupValue == null ? null : relGroupValue.trim();
    }

    public String getRelGroupText() {
        return relGroupText;
    }

    public void setRelGroupText(String relGroupText) {
        this.relGroupText = relGroupText == null ? null : relGroupText.trim();
    }

    public Integer getRelGroupOrderNum() {
        return relGroupOrderNum;
    }

    public void setRelGroupOrderNum(Integer relGroupOrderNum) {
        this.relGroupOrderNum = relGroupOrderNum;
    }

    public Date getRelGroupCreateTime() {
        return relGroupCreateTime;
    }

    public void setRelGroupCreateTime(Date relGroupCreateTime) {
        this.relGroupCreateTime = relGroupCreateTime;
    }

    public String getRelGroupDesc() {
        return relGroupDesc;
    }

    public void setRelGroupDesc(String relGroupDesc) {
        this.relGroupDesc = relGroupDesc == null ? null : relGroupDesc.trim();
    }

    public String getRelGroupStatus() {
        return relGroupStatus;
    }

    public void setRelGroupStatus(String relGroupStatus) {
        this.relGroupStatus = relGroupStatus == null ? null : relGroupStatus.trim();
    }

    public String getRelGroupParentId() {
        return relGroupParentId;
    }

    public void setRelGroupParentId(String relGroupParentId) {
        this.relGroupParentId = relGroupParentId == null ? null : relGroupParentId.trim();
    }

    public String getRelGroupIssystem() {
        return relGroupIssystem;
    }

    public void setRelGroupIssystem(String relGroupIssystem) {
        this.relGroupIssystem = relGroupIssystem == null ? null : relGroupIssystem.trim();
    }

    public String getRelGroupDelEnable() {
        return relGroupDelEnable;
    }

    public void setRelGroupDelEnable(String relGroupDelEnable) {
        this.relGroupDelEnable = relGroupDelEnable == null ? null : relGroupDelEnable.trim();
    }

    public String getRelGroupPidList() {
        return relGroupPidList;
    }

    public void setRelGroupPidList(String relGroupPidList) {
        this.relGroupPidList = relGroupPidList == null ? null : relGroupPidList.trim();
    }

    public Integer getRelGroupChildCount() {
        return relGroupChildCount;
    }

    public void setRelGroupChildCount(Integer relGroupChildCount) {
        this.relGroupChildCount = relGroupChildCount;
    }

    public String getRelGroupUserId() {
        return relGroupUserId;
    }

    public void setRelGroupUserId(String relGroupUserId) {
        this.relGroupUserId = relGroupUserId == null ? null : relGroupUserId.trim();
    }

    public String getRelGroupUserName() {
        return relGroupUserName;
    }

    public void setRelGroupUserName(String relGroupUserName) {
        this.relGroupUserName = relGroupUserName == null ? null : relGroupUserName.trim();
    }
}