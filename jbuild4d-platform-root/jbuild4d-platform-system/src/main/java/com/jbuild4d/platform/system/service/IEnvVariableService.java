package com.jbuild4d.platform.system.service;

import com.jbuild4d.platform.system.vo.EnvVariableVo;

import javax.xml.xpath.XPathExpressionException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/3
 * To change this template use File | Settings | File Templates.
 */
public interface IEnvVariableService {
    List<EnvVariableVo> getDateTimeVars() throws XPathExpressionException;

    List<EnvVariableVo> getAPIVars() throws XPathExpressionException;
}
