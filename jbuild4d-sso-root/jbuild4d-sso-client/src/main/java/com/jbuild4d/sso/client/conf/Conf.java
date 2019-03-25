package com.jbuild4d.sso.client.conf;

import com.jbuild4d.core.base.vo.JBuild4DResponseVo;

/**
 * conf
 *
 * @author xuxueli 2018-04-02 19:18:04
 */
public class Conf {

    /**
     * 存储于Cookie中的key,value为当前Session的获取Code
     */
    public static final String SSO_SESSION_STORE_KEY = "jbuild4d_sso_session_id";

    /**
     * 返回到登录页面时,附带上的来源URL参数名
     */
    public static final String SSO_REDIRECT_URL = "redirectUrl";

    public static final String SSS_CODE_URL_PARA_NAME="JBuild4DSSOCode";

    public static String SSO_SERVER_ADDRESS="http://localhost:9091/jb4d";

    public static String SSO_REST_BASE="/PlatFormRest";

    /**
    *存储到本地Session中的Key,避免每次都通过Http进行请求.
    **/
    public static String SSO_LOCATION_SESSION_KEY="JBUILD4D_SSO_LOCATION_SESSION_KEY";

    /**
     * sso user, request attribute (web client)
     */
    //public static final String SSO_USER = "xxl_sso_user";



    /**
     * sso server address (web + token client)
     */
    //public static final String SSO_SERVER = "sso_server";

    /**
     * login url, server relative path (web client)
     */
    //public static final String SSO_LOGIN = "/login";
    /**
     * logout url, server relative path (web client)
     */
    //public static final String SSO_LOGOUT = "/logout";


    /**
     * logout path, client relatice path
     */
    //public static final String SSO_LOGOUT_PATH = "SSO_LOGOUT_PATH";

    /**
     * excluded paths, client relatice path, include path can be set by "filter-mapping"
     */
    //public static final String SSO_EXCLUDED_PATHS = "SSO_EXCLUDED_PATHS";


    /**
     * login fail result
     */
    public static final JBuild4DResponseVo SSO_LOGIN_FAIL_RESULT = new JBuild4DResponseVo(false, "sso not login.",null,501);

}
