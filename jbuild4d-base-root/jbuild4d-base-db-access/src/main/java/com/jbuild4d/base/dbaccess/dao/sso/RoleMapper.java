package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.RoleEntity;

public interface RoleMapper extends BaseMapper<RoleEntity> {

    int countInRoleGroup(String groupId);

}
