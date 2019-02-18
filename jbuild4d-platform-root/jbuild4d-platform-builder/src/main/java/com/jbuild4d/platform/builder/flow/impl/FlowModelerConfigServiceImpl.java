package com.jbuild4d.platform.builder.flow.impl;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.cache.IBuildGeneralObj;
import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.base.tools.common.XMLUtility;
import com.jbuild4d.platform.builder.flow.IFlowModelerConfigService;
import com.jbuild4d.platform.builder.vo.FlowModelerConfigVo;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import java.io.File;
import java.io.InputStream;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/11
 * To change this template use File | Settings | File Templates.
 */
public class FlowModelerConfigServiceImpl implements IFlowModelerConfigService {

    String configResource= "/builder/flow/ModelerConfig.xml";
    Document xmlDocument=null;
    IJb4dCacheService jb4dCacheService;

    public FlowModelerConfigServiceImpl(IJb4dCacheService jb4dCacheService) {
        this.jb4dCacheService = jb4dCacheService;
    }

    @Override
    public FlowModelerConfigVo getVoFromCache() throws JBuild4DGenerallyException {
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformBuilderCacheName, jb4dCacheService.sysRunStatusIsDebug(), "FlowModelConfig", new IBuildGeneralObj<FlowModelerConfigVo>() {
            @Override
            public FlowModelerConfigVo BuildObj() throws JBuild4DGenerallyException {
                return parseXMLDocToVo();
            }
        });
    }

    private FlowModelerConfigVo parseXMLDocToVo() throws JBuild4DGenerallyException {
        try {
            InputStream inputStream = this.getClass().getResourceAsStream(configResource);
            xmlDocument = XMLUtility.parseForDoc(inputStream);
            Node modelerRestNode = XMLUtility.parseForNode(xmlDocument, "/Config/ModelerRest");

            String baseUrl=XMLUtility.parseForNode(modelerRestNode,"BaseUrl").getTextContent().trim();
            String modelDesignView=XMLUtility.parseForNode(modelerRestNode,"ModelDesignView").getTextContent().trim();
            String modelView=XMLUtility.parseForNode(modelerRestNode,"ModelView").getTextContent().trim();
            String modelRest=XMLUtility.parseForNode(modelerRestNode,"ModelRest").getTextContent().trim();
            String importModelRest=XMLUtility.parseForNode(modelerRestNode,"ImportModelRest").getTextContent().trim();

            FlowModelerConfigVo flowModelerConfigVo=new FlowModelerConfigVo();
            flowModelerConfigVo.setBaseUrl(baseUrl);
            flowModelerConfigVo.setModelRest(modelRest);
            flowModelerConfigVo.setModelDesignView(modelDesignView);
            flowModelerConfigVo.setModelView(modelView);
            flowModelerConfigVo.setImportModelRest(importModelRest);

            return flowModelerConfigVo;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }
}
