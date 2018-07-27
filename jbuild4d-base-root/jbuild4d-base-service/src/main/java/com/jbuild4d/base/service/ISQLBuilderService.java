package com.jbuild4d.base.service;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/11
 * To change this template use File | Settings | File Templates.
 */
public interface ISQLBuilderService {
    Map<String,Object> selectOne(String sql, Object value);

    List<Map<String,Object>> selectList(String sql,Map paras);

    List<Map<String,Object>> selectList(String sql,String value);

    List<Map<String,Object>> selectList(String sql);
}
