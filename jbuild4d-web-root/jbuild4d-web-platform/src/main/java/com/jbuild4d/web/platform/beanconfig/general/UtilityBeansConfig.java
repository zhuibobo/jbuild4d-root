package com.jbuild4d.web.platform.beanconfig.general;

import com.jbuild4d.base.tools.common.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.WebApplicationContext;

@Configuration("WebGeneralUtilityBeansConfig")
public class UtilityBeansConfig {
    @Bean
    public ClassUtility classUtility() {
        ClassUtility classUtility=new ClassUtility();
        return classUtility;
    }

    @Bean
    public DateUtility dateUtility() {
        DateUtility dateUtility=new DateUtility();
        return dateUtility;
    }

    @Bean
    public InetAddressUtility inetAddressUtility() {
        InetAddressUtility inetAddressUtility=new InetAddressUtility();
        return inetAddressUtility;
    }

    @Bean
    public JsonUtility jsonUtility() {
        JsonUtility jsonUtility=new JsonUtility();
        return jsonUtility;
    }

    @Bean
    public MD5Utility md5Utility() {
        MD5Utility md5Utility=new MD5Utility();
        return md5Utility;
    }

    @Bean
    public PathUtility pathUtility(WebApplicationContext context) {
        PathUtility pathUtility=new PathUtility();
        pathUtility.setContext(context);
        return pathUtility;
    }

    /*@Bean
    public StringUtility stringUtility() {
        StringUtility stringUtility=new StringUtility();
        return stringUtility;
    }*/

    @Bean
    public UUIDUtility uuidUtility() {
        UUIDUtility uuidUtility=new UUIDUtility();
        return uuidUtility;
    }

    @Bean
    public XMLUtility xmlUtility() {
        XMLUtility xmlUtility=new XMLUtility();
        return xmlUtility;
    }
}
