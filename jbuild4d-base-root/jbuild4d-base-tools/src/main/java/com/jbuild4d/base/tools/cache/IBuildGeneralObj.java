package com.jbuild4d.base.tools.cache;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;

public interface IBuildGeneralObj<T> {
    T BuildObj() throws JBuild4DGenerallyException;
}
