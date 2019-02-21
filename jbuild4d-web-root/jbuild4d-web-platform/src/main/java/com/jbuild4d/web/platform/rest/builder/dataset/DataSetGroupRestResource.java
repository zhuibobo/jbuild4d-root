package com.jbuild4d.web.platform.rest.builder.dataset;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.builder.dataset.IDatasetGroupService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/DataSet/DataSetGroup")
public class DataSetGroupRestResource extends GeneralRestResource<DatasetGroupEntity> {
    @Autowired
    IDatasetGroupService datasetGroupService;

    @Override
    protected IBaseService<DatasetGroupEntity> getBaseService() {
        return datasetGroupService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "模块设计--数据集分组";
    }

    @RequestMapping(value = "GetTreeData", method = RequestMethod.POST)
    public List<DatasetGroupEntity> getTreeData() {
        List<DatasetGroupEntity> datasetGroupEntityList=datasetGroupService.getALL(JB4DSessionUtility.getSession());
        return datasetGroupEntityList;
    }
}
