package com.jbuild4d.web.platform.controller.organrelevance.organ;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoTreeTableEntity;
import com.jbuild4d.base.dbaccess.dbentities.OrganEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

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
    protected IBaseService<OrganEntity> getBaseService() {
        return null;
    }

    @Override
    public String getListViewName() {
        return null;
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
