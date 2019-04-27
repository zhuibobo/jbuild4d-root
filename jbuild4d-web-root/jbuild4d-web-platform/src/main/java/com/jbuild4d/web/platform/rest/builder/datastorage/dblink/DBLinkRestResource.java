package com.jbuild4d.web.platform.rest.builder.datastorage.dblink;

import com.jbuild4d.base.dbaccess.dbentities.builder.DbLinkEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.datastorage.IDbLinkService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/DataStorage/DBLink")
public class DBLinkRestResource extends GeneralRestResource<DbLinkEntity> {

    @Autowired
    private IDbLinkService dbLinkService;

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "数据库连接";
    }

    @Override
    protected IBaseService<DbLinkEntity> getBaseService() {
        return dbLinkService;
    }
}
