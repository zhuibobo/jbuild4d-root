package com.jbuild4d.platform.builder.flow.impl;

import com.jbuild4d.base.dbaccess.dao.builder.FlowModelMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.FlowModelEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.XMLUtility;
import com.jbuild4d.platform.builder.flow.IFlowModelService;
import com.jbuild4d.platform.builder.flow.IFlowModelerConfigService;
import com.jbuild4d.platform.builder.service.IModuleService;
import com.jbuild4d.platform.builder.vo.DeModelVo;
import com.jbuild4d.platform.builder.vo.FlowModelerConfigVo;
import com.sun.xml.internal.ws.util.xml.XmlUtil;
import org.flowable.bpmn.converter.BpmnXMLConverter;
import org.flowable.bpmn.model.BpmnModel;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;

public class FlowModelServiceImpl extends BaseServiceImpl<FlowModelEntity> implements IFlowModelService
{
    FlowModelMapper flowModelMapper;
    RestTemplate restTemplate;
    IFlowModelerConfigService flowModelerConfigService;
    IModuleService moduleService;
    protected BpmnXMLConverter bpmnXmlConverter = new BpmnXMLConverter();

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
    public FlowModelEntity importNewModel(JB4DSession jb4DSession, String modelModuleId, MultipartFile file) throws IOException, XMLStreamException, JBuild4DGenerallyException {

        XMLInputFactory xif = XMLUtility.createSafeXmlInputFactory();
        InputStreamReader xmlIn = new InputStreamReader(file.getInputStream(), "UTF-8");
        XMLStreamReader xtr = xif.createXMLStreamReader(xmlIn);
        BpmnModel bpmnModel = bpmnXmlConverter.convertToBpmnModel(xtr);

        DeModelVo deModelVo=new DeModelVo();

        FlowModelerConfigVo configVo=flowModelerConfigService.getVoFromCache();
        String url=configVo.getBaseUrl()+configVo.getImportModelRest();
        try {
            /*HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            MultiValueMap<String,Object> parts = new LinkedMultiValueMap<>();

           // parts.add("file",new ByteArrayResource(file.getBytes()));

            MultiValueMap<String, Object> formData = new LinkedMultiValueMap<String, Object>();
            formData.add("file" ,new ByteArrayResource(file.getBytes()));
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<MultiValueMap<String, Object>>(formData, headers);
            ResponseEntity<DeModelVo> responseEntity = restTemplate.postForEntity(url, requestEntity, DeModelVo.class);
            deModelVo = responseEntity.getBody();*/

            HttpHeaders requestHeaders = new HttpHeaders();
            requestHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);
            MultiValueMap<String, Object> mvm = new LinkedMultiValueMap<String, Object>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            mvm.add("file" ,resource);
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<MultiValueMap<String, Object>>(mvm, requestHeaders);
            ResponseEntity<DeModelVo> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, DeModelVo.class);
            deModelVo = response.getBody();
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException("调用REST接口失败!"+ex.getMessage());
        }

        FlowModelEntity flowModelEntity=new FlowModelEntity();
        flowModelEntity.setModelId(deModelVo.getId());
        flowModelEntity.setModelDeId(deModelVo.getId());
        flowModelEntity.setModelName(deModelVo.getName());
        flowModelEntity.setModelStartKey(deModelVo.getKey());
        flowModelEntity.setModelCreater(jb4DSession.getUserName());
        flowModelEntity.setModelCreateTime(new Date());
        flowModelEntity.setModelFromType("Web导入");
        flowModelEntity.setModelUpdater(jb4DSession.getUserName());
        flowModelEntity.setModelUpdateTime(new Date());
        flowModelEntity.setModelOrderNum(flowModelMapper.nextOrderNum());
        flowModelEntity.setModelCode(moduleService.buildModuleItemCode(flowModelEntity.getModelOrderNum()));
        flowModelEntity.setModelModuleId(modelModuleId);

        flowModelMapper.insert(flowModelEntity);

        return flowModelEntity;
    }

    @Override
    public FlowModelEntity newModel(JB4DSession jb4DSession,FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException {
        FlowModelerConfigVo configVo=flowModelerConfigService.getVoFromCache();
        String url=configVo.getBaseUrl()+configVo.getModelRest();

        DeModelVo deModelVo=new DeModelVo(flowModelEntity.getModelName(),flowModelEntity.getModelStartKey(),flowModelEntity.getModelDesc(),0);
        /*deModelVo.setName(flowModelEntity.getModelName());
        deModelVo.setKey(flowModelEntity.getModelStartKey());
        deModelVo.setDescription(flowModelEntity.getModelDesc());
        deModelVo.setModelType(0);*/
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
    public FlowModelEntity updateModel(JB4DSession jb4DSession, FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException {

        FlowModelerConfigVo configVo=flowModelerConfigService.getVoFromCache();
        String url=configVo.getBaseUrl()+configVo.getModelRest()+"/{1}";

        DeModelVo deModelVo=new DeModelVo(flowModelEntity.getModelName(),flowModelEntity.getModelStartKey(),flowModelEntity.getModelDesc());
        /*deModelVo.setName(flowModelEntity.getModelName());
        deModelVo.setKey(flowModelEntity.getModelStartKey());
        deModelVo.setDescription(flowModelEntity.getModelDesc());*/

        try {
            restTemplate.put(url, deModelVo, flowModelEntity.getModelDeId());
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException("调用REST接口失败!"+ex.getMessage());
        }

        flowModelEntity.setModelUpdateTime(new Date());
        flowModelEntity.setModelUpdater(jb4DSession.getUserName());

        flowModelMapper.updateByPrimaryKeySelective(flowModelEntity);
        return flowModelEntity;
    }

    @Override
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        //return super.deleteByKey(jb4DSession, id);
        FlowModelerConfigVo configVo=flowModelerConfigService.getVoFromCache();
        String url=configVo.getBaseUrl()+configVo.getModelRest()+"/{1}";

        FlowModelEntity flowModelEntity=flowModelMapper.selectByPrimaryKey(id);
        try {
            restTemplate.delete(url, flowModelEntity.getModelDeId());
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException("调用REST接口失败!"+ex.getMessage());
        }
        return flowModelMapper.deleteByPrimaryKey(id);
    }

    @Override
    public String buildEditModelWebUrl(FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException {
        FlowModelerConfigVo configVo=flowModelerConfigService.getVoFromCache();
        String url=configVo.getBaseUrl()+configVo.getModelDesignView()+flowModelEntity.getModelDeId();
        return url;
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        FlowModelEntity selfEntity = flowModelMapper.selectByPrimaryKey(id);
        FlowModelEntity ltEntity = flowModelMapper.selectGreaterThanRecord(id, selfEntity.getModelModuleId());
        switchOrder(ltEntity, selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        FlowModelEntity selfEntity = flowModelMapper.selectByPrimaryKey(id);
        FlowModelEntity ltEntity = flowModelMapper.selectLessThanRecord(id, selfEntity.getModelModuleId());
        switchOrder(ltEntity, selfEntity);
    }

    private void switchOrder(FlowModelEntity toEntity, FlowModelEntity selfEntity) {
        if (toEntity != null) {
            int newNum = toEntity.getModelOrderNum();
            toEntity.setModelOrderNum(selfEntity.getModelOrderNum());
            selfEntity.setModelOrderNum(newNum);
            flowModelMapper.updateByPrimaryKeySelective(toEntity);
            flowModelMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
