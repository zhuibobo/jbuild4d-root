package com.jbuild4d.platform.builder.dbtablebuilder;

import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.dbaccess.general.DBProp;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.vo.TableFieldVO;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public class TableBuilederFace {

    protected TableBuidler dbBuidler;

    private TableBuilederFace(){

    }

    public static TableBuilederFace getInstance(ISQLBuilderService sqlBuilderService) throws JBuild4DGenerallyException {
        TableBuilederFace instance=new TableBuilederFace();
        if(DBProp.isSqlServer()){
            instance.dbBuidler=new MSSQLTableBuilder();
            instance.dbBuidler.setSqlBuilderService(sqlBuilderService);
        }
        else if(DBProp.isMySql()){
            throw new JBuild4DGenerallyException("暂不支持MYSQL");
        }
        else if(DBProp.isOracle()){
            throw new JBuild4DGenerallyException("暂不支持Oracle");
        }
        return instance;
    }

    public BuilderResultMessage newTable(TableEntity tableEntity, List<TableFieldVO> fieldVos){
        return dbBuidler.newTable(tableEntity,fieldVos);
    }

    public BuilderResultMessage updateTable(TableEntity tableEntity,List<TableFieldVO> newFields,List<TableFieldVO> updateFields,List<TableFieldVO> deleteFields){
        return dbBuidler.updateTable(tableEntity,newFields,updateFields,deleteFields);
    }

    public BuilderResultMessage deleteTable(TableEntity tableEntity){
        return dbBuidler.deleteTable(tableEntity);
    }
}
