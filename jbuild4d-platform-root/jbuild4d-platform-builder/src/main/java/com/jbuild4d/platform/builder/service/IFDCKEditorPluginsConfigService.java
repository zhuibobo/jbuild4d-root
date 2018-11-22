package com.jbuild4d.platform.builder.service;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.vo.WebFormControlDefinitionVo;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */
public interface IFDCKEditorPluginsConfigService {
    List<WebFormControlDefinitionVo> getVoListFromCache() throws JBuild4DGenerallyException;
}
