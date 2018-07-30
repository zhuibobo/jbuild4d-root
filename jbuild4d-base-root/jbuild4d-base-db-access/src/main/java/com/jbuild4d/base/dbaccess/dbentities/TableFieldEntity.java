package com.jbuild4d.base.dbaccess.dbentities;

import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table TB4D_TABLE_FIELD
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class TableFieldEntity {
    //FIELD_FIELD_ID
    @DBKeyField
    private String fieldFieldId;

    //FIELD_TABLE_ID
    private String fieldTableId;

    //FIELD_NAME
    private String fieldName;

    //FIELD_CAPTION
    private String fieldCaption;

    //FIELD_IS_PK
    private Integer fieldIsPk;

    //FIELD_ALLOW_NULL
    private String fieldAllowNull;

    //FIELD_DATA_TYPE
    private String fieldDataType;

    //FIELD_DATA_LENGTH
    private Integer fieldDataLength;

    //FIELD_DECIMAL_LENGTH
    private Integer fieldDecimalLength;

    //FIELD_DEFAULT_VALUE
    private String fieldDefaultValue;

    //FIELD_CREATE_TIME
    private Date fieldCreateTime;

    //FIELD_CREATER
    private String fieldCreater;

    //FIELD_UPDATE_TIME
    private Date fieldUpdateTime;

    //FIELD_UPDATER
    private String fieldUpdater;

    //FIELD_DESC
    private String fieldDesc;

    //FIELD_ORDER_NUM
    private Integer fieldOrderNum;

    public TableFieldEntity(String fieldFieldId, String fieldTableId, String fieldName, String fieldCaption, Integer fieldIsPk, String fieldAllowNull, String fieldDataType, Integer fieldDataLength, Integer fieldDecimalLength, String fieldDefaultValue, Date fieldCreateTime, String fieldCreater, Date fieldUpdateTime, String fieldUpdater, String fieldDesc, Integer fieldOrderNum) {
        this.fieldFieldId = fieldFieldId;
        this.fieldTableId = fieldTableId;
        this.fieldName = fieldName;
        this.fieldCaption = fieldCaption;
        this.fieldIsPk = fieldIsPk;
        this.fieldAllowNull = fieldAllowNull;
        this.fieldDataType = fieldDataType;
        this.fieldDataLength = fieldDataLength;
        this.fieldDecimalLength = fieldDecimalLength;
        this.fieldDefaultValue = fieldDefaultValue;
        this.fieldCreateTime = fieldCreateTime;
        this.fieldCreater = fieldCreater;
        this.fieldUpdateTime = fieldUpdateTime;
        this.fieldUpdater = fieldUpdater;
        this.fieldDesc = fieldDesc;
        this.fieldOrderNum = fieldOrderNum;
    }

    public TableFieldEntity() {
        super();
    }

    public String getFieldFieldId() {
        return fieldFieldId;
    }

    public void setFieldFieldId(String fieldFieldId) {
        this.fieldFieldId = fieldFieldId == null ? null : fieldFieldId.trim();
    }

    public String getFieldTableId() {
        return fieldTableId;
    }

    public void setFieldTableId(String fieldTableId) {
        this.fieldTableId = fieldTableId == null ? null : fieldTableId.trim();
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName == null ? null : fieldName.trim();
    }

    public String getFieldCaption() {
        return fieldCaption;
    }

    public void setFieldCaption(String fieldCaption) {
        this.fieldCaption = fieldCaption == null ? null : fieldCaption.trim();
    }

    public Integer getFieldIsPk() {
        return fieldIsPk;
    }

    public void setFieldIsPk(Integer fieldIsPk) {
        this.fieldIsPk = fieldIsPk;
    }

    public String getFieldAllowNull() {
        return fieldAllowNull;
    }

    public void setFieldAllowNull(String fieldAllowNull) {
        this.fieldAllowNull = fieldAllowNull == null ? null : fieldAllowNull.trim();
    }

    public String getFieldDataType() {
        return fieldDataType;
    }

    public void setFieldDataType(String fieldDataType) {
        this.fieldDataType = fieldDataType == null ? null : fieldDataType.trim();
    }

    public Integer getFieldDataLength() {
        return fieldDataLength;
    }

    public void setFieldDataLength(Integer fieldDataLength) {
        this.fieldDataLength = fieldDataLength;
    }

    public Integer getFieldDecimalLength() {
        return fieldDecimalLength;
    }

    public void setFieldDecimalLength(Integer fieldDecimalLength) {
        this.fieldDecimalLength = fieldDecimalLength;
    }

    public String getFieldDefaultValue() {
        return fieldDefaultValue;
    }

    public void setFieldDefaultValue(String fieldDefaultValue) {
        this.fieldDefaultValue = fieldDefaultValue == null ? null : fieldDefaultValue.trim();
    }

    public Date getFieldCreateTime() {
        return fieldCreateTime;
    }

    public void setFieldCreateTime(Date fieldCreateTime) {
        this.fieldCreateTime = fieldCreateTime;
    }

    public String getFieldCreater() {
        return fieldCreater;
    }

    public void setFieldCreater(String fieldCreater) {
        this.fieldCreater = fieldCreater == null ? null : fieldCreater.trim();
    }

    public Date getFieldUpdateTime() {
        return fieldUpdateTime;
    }

    public void setFieldUpdateTime(Date fieldUpdateTime) {
        this.fieldUpdateTime = fieldUpdateTime;
    }

    public String getFieldUpdater() {
        return fieldUpdater;
    }

    public void setFieldUpdater(String fieldUpdater) {
        this.fieldUpdater = fieldUpdater == null ? null : fieldUpdater.trim();
    }

    public String getFieldDesc() {
        return fieldDesc;
    }

    public void setFieldDesc(String fieldDesc) {
        this.fieldDesc = fieldDesc == null ? null : fieldDesc.trim();
    }

    public Integer getFieldOrderNum() {
        return fieldOrderNum;
    }

    public void setFieldOrderNum(Integer fieldOrderNum) {
        this.fieldOrderNum = fieldOrderNum;
    }
}