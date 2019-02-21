package com.jbuild4d.web.platform.controller.builder.list;

import com.jbuild4d.base.dbaccess.dbentities.builder.ListResourceEntityWithBLOBs;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.builder.list.IListResourceService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/18
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/List")
public class ListController extends GeneralCRUDImplController<ListResourceEntityWithBLOBs> {


    @Override
    public String getListViewName() {
        return null;
    }

    @Override
    public String getDetailViewName() {
        return "Builder/List/ListDesign";
    }

}
