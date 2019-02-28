package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_authority
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class AuthorityEntity {
    //AUTH_ID:
    @DBKeyField
    private String authId;

    //ROLE_ID:角色ID,主键
    private String roleId;

    public AuthorityEntity(String authId, String roleId) {
        this.authId = authId;
        this.roleId = roleId;
    }

    public AuthorityEntity() {
        super();
    }

    public String getAuthId() {
        return authId;
    }

    public void setAuthId(String authId) {
        this.authId = authId == null ? null : authId.trim();
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId == null ? null : roleId.trim();
    }
}