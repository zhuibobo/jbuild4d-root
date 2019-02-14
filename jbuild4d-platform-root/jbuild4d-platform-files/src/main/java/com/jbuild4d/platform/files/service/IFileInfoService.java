package com.jbuild4d.platform.files.service;

import com.jbuild4d.base.dbaccess.dbentities.files.FileInfoEntity;
import com.jbuild4d.base.service.IBaseService;
import org.springframework.web.multipart.MultipartFile;

public interface IFileInfoService extends IBaseService<FileInfoEntity> {
    FileInfoEntity addFile(MultipartFile file);
}