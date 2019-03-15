package com.jbuild4d.platform.system.service;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.system.vo.EnvVariableVo;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/3
 * To change this template use File | Settings | File Templates.
 */
public interface IEnvVariableService {
    List<EnvVariableVo> getDateTimeVars() throws JBuild4DGenerallyException;

    List<EnvVariableVo> getAPIVars() throws XPathExpressionException, ParserConfigurationException, IOException, SAXException, JBuild4DGenerallyException;

    String execEnvVarResult(JB4DSession jb4DSession, String value) throws XPathExpressionException, JBuild4DGenerallyException, IOException, SAXException, ParserConfigurationException;

    String getValueByName(String name) throws XPathExpressionException, ParserConfigurationException, IOException, SAXException, JBuild4DGenerallyException;
}
