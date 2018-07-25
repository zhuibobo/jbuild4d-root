package com.jbuild4d.platform.system.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.dbaccess.dbentities.OperationLogEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;

import javax.servlet.http.HttpServletRequest;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
public interface IOperationLogService extends IBaseService<OperationLogEntity> {
    void writeUserLoginLog(JB4DSession jb4DSession,Class targetClass,HttpServletRequest request) throws JsonProcessingException, JBuild4DGenerallyException;
}
