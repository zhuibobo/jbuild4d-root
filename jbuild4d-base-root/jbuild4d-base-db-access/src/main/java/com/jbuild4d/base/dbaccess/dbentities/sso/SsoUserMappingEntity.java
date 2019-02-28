package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_sso_user_mapping
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class SsoUserMappingEntity {
    //MAPPING_ID:
    @DBKeyField
    private String mappingId;

    //APP_ID:SSO集成APP
    private String appId;

    public SsoUserMappingEntity(String mappingId, String appId) {
        this.mappingId = mappingId;
        this.appId = appId;
    }

    public SsoUserMappingEntity() {
        super();
    }

    public String getMappingId() {
        return mappingId;
    }

    public void setMappingId(String mappingId) {
        this.mappingId = mappingId == null ? null : mappingId.trim();
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId == null ? null : appId.trim();
    }
}