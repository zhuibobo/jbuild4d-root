package com.jbuild4d.base.service;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

import java.util.List;
import java.util.Map;

public interface IMetadataService {
    String getTableComment(JB4DSession jb4DSession, String tableName) throws JBuild4DGenerallyException;

    List<Map<String, Object>> getTableFiledComment(String tableName) throws JBuild4DGenerallyException;
}
