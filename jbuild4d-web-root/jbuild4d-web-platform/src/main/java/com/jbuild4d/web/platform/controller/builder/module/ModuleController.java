package com.jbuild4d.web.platform.controller.builder.module;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.ModuleEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.service.IDatasetGroupService;
import com.jbuild4d.platform.builder.service.IModuleService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/12
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/Module")
public class ModuleController extends GeneralCRUDImplController<ModuleEntity> {

    @Autowired
    IModuleService moduleService;

    @Override
    protected IBaseService<ModuleEntity> getBaseService() {
        return moduleService;
    }

    @Override
    public String getListViewName() {
        return "Builder/Module/Manager";
    }

    @Override
    public String getDetailViewName() {
        return "Builder/Module/ModuleEdit";
    }

    @Override
    public String getSubSystemName() {
        return this.subSystemName;
    }

    @Override
    public String getModuleName() {
        return "模块设计";
    }
}
