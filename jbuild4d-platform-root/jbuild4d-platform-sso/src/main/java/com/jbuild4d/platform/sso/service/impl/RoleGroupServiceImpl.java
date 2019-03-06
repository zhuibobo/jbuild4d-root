package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.RoleGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.RoleGroupEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.IRoleGroupService;
import org.mybatis.spring.SqlSessionTemplate;

public class RoleGroupServiceImpl extends BaseServiceImpl<RoleGroupEntity> implements IRoleGroupService
{
    RoleGroupMapper roleGroupMapper;
    public RoleGroupServiceImpl(RoleGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        roleGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, RoleGroupEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<RoleGroupEntity>() {
            @Override
            public RoleGroupEntity run(JB4DSession jb4DSession,RoleGroupEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}