package com.jbuild4d.platform.builder.webformdesign.control;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.RecordDataVo;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public interface IWebFormControl {
    void resolve(JB4DSession jb4DSession, FormResourceEntityWithBLOBs record, Document doc, Element singleControlElem, HtmlControlDefinitionVo htmlControlPluginDefinitionVo);

    void dynamicBind(JB4DSession jb4DSession, FormResourceEntityWithBLOBs record, Document doc, Element singleControlElem, RecordDataVo recordDataVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo);
}
