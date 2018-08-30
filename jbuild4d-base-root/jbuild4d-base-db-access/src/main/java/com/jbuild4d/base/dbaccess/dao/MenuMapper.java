package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.system.MenuEntity;

public interface MenuMapper extends BaseMapper<MenuEntity>{
    MenuEntity selectLessThanRecord(String id);

    MenuEntity selectGreaterThanRecord(String id);
}