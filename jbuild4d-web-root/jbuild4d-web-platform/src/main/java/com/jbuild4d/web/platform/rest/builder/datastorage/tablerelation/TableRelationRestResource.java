package com.jbuild4d.web.platform.rest.builder.datastorage.tablerelation;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntityWithBLOBs;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.platform.builder.datastorage.ITableRelationService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/DataStorage/TableRelation/TableRelation")
public class TableRelationRestResource  extends GeneralRestResource<TableRelationEntityWithBLOBs> {

    @Autowired
    ITableRelationService tableRelationService;

    @Override
    protected IBaseService<TableRelationEntityWithBLOBs> getBaseService() {
        return tableRelationService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "表关系";
    }

    @RequestMapping(value = "/GetRelationByGroup", method = RequestMethod.POST)
    public JBuild4DResponseVo getRelationByGroup(String groupId) {
        List<TableRelationEntityWithBLOBs> relationEntityList=tableRelationService.getRelationByGroup(JB4DSessionUtility.getSession(),groupId);
        return JBuild4DResponseVo.getDataSuccess(relationEntityList);
    }
}
