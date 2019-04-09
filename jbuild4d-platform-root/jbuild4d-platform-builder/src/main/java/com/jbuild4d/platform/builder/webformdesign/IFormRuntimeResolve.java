package com.jbuild4d.platform.builder.webformdesign;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.core.base.session.JB4DSession;

public interface IFormRuntimeResolve {
    String resolveSourceHTML(JB4DSession jb4DSession, String id, FormResourceEntityWithBLOBs record);
}
