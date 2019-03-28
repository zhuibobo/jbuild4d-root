package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table TBUILD_FORM_CONFIG
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class FormConfigEntity {
    //FCONFIG_ID
    @DBKeyField
    private String fconfigId;

    //FCONFIG_FORM_ID
    private String fconfigFormId;

    //FCONFIG_TYPE
    private String fconfigType;

    //FCONFIG_NAME
    private String fconfigName;

    //FCONFIG_VALUE
    private String fconfigValue;

    //FCONFIG_DESC
    private String fconfigDesc;

    //FCONFIG_CREATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date fconfigCreateTime;

    //FCONFIG_CREATER
    private String fconfigCreater;

    //FCONFIG_ORDER_NUM
    private Integer fconfigOrderNum;

    public FormConfigEntity(String fconfigId, String fconfigFormId, String fconfigType, String fconfigName, String fconfigValue, String fconfigDesc, Date fconfigCreateTime, String fconfigCreater, Integer fconfigOrderNum) {
        this.fconfigId = fconfigId;
        this.fconfigFormId = fconfigFormId;
        this.fconfigType = fconfigType;
        this.fconfigName = fconfigName;
        this.fconfigValue = fconfigValue;
        this.fconfigDesc = fconfigDesc;
        this.fconfigCreateTime = fconfigCreateTime;
        this.fconfigCreater = fconfigCreater;
        this.fconfigOrderNum = fconfigOrderNum;
    }

    public FormConfigEntity() {
        super();
    }

    public String getFconfigId() {
        return fconfigId;
    }

    public void setFconfigId(String fconfigId) {
        this.fconfigId = fconfigId == null ? null : fconfigId.trim();
    }

    public String getFconfigFormId() {
        return fconfigFormId;
    }

    public void setFconfigFormId(String fconfigFormId) {
        this.fconfigFormId = fconfigFormId == null ? null : fconfigFormId.trim();
    }

    public String getFconfigType() {
        return fconfigType;
    }

    public void setFconfigType(String fconfigType) {
        this.fconfigType = fconfigType == null ? null : fconfigType.trim();
    }

    public String getFconfigName() {
        return fconfigName;
    }

    public void setFconfigName(String fconfigName) {
        this.fconfigName = fconfigName == null ? null : fconfigName.trim();
    }

    public String getFconfigValue() {
        return fconfigValue;
    }

    public void setFconfigValue(String fconfigValue) {
        this.fconfigValue = fconfigValue == null ? null : fconfigValue.trim();
    }

    public String getFconfigDesc() {
        return fconfigDesc;
    }

    public void setFconfigDesc(String fconfigDesc) {
        this.fconfigDesc = fconfigDesc == null ? null : fconfigDesc.trim();
    }

    public Date getFconfigCreateTime() {
        return fconfigCreateTime;
    }

    public void setFconfigCreateTime(Date fconfigCreateTime) {
        this.fconfigCreateTime = fconfigCreateTime;
    }

    public String getFconfigCreater() {
        return fconfigCreater;
    }

    public void setFconfigCreater(String fconfigCreater) {
        this.fconfigCreater = fconfigCreater == null ? null : fconfigCreater.trim();
    }

    public Integer getFconfigOrderNum() {
        return fconfigOrderNum;
    }

    public void setFconfigOrderNum(Integer fconfigOrderNum) {
        this.fconfigOrderNum = fconfigOrderNum;
    }
}