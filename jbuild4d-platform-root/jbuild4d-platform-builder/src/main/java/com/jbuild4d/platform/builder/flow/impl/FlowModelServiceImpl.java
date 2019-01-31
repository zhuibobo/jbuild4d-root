package com.jbuild4d.platform.builder.flow.impl;

import com.jbuild4d.base.dbaccess.dao.builder.FlowModelMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.FlowModelEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.flow.IFlowModelService;
import org.mybatis.spring.SqlSessionTemplate;

public class FlowModelServiceImpl extends BaseServiceImpl<FlowModelEntity> implements IFlowModelService
{
    FlowModelMapper flowModelMapper;
    public FlowModelServiceImpl(FlowModelMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        flowModelMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, FlowModelEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<FlowModelEntity>() {
            @Override
            public FlowModelEntity run(JB4DSession jb4DSession,FlowModelEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}