package com.jbuild4d.web.platform.rest.system.cache;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.Jb4dCacheEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatForm/System/Cache")
public class CacheRestResource extends GeneralRestResource<Jb4dCacheEntity> {

    @Autowired
    IJb4dCacheService jb4dCacheService;

    @Override
    protected IBaseService<Jb4dCacheEntity> getBaseService() {
        return jb4dCacheService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName()  {
        return "缓存状态设置";
    }

}
