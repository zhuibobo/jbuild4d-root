package com.jbuild4d.web.platform.beanconfig.sys;

import com.jbuild4d.base.tools.BeanUtility;
import com.jbuild4d.base.tools.PathUtility;
import com.jbuild4d.web.platform.beanconfig.service.SSOBeansConfig;
import com.jbuild4d.web.platform.interceptor.LoginedInterceptor;
import com.jbuild4d.web.platform.interceptor.SSOLoginedInterceptor;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: zhuangrb
 * @Date: 2017/12/11
 * @Description:
 * @Version 1.0.0
 */
@Configuration
/*@EnableWebMvc*/
@ComponentScan("com.jbuild4d.web")
@AutoConfigureBefore(SSOBeansConfig.class)
public class WebConfig implements WebMvcConfigurer {

    /*@Bean
    public ViewResolver viewResolver(){
        InternalResourceViewResolver resolver=new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/Views/");
        resolver.setViewClass(JstlView.class);
        resolver.setSuffix(".jsp");
        //可以在JSP页面中通过${}访问beans
        resolver.setExposeContextBeansAsAttributes(true);
        return resolver;
    }*/

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseRegisteredSuffixPatternMatch(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }

    @Bean
    public PathUtility pathUtility(WebApplicationContext context){
        PathUtility pathUtility=new PathUtility();
        pathUtility.setContext(context);
        return pathUtility;
    }

    @Bean
    public BeanUtility beanUtility(WebApplicationContext context){
        BeanUtility beanUtility=new BeanUtility();
        beanUtility.setContext(context);
        return beanUtility;
    }

    /*@Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable(); //配置静态文件处理
    }*/

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        //super.configureMessageConverters(converters);
        converters.add(extendConverter());
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginedInterceptor());
        registry.addInterceptor(new SSOLoginedInterceptor());
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        //super.addFormatters(registry);
    }

    /*@Bean
    public MultipartResolver multipartResolver(){
        CommonsMultipartResolver multipartResolver=new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(100000000);
        //multipartResolver.setUploadTempDir();
        return multipartResolver;
    }*/

    @Bean
    MappingJackson2HttpMessageConverter extendConverter() {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        List<MediaType> supportedMediaTypes=new ArrayList<>();
        supportedMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
        supportedMediaTypes.add(MediaType.valueOf("text/html;charset=UTF-8"));
        converter.setSupportedMediaTypes(supportedMediaTypes);
        return converter;
    }
}
