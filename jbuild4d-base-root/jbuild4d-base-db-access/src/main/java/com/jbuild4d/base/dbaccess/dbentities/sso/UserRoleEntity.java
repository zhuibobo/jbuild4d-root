package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_user_role
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class UserRoleEntity {
    //BIND_ID:
    @DBKeyField
    private String bindId;

    //BIND_ROLE_ID:角色ID
    private String bindRoleId;

    //BIND_USER_ID:角色ID
    private String bindUserId;

    //BIND_ORDER_NUM:排序号
    private Integer bindOrderNum;

    //BIND_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date bindCreateTime;

    //BIND_CREATER_ID:创建者的ID
    private String bindCreaterId;

    //BIND_ORGAN_ID:组织ID
    private String bindOrganId;

    public UserRoleEntity(String bindId, String bindRoleId, String bindUserId, Integer bindOrderNum, Date bindCreateTime, String bindCreaterId, String bindOrganId) {
        this.bindId = bindId;
        this.bindRoleId = bindRoleId;
        this.bindUserId = bindUserId;
        this.bindOrderNum = bindOrderNum;
        this.bindCreateTime = bindCreateTime;
        this.bindCreaterId = bindCreaterId;
        this.bindOrganId = bindOrganId;
    }

    public UserRoleEntity() {
        super();
    }

    public String getBindId() {
        return bindId;
    }

    public void setBindId(String bindId) {
        this.bindId = bindId == null ? null : bindId.trim();
    }

    public String getBindRoleId() {
        return bindRoleId;
    }

    public void setBindRoleId(String bindRoleId) {
        this.bindRoleId = bindRoleId == null ? null : bindRoleId.trim();
    }

    public String getBindUserId() {
        return bindUserId;
    }

    public void setBindUserId(String bindUserId) {
        this.bindUserId = bindUserId == null ? null : bindUserId.trim();
    }

    public Integer getBindOrderNum() {
        return bindOrderNum;
    }

    public void setBindOrderNum(Integer bindOrderNum) {
        this.bindOrderNum = bindOrderNum;
    }

    public Date getBindCreateTime() {
        return bindCreateTime;
    }

    public void setBindCreateTime(Date bindCreateTime) {
        this.bindCreateTime = bindCreateTime;
    }

    public String getBindCreaterId() {
        return bindCreaterId;
    }

    public void setBindCreaterId(String bindCreaterId) {
        this.bindCreaterId = bindCreaterId == null ? null : bindCreaterId.trim();
    }

    public String getBindOrganId() {
        return bindOrganId;
    }

    public void setBindOrganId(String bindOrganId) {
        this.bindOrganId = bindOrganId == null ? null : bindOrganId.trim();
    }
}