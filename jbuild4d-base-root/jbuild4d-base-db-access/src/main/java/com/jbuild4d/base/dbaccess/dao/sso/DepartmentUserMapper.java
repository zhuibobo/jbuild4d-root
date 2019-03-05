package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentUserEntity;

import java.util.List;
import java.util.Map;

public interface DepartmentUserMapper extends BaseMapper<DepartmentUserEntity> {
    int selectDepartmentUserCount(String departmentId);

    List<Map<String, Object>> selectDUByDepartment(Map<String, Object> searchMap);
}
