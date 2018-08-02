package com.jbuild4d.base.service;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */
public interface IGeneralService {

    List<Map> executeSql(String sql);

    List<Map> executeSqlMap(Map map);

    Long nextOrderNum(String tableName,String orderFieldName) throws JBuild4DGenerallyException;

    Object executeScalarSql(String sql);
}
