package com.jbuild4d.base.dbaccess.dbentities.systemsetting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_history_data
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class HistoryDataEntity {
    //HISTORY_ID:
    @DBKeyField
    private String historyId;

    //HISTORY_ORGAN_ID:删除用户所在的组织id
    private String historyOrganId;

    //HISTORY_ORGAN_NAME:删除用户所在的组织名称
    private String historyOrganName;

    //HISTORY_USER_ID:删除用户的ID
    private String historyUserId;

    //HISTORY_USER_NAME:删除用户的用户名
    private String historyUserName;

    //HISTORY_CREATETIME:记录的创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date historyCreatetime;

    //HISTORY_TABLE_NAME:删除记录的表名
    private String historyTableName;

    //HISTORY_RECORD_ID:删除记录的主键值
    private String historyRecordId;

    //HISTORY_RECORD:被删除数据的json格式数据
    private String historyRecord;

    public HistoryDataEntity(String historyId, String historyOrganId, String historyOrganName, String historyUserId, String historyUserName, Date historyCreatetime, String historyTableName, String historyRecordId) {
        this.historyId = historyId;
        this.historyOrganId = historyOrganId;
        this.historyOrganName = historyOrganName;
        this.historyUserId = historyUserId;
        this.historyUserName = historyUserName;
        this.historyCreatetime = historyCreatetime;
        this.historyTableName = historyTableName;
        this.historyRecordId = historyRecordId;
    }

    public HistoryDataEntity(String historyId, String historyOrganId, String historyOrganName, String historyUserId, String historyUserName, Date historyCreatetime, String historyTableName, String historyRecordId, String historyRecord) {
        this.historyId = historyId;
        this.historyOrganId = historyOrganId;
        this.historyOrganName = historyOrganName;
        this.historyUserId = historyUserId;
        this.historyUserName = historyUserName;
        this.historyCreatetime = historyCreatetime;
        this.historyTableName = historyTableName;
        this.historyRecordId = historyRecordId;
        this.historyRecord = historyRecord;
    }

    public HistoryDataEntity() {
        super();
    }

    public String getHistoryId() {
        return historyId;
    }

    public void setHistoryId(String historyId) {
        this.historyId = historyId == null ? null : historyId.trim();
    }

    public String getHistoryOrganId() {
        return historyOrganId;
    }

    public void setHistoryOrganId(String historyOrganId) {
        this.historyOrganId = historyOrganId == null ? null : historyOrganId.trim();
    }

    public String getHistoryOrganName() {
        return historyOrganName;
    }

    public void setHistoryOrganName(String historyOrganName) {
        this.historyOrganName = historyOrganName == null ? null : historyOrganName.trim();
    }

    public String getHistoryUserId() {
        return historyUserId;
    }

    public void setHistoryUserId(String historyUserId) {
        this.historyUserId = historyUserId == null ? null : historyUserId.trim();
    }

    public String getHistoryUserName() {
        return historyUserName;
    }

    public void setHistoryUserName(String historyUserName) {
        this.historyUserName = historyUserName == null ? null : historyUserName.trim();
    }

    public Date getHistoryCreatetime() {
        return historyCreatetime;
    }

    public void setHistoryCreatetime(Date historyCreatetime) {
        this.historyCreatetime = historyCreatetime;
    }

    public String getHistoryTableName() {
        return historyTableName;
    }

    public void setHistoryTableName(String historyTableName) {
        this.historyTableName = historyTableName == null ? null : historyTableName.trim();
    }

    public String getHistoryRecordId() {
        return historyRecordId;
    }

    public void setHistoryRecordId(String historyRecordId) {
        this.historyRecordId = historyRecordId == null ? null : historyRecordId.trim();
    }

    public String getHistoryRecord() {
        return historyRecord;
    }

    public void setHistoryRecord(String historyRecord) {
        this.historyRecord = historyRecord == null ? null : historyRecord.trim();
    }
}