package com.jbuild4d.platform.builder.module.impl;

import com.jbuild4d.base.dbaccess.dao.builder.ServiceLinkMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.ServiceLinkEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.module.IServiceLinkService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/30
 * To change this template use File | Settings | File Templates.
 */
public class ServiceLinkServiceImpl extends BaseServiceImpl<ServiceLinkEntity> implements IServiceLinkService
{
    ServiceLinkMapper serviceLinkMapper;
    public ServiceLinkServiceImpl(ServiceLinkMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        serviceLinkMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, ServiceLinkEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<ServiceLinkEntity>() {
            @Override
            public ServiceLinkEntity run(JB4DSession jb4DSession,ServiceLinkEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}

