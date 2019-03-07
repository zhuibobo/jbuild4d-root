package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.UserRoleMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserRoleEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.IUserRoleService;
import org.mybatis.spring.SqlSessionTemplate;

public class UserRoleServiceImpl extends BaseServiceImpl<UserRoleEntity> implements IUserRoleService
{
    UserRoleMapper userRoleMapper;
    public UserRoleServiceImpl(UserRoleMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        userRoleMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, UserRoleEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<UserRoleEntity>() {
            @Override
            public UserRoleEntity run(JB4DSession jb4DSession,UserRoleEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
