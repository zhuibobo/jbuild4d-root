package com.jbuild4d.web.platform.rest.sso.role;

import com.jbuild4d.base.dbaccess.dbentities.sso.RoleEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.sso.service.IRoleService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/Role")
public class RoleRestResource extends GeneralRestResource<RoleEntity> {
    @Autowired
    IRoleService roleService;

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "单点登录-角色管理";
    }

    @Override
    protected IBaseService<RoleEntity> getBaseService() {
        return roleService;
    }
}
