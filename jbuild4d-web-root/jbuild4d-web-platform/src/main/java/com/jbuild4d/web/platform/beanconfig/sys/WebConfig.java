package com.jbuild4d.web.platform.beanconfig.sys;

import com.jbuild4d.base.tools.common.PathUtility;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: zhuangrb
 * @Date: 2017/12/11
 * @Description:
 * @Version 1.0.0
 */
@Configuration
@EnableWebMvc
@ComponentScan("com.jbuild4d.web")
public class WebConfig extends WebMvcConfigurerAdapter {

    @Bean
    public ViewResolver viewResolver(){
        InternalResourceViewResolver resolver=new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/Views/");
        resolver.setViewClass(JstlView.class);
        resolver.setSuffix(".jsp");
        //可以在JSP页面中通过${}访问beans
        resolver.setExposeContextBeansAsAttributes(true);
        return resolver;
    }

/*    @Bean
    public PathUtility pathUtility(WebApplicationContext context){
        PathUtility pathUtility=new PathUtility();
        pathUtility.setContext(context);
        return pathUtility;
    }*/

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable(); //配置静态文件处理
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        super.configureMessageConverters(converters);
        converters.add(extendConverter());
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //registry.addInterceptor(new InterceptorDemo1());
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        super.addFormatters(registry);
        //registry.addConverter(new PersonConverter());

        /*AddressFormatter addressFormatter = new AddressFormatter();
        addressFormatter.setStyle(AddressFormatter.Style.FULL);
        registry.addFormatter(addressFormatter);*/
    }

    @Bean
    public MultipartResolver multipartResolver(){
        CommonsMultipartResolver multipartResolver=new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(100000000);
        return multipartResolver;
    }

    /*@Bean
    public MessageSource messageSource() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("messages");
        return messageSource;
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
