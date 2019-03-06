package com.jbuild4d.platform.sso.service;

import com.jbuild4d.base.dbaccess.dbentities.sso.RoleGroupEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

import java.util.List;

public interface IRoleGroupService extends IBaseService<RoleGroupEntity> {
    void initSystemData(JB4DSession jb4DSession) throws JBuild4DGenerallyException;

    List<RoleGroupEntity> getALLOrderByAsc(JB4DSession session);
}
