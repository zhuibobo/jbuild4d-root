package com.jbuild4d.platform.builder.service;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.exception.JBuild4DPhysicalTableException;
import com.jbuild4d.base.exception.JBuild4DSQLKeyWordException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.platform.builder.vo.UpdateTableResolveVo;
import com.jbuild4d.platform.builder.vo.ValidateTableUpdateResultVo;
import org.springframework.transaction.annotation.Transactional;

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
    void newTable(JB4DSession jb4DSession, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList) throws JBuild4DGenerallyException;

    UpdateTableResolveVo updateTableResolve(JB4DSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws IOException, JBuild4DGenerallyException;

    ValidateTableUpdateResultVo validateTableUpdateEnable(JB4DSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws JBuild4DGenerallyException, IOException;

    ValidateTableUpdateResultVo validateTableUpdateEnable(UpdateTableResolveVo resolveVo) throws JBuild4DGenerallyException;

    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    List<String> updateTable(JB4DSession jb4DSession, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList,boolean ignorePhysicalError) throws JBuild4DGenerallyException, IOException;

    boolean existLogicTableName(JB4DSession jb4DSession,String tableName);

    //void deleteTable(TableEntity tableEntity);

    boolean existPhysicsTableName(JB4DSession jb4DSession,String tableName);

    boolean deletePhysicsTable(JB4DSession jb4DSession, String tableName) throws JBuild4DSQLKeyWordException, JBuild4DPhysicalTableException;

    TableEntity getByTableName(JB4DSession jb4DSession, String tableName);
}