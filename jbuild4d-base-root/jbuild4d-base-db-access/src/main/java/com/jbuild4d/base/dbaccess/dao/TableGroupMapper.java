package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.SettingEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableGroupEntity;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface TableGroupMapper extends BaseMapper<TableGroupEntity> {
    List<TableGroupEntity> selectChilds(String id);

    TableGroupEntity selectLessThanRecord(String id, String tableGroupParentId);

    TableGroupEntity selectGreaterThanRecord(String id, String tableGroupParentId);
}
