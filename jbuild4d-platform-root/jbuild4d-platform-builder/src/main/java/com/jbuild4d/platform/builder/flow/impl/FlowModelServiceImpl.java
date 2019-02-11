package com.jbuild4d.platform.builder.flow.impl;

import com.jbuild4d.base.dbaccess.dao.builder.FlowModelMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.FlowModelEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.flow.IFlowModelService;
import com.jbuild4d.platform.builder.flow.IFlowModelerConfigService;
import com.jbuild4d.platform.builder.service.IModuleService;
import com.jbuild4d.platform.builder.vo.DeModelVo;
import com.jbuild4d.platform.builder.vo.FlowModelerConfigVo;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Date;

public class FlowModelServiceImpl extends BaseServiceImpl<FlowModelEntity> implements IFlowModelService
{
    FlowModelMapper flowModelMapper;
    RestTemplate restTemplate;
    IFlowModelerConfigService flowModelerConfigService;
    IModuleService moduleService;

    public FlowModelServiceImpl(FlowModelMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate,
                                ISQLBuilderService _sqlBuilderService,RestTemplate _restTemplate,
                                IFlowModelerConfigService _flowModelerConfigService,IModuleService _moduleService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        flowModelMapper=_defaultBaseMapper;
        restTemplate=_restTemplate;
        flowModelerConfigService=_flowModelerConfigService;
        moduleService=_moduleService;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, FlowModelEntity record) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("请调用newModel或者updateModel方法!");
        /*return super.save(jb4DSession,id, record, new IAddBefore<FlowModelEntity>() {
            @Override
            public FlowModelEntity run(JB4DSession jb4DSession,FlowModelEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });*/
    }

    @Override
    public FlowModelEntity newModel(JB4DSession jb4DSession,FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException {
        FlowModelerConfigVo configVo=flowModelerConfigService.getVoFromCache();
        String url=configVo.getBaseUrl()+configVo.getNewModelRest();

        DeModelVo deModelVo=new DeModelVo();
        deModelVo.setName(flowModelEntity.getModelName());
        deModelVo.setKey(flowModelEntity.getModelStartKey());
        deModelVo.setDescription(flowModelEntity.getModelDesc());
        deModelVo.setModelType(0);
        try {
            ResponseEntity<DeModelVo> responseEntity = restTemplate.postForEntity(url, deModelVo, DeModelVo.class);
            deModelVo=responseEntity.getBody();
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException("调用REST接口失败!"+ex.getMessage());
        }

        flowModelEntity.setModelId(deModelVo.getId());
        flowModelEntity.setModelDeId(deModelVo.getId());
        flowModelEntity.setModelCreater(jb4DSession.getUserName());
        flowModelEntity.setModelCreateTime(new Date());
        flowModelEntity.setModelFromType("Web设计");
        flowModelEntity.setModelUpdater(jb4DSession.getUserName());
        flowModelEntity.setModelUpdateTime(new Date());
        flowModelEntity.setModelOrderNum(flowModelMapper.nextOrderNum());
        flowModelEntity.setModelCode(moduleService.buildModuleItemCode(flowModelEntity.getModelOrderNum()));

        flowModelMapper.insert(flowModelEntity);
        return flowModelEntity;
    }

    @Override
    public String buildEditModelWebUrl(FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException {
        FlowModelerConfigVo configVo=flowModelerConfigService.getVoFromCache();
        String url=configVo.getBaseUrl()+"#"+"/editor/"+flowModelEntity.getModelDeId();
        return url;
    }
}
