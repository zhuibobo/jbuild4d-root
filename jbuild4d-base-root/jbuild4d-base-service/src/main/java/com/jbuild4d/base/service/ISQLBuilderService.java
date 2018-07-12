package com.jbuild4d.base.service;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/11
 * To change this template use File | Settings | File Templates.
 */
public interface ISQLBuilderService {
    Map<String,Object> selectOne(String s, Object value);
}
