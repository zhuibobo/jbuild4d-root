package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.systemsetting.CacheMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.CacheEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.ICacheService;
import org.mybatis.spring.SqlSessionTemplate;

public class CacheServiceImpl extends BaseServiceImpl<CacheEntity> implements ICacheService
{
    CacheMapper cacheMapper;
    public CacheServiceImpl(CacheMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        cacheMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, CacheEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<CacheEntity>() {
            @Override
            public CacheEntity run(JB4DSession jb4DSession,CacheEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}

