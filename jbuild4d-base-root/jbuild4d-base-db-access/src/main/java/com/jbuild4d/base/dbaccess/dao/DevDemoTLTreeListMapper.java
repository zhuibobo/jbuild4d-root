package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoTLTreeListEntity;

public interface DevDemoTLTreeListMapper {
    int deleteByPrimaryKey(String ddtlId);

    int insert(DevDemoTLTreeListEntity record);

    int insertSelective(DevDemoTLTreeListEntity record);

    DevDemoTLTreeListEntity selectByPrimaryKey(String ddtlId);

    int updateByPrimaryKeySelective(DevDemoTLTreeListEntity record);

    int updateByPrimaryKey(DevDemoTLTreeListEntity record);
}