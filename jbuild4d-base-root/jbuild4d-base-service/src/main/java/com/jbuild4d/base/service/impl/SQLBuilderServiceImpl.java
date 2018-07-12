package com.jbuild4d.base.service.impl;

import com.jbuild4d.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jbuild4d.base.service.ISQLBuilderService;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/11
 * To change this template use File | Settings | File Templates.
 */
public class SQLBuilderServiceImpl implements ISQLBuilderService {

    ISQLBuilderMapper sqlBuilderMapper;

    public SQLBuilderServiceImpl(ISQLBuilderMapper sqlBuilderMapper) {
        this.sqlBuilderMapper = sqlBuilderMapper;
    }

    @Override
    public Map<String, Object> selectOne(String s, Object value) {
        return sqlBuilderMapper.selectOne(s,value);
    }
}
