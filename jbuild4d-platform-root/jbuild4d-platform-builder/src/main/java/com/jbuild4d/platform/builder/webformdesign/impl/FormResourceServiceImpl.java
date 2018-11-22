package com.jbuild4d.platform.builder.webformdesign.impl;

import com.jbuild4d.base.dbaccess.dao.builder.FormResourceMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.webformdesign.IFormResourceService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
public class FormResourceServiceImpl extends BaseServiceImpl<FormResourceEntityWithBLOBs> implements IFormResourceService
{
    FormResourceMapper formResourceMapper;
    public FormResourceServiceImpl(FormResourceMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        formResourceMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, FormResourceEntityWithBLOBs record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<FormResourceEntityWithBLOBs>() {
            @Override
            public FormResourceEntityWithBLOBs run(JB4DSession jb4DSession,FormResourceEntityWithBLOBs sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}