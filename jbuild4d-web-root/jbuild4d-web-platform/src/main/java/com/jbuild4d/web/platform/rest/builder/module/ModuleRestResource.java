package com.jbuild4d.web.platform.rest.builder.module;

import com.jbuild4d.base.dbaccess.dbentities.builder.ModuleEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.builder.module.IModuleService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/Module")
public class ModuleRestResource extends GeneralRestResource<ModuleEntity> {
    @Autowired
    IModuleService moduleService;

    @Override
    protected IBaseService<ModuleEntity> getBaseService() {
        return moduleService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "模块设计";
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public List<ModuleEntity> getTreeData() {
        List<ModuleEntity> moduleEntityList=moduleService.getALL(JB4DSessionUtility.getSession());
        return moduleEntityList;
    }
}
