package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentEntity;

import java.util.List;

public interface DepartmentMapper extends BaseMapper<DepartmentEntity> {
    int existOrganRootDept(String organId);

    DepartmentEntity selectOrganRootDepartment(String organId);

    List<DepartmentEntity> selectDepartmentsByOrganId(String organId);

    int existChildsDepartment(String id);
}
