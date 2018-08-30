package com.jbuild4d.base.dbaccess.dbentities.systemsetting;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;

import java.util.Date;

public class DictionaryEntity {

    @DBKeyField
    private String dictId;

    private String dictKey;

    private String dictValue;

    private String dictText;

    private String dictGroupId;

    private Integer dictOrderNum;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dictCreateTime;

    private String dictParentId;

    private String dictParentIdlist;

    private String dictIssystem;

    private String dictDelEnable;

    private String dictStatus;

    private String dictIsSelected;

    private String dictDesc;

    private Integer dictChildCount;

    private String dictExAttr1;

    private String dictExAttr2;

    private String dictExAttr3;

    private String dictExAttr4;

    private String dictUserId;

    private String dictUserName;

    private String dictOrganId;

    private String dictOrganName;

    public DictionaryEntity(String dictId, String dictKey, String dictValue, String dictText, String dictGroupId, Integer dictOrderNum, Date dictCreateTime, String dictParentId, String dictParentIdlist, String dictIssystem, String dictDelEnable, String dictStatus, String dictIsSelected, String dictDesc, Integer dictChildCount, String dictExAttr1, String dictExAttr2, String dictExAttr3, String dictExAttr4, String dictUserId, String dictUserName, String dictOrganId, String dictOrganName) {
        this.dictId = dictId;
        this.dictKey = dictKey;
        this.dictValue = dictValue;
        this.dictText = dictText;
        this.dictGroupId = dictGroupId;
        this.dictOrderNum = dictOrderNum;
        this.dictCreateTime = dictCreateTime;
        this.dictParentId = dictParentId;
        this.dictParentIdlist = dictParentIdlist;
        this.dictIssystem = dictIssystem;
        this.dictDelEnable = dictDelEnable;
        this.dictStatus = dictStatus;
        this.dictIsSelected = dictIsSelected;
        this.dictDesc = dictDesc;
        this.dictChildCount = dictChildCount;
        this.dictExAttr1 = dictExAttr1;
        this.dictExAttr2 = dictExAttr2;
        this.dictExAttr3 = dictExAttr3;
        this.dictExAttr4 = dictExAttr4;
        this.dictUserId = dictUserId;
        this.dictUserName = dictUserName;
        this.dictOrganId = dictOrganId;
        this.dictOrganName = dictOrganName;
    }

    public DictionaryEntity() {
        super();
    }

    public String getDictId() {
        return dictId;
    }

    public void setDictId(String dictId) {
        this.dictId = dictId == null ? null : dictId.trim();
    }

    public String getDictKey() {
        return dictKey;
    }

    public void setDictKey(String dictKey) {
        this.dictKey = dictKey == null ? null : dictKey.trim();
    }

    public String getDictValue() {
        return dictValue;
    }

    public void setDictValue(String dictValue) {
        this.dictValue = dictValue == null ? null : dictValue.trim();
    }

    public String getDictText() {
        return dictText;
    }

    public void setDictText(String dictText) {
        this.dictText = dictText == null ? null : dictText.trim();
    }

    public String getDictGroupId() {
        return dictGroupId;
    }

    public void setDictGroupId(String dictGroupId) {
        this.dictGroupId = dictGroupId == null ? null : dictGroupId.trim();
    }

    public Integer getDictOrderNum() {
        return dictOrderNum;
    }

    public void setDictOrderNum(Integer dictOrderNum) {
        this.dictOrderNum = dictOrderNum;
    }

    public Date getDictCreateTime() {
        return dictCreateTime;
    }

    public void setDictCreateTime(Date dictCreateTime) {
        this.dictCreateTime = dictCreateTime;
    }

    public String getDictParentId() {
        return dictParentId;
    }

    public void setDictParentId(String dictParentId) {
        this.dictParentId = dictParentId == null ? null : dictParentId.trim();
    }

    public String getDictParentIdlist() {
        return dictParentIdlist;
    }

    public void setDictParentIdlist(String dictParentIdlist) {
        this.dictParentIdlist = dictParentIdlist == null ? null : dictParentIdlist.trim();
    }

    public String getDictIssystem() {
        return dictIssystem;
    }

    public void setDictIssystem(String dictIssystem) {
        this.dictIssystem = dictIssystem == null ? null : dictIssystem.trim();
    }

    public String getDictDelEnable() {
        return dictDelEnable;
    }

    public void setDictDelEnable(String dictDelEnable) {
        this.dictDelEnable = dictDelEnable == null ? null : dictDelEnable.trim();
    }

    public String getDictStatus() {
        return dictStatus;
    }

    public void setDictStatus(String dictStatus) {
        this.dictStatus = dictStatus == null ? null : dictStatus.trim();
    }

    public String getDictIsSelected() {
        return dictIsSelected;
    }

    public void setDictIsSelected(String dictIsSelected) {
        this.dictIsSelected = dictIsSelected == null ? null : dictIsSelected.trim();
    }

    public String getDictDesc() {
        return dictDesc;
    }

    public void setDictDesc(String dictDesc) {
        this.dictDesc = dictDesc == null ? null : dictDesc.trim();
    }

    public Integer getDictChildCount() {
        return dictChildCount;
    }

    public void setDictChildCount(Integer dictChildCount) {
        this.dictChildCount = dictChildCount;
    }

    public String getDictExAttr1() {
        return dictExAttr1;
    }

    public void setDictExAttr1(String dictExAttr1) {
        this.dictExAttr1 = dictExAttr1 == null ? null : dictExAttr1.trim();
    }

    public String getDictExAttr2() {
        return dictExAttr2;
    }

    public void setDictExAttr2(String dictExAttr2) {
        this.dictExAttr2 = dictExAttr2 == null ? null : dictExAttr2.trim();
    }

    public String getDictExAttr3() {
        return dictExAttr3;
    }

    public void setDictExAttr3(String dictExAttr3) {
        this.dictExAttr3 = dictExAttr3 == null ? null : dictExAttr3.trim();
    }

    public String getDictExAttr4() {
        return dictExAttr4;
    }

    public void setDictExAttr4(String dictExAttr4) {
        this.dictExAttr4 = dictExAttr4 == null ? null : dictExAttr4.trim();
    }

    public String getDictUserId() {
        return dictUserId;
    }

    public void setDictUserId(String dictUserId) {
        this.dictUserId = dictUserId == null ? null : dictUserId.trim();
    }

    public String getDictUserName() {
        return dictUserName;
    }

    public void setDictUserName(String dictUserName) {
        this.dictUserName = dictUserName == null ? null : dictUserName.trim();
    }

    public String getDictOrganId() {
        return dictOrganId;
    }

    public void setDictOrganId(String dictOrganId) {
        this.dictOrganId = dictOrganId == null ? null : dictOrganId.trim();
    }

    public String getDictOrganName() {
        return dictOrganName;
    }

    public void setDictOrganName(String dictOrganName) {
        this.dictOrganName = dictOrganName == null ? null : dictOrganName.trim();
    }
}