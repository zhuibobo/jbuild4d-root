package com.jbuild4d.platform.builder.datastorage;

import com.jbuild4d.base.dbaccess.dbentities.builder.DbLinkEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.core.base.exception.JBuild4DPhysicalTableException;
import com.jbuild4d.core.base.exception.JBuild4DSQLKeyWordException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.platform.builder.vo.UpdateTableResolveVo;
import com.jbuild4d.platform.builder.vo.ValidateTableUpdateResultVo;
import org.mybatis.generatorex.api.IntrospectedTable;
import org.springframework.transaction.annotation.Transactional;

import java.beans.PropertyVetoException;
import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface ITableService extends IBaseService<TableEntity> {
    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    void newTable(JB4DSession jb4DSession, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList,String groupId) throws JBuild4DGenerallyException;

    UpdateTableResolveVo updateTableResolve(JB4DSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws IOException, JBuild4DGenerallyException;

    ValidateTableUpdateResultVo validateTableUpdateEnable(JB4DSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws JBuild4DGenerallyException, IOException, PropertyVetoException;

    ValidateTableUpdateResultVo validateTableUpdateEnable(JB4DSession jb4DSession,UpdateTableResolveVo resolveVo) throws JBuild4DGenerallyException, PropertyVetoException;

    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    List<String> updateTable(JB4DSession jb4DSession, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList,boolean ignorePhysicalError) throws JBuild4DGenerallyException, IOException, PropertyVetoException;

    boolean existLogicTableName(JB4DSession jb4DSession,String tableName);

    //void deleteTable(TableEntity tableEntity);

    boolean existPhysicsTableName(JB4DSession jb4DSession,String tableName) throws JBuild4DGenerallyException, PropertyVetoException;

    boolean deletePhysicsTable(JB4DSession jb4DSession, String tableName, String warningOperationCode) throws JBuild4DSQLKeyWordException, JBuild4DPhysicalTableException, JBuild4DGenerallyException, PropertyVetoException;

    boolean deleteLogicTableAndFields(JB4DSession jb4DSession, String tableName, String warningOperationCode) throws JBuild4DGenerallyException;

    TableEntity getByTableName(JB4DSession jb4DSession, String tableName);

    void registerSystemTableToBuilderToModule(JB4DSession jb4DSession, String tableName, TableGroupEntity tableGroupEntity) throws JBuild4DGenerallyException;

    List<TableEntity> getTablesByTableIds(JB4DSession session, List<String> tableIds);

    boolean testTablesInTheSameDBLink(JB4DSession jb4DSession,List tableList);

    DbLinkEntity getDBLinkByTableName(JB4DSession jb4DSession,String toString) throws JBuild4DGenerallyException;
}