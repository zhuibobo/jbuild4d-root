package com.jbuild4d.web.platform.controller.builder.dataset;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.builder.dataset.IDatasetGroupService;
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
        return "Builder/DataSet/DataSetGroupEdit";
    }

    @Override
    public String getjBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "模块设计--数据集分组";
    }

    @RequestMapping(value = "GetTreeData", method = RequestMethod.POST)
    @ResponseBody
    public List<DatasetGroupEntity> getTreeData() {
        List<DatasetGroupEntity> datasetGroupEntityList=datasetGroupService.getALL(JB4DSessionUtility.getSession());
        return datasetGroupEntityList;
    }
}
