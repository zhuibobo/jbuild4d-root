package com.jbuild4d.base.service;

import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;

public interface IAddBefore<T> {
     T run(JB4DSession jb4DSession, T item) throws JBuild4DGenerallyException;
}
