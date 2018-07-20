package com.jbuild4d.web.platform.controlleradvice;

import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.NativeWebRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/20
 * To change this template use File | Settings | File Templates.
 */

@ControllerAdvice
public class ExceptionControllerAdvice {

    @ExceptionHandler(JBuild4DGenerallyException.class)
    public void processUnauthenticatedException(HttpServletResponse response,NativeWebRequest request, JBuild4DGenerallyException e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        try {
            response.getWriter().print(JsonUtility.toObjectString(JBuild4DResponseVo.error(e.getMessage())));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        //return JBuild4DResponseVo.error(e.getMessage());
        //return "UnauthenticatedExceptionView"; //返回一个逻辑视图名
    }
}
