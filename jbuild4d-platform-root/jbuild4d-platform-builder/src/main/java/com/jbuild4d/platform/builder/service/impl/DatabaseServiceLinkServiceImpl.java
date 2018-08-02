package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.DatabaseServiceLinkMapper;
import com.jbuild4d.base.dbaccess.dbentities.DatabaseServiceLinkEntity;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.service.IDatabaseServiceLinkService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public class DatabaseServiceLinkServiceImpl extends BaseServiceImpl<DatabaseServiceLinkEntity> implements IDatabaseServiceLinkService
{
    DatabaseServiceLinkMapper databaseServiceLinkMapper;
    public DatabaseServiceLinkServiceImpl(DatabaseServiceLinkMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        databaseServiceLinkMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DatabaseServiceLinkEntity entity) throws JBuild4DGenerallyException {
        return 0;
    }
}
