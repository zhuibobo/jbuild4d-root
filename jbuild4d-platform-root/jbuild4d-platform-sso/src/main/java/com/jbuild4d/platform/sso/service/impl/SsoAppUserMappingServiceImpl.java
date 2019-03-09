package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.SsoAppUserMappingMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppUserMappingEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.ISsoAppUserMappingService;
import org.mybatis.spring.SqlSessionTemplate;

public class SsoAppUserMappingServiceImpl extends BaseServiceImpl<SsoAppUserMappingEntity> implements ISsoAppUserMappingService
{
    SsoAppUserMappingMapper ssoAppUserMappingMapper;
    public SsoAppUserMappingServiceImpl(SsoAppUserMappingMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        ssoAppUserMappingMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, SsoAppUserMappingEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<SsoAppUserMappingEntity>() {
            @Override
            public SsoAppUserMappingEntity run(JB4DSession jb4DSession,SsoAppUserMappingEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
