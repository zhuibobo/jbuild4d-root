package com.jbuild4d.platform.sso.service1;

import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.core.base.session.JB4DSession;

public interface IOnOrganChangeAware {
     boolean organCreated(JB4DSession jb4DSession, OrganEntity organEntity);
     boolean organUpdated(JB4DSession jb4DSession,OrganEntity organEntity);
}
