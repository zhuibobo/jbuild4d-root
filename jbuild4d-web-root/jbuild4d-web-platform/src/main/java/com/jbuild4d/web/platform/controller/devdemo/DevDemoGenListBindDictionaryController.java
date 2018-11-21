package com.jbuild4d.web.platform.controller.devdemo;

import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoGenListEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.devdemo.IDevDemoGenListService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

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
        return "/devdemo/GenList/GenListBindDictionary";
    }

    @Override
    public String getDetailViewName() {
        return "/devdemo/GenList/GenEditBindDictionary";
    }

    @Override
    public List<String> bindDictionaryToPage() {
        List<String> groupValueList=new ArrayList<>();
        groupValueList.add("DevDemoDictionaryGroupBindSelect");
        groupValueList.add("DevDemoDictionaryGroupBindRadio");
        groupValueList.add("DevDemoDictionaryGroupBindCheckbox");
        return groupValueList;
    }

    @Override
    public String getjBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "开发示例";
    }
}
