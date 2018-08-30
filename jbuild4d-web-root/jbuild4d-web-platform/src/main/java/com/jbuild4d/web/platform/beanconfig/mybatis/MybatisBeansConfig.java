package com.jbuild4d.web.platform.beanconfig.mybatis;

import com.github.pagehelper.PageInterceptor;
import com.jbuild4d.base.dbaccess.dao.builder.*;
import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoGenListMapper;
import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoTLTreeListMapper;
import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoTLTreeMapper;
import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoTreeTableMapper;
import com.jbuild4d.base.dbaccess.dao.organrelevance.OrganMapper;
import com.jbuild4d.base.dbaccess.dao.organrelevance.OrganTypeMapper;
import com.jbuild4d.base.dbaccess.dao.system.*;
import com.jbuild4d.base.dbaccess.dynamic.GeneralMapper;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.UniversalIntEnumHandler;
import com.jbuild4d.base.dbaccess.general.DBProp;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.TypeHandler;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import java.beans.PropertyVetoException;
import java.io.IOException;
import java.util.Properties;

@Configuration
/*@MapperScan(basePackages = "com.jbuild4d.base")*/
public class MybatisBeansConfig {

    /*@Bean(destroyMethod="close")*/
    @Bean
    public ComboPooledDataSource dataSourceBean() throws PropertyVetoException {
        String driverName="com.microsoft.sqlserver.jdbc.SQLServerDriver";
        ComboPooledDataSource comboPooledDataSource=new ComboPooledDataSource();
        comboPooledDataSource.setDriverClass(driverName);
        comboPooledDataSource.setJdbcUrl(DBProp.getValue("Url"));
        comboPooledDataSource.setUser(DBProp.getValue("User"));
        comboPooledDataSource.setPassword(DBProp.getValue("Password"));
        return comboPooledDataSource;
    }

    @Bean
    public DataSourceTransactionManager dataSourceTransactionManager() throws PropertyVetoException {
        return new DataSourceTransactionManager(dataSourceBean());
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

    @Bean
    public PageInterceptor pageInterceptor(){
        PageInterceptor pageInterceptor=new PageInterceptor();
        Properties properties=new Properties();
        properties.getProperty("params","value1");
        pageInterceptor.setProperties(properties);
        return pageInterceptor;
    }

    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean(PageInterceptor pageInterceptor) throws PropertyVetoException, IOException {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSourceBean());
        sessionFactory.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:mybatismappers/*/*.xml"));
        TypeHandler[] typeHandlers = {new UniversalIntEnumHandler(EnableTypeEnum.class)};
        sessionFactory.setTypeHandlers(typeHandlers);
        Interceptor[] interceptors={pageInterceptor};
        sessionFactory.setPlugins(interceptors);
        //sessionFactory.setTypeAliasesPackage("com.build4d");
        return sessionFactory;
    }

    @Bean
    public GeneralMapper generalMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(GeneralMapper.class);
    }

    @Bean
    public DevDemoGenListMapper devDemoGenListMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(DevDemoGenListMapper.class);
    }

    @Bean
    public DevDemoTreeTableMapper devDemoTreeTableMapper(SqlSessionTemplate sqlSessionTemplate){ return sqlSessionTemplate.getMapper(DevDemoTreeTableMapper.class); }

    @Bean
    public DevDemoTLTreeMapper devDemoTLTreeMapper(SqlSessionTemplate sqlSessionTemplate){ return sqlSessionTemplate.getMapper(DevDemoTLTreeMapper.class); }

    @Bean
    public DevDemoTLTreeListMapper devDemoTLTreeListMapper(SqlSessionTemplate sqlSessionTemplate){ return sqlSessionTemplate.getMapper(DevDemoTLTreeListMapper.class); }

    @Bean
    public MenuMapper menuMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(MenuMapper.class);
    }

    @Bean
    public DictionaryGroupMapper dictionaryGroupMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(DictionaryGroupMapper.class);
    }

    @Bean
    public DictionaryMapper dictionaryMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(DictionaryMapper.class);
    }

    @Bean
    public SettingMapper settingMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(SettingMapper.class);
    }

    @Bean
    public OperationLogMapper operationLogMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(OperationLogMapper.class);
    }

    @Bean
    public OrganMapper organMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(OrganMapper.class);
    }

    @Bean
    public OrganTypeMapper organTypeMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(OrganTypeMapper.class);
    }

    @Bean
    public TableGroupMapper tableGroupMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(TableGroupMapper.class);
    }

    @Bean
    public TableMapper tableMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(TableMapper.class);
    }

    @Bean
    public TableFieldMapper tableFieldMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(TableFieldMapper.class);
    }

    @Bean
    public DatasetGroupMapper datasetGroupMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(DatasetGroupMapper.class);
    }

    @Bean
    public DatasetMapper datasetMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(DatasetMapper.class);
    }

    @Bean
    public DatasetRelatedTableMapper datasetRelatedTableMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(DatasetRelatedTableMapper.class);
    }

    @Bean
    public DatasetColumnMapper datasetColumnMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(DatasetColumnMapper.class);
    }
    /*@Bean
    public SpringManagedTransactionFactory getSpringManagedTransactionFactory() throws PropertyVetoException {
        return new SpringManagedTransactionFactory(getDataSourceBean(), TransactionIsolationLevel.SERIALIZABLE,true);
    }*/

    /*@Override
    @Bean(name="annotationDrivenTransactionManager")
    public PlatformTransactionManager annotationDrivenTransactionManager() {
        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        try {
            transactionManager.setDataSource(getDataSourceBean());
        } catch (PropertyVetoException e) {
            e.printStackTrace();
        }
        return transactionManager;
    }*/

    /*@Bean
    public SqlSessionFactoryBean getSqlSessionFactoryBean() throws PropertyVetoException {
        SqlSessionFactoryBean sqlSessionFactoryBean=new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(getDataSourceBean());
        return  sqlSessionFactoryBean;
    }*/

    /*@Bean
    public MapperFactoryBean getOrganMapperBean() throws PropertyVetoException {
        MapperFactoryBean mapperFactoryBean=new MapperFactoryBean();
        mapperFactoryBean.setMapperInterface(OrganMapper.class);
        mapperFactoryBean.setSqlSessionFactory((SqlSessionFactory) getSqlSessionFactoryBean());
        return mapperFactoryBean;
    }*/
}
