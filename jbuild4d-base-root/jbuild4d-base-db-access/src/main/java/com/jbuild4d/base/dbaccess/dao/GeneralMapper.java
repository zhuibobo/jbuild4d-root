package com.jbuild4d.base.dbaccess.dao;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface GeneralMapper {
    List<Map> executeSql(String sql);

    List<Map> executeSqlMap(Map map);

    Long nextOrderNum(@Param("TableName") String TableName, @Param("OrderFieldName") String OrderFieldName);

    Object executeScalarSql(String sql);

}

