package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.systemsetting.SettingMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.SettingEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IUpdateBefore;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.tools.StringUtility;
import com.jbuild4d.base.service.general.JBuild4DProp;
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

    public static String getValueExistErrorMsg(String value){
        return String.format("已经存在值为:%s的设置项!", value);
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, SettingEntity entity) throws JBuild4DGenerallyException {
        //判断是否存在相同Value的记录
        String value = entity.getSettingValue();

        return this.save(jb4DSession, id, entity, new IAddBefore<SettingEntity>() {
            @Override
            public SettingEntity run(JB4DSession jb4DSession, SettingEntity sourceEntity) throws JBuild4DGenerallyException {
                if (settingMapper.selectByKeyField(value) == null) {
                    sourceEntity.setSettingCreatetime(new Date());
                    sourceEntity.setSettingUserId(jb4DSession.getUserId());
                    sourceEntity.setSettingUserName(jb4DSession.getUserName());
                    sourceEntity.setSettingOrganId(jb4DSession.getOrganId());
                    sourceEntity.setSettingOrganName(jb4DSession.getOrganName());
                    sourceEntity.setSettingOrderNum(settingMapper.nextOrderNum());
                    return sourceEntity;
                } else {
                    throw new JBuild4DGenerallyException(getValueExistErrorMsg(value));
                }
            }
        }, new IUpdateBefore<SettingEntity>() {
            @Override
            public SettingEntity run(JB4DSession jb4DSession, SettingEntity sourceEntity) throws JBuild4DGenerallyException {
                SettingEntity oldEntity=settingMapper.selectByKeyField(value);
                if (oldEntity!=null){
                    if(!oldEntity.getSettingId().equals(sourceEntity.getSettingId())){
                        throw new JBuild4DGenerallyException(getValueExistErrorMsg(value));
                    }
                }
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

    @Override
    public void initSystemData(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        //String userDefaultPasswordId="SettingUserDefaultPassword";
        this.deleteByKeyNotValidate(jb4DSession,SETTINGUSERDEFAULTPASSWORD, JBuild4DProp.getWarningOperationCode());
        SettingEntity defaultUserPasswordEntity=new SettingEntity();
        defaultUserPasswordEntity.setSettingId(SETTINGUSERDEFAULTPASSWORD);
        defaultUserPasswordEntity.setSettingKey(SETTINGUSERDEFAULTPASSWORD);
        defaultUserPasswordEntity.setSettingName("用户默认密码");
        defaultUserPasswordEntity.setSettingValue("j4d123456");
        defaultUserPasswordEntity.setSettingStatus(EnableTypeEnum.enable.getDisplayName());
        defaultUserPasswordEntity.setSettingIsSystem(TrueFalseEnum.True.getDisplayName());
        this.saveSimple(jb4DSession,defaultUserPasswordEntity.getSettingId(),defaultUserPasswordEntity);
    }

    @Override
    public SettingEntity getByKey(JB4DSession jb4DSession, String key) {
        return settingMapper.selectByKeyField(key);
    }
}
