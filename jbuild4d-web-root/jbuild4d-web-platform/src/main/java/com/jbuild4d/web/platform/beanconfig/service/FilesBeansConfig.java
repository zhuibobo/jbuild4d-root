package com.jbuild4d.web.platform.beanconfig.service;

import com.jbuild4d.base.dbaccess.dao.files.FileContentMapper;
import com.jbuild4d.base.dbaccess.dao.files.FileInfoMapper;
import com.jbuild4d.base.dbaccess.dao.files.FileRefMapper;
import com.jbuild4d.base.dbaccess.dao.organrelevance.OrganMapper;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.files.service.IFileContentService;
import com.jbuild4d.platform.files.service.IFileInfoService;
import com.jbuild4d.platform.files.service.IFileRefService;
import com.jbuild4d.platform.files.service.Impl.FileInfoServiceImpl;
import com.jbuild4d.platform.files.service.Impl.FileRefServiceImpl;
import com.jbuild4d.platform.organ.service.IOrganService;
import com.jbuild4d.platform.organ.service.impl.OrganServiceImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class FilesBeansConfig {
    @Bean
    public IFileInfoService fileInfoService(ISQLBuilderService _sqlBuilderService, FileInfoMapper mapper,FileContentMapper contentMapper, SqlSessionTemplate sqlSessionTemplate) {
        IFileInfoService bean=new FileInfoServiceImpl(mapper,contentMapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }

    @Bean
    public IFileRefService fileRefService(ISQLBuilderService _sqlBuilderService, FileRefMapper mapper, SqlSessionTemplate sqlSessionTemplate){
        IFileRefService bean=new FileRefServiceImpl(mapper,sqlSessionTemplate,_sqlBuilderService);
        return bean;
    }
}
