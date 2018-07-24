package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dao.DevDemoTLTreeMapper;
import com.jbuild4d.base.dbaccess.dbentities.DevDemoTLTreeEntity;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IDevDemoTLTreeService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
public class DevDemoTLTreeServiceImpl  extends BaseServiceImpl<DevDemoTLTreeEntity> implements IDevDemoTLTreeService {
    DevDemoTLTreeMapper devDemoTLTreeMapper;

    public DevDemoTLTreeServiceImpl(DevDemoTLTreeMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        devDemoTLTreeMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DevDemoTLTreeEntity entity) throws JBuild4DGenerallyException {
        return 0;
    }
}
