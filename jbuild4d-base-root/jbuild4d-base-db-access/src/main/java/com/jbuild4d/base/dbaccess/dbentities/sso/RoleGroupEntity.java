package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :TSSO_ROLE_group
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class RoleGroupEntity {
    //ROLE_GROUP_ID:
    @DBKeyField
    private String roleGroupId;

    //ROLE_GROUP_NAME:角色组名称
    private String roleGroupName;

    //ROLE_GROUP_ORDER_NUM:排序号
    private Integer roleGroupOrderNum;

    //ROLE_GROUP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date roleGroupCreateTime;

    //ROLE_GROUP_DESC:备注
    private String roleGroupDesc;

    //ROLE_GROUP_STATUS:状态
    private String roleGroupStatus;

    //ROLE_GROUP_PARENT_ID:父节点ID
    private String roleGroupParentId;

    //ROLE_GROUP_ISSYSTEM:是否系统
    private String roleGroupIssystem;

    //ROLE_GROUP_DEL_ENABLE:能否删除
    private String roleGroupDelEnable;

    //ROLE_GROUP_PID_LIST:父节点列表
    private String roleGroupPidList;

    //ROLE_GROUP_CHILD_COUNT:子节点数量
    private Integer roleGroupChildCount;

    //ROLE_GROUP_CREATER_ID:创建者的ID
    private String roleGroupCreaterId;

    //ROLE_GROUP_ORGAN_ID:创建组织ID
    private String roleGroupOrganId;

    public RoleGroupEntity(String roleGroupId, String roleGroupName, Integer roleGroupOrderNum, Date roleGroupCreateTime, String roleGroupDesc, String roleGroupStatus, String roleGroupParentId, String roleGroupIssystem, String roleGroupDelEnable, String roleGroupPidList, Integer roleGroupChildCount, String roleGroupCreaterId, String roleGroupOrganId) {
        this.roleGroupId = roleGroupId;
        this.roleGroupName = roleGroupName;
        this.roleGroupOrderNum = roleGroupOrderNum;
        this.roleGroupCreateTime = roleGroupCreateTime;
        this.roleGroupDesc = roleGroupDesc;
        this.roleGroupStatus = roleGroupStatus;
        this.roleGroupParentId = roleGroupParentId;
        this.roleGroupIssystem = roleGroupIssystem;
        this.roleGroupDelEnable = roleGroupDelEnable;
        this.roleGroupPidList = roleGroupPidList;
        this.roleGroupChildCount = roleGroupChildCount;
        this.roleGroupCreaterId = roleGroupCreaterId;
        this.roleGroupOrganId = roleGroupOrganId;
    }

    public RoleGroupEntity() {
        super();
    }

    public String getRoleGroupId() {
        return roleGroupId;
    }

    public void setRoleGroupId(String roleGroupId) {
        this.roleGroupId = roleGroupId == null ? null : roleGroupId.trim();
    }

    public String getRoleGroupName() {
        return roleGroupName;
    }

    public void setRoleGroupName(String roleGroupName) {
        this.roleGroupName = roleGroupName == null ? null : roleGroupName.trim();
    }

    public Integer getRoleGroupOrderNum() {
        return roleGroupOrderNum;
    }

    public void setRoleGroupOrderNum(Integer roleGroupOrderNum) {
        this.roleGroupOrderNum = roleGroupOrderNum;
    }

    public Date getRoleGroupCreateTime() {
        return roleGroupCreateTime;
    }

    public void setRoleGroupCreateTime(Date roleGroupCreateTime) {
        this.roleGroupCreateTime = roleGroupCreateTime;
    }

    public String getRoleGroupDesc() {
        return roleGroupDesc;
    }

    public void setRoleGroupDesc(String roleGroupDesc) {
        this.roleGroupDesc = roleGroupDesc == null ? null : roleGroupDesc.trim();
    }

    public String getRoleGroupStatus() {
        return roleGroupStatus;
    }

    public void setRoleGroupStatus(String roleGroupStatus) {
        this.roleGroupStatus = roleGroupStatus == null ? null : roleGroupStatus.trim();
    }

    public String getRoleGroupParentId() {
        return roleGroupParentId;
    }

    public void setRoleGroupParentId(String roleGroupParentId) {
        this.roleGroupParentId = roleGroupParentId == null ? null : roleGroupParentId.trim();
    }

    public String getRoleGroupIssystem() {
        return roleGroupIssystem;
    }

    public void setRoleGroupIssystem(String roleGroupIssystem) {
        this.roleGroupIssystem = roleGroupIssystem == null ? null : roleGroupIssystem.trim();
    }

    public String getRoleGroupDelEnable() {
        return roleGroupDelEnable;
    }

    public void setRoleGroupDelEnable(String roleGroupDelEnable) {
        this.roleGroupDelEnable = roleGroupDelEnable == null ? null : roleGroupDelEnable.trim();
    }

    public String getRoleGroupPidList() {
        return roleGroupPidList;
    }

    public void setRoleGroupPidList(String roleGroupPidList) {
        this.roleGroupPidList = roleGroupPidList == null ? null : roleGroupPidList.trim();
    }

    public Integer getRoleGroupChildCount() {
        return roleGroupChildCount;
    }

    public void setRoleGroupChildCount(Integer roleGroupChildCount) {
        this.roleGroupChildCount = roleGroupChildCount;
    }

    public String getRoleGroupCreaterId() {
        return roleGroupCreaterId;
    }

    public void setRoleGroupCreaterId(String roleGroupCreaterId) {
        this.roleGroupCreaterId = roleGroupCreaterId == null ? null : roleGroupCreaterId.trim();
    }

    public String getRoleGroupOrganId() {
        return roleGroupOrganId;
    }

    public void setRoleGroupOrganId(String roleGroupOrganId) {
        this.roleGroupOrganId = roleGroupOrganId == null ? null : roleGroupOrganId.trim();
    }
}