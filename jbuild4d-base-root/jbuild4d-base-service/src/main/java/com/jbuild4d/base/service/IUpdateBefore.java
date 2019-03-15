package com.jbuild4d.base.service;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/17
 * To change this template use File | Settings | File Templates.
 */
public interface IUpdateBefore <T> {
    T run(JB4DSession jb4DSession, T sourceEntity) throws JBuild4DGenerallyException;
}
