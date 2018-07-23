package com.jbuild4d.base.dbaccess.dbentities;

import java.util.Date;

public class DevDemoTreeTableEntity {
    private String ddttId;

    private String ddttKey;

    private String ddttName;

    private String ddttValue;

    private String ddttStatus;

    private String ddttDesc;

    private Date ddttCreatetime;

    private Integer ddttOrderNum;

    private String ddttBindDicSelected;

    private String ddttBindDicRadio;

    private String ddglDdttBindDicMucheckbox;

    private String ddglParentId;

    private String ddglParentIdlist;

    public DevDemoTreeTableEntity(String ddttId, String ddttKey, String ddttName, String ddttValue, String ddttStatus, String ddttDesc, Date ddttCreatetime, Integer ddttOrderNum, String ddttBindDicSelected, String ddttBindDicRadio, String ddglDdttBindDicMucheckbox, String ddglParentId, String ddglParentIdlist) {
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
        this.ddglDdttBindDicMucheckbox = ddglDdttBindDicMucheckbox;
        this.ddglParentId = ddglParentId;
        this.ddglParentIdlist = ddglParentIdlist;
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

    public String getDdglDdttBindDicMucheckbox() {
        return ddglDdttBindDicMucheckbox;
    }

    public void setDdglDdttBindDicMucheckbox(String ddglDdttBindDicMucheckbox) {
        this.ddglDdttBindDicMucheckbox = ddglDdttBindDicMucheckbox == null ? null : ddglDdttBindDicMucheckbox.trim();
    }

    public String getDdglParentId() {
        return ddglParentId;
    }

    public void setDdglParentId(String ddglParentId) {
        this.ddglParentId = ddglParentId == null ? null : ddglParentId.trim();
    }

    public String getDdglParentIdlist() {
        return ddglParentIdlist;
    }

    public void setDdglParentIdlist(String ddglParentIdlist) {
        this.ddglParentIdlist = ddglParentIdlist == null ? null : ddglParentIdlist.trim();
    }
}