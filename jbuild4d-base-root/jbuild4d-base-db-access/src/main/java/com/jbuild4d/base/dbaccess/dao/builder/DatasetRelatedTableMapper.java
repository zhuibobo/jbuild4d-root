package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetRelatedTableEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public interface DatasetRelatedTableMapper extends BaseMapper<DatasetRelatedTableEntity> {
    void deleteByDataSetId(String dataSetId);

    List<DatasetRelatedTableEntity> selectByDataSetId(String dataSetId);
}
