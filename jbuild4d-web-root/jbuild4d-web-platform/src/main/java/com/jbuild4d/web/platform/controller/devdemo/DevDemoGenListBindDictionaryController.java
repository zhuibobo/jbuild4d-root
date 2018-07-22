package com.jbuild4d.web.platform.controller.devdemo;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoGenListEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.service.IDevDemoGenListService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/22
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/DevDemo/DevDemoGenListBindDictionary")
public class DevDemoGenListBindDictionaryController  extends GeneralCRUDImplController<DevDemoGenListEntity> {

    @Autowired
    IDevDemoGenListService devDemoGenListService;

    @Override
    protected IBaseService<DevDemoGenListEntity> getBaseService() {
        return devDemoGenListService;
    }

    @Override
    public String getListViewName() {
        return "/DevDemo/GenList/GenListBindDictionary";
    }

    @Override
    public String getDetailViewName() {
        return "/DevDemo/GenList/GenEditBindDictionary";
    }

    @Override
    public List<String> bindDictionaryToPage() {
        List<String> groupValueList=new ArrayList<>();
        groupValueList.add("DevDemoDictionaryGroupBindSelect");
        groupValueList.add("DevDemoDictionaryGroupBindRadio");
        groupValueList.add("DevDemoDictionaryGroupBindCheckbox");
        return super.bindDictionaryToPage();
    }
}
