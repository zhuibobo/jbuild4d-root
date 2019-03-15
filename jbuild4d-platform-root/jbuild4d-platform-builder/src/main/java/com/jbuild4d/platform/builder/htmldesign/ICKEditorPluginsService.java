package com.jbuild4d.platform.builder.htmldesign;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/22
 * To change this template use File | Settings | File Templates.
 */
public interface ICKEditorPluginsService {
    List<HtmlControlDefinitionVo> getWebFormControlVoList() throws JBuild4DGenerallyException;

    List<HtmlControlDefinitionVo> getListControlVoList() throws JBuild4DGenerallyException;
}
