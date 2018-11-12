package com.jbuild4d.platform.builder.service;

import com.jbuild4d.base.dbaccess.dbentities.builder.ModuleEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

public interface IModuleService extends IBaseService<ModuleEntity> {
    ModuleEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException;
}
