package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.DevDemoGenListMapper;
import com.jbuild4d.base.dbaccess.dao.DevDemoTreeTableMapper;
import com.jbuild4d.base.service.IGeneralService;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.system.service.IDevDemoGenListService;
import com.jbuild4d.platform.system.service.IDevDemoTreeTableService;
import com.jbuild4d.platform.system.service.impl.DevDemoGenListServiceImpl;
import com.jbuild4d.platform.system.service.impl.DevDemoTreeTableServiceImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/15
 * To change this template use File | Settings | File Templates.
 */

@Configuration
@EnableTransactionManagement
public class DevDemoBeansConfig {

    @Bean
    public IDevDemoGenListService devDemoGenListService(ISQLBuilderService _sqlBuilderService, DevDemoGenListMapper mapper, SqlSessionTemplate sqlSessionTemplate, IGeneralService generalService) {
        IDevDemoGenListService bean=new DevDemoGenListServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        bean.setGeneralService(generalService);
        return bean;
    }

    @Bean
    public IDevDemoTreeTableService devDemoTreeTableService(ISQLBuilderService _sqlBuilderService, DevDemoTreeTableMapper mapper, SqlSessionTemplate sqlSessionTemplate, IGeneralService generalService) {
        IDevDemoTreeTableService bean=new DevDemoTreeTableServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }
}
