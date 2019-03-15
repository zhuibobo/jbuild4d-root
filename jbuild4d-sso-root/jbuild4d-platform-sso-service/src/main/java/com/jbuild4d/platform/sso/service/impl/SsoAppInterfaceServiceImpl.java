package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;
import java.util.List;

import com.jbuild4d.base.dbaccess.dao.sso.SsoAppInterfaceMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppInterfaceEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.ISsoAppInterfaceService;
import org.mybatis.spring.SqlSessionTemplate;

public class SsoAppInterfaceServiceImpl extends BaseServiceImpl<SsoAppInterfaceEntity> implements ISsoAppInterfaceService
{
    SsoAppInterfaceMapper ssoAppInterfaceMapper;
    public SsoAppInterfaceServiceImpl(SsoAppInterfaceMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        ssoAppInterfaceMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, SsoAppInterfaceEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<SsoAppInterfaceEntity>() {
            @Override
            public SsoAppInterfaceEntity run(JB4DSession jb4DSession,SsoAppInterfaceEntity sourceEntity) throws JBuild4DGenerallyException {

                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setInterfaceOrderNum(ssoAppInterfaceMapper.nextOrderNum());
                sourceEntity.setInterfaceCreateTime(new Date());
                sourceEntity.setInterfaceStatus(EnableTypeEnum.enable.getDisplayName());
                sourceEntity.setInterfaceCreaterId(jb4DSession.getUserId());
                sourceEntity.setInterfaceOrganId(jb4DSession.getOrganId());
                return sourceEntity;
            }
        });
    }

    @Override
    public List<SsoAppInterfaceEntity> getAppInterfaces(JB4DSession jb4DSession, String appId) {
        return ssoAppInterfaceMapper.selectAppInterfaces(appId);
    }
}