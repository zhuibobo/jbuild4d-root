package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.DatabaseServiceLinkMapper;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.builder.service.IDatabaseServiceLinkService;
import com.jbuild4d.platform.builder.service.impl.DatabaseServiceLinkServiceImpl;
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
    public IDatabaseServiceLinkService organTypeService(ISQLBuilderService _sqlBuilderService, DatabaseServiceLinkMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IDatabaseServiceLinkService bean=new DatabaseServiceLinkServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }
}
