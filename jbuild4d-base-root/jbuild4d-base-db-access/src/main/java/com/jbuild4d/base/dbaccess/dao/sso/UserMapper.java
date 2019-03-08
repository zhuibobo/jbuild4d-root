package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserEntity;

import java.util.List;

public interface UserMapper extends BaseMapper<UserEntity> {
    UserEntity selectByAccount(String userAccount);

    List<UserEntity> selectBindRoleUsers(String roleId);
}
