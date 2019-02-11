package com.jbuild4d.web.platform.controller.builder.flow;

import com.jbuild4d.base.dbaccess.dbentities.builder.FlowModelEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.flow.IFlowModelService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/PlatForm/Builder/FlowModel")
public class FlowModelController extends GeneralCRUDImplController<FlowModelEntity> {

    @Autowired
    IFlowModelService flowModelService;

    @Override
    protected IBaseService<FlowModelEntity> getBaseService() {
        return flowModelService;
    }

    @Override
    public String getListViewName() {
        return null;
    }

    @Override
    public String getDetailViewName() {
        return "Builder/Flow/FlowModelDesign";
    }

    @Override
    public String getjBuild4DSystemName() {
        return null;
    }

    @Override
    public String getModuleName() {
        return "模块设计-流程模型";
    }

    @RequestMapping(value = "")
    @ResponseBody
    public JBuild4DResponseVo newModel(FlowModelEntity flowModelEntity){

        return JBuild4DResponseVo.success("新建流程模型成功!");
    }
}
