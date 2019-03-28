package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :TSSO_SSO_APP_file
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class SsoAppFileEntity {
    //APP_FILE_ID:
    @DBKeyField
    private String appFileId;

    //APP_BELONG_APP_ID:所属系统ID
    private String appBelongAppId;

    //APP_FILE_NAME:文件名称
    private String appFileName;

    //APP_FILE_IS_MAIN:是否是主文件,用于Post模拟时的主执行文件
    private String appFileIsMain;

    //APP_FILE_DESC:备注
    private String appFileDesc;

    //APP_FILE_ORDER_NUM:排序号
    private Integer appFileOrderNum;

    //APP_FILE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date appFileCreateTime;

    //APP_FILE_STATUS:状态
    private String appFileStatus;

    //APP_FILE_CREATER_ID:创建者的ID
    private String appFileCreaterId;

    //APP_FILE_ORGAN_ID:创建组织ID
    private String appFileOrganId;

    //APP_FILE_CNT_FILE_ID:存储的文件ID,关联到TFS_FILE_INFO表的FILE_ID
    private String appFileCntFileId;

    public SsoAppFileEntity(String appFileId, String appBelongAppId, String appFileName, String appFileIsMain, String appFileDesc, Integer appFileOrderNum, Date appFileCreateTime, String appFileStatus, String appFileCreaterId, String appFileOrganId, String appFileCntFileId) {
        this.appFileId = appFileId;
        this.appBelongAppId = appBelongAppId;
        this.appFileName = appFileName;
        this.appFileIsMain = appFileIsMain;
        this.appFileDesc = appFileDesc;
        this.appFileOrderNum = appFileOrderNum;
        this.appFileCreateTime = appFileCreateTime;
        this.appFileStatus = appFileStatus;
        this.appFileCreaterId = appFileCreaterId;
        this.appFileOrganId = appFileOrganId;
        this.appFileCntFileId = appFileCntFileId;
    }

    public SsoAppFileEntity() {
        super();
    }

    public String getAppFileId() {
        return appFileId;
    }

    public void setAppFileId(String appFileId) {
        this.appFileId = appFileId == null ? null : appFileId.trim();
    }

    public String getAppBelongAppId() {
        return appBelongAppId;
    }

    public void setAppBelongAppId(String appBelongAppId) {
        this.appBelongAppId = appBelongAppId == null ? null : appBelongAppId.trim();
    }

    public String getAppFileName() {
        return appFileName;
    }

    public void setAppFileName(String appFileName) {
        this.appFileName = appFileName == null ? null : appFileName.trim();
    }

    public String getAppFileIsMain() {
        return appFileIsMain;
    }

    public void setAppFileIsMain(String appFileIsMain) {
        this.appFileIsMain = appFileIsMain == null ? null : appFileIsMain.trim();
    }

    public String getAppFileDesc() {
        return appFileDesc;
    }

    public void setAppFileDesc(String appFileDesc) {
        this.appFileDesc = appFileDesc == null ? null : appFileDesc.trim();
    }

    public Integer getAppFileOrderNum() {
        return appFileOrderNum;
    }

    public void setAppFileOrderNum(Integer appFileOrderNum) {
        this.appFileOrderNum = appFileOrderNum;
    }

    public Date getAppFileCreateTime() {
        return appFileCreateTime;
    }

    public void setAppFileCreateTime(Date appFileCreateTime) {
        this.appFileCreateTime = appFileCreateTime;
    }

    public String getAppFileStatus() {
        return appFileStatus;
    }

    public void setAppFileStatus(String appFileStatus) {
        this.appFileStatus = appFileStatus == null ? null : appFileStatus.trim();
    }

    public String getAppFileCreaterId() {
        return appFileCreaterId;
    }

    public void setAppFileCreaterId(String appFileCreaterId) {
        this.appFileCreaterId = appFileCreaterId == null ? null : appFileCreaterId.trim();
    }

    public String getAppFileOrganId() {
        return appFileOrganId;
    }

    public void setAppFileOrganId(String appFileOrganId) {
        this.appFileOrganId = appFileOrganId == null ? null : appFileOrganId.trim();
    }

    public String getAppFileCntFileId() {
        return appFileCntFileId;
    }

    public void setAppFileCntFileId(String appFileCntFileId) {
        this.appFileCntFileId = appFileCntFileId == null ? null : appFileCntFileId.trim();
    }
}