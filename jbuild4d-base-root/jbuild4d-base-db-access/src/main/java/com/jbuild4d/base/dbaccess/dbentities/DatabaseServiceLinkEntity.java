package com.jbuild4d.base.dbaccess.dbentities;

import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table TB4D_DATABASE_SERVICE_LINK
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class DatabaseServiceLinkEntity {
    //DBLINK_ID
    @DBKeyField
    private String dblinkId;

    //DBLINK_VALUE
    private String dblinkValue;

    //DBLINK_NAME
    private String dblinkName;

    //DBLINK_TYPE
    private String dblinkType;

    //DBLINK_DRIVERNAME
    private String dblinkDrivername;

    //DBLINK_URL
    private String dblinkUrl;

    //DBLINK_USER
    private String dblinkUser;

    //DBLINK_PASSWORD
    private String dblinkPassword;

    //DBLINK_CREATE_TIME
    private Date dblinkCreateTime;

    //DBLINK_ORDER_NUM
    private Integer dblinkOrderNum;

    //DBLINK_DESC
    private String dblinkDesc;

    //DBLINK_IS_LOCATION
    private String dblinkIsLocation;

    //DBLINK_STATUS
    private String dblinkStatus;

    public DatabaseServiceLinkEntity(String dblinkId, String dblinkValue, String dblinkName, String dblinkType, String dblinkDrivername, String dblinkUrl, String dblinkUser, String dblinkPassword, Date dblinkCreateTime, Integer dblinkOrderNum, String dblinkDesc, String dblinkIsLocation, String dblinkStatus) {
        this.dblinkId = dblinkId;
        this.dblinkValue = dblinkValue;
        this.dblinkName = dblinkName;
        this.dblinkType = dblinkType;
        this.dblinkDrivername = dblinkDrivername;
        this.dblinkUrl = dblinkUrl;
        this.dblinkUser = dblinkUser;
        this.dblinkPassword = dblinkPassword;
        this.dblinkCreateTime = dblinkCreateTime;
        this.dblinkOrderNum = dblinkOrderNum;
        this.dblinkDesc = dblinkDesc;
        this.dblinkIsLocation = dblinkIsLocation;
        this.dblinkStatus = dblinkStatus;
    }

    public DatabaseServiceLinkEntity() {
        super();
    }

    public String getDblinkId() {
        return dblinkId;
    }

    public void setDblinkId(String dblinkId) {
        this.dblinkId = dblinkId == null ? null : dblinkId.trim();
    }

    public String getDblinkValue() {
        return dblinkValue;
    }

    public void setDblinkValue(String dblinkValue) {
        this.dblinkValue = dblinkValue == null ? null : dblinkValue.trim();
    }

    public String getDblinkName() {
        return dblinkName;
    }

    public void setDblinkName(String dblinkName) {
        this.dblinkName = dblinkName == null ? null : dblinkName.trim();
    }

    public String getDblinkType() {
        return dblinkType;
    }

    public void setDblinkType(String dblinkType) {
        this.dblinkType = dblinkType == null ? null : dblinkType.trim();
    }

    public String getDblinkDrivername() {
        return dblinkDrivername;
    }

    public void setDblinkDrivername(String dblinkDrivername) {
        this.dblinkDrivername = dblinkDrivername == null ? null : dblinkDrivername.trim();
    }

    public String getDblinkUrl() {
        return dblinkUrl;
    }

    public void setDblinkUrl(String dblinkUrl) {
        this.dblinkUrl = dblinkUrl == null ? null : dblinkUrl.trim();
    }

    public String getDblinkUser() {
        return dblinkUser;
    }

    public void setDblinkUser(String dblinkUser) {
        this.dblinkUser = dblinkUser == null ? null : dblinkUser.trim();
    }

    public String getDblinkPassword() {
        return dblinkPassword;
    }

    public void setDblinkPassword(String dblinkPassword) {
        this.dblinkPassword = dblinkPassword == null ? null : dblinkPassword.trim();
    }

    public Date getDblinkCreateTime() {
        return dblinkCreateTime;
    }

    public void setDblinkCreateTime(Date dblinkCreateTime) {
        this.dblinkCreateTime = dblinkCreateTime;
    }

    public Integer getDblinkOrderNum() {
        return dblinkOrderNum;
    }

    public void setDblinkOrderNum(Integer dblinkOrderNum) {
        this.dblinkOrderNum = dblinkOrderNum;
    }

    public String getDblinkDesc() {
        return dblinkDesc;
    }

    public void setDblinkDesc(String dblinkDesc) {
        this.dblinkDesc = dblinkDesc == null ? null : dblinkDesc.trim();
    }

    public String getDblinkIsLocation() {
        return dblinkIsLocation;
    }

    public void setDblinkIsLocation(String dblinkIsLocation) {
        this.dblinkIsLocation = dblinkIsLocation == null ? null : dblinkIsLocation.trim();
    }

    public String getDblinkStatus() {
        return dblinkStatus;
    }

    public void setDblinkStatus(String dblinkStatus) {
        this.dblinkStatus = dblinkStatus == null ? null : dblinkStatus.trim();
    }
}