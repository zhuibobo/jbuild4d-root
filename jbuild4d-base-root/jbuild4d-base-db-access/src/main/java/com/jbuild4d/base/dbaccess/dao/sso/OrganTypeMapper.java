package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganTypeEntity;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
public interface OrganTypeMapper extends BaseMapper<OrganTypeEntity> {
    OrganTypeEntity selectByOrganValue(String organTypeValue);
}
