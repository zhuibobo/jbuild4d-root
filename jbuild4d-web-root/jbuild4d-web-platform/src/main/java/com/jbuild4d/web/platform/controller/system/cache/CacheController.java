package com.jbuild4d.web.platform.controller.system.cache;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.Jb4dCacheEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/System/Cache")
public class CacheController extends GeneralCRUDImplController<Jb4dCacheEntity> {

    @Override
    public String getListViewName() {
        return "System/Cache/CacheList";
    }

    @Override
    public String getDetailViewName() {
        return "System/Cache/CacheEdit";
    }
}
