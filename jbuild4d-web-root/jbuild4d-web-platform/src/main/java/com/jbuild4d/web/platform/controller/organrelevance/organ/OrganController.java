package com.jbuild4d.web.platform.controller.organrelevance.organ;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoTreeTableEntity;
import com.jbuild4d.base.dbaccess.dbentities.OrganEntity;
import com.jbuild4d.base.dbaccess.dbentities.OrganTypeEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.organ.service.IOrganService;
import com.jbuild4d.platform.organ.service.IOrganTypeService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/OrganRelevance/Organ")
public class OrganController extends GeneralCRUDImplController<OrganEntity> {
    @Autowired
    IOrganService organService;

    @Autowired
    IOrganTypeService organTypeService;

    @Override
    protected IBaseService<OrganEntity> getBaseService() {
        return organService;
    }

    @Override
    public String getListViewName() {
        return "OrganRelevance/Organ/OrganList";
    }

    @Override
    public String getDetailViewName() {
        return "OrganRelevance/Organ/OrganEdit";
    }

    @Override
    public String getSubSystemName() {
        return this.subSystemName;
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
