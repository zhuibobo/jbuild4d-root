package com.jbuild4d.platform.files.service.Impl;

import com.jbuild4d.base.dbaccess.dao.files.FileRefMapper;
import com.jbuild4d.base.dbaccess.dbentities.files.FileRefEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.files.service.IFileRefService;
import org.mybatis.spring.SqlSessionTemplate;

public class FileRefServiceImpl extends BaseServiceImpl<FileRefEntity> implements IFileRefService
{
    FileRefMapper fileRefMapper;
    public FileRefServiceImpl(FileRefMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        fileRefMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, FileRefEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<FileRefEntity>() {
            @Override
            public FileRefEntity run(JB4DSession jb4DSession,FileRefEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
