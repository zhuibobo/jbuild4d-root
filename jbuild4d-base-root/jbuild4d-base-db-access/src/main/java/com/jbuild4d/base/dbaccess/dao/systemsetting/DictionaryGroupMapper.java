package com.jbuild4d.base.dbaccess.dao.systemsetting;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.DictionaryGroupEntity;

import java.util.List;

public interface DictionaryGroupMapper extends BaseMapper<DictionaryGroupEntity> {
    List<DictionaryGroupEntity> selectChilds(String id);

    DictionaryGroupEntity selectByValue(String dictGroupValue);
}