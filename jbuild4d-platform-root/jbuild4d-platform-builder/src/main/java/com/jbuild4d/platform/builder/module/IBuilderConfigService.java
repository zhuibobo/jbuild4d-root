package com.jbuild4d.platform.builder.module;

import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface IBuilderConfigService {
    String getTablePrefix() throws XPathExpressionException;

    boolean getResolveSQLEnable() throws IOException, SAXException, ParserConfigurationException, XPathExpressionException;
}
