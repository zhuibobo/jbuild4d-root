package com.jbuild4d.platform.builder.service;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetColumnEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.builder.vo.DataSetColumnVo;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetColumnService extends IBaseService<DatasetColumnEntity> {
    void deleteByDataSetId(JB4DSession jb4DSession, String dataSetId);

    List<DataSetColumnVo> getByDataSetId(JB4DSession jb4DSession, String dataSetId) throws IOException;
}
