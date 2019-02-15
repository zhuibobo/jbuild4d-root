package com.jbuild4d.platform.files.service.Impl;
import java.io.IOException;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dao.files.FileContentMapper;
import com.jbuild4d.base.dbaccess.dao.files.FileInfoMapper;
import com.jbuild4d.base.dbaccess.dbentities.files.FileContentEntity;
import com.jbuild4d.base.dbaccess.dbentities.files.FileInfoEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.files.service.IFileInfoService;
import org.apache.commons.io.FilenameUtils;
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
    public FileInfoEntity addSmallFileToDB(JB4DSession session,MultipartFile file) throws IOException {
        String fileId= UUIDUtility.getUUID();

        FileInfoEntity fileInfoEntity=new FileInfoEntity();
        fileInfoEntity.setFileId(fileId);
        fileInfoEntity.setFileCreateTime(new Date());
        fileInfoEntity.setFileCreater(session.getUserName());
        fileInfoEntity.setFileName(file.getOriginalFilename());
        fileInfoEntity.setFileSize(file.getSize());
        fileInfoEntity.setFileStoreType("DB");
        fileInfoEntity.setFileStorePath("");
        fileInfoEntity.setFileStoreName("");
        fileInfoEntity.setFileOrganId(session.getOrganId());
        fileInfoEntity.setFileOrganName(session.getOrganName());
        fileInfoEntity.setFileExtension(FilenameUtils.getExtension(file.getOriginalFilename()));
        fileInfoEntity.setFileDescription("");
        fileInfoEntity.setFileReadtime(0);
        fileInfoEntity.setFileStatus(EnableTypeEnum.enable.getDisplayName());

        FileContentEntity fileContentEntity=new FileContentEntity();
        fileContentEntity.setFileId(fileId);
        fileContentEntity.setFileContent(file.getBytes());

        fileInfoMapper.insertSelective(fileInfoEntity);
        contentMapper.insertSelective(fileContentEntity);
        return fileInfoEntity;
    }

    @Override
    public byte[] getContent(String fileId) {
        return contentMapper.selectByPrimaryKey(fileId).getFileContent();
    }
}
