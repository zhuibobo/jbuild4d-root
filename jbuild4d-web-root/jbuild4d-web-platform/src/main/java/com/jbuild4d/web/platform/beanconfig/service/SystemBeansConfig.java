package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.builder.MenuMapper;
import com.jbuild4d.base.dbaccess.dao.systemsetting.*;
import com.jbuild4d.base.dbaccess.dynamic.GeneralMapper;
import com.jbuild4d.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jbuild4d.base.dbaccess.dynamic.SQLBuilderMapper;
import com.jbuild4d.base.service.IMetadataService;
import com.jbuild4d.base.service.impl.MetadataServiceImpl;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IGeneralService;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.impl.GeneralServiceImpl;
import com.jbuild4d.base.service.impl.SQLBuilderServiceImpl;
import com.jbuild4d.platform.system.service.*;
import com.jbuild4d.platform.system.service.impl.*;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

@Configuration
@EnableTransactionManagement
public class SystemBeansConfig {

    @Bean
    public IGeneralService generalService(GeneralMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IGeneralService bean=new GeneralServiceImpl(mapper,sqlSessionTemplate);
        return bean;
    }

    @Bean
    public ISQLBuilderMapper sqlBuilderMapper(SqlSessionTemplate sqlSessionTemplate) {
        ISQLBuilderMapper bean=new SQLBuilderMapper(sqlSessionTemplate);
        return bean;
    }

    @Bean
    public ISQLBuilderService sqlBuilderService(ISQLBuilderMapper sqlBuilderMapper) {
        ISQLBuilderService bean=new SQLBuilderServiceImpl(sqlBuilderMapper);
        return bean;
    }

    @Bean
    public IMetadataService metadataService(ISQLBuilderService sqlBuilderService){
        IMetadataService metadataService=new MetadataServiceImpl(sqlBuilderService);
        return metadataService;
    }

    @Bean
    public IDictionaryGroupService dictionaryGroupService(ISQLBuilderService _sqlBuilderService, DictionaryGroupMapper mapper, SqlSessionTemplate sqlSessionTemplate, IGeneralService generalService) {
        IDictionaryGroupService bean=new DictionaryGroupServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        bean.setGeneralService(generalService);
        return bean;
    }

    @Bean
    public IMenuService menuService(ISQLBuilderService _sqlBuilderService, MenuMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IMenuService bean=new MenuServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IDictionaryService dictionaryService(ISQLBuilderService _sqlBuilderService, DictionaryMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IDictionaryService bean=new DictionaryServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ISettingService settingService(ISQLBuilderService _sqlBuilderService, SettingMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        ISettingService bean=new SettingServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IOperationLogService operationLogService(ISQLBuilderService _sqlBuilderService, OperationLogMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IOperationLogService bean=new OperationLogServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public ICodeGenerateService codeGenerateService(ISQLBuilderService _sqlBuilderService){
        ICodeGenerateService bean=new CodeGenerateServiceImpl(_sqlBuilderService);
        return bean;
    }

    @Bean
    public IEnvVariableService envVariableService(IJb4dCacheService jb4dCacheService) throws IOException, SAXException, ParserConfigurationException, XPathExpressionException, JBuild4DGenerallyException {
        IEnvVariableService bean=new EnvVariableServiceImpl(jb4dCacheService);
        return bean;
    }

    @Bean
    public IJb4dCacheService jb4dCacheService(ISQLBuilderService _sqlBuilderService, Jb4dCacheMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IJb4dCacheService bean=new Jb4dCacheServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IHistoryDataService historyDataService(ISQLBuilderService _sqlBuilderService, HistoryDataMapper mapper, SqlSessionTemplate sqlSessionTemplate) {
        IHistoryDataService bean=new HistoryDataServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }
}
