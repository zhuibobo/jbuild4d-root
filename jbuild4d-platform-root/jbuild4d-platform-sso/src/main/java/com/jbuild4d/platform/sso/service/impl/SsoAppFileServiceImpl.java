package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.SsoAppFileMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppFileEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.ISsoAppFileService;
import org.mybatis.spring.SqlSessionTemplate;

public class SsoAppFileServiceImpl extends BaseServiceImpl<SsoAppFileEntity> implements ISsoAppFileService
{
    SsoAppFileMapper ssoAppFileMapper;
    public SsoAppFileServiceImpl(SsoAppFileMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        ssoAppFileMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, SsoAppFileEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<SsoAppFileEntity>() {
            @Override
            public SsoAppFileEntity run(JB4DSession jb4DSession,SsoAppFileEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}