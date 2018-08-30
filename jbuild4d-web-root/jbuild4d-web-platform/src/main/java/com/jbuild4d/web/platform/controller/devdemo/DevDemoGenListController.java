package com.jbuild4d.web.platform.controller.devdemo;

import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoGenListEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.devdemo.IDevDemoGenListService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/15
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/DevDemo/DevDemoGenList")
public class DevDemoGenListController extends GeneralCRUDImplController<DevDemoGenListEntity> {

    @Autowired
    IDevDemoGenListService devDemoGenListService;

    @Override
    protected IBaseService<DevDemoGenListEntity> getBaseService() {
        return devDemoGenListService;
    }

    @Override
    public String getListViewName() {
        return "/devdemo/GenList/GenList";
    }

    @Override
    public String getDetailViewName() {
        return "/devdemo/GenList/GenEdit";
    }

    @RequestMapping(value = "ListNotSearch", method = RequestMethod.GET)
    public ModelAndView listNotSearch() {
        ModelAndView modelAndView=new ModelAndView("/devdemo/GenList/GenListNotSearch");
        return modelAndView;
    }

    @RequestMapping(value = "DetailScrollView", method = RequestMethod.GET)
    public ModelAndView detailScrollView(){
        ModelAndView modelAndView=new ModelAndView("/devdemo/GenList/GenEditScroll");
        return modelAndView;
    }

    @Override
    public String getSubSystemName() {
        return this.subSystemName;
    }

    @Override
    public String getModuleName() {
        return "开发示例";
    }
}
