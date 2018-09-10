package com.jbuild4d.platform.builder.service;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetRelatedTableEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetRelatedTableService extends IBaseService<DatasetRelatedTableEntity> {
    void deleteByDataSetId(JB4DSession jb4DSession, String dataSetId);
}
