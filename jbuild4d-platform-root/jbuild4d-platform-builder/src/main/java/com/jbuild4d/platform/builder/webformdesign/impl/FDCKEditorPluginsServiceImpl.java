package com.jbuild4d.platform.builder.webformdesign.impl;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.vo.WebFormControlDefinitionVo;
import com.jbuild4d.platform.builder.webformdesign.IFDCKEditorPluginsConfigService;
import com.jbuild4d.platform.builder.webformdesign.IFDCKEditorPluginsService;
import com.jbuild4d.platform.system.service.IJb4dCacheService;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */
public class FDCKEditorPluginsServiceImpl implements IFDCKEditorPluginsService {

    IJb4dCacheService jb4dCacheService;

    public FDCKEditorPluginsServiceImpl(IJb4dCacheService jb4dCacheService) {
        this.jb4dCacheService = jb4dCacheService;
    }

    @Override
    public List<WebFormControlDefinitionVo> getVoList() throws JBuild4DGenerallyException {
        IFDCKEditorPluginsConfigService configService=new FDCKEditorPluginsConfigServiceImpl(jb4dCacheService);
        return configService.getVoListFromCache();
    }
}
