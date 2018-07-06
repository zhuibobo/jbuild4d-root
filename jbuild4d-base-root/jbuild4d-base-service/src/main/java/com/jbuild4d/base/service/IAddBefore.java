package com.jbuild4d.base.service;

import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;

public interface IAddBefore<T> {
     T run(T item) throws JBuild4DGenerallyException;
}
