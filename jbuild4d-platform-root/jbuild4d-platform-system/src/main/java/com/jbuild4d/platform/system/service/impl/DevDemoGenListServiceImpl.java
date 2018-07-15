package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.DevDemoGenListMapper;
import com.jbuild4d.base.dbaccess.dbentities.DevDemoGenListEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IDevDemoGenListService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/15
 * To change this template use File | Settings | File Templates.
 */
public class DevDemoGenListServiceImpl extends BaseServiceImpl<DevDemoGenListEntity> implements IDevDemoGenListService
{
    DevDemoGenListMapper devDemoGenListMapper;

    public DevDemoGenListServiceImpl(DevDemoGenListMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        devDemoGenListMapper=_defaultBaseMapper;
    }

    @Override
    public int saveBySelective(JB4DSession jb4DSession, String id, DevDemoGenListEntity record) throws JBuild4DGenerallyException {
        return super.saveBySelective(jb4DSession,id, record, new IAddBefore<DevDemoGenListEntity>() {
            @Override
            public DevDemoGenListEntity run(DevDemoGenListEntity item) throws JBuild4DGenerallyException {
                //item.set
                return item;
            }
        });
    }
}
