package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_department
 *de
 * @mbg.generated do_not_delete_during_merge
 */
public class DepartmentEntity {
    //DEPT_ID:
    @DBKeyField
    private String deptId;

    //DEPT_NAME:部门名称
    private String deptName;

    //DEPT_SHORT_NAME:部门简称
    private String deptShortName;

    //DEPT_NO:部门编号
    private String deptNo;

    //DEPT_PER_CHARGE:部门负责人
    private String deptPerCharge;

    //DEPT_PER_CHARGE_PHONE:部门负责人电话
    private String deptPerChargePhone;

    //DEPT_IS_VIRTUAL:是否虚拟
    private String deptIsVirtual;

    //DEPT_CHILD_COUNT:子节点数量
    private Integer deptChildCount;

    //DEPT_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date deptCreateTime;

    //DEPT_CREATE_USER_ID:创建用户ID
    private String deptCreateUserId;

    //DEPT_ORDER_NUM:排序号
    private Integer deptOrderNum;

    //DEPT_IS_ROOT:是否根节点,根节点在组织创建时自动创建
    private String deptIsRoot;

    //DEPT_PARENT_ID:父节点ID,根节点的ParentId为0
    private String deptParentId;

    //DEPT_PARENT_ID_LIST:父节点列表
    private String deptParentIdList;

    //DEPT_STATUS:状态:启用,禁用
    private String deptStatus;

    //DEPT_ORGAN_ID:所属组织ID
    private String deptOrganId;

    //DEPT_DESC:部门备注
    private String deptDesc;

    public DepartmentEntity(String deptId, String deptName, String deptShortName, String deptNo, String deptPerCharge, String deptPerChargePhone, String deptIsVirtual, Integer deptChildCount, Date deptCreateTime, String deptCreateUserId, Integer deptOrderNum, String deptIsRoot, String deptParentId, String deptParentIdList, String deptStatus, String deptOrganId, String deptDesc) {
        this.deptId = deptId;
        this.deptName = deptName;
        this.deptShortName = deptShortName;
        this.deptNo = deptNo;
        this.deptPerCharge = deptPerCharge;
        this.deptPerChargePhone = deptPerChargePhone;
        this.deptIsVirtual = deptIsVirtual;
        this.deptChildCount = deptChildCount;
        this.deptCreateTime = deptCreateTime;
        this.deptCreateUserId = deptCreateUserId;
        this.deptOrderNum = deptOrderNum;
        this.deptIsRoot = deptIsRoot;
        this.deptParentId = deptParentId;
        this.deptParentIdList = deptParentIdList;
        this.deptStatus = deptStatus;
        this.deptOrganId = deptOrganId;
        this.deptDesc = deptDesc;
    }

    public DepartmentEntity() {
        super();
    }

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId == null ? null : deptId.trim();
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName == null ? null : deptName.trim();
    }

    public String getDeptShortName() {
        return deptShortName;
    }

    public void setDeptShortName(String deptShortName) {
        this.deptShortName = deptShortName == null ? null : deptShortName.trim();
    }

    public String getDeptNo() {
        return deptNo;
    }

    public void setDeptNo(String deptNo) {
        this.deptNo = deptNo == null ? null : deptNo.trim();
    }

    public String getDeptPerCharge() {
        return deptPerCharge;
    }

    public void setDeptPerCharge(String deptPerCharge) {
        this.deptPerCharge = deptPerCharge == null ? null : deptPerCharge.trim();
    }

    public String getDeptPerChargePhone() {
        return deptPerChargePhone;
    }

    public void setDeptPerChargePhone(String deptPerChargePhone) {
        this.deptPerChargePhone = deptPerChargePhone == null ? null : deptPerChargePhone.trim();
    }

    public String getDeptIsVirtual() {
        return deptIsVirtual;
    }

    public void setDeptIsVirtual(String deptIsVirtual) {
        this.deptIsVirtual = deptIsVirtual == null ? null : deptIsVirtual.trim();
    }

    public Integer getDeptChildCount() {
        return deptChildCount;
    }

    public void setDeptChildCount(Integer deptChildCount) {
        this.deptChildCount = deptChildCount;
    }

    public Date getDeptCreateTime() {
        return deptCreateTime;
    }

    public void setDeptCreateTime(Date deptCreateTime) {
        this.deptCreateTime = deptCreateTime;
    }

    public String getDeptCreateUserId() {
        return deptCreateUserId;
    }

    public void setDeptCreateUserId(String deptCreateUserId) {
        this.deptCreateUserId = deptCreateUserId == null ? null : deptCreateUserId.trim();
    }

    public Integer getDeptOrderNum() {
        return deptOrderNum;
    }

    public void setDeptOrderNum(Integer deptOrderNum) {
        this.deptOrderNum = deptOrderNum;
    }

    public String getDeptIsRoot() {
        return deptIsRoot;
    }

    public void setDeptIsRoot(String deptIsRoot) {
        this.deptIsRoot = deptIsRoot == null ? null : deptIsRoot.trim();
    }

    public String getDeptParentId() {
        return deptParentId;
    }

    public void setDeptParentId(String deptParentId) {
        this.deptParentId = deptParentId == null ? null : deptParentId.trim();
    }

    public String getDeptParentIdList() {
        return deptParentIdList;
    }

    public void setDeptParentIdList(String deptParentIdList) {
        this.deptParentIdList = deptParentIdList == null ? null : deptParentIdList.trim();
    }

    public String getDeptStatus() {
        return deptStatus;
    }

    public void setDeptStatus(String deptStatus) {
        this.deptStatus = deptStatus == null ? null : deptStatus.trim();
    }

    public String getDeptOrganId() {
        return deptOrganId;
    }

    public void setDeptOrganId(String deptOrganId) {
        this.deptOrganId = deptOrganId == null ? null : deptOrganId.trim();
    }

    public String getDeptDesc() {
        return deptDesc;
    }

    public void setDeptDesc(String deptDesc) {
        this.deptDesc = deptDesc == null ? null : deptDesc.trim();
    }
}