package com.jbuild4d.platform.sso.service;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserEntity;
import com.jbuild4d.base.service.IBaseService;

public interface IUserService extends IBaseService<UserEntity> {
    public static final String USER_TYPE_MANAGER = "平台管理员";
    public static final String USER_TYPE_ORGAN_ADMIN = "组织管理员";
    public static final String USER_TYPE_NORMAL_USER="一般用户";

    UserEntity getByAccount(String userAccount);

    PageInfo<UserEntity> getBindRoleUsers(String roleId,int pageNum,int pageSize);
}
