package com.jbuild4d.platform.builder.webformdesign.control.impl;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.webformdesign.control.IWebFormControl;
import com.jbuild4d.platform.builder.webformdesign.control.WebFormControl;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class WebFormTextBoxControl extends WebFormControl implements IWebFormControl {
    @Override
    public void resolve(JB4DSession jb4DSession, FormResourceEntityWithBLOBs record, Document doc, Element singleControlElem) {
        System.out.println(record.getFormHtmlSource());
        singleControlElem.tagName("input");
    }
}
