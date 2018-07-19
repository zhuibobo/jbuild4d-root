package com.jbuild4d.base.dbaccess.dbentities;

import java.util.Date;

public class DictionaryGroupEntity {
    private String dictGroupId;

    private String dictGroupValue;

    private String dictGroupText;

    private Integer dictGroupOrderNum;

    private Date dictGroupCreateTime;

    private String dictGroupDesc;

    private String dictGroupStatus;

    private String dictGroupParentId;

    public DictionaryGroupEntity(String dictGroupId, String dictGroupValue, String dictGroupText, Integer dictGroupOrderNum, Date dictGroupCreateTime, String dictGroupDesc, String dictGroupStatus, String dictGroupParentId) {
        this.dictGroupId = dictGroupId;
        this.dictGroupValue = dictGroupValue;
        this.dictGroupText = dictGroupText;
        this.dictGroupOrderNum = dictGroupOrderNum;
        this.dictGroupCreateTime = dictGroupCreateTime;
        this.dictGroupDesc = dictGroupDesc;
        this.dictGroupStatus = dictGroupStatus;
        this.dictGroupParentId = dictGroupParentId;
    }

    public DictionaryGroupEntity() {
        super();
    }

    public String getDictGroupId() {
        return dictGroupId;
    }

    public void setDictGroupId(String dictGroupId) {
        this.dictGroupId = dictGroupId == null ? null : dictGroupId.trim();
    }

    public String getDictGroupValue() {
        return dictGroupValue;
    }

    public void setDictGroupValue(String dictGroupValue) {
        this.dictGroupValue = dictGroupValue == null ? null : dictGroupValue.trim();
    }

    public String getDictGroupText() {
        return dictGroupText;
    }

    public void setDictGroupText(String dictGroupText) {
        this.dictGroupText = dictGroupText == null ? null : dictGroupText.trim();
    }

    public Integer getDictGroupOrderNum() {
        return dictGroupOrderNum;
    }

    public void setDictGroupOrderNum(Integer dictGroupOrderNum) {
        this.dictGroupOrderNum = dictGroupOrderNum;
    }

    public Date getDictGroupCreateTime() {
        return dictGroupCreateTime;
    }

    public void setDictGroupCreateTime(Date dictGroupCreateTime) {
        this.dictGroupCreateTime = dictGroupCreateTime;
    }

    public String getDictGroupDesc() {
        return dictGroupDesc;
    }

    public void setDictGroupDesc(String dictGroupDesc) {
        this.dictGroupDesc = dictGroupDesc == null ? null : dictGroupDesc.trim();
    }

    public String getDictGroupStatus() {
        return dictGroupStatus;
    }

    public void setDictGroupStatus(String dictGroupStatus) {
        this.dictGroupStatus = dictGroupStatus == null ? null : dictGroupStatus.trim();
    }

    public String getDictGroupParentId() {
        return dictGroupParentId;
    }

    public void setDictGroupParentId(String dictGroupParentId) {
        this.dictGroupParentId = dictGroupParentId == null ? null : dictGroupParentId.trim();
    }
}