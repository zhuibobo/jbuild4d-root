package com.jbuild4d.web.platform.controller.devdemo.treeandlist;

import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTLTreeListEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.devdemo.IDevDemoTLTreeListService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */

@Controller
@RequestMapping(value = "/PlatForm/DevDemo/TreeAndList/DevDemoTLList")
public class DevDemoTLTreeListController extends GeneralCRUDImplController<DevDemoTLTreeListEntity> {

    @Autowired
    IDevDemoTLTreeListService devDemoTLTreeListService;

    @Override
    protected IBaseService<DevDemoTLTreeListEntity> getBaseService() {
        return devDemoTLTreeListService;
    }

    @Override
    public String getListViewName() {
        return "";
    }

    @Override
    public String getDetailViewName() {
        return "devdemo/TreeAndList/ListEdit";
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
