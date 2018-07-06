package com.jbuild4d.base.service.impl;

import com.jbuild4d.base.dbaccess.dao.GeneralMapper;
import com.jbuild4d.base.service.IGeneralService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */
public class GeneralService implements IGeneralService {

    GeneralMapper generalMapper;
    protected SqlSessionTemplate sqlSessionTemplate = null;

    public GeneralService(GeneralMapper _generalMapper,SqlSessionTemplate _sqlSessionTemplate){
        generalMapper=_generalMapper;
        sqlSessionTemplate=_sqlSessionTemplate;
    }

    @Override
    public List<Map> executeSql(String sql) {
        return generalMapper.executeSql(sql);
    }

    @Override
    public List<Map> executeSqlMap(Map map) {
        return generalMapper.executeSqlMap(map);
    }

    @Override
    public Long nextOrderNum(String tableName, String orderFieldName) {
        return generalMapper.nextOrderNum(tableName,orderFieldName);
    }

    @Override
    public void changeStatus(String tableName, String fieldName, String status) {

    }
}
