package com.jbuild4d.web.platform.rest.builder.form;

import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.webformdesign.IFormResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/FormRuntime")
public class FormRuntimeRestResource {

    @Autowired
    IFormResourceService formResourceService;

    @RequestMapping("/FormPreview")
    public String getFormPreviewHTMLContent(String formId) throws JBuild4DGenerallyException {
        return formResourceService.getFormPreviewHTMLContent(JB4DSessionUtility.getSession(),formId);
    }
}
