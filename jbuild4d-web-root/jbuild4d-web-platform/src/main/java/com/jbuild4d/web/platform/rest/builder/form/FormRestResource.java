package com.jbuild4d.web.platform.rest.builder.form;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.webformdesign.IFormResourceService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FormRestResource extends GeneralRestResource<FormResourceEntityWithBLOBs> {

    @Autowired
    IFormResourceService formResourceService;

    @Override
    protected IBaseService<FormResourceEntityWithBLOBs> getBaseService() {
        return formResourceService;
    }


    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "模块设计-Web表单设计";
    }
}
