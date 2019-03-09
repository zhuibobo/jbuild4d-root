package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_sso_app_user_mapping
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class SsoAppUserMappingEntity {
    //MAPPING_ID:
    @DBKeyField
    private String mappingId;

    //MAPPING_BELONG_APP_ID:所属系统ID
    private String mappingBelongAppId;

    //MAPPING_ACCOUNT:账号
    private String mappingAccount;

    //MAPPING_PASSWORD:密码
    private String mappingPassword;

    //MAPPING_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date mappingCreateTime;

    //MAPPING_CREATER_ID:创建者的ID
    private String mappingCreaterId;

    //MAPPING_ORGAN_ID:创建组织ID
    private String mappingOrganId;

    public SsoAppUserMappingEntity(String mappingId, String mappingBelongAppId, String mappingAccount, String mappingPassword, Date mappingCreateTime, String mappingCreaterId, String mappingOrganId) {
        this.mappingId = mappingId;
        this.mappingBelongAppId = mappingBelongAppId;
        this.mappingAccount = mappingAccount;
        this.mappingPassword = mappingPassword;
        this.mappingCreateTime = mappingCreateTime;
        this.mappingCreaterId = mappingCreaterId;
        this.mappingOrganId = mappingOrganId;
    }

    public SsoAppUserMappingEntity() {
        super();
    }

    public String getMappingId() {
        return mappingId;
    }

    public void setMappingId(String mappingId) {
        this.mappingId = mappingId == null ? null : mappingId.trim();
    }

    public String getMappingBelongAppId() {
        return mappingBelongAppId;
    }

    public void setMappingBelongAppId(String mappingBelongAppId) {
        this.mappingBelongAppId = mappingBelongAppId == null ? null : mappingBelongAppId.trim();
    }

    public String getMappingAccount() {
        return mappingAccount;
    }

    public void setMappingAccount(String mappingAccount) {
        this.mappingAccount = mappingAccount == null ? null : mappingAccount.trim();
    }

    public String getMappingPassword() {
        return mappingPassword;
    }

    public void setMappingPassword(String mappingPassword) {
        this.mappingPassword = mappingPassword == null ? null : mappingPassword.trim();
    }

    public Date getMappingCreateTime() {
        return mappingCreateTime;
    }

    public void setMappingCreateTime(Date mappingCreateTime) {
        this.mappingCreateTime = mappingCreateTime;
    }

    public String getMappingCreaterId() {
        return mappingCreaterId;
    }

    public void setMappingCreaterId(String mappingCreaterId) {
        this.mappingCreaterId = mappingCreaterId == null ? null : mappingCreaterId.trim();
    }

    public String getMappingOrganId() {
        return mappingOrganId;
    }

    public void setMappingOrganId(String mappingOrganId) {
        this.mappingOrganId = mappingOrganId == null ? null : mappingOrganId.trim();
    }
}