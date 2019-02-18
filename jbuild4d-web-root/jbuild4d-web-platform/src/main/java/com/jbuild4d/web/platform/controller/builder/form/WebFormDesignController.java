package com.jbuild4d.web.platform.controller.builder.form;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.htmldesign.IFDCKEditorPluginsService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/PlatForm/Builder/WebFormDesign")
public class WebFormDesignController {

    @Autowired
    IFDCKEditorPluginsService fdckEditorPluginsService;

    @RequestMapping(value = "/GetPluginsConfig")
    @ResponseBody
    public JBuild4DResponseVo getPluginsConfig() throws JBuild4DGenerallyException {
        return JBuild4DResponseVo.success("获取插件定义成功!",fdckEditorPluginsService.getVoList());
    }
}
