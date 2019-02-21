package com.jbuild4d.web.platform.rest.devdemo;

import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTreeTableEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.devdemo.IDevDemoTreeTableService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/DevDemo/DevDemoTreeTable")
public class DevDemoTreeTableRestResource extends GeneralRestResource<DevDemoTreeTableEntity> {

    @Autowired
    IDevDemoTreeTableService devDemoTreeTableService;

    @Override
    protected IBaseService<DevDemoTreeTableEntity> getBaseService() {
        return devDemoTreeTableService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "开发示例";
    }

}
