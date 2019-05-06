package com.jbuild4d.web.platform.rest.builder.list;

import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.webform.IFormResourceService;
import com.jbuild4d.platform.builder.weblist.IListResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/ListRuntime")
public class ListRuntimeRestResource {
    @Autowired
    IListResourceService listResourceService;

    @RequestMapping("/ListPreview")
    public String getListPreviewHTMLContent(String listId) throws JBuild4DGenerallyException {
        return listResourceService.getFormPreviewHTMLContent(JB4DSessionUtility.getSession(),listId);
    }
}
