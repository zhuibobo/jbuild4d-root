package com.jbuild4d.web.platform.rest.builder.datastorage.database;

import com.jbuild4d.base.dbaccess.dbentities.builder.DbLinkEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/DataStorage/DataBase/DBLink")
public class DBLinkRestResource extends GeneralRestResource<DbLinkEntity> {
    @Override
    public String getJBuild4DSystemName() {
        return null;
    }

    @Override
    public String getModuleName() {
        return null;
    }

    @Override
    protected IBaseService<DbLinkEntity> getBaseService() {
        return null;
    }
}
