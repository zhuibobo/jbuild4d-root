package com.jbuild4d.platform.sso.service1;

import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.session.JB4DSession;

import java.util.List;

public interface IDepartmentService extends IBaseService<DepartmentEntity> {

    boolean existOrganRootDept(JB4DSession jb4DSession, String organId);

    boolean existChildsDepartment(JB4DSession jb4DSession, String id);

    List<DepartmentEntity> getDepartmentsByOrganId(String organId);

    DepartmentEntity getOrganRootDepartment(JB4DSession jb4DSession, String organId);
}