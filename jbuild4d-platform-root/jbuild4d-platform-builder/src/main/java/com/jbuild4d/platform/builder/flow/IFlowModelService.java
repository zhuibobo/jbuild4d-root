package com.jbuild4d.platform.builder.flow;

import com.jbuild4d.base.dbaccess.dbentities.builder.FlowModelEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

public interface IFlowModelService extends IBaseService<FlowModelEntity> {
    FlowModelEntity newModel(JB4DSession jb4DSession, FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException;

    String buildEditModelWebUrl(FlowModelEntity flowModelEntity) throws JBuild4DGenerallyException;
}
