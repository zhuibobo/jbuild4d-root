package com.jbuild4d.platform.builder.weblist;

import com.jbuild4d.base.dbaccess.dbentities.builder.ListResourceEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/18
 * To change this template use File | Settings | File Templates.
 */
public interface IListResourceService extends IBaseService<ListResourceEntity> {
    String getFormPreviewHTMLContent(JB4DSession session, String listId) throws JBuild4DGenerallyException;

    String getListRuntimeHTMLContent(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException;
}
