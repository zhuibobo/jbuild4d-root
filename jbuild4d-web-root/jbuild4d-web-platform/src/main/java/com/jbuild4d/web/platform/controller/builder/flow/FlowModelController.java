package com.jbuild4d.web.platform.controller.builder.flow;

import com.jbuild4d.base.dbaccess.dbentities.builder.FlowModelEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.builder.flow.IFlowModelService;
import com.jbuild4d.platform.builder.flow.IFlowModelerConfigService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping(value = "/PlatForm/Builder/FlowModel")
public class FlowModelController extends GeneralCRUDImplController<FlowModelEntity> {

    @Autowired
    IFlowModelService flowModelService;

    /*@Autowired
    IFlowModelerConfigService flowModelerConfigService;*/

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

    @RequestMapping(value = "NewModel")
    @ResponseBody
    public JBuild4DResponseVo newModel(@RequestBody FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException {
        FlowModelEntity _flowModelEntity=flowModelService.newModel(JB4DSessionUtility.getSession(),flowModelEntity);
        String editModelWebUrl=flowModelService.buildEditModelWebUrl(_flowModelEntity);
        Map<String,Object> result=new HashedMap();
        result.put("editModelWebUrl",editModelWebUrl);
        result.put("flowModelEntity",_flowModelEntity);
        return JBuild4DResponseVo.success("新建流程模型成功!",result);
    }

    @RequestMapping(value = "EditModel")
    @ResponseBody
    public JBuild4DResponseVo editModel(String modelId) throws JBuild4DGenerallyException {
        FlowModelEntity _flowModelEntity=flowModelService.getByPrimaryKey(JB4DSessionUtility.getSession(),modelId);
        String editModelWebUrl=flowModelService.buildEditModelWebUrl(_flowModelEntity);
        Map<String,Object> result=new HashedMap();
        result.put("editModelWebUrl",editModelWebUrl);
        result.put("flowModelEntity",_flowModelEntity);
        return JBuild4DResponseVo.success("获取数据成功!",result);
    }
}
