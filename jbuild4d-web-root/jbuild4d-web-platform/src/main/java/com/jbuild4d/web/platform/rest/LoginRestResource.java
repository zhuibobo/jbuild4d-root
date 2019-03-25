package com.jbuild4d.web.platform.rest;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.sso.core.ISSOLoginStore;
import com.jbuild4d.platform.sso.core.vo.SSOCodeVo;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.platform.system.service.IOperationLogService;
import com.jbuild4d.web.platform.controller.LoginController;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;


@Api(value="/PlatFormRest", tags="登录接口模块")
@RestController
@RequestMapping(value = "/PlatFormRest")
public class LoginRestResource {
    Logger logger = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    IMenuService menuService;

    @Autowired
    IOperationLogService operationLogService;

    @Autowired
    ISSOLoginStore ssoLoginStore;

    @ApiOperation(value="验证用户", notes = "验证用户")
    @ApiImplicitParam(name="user", value="User", required = true, dataType = "User")
    @RequestMapping(value = "/ValidateAccount", method = RequestMethod.POST)
    public JBuild4DResponseVo validateAccount(String account, String password, HttpServletRequest request) throws IOException, ParseException, JBuild4DGenerallyException {
        JB4DSession b4DSession = new JB4DSession();
        b4DSession.setOrganName("4D");
        b4DSession.setOrganId("OrganId");
        b4DSession.setUserName("Alex");
        b4DSession.setUserId("UserId");
        JB4DSessionUtility.addSessionAttr(JB4DSessionUtility.UserLoginSessionKey, b4DSession);
        request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();
        //List<MenuEntity> entityList=menuService.getALL(jb4DSession);
        //System.out.println(JsonUtility.toObjectString(entityList));
        operationLogService.writeUserLoginLog(jb4DSession,this.getClass(),request);
        return JBuild4DResponseVo.opSuccess();
    }

    @ApiOperation(value="验证用户", notes = "验证用户")
    @ApiImplicitParam(name="user", value="User", required = true, dataType = "User")
    @RequestMapping(value = "/ValidateAccountSSO", method = RequestMethod.POST)
    public JBuild4DResponseVo validateAccountSSO(String account, String password,String redirectUrl,String appId, HttpServletRequest request) throws IOException, ParseException, JBuild4DGenerallyException {
        JB4DSession b4DSession = new JB4DSession();
        b4DSession.setOrganName("4D");
        b4DSession.setOrganId("OrganId");
        b4DSession.setUserName("Alex");
        b4DSession.setUserId("UserId");
        JB4DSessionUtility.addSessionAttr(JB4DSessionUtility.UserLoginSessionKey, b4DSession);

        JB4DSession jb4DSession=JB4DSessionUtility.getSession();
        SSOCodeVo code=ssoLoginStore.createAccessCode(jb4DSession,redirectUrl,appId);

        request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
        operationLogService.writeUserLoginLog(jb4DSession,this.getClass(),request);
        return JBuild4DResponseVo.opSuccess(code);
    }
}
