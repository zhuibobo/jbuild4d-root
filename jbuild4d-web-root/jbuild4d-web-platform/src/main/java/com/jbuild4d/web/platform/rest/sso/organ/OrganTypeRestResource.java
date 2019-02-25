package com.jbuild4d.web.platform.rest.sso.organ;

import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganTypeEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.sso.service.IOrganTypeService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/OrganType")
public class OrganTypeRestResource extends GeneralRestResource<OrganTypeEntity> {

    @Autowired
    IOrganTypeService organTypeService;

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "单点登录系统-组织类型管理";
    }

    @Override
    protected IBaseService<OrganTypeEntity> getBaseService() {
        return organTypeService;
    }
}
