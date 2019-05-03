package com.jbuild4d.platform.builder.htmldesign.webform.control;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.htmldesign.HTMLControl;
import com.jbuild4d.platform.builder.htmldesign.IHTMLControl;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.RecordDataVo;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import com.jbuild4d.platform.system.service.IDictionaryService;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;

public class WebFormTextBoxControl extends HTMLControl implements IHTMLControl {

    @Autowired
    IDictionaryService dictionaryService;

    @Override
    public void resolve(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) {
        System.out.println(sourceHTML);
        singleControlElem.tagName("input");
        singleControlElem.text("");
        singleControlElem.attr("type","text");
    }

    @Override
    public void dynamicBind(JB4DSession jb4DSession, FormResourceEntity record, Document doc, Element singleControlElem, RecordDataVo recordDataVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo) {

    }
}
