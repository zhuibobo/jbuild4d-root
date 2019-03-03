package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.sso.OrganMapper;
import com.jbuild4d.base.dbaccess.dao.sso.OrganTypeMapper;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.sso.service.IDepartmentService;
import com.jbuild4d.platform.sso.service.IOrganService;
import com.jbuild4d.platform.sso.service.IOrganTypeService;
import com.jbuild4d.platform.sso.service.impl.OrganServiceImpl;
import com.jbuild4d.platform.sso.service.impl.OrganTypeServiceImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class SSOBeansConfig {
    @Bean
    public IOrganService organService(ISQLBuilderService _sqlBuilderService, OrganMapper mapper, SqlSessionTemplate sqlSessionTemplate, IDepartmentService departmentService) {
        IOrganService bean=new OrganServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IOrganTypeService organTypeService(ISQLBuilderService _sqlBuilderService, OrganTypeMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IOrganTypeService bean=new OrganTypeServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }
}
