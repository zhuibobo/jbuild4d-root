package com.jbuild4d.web.platform.beanconfig.jdbctemplate;

import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.beans.PropertyVetoException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
@Configuration
public class JdbcTemplateBeansConfig extends MybatisBeansConfig {

    @Bean
    public JdbcTemplate jdbcTemplate() throws PropertyVetoException {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(dataSourceBean());
        return jdbcTemplate;
    }
}
