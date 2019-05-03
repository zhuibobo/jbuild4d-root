package com.jbuild4d.platform.builder.htmldesign;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.DynamicBindHTMLControlContextVo;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public interface IHTMLControl {
    void resolve(JB4DSession jb4DSession,
                 String sourceHTML,
                 Document doc,
                 Element singleControlElem,
                 Element parentElem,
                 Element lastParentJbuild4dCustomElem,
                 ResolveHTMLControlContextVo resolveHTMLControlContextVo,
                 HtmlControlDefinitionVo htmlControlDefinitionVo);

    void dynamicBind(JB4DSession jb4DSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextVo dynamicBindHTMLControlContextVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo);
}
