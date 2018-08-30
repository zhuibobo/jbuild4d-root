package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.system.DictionaryGroupEntity;

import java.util.List;

public interface DictionaryGroupMapper extends BaseMapper<DictionaryGroupEntity>{
    List<DictionaryGroupEntity> selectChilds(String id);

    DictionaryGroupEntity selectByValue(String dictGroupValue);
}