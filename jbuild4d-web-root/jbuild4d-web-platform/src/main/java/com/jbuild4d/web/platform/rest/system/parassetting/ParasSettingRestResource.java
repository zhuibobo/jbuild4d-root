package com.jbuild4d.web.platform.rest.system.parassetting;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.SettingEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.service.ISettingService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatForm/System/ParasSetting")
public class ParasSettingRestResource extends GeneralRestResource<SettingEntity> {
    @Autowired
    ISettingService settingService;

    @Override
    protected IBaseService<SettingEntity> getBaseService() {
        return settingService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "系统参数设置";
    }
}
