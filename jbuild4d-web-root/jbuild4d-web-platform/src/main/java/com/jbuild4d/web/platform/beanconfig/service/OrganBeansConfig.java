package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.OrganMapper;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.organ.service.IOrganService;
import com.jbuild4d.platform.organ.service.impl.OrganServiceImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
@Configuration
@EnableTransactionManagement
public class OrganBeansConfig {

    @Bean
    public IOrganService organService(ISQLBuilderService _sqlBuilderService, OrganMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IOrganService bean=new OrganServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }
}
