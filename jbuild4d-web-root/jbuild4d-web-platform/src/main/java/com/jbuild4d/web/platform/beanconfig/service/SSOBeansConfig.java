package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.sso.DepartmentMapper;
import com.jbuild4d.base.dbaccess.dao.sso.DepartmentUserMapper;
import com.jbuild4d.base.dbaccess.dao.sso.OrganMapper;
import com.jbuild4d.base.dbaccess.dao.sso.OrganTypeMapper;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.sso.service.IDepartmentService;
import com.jbuild4d.platform.sso.service.IDepartmentUserService;
import com.jbuild4d.platform.sso.service.IOrganService;
import com.jbuild4d.platform.sso.service.IOrganTypeService;
import com.jbuild4d.platform.sso.service.impl.DepartmentServiceImpl;
import com.jbuild4d.platform.sso.service.impl.DepartmentUserServiceImpl;
import com.jbuild4d.platform.sso.service.impl.OrganServiceImpl;
import com.jbuild4d.platform.sso.service.impl.OrganTypeServiceImpl;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.annotation.PostConstruct;

@Configuration
@EnableTransactionManagement
public class SSOBeansConfig {
    @Bean
    public IOrganTypeService organTypeService(ISQLBuilderService _sqlBuilderService, OrganTypeMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IOrganTypeService bean=new OrganTypeServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IOrganService organService(ISQLBuilderService _sqlBuilderService, OrganMapper mapper, SqlSessionTemplate sqlSessionTemplate, IJb4dCacheService jb4dCacheService) {
        IOrganService organService=new OrganServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService,jb4dCacheService);
        return organService;
    }

    @Bean
    public IDepartmentService departmentService(ISQLBuilderService _sqlBuilderService, DepartmentMapper mapper, SqlSessionTemplate sqlSessionTemplate,IDepartmentUserService departmentUserService){
        IDepartmentService departmentService=new DepartmentServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService,departmentUserService);
        return departmentService;
    }

    @Bean
    IDepartmentUserService departmentUserService(ISQLBuilderService _sqlBuilderService, DepartmentUserMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IDepartmentUserService departmentUserService=new DepartmentUserServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return departmentUserService;
    }

    @PostConstruct
    public void postConstruct (){
        //this.organService().setDepartmentService(this.departmentService());
        //organService.setDepartmentService(departmentService);
        //organService.setDepartmentService(departmentService);
        System.out.println("SSOBeansConfig-@PostConstruct");
    }
}
