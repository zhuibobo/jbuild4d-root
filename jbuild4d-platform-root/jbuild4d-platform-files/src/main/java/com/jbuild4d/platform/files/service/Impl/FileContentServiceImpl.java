package com.jbuild4d.platform.files.service.Impl;

import com.jbuild4d.base.dbaccess.dao.files.FileContentMapper;
import com.jbuild4d.base.dbaccess.dbentities.files.FileContentEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.files.service.IFileContentService;
import org.mybatis.spring.SqlSessionTemplate;

public class FileContentServiceImpl extends BaseServiceImpl<FileContentEntity> implements IFileContentService
{
    FileContentMapper fileContentMapper;
    public FileContentServiceImpl(FileContentMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        fileContentMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, FileContentEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<FileContentEntity>() {
            @Override
            public FileContentEntity run(JB4DSession jb4DSession, FileContentEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}

