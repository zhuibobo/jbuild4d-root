package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :nullTBUILD_DB_LINK
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class DbLinkEntity {
    //DB_ID:主键:UUID
    @DBKeyField
    private String dbId;

    //DB_LINK_VALUE:值,唯一
    private String dbLinkValue;

    //DB_LINK_NAME:数据库名称
    private String dbLinkName;

    //DB_TYPE:数据库类型
    private String dbType;

    //DB_DRIVER_NAME:驱动程序名称
    private String dbDriverName;

    //DB_DATABASE_NAME:数据库名称
    private String dbDatabaseName;

    //DB_URL:数据库URL地址
    private String dbUrl;

    //DB_USER:用户名
    private String dbUser;

    //DB_PASSWORD:密码
    private String dbPassword;

    //DB_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dbCreateTime;

    //DB_ORDER_NUM:排序号
    private Integer dbOrderNum;

    //DB_DESC:备注
    private String dbDesc;

    //DB_IS_LOCATION:是否本地库,构建库与业务库一体
    private String dbIsLocation;

    //DB_STATUS:状态
    private String dbStatus;

    //DB_ORGAN_ID:组织ID
    private String dbOrganId;

    //DB_ORGAN_NAME:组织名称
    private String dbOrganName;

    public DbLinkEntity(String dbId, String dbLinkValue, String dbLinkName, String dbType, String dbDriverName, String dbDatabaseName, String dbUrl, String dbUser, String dbPassword, Date dbCreateTime, Integer dbOrderNum, String dbDesc, String dbIsLocation, String dbStatus, String dbOrganId, String dbOrganName) {
        this.dbId = dbId;
        this.dbLinkValue = dbLinkValue;
        this.dbLinkName = dbLinkName;
        this.dbType = dbType;
        this.dbDriverName = dbDriverName;
        this.dbDatabaseName = dbDatabaseName;
        this.dbUrl = dbUrl;
        this.dbUser = dbUser;
        this.dbPassword = dbPassword;
        this.dbCreateTime = dbCreateTime;
        this.dbOrderNum = dbOrderNum;
        this.dbDesc = dbDesc;
        this.dbIsLocation = dbIsLocation;
        this.dbStatus = dbStatus;
        this.dbOrganId = dbOrganId;
        this.dbOrganName = dbOrganName;
    }

    public DbLinkEntity() {
        super();
    }

    public String getDbId() {
        return dbId;
    }

    public void setDbId(String dbId) {
        this.dbId = dbId == null ? null : dbId.trim();
    }

    public String getDbLinkValue() {
        return dbLinkValue;
    }

    public void setDbLinkValue(String dbLinkValue) {
        this.dbLinkValue = dbLinkValue == null ? null : dbLinkValue.trim();
    }

    public String getDbLinkName() {
        return dbLinkName;
    }

    public void setDbLinkName(String dbLinkName) {
        this.dbLinkName = dbLinkName == null ? null : dbLinkName.trim();
    }

    public String getDbType() {
        return dbType;
    }

    public void setDbType(String dbType) {
        this.dbType = dbType == null ? null : dbType.trim();
    }

    public String getDbDriverName() {
        return dbDriverName;
    }

    public void setDbDriverName(String dbDriverName) {
        this.dbDriverName = dbDriverName == null ? null : dbDriverName.trim();
    }

    public String getDbDatabaseName() {
        return dbDatabaseName;
    }

    public void setDbDatabaseName(String dbDatabaseName) {
        this.dbDatabaseName = dbDatabaseName == null ? null : dbDatabaseName.trim();
    }

    public String getDbUrl() {
        return dbUrl;
    }

    public void setDbUrl(String dbUrl) {
        this.dbUrl = dbUrl == null ? null : dbUrl.trim();
    }

    public String getDbUser() {
        return dbUser;
    }

    public void setDbUser(String dbUser) {
        this.dbUser = dbUser == null ? null : dbUser.trim();
    }

    public String getDbPassword() {
        return dbPassword;
    }

    public void setDbPassword(String dbPassword) {
        this.dbPassword = dbPassword == null ? null : dbPassword.trim();
    }

    public Date getDbCreateTime() {
        return dbCreateTime;
    }

    public void setDbCreateTime(Date dbCreateTime) {
        this.dbCreateTime = dbCreateTime;
    }

    public Integer getDbOrderNum() {
        return dbOrderNum;
    }

    public void setDbOrderNum(Integer dbOrderNum) {
        this.dbOrderNum = dbOrderNum;
    }

    public String getDbDesc() {
        return dbDesc;
    }

    public void setDbDesc(String dbDesc) {
        this.dbDesc = dbDesc == null ? null : dbDesc.trim();
    }

    public String getDbIsLocation() {
        return dbIsLocation;
    }

    public void setDbIsLocation(String dbIsLocation) {
        this.dbIsLocation = dbIsLocation == null ? null : dbIsLocation.trim();
    }

    public String getDbStatus() {
        return dbStatus;
    }

    public void setDbStatus(String dbStatus) {
        this.dbStatus = dbStatus == null ? null : dbStatus.trim();
    }

    public String getDbOrganId() {
        return dbOrganId;
    }

    public void setDbOrganId(String dbOrganId) {
        this.dbOrganId = dbOrganId == null ? null : dbOrganId.trim();
    }

    public String getDbOrganName() {
        return dbOrganName;
    }

    public void setDbOrganName(String dbOrganName) {
        this.dbOrganName = dbOrganName == null ? null : dbOrganName.trim();
    }
}