package com.jbuild4d.platform.builder.webformdesign.control;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.core.base.session.JB4DSession;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public interface IWebFormControl {
    void resolve(JB4DSession jb4DSession, FormResourceEntityWithBLOBs record, Document doc, Element singleControlElem);
}
