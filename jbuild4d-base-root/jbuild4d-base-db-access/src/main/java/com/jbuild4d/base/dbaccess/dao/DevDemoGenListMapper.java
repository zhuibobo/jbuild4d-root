package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoGenListEntity;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;

public interface DevDemoGenListMapper extends BaseMapper<DevDemoGenListEntity> {

    DevDemoGenListEntity selectLessThanRecord(String id);

    DevDemoGenListEntity selectGreaterThanRecord(String id);
}