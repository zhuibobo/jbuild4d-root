package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.DatabaseServiceLinkMapper;
import com.jbuild4d.base.dbaccess.dao.TableFieldMapper;
import com.jbuild4d.base.dbaccess.dao.TableGroupMapper;
import com.jbuild4d.base.dbaccess.dao.TableMapper;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.builder.service.IDatabaseServiceLinkService;
import com.jbuild4d.platform.builder.service.ITableFieldService;
import com.jbuild4d.platform.builder.service.ITableGroupService;
import com.jbuild4d.platform.builder.service.ITableService;
import com.jbuild4d.platform.builder.service.impl.DatabaseServiceLinkServiceImpl;
import com.jbuild4d.platform.builder.service.impl.TableFieldServiceImpl;
import com.jbuild4d.platform.builder.service.impl.TableGroupServiceImpl;
import com.jbuild4d.platform.builder.service.impl.TableServiceImpl;
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
    public IDatabaseServiceLinkService databaseServiceLinkService(ISQLBuilderService _sqlBuilderService, DatabaseServiceLinkMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IDatabaseServiceLinkService bean=new DatabaseServiceLinkServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ITableGroupService tableGroupService(ISQLBuilderService _sqlBuilderService, TableGroupMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        ITableGroupService bean=new TableGroupServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ITableService tableService(ISQLBuilderService _sqlBuilderService, TableMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        ITableService bean=new TableServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ITableFieldService tableFieldService(ISQLBuilderService _sqlBuilderService, TableFieldMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        ITableFieldService bean=new TableFieldServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }
}
