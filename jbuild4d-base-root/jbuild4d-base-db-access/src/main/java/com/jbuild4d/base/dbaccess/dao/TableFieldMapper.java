package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableFieldEntity;
import org.apache.ibatis.annotations.Param;

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

    TableFieldEntity selectLessThanRecord(@Param("fieldId") String id,@Param("fieldTableId") String fieldTableId);

    TableFieldEntity selectGreaterThanRecord(@Param("fieldId") String id,@Param("fieldTableId") String fieldTableId);

    List<TableFieldEntity> selectByTableName(String rtTableName);
}
