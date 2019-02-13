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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
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

    @RequestMapping(value = "/ImportProcessModel", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public JBuild4DResponseVo importProcessModel(HttpServletRequest request,String modelModuleId, @RequestParam("file") MultipartFile file) throws JBuild4DGenerallyException, XMLStreamException, IOException {
        FlowModelEntity _flowModelEntity=flowModelService.importNewModel(JB4DSessionUtility.getSession(),modelModuleId,file);
        String editModelWebUrl = flowModelService.buildEditModelWebUrl(_flowModelEntity);
        Map<String, Object> result = new HashedMap();
        result.put("editModelWebUrl", editModelWebUrl);
        result.put("flowModelEntity", _flowModelEntity);
        return JBuild4DResponseVo.success("导入流程模型成功!", result);
    }

    @RequestMapping(value = "SaveModel")
    @ResponseBody
    public JBuild4DResponseVo saveModel(@RequestBody FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException {
        FlowModelEntity _flowModelEntity = null;
        if (flowModelEntity.getModelId().equals("")) {
            _flowModelEntity=flowModelService.newModel(JB4DSessionUtility.getSession(), flowModelEntity);
        }
        else {
            _flowModelEntity=flowModelService.updateModel(JB4DSessionUtility.getSession(), flowModelEntity);
        }
        String editModelWebUrl = flowModelService.buildEditModelWebUrl(_flowModelEntity);
        Map<String, Object> result = new HashedMap();
        result.put("editModelWebUrl", editModelWebUrl);
        result.put("flowModelEntity", _flowModelEntity);
        return JBuild4DResponseVo.success("保存流程模型成功!", result);
    }

    @RequestMapping(value = "DeleteModel")
    @ResponseBody
    public JBuild4DResponseVo deleteModel(String recordId) throws JBuild4DGenerallyException {
        flowModelService.deleteByKey(JB4DSessionUtility.getSession(),recordId);
        return JBuild4DResponseVo.success("删除模型成功");
    }

    @RequestMapping(value = "GetEditModelURL")
    @ResponseBody
    public JBuild4DResponseVo getEditModelURL(String modelId) throws JBuild4DGenerallyException {
        FlowModelEntity _flowModelEntity=flowModelService.getByPrimaryKey(JB4DSessionUtility.getSession(),modelId);
        String editModelWebUrl=flowModelService.buildEditModelWebUrl(_flowModelEntity);
        Map<String,Object> result=new HashedMap();
        result.put("editModelWebUrl",editModelWebUrl);
        result.put("flowModelEntity",_flowModelEntity);
        return JBuild4DResponseVo.success("获取数据成功!",result);
    }

    @RequestMapping(value = "GetViewModelURL")
    @ResponseBody
    public JBuild4DResponseVo getViewModelURL(String modelId) throws JBuild4DGenerallyException {
        FlowModelEntity _flowModelEntity=flowModelService.getByPrimaryKey(JB4DSessionUtility.getSession(),modelId);
        String editModelWebUrl=flowModelService.buildViewModelWebUrl(_flowModelEntity);
        Map<String,Object> result=new HashedMap();
        result.put("editModelWebUrl",editModelWebUrl);
        result.put("flowModelEntity",_flowModelEntity);
        return JBuild4DResponseVo.success("获取数据成功!",result);
    }
}
