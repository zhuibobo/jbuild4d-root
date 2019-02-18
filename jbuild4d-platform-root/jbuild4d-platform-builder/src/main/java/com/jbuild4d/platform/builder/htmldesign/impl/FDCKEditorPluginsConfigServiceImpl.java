package com.jbuild4d.platform.builder.htmldesign.impl;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.cache.IBuildGeneralObj;
import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.base.tools.common.XMLUtility;
import com.jbuild4d.platform.builder.htmldesign.IFDCKEditorPluginsConfigService;
import com.jbuild4d.platform.builder.vo.WebFormControlDefinitionVo;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */
public class FDCKEditorPluginsConfigServiceImpl implements IFDCKEditorPluginsConfigService {

    String configResource= "/builder/form/CKEditorPluginsConfig.xml";
    Document xmlDocument=null;
    IJb4dCacheService jb4dCacheService;


    public FDCKEditorPluginsConfigServiceImpl(IJb4dCacheService jb4dCacheService) {
        this.jb4dCacheService = jb4dCacheService;
    }

    @Override
    public List<WebFormControlDefinitionVo> getVoListFromCache() throws JBuild4DGenerallyException {
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformBuilderCacheName, jb4dCacheService.sysRunStatusIsDebug(), "EnvVariableVoList", new IBuildGeneralObj<List<WebFormControlDefinitionVo>>() {
            @Override
            public List<WebFormControlDefinitionVo> BuildObj() throws JBuild4DGenerallyException {
                return parseXMLDocToVoList();
            }
        });
    }

    private List<WebFormControlDefinitionVo> parseXMLDocToVoList() throws JBuild4DGenerallyException {
        try {
            InputStream inputStream = this.getClass().getResourceAsStream(configResource);
            xmlDocument = XMLUtility.parseForDoc(inputStream);
            List<Node> nodeList = XMLUtility.parseForNodeList(xmlDocument, "/Config/WebControl/WebFormControl");
            List<WebFormControlDefinitionVo> result = new ArrayList<>();
            for (Node node : nodeList) {
                result.add(WebFormControlDefinitionVo.parseWebFormControlNode(node));
            }
            return result;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }
}
