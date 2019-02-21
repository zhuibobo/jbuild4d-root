package com.jbuild4d.web.platform.rest.devdemo.treeandlist;

import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTLTreeEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.devdemo.IDevDemoTLTreeService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/DevDemo/TreeAndList/DevDemoTLTree")
public class DevDemoTLRestResource extends GeneralRestResource<DevDemoTLTreeEntity> {

    @Autowired
    IDevDemoTLTreeService devDemoTLTreeService;

    @Override
    protected IBaseService<DevDemoTLTreeEntity> getBaseService() {
        return devDemoTLTreeService;
    }


    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "开发示例";
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public List<DevDemoTLTreeEntity> getTreeData() {
        List<DevDemoTLTreeEntity> dictionaryGroupEntityList=devDemoTLTreeService.getALL(JB4DSessionUtility.getSession());
        return dictionaryGroupEntityList;
    }
}
