package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.tools.common.XMLUtility;
import com.jbuild4d.platform.builder.service.IBuilderConfigService;
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
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public class BuilderConfigServiceImpl implements IBuilderConfigService {
    static String configResouce="BuilderConfig.xml";
    static Document xmlDocuemnt=null;
    static String _tablePrefix=null;

    public BuilderConfigServiceImpl() throws ParserConfigurationException, SAXException, IOException {
        if(xmlDocuemnt==null) {
            InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(configResouce);
            xmlDocuemnt = XMLUtility.parseForDoc(inputStream);
        }
    }

    @Override
    public String getTablePrefix() throws XPathExpressionException {
        if(_tablePrefix==null){
            Node tablePrefixNode=XMLUtility.parseForNode(xmlDocuemnt,"/Config/TableConfig/Default/TablePrefix");
            _tablePrefix=XMLUtility.getAttribute(tablePrefixNode,"Value");
        }
        return _tablePrefix;
    }
}
