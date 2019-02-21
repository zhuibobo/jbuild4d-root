package com.jbuild4d.web.platform.controller.builder.datastorage.database;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/DataStorage/DataBase/TableGroup")
public class TableGroupController extends GeneralCRUDImplController<TableGroupEntity> {




    @Override
    public String getListViewName() {
        return "Builder/DataStorage/DataBase/Manager";
    }

    @Override
    public String getDetailViewName() {
        return "Builder/DataStorage/DataBase/TableGroupEdit";
    }

}
