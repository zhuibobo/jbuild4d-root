package com.jbuild4d.base.dbaccess.dao.devdemo;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoGenListEntity;

public interface DevDemoGenListMapper extends BaseMapper<DevDemoGenListEntity> {

    DevDemoGenListEntity selectLessThanRecord(String id);

    DevDemoGenListEntity selectGreaterThanRecord(String id);
}