package com.jbuild4d.sso.client.proxy;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.tools.CookieUtility;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.sso.client.conf.Conf;
import com.jbuild4d.sso.client.utils.HttpClientUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class LoginProxyUtility {

    public static JB4DSession loginCheck(HttpServletRequest request, HttpServletResponse response) throws Exception {

        JB4DSession jb4DSession=null;

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

        ObjectMapper objectMapper = new ObjectMapper();
        JBuild4DResponseVo jBuild4DResponseVo=objectMapper.readValue(httpResult, JBuild4DResponseVo.class);
        if(jBuild4DResponseVo.isSuccess()){
            jb4DSession = objectMapper.convertValue(jBuild4DResponseVo.getData(), JB4DSession.class);
            //jb4DSession=(JB4DSession)jBuild4DResponseVo.getData();
        }
        else{
            throw new Exception("SSO服务端错误:"+jBuild4DResponseVo.getMessage());
        }

        //将sessionCode写入Cookie中
        CookieUtility.set(response,Conf.SSO_SESSION_STORE_KEY,sessionCode,false);

        return jb4DSession;
    }
}
