package com.jbuild4d.platform.builder.htmldesign;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.RecordDataVo;

public interface IHTMLRuntimeResolve {
    String resolveSourceHTML(JB4DSession jb4DSession, String id, String htmlSource);

    String dynamicBind(JB4DSession jb4DSession, String id, String resolveHtml);
}
