package com.jbuild4d.platform.builder.webformdesign;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.RecordDataVo;

public interface IFormRuntimeResolve {
    String resolveSourceHTML(JB4DSession jb4DSession, String id, FormResourceEntityWithBLOBs record);

    String dynamicBind(JB4DSession jb4DSession, String id, FormResourceEntityWithBLOBs record,String resolvedHtmlContent, RecordDataVo recordDataVo);
}
