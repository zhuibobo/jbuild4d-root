package com.jbuild4d.web.platform.controller.builder.form;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.base.dbaccess.dbentities.builder.ModuleEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.webformdesign.IFormResourceService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/Form")
public class FormController extends GeneralCRUDImplController<FormResourceEntityWithBLOBs> {

    @Autowired
    IFormResourceService formResourceService;

    @Override
    protected IBaseService<FormResourceEntityWithBLOBs> getBaseService() {
        return formResourceService;
    }

    @Override
    public String getListViewName() {
        return null;
    }

    @Override
    public String getDetailViewName() {
        return "Builder/Form/FormDesign";
    }

    @Override
    public String getjBuild4DSystemName() {
        return null;
    }

    @Override
    public String getModuleName() {
        return "模块设计-Web表单设计";
    }
}
