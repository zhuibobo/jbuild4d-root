package com.jbuild4d.platform.system.apivariable.impl;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.system.apivariable.IAPIVariableCreater;
import com.jbuild4d.platform.system.vo.EnvVariableVo;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class UserSessionVariableCreater implements IAPIVariableCreater {
    @Override
    public String createVar(JB4DSession jb4DSession, EnvVariableVo vo) throws JBuild4DGenerallyException {
        if(vo.getPara().equals("ApiVarCurrentUserOrganId")){
            return jb4DSession.getOrganId();
        }
        else if(vo.getPara().equals("ApiVarCurrentUserOrganName")){
            return jb4DSession.getOrganName();
        }
        else if(vo.getPara().equals("ApiVarCurrentUserId")){
            return jb4DSession.getUserId();
        }
        else if(vo.getPara().equals("ApiVarCurrentUserName")){
            return jb4DSession.getUserName();
        }
        throw new JBuild4DGenerallyException("UserSessionVariableCreater.createVar中无法根据"+vo.getPara()+"查询到对应的数据！");
    }
}
