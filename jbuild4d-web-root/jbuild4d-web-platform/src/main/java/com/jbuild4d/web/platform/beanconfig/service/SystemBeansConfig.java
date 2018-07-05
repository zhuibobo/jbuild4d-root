package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.GeneralMapper;
import com.jbuild4d.base.dbaccess.dao.MenuMapper;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.platform.system.service.impl.MenuServiceImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class SystemBeansConfig {

    @Bean
    public IMenuService menuService(GeneralMapper generalMapper, MenuMapper menuMapper, SqlSessionTemplate sqlSessionTemplate) {
        IMenuService iMenuService=new MenuServiceImpl(menuMapper,sqlSessionTemplate,generalMapper);
        return iMenuService;
    }

}
