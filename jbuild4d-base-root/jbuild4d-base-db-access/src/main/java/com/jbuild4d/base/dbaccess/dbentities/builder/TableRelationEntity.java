package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tbuild_table_relation
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class TableRelationEntity {
    //RELATION_ID:
    @DBKeyField
    private String relationId;

    //RELATION_GROUP_ID:所属分组ID
    private String relationGroupId;

    //RELATION_NAME:表关联名称
    private String relationName;

    //RELATION_USER_ID:创建人ID
    private String relationUserId;

    //RELATION_USER_NAME:创建人
    private String relationUserName;

    //RELATION_ORDER_NUM:排序号
    private Integer relationOrderNum;

    //RELATION_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date relationCreateTime;

    //RELATION_DESC:描述
    private String relationDesc;

    //RELATION_STATUS:状态
    private String relationStatus;

    public TableRelationEntity(String relationId, String relationGroupId, String relationName, String relationUserId, String relationUserName, Integer relationOrderNum, Date relationCreateTime, String relationDesc, String relationStatus) {
        this.relationId = relationId;
        this.relationGroupId = relationGroupId;
        this.relationName = relationName;
        this.relationUserId = relationUserId;
        this.relationUserName = relationUserName;
        this.relationOrderNum = relationOrderNum;
        this.relationCreateTime = relationCreateTime;
        this.relationDesc = relationDesc;
        this.relationStatus = relationStatus;
    }

    public TableRelationEntity() {
        super();
    }

    public String getRelationId() {
        return relationId;
    }

    public void setRelationId(String relationId) {
        this.relationId = relationId == null ? null : relationId.trim();
    }

    public String getRelationGroupId() {
        return relationGroupId;
    }

    public void setRelationGroupId(String relationGroupId) {
        this.relationGroupId = relationGroupId == null ? null : relationGroupId.trim();
    }

    public String getRelationName() {
        return relationName;
    }

    public void setRelationName(String relationName) {
        this.relationName = relationName == null ? null : relationName.trim();
    }

    public String getRelationUserId() {
        return relationUserId;
    }

    public void setRelationUserId(String relationUserId) {
        this.relationUserId = relationUserId == null ? null : relationUserId.trim();
    }

    public String getRelationUserName() {
        return relationUserName;
    }

    public void setRelationUserName(String relationUserName) {
        this.relationUserName = relationUserName == null ? null : relationUserName.trim();
    }

    public Integer getRelationOrderNum() {
        return relationOrderNum;
    }

    public void setRelationOrderNum(Integer relationOrderNum) {
        this.relationOrderNum = relationOrderNum;
    }

    public Date getRelationCreateTime() {
        return relationCreateTime;
    }

    public void setRelationCreateTime(Date relationCreateTime) {
        this.relationCreateTime = relationCreateTime;
    }

    public String getRelationDesc() {
        return relationDesc;
    }

    public void setRelationDesc(String relationDesc) {
        this.relationDesc = relationDesc == null ? null : relationDesc.trim();
    }

    public String getRelationStatus() {
        return relationStatus;
    }

    public void setRelationStatus(String relationStatus) {
        this.relationStatus = relationStatus == null ? null : relationStatus.trim();
    }
}