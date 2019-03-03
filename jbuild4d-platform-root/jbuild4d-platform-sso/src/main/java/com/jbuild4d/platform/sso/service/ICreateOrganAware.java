package com.jbuild4d.platform.sso.service;

import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.service.general.JB4DSession;

public interface ICreateOrganAware {
     boolean organCreated(JB4DSession jb4DSession, OrganEntity organEntity);
}
