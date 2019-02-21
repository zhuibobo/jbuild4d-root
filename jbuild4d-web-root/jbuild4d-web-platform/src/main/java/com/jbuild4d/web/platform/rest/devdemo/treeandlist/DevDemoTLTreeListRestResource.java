package com.jbuild4d.web.platform.rest.devdemo.treeandlist;

import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTLTreeListEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.devdemo.IDevDemoTLTreeListService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatForm/DevDemo/TreeAndList/DevDemoTLList")
public class DevDemoTLTreeListRestResource extends GeneralRestResource<DevDemoTLTreeListEntity> {

    @Autowired
    IDevDemoTLTreeListService devDemoTLTreeListService;

    @Override
    protected IBaseService<DevDemoTLTreeListEntity> getBaseService() {
        return devDemoTLTreeListService;
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
