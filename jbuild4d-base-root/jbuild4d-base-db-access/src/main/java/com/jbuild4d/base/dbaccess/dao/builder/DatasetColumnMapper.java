package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetColumnEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public interface DatasetColumnMapper extends BaseMapper<DatasetColumnEntity> {
    void deleteByDataSetId(String dataSetId);

    List<DatasetColumnEntity> selectByDataSetId(String dataSetId);
}
