package com.jbuild4d.web.platform.rest.builder.button;

import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.platform.builder.button.api.ButtonAPIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/Button/ButtonApi")
public class ButtonAPIRestResource {

    @Autowired
    ButtonAPIService buttonAPIService;

    @RequestMapping(value = "/GetButtonApiConfig")
    public JBuild4DResponseVo getButtonAPIConfig() throws JAXBException {
        JBuild4DResponseVo responseVo=JBuild4DResponseVo.success("获取按钮API定义成功!",buttonAPIService.getButtonAPIGroupList());
        return responseVo;
    }
}
