package com.jbuild4d.base.service.impl;

import com.jbuild4d.base.dbaccess.dao.GeneralMapper;
import com.jbuild4d.base.service.IGeneralService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.SQLKeyWordUtility;
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
    protected SqlSessionTemplate sqlSessionTemplate;

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
    public Long nextOrderNum(String tableName, String orderFieldName) throws JBuild4DGenerallyException {
        if (SQLKeyWordUtility.ValidateSqlInjectForSelectOnly(tableName)) {
            if (SQLKeyWordUtility.ValidateSqlInjectForSelectOnly(orderFieldName)) {
                return generalMapper.nextOrderNum(tableName, orderFieldName);
            } else {
                throw new JBuild4DGenerallyException("存在SQL关键字:" + orderFieldName);
            }
        } else {
            throw new JBuild4DGenerallyException("存在SQL关键字:" + tableName);
        }
    }
}
