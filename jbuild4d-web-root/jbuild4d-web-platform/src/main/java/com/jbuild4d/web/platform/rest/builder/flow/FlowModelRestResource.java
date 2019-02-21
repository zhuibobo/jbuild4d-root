package com.jbuild4d.web.platform.rest.builder.flow;


import com.jbuild4d.base.dbaccess.dbentities.builder.FlowModelEntity;
import com.jbuild4d.base.dbaccess.dbentities.files.FileInfoEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.platform.builder.flow.IFlowModelService;
import com.jbuild4d.platform.files.service.IFileInfoService;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@RestController
@RequestMapping(value = "/PlatForm/Builder/FlowModel")
public class FlowModelRestResource extends GeneralRestResource<FlowModelEntity> {

    @Autowired
    IFlowModelService flowModelService;

    @Autowired
    IFileInfoService fileInfoService;

    @Autowired
    IJb4dCacheService jb4dCacheService;

    /*@Autowired
    IFlowModelerConfigService flowModelerConfigService;*/

    @Override
    protected IBaseService<FlowModelEntity> getBaseService() {
        return flowModelService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "模块设计-流程模型";
    }

    @RequestMapping(value = "/ImportProcessModel", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public JBuild4DResponseVo importProcessModel(HttpServletRequest request, String modelModuleId, @RequestParam("file") MultipartFile file) throws JBuild4DGenerallyException, XMLStreamException, IOException {
        FlowModelEntity _flowModelEntity=flowModelService.importNewModel(JB4DSessionUtility.getSession(),modelModuleId,file);
        String editModelWebUrl = flowModelService.buildEditModelWebUrl(_flowModelEntity);
        Map<String, Object> result = new HashedMap();
        result.put("editModelWebUrl", editModelWebUrl);
        result.put("flowModelEntity", _flowModelEntity);
        return JBuild4DResponseVo.success("导入流程模型成功!", result);
    }

    @RequestMapping(value = "/UploadProcessModelMainImg", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public JBuild4DResponseVo uploadProcessModelMainImg(HttpServletRequest request, @RequestParam("file") MultipartFile file) throws IOException {
        FileInfoEntity fileInfoEntity=fileInfoService.addSmallFileToDB(JB4DSessionUtility.getSession(),file);
        return JBuild4DResponseVo.success(JBuild4DResponseVo.SUCCESSMSG,fileInfoEntity);
    }

    @RequestMapping(value = "/GetProcessModelMainImg", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    @ResponseBody
    public byte[] getProcessModelMainImg(String fileId) throws IOException, JBuild4DGenerallyException {
        FileInfoEntity fileInfoEntity=fileInfoService.getByPrimaryKey(JB4DSessionUtility.getSession(),fileId);
        if(fileInfoEntity==null) {
            String cacheKey = "ProcessModelMainImage";
            if (JB4DCacheManager.exist(JB4DCacheManager.jb4dPlatformBuilderCacheName, cacheKey)) {
                return JB4DCacheManager.getObject(JB4DCacheManager.jb4dPlatformBuilderCacheName, cacheKey);
            } else {
                InputStream is = this.getClass().getResourceAsStream("/static/Themes/Default/Css/Images/DefaultModel.png");
                byte[] defaultImageByte = IOUtils.toByteArray(is);
                is.close();
                JB4DCacheManager.put(JB4DCacheManager.jb4dPlatformBuilderCacheName, cacheKey, defaultImageByte);
                return defaultImageByte;
            }
        }
        else{
            return fileInfoService.getContent(fileId);
        }
    }

    @RequestMapping(value = "/SaveModel")
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

    @RequestMapping(value = "/DeleteModel")
    @ResponseBody
    public JBuild4DResponseVo deleteModel(String recordId) throws JBuild4DGenerallyException {
        flowModelService.deleteByKey(JB4DSessionUtility.getSession(),recordId);
        return JBuild4DResponseVo.success("删除模型成功");
    }

    @RequestMapping(value = "/GetEditModelURL")
    @ResponseBody
    public JBuild4DResponseVo getEditModelURL(String modelId) throws JBuild4DGenerallyException {
        FlowModelEntity _flowModelEntity=flowModelService.getByPrimaryKey(JB4DSessionUtility.getSession(),modelId);
        String editModelWebUrl=flowModelService.buildEditModelWebUrl(_flowModelEntity);
        Map<String,Object> result=new HashedMap();
        result.put("editModelWebUrl",editModelWebUrl);
        result.put("flowModelEntity",_flowModelEntity);
        return JBuild4DResponseVo.success("获取数据成功!",result);
    }

    @RequestMapping(value = "/GetViewModelURL")
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
