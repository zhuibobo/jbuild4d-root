package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.OrganTypeMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganTypeEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.IOrganTypeService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

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

    @Override
    public void createDefaultOrganType(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        OrganTypeEntity organTypeEntity=new OrganTypeEntity();
        organTypeEntity.setOrganTypeId("0");
        organTypeEntity.setOrganTypeValue("TYPE10001");
        organTypeEntity.setOrganTypeName("默认类型");
        organTypeEntity.setOrganTypeDesc("默认类型");
        organTypeEntity.setOrganTypeCreateTime(new Date());
        organTypeEntity.setOrganTypeStatus(EnableTypeEnum.enable.getDisplayName());
        this.save(jb4DSession,organTypeEntity.getOrganTypeId(),organTypeEntity);
    }
}
