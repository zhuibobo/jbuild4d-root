package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_department_userde
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class DepartmentUserEntity {
    //DU_ID:
    @DBKeyField
    private String duId;

    //DU_DEPT_ID:部门ID
    private String duDeptId;

    //DU_USER_ID:用户ID
    private String duUserId;

    //DU_IS_MAIN:是否主属
    private String duIsMain;

    //DU_TITLE:部门用户职位
    private String duTitle;

    //DU_DESC:部门用户备注
    private String duDesc;

    //DU_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date duCreateTime;

    //DU_CREATE_USER_ID:创建用户ID
    private String duCreateUserId;

    //DU_STATUS:状态:启用,禁用
    private String duStatus;

    //DU_ORDER_NUM:排序号
    private Integer duOrderNum;

    public DepartmentUserEntity(String duId, String duDeptId, String duUserId, String duIsMain, String duTitle, String duDesc, Date duCreateTime, String duCreateUserId, String duStatus, Integer duOrderNum) {
        this.duId = duId;
        this.duDeptId = duDeptId;
        this.duUserId = duUserId;
        this.duIsMain = duIsMain;
        this.duTitle = duTitle;
        this.duDesc = duDesc;
        this.duCreateTime = duCreateTime;
        this.duCreateUserId = duCreateUserId;
        this.duStatus = duStatus;
        this.duOrderNum = duOrderNum;
    }

    public DepartmentUserEntity() {
        super();
    }

    public String getDuId() {
        return duId;
    }

    public void setDuId(String duId) {
        this.duId = duId == null ? null : duId.trim();
    }

    public String getDuDeptId() {
        return duDeptId;
    }

    public void setDuDeptId(String duDeptId) {
        this.duDeptId = duDeptId == null ? null : duDeptId.trim();
    }

    public String getDuUserId() {
        return duUserId;
    }

    public void setDuUserId(String duUserId) {
        this.duUserId = duUserId == null ? null : duUserId.trim();
    }

    public String getDuIsMain() {
        return duIsMain;
    }

    public void setDuIsMain(String duIsMain) {
        this.duIsMain = duIsMain == null ? null : duIsMain.trim();
    }

    public String getDuTitle() {
        return duTitle;
    }

    public void setDuTitle(String duTitle) {
        this.duTitle = duTitle == null ? null : duTitle.trim();
    }

    public String getDuDesc() {
        return duDesc;
    }

    public void setDuDesc(String duDesc) {
        this.duDesc = duDesc == null ? null : duDesc.trim();
    }

    public Date getDuCreateTime() {
        return duCreateTime;
    }

    public void setDuCreateTime(Date duCreateTime) {
        this.duCreateTime = duCreateTime;
    }

    public String getDuCreateUserId() {
        return duCreateUserId;
    }

    public void setDuCreateUserId(String duCreateUserId) {
        this.duCreateUserId = duCreateUserId == null ? null : duCreateUserId.trim();
    }

    public String getDuStatus() {
        return duStatus;
    }

    public void setDuStatus(String duStatus) {
        this.duStatus = duStatus == null ? null : duStatus.trim();
    }

    public Integer getDuOrderNum() {
        return duOrderNum;
    }

    public void setDuOrderNum(Integer duOrderNum) {
        this.duOrderNum = duOrderNum;
    }
}