package com.jbuild4d.web.platform.controller.builder.dataset;

import com.jbuild4d.base.dbaccess.dbentities.DatasetGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.service.IDatasetGroupService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/DataSet/DataSetGroup")
public class DataSetGroupController extends GeneralCRUDImplController<DatasetGroupEntity> {
    @Autowired
    IDatasetGroupService datasetGroupService;

    @Override
    protected IBaseService<DatasetGroupEntity> getBaseService() {
        return datasetGroupService;
    }

    @Override
    public String getListViewName() {
        return "Builder/DataSet/Manager";
    }

    @Override
    public String getDetailViewName() {
        return null;
    }

    @Override
    public String getSubSystemName() {
        return null;
    }

    @Override
    public String getModuleName() {
        return null;
    }
}
