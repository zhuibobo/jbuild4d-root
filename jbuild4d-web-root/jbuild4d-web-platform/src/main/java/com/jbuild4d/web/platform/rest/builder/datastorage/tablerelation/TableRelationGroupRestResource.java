package com.jbuild4d.web.platform.rest.builder.datastorage.tablerelation;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.builder.datastorage.ITableRelationGroupService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/DataStorage/TableRelation/TableRelationGroup")
public class TableRelationGroupRestResource extends GeneralRestResource<TableRelationGroupEntity> {

    @Autowired
    ITableRelationGroupService tableRelationGroupService;

    @Override
    protected IBaseService<TableRelationGroupEntity> getBaseService() {
        return tableRelationGroupService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "表关系分组";
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public List<TableRelationGroupEntity> getTreeData() {
        List<TableRelationGroupEntity> tableGroupEntityList=tableRelationGroupService.getALLASC(JB4DSessionUtility.getSession());
        return tableGroupEntityList;
    }

}
