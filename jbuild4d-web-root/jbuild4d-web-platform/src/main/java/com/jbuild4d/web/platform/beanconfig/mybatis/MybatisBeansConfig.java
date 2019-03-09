package com.jbuild4d.web.platform.beanconfig.mybatis;

import com.github.pagehelper.PageInterceptor;
import com.jbuild4d.base.dbaccess.dao.builder.*;
import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoGenListMapper;
import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoTLTreeListMapper;
import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoTLTreeMapper;
import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoTreeTableMapper;
import com.jbuild4d.base.dbaccess.dao.files.FileContentMapper;
import com.jbuild4d.base.dbaccess.dao.files.FileInfoMapper;
import com.jbuild4d.base.dbaccess.dao.files.FileRefMapper;
import com.jbuild4d.base.dbaccess.dao.sso.*;
import com.jbuild4d.base.dbaccess.dao.systemsetting.*;
import com.jbuild4d.base.dbaccess.dynamic.GeneralMapper;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.UniversalIntEnumHandler;
import com.jbuild4d.base.dbaccess.general.DBProp;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseConnection;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.DatabaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.TypeHandler;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Role;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;
import java.beans.PropertyVetoException;
import java.io.IOException;
import java.util.Properties;

@Configuration
/*@MapperScan(basePackages = "com.jbuild4d.base")*/
public class MybatisBeansConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(MybatisBeansConfig.class);

    /*@Bean(destroyMethod="close")*/
    @Bean
    public ComboPooledDataSource dataSourceBean() throws PropertyVetoException {
        String driverName=DBProp.getDriverName();
        ComboPooledDataSource comboPooledDataSource=new ComboPooledDataSource();
        comboPooledDataSource.setDriverClass(driverName);
        comboPooledDataSource.setJdbcUrl(DBProp.getValue("Url"));
        comboPooledDataSource.setUser(DBProp.getValue("User"));
        comboPooledDataSource.setPassword(DBProp.getValue("Password"));
        //ComboPooledDataSource validationquery
        comboPooledDataSource.setPreferredTestQuery("SELECT 1");
        comboPooledDataSource.setAutomaticTestTable("TestConn");
        comboPooledDataSource.setIdleConnectionTestPeriod(60);
        //comboPooledDataSource.sett
        return comboPooledDataSource;
    }

    @Bean
    public JdbcTemplate jdbcTemplate() throws PropertyVetoException {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(dataSourceBean());
        return jdbcTemplate;
    }

    @Bean(name = "jbuild4d_liquibase")
    public Liquibase liquibase(DataSource dataSource) throws JBuild4DGenerallyException {
        LOGGER.info("Configuring Liquibase");

        Liquibase liquibase = null;
        try {
            DatabaseConnection connection = new JdbcConnection(dataSource.getConnection());
            Database database = DatabaseFactory.getInstance().findCorrectDatabaseImplementation(connection);
            database.setDatabaseChangeLogTableName(database.getDatabaseChangeLogTableName());
            database.setDatabaseChangeLogLockTableName(database.getDatabaseChangeLogLockTableName());

            liquibase = new Liquibase("liquibase/jbuild4d-platform-db-changelog.xml", new ClassLoaderResourceAccessor(), database);
            liquibase.update("zhuangrb");
            return liquibase;

        } catch (Exception e) {
            e.printStackTrace();
            throw new JBuild4DGenerallyException("执行数据库更新失败！");
        } finally {
            if (liquibase != null) {
                Database database = liquibase.getDatabase();
                if (database != null) {
                    try {
                        database.close();
                    } catch (DatabaseException e) {
                        LOGGER.warn("关闭数据库连接失败！", e);
                    }
                }
            }
        }
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

    @Bean
    public ModuleMapper moduleMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(ModuleMapper.class);
    }

    @Bean
    public FormResourceMapper formResourceMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(FormResourceMapper.class);
    }

    @Bean
    public FormConfigMapper formConfigMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(FormConfigMapper.class);
    }

    @Bean
    public Jb4dCacheMapper jb4dCacheMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(Jb4dCacheMapper.class);
    }

    @Bean
    public FlowModelMapper flowModelMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(FlowModelMapper.class);
    }

    @Bean
    public ListResourceMapper listResourceMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(ListResourceMapper.class);
    }

    @Bean
    public FileInfoMapper fileInfoMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(FileInfoMapper.class);
    }

    @Bean
    public FileContentMapper fileContentMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(FileContentMapper.class);
    }

    @Bean
    public FileRefMapper fileRefMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(FileRefMapper.class);
    }

    @Bean
    public HistoryDataMapper historyDataMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(HistoryDataMapper.class);
    }

    //SSO-Mapper-Beans
    @Bean
    public OrganTypeMapper organTypeMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(OrganTypeMapper.class);
    }

    @Bean
    public OrganMapper organMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(OrganMapper.class);
    }

    @Bean
    public DepartmentMapper departmentMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(DepartmentMapper.class);
    }

    @Bean
    public DepartmentUserMapper departmentUserMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(DepartmentUserMapper.class);
    }

    @Bean
    public RoleGroupMapper roleGroupMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(RoleGroupMapper.class);
    }

    @Bean
    public RoleMapper roleMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(RoleMapper.class);
    }

    @Bean
    public UserRoleMapper userRoleMapper(SqlSessionTemplate sqlSessionTemplate){
        return sqlSessionTemplate.getMapper(UserRoleMapper.class);
    }

    @Bean
    public UserMapper userMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(UserMapper.class);
    }

    @Bean
    public AuthorityMapper authorityMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(AuthorityMapper.class);
    }

    @Bean
    public SsoAppMapper ssoAppMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(SsoAppMapper.class);
    }

    @Bean
    public SsoAppInterfaceMapper ssoAppInterfaceMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(SsoAppInterfaceMapper.class);
    }

    @Bean
    public SsoAppFileMapper ssoAppFileMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(SsoAppFileMapper.class);
    }

    @Bean
    public SsoAppUserMappingMapper ssoAppUserMappingMapper(SqlSessionTemplate sqlSessionTemplate) {
        return sqlSessionTemplate.getMapper(SsoAppUserMappingMapper.class);
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
