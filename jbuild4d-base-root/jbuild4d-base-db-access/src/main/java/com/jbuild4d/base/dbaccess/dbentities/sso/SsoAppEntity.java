package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

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

    //APP_CODE:集成系统标识键
    private String appCode;

    //APP_NAME:集成系统名称
    private String appName;

    //APP_PUBLIC_KEY:公钥
    private String appPublicKey;

    //APP_PRIVATE_KEY:私钥
    private String appPrivateKey;

    //APP_DOMAIN:域名或者ip,用于验证来源使用
    private String appDomain;

    //APP_INDEX_URL:主页的地址,用于默认登录完成之后的目标地址
    private String appIndexUrl;

    //APP_INTEGRATED_TYPE:系统的集成类型:开发集成或者模拟登录集成,模拟登录为post模拟账号进行登录
    private String appIntegratedType;

    //APP_MAIN_IMAGE_ID:主题图片ID,关联到TB4D_FILE_INFO表的FILE_ID
    private String appMainImageId;

    //APP_TYPE:系统类型:主系统或者为子系统
    private String appType;

    //APP_TYPE_MAIN_ID:为子系统时,用于存储主系统的ID:TB4D_SSO_APP中的APP_ID
    private String appTypeMainId;

    //APP_CATEGORY:系统分类:App或者Web系统
    private String appCategory;

    //APP_DESC:备注
    private String appDesc;

    //APP_ORDER_NUM:排序号
    private Integer appOrderNum;

    //APP_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date appCreateTime;

    //APP_STATUS:状态
    private String appStatus;

    //APP_CREATER_ID:创建者的ID
    private String appCreaterId;

    //APP_ORGAN_ID:创建组织ID
    private String appOrganId;

    public SsoAppEntity(String appId, String appCode, String appName, String appPublicKey, String appPrivateKey, String appDomain, String appIndexUrl, String appIntegratedType, String appMainImageId, String appType, String appTypeMainId, String appCategory, String appDesc, Integer appOrderNum, Date appCreateTime, String appStatus, String appCreaterId, String appOrganId) {
        this.appId = appId;
        this.appCode = appCode;
        this.appName = appName;
        this.appPublicKey = appPublicKey;
        this.appPrivateKey = appPrivateKey;
        this.appDomain = appDomain;
        this.appIndexUrl = appIndexUrl;
        this.appIntegratedType = appIntegratedType;
        this.appMainImageId = appMainImageId;
        this.appType = appType;
        this.appTypeMainId = appTypeMainId;
        this.appCategory = appCategory;
        this.appDesc = appDesc;
        this.appOrderNum = appOrderNum;
        this.appCreateTime = appCreateTime;
        this.appStatus = appStatus;
        this.appCreaterId = appCreaterId;
        this.appOrganId = appOrganId;
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

    public String getAppCode() {
        return appCode;
    }

    public void setAppCode(String appCode) {
        this.appCode = appCode == null ? null : appCode.trim();
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName == null ? null : appName.trim();
    }

    public String getAppPublicKey() {
        return appPublicKey;
    }

    public void setAppPublicKey(String appPublicKey) {
        this.appPublicKey = appPublicKey == null ? null : appPublicKey.trim();
    }

    public String getAppPrivateKey() {
        return appPrivateKey;
    }

    public void setAppPrivateKey(String appPrivateKey) {
        this.appPrivateKey = appPrivateKey == null ? null : appPrivateKey.trim();
    }

    public String getAppDomain() {
        return appDomain;
    }

    public void setAppDomain(String appDomain) {
        this.appDomain = appDomain == null ? null : appDomain.trim();
    }

    public String getAppIndexUrl() {
        return appIndexUrl;
    }

    public void setAppIndexUrl(String appIndexUrl) {
        this.appIndexUrl = appIndexUrl == null ? null : appIndexUrl.trim();
    }

    public String getAppIntegratedType() {
        return appIntegratedType;
    }

    public void setAppIntegratedType(String appIntegratedType) {
        this.appIntegratedType = appIntegratedType == null ? null : appIntegratedType.trim();
    }

    public String getAppMainImageId() {
        return appMainImageId;
    }

    public void setAppMainImageId(String appMainImageId) {
        this.appMainImageId = appMainImageId == null ? null : appMainImageId.trim();
    }

    public String getAppType() {
        return appType;
    }

    public void setAppType(String appType) {
        this.appType = appType == null ? null : appType.trim();
    }

    public String getAppTypeMainId() {
        return appTypeMainId;
    }

    public void setAppTypeMainId(String appTypeMainId) {
        this.appTypeMainId = appTypeMainId == null ? null : appTypeMainId.trim();
    }

    public String getAppCategory() {
        return appCategory;
    }

    public void setAppCategory(String appCategory) {
        this.appCategory = appCategory == null ? null : appCategory.trim();
    }

    public String getAppDesc() {
        return appDesc;
    }

    public void setAppDesc(String appDesc) {
        this.appDesc = appDesc == null ? null : appDesc.trim();
    }

    public Integer getAppOrderNum() {
        return appOrderNum;
    }

    public void setAppOrderNum(Integer appOrderNum) {
        this.appOrderNum = appOrderNum;
    }

    public Date getAppCreateTime() {
        return appCreateTime;
    }

    public void setAppCreateTime(Date appCreateTime) {
        this.appCreateTime = appCreateTime;
    }

    public String getAppStatus() {
        return appStatus;
    }

    public void setAppStatus(String appStatus) {
        this.appStatus = appStatus == null ? null : appStatus.trim();
    }

    public String getAppCreaterId() {
        return appCreaterId;
    }

    public void setAppCreaterId(String appCreaterId) {
        this.appCreaterId = appCreaterId == null ? null : appCreaterId.trim();
    }

    public String getAppOrganId() {
        return appOrganId;
    }

    public void setAppOrganId(String appOrganId) {
        this.appOrganId = appOrganId == null ? null : appOrganId.trim();
    }
}