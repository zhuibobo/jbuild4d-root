package com.jbuild4d.platform.builder.htmldesign.control;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.DynamicBindHTMLControlContextVo;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class BodyControl extends HTMLControl implements IHTMLControl {

    public static BodyControl getInstance(){
        return new BodyControl();
    }

    @Override
    public void resolveSelf(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo, HtmlControlDefinitionVo htmlControlDefinitionVo) {

    }

    @Override
    public void dynamicBind(JB4DSession jb4DSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextVo dynamicBindHTMLControlContextVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo) {

    }
}
