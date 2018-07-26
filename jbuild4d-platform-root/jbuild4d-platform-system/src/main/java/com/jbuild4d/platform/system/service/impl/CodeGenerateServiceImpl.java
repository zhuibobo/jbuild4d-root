package com.jbuild4d.platform.system.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.exenum.DBTypeEnum;
import com.jbuild4d.base.dbaccess.general.DBProp;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.system.service.ICodeGenerateService;
import org.apache.poi.ss.formula.functions.T;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/25
 * To change this template use File | Settings | File Templates.
 */
public class CodeGenerateServiceImpl implements ICodeGenerateService {

    ISQLBuilderService sqlBuilderService;
    public CodeGenerateServiceImpl(ISQLBuilderService _sqlBuilderService) {
        sqlBuilderService=_sqlBuilderService;
        //Select Name FROM SysObjects Where XType='U' orDER BY Name
        //DBType=MSSQLSERVER
        //#DBType=ORACLE
        //#DBType=MYSQL
    }

    @Override
    public PageInfo<List<Map<String, Object>>> getTables(JB4DSession jb4DSession, Integer pageNum, Integer pageSize, Map<String, Object> searchMap) {
        String sql="";
        if(DBProp.isSqlServer()){
            sql="Select Name as TableName FROM SysObjects Where XType='U' orDER BY Name";
        }
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<Map<String, Object>> list=sqlBuilderService.selectList(sql,new HashMap());
        PageInfo<List<Map<String, Object>>> pageInfo = new PageInfo(list);
        return pageInfo;
    }
}
