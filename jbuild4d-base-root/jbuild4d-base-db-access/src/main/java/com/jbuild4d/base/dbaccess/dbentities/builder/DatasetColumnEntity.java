package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :nullTBUILD_DATASET_COLUMN
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class DatasetColumnEntity {
    //COLUMN_ID:主键:UUID
    @DBKeyField
    private String columnId;

    //COLUMN_DS_ID:所属数据集ID
    private String columnDsId;

    //COLUMN_CAPTION:列标题
    private String columnCaption;

    //COLUMN_NAME:列名
    private String columnName;

    //COLUMN_DATA_TYPE_NAME:数据类型
    private String columnDataTypeName;

    //COLUMN_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date columnCreateTime;

    //COLUMN_CREATER:创建人
    private String columnCreater;

    //COLUMN_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date columnUpdateTime;

    //COLUMN_UPDATER:更新人
    private String columnUpdater;

    //COLUMN_DESC:备注
    private String columnDesc;

    //COLUMN_DEFAULT_TYPE:默认值类型
    private String columnDefaultType;

    //COLUMN_DEFAULT_VALUE:默认值
    private String columnDefaultValue;

    //COLUMN_DEFAULT_TEXT:默认值描述
    private String columnDefaultText;

    //COLUMN_ORDER_NUM:排序号
    private Integer columnOrderNum;

    //COLUMN_TABLE_NAME:所属表名
    private String columnTableName;

    //COLUMN_IS_CUSTOM:是否自定义
    private String columnIsCustom;

    //COLUMN_FORMATTER:格式化方法
    private String columnFormatter;

    public DatasetColumnEntity(String columnId, String columnDsId, String columnCaption, String columnName, String columnDataTypeName, Date columnCreateTime, String columnCreater, Date columnUpdateTime, String columnUpdater, String columnDesc, String columnDefaultType, String columnDefaultValue, String columnDefaultText, Integer columnOrderNum, String columnTableName, String columnIsCustom, String columnFormatter) {
        this.columnId = columnId;
        this.columnDsId = columnDsId;
        this.columnCaption = columnCaption;
        this.columnName = columnName;
        this.columnDataTypeName = columnDataTypeName;
        this.columnCreateTime = columnCreateTime;
        this.columnCreater = columnCreater;
        this.columnUpdateTime = columnUpdateTime;
        this.columnUpdater = columnUpdater;
        this.columnDesc = columnDesc;
        this.columnDefaultType = columnDefaultType;
        this.columnDefaultValue = columnDefaultValue;
        this.columnDefaultText = columnDefaultText;
        this.columnOrderNum = columnOrderNum;
        this.columnTableName = columnTableName;
        this.columnIsCustom = columnIsCustom;
        this.columnFormatter = columnFormatter;
    }

    public DatasetColumnEntity() {
        super();
    }

    public String getColumnId() {
        return columnId;
    }

    public void setColumnId(String columnId) {
        this.columnId = columnId == null ? null : columnId.trim();
    }

    public String getColumnDsId() {
        return columnDsId;
    }

    public void setColumnDsId(String columnDsId) {
        this.columnDsId = columnDsId == null ? null : columnDsId.trim();
    }

    public String getColumnCaption() {
        return columnCaption;
    }

    public void setColumnCaption(String columnCaption) {
        this.columnCaption = columnCaption == null ? null : columnCaption.trim();
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName == null ? null : columnName.trim();
    }

    public String getColumnDataTypeName() {
        return columnDataTypeName;
    }

    public void setColumnDataTypeName(String columnDataTypeName) {
        this.columnDataTypeName = columnDataTypeName == null ? null : columnDataTypeName.trim();
    }

    public Date getColumnCreateTime() {
        return columnCreateTime;
    }

    public void setColumnCreateTime(Date columnCreateTime) {
        this.columnCreateTime = columnCreateTime;
    }

    public String getColumnCreater() {
        return columnCreater;
    }

    public void setColumnCreater(String columnCreater) {
        this.columnCreater = columnCreater == null ? null : columnCreater.trim();
    }

    public Date getColumnUpdateTime() {
        return columnUpdateTime;
    }

    public void setColumnUpdateTime(Date columnUpdateTime) {
        this.columnUpdateTime = columnUpdateTime;
    }

    public String getColumnUpdater() {
        return columnUpdater;
    }

    public void setColumnUpdater(String columnUpdater) {
        this.columnUpdater = columnUpdater == null ? null : columnUpdater.trim();
    }

    public String getColumnDesc() {
        return columnDesc;
    }

    public void setColumnDesc(String columnDesc) {
        this.columnDesc = columnDesc == null ? null : columnDesc.trim();
    }

    public String getColumnDefaultType() {
        return columnDefaultType;
    }

    public void setColumnDefaultType(String columnDefaultType) {
        this.columnDefaultType = columnDefaultType == null ? null : columnDefaultType.trim();
    }

    public String getColumnDefaultValue() {
        return columnDefaultValue;
    }

    public void setColumnDefaultValue(String columnDefaultValue) {
        this.columnDefaultValue = columnDefaultValue == null ? null : columnDefaultValue.trim();
    }

    public String getColumnDefaultText() {
        return columnDefaultText;
    }

    public void setColumnDefaultText(String columnDefaultText) {
        this.columnDefaultText = columnDefaultText == null ? null : columnDefaultText.trim();
    }

    public Integer getColumnOrderNum() {
        return columnOrderNum;
    }

    public void setColumnOrderNum(Integer columnOrderNum) {
        this.columnOrderNum = columnOrderNum;
    }

    public String getColumnTableName() {
        return columnTableName;
    }

    public void setColumnTableName(String columnTableName) {
        this.columnTableName = columnTableName == null ? null : columnTableName.trim();
    }

    public String getColumnIsCustom() {
        return columnIsCustom;
    }

    public void setColumnIsCustom(String columnIsCustom) {
        this.columnIsCustom = columnIsCustom == null ? null : columnIsCustom.trim();
    }

    public String getColumnFormatter() {
        return columnFormatter;
    }

    public void setColumnFormatter(String columnFormatter) {
        this.columnFormatter = columnFormatter == null ? null : columnFormatter.trim();
    }
}