package com.jbuild4d.platform.files.service.Impl;

import com.jbuild4d.base.dbaccess.dao.files.FileContentMapper;
import com.jbuild4d.base.dbaccess.dao.files.FileInfoMapper;
import com.jbuild4d.base.dbaccess.dbentities.files.FileInfoEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.files.service.IFileInfoService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.web.multipart.MultipartFile;

public class FileInfoServiceImpl extends BaseServiceImpl<FileInfoEntity> implements IFileInfoService
{
    FileInfoMapper fileInfoMapper;
    FileContentMapper contentMapper;
    public FileInfoServiceImpl(FileInfoMapper _defaultBaseMapper, FileContentMapper _contentMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        fileInfoMapper=_defaultBaseMapper;
        contentMapper=_contentMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, FileInfoEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<FileInfoEntity>() {
            @Override
            public FileInfoEntity run(JB4DSession jb4DSession,FileInfoEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public FileInfoEntity addFile(MultipartFile file) {
        return null;
    }
}
