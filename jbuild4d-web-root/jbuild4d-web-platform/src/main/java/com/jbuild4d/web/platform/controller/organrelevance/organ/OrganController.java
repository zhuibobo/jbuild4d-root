package com.jbuild4d.web.platform.controller.organrelevance.organ;

import com.jbuild4d.base.dbaccess.dbentities.organrelevance.OrganEntity;
import com.jbuild4d.base.dbaccess.dbentities.organrelevance.OrganTypeEntity;
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

    @Override
    public String getListViewName() {
        return "OrganRelevance/Organ/OrganList";
    }

    @Override
    public String getDetailViewName() {
        return "OrganRelevance/Organ/OrganEdit";
    }
}
