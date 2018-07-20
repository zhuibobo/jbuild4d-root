package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;

import java.util.List;

public interface DictionaryGroupMapper extends BaseMapper<DictionaryGroupEntity>{
    List<DictionaryGroupEntity> selectChilds(String id);
}