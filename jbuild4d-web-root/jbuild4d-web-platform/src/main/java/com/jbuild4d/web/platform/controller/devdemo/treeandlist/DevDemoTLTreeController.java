package com.jbuild4d.web.platform.controller.devdemo.treeandlist;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoTLTreeEntity;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.service.IDevDemoTLTreeService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/DevDemo/TreeAndList/DevDemoTLTree")
public class DevDemoTLTreeController  extends GeneralCRUDImplController<DevDemoTLTreeEntity> {

    @Autowired
    IDevDemoTLTreeService devDemoTLTreeService;

    @Override
    protected IBaseService<DevDemoTLTreeEntity> getBaseService() {
        return devDemoTLTreeService;
    }

    @Override
    public String getListViewName() {
        return "DevDemo/TreeAndList/Manager";
    }

    @Override
    public String getDetailViewName() {
        return "DevDemo/TreeAndList/TreeEdit";
    }

    @RequestMapping(value = "GetTreeData", method = RequestMethod.POST)
    @ResponseBody
    public List<DevDemoTLTreeEntity> getTreeData() {
        List<DevDemoTLTreeEntity> dictionaryGroupEntityList=devDemoTLTreeService.getALL(JB4DSessionUtility.getSession());
        return dictionaryGroupEntityList;
    }
}
