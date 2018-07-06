package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dao.GeneralMapper;
import com.jbuild4d.base.dbaccess.dao.MenuMapper;
import com.jbuild4d.base.dbaccess.dbentities.MenuEntity;
import com.jbuild4d.base.service.IGeneralService;
import com.jbuild4d.base.service.impl.BaseService;
import com.jbuild4d.base.service.impl.GeneralService;
import com.jbuild4d.platform.system.service.IMenuService;
import org.mybatis.spring.SqlSessionTemplate;

public class MenuServiceImpl extends BaseService<MenuEntity> implements IMenuService {

    MenuMapper menuMapper;

    public MenuServiceImpl(MenuMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, IGeneralService _generalService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _generalService);
        menuMapper=_defaultBaseMapper;
    }
}
