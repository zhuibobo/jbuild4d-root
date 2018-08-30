package com.jbuild4d.platform.builder.dbtablebuilder;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableFieldEntity;
import com.jbuild4d.base.exception.JBuild4DPhysicalTableException;
import com.jbuild4d.platform.builder.vo.TableFieldVO;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public class MYSQLTableBuilder extends TableBuidler {
    @Override
    protected String buildDeleteTableSQL(TableEntity tableEntity) {
        return null;
    }

    @Override
    protected boolean deleteField(TableEntity tableEntity, TableFieldVO deleteField) {
        return false;
    }

    @Override
    protected boolean updateField(TableEntity tableEntity, TableFieldVO updateField) throws JBuild4DPhysicalTableException {
        return false;
    }

    @Override
    protected boolean newField(TableEntity tableEntity, TableFieldEntity fieldEntity) throws JBuild4DPhysicalTableException {
        return false;
    }

    @Override
    protected void createTableEnd(TableEntity tableEntity) {

    }

    @Override
    protected boolean isExistTable(TableEntity tableEntity) {
        return false;
    }

    @Override
    protected String buildCreateTableSQL(TableEntity tableEntity) {
        return null;
    }
}
