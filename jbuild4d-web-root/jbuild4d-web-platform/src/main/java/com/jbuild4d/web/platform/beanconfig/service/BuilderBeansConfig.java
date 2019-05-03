package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.builder.*;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.button.api.ButtonAPIService;
import com.jbuild4d.platform.builder.dataset.IDatasetColumnService;
import com.jbuild4d.platform.builder.dataset.IDatasetGroupService;
import com.jbuild4d.platform.builder.dataset.IDatasetRelatedTableService;
import com.jbuild4d.platform.builder.dataset.IDatasetService;
import com.jbuild4d.platform.builder.dataset.impl.DatasetColumnServiceImpl;
import com.jbuild4d.platform.builder.dataset.impl.DatasetGroupServiceImpl;
import com.jbuild4d.platform.builder.dataset.impl.DatasetRelatedTableServiceImpl;
import com.jbuild4d.platform.builder.dataset.impl.DatasetServiceImpl;
import com.jbuild4d.platform.builder.datastorage.*;
import com.jbuild4d.platform.builder.datastorage.impl.*;
import com.jbuild4d.platform.builder.flow.IFlowModelService;
import com.jbuild4d.platform.builder.flow.IFlowModelerConfigService;
import com.jbuild4d.platform.builder.flow.impl.FlowModelServiceImpl;
import com.jbuild4d.platform.builder.flow.impl.FlowModelerConfigServiceImpl;
import com.jbuild4d.platform.builder.htmldesign.ICKEditorPluginsService;
import com.jbuild4d.platform.builder.htmldesign.IHTMLDesignThemesService;
import com.jbuild4d.platform.builder.htmldesign.IHTMLRuntimeResolve;
import com.jbuild4d.platform.builder.htmldesign.impl.CKEditorPluginsServiceImpl;
import com.jbuild4d.platform.builder.htmldesign.impl.HTMLDesignThemesServiceImpl;
import com.jbuild4d.platform.builder.htmldesign.impl.HTMLRuntimeResolveImpl;
import com.jbuild4d.platform.builder.list.IListResourceService;
import com.jbuild4d.platform.builder.list.impl.ListResourceServiceImpl;
import com.jbuild4d.platform.builder.module.IBuilderConfigService;
import com.jbuild4d.platform.builder.module.IModuleService;
import com.jbuild4d.platform.builder.module.impl.BuilderConfigServiceImpl;
import com.jbuild4d.platform.builder.module.impl.ModuleServiceImpl;
import com.jbuild4d.platform.builder.webform.IFormConfigService;
import com.jbuild4d.platform.builder.webform.IFormResourceService;
import com.jbuild4d.platform.builder.webform.impl.FormConfigServiceImpl;
import com.jbuild4d.platform.builder.webform.impl.FormResourceServiceImpl;
import com.jbuild4d.platform.system.service.IEnvVariableService;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
@Configuration
@EnableTransactionManagement
public class BuilderBeansConfig {

    @Bean
    public IBuilderConfigService builderConfigService() throws IOException, SAXException, ParserConfigurationException {
        IBuilderConfigService builderConfigService=new BuilderConfigServiceImpl();
        return builderConfigService;
    }

