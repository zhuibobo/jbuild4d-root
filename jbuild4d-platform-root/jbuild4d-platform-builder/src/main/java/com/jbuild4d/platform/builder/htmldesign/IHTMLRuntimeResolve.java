package com.jbuild4d.platform.builder.htmldesign;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.RecordDataVo;
import com.jbuild4d.platform.builder.vo.ResolveHTMLControlContextVo;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public interface IHTMLRuntimeResolve {
    String resolveSourceHTML(JB4DSession jb4DSession, String id, String htmlSource) throws JBuild4DGenerallyException;

    //Element lastParentJbuild4dCustomElem=null;
    //void loopResolveElem(JB4DSession jb4DSession, Document doc, Element parentElem, String sourceHTML, Element lastParentJbuild4dCustomElem, ResolveHTMLControlContextVo resolveHTMLControlContextVo) throws JBuild4DGenerallyException;

    String dynamicBind(JB4DSession jb4DSession, String id, String resolveHtml);
}
