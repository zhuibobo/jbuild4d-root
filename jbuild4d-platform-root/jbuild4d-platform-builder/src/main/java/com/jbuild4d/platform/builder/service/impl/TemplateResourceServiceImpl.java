package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.builder.TemplateResourceMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TemplateResourceEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.service.ITemplateResourceService;
import org.mybatis.spring.SqlSessionTemplate;

public class TemplateResourceServiceImpl extends BaseServiceImpl<TemplateResourceEntity> implements ITemplateResourceService
{
    TemplateResourceMapper templateResourceMapper;
    public TemplateResourceServiceImpl(TemplateResourceMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        templateResourceMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, TemplateResourceEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TemplateResourceEntity>() {
            @Override
            public TemplateResourceEntity run(JB4DSession jb4DSession,TemplateResourceEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
