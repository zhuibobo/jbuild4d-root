package com.jbuild4d.sso.web.client.demo1;

import com.jbuild4d.sso.client.filter.SsoWebFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SsoConfig {
    @Value("${xxl.sso.server}")
    private String xxlSsoServer;

    @Value("${xxl.sso.logout.path}")
    private String xxlSsoLogoutPath;

    @Value("${xxl-sso.excluded.paths}")
    private String xxlSsoExcludedPaths;

    @Value("${xxl.sso.redis.address}")
    private String xxlSsoRedisAddress;

    @Bean
    public FilterRegistrationBean xxlSsoFilterRegistration() {
        // xxl-sso, filter init
        FilterRegistrationBean registration = new FilterRegistrationBean();

        registration.setName("XxlSsoWebFilter");
        registration.setOrder(1);
        registration.addUrlPatterns("/*");
        registration.setFilter(new SsoWebFilter());
        registration.addInitParameter(SsoWebFilter.KEY_SSO_SERVER, xxlSsoServer);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_LOGOUT_PATH, xxlSsoLogoutPath);
        registration.addInitParameter(SsoWebFilter.KEY_SSO_EXCLUDED_PATHS, xxlSsoExcludedPaths);

        return registration;
    }
}
