package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface TableFieldMapper extends BaseMapper<TableFieldEntity> {
    List<String> selectFieldTemplateName();

    List<TableFieldEntity> selectTemplateFieldsByName(String templateName);

    void deleteTemplate(String generalTemplateName);

    void deleteByTableId(String tableId);

    List<TableFieldEntity> selectByTableId(String tableId);

    int nextOrderNumInTable(String tableId);

    TableFieldEntity selectLessThanRecord(String id, String fieldTableId);

    TableFieldEntity selectGreaterThanRecord(String id, String fieldTableId);
}
