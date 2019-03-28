package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :TSSO_ROLE
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class RoleEntity {
    //ROLE_ID:
    @DBKeyField
    private String roleId;

    //ROLE_KEY:角色键值
    private String roleKey;

    //ROLE_NAME:角色组ID
    private String roleName;

    //ROLE_GROUP_ID:角色名称
    private String roleGroupId;

    //ROLE_ORDER_NUM:排序号
    private Integer roleOrderNum;

    //ROLE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date roleCreateTime;

    //ROLE_DESC:备注
    private String roleDesc;

    //ROLE_STATUS:状态
    private String roleStatus;

    //ROLE_CREATER_ID:创建者的ID
    private String roleCreaterId;

    //ROLE_ORGAN_ID:创建组织ID
    private String roleOrganId;

    public RoleEntity(String roleId, String roleKey, String roleName, String roleGroupId, Integer roleOrderNum, Date roleCreateTime, String roleDesc, String roleStatus, String roleCreaterId, String roleOrganId) {
        this.roleId = roleId;
        this.roleKey = roleKey;
        this.roleName = roleName;
        this.roleGroupId = roleGroupId;
        this.roleOrderNum = roleOrderNum;
        this.roleCreateTime = roleCreateTime;
        this.roleDesc = roleDesc;
        this.roleStatus = roleStatus;
        this.roleCreaterId = roleCreaterId;
        this.roleOrganId = roleOrganId;
    }

    public RoleEntity() {
        super();
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId == null ? null : roleId.trim();
    }

    public String getRoleKey() {
        return roleKey;
    }

    public void setRoleKey(String roleKey) {
        this.roleKey = roleKey == null ? null : roleKey.trim();
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName == null ? null : roleName.trim();
    }

    public String getRoleGroupId() {
        return roleGroupId;
    }

    public void setRoleGroupId(String roleGroupId) {
        this.roleGroupId = roleGroupId == null ? null : roleGroupId.trim();
    }

    public Integer getRoleOrderNum() {
        return roleOrderNum;
    }

    public void setRoleOrderNum(Integer roleOrderNum) {
        this.roleOrderNum = roleOrderNum;
    }

    public Date getRoleCreateTime() {
        return roleCreateTime;
    }

    public void setRoleCreateTime(Date roleCreateTime) {
        this.roleCreateTime = roleCreateTime;
    }

    public String getRoleDesc() {
        return roleDesc;
    }

    public void setRoleDesc(String roleDesc) {
        this.roleDesc = roleDesc == null ? null : roleDesc.trim();
    }

    public String getRoleStatus() {
        return roleStatus;
    }

    public void setRoleStatus(String roleStatus) {
        this.roleStatus = roleStatus == null ? null : roleStatus.trim();
    }

    public String getRoleCreaterId() {
        return roleCreaterId;
    }

    public void setRoleCreaterId(String roleCreaterId) {
        this.roleCreaterId = roleCreaterId == null ? null : roleCreaterId.trim();
    }

    public String getRoleOrganId() {
        return roleOrganId;
    }

    public void setRoleOrganId(String roleOrganId) {
        this.roleOrganId = roleOrganId == null ? null : roleOrganId.trim();
    }
}