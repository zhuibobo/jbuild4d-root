package com.jbuild4d.platform.files.service;

import com.jbuild4d.base.dbaccess.dbentities.files.FileInfoEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.session.JB4DSession;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IFileInfoService extends IBaseService<FileInfoEntity> {

    FileInfoEntity addSmallFileToDB(JB4DSession session, MultipartFile file) throws IOException;

    byte[] getContent(String fileId);
}