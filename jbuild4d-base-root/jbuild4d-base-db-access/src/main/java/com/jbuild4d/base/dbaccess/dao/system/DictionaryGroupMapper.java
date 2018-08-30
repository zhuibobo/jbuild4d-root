package com.jbuild4d.base.dbaccess.dao.system;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.system.DictionaryGroupEntity;

import java.util.List;

public interface DictionaryGroupMapper extends BaseMapper<DictionaryGroupEntity> {
    List<DictionaryGroupEntity> selectChilds(String id);

    DictionaryGroupEntity selectByValue(String dictGroupValue);
}