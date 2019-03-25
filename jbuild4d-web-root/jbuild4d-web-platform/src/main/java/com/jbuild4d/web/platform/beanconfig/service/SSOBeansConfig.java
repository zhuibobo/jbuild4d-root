package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.sso.*;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.sso.core.ISSOLogin;
import com.jbuild4d.platform.sso.core.ISSOLoginStore;
import com.jbuild4d.platform.sso.core.impl.SSOLoginImpl;
import com.jbuild4d.platform.sso.core.impl.SSOLoginStoreImpl;
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
    public IDepartmentService departmentService(ISQLBuilderService _sqlBuilderService, DepartmentMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IDepartmentService departmentService=new DepartmentServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
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

    @Bean
    IRoleGroupService roleGroupService(ISQLBuilderService _sqlBuilderService, RoleGroupMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IRoleGroupService roleGroupService=new RoleGroupServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return roleGroupService;
    }

    @Bean
    IRoleService roleService(ISQLBuilderService _sqlBuilderService, RoleMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IRoleService roleService=new RoleServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return roleService;
    }

    @Bean
    IUserRoleService userRoleService(ISQLBuilderService _sqlBuilderService, UserRoleMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IUserRoleService userRoleService=new UserRoleServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return userRoleService;
    }

    @Bean
    ISsoAppService ssoAppService(ISQLBuilderService _sqlBuilderService, SsoAppMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        ISsoAppService ssoAppService=new SsoAppServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return ssoAppService;
    }

    @Bean
    ISsoAppInterfaceService ssoAppInterfaceService(ISQLBuilderService _sqlBuilderService, SsoAppInterfaceMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        ISsoAppInterfaceService ssoAppInterfaceService=new SsoAppInterfaceServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return ssoAppInterfaceService;
    }

    @Bean
    ISsoAppFileService ssoAppFileService(ISQLBuilderService _sqlBuilderService, SsoAppFileMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        ISsoAppFileService ssoAppFileService=new SsoAppFileServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return ssoAppFileService;
    }

    @Bean
    ISsoAppUserMappingService ssoAppUserMappingService(ISQLBuilderService _sqlBuilderService, SsoAppUserMappingMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        ISsoAppUserMappingService ssoAppUserMappingService=new SsoAppUserMappingServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return ssoAppUserMappingService;
    }

    @Bean
    ISSOLogin ssoLogin(ISQLBuilderService _sqlBuilderService, UserMapper mapper, SqlSessionTemplate sqlSessionTemplate,ISSOLoginStore ssoLoginStore){
        ISSOLogin ssoLogin=new SSOLoginImpl(ssoLoginStore);
        return ssoLogin;
    }

    @Bean
    ISSOLoginStore ssoLoginStore(ISQLBuilderService _sqlBuilderService, UserMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        ISSOLoginStore ssoLoginStore=new SSOLoginStoreImpl();
        return ssoLoginStore;
    }

    @PostConstruct
    public void postConstruct (){
        //this.organService().setDepartmentService(this.departmentService());
        //organService.setDepartmentService(departmentService);
        //organService.setDepartmentService(departmentService);
        System.out.println("SSOBeansConfig-@PostConstruct");
    }
}
