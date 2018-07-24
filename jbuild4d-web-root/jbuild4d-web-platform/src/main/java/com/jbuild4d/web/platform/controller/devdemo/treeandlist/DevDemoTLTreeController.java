package com.jbuild4d.web.platform.controller.devdemo.treeandlist;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoTLTreeEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/DevDemo/TreeAndList/DevDemoTLTree")
public class DevDemoTLTreeController  extends GeneralCRUDImplController<DevDemoTLTreeEntity> {

    @Override
    protected IBaseService<DevDemoTLTreeEntity> getBaseService() {
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
}
