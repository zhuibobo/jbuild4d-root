package com.jbuild4d.platform.builder.dataset.impl;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.tools.XMLDocumentUtility;
import com.jbuild4d.platform.builder.dataset.IDataSetColumnCaptionConfigService;
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
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public class DataSetColumnCaptionConfigServiceImpl implements IDataSetColumnCaptionConfigService {

    String configResource= "/builder/dataset/BuilderDataSetColumnCaptionConfig.xml";
    Document xmlDocument=null;

    public DataSetColumnCaptionConfigServiceImpl() throws IOException, SAXException, ParserConfigurationException {
        loadDocument();
    }

    private void loadDocument() throws ParserConfigurationException, SAXException, IOException {
        InputStream inputStream = this.getClass().getResourceAsStream(configResource);
        xmlDocument = XMLDocumentUtility.parseForDoc(inputStream);
    }

    @Override
    public String getCaption(String columnName) throws XPathExpressionException, JBuild4DGenerallyException {
        List<Node> columnNodeList= XMLDocumentUtility.parseForNodeList(xmlDocument,"//Column");
        for (Node node : columnNodeList) {
            String name= XMLDocumentUtility.getAttribute(node,"Name");
            if(name.toLowerCase().equals(columnName.toLowerCase())){
                return XMLDocumentUtility.getAttribute(node,"Caption");
            }
        }
        return "";
    }
}
