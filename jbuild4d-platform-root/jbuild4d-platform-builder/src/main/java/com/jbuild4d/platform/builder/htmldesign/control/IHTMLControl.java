package com.jbuild4d.platform.builder.htmldesign.control;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.DynamicBindHTMLControlContextVo;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public interface IHTMLControl {

    void resolveSelf(JB4DSession jb4DSession,
                     String sourceHTML,
                     Document doc,
                     Element singleControlElem,
                     Element parentElem,
                     Element lastParentJbuild4dCustomElem,
                     ResolveHTMLControlContextVo resolveHTMLControlContextVo,
                     HtmlControlDefinitionVo htmlControlDefinitionVo);

    void dynamicBind(JB4DSession jb4DSession, String sourceHTML, String resolveHTML, Document doc, Element singleControlElem, DynamicBindHTMLControlContextVo dynamicBindHTMLControlContextVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo);

    void rendererChain(JB4DSession jb4DSession, String sourceHTML, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) throws JBuild4DGenerallyException;

    String parseToJson(JB4DSession jb4DSession,
                       String sourceHTML,
                       Document doc,
                       Element singleControlElem,
                       Element parentElem,
                       Element lastParentJbuild4dCustomElem,
                       ResolveHTMLControlContextVo resolveHTMLControlContextVo,
                       HtmlControlDefinitionVo htmlControlDefinitionVo);
}
