package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.DatabaseLinkMapper;
import com.jbuild4d.base.dbaccess.dao.MenuMapper;
import com.jbuild4d.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.impl.SQLBuilderServiceImpl;
import com.jbuild4d.platform.builder.service.IDatabaseLinkService;
import com.jbuild4d.platform.builder.service.impl.DatabaseLinkServiceImpl;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.platform.system.service.impl.MenuServiceImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
@Configuration
@EnableTransactionManagement
public class BuildBeansConfig {

    @Bean
    public IDatabaseLinkService databaseLinkService(ISQLBuilderService _sqlBuilderService, DatabaseLinkMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IDatabaseLinkService bean=new DatabaseLinkServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }
}
