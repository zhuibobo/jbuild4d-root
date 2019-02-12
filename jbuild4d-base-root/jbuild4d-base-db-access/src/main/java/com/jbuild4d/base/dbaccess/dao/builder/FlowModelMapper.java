package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.FlowModelEntity;
import org.apache.ibatis.annotations.Param;

public interface FlowModelMapper extends BaseMapper<FlowModelEntity> {
    FlowModelEntity selectGreaterThanRecord(@Param("Id") String id, @Param("modelModuleId") String modelModuleId);

    FlowModelEntity selectLessThanRecord(@Param("Id") String id,@Param("modelModuleId") String modelModuleId);
}
