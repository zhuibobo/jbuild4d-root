package com.jbuild4d.platform.builder.module.impl;

import com.jbuild4d.core.base.tools.XMLDocumentUtility;
import com.jbuild4d.platform.builder.module.IBuilderConfigService;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public class BuilderConfigServiceImpl implements IBuilderConfigService {
    static String configResource="/builder/BuilderConfig.xml";
    static Document xmlDocument=null;
    static String _tablePrefix=null;

    public BuilderConfigServiceImpl() throws ParserConfigurationException, SAXException, IOException {
        if(xmlDocument==null) {
            //InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(configResource);
            //xmlDocument = XMLUtility.parseForDoc(inputStream);
            loadDocument();
        }
    }

    private void loadDocument() throws ParserConfigurationException, SAXException, IOException {
        InputStream inputStream = this.getClass().getResourceAsStream(configResource);
        xmlDocument = XMLDocumentUtility.parseForDoc(inputStream);
    }

    @Override
    public String getTablePrefix() throws XPathExpressionException {
        if(_tablePrefix==null){
            Node tablePrefixNode= XMLDocumentUtility.parseForNode(xmlDocument,"/Config/TableConfig/Default/TablePrefix");
            _tablePrefix= XMLDocumentUtility.getAttribute(tablePrefixNode,"Value");
        }
        return _tablePrefix;
    }

    @Override
    public boolean getResolveSQLEnable() throws IOException, SAXException, ParserConfigurationException, XPathExpressionException {
        //重新加载配置文件
        loadDocument();
        Node resolveSQLEnableNode= XMLDocumentUtility.parseForNode(xmlDocument,"/Config/DataSetConfig/ResolveSQLEnable");
        if(XMLDocumentUtility.getAttribute(resolveSQLEnableNode,"Value").toLowerCase().equals("true")){
            return true;
        }
        return false;
    }
}
