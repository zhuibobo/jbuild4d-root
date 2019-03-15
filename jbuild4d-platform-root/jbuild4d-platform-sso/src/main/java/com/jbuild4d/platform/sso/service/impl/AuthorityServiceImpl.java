package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.AuthorityMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.AuthorityEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.IAuthorityService;
import org.mybatis.spring.SqlSessionTemplate;

public class AuthorityServiceImpl extends BaseServiceImpl<AuthorityEntity> implements IAuthorityService
{
    AuthorityMapper authorityMapper;
    public AuthorityServiceImpl(AuthorityMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        authorityMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, AuthorityEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<AuthorityEntity>() {
            @Override
            public AuthorityEntity run(JB4DSession jb4DSession,AuthorityEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}