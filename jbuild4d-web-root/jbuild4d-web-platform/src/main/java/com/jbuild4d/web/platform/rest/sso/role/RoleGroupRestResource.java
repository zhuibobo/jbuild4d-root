package com.jbuild4d.web.platform.rest.sso.role;

import com.jbuild4d.base.dbaccess.dbentities.sso.RoleGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.sso.service.IRoleGroupService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/RoleGroup")
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

    @RequestMapping(value = "GetTreeData", method = RequestMethod.POST)
    public List<RoleGroupEntity> getTreeData() {
        List<RoleGroupEntity> datasetGroupEntityList=roleGroupService.getALLOrderByAsc(JB4DSessionUtility.getSession());
        return datasetGroupEntityList;
    }
}
