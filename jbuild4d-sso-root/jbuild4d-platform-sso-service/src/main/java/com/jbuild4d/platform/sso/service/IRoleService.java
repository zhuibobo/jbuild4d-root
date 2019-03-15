package com.jbuild4d.platform.sso.service;

import com.jbuild4d.base.dbaccess.dbentities.sso.RoleEntity;
import com.jbuild4d.base.service.IBaseService;

public interface IRoleService extends IBaseService<RoleEntity> {
    int countInRoleGroup(String groupId);
}