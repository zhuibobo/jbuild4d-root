package com.jbuild4d.platform.sso.service;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentUserEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.sso.vo.DepartmentUserVo;

import java.util.List;
import java.util.Map;

public interface IDepartmentUserService {
    int save(JB4DSession jb4DSession, String id, DepartmentUserVo record,String accountPassword) throws JBuild4DGenerallyException;

    DepartmentUserVo getEmptyNewVo(JB4DSession jb4DSession, String departmentId) throws JBuild4DGenerallyException;

    boolean existUserInDepartment(JB4DSession jb4DSession, String departmentId);

    DepartmentUserVo getVo(JB4DSession jb4DSession, String departmentUserId) throws JBuild4DGenerallyException;

    PageInfo<List<Map<String, Object>>> getDepartmentUser(JB4DSession jb4DSession, Integer pageNum, Integer pageSize, String departmentId, Map<String, Object> searchMap);
}