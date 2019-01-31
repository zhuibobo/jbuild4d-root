package com.jbuild4d.web.platform.controller.builder.flow;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/PlatForm/Builder/FlowModel")
public class FlowModelController extends GeneralCRUDImplController<FormResourceEntity> {

    @Override
    protected IBaseService<FormResourceEntity> getBaseService() {
        return null;
    }

    @Override
    public String getListViewName() {
        return null;
    }

    @Override
    public String getDetailViewName() {
        return null;
    }

    @Override
    public String getjBuild4DSystemName() {
        return null;
    }

    @Override
    public String getModuleName() {
        return "模块设计-流程模型";
    }
}
