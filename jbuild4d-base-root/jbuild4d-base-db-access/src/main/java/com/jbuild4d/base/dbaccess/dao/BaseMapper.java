package com.jbuild4d.base.dbaccess.dao;

import java.util.List;
import java.util.Map;

/**
 * @Author: zhuangrb
 * @Date: 2018/4/5
 * @Description:
 * @Version 1.0.0
 */
public interface BaseMapper<T> {
    int deleteByPrimaryKey(String id);

    int deleteByPrimaryStringKey(String id);

    int insert(T record);

    int insertSelective(T record);

    T selectByPrimaryKey(int id);

    T selectByPrimaryKey(String id);

    T selectByPrimaryStringKey(String id);

    int updateByPrimaryKeySelective(T record);

    int updateByPrimaryKey(T record);

    int deleteAll();

    List<T> selectAll();

    List<T> searchByMap(Map<String, Object> searchItemMap);

    int count();

    int nextId();

    int nextOrderNum();
}
