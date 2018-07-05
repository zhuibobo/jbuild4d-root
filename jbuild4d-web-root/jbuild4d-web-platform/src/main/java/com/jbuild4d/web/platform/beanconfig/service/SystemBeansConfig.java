package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.*;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.platform.system.service.IDictionaryService;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.platform.system.service.ISettingService;
import com.jbuild4d.platform.system.service.impl.DictionaryGroupServiceImpl;
import com.jbuild4d.platform.system.service.impl.DictionaryServiceImpl;
import com.jbuild4d.platform.system.service.impl.MenuServiceImpl;
import com.jbuild4d.platform.system.service.impl.SettingServiceImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class SystemBeansConfig {

    @Bean
    public IMenuService menuService(GeneralMapper generalMapper, MenuMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IMenuService bean=new MenuServiceImpl(mapper,sqlSessionTemplate,generalMapper);
        return bean;
    }

    @Bean
    public IDictionaryGroupService dictionaryGroupService(GeneralMapper generalMapper, DictionaryGroupMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IDictionaryGroupService bean=new DictionaryGroupServiceImpl(mapper,sqlSessionTemplate,generalMapper);
        return bean;
    }

    @Bean
    public IDictionaryService dictionaryService(GeneralMapper generalMapper, DictionaryMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IDictionaryService bean=new DictionaryServiceImpl(mapper,sqlSessionTemplate,generalMapper);
        return bean;
    }

    @Bean
    public ISettingService settingService(GeneralMapper generalMapper, SettingMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        ISettingService bean=new SettingServiceImpl(mapper,sqlSessionTemplate,generalMapper);
        return bean;
    }
}
