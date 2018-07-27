package com.jbuild4d.platform.organ.service.impl;

import com.jbuild4d.base.dbaccess.dao.OrganMapper;
import com.jbuild4d.base.dbaccess.dbentities.OrganEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.organ.service.IOrganService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */

public class OrganServiceImpl extends BaseServiceImpl<OrganEntity> implements IOrganService
{
    OrganMapper organMapper;
    public OrganServiceImpl(OrganMapper _defaultBaseMapper,SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        organMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, OrganEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<OrganEntity>() {
            @Override
            public OrganEntity run(JB4DSession jb4DSession,OrganEntity item) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return item;
            }
        });
    }
}
