package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntityWithBLOBs;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTLTreeListEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
public interface FormResourceMapper extends BaseMapper<FormResourceEntityWithBLOBs> {
    FormResourceEntityWithBLOBs selectGreaterThanRecord(@Param("id") String id, @Param("formModuleId") String formModuleId);

    FormResourceEntityWithBLOBs selectLessThanRecord(@Param("id") String id,@Param("formModuleId") String formModuleId);
}
