package com.jbuild4d.platform.system.extend.apivariable;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.system.vo.EnvVariableVo;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public interface IAPIVariableCreater {
    Document doc=null;
    Node node=null;

    String createVar(JB4DSession jb4DSession, EnvVariableVo vo) throws JBuild4DGenerallyException;
}
