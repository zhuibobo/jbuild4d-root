package com.jbuild4d.platform.builder.service;

import com.jbuild4d.base.dbaccess.dbentities.DatasetEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.builder.vo.DataSetVo;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetService extends IBaseService<DatasetEntity> {
    DataSetVo resolveSQLToDataSet(JB4DSession jb4DSession, String sql);
}
