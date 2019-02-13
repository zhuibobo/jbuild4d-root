package com.jbuild4d.platform.builder.flow;

import com.jbuild4d.base.dbaccess.dbentities.builder.FlowModelEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;

public interface IFlowModelService extends IBaseService<FlowModelEntity> {

    FlowModelEntity importNewModel(JB4DSession jb4DSession, String modelModuleId, MultipartFile file) throws IOException, XMLStreamException, JBuild4DGenerallyException;

    FlowModelEntity newModel(JB4DSession jb4DSession, FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException;

    FlowModelEntity updateModel(JB4DSession jb4DSession, FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException;

    String buildEditModelWebUrl(FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException;

    String buildViewModelWebUrl(FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException;
}
