package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.sso.*;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.sso.service.*;
import com.jbuild4d.platform.sso.service.impl.*;
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
    IDepartmentUserService departmentUserService(ISQLBuilderService _sqlBuilderService, DepartmentUserMapper mapper, SqlSessionTemplate sqlSessionTemplate, IUserService userService){
        IDepartmentUserService departmentUserService=new DepartmentUserServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService,userService);
        return departmentUserService;
    }

    @Bean
    IUserService userService(ISQLBuilderService _sqlBuilderService, UserMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IUserService userService=new UserServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return userService;
    }

    @PostConstruct
    public void postConstruct (){
        //this.organService().setDepartmentService(this.departmentService());
        //organService.setDepartmentService(departmentService);
        //organService.setDepartmentService(departmentService);
        System.out.println("SSOBeansConfig-@PostConstruct");
    }
}
