package com.jbuild4d.web.platform.rest.organrelevance.organ;

import com.jbuild4d.base.dbaccess.dbentities.organrelevance.OrganEntity;
import com.jbuild4d.base.dbaccess.dbentities.organrelevance.OrganTypeEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.organ.service.IOrganService;
import com.jbuild4d.platform.organ.service.IOrganTypeService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/PlatForm/OrganRelevance/Organ")
public class OrganRestResource extends GeneralRestResource<OrganEntity> {

    @Autowired
    IOrganService organService;

    @Autowired
    IOrganTypeService organTypeService;

    @Override
    protected IBaseService<OrganEntity> getBaseService() {
        return organService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "组织管理";
    }

    @Override
    protected Map<String, Object> bindObjectsToMV() {
        List<OrganTypeEntity> organTypeEntityList=organTypeService.getALL(JB4DSessionUtility.getSession());
        Map<String,Object> result=new HashMap<>();
        result.put("OrganType",organTypeEntityList);
        return result;
    }

}
