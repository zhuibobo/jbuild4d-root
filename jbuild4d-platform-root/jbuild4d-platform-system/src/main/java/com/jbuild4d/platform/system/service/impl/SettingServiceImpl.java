package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.system.SettingMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.SettingEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.platform.system.service.ISettingService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class SettingServiceImpl extends BaseServiceImpl<SettingEntity> implements ISettingService {

    SettingMapper settingMapper;

    public SettingServiceImpl(SettingMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        settingMapper = _defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, SettingEntity entity) throws JBuild4DGenerallyException {
        return this.save(jb4DSession, id, entity, new IAddBefore<SettingEntity>() {
            @Override
            public SettingEntity run(JB4DSession jb4DSession, SettingEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setSettingCreatetime(new Date());
                sourceEntity.setSettingUserId(jb4DSession.getUserId());
                sourceEntity.setSettingUserName(jb4DSession.getUserName());
                sourceEntity.setSettingOrganId(jb4DSession.getOrganId());
                sourceEntity.setSettingOrganName(jb4DSession.getOrganName());
                return sourceEntity;
            }
        });
    }

    @Override
    public void statusChange(JB4DSession jb4DSession, String ids, String status) throws JBuild4DGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                SettingEntity entity = getByPrimaryKey(jb4DSession, idArray[i]);
                entity.setSettingStatus(status);
                settingMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }
}
