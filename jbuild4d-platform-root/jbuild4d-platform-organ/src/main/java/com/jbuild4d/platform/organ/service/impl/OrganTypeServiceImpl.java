package com.jbuild4d.platform.organ.service.impl;

import com.jbuild4d.base.dbaccess.dao.organrelevance.OrganTypeMapper;
import com.jbuild4d.base.dbaccess.dbentities.organrelevance.OrganTypeEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.organ.service.IOrganTypeService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
public class OrganTypeServiceImpl extends BaseServiceImpl<OrganTypeEntity> implements IOrganTypeService
{
    OrganTypeMapper organTypeMapper;
    public OrganTypeServiceImpl(OrganTypeMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        organTypeMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, OrganTypeEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<OrganTypeEntity>() {
            @Override
            public OrganTypeEntity run(JB4DSession jb4DSession,OrganTypeEntity sourceEntity) throws JBuild4DGenerallyException {
                return sourceEntity;
            }
        });
    }
}
