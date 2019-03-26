package com.jbuild4d.platform.builder.datastorage.impl;

import com.jbuild4d.base.dbaccess.dao.builder.TableRelationMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.datastorage.ITableRelationService;
import org.mybatis.spring.SqlSessionTemplate;

public class TableRelationServiceImpl extends BaseServiceImpl<TableRelationEntity> implements ITableRelationService
{
    TableRelationMapper tableRelationMapper;
    public TableRelationServiceImpl(TableRelationMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableRelationMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, TableRelationEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableRelationEntity>() {
            @Override
            public TableRelationEntity run(JB4DSession jb4DSession,TableRelationEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
