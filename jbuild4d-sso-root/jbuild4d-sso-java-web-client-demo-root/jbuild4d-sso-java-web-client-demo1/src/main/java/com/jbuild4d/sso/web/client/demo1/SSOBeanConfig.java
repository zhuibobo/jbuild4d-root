package com.jbuild4d.sso.web.client.demo1;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.sso.client.conf.Conf;
import com.jbuild4d.sso.client.extend.ICheckSessionSuccess;
import com.jbuild4d.sso.client.filter.SsoWebFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

@Configuration
public class SSOBeanConfig {

    @Value("${jbuild4d.sso.server}")
    private String ssoServer;

    @Value("${jbuild4d.sso.login.path}")
    private String ssoLoginPath;

    @Value("${jbuild4d.sso.logout.path}")
    private String ssoLogoutPath;

    @Value("${jbuild4d.sso.excluded.paths}")
    private String ssoExcludedPaths;

    @Value("${jbuild4d.sso.server.rest.base.path}")
    private String restBasePath;

    @Bean
    public FilterRegistrationBean xxlSsoFilterRegistration() {
        // xxl-sso, filter init
        FilterRegistrationBean registration = new FilterRegistrationBean();

        registration.setName("XxlSsoWebFilter");
        registration.setOrder(1);
        registration.addUrlPatterns("/*");
        SsoWebFilter filter = new SsoWebFilter();
        filter.setCheckSessionSuccess(new ICheckSessionSuccess() {
            @Override
            public void run(ServletRequest request, ServletResponse response, FilterChain chain, JB4DSession jb4DSession) {
                System.out.println("重远程获取Session完成,用户:"+jb4DSession.getUserName());
            }
        });
        registration.setFilter(filter);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_SERVER, ssoServer);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_LOGIN_PATH,ssoLoginPath);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_LOGOUT_PATH, ssoLogoutPath);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_EXCLUDED_PATHS, ssoExcludedPaths);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_REST_BASE_PATH,restBasePath);

        return registration;
    }

}
