package com.jbuild4d.base.dbaccess.dao;

import java.util.List;
import java.util.Map;

public interface GeneralMapper {
    List<Map> executeSql(String sql);

    List<Map> executeSqlMap(Map map);
}

