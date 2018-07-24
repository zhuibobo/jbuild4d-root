package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoTLTreeEntity;

public interface DevDemoTLTreeMapper {
    int deleteByPrimaryKey(String ddttId);

    int insert(DevDemoTLTreeEntity record);

    int insertSelective(DevDemoTLTreeEntity record);

    DevDemoTLTreeEntity selectByPrimaryKey(String ddttId);

    int updateByPrimaryKeySelective(DevDemoTLTreeEntity record);

    int updateByPrimaryKey(DevDemoTLTreeEntity record);
}