package com.jbuild4d.base.dbaccess.dbentities;

import com.jbuild4d.base.dbaccess.anno.DBKeyField;

import java.util.Date;

public class DevDemoTLTreeListEntity {

    @DBKeyField
    private String ddtlId;

    private String ddtlKey;

    private String ddtlName;

    private String ddtlValue;

    private String ddtlStatus;

    private String ddtlDesc;

    private Date ddtlCreatetime;

    private Integer ddtlOrderNum;

    private String ddtlBindDicSelected;

    private String ddtlBindDicRadio;

    private String ddtlDdttBindDicMucheckbox;

    private String ddtlGroupId;

    public DevDemoTLTreeListEntity(String ddtlId, String ddtlKey, String ddtlName, String ddtlValue, String ddtlStatus, String ddtlDesc, Date ddtlCreatetime, Integer ddtlOrderNum, String ddtlBindDicSelected, String ddtlBindDicRadio, String ddtlDdttBindDicMucheckbox, String ddtlGroupId) {
        this.ddtlId = ddtlId;
        this.ddtlKey = ddtlKey;
        this.ddtlName = ddtlName;
        this.ddtlValue = ddtlValue;
        this.ddtlStatus = ddtlStatus;
        this.ddtlDesc = ddtlDesc;
        this.ddtlCreatetime = ddtlCreatetime;
        this.ddtlOrderNum = ddtlOrderNum;
        this.ddtlBindDicSelected = ddtlBindDicSelected;
        this.ddtlBindDicRadio = ddtlBindDicRadio;
        this.ddtlDdttBindDicMucheckbox = ddtlDdttBindDicMucheckbox;
        this.ddtlGroupId = ddtlGroupId;
    }

    public DevDemoTLTreeListEntity() {
        super();
    }

    public String getDdtlId() {
        return ddtlId;
    }

    public void setDdtlId(String ddtlId) {
        this.ddtlId = ddtlId == null ? null : ddtlId.trim();
    }

    public String getDdtlKey() {
        return ddtlKey;
    }

    public void setDdtlKey(String ddtlKey) {
        this.ddtlKey = ddtlKey == null ? null : ddtlKey.trim();
    }

    public String getDdtlName() {
        return ddtlName;
    }

    public void setDdtlName(String ddtlName) {
        this.ddtlName = ddtlName == null ? null : ddtlName.trim();
    }

    public String getDdtlValue() {
        return ddtlValue;
    }

    public void setDdtlValue(String ddtlValue) {
        this.ddtlValue = ddtlValue == null ? null : ddtlValue.trim();
    }

    public String getDdtlStatus() {
        return ddtlStatus;
    }

    public void setDdtlStatus(String ddtlStatus) {
        this.ddtlStatus = ddtlStatus == null ? null : ddtlStatus.trim();
    }

    public String getDdtlDesc() {
        return ddtlDesc;
    }

    public void setDdtlDesc(String ddtlDesc) {
        this.ddtlDesc = ddtlDesc == null ? null : ddtlDesc.trim();
    }

    public Date getDdtlCreatetime() {
        return ddtlCreatetime;
    }

    public void setDdtlCreatetime(Date ddtlCreatetime) {
        this.ddtlCreatetime = ddtlCreatetime;
    }

    public Integer getDdtlOrderNum() {
        return ddtlOrderNum;
    }

    public void setDdtlOrderNum(Integer ddtlOrderNum) {
        this.ddtlOrderNum = ddtlOrderNum;
    }

    public String getDdtlBindDicSelected() {
        return ddtlBindDicSelected;
    }

    public void setDdtlBindDicSelected(String ddtlBindDicSelected) {
        this.ddtlBindDicSelected = ddtlBindDicSelected == null ? null : ddtlBindDicSelected.trim();
    }

    public String getDdtlBindDicRadio() {
        return ddtlBindDicRadio;
    }

    public void setDdtlBindDicRadio(String ddtlBindDicRadio) {
        this.ddtlBindDicRadio = ddtlBindDicRadio == null ? null : ddtlBindDicRadio.trim();
    }

    public String getDdtlDdttBindDicMucheckbox() {
        return ddtlDdttBindDicMucheckbox;
    }

    public void setDdtlDdttBindDicMucheckbox(String ddtlDdttBindDicMucheckbox) {
        this.ddtlDdttBindDicMucheckbox = ddtlDdttBindDicMucheckbox == null ? null : ddtlDdttBindDicMucheckbox.trim();
    }

    public String getDdtlGroupId() {
        return ddtlGroupId;
    }

    public void setDdtlGroupId(String ddtlGroupId) {
        this.ddtlGroupId = ddtlGroupId == null ? null : ddtlGroupId.trim();
    }
}