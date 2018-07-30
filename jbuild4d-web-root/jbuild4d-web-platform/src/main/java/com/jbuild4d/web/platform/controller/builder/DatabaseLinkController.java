package com.jbuild4d.web.platform.controller.builder;

import com.jbuild4d.base.dbaccess.dbentities.DatabaseLinkEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.service.IDatabaseLinkService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/DataLink")
public class DatabaseLinkController extends GeneralCRUDImplController<DatabaseLinkEntity> {

    @Autowired
    IDatabaseLinkService databaseLinkService;

    @Override
    protected IBaseService<DatabaseLinkEntity> getBaseService() {
        return databaseLinkService;
    }

    @Override
    public String getListViewName() {
        return "Builder/DataStorage/DataLink/DataLinkList";
    }

    @Override
    public String getDetailViewName() {
        return "Builder/DataStorage/DataLink/DataLinkEdit";
    }

    @Override
    public String getSubSystemName() {
        return this.subSystemName;
    }

    @Override
    public String getModuleName() {
        return "链接管理";
    }
}
