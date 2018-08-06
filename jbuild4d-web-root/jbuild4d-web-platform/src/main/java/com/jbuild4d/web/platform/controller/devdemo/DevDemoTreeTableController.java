package com.jbuild4d.web.platform.controller.devdemo;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoTreeTableEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.devdemo.IDevDemoTreeTableService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/23
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/DevDemo/DevDemoTreeTable")
public class DevDemoTreeTableController  extends GeneralCRUDImplController<DevDemoTreeTableEntity> {

    @Autowired
    IDevDemoTreeTableService devDemoTreeTableService;

    @Override
    protected IBaseService<DevDemoTreeTableEntity> getBaseService() {
        return devDemoTreeTableService;
    }

    @Override
    public String getListViewName() {
        return "DevDemo/TreeTable/TreeTableList";
    }

    @Override
    public String getDetailViewName() {
        return "DevDemo/TreeTable/TreeTableEdit";
    }

    @Override
    public String getSubSystemName() {
        return this.subSystemName;
    }

    @Override
    public String getModuleName() {
        return "开发示例";
    }
}
