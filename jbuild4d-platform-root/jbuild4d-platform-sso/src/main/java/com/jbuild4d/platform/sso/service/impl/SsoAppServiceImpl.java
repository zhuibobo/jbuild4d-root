package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;
import java.util.List;

import com.jbuild4d.base.dbaccess.dao.sso.SsoAppMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppInterfaceEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.ISsoAppInterfaceService;
import com.jbuild4d.platform.sso.service.ISsoAppService;
import com.jbuild4d.platform.sso.vo.SSOAppVo;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

public class SsoAppServiceImpl extends BaseServiceImpl<SsoAppEntity> implements ISsoAppService
{
    SsoAppMapper ssoAppMapper;

    @Autowired
    ISsoAppInterfaceService ssoAppInterfaceService;

    public SsoAppServiceImpl(SsoAppMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        ssoAppMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, SsoAppEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<SsoAppEntity>() {
            @Override
            public SsoAppEntity run(JB4DSession jb4DSession,SsoAppEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setAppOrderNum(ssoAppMapper.nextOrderNum());
                sourceEntity.setAppCreateTime(new Date());
                sourceEntity.setAppCreaterId(jb4DSession.getUserId());
                sourceEntity.setAppOrganId(jb4DSession.getOrganId());
                return sourceEntity;
            }
        });
    }

    @Override
    public void saveIntegratedMainApp(JB4DSession jb4DSession, SSOAppVo entity) throws JBuild4DGenerallyException {
        entity.getSsoAppEntity().setAppIntegratedType("开发集成");
        entity.getSsoAppEntity().setAppMainId("");
        entity.getSsoAppEntity().setAppType("主系统");
        this.saveSimple(jb4DSession,entity.getSsoAppEntity().getAppId(),entity.getSsoAppEntity());
        if(entity.getSsoAppInterfaceEntityList()!=null&&entity.getSsoAppInterfaceEntityList().size()>0){
            for (SsoAppInterfaceEntity ssoAppInterfaceEntity : entity.getSsoAppInterfaceEntityList()) {
                ssoAppInterfaceService.saveSimple(jb4DSession,ssoAppInterfaceEntity.getInterfaceId(),ssoAppInterfaceEntity);
            }
        }
    }

    @Override
    public SSOAppVo getAppVo(JB4DSession jb4DSession, String appId) {
        SSOAppVo ssoAppVo=new SSOAppVo();
        SsoAppEntity ssoAppEntity=ssoAppMapper.selectByPrimaryKey(appId);
        List<SsoAppInterfaceEntity> ssoAppInterfaceEntityList= ssoAppInterfaceService.getAppInterfaces(jb4DSession,appId);
        ssoAppVo.setSsoAppEntity(ssoAppEntity);
        ssoAppVo.setSsoAppInterfaceEntityList(ssoAppInterfaceEntityList);
        return ssoAppVo;
    }

    @Override
    public void saveIntegratedSubApp(JB4DSession jb4DSession, SSOAppVo entity) throws JBuild4DGenerallyException {
        if(entity.getSsoAppEntity().getAppMainId()==null||entity.getSsoAppEntity().getAppMainId().equals("")){
            throw new JBuild4DGenerallyException("所属主系统ID不能为空!");
        }
        entity.getSsoAppEntity().setAppIntegratedType("开发集成");
        entity.getSsoAppEntity().setAppType("子系统");
        this.saveSimple(jb4DSession,entity.getSsoAppEntity().getAppId(),entity.getSsoAppEntity());
        if(entity.getSsoAppInterfaceEntityList()!=null&&entity.getSsoAppInterfaceEntityList().size()>0){
            for (SsoAppInterfaceEntity ssoAppInterfaceEntity : entity.getSsoAppInterfaceEntityList()) {
                ssoAppInterfaceService.saveSimple(jb4DSession,ssoAppInterfaceEntity.getInterfaceId(),ssoAppInterfaceEntity);
            }
        }
    }

    @Override
    public List<SsoAppEntity> getALLSubApp(JB4DSession session, String appId) {
        return ssoAppMapper.selectALLSubApp(appId);
    }

    @Override
    public List<SsoAppEntity> getALLMainApp(JB4DSession session) {
        return ssoAppMapper.selectAllMainApp();
    }
}
