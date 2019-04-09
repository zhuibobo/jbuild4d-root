package com.jbuild4d.platform.builder.webformdesign;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.RecordDataVo;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
public interface IFormResourceService extends IBaseService<FormResourceEntityWithBLOBs> {
    String getFormPreviewHTMLContent(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException;

    String getFormRuntimeHTMLContent(JB4DSession jb4DSession, String id, RecordDataVo recordDataVo) throws JBuild4DGenerallyException;
}
