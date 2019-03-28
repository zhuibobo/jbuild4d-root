package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :TBUILD_TABLE_relation_his
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class TableRelationHisEntity {
    //HIS_ID:
    @DBKeyField
    private String hisId;

    //HIS_GROUP_ID:所属分组ID
    private String hisGroupId;

    //HIS_NAME:表关联名称
    private String hisName;

    //HIS_USER_ID:创建人ID
    private String hisUserId;

    //HIS_USER_NAME:创建人
    private String hisUserName;

    //HIS_ORDER_NUM:排序号
    private Integer hisOrderNum;

    //HIS_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date hisCreateTime;

    //HIS_DESC:描述
    private String hisDesc;

    //HIS_STATUS:状态
    private String hisStatus;

    //HIS_BELONG_REL_ID:所属记录ID
    private String hisBelongRelId;

    //HIS_CONTENT:表关系的Json描述
    private String hisContent;

    public TableRelationHisEntity(String hisId, String hisGroupId, String hisName, String hisUserId, String hisUserName, Integer hisOrderNum, Date hisCreateTime, String hisDesc, String hisStatus, String hisBelongRelId) {
        this.hisId = hisId;
        this.hisGroupId = hisGroupId;
        this.hisName = hisName;
        this.hisUserId = hisUserId;
        this.hisUserName = hisUserName;
        this.hisOrderNum = hisOrderNum;
        this.hisCreateTime = hisCreateTime;
        this.hisDesc = hisDesc;
        this.hisStatus = hisStatus;
        this.hisBelongRelId = hisBelongRelId;
    }

    public TableRelationHisEntity(String hisId, String hisGroupId, String hisName, String hisUserId, String hisUserName, Integer hisOrderNum, Date hisCreateTime, String hisDesc, String hisStatus, String hisBelongRelId, String hisContent) {
        this.hisId = hisId;
        this.hisGroupId = hisGroupId;
        this.hisName = hisName;
        this.hisUserId = hisUserId;
        this.hisUserName = hisUserName;
        this.hisOrderNum = hisOrderNum;
        this.hisCreateTime = hisCreateTime;
        this.hisDesc = hisDesc;
        this.hisStatus = hisStatus;
        this.hisBelongRelId = hisBelongRelId;
        this.hisContent = hisContent;
    }

    public TableRelationHisEntity() {
        super();
    }

    public String getHisId() {
        return hisId;
    }

    public void setHisId(String hisId) {
        this.hisId = hisId == null ? null : hisId.trim();
    }

    public String getHisGroupId() {
        return hisGroupId;
    }

    public void setHisGroupId(String hisGroupId) {
        this.hisGroupId = hisGroupId == null ? null : hisGroupId.trim();
    }

    public String getHisName() {
        return hisName;
    }

    public void setHisName(String hisName) {
        this.hisName = hisName == null ? null : hisName.trim();
    }

    public String getHisUserId() {
        return hisUserId;
    }

    public void setHisUserId(String hisUserId) {
        this.hisUserId = hisUserId == null ? null : hisUserId.trim();
    }

    public String getHisUserName() {
        return hisUserName;
    }

    public void setHisUserName(String hisUserName) {
        this.hisUserName = hisUserName == null ? null : hisUserName.trim();
    }

    public Integer getHisOrderNum() {
        return hisOrderNum;
    }

    public void setHisOrderNum(Integer hisOrderNum) {
        this.hisOrderNum = hisOrderNum;
    }

    public Date getHisCreateTime() {
        return hisCreateTime;
    }

    public void setHisCreateTime(Date hisCreateTime) {
        this.hisCreateTime = hisCreateTime;
    }

    public String getHisDesc() {
        return hisDesc;
    }

    public void setHisDesc(String hisDesc) {
        this.hisDesc = hisDesc == null ? null : hisDesc.trim();
    }

    public String getHisStatus() {
        return hisStatus;
    }

    public void setHisStatus(String hisStatus) {
        this.hisStatus = hisStatus == null ? null : hisStatus.trim();
    }

    public String getHisBelongRelId() {
        return hisBelongRelId;
    }

    public void setHisBelongRelId(String hisBelongRelId) {
        this.hisBelongRelId = hisBelongRelId == null ? null : hisBelongRelId.trim();
    }

    public String getHisContent() {
        return hisContent;
    }

    public void setHisContent(String hisContent) {
        this.hisContent = hisContent == null ? null : hisContent.trim();
    }
}