package com.jbuild4d.base.service.impl;

import com.jbuild4d.base.dbaccess.dynamic.GeneralMapper;
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
public class GeneralServiceImpl implements IGeneralService {

    GeneralMapper generalMapper;
    protected SqlSessionTemplate sqlSessionTemplate;

    public GeneralServiceImpl(GeneralMapper _generalMapper, SqlSessionTemplate _sqlSessionTemplate){
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

    /*@Override
    public Long nextOrderNum(String tableName, String orderFieldName) throws JBuild4DGenerallyException {
        if (!SQLKeyWordUtility.validateSqlInjectForSelectOnly(tableName)) {
            if (!SQLKeyWordUtility.validateSqlInjectForSelectOnly(orderFieldName)) {
                return generalMapper.nextOrderNum(tableName, orderFieldName);
            } else {
                throw new JBuild4DGenerallyException("存在SQL关键字:" + orderFieldName);
            }
        } else {
            throw new JBuild4DGenerallyException("存在SQL关键字:" + tableName);
        }
    }*/

    @Override
    public Object executeScalarSql(String sql) {
        return generalMapper.executeScalarSql(sql);
    }
}
