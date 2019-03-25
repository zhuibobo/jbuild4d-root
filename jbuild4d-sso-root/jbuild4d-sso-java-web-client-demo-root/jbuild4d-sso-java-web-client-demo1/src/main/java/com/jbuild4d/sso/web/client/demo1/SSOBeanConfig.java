package com.jbuild4d.sso.web.client.demo1;

import com.jbuild4d.sso.client.filter.SsoWebFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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

    /*@Value("${xxl.sso.redis.address}")
    private String xxlSsoRedisAddress;*/

    @Bean
    public FilterRegistrationBean xxlSsoFilterRegistration() {
        // xxl-sso, filter init
        FilterRegistrationBean registration = new FilterRegistrationBean();

        registration.setName("XxlSsoWebFilter");
        registration.setOrder(1);
        registration.addUrlPatterns("/*");
        registration.setFilter(new SsoWebFilter());
        registration.addInitParameter(SsoWebFilter.KEY_SSO_SERVER, ssoServer);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_LOGIN_PATH,ssoLoginPath);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_LOGOUT_PATH, ssoLogoutPath);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_EXCLUDED_PATHS, ssoExcludedPaths);

        return registration;
    }

}
