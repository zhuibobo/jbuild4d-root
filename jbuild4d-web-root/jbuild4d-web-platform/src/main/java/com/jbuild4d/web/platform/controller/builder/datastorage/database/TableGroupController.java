package com.jbuild4d.web.platform.controller.builder.datastorage.database;

import com.jbuild4d.base.dbaccess.dbentities.TableGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.service.ITableGroupService;
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
@RequestMapping(value = "/PlatForm/Builder/DataStorage/DataBase/")
public class TableGroupController extends GeneralCRUDImplController<TableGroupEntity> {
    @Autowired
    ITableGroupService tableGroupService;

    @Override
    protected IBaseService<TableGroupEntity> getBaseService() {
        return tableGroupService;
    }

    @Override
    public String getListViewName() {
        return "Builder/DataStorage/DataBase/Manger";
    }

    @Override
    public String getDetailViewName() {
        return "Builder/DataStorage/DataBase/TableGroupEdit";
    }

    @Override
    public String getSubSystemName() {
        return this.subSystemName;
    }

    @Override
    public String getModuleName() {
        return "表分组";
    }
}
