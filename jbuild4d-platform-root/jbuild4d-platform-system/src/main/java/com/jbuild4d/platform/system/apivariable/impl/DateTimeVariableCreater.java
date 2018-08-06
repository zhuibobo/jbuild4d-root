package com.jbuild4d.platform.system.apivariable.impl;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.system.apivariable.IAPIVariableCreater;
import com.jbuild4d.platform.system.vo.EnvVariableVo;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
public class DateTimeVariableCreater implements IAPIVariableCreater {

    @Override
    public String createVar(JB4DSession jb4DSession, EnvVariableVo vo) throws JBuild4DGenerallyException {
        try {
            String result;
            Date date = new Date();
            SimpleDateFormat formater = new SimpleDateFormat();
            formater.applyPattern(vo.getPara());
            result = formater.format(date);
            return result;
        }
        catch (Exception ex){
            throw new JBuild4DGenerallyException("com.jbuild4d.platform.system.apivariable.impl.DateTimeVariableCreater Error:"+ex.getMessage());
        }
    }
}
