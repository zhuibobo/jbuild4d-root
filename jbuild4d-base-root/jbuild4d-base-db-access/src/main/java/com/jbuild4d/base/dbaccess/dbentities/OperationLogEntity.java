package com.jbuild4d.base.dbaccess.dbentities;

import java.util.Date;

public class OperationLogEntity {
    private String logId;

    private String logText;

    private Integer logOrderNum;

    private Date logCreateTime;

    private String logSystemName;

    private String logModuleName;

    private String logActionName;

    private String logData;

    private String logUserId;

    private String logUserName;

    private String logOrganId;

    private String logOrganName;

    private String logIp;

    private String logType;

    private String logClassName;

    private String logStatus;

    public OperationLogEntity(String logId, String logText, Integer logOrderNum, Date logCreateTime, String logSystemName, String logModuleName, String logActionName, String logData, String logUserId, String logUserName, String logOrganId, String logOrganName, String logIp, String logType, String logClassName, String logStatus) {
        this.logId = logId;
        this.logText = logText;
        this.logOrderNum = logOrderNum;
        this.logCreateTime = logCreateTime;
        this.logSystemName = logSystemName;
        this.logModuleName = logModuleName;
        this.logActionName = logActionName;
        this.logData = logData;
        this.logUserId = logUserId;
        this.logUserName = logUserName;
        this.logOrganId = logOrganId;
        this.logOrganName = logOrganName;
        this.logIp = logIp;
        this.logType = logType;
        this.logClassName = logClassName;
        this.logStatus = logStatus;
    }

    public OperationLogEntity() {
        super();
    }

    public String getLogId() {
        return logId;
    }

    public void setLogId(String logId) {
        this.logId = logId == null ? null : logId.trim();
    }

    public String getLogText() {
        return logText;
    }

    public void setLogText(String logText) {
        this.logText = logText == null ? null : logText.trim();
    }

    public Integer getLogOrderNum() {
        return logOrderNum;
    }

    public void setLogOrderNum(Integer logOrderNum) {
        this.logOrderNum = logOrderNum;
    }

    public Date getLogCreateTime() {
        return logCreateTime;
    }

    public void setLogCreateTime(Date logCreateTime) {
        this.logCreateTime = logCreateTime;
    }

    public String getLogSystemName() {
        return logSystemName;
    }

    public void setLogSystemName(String logSystemName) {
        this.logSystemName = logSystemName == null ? null : logSystemName.trim();
    }

    public String getLogModuleName() {
        return logModuleName;
    }

    public void setLogModuleName(String logModuleName) {
        this.logModuleName = logModuleName == null ? null : logModuleName.trim();
    }

    public String getLogActionName() {
        return logActionName;
    }

    public void setLogActionName(String logActionName) {
        this.logActionName = logActionName == null ? null : logActionName.trim();
    }

    public String getLogData() {
        return logData;
    }

    public void setLogData(String logData) {
        this.logData = logData == null ? null : logData.trim();
    }

    public String getLogUserId() {
        return logUserId;
    }

    public void setLogUserId(String logUserId) {
        this.logUserId = logUserId == null ? null : logUserId.trim();
    }

    public String getLogUserName() {
        return logUserName;
    }

    public void setLogUserName(String logUserName) {
        this.logUserName = logUserName == null ? null : logUserName.trim();
    }

    public String getLogOrganId() {
        return logOrganId;
    }

    public void setLogOrganId(String logOrganId) {
        this.logOrganId = logOrganId == null ? null : logOrganId.trim();
    }

    public String getLogOrganName() {
        return logOrganName;
    }

    public void setLogOrganName(String logOrganName) {
        this.logOrganName = logOrganName == null ? null : logOrganName.trim();
    }

    public String getLogIp() {
        return logIp;
    }

    public void setLogIp(String logIp) {
        this.logIp = logIp == null ? null : logIp.trim();
    }

    public String getLogType() {
        return logType;
    }

    public void setLogType(String logType) {
        this.logType = logType == null ? null : logType.trim();
    }

    public String getLogClassName() {
        return logClassName;
    }

    public void setLogClassName(String logClassName) {
        this.logClassName = logClassName == null ? null : logClassName.trim();
    }

    public String getLogStatus() {
        return logStatus;
    }

    public void setLogStatus(String logStatus) {
        this.logStatus = logStatus == null ? null : logStatus.trim();
    }
}