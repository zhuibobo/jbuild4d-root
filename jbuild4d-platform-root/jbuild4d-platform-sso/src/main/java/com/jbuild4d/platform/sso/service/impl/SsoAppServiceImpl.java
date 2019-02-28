package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.SsoAppMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.ISsoAppService;
import org.mybatis.spring.SqlSessionTemplate;

public class SsoAppServiceImpl extends BaseServiceImpl<SsoAppEntity> implements ISsoAppService
{
    SsoAppMapper ssoAppMapper;
    public SsoAppServiceImpl(SsoAppMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        ssoAppMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, SsoAppEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<SsoAppEntity>() {
            @Override
            public SsoAppEntity run(JB4DSession jb4DSession,SsoAppEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
