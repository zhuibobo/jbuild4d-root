package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface DatasetMapper extends BaseMapper<DatasetEntity> {
    List<DatasetEntity> selectByGroupId(String groupId);
}
