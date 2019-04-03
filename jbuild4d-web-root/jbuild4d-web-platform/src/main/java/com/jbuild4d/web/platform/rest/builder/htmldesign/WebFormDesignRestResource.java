package com.jbuild4d.web.platform.rest.builder.htmldesign;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.htmldesign.ICKEditorPluginsService;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.platform.builder.htmldesign.IHTMLDesignThemesService;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/HtmlDesign/WebFormDesign")
public class WebFormDesignRestResource {

    @Autowired
    ICKEditorPluginsService ckEditorPluginsService;

    @Autowired
    IHTMLDesignThemesService htmlDesignThemesService;

    @RequestMapping(value = "/GetPluginsConfig")
    public JBuild4DResponseVo getPluginsConfig() throws JBuild4DGenerallyException, JAXBException {
        JBuild4DResponseVo responseVo=JBuild4DResponseVo.success("获取插件定义成功!",ckEditorPluginsService.getWebFormControlVoList());

        Map<String,Object> exKVData=new HashMap<>();
        exKVData.put("designThemes",htmlDesignThemesService.getDesignThemeList());
        responseVo.setExKVData(exKVData);

        return responseVo;
    }
}
