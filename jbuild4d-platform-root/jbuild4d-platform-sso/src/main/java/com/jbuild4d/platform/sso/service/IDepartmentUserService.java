package com.jbuild4d.platform.sso.service;

import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentUserEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

public interface IDepartmentUserService extends IBaseService<DepartmentUserEntity> {
    boolean existUserInDepartment(JB4DSession jb4DSession, String departmentId);
}