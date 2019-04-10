package com.jbuild4d.platform.builder.htmldesign.impl;

import com.jbuild4d.core.base.tools.XMLDocumentUtility;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */
public class CKEditorPluginsConfigService {

    String configResource= "/builder/htmldesign/CKEditorPluginsConfig.xml";
    Document xmlDocument=null;
    IJb4dCacheService jb4dCacheService;


    public CKEditorPluginsConfigService(IJb4dCacheService jb4dCacheService) {
        this.jb4dCacheService = jb4dCacheService;
    }

    /*public List<HtmlControlDefinitionVo> getVoListFromCache() throws JBuild4DGenerallyException {
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformBuilderCacheName, jb4dCacheService.sysRunStatusIsDebug(), "EnvVariableVoList", new IBuildGeneralObj<List<HtmlControlDefinitionVo>>() {
            @Override
            public List<HtmlControlDefinitionVo> BuildObj() throws JBuild4DGenerallyException {
                return parseXMLDocToVoList();
            }
        });
    }*/

    public List<Node> getWebFormControlNodes() throws ParserConfigurationException, SAXException, IOException, XPathExpressionException {
        InputStream inputStream = this.getClass().getResourceAsStream(configResource);
        xmlDocument = XMLDocumentUtility.parseForDoc(inputStream);
        List<Node> nodeList = XMLDocumentUtility.parseForNodeList(xmlDocument, "/Config/WebFormControls/Control");
        return nodeList;
    }

    public List<Node> getListControlNodes() throws ParserConfigurationException, SAXException, IOException, XPathExpressionException {
        InputStream inputStream = this.getClass().getResourceAsStream(configResource);
        xmlDocument = XMLDocumentUtility.parseForDoc(inputStream);
        List<Node> nodeList = XMLDocumentUtility.parseForNodeList(xmlDocument, "/Config/WebListControls/Control");
        return nodeList;
    }

    /*private List<HtmlControlDefinitionVo> parseXMLDocToVoList() throws JBuild4DGenerallyException {
        try {
            InputStream inputStream = this.getClass().getResourceAsStream(configResource);
            xmlDocument = XMLUtility.parseForDoc(inputStream);
            List<Node> nodeList = XMLUtility.parseForNodeList(xmlDocument, "/Config/WebFormControls/Control");
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
    }*/
}
