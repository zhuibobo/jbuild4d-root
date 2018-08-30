package com.jbuild4d.platform.system.service;

import com.jbuild4d.base.dbaccess.dbentities.builder.MenuEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

public interface IMenuService extends IBaseService<MenuEntity> {
    void initSystemData(JB4DSession jb4DSession) throws JBuild4DGenerallyException;
}
