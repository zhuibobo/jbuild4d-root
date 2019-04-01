package com.jbuild4d.platform.builder.datastorage;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntityWithBLOBs;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

import java.util.List;

public interface ITableRelationService extends IBaseService<TableRelationEntityWithBLOBs> {
    List<TableRelationEntityWithBLOBs> getRelationByGroup(JB4DSession jb4DSession, String groupId);


    void updateDiagram(JB4DSession jb4DSession, String recordId, String relationContent, String relationDiagramJson) throws JBuild4DGenerallyException;
}
