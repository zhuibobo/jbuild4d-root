package com.jbuild4d.platform.builder.vo;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;

import java.util.List;

public class UpdateTableResolveVo {
    private TableEntity oldTableEntity;
    private TableEntity newTableEntity;

    List<TableFieldVO> deleteFields;
    List<TableFieldVO> newFields;
    List<TableFieldVO> updateFields;

    List<TableFieldVO> newTableFieldVOList;
    List<TableFieldVO> oldTableFieldVOList;

    public TableEntity getOldTableEntity() {
        return oldTableEntity;
    }

    public void setOldTableEntity(TableEntity oldTableEntity) {
        this.oldTableEntity = oldTableEntity;
    }

    public TableEntity getNewTableEntity() {
        return newTableEntity;
    }

    public void setNewTableEntity(TableEntity newTableEntity) {
        this.newTableEntity = newTableEntity;
    }

    public List<TableFieldVO> getDeleteFields() {
        return deleteFields;
    }

    public void setDeleteFields(List<TableFieldVO> deleteFields) {
        this.deleteFields = deleteFields;
    }

    public List<TableFieldVO> getNewFields() {
        return newFields;
    }

    public void setNewFields(List<TableFieldVO> newFields) {
        this.newFields = newFields;
    }

    public List<TableFieldVO> getUpdateFields() {
        return updateFields;
    }

    public void setUpdateFields(List<TableFieldVO> updateFields) {
        this.updateFields = updateFields;
    }

    public List<TableFieldVO> getNewTableFieldVOList() {
        return newTableFieldVOList;
    }

    public void setNewTableFieldVOList(List<TableFieldVO> newTableFieldVOList) {
        this.newTableFieldVOList = newTableFieldVOList;
    }

    public List<TableFieldVO> getOldTableFieldVOList() {
        return oldTableFieldVOList;
    }

    public void setOldTableFieldVOList(List<TableFieldVO> oldTableFieldVOList) {
        this.oldTableFieldVOList = oldTableFieldVOList;
    }
}
