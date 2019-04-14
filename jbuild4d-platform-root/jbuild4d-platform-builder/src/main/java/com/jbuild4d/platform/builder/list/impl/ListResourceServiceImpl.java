package com.jbuild4d.platform.builder.list.impl;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dao.builder.ListResourceMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.ListResourceEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.session.JB4DSession;
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
public class ListResourceServiceImpl extends BaseServiceImpl<ListResourceEntity> implements IListResourceService
{
    IModuleService moduleService;
    ListResourceMapper listResourceMapper;

    public ListResourceServiceImpl(ListResourceMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService,IModuleService _moduleService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        listResourceMapper=_defaultBaseMapper;
        moduleService=_moduleService;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, ListResourceEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<ListResourceEntity>() {
            @Override
            public ListResourceEntity run(JB4DSession jb4DSession,ListResourceEntity sourceEntity) throws JBuild4DGenerallyException {

                sourceEntity.setListCreateTime(new Date());
                sourceEntity.setListCreater(jb4DSession.getUserName());
                sourceEntity.setListUpdateTime(new Date());
                sourceEntity.setListUpdater(jb4DSession.getUserName());
                sourceEntity.setListOrderNum(listResourceMapper.nextOrderNum());
                sourceEntity.setListStatus(EnableTypeEnum.enable.getDisplayName());
                sourceEntity.setListOrganId(jb4DSession.getOrganId());
                sourceEntity.setListOrganName(jb4DSession.getOrganName());
                sourceEntity.setListCode(moduleService.buildModuleItemCode(sourceEntity.getListOrderNum()));
                return sourceEntity;
            }
        });
    }
}
