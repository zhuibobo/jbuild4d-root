package com.jbuild4d.platform.builder.service;

import javax.xml.xpath.XPathExpressionException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public interface IBuilderDataSetColumnCaptionConfigService {
    String getCaption(String columnName) throws XPathExpressionException;
}
