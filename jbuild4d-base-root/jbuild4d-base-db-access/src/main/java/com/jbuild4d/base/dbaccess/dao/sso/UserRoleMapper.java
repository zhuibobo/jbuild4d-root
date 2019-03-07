package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserRoleEntity;
import org.apache.ibatis.annotations.Param;

public interface UserRoleMapper extends BaseMapper<UserRoleEntity> {
    int bindExist(@Param("roleId") String roleId,@Param("userId")  String userId);
}
