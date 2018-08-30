package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.MenuEntity;

public interface MenuMapper extends BaseMapper<MenuEntity> {
    MenuEntity selectLessThanRecord(String id);

    MenuEntity selectGreaterThanRecord(String id);
}