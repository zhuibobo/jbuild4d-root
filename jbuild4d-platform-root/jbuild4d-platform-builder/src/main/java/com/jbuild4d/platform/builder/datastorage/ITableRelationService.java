package com.jbuild4d.platform.builder.datastorage;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntityWithBLOBs;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.session.JB4DSession;

import java.util.List;

public interface ITableRelationService extends IBaseService<TableRelationEntityWithBLOBs> {
    List<TableRelationEntityWithBLOBs> getRelationByGroup(JB4DSession session, String groupId);


}
