package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.systemsetting.Jb4dCacheMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.Jb4dCacheEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public class Jb4dCacheServiceImpl extends BaseServiceImpl<Jb4dCacheEntity> implements IJb4dCacheService
{
    Jb4dCacheMapper jb4dCacheMapper;
    public Jb4dCacheServiceImpl(Jb4dCacheMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        jb4dCacheMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, Jb4dCacheEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<Jb4dCacheEntity>() {
            @Override
            public Jb4dCacheEntity run(JB4DSession jb4DSession,Jb4dCacheEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}