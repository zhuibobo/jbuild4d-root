package com.jbuild4d.platform.builder.datastorage.impl;

import com.jbuild4d.base.dbaccess.dao.builder.TableRelationHisMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationHisEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.datastorage.ITableRelationHisService;
import org.mybatis.spring.SqlSessionTemplate;

public class TableRelationHisServiceImpl extends BaseServiceImpl<TableRelationHisEntity> implements ITableRelationHisService
{
    TableRelationHisMapper tableRelationHisMapper;
    public TableRelationHisServiceImpl(TableRelationHisMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableRelationHisMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, TableRelationHisEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableRelationHisEntity>() {
            @Override
            public TableRelationHisEntity run(JB4DSession jb4DSession,TableRelationHisEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}