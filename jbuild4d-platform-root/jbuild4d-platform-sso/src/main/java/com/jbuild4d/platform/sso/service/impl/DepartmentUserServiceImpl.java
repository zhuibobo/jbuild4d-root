package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.DepartmentUserMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentUserEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.IDepartmentUserService;
import org.mybatis.spring.SqlSessionTemplate;

public class DepartmentUserServiceImpl extends BaseServiceImpl<DepartmentUserEntity> implements IDepartmentUserService
{
    DepartmentUserMapper departmentUserMapper;
    public DepartmentUserServiceImpl(DepartmentUserMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        departmentUserMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DepartmentUserEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DepartmentUserEntity>() {
            @Override
            public DepartmentUserEntity run(JB4DSession jb4DSession,DepartmentUserEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
