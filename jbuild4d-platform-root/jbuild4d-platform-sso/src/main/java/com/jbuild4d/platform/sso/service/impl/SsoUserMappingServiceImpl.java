package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.SsoUserMappingMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoUserMappingEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.ISsoUserMappingService;
import org.mybatis.spring.SqlSessionTemplate;

public class SsoUserMappingServiceImpl extends BaseServiceImpl<SsoUserMappingEntity> implements ISsoUserMappingService
{
    SsoUserMappingMapper ssoUserMappingMapper;
    public SsoUserMappingServiceImpl(SsoUserMappingMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        ssoUserMappingMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, SsoUserMappingEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<SsoUserMappingEntity>() {
            @Override
            public SsoUserMappingEntity run(JB4DSession jb4DSession,SsoUserMappingEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
