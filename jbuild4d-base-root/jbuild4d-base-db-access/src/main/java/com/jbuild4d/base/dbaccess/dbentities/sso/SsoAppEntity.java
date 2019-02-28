package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_sso_app
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class SsoAppEntity {
    //APP_ID:
    @DBKeyField
    private String appId;

    //APP_NAME:集成系统名称
    private String appName;

    public SsoAppEntity(String appId, String appName) {
        this.appId = appId;
        this.appName = appName;
    }

    public SsoAppEntity() {
        super();
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId == null ? null : appId.trim();
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName == null ? null : appName.trim();
    }
}