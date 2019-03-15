package com.jbuild4d.platform.builder.list.impl;

import com.jbuild4d.base.dbaccess.dao.builder.ListResourceMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.ListResourceEntityWithBLOBs;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.list.IListResourceService;
import com.jbuild4d.platform.builder.module.IModuleService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/18
 * To change this template use File | Settings | File Templates.
 */
public class ListResourceServiceImpl extends BaseServiceImpl<ListResourceEntityWithBLOBs> implements IListResourceService
{
    IModuleService moduleService;
    ListResourceMapper listResourceMapper;

    public ListResourceServiceImpl(ListResourceMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService,IModuleService _moduleService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        listResourceMapper=_defaultBaseMapper;
        moduleService=_moduleService;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, ListResourceEntityWithBLOBs record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<ListResourceEntityWithBLOBs>() {
            @Override
            public ListResourceEntityWithBLOBs run(JB4DSession jb4DSession,ListResourceEntityWithBLOBs sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
