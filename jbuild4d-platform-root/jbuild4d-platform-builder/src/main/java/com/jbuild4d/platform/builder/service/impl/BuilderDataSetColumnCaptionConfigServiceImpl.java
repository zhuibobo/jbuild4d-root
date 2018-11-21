package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.XMLUtility;
import com.jbuild4d.platform.builder.service.IBuilderDataSetColumnCaptionConfigService;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public class BuilderDataSetColumnCaptionConfigServiceImpl implements IBuilderDataSetColumnCaptionConfigService {

    String configResource= "builder"+File.separator+"dataset"+File.separator +"BuilderDataSetColumnCaptionConfig.xml";
    Document xmlDocument=null;

    public BuilderDataSetColumnCaptionConfigServiceImpl() throws IOException, SAXException, ParserConfigurationException {
        loadDocument();
    }

    private void loadDocument() throws ParserConfigurationException, SAXException, IOException {
        InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(configResource);
        xmlDocument = XMLUtility.parseForDoc(inputStream);
    }

    @Override
    public String getCaption(String columnName) throws XPathExpressionException, JBuild4DGenerallyException {
        List<Node> columnNodeList=XMLUtility.parseForNodeList(xmlDocument,"//Column");
        for (Node node : columnNodeList) {
            String name=XMLUtility.getAttribute(node,"Name");
            if(name.toLowerCase().equals(columnName.toLowerCase())){
                return XMLUtility.getAttribute(node,"Caption");
            }
        }
        return "";
    }
}
