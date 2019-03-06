package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.RoleEntity;
import org.apache.ibatis.annotations.Param;

public interface RoleMapper extends BaseMapper<RoleEntity> {

    int countInRoleGroup(String groupId);

    RoleEntity selectGreaterThanRecord(@Param("id") String id, @Param("groupId") String roleGroupId);

    RoleEntity selectLessThanRecord(@Param("id") String id,@Param("groupId") String roleGroupId);
}
