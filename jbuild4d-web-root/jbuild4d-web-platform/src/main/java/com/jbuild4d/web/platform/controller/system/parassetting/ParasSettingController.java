package com.jbuild4d.web.platform.controller.system.parassetting;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.SettingEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.service.ISettingService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/21
 * To change this template use File | Settings | File Templates.
 */

@Controller
@RequestMapping(value = "/PlatForm/System/ParasSetting")
public class ParasSettingController  extends GeneralCRUDImplController<SettingEntity> {
    @Autowired
    ISettingService settingService;

    @Override
    protected IBaseService<SettingEntity> getBaseService() {
        return settingService;
    }

    @Override
    public String getListViewName() {
        return "System/ParasSetting/ParasSettingList";
    }

    @Override
    public String getDetailViewName() {
        return "System/ParasSetting/ParasSettingEdit";
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
