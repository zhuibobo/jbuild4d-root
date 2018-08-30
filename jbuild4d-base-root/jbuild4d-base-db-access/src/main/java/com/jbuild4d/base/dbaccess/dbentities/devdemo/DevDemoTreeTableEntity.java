package com.jbuild4d.base.dbaccess.dbentities.devdemo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;

import java.util.Date;

public class DevDemoTreeTableEntity {

    @DBKeyField
    private String ddttId;

    private String ddttKey;

    private String ddttName;

    private String ddttValue;

    private String ddttStatus;

    private String ddttDesc;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date ddttCreatetime;

    private Integer ddttOrderNum;

    private String ddttBindDicSelected;

    private String ddttBindDicRadio;

    private String ddttDdttBindDicMucheckbox;

    private String ddttParentId;

    private String ddttParentIdlist;

    private Integer ddttChildCount;

    public DevDemoTreeTableEntity(String ddttId, String ddttKey, String ddttName, String ddttValue, String ddttStatus, String ddttDesc, Date ddttCreatetime, Integer ddttOrderNum, String ddttBindDicSelected, String ddttBindDicRadio, String ddttDdttBindDicMucheckbox, String ddttParentId, String ddttParentIdlist, Integer ddttChildCount) {
        this.ddttId = ddttId;
        this.ddttKey = ddttKey;
        this.ddttName = ddttName;
        this.ddttValue = ddttValue;
        this.ddttStatus = ddttStatus;
        this.ddttDesc = ddttDesc;
        this.ddttCreatetime = ddttCreatetime;
        this.ddttOrderNum = ddttOrderNum;
        this.ddttBindDicSelected = ddttBindDicSelected;
        this.ddttBindDicRadio = ddttBindDicRadio;
        this.ddttDdttBindDicMucheckbox = ddttDdttBindDicMucheckbox;
        this.ddttParentId = ddttParentId;
        this.ddttParentIdlist = ddttParentIdlist;
        this.ddttChildCount = ddttChildCount;
    }

    public DevDemoTreeTableEntity() {
        super();
    }

    public String getDdttId() {
        return ddttId;
    }

    public void setDdttId(String ddttId) {
        this.ddttId = ddttId == null ? null : ddttId.trim();
    }

    public String getDdttKey() {
        return ddttKey;
    }

    public void setDdttKey(String ddttKey) {
        this.ddttKey = ddttKey == null ? null : ddttKey.trim();
    }

    public String getDdttName() {
        return ddttName;
    }

    public void setDdttName(String ddttName) {
        this.ddttName = ddttName == null ? null : ddttName.trim();
    }

    public String getDdttValue() {
        return ddttValue;
    }

    public void setDdttValue(String ddttValue) {
        this.ddttValue = ddttValue == null ? null : ddttValue.trim();
    }

    public String getDdttStatus() {
        return ddttStatus;
    }

    public void setDdttStatus(String ddttStatus) {
        this.ddttStatus = ddttStatus == null ? null : ddttStatus.trim();
    }

    public String getDdttDesc() {
        return ddttDesc;
    }

    public void setDdttDesc(String ddttDesc) {
        this.ddttDesc = ddttDesc == null ? null : ddttDesc.trim();
    }

    public Date getDdttCreatetime() {
        return ddttCreatetime;
    }

    public void setDdttCreatetime(Date ddttCreatetime) {
        this.ddttCreatetime = ddttCreatetime;
    }

    public Integer getDdttOrderNum() {
        return ddttOrderNum;
    }

    public void setDdttOrderNum(Integer ddttOrderNum) {
        this.ddttOrderNum = ddttOrderNum;
    }

    public String getDdttBindDicSelected() {
        return ddttBindDicSelected;
    }

    public void setDdttBindDicSelected(String ddttBindDicSelected) {
        this.ddttBindDicSelected = ddttBindDicSelected == null ? null : ddttBindDicSelected.trim();
    }

    public String getDdttBindDicRadio() {
        return ddttBindDicRadio;
    }

    public void setDdttBindDicRadio(String ddttBindDicRadio) {
        this.ddttBindDicRadio = ddttBindDicRadio == null ? null : ddttBindDicRadio.trim();
    }

    public String getDdttDdttBindDicMucheckbox() {
        return ddttDdttBindDicMucheckbox;
    }

    public void setDdttDdttBindDicMucheckbox(String ddttDdttBindDicMucheckbox) {
        this.ddttDdttBindDicMucheckbox = ddttDdttBindDicMucheckbox == null ? null : ddttDdttBindDicMucheckbox.trim();
    }

    public String getDdttParentId() {
        return ddttParentId;
    }

    public void setDdttParentId(String ddttParentId) {
        this.ddttParentId = ddttParentId == null ? null : ddttParentId.trim();
    }

    public String getDdttParentIdlist() {
        return ddttParentIdlist;
    }

    public void setDdttParentIdlist(String ddttParentIdlist) {
        this.ddttParentIdlist = ddttParentIdlist == null ? null : ddttParentIdlist.trim();
    }

    public Integer getDdttChildCount() {
        return ddttChildCount;
    }

    public void setDdttChildCount(Integer ddttChildCount) {
        this.ddttChildCount = ddttChildCount;
    }
}