package com.jbuild4d.platform.builder.dataset;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;

import javax.xml.xpath.XPathExpressionException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public interface IDataSetColumnCaptionConfigService {
    String getCaption(String columnName) throws XPathExpressionException, JBuild4DGenerallyException;
}
