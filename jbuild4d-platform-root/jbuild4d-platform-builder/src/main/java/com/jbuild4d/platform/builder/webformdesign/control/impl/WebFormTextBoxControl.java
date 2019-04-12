package com.jbuild4d.platform.builder.webformdesign.control.impl;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.RecordDataVo;
import com.jbuild4d.platform.builder.webformdesign.control.IWebFormControl;
import com.jbuild4d.platform.builder.webformdesign.control.WebFormControl;
import com.jbuild4d.platform.system.service.IDictionaryService;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;

public class WebFormTextBoxControl extends WebFormControl implements IWebFormControl {

    @Autowired
    IDictionaryService dictionaryService;

    @Override
    public void resolve(JB4DSession jb4DSession, FormResourceEntityWithBLOBs record, Document doc, Element singleControlElem, HtmlControlDefinitionVo htmlControlPluginDefinitionVo) {
        System.out.println(record.getFormHtmlSource());
        singleControlElem.tagName("input");
        singleControlElem.text("");
        singleControlElem.attr("type","text");
    }

    @Override
    public void dynamicBind(JB4DSession jb4DSession, FormResourceEntityWithBLOBs record, Document doc, Element singleControlElem, RecordDataVo recordDataVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo) {

    }
}
