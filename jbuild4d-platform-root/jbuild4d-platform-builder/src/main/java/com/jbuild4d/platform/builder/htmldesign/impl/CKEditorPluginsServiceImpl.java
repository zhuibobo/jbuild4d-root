package com.jbuild4d.platform.builder.htmldesign.impl;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.cache.IBuildGeneralObj;
import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.htmldesign.ICKEditorPluginsService;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.w3c.dom.Node;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */
public class CKEditorPluginsServiceImpl implements ICKEditorPluginsService {

    IJb4dCacheService jb4dCacheService;

    public CKEditorPluginsServiceImpl(IJb4dCacheService jb4dCacheService) {
        this.jb4dCacheService = jb4dCacheService;
    }

    @Override
    public List<HtmlControlDefinitionVo> getWebFormControlVoList() throws JBuild4DGenerallyException {
        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService(jb4dCacheService);
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformBuilderCacheName, jb4dCacheService.sysRunStatusIsDebug(), "EnvVariableVoList", new IBuildGeneralObj<List<HtmlControlDefinitionVo>>() {
            @Override
            public List<HtmlControlDefinitionVo> BuildObj() throws JBuild4DGenerallyException {
                try
                {
                    List<Node> nodeList=configService.getWebFormControlNodes();
                    return parseNodeListToVoList(nodeList);
                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DGenerallyException(ex.getMessage());
                }
            }
        });
    }

    @Override
    public List<HtmlControlDefinitionVo> getListControlVoList() throws JBuild4DGenerallyException {
        CKEditorPluginsConfigService configService=new CKEditorPluginsConfigService(jb4dCacheService);
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformBuilderCacheName, jb4dCacheService.sysRunStatusIsDebug(), "EnvVariableVoList", new IBuildGeneralObj<List<HtmlControlDefinitionVo>>() {
            @Override
            public List<HtmlControlDefinitionVo> BuildObj() throws JBuild4DGenerallyException {
                try
                {
                    List<Node> nodeList=configService.getListControlNodes();
                    return parseNodeListToVoList(nodeList);
                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DGenerallyException(ex.getMessage());
                }
            }
        });
    }

    private List<HtmlControlDefinitionVo> parseNodeListToVoList(List<Node> nodeList) throws JBuild4DGenerallyException {
        try {
            List<HtmlControlDefinitionVo> result = new ArrayList<>();
            for (Node node : nodeList) {
                result.add(HtmlControlDefinitionVo.parseWebFormControlNode(node));
            }
            return result;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }
}
