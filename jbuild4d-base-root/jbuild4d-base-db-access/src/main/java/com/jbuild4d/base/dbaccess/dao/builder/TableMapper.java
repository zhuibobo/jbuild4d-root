package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface TableMapper extends BaseMapper<TableEntity> {
    TableEntity selectByTableName(String tableName);

    List<TableEntity> selectByTableIds(@Param("tableIds") List<String> tableIds);
}
