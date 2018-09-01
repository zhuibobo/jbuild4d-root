package com.jbuild4d.web.platform;

import com.jbuild4d.base.dbaccess.general.DBProp;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

@Component
public class SysInit implements InitializingBean {
    @Override
    public void afterPropertiesSet() throws Exception {
        //System.out.printf(DBProp.getUrl());
        DBProp.validateConfig();
    }
}
