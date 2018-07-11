package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.MenuMapper;
import com.jbuild4d.base.dbaccess.dbentities.MenuEntity;
import com.jbuild4d.base.service.IGeneralService;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IMenuService;
import org.mybatis.spring.SqlSessionTemplate;

public class MenuServiceImplImpl extends BaseServiceImpl<MenuEntity> implements IMenuService {

    MenuMapper menuMapper;

    public MenuServiceImplImpl(MenuMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, IGeneralService _generalService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _generalService);
        menuMapper=_defaultBaseMapper;
    }
}
