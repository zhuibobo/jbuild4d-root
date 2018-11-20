package com.jbuild4d.base.dbaccess.dbentities.systemsetting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table tb4d_cache
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class CacheEntity {
    //CACHE_ID
    @DBKeyField
    private String cacheId;

    //CACHE_NAME
    private String cacheName;

    //CACHE_DESC
    private String cacheDesc;

    //CACHE_ORDER_NUM
    private Integer cacheOrderNum;

    //CACHE_STATUS
    private String cacheStatus;

    //CACHE_IS_GLOBAL
    private String cacheIsGlobal;

    //CACHE_USER_ID
    private String cacheUserId;

    //CACHE_VERSION
    private Integer cacheVersion;

    public CacheEntity(String cacheId, String cacheName, String cacheDesc, Integer cacheOrderNum, String cacheStatus, String cacheIsGlobal, String cacheUserId, Integer cacheVersion) {
        this.cacheId = cacheId;
        this.cacheName = cacheName;
        this.cacheDesc = cacheDesc;
        this.cacheOrderNum = cacheOrderNum;
        this.cacheStatus = cacheStatus;
        this.cacheIsGlobal = cacheIsGlobal;
        this.cacheUserId = cacheUserId;
        this.cacheVersion = cacheVersion;
    }

    public CacheEntity() {
        super();
    }

    public String getCacheId() {
        return cacheId;
    }

    public void setCacheId(String cacheId) {
        this.cacheId = cacheId == null ? null : cacheId.trim();
    }

    public String getCacheName() {
        return cacheName;
    }

    public void setCacheName(String cacheName) {
        this.cacheName = cacheName == null ? null : cacheName.trim();
    }

    public String getCacheDesc() {
        return cacheDesc;
    }

    public void setCacheDesc(String cacheDesc) {
        this.cacheDesc = cacheDesc == null ? null : cacheDesc.trim();
    }

    public Integer getCacheOrderNum() {
        return cacheOrderNum;
    }

    public void setCacheOrderNum(Integer cacheOrderNum) {
        this.cacheOrderNum = cacheOrderNum;
    }

    public String getCacheStatus() {
        return cacheStatus;
    }

    public void setCacheStatus(String cacheStatus) {
        this.cacheStatus = cacheStatus == null ? null : cacheStatus.trim();
    }

    public String getCacheIsGlobal() {
        return cacheIsGlobal;
    }

    public void setCacheIsGlobal(String cacheIsGlobal) {
        this.cacheIsGlobal = cacheIsGlobal == null ? null : cacheIsGlobal.trim();
    }

    public String getCacheUserId() {
        return cacheUserId;
    }

    public void setCacheUserId(String cacheUserId) {
        this.cacheUserId = cacheUserId == null ? null : cacheUserId.trim();
    }

    public Integer getCacheVersion() {
        return cacheVersion;
    }

    public void setCacheVersion(Integer cacheVersion) {
        this.cacheVersion = cacheVersion;
    }
}