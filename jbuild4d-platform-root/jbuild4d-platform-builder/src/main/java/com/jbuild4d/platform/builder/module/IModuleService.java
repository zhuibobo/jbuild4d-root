package com.jbuild4d.platform.builder.module;

import com.jbuild4d.base.dbaccess.dbentities.builder.ModuleEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.session.JB4DSession;

public interface IModuleService extends IBaseService<ModuleEntity> {
    String getRootId();

    ModuleEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException;

    String buildModuleItemCode(int num);
}
