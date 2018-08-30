package com.jbuild4d.base.dbaccess.dao.system;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.system.MenuEntity;

public interface MenuMapper extends BaseMapper<MenuEntity> {
    MenuEntity selectLessThanRecord(String id);

    MenuEntity selectGreaterThanRecord(String id);
}