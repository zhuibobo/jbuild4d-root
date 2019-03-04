package com.jbuild4d.web.platform.rest.sso.department;

import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentUserEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.sso.service.IDepartmentService;
import com.jbuild4d.platform.sso.service.IDepartmentUserService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/DepartmentUser")
public class DepartmentUserRestResource extends GeneralRestResource<DepartmentUserEntity> {
    @Autowired
    IDepartmentUserService departmentUserService;

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "部门用户管理";
    }

    @Override
    protected IBaseService<DepartmentUserEntity> getBaseService() {
        return departmentUserService;
    }
}
