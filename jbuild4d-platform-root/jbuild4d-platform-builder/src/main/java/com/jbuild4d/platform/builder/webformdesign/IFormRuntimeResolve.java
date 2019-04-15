package com.jbuild4d.platform.builder.webformdesign;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.RecordDataVo;

public interface IFormRuntimeResolve {
    String resolveSourceHTML(JB4DSession jb4DSession, String id, FormResourceEntity record);

    String dynamicBind(JB4DSession jb4DSession, String id, FormResourceEntity record,String resolvedHtmlContent, RecordDataVo recordDataVo);
}
