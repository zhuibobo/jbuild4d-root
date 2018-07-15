package com.jbuild4d.base.dbaccess.dbentities;

import java.util.Date;

public class DevDemoGenListEntity {
    private String ddglId;

    private String ddglKey;

    private String ddglName;

    private String ddglValue;

    private String ddglStatus;

    private String ddglDesc;

    private Date ddglCreatetime;

    private String ddglUserId;

    private String ddglUserName;

    private String ddglOrganId;

    private String ddglOrganName;

    private String ddglApi;

    private Long ddglOrderNum;

    public DevDemoGenListEntity(String ddglId, String ddglKey, String ddglName, String ddglValue, String ddglStatus, String ddglDesc, Date ddglCreatetime, String ddglUserId, String ddglUserName, String ddglOrganId, String ddglOrganName, String ddglApi, Long ddglOrderNum) {
        this.ddglId = ddglId;
        this.ddglKey = ddglKey;
        this.ddglName = ddglName;
        this.ddglValue = ddglValue;
        this.ddglStatus = ddglStatus;
        this.ddglDesc = ddglDesc;
        this.ddglCreatetime = ddglCreatetime;
        this.ddglUserId = ddglUserId;
        this.ddglUserName = ddglUserName;
        this.ddglOrganId = ddglOrganId;
        this.ddglOrganName = ddglOrganName;
        this.ddglApi = ddglApi;
        this.ddglOrderNum = ddglOrderNum;
    }

    public DevDemoGenListEntity() {
        super();
    }

    public String getDdglId() {
        return ddglId;
    }

    public void setDdglId(String ddglId) {
        this.ddglId = ddglId == null ? null : ddglId.trim();
    }

    public String getDdglKey() {
        return ddglKey;
    }

    public void setDdglKey(String ddglKey) {
        this.ddglKey = ddglKey == null ? null : ddglKey.trim();
    }

    public String getDdglName() {
        return ddglName;
    }

    public void setDdglName(String ddglName) {
        this.ddglName = ddglName == null ? null : ddglName.trim();
    }

    public String getDdglValue() {
        return ddglValue;
    }

    public void setDdglValue(String ddglValue) {
        this.ddglValue = ddglValue == null ? null : ddglValue.trim();
    }

    public String getDdglStatus() {
        return ddglStatus;
    }

    public void setDdglStatus(String ddglStatus) {
        this.ddglStatus = ddglStatus == null ? null : ddglStatus.trim();
    }

    public String getDdglDesc() {
        return ddglDesc;
    }

    public void setDdglDesc(String ddglDesc) {
        this.ddglDesc = ddglDesc == null ? null : ddglDesc.trim();
    }

    public Date getDdglCreatetime() {
        return ddglCreatetime;
    }

    public void setDdglCreatetime(Date ddglCreatetime) {
        this.ddglCreatetime = ddglCreatetime;
    }

    public String getDdglUserId() {
        return ddglUserId;
    }

    public void setDdglUserId(String ddglUserId) {
        this.ddglUserId = ddglUserId == null ? null : ddglUserId.trim();
    }

    public String getDdglUserName() {
        return ddglUserName;
    }

    public void setDdglUserName(String ddglUserName) {
        this.ddglUserName = ddglUserName == null ? null : ddglUserName.trim();
    }

    public String getDdglOrganId() {
        return ddglOrganId;
    }

    public void setDdglOrganId(String ddglOrganId) {
        this.ddglOrganId = ddglOrganId == null ? null : ddglOrganId.trim();
    }

    public String getDdglOrganName() {
        return ddglOrganName;
    }

    public void setDdglOrganName(String ddglOrganName) {
        this.ddglOrganName = ddglOrganName == null ? null : ddglOrganName.trim();
    }

    public String getDdglApi() {
        return ddglApi;
    }

    public void setDdglApi(String ddglApi) {
        this.ddglApi = ddglApi == null ? null : ddglApi.trim();
    }

    public Long getDdglOrderNum() {
        return ddglOrderNum;
    }

    public void setDdglOrderNum(Long ddglOrderNum) {
        this.ddglOrderNum = ddglOrderNum;
    }
}