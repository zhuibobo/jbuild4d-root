package com.jbuild4d.web.platform.beanconfig.resttemplate;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateBeansConfig {

    @Bean(name="httpClientFactory")
    public SimpleClientHttpRequestFactory simpleClientHttpRequestFactory(){
        SimpleClientHttpRequestFactory simpleClientHttpRequestFactory=new SimpleClientHttpRequestFactory();
        simpleClientHttpRequestFactory.setReadTimeout(10000);
        simpleClientHttpRequestFactory.setConnectTimeout(1000);
        return simpleClientHttpRequestFactory;
    }


    @Bean
    public RestTemplate restTemplate(SimpleClientHttpRequestFactory httpClientFactory){
        return new RestTemplate(httpClientFactory);
    }
}
