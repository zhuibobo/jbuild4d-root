package com.jbuild4d.sso.client.conf;

import com.jbuild4d.core.base.vo.JBuild4DResponseVo;

/**
 * conf
 *
 * @author xuxueli 2018-04-02 19:18:04
 */
public class Conf {

    /**
     * sso sessionid, between browser and sso-server (web + token client)
     */
    public static final String SSO_SESSION_STORE_KEY = "jbuild4d_sso_session_id";


    /**
     * redirect url (web client)
     */
    public static final String SSO_REDIRECT_URL = "redirect_url";

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
