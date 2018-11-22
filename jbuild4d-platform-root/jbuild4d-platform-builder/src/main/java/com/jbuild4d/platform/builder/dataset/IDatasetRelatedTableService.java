package com.jbuild4d.platform.builder.dataset;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetRelatedTableEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.builder.vo.DataSetColumnVo;
import com.jbuild4d.platform.builder.vo.DataSetRelatedTableVo;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetRelatedTableService extends IBaseService<DatasetRelatedTableEntity> {
    void deleteByDataSetId(JB4DSession jb4DSession, String dataSetId);

    List<DataSetRelatedTableVo> getByDataSetId(JB4DSession jb4DSession, String dataSetId) throws IOException;
}
