package com.jbuild4d.base.service;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

public interface IAddBefore<T> {
     T run(JB4DSession jb4DSession, T sourceEntity) throws JBuild4DGenerallyException;
}
