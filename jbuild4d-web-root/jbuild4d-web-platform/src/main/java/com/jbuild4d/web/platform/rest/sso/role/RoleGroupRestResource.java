package com.jbuild4d.web.platform.rest.sso.role;

import com.jbuild4d.base.dbaccess.dbentities.sso.RoleGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.sso.service.IRoleGroupService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;

public class RoleGroupRestResource extends GeneralRestResource<RoleGroupEntity> {

    @Autowired
    IRoleGroupService roleGroupService;

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "单点登录-角色组管理";
    }

    @Override
    protected IBaseService<RoleGroupEntity> getBaseService() {
        return roleGroupService;
    }

}
