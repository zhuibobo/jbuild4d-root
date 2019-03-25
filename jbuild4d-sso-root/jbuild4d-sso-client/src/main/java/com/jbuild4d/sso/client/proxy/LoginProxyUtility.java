package com.jbuild4d.sso.client.proxy;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.tools.CookieUtility;
import com.jbuild4d.sso.client.conf.Conf;
import com.jbuild4d.sso.client.utils.HttpClientUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

public class LoginProxyUtility {

    public static JB4DSession loginCheck(HttpServletRequest request, HttpServletResponse response) {

        String sessionCode = CookieUtility.getValue(request, Conf.SSO_SESSION_STORE_KEY);

        //如果URL中带有SSSCode的参数,则使用该参数尝试获取用户信息
        if(sessionCode==null||sessionCode.equals("")){
            sessionCode=request.getParameter(Conf.SSS_CODE_URL_PARA_NAME);
        }

        if(sessionCode==null||sessionCode.equals("")){
            return null;
        }

        //通过sessionCode到服务端获取用户的信息
        String url=Conf.SSO_SERVER_ADDRESS+Conf.SSO_REST_BASE+"/SSO/Session/GetSession";

        Map<String,String> sendData=new HashMap<String,String>();
        sendData.put(Conf.SSS_CODE_URL_PARA_NAME,sessionCode);
        String httpResult=HttpClientUtil.getHttpPostResult(url,sendData,true);

        //将sessionCode写入Cookie中
        CookieUtility.set(response,Conf.SSO_SESSION_STORE_KEY,sessionCode,false);

        //如果获取到用户,则返回用户.

        //如果获取不到用户,则
        return null;
    }
}
