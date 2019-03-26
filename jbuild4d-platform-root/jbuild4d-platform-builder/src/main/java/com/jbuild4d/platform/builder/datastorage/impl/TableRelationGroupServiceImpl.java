package com.jbuild4d.platform.builder.datastorage.impl;

import com.jbuild4d.base.dbaccess.dao.builder.TableRelationGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationGroupEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.datastorage.ITableRelationGroupService;
import org.mybatis.spring.SqlSessionTemplate;

public class TableRelationGroupServiceImpl extends BaseServiceImpl<TableRelationGroupEntity> implements ITableRelationGroupService
{
    TableRelationGroupMapper tableRelationGroupMapper;
    public TableRelationGroupServiceImpl(TableRelationGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableRelationGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, TableRelationGroupEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableRelationGroupEntity>() {
            @Override
            public TableRelationGroupEntity run(JB4DSession jb4DSession,TableRelationGroupEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}