package com.jbuild4d.web.platform.rest.devdemo;

import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoGenListEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.devdemo.IDevDemoGenListService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/DevDemo/DevDemoGenListBindDictionary")
public class DevDemoGenListBindDictionaryRestResource extends GeneralRestResource<DevDemoGenListEntity> {

    @Autowired
    IDevDemoGenListService devDemoGenListService;

    @Override
    protected IBaseService<DevDemoGenListEntity> getBaseService() {
        return devDemoGenListService;
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
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "开发示例";
    }

}