    @Bean
    public ITableGroupService tableGroupService(ISQLBuilderService _sqlBuilderService, TableGroupMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        ITableGroupService bean=new TableGroupServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ITableService tableService(ISQLBuilderService _sqlBuilderService, TableMapper mapper, SqlSessionTemplate sqlSessionTemplate, TableFieldMapper tableFieldMapper) throws JBuild4DGenerallyException {
        ITableService bean=new TableServiceImpl(mapper,tableFieldMapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ITableFieldService tableFieldService(ISQLBuilderService _sqlBuilderService, TableFieldMapper mapper,TableMapper tableMapper, SqlSessionTemplate sqlSessionTemplate) {
        ITableFieldService bean=new TableFieldServiceImpl(mapper,tableMapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IDatasetGroupService datasetGroupService(ISQLBuilderService _sqlBuilderService, DatasetGroupMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IDatasetGroupService bean=new DatasetGroupServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IDatasetService datasetService(
            ISQLBuilderService _sqlBuilderService, DatasetMapper mapper, SqlSessionTemplate sqlSessionTemplate,
            JdbcOperations jdbcOperations, IBuilderConfigService _builderConfigService, ITableService tableService,
            ITableFieldService tableFieldService, IEnvVariableService envVariableService, IDatasetRelatedTableService datasetRelatedTableService, IDatasetColumnService datasetColumnService) {
        IDatasetService bean=new DatasetServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService,jdbcOperations,_builderConfigService,tableService,tableFieldService,envVariableService,datasetRelatedTableService,datasetColumnService);
        return bean;
    }

    @Bean
    public IDatasetRelatedTableService datasetRelatedTableService(ISQLBuilderService _sqlBuilderService, DatasetRelatedTableMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IDatasetRelatedTableService bean=new DatasetRelatedTableServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IDatasetColumnService datasetColumnService(ISQLBuilderService _sqlBuilderService, DatasetColumnMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IDatasetColumnService bean=new DatasetColumnServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IModuleService moduleService(ISQLBuilderService _sqlBuilderService, ModuleMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IModuleService bean=new ModuleServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IFormResourceService formResourceService(ISQLBuilderService _sqlBuilderService, FormResourceMapper mapper, SqlSessionTemplate sqlSessionTemplate,IModuleService moduleService){
        IFormResourceService bean=new FormResourceServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService,moduleService);
        return bean;
    }

    @Bean
    public IFormConfigService formConfigService(ISQLBuilderService _sqlBuilderService, FormConfigMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IFormConfigService bean=new FormConfigServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IHTMLRuntimeResolve htmlRuntimeResolve(){
        return new HTMLRuntimeResolveImpl();
    }

    @Bean
    public ICKEditorPluginsService ckEditorPluginsService(IJb4dCacheService jb4dCacheService){
        ICKEditorPluginsService ickEditorPluginsService=new CKEditorPluginsServiceImpl(jb4dCacheService);
        return ickEditorPluginsService;
    }

    @Bean
    public IHTMLDesignThemesService htmlDesignThemesService(){
        IHTMLDesignThemesService htmlDesignThemesService=new HTMLDesignThemesServiceImpl();
        return htmlDesignThemesService;
    }

    @Bean
    public IFlowModelerConfigService flowModelerConfigService(IJb4dCacheService jb4dCacheService){
        IFlowModelerConfigService flowModelerConfigService=new FlowModelerConfigServiceImpl(jb4dCacheService);
        return flowModelerConfigService;
    }

    @Bean
    public IFlowModelService flowModelService(ISQLBuilderService _sqlBuilderService, FlowModelMapper mapper, SqlSessionTemplate sqlSessionTemplate, RestTemplate restTemplate,IFlowModelerConfigService flowModelerConfigService,IModuleService moduleService){
        IFlowModelService flowModelService=new FlowModelServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService,restTemplate,flowModelerConfigService,moduleService);
        return flowModelService;
    }

    @Bean
    public IListResourceService listResourceService(ISQLBuilderService _sqlBuilderService, ListResourceMapper mapper, SqlSessionTemplate sqlSessionTemplate, IModuleService moduleService){
        IListResourceService listResourceService=new ListResourceServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService,moduleService);
        return listResourceService;
    }

    @Bean
    public ITableRelationGroupService tableRelationGroupService(ISQLBuilderService _sqlBuilderService, TableRelationGroupMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        ITableRelationGroupService bean=new TableRelationGroupServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ITableRelationService tableRelationService(ISQLBuilderService _sqlBuilderService, TableRelationMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        ITableRelationService bean=new TableRelationServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ITableRelationHisService tableRelationHisService(ISQLBuilderService _sqlBuilderService, TableRelationHisMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        ITableRelationHisService bean=new TableRelationHisServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ButtonAPIService buttonAPIService(){
        return new ButtonAPIService();
    }

    @Bean
    public IDbLinkService dbLinkService(ISQLBuilderService _sqlBuilderService, DbLinkMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IDbLinkService bean=new DbLinkServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }
}
