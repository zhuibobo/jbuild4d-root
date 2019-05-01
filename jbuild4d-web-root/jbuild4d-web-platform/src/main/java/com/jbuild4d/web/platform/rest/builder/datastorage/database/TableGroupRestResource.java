package com.jbuild4d.web.platform.rest.builder.datastorage.database;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/DataStorage/DataBase/TableGroup")
public class TableGroupRestResource extends GeneralRestResource<TableGroupEntity> {

    @Autowired
    ITableGroupService tableGroupService;

    @Override
    protected IBaseService<TableGroupEntity> getBaseService() {
        return tableGroupService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "表分组";
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public JBuild4DResponseVo getTreeData(String dbLinkId) {
        //List<TableGroupEntity> tableGroupEntityList=tableGroupService.getALLASC(JB4DSessionUtility.getSession());
        List<TableGroupEntity> tableGroupEntityList=tableGroupService.getByDBLinkId(JB4DSessionUtility.getSession(),dbLinkId);
        return JBuild4DResponseVo.getDataSuccess(tableGroupEntityList);
    }
}
