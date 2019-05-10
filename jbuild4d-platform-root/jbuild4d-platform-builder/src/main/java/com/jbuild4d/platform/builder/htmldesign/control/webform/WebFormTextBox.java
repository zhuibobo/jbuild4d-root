package com.jbuild4d.platform.builder.htmldesign.control.webform;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.htmldesign.control.HTMLControl;
import com.jbuild4d.platform.builder.htmldesign.control.IHTMLControl;
import com.jbuild4d.platform.builder.vo.DynamicBindHTMLControlContextVo;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import com.jbuild4d.platform.system.service.IDictionaryService;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;

public class WebFormTextBox extends HTMLControl implements IHTMLControl {

    @Autowired
    IDictionaryService dictionaryService;

    @Override
    public void resolveSelf(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {
        System.out.println(sourceHTML);
        singleControlElem.tagName("input");
        singleControlElem.text("");
        singleControlElem.attr("type","text");
    }

    @Override
    public void dynamicBind(JB4DSession jb4DSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextVo dynamicBindHTMLControlContextVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo) {

    }
}
