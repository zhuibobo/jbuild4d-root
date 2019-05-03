package com.jbuild4d.platform.builder.htmldesign;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.HtmlControlDefinitionVo;
import com.jbuild4d.platform.builder.vo.RecordDataVo;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public interface IHTMLControl {
    void resolve(JB4DSession jb4DSession, FormResourceEntity formResourceEntity, Document doc, Element singleControlElem, Element parentElem, Element lastParentJbuild4dCustomElem);

    void dynamicBind(JB4DSession jb4DSession, FormResourceEntity record, Document doc, Element singleControlElem, RecordDataVo recordDataVo, HtmlControlDefinitionVo htmlControlPluginDefinitionVo);
}
