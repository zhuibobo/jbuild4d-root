package com.jbuild4d.web.platform.rest.builder.list;

import com.jbuild4d.base.dbaccess.dbentities.builder.ListResourceEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.weblist.IListResourceService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/List")
public class ListRestResource extends GeneralRestResource<ListResourceEntity> {

    @Autowired
    IListResourceService listResourceService;

    @Override
    protected IBaseService<ListResourceEntity> getBaseService() {
        return listResourceService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "模块设计-列表设计";
    }
}
