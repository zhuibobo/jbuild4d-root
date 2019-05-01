package com.jbuild4d.platform.builder.datastorage.impl;

import com.jbuild4d.base.dbaccess.dao.builder.TableFieldMapper;
import com.jbuild4d.base.dbaccess.dao.builder.TableMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DbLinkEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableFieldEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IMetadataService;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.core.base.exception.JBuild4DPhysicalTableException;
import com.jbuild4d.core.base.exception.JBuild4DSQLKeyWordException;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.list.IListWhereCondition;
import com.jbuild4d.core.base.list.ListUtility;
import com.jbuild4d.core.base.tools.StringUtility;
import com.jbuild4d.platform.builder.datastorage.IDbLinkService;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import com.jbuild4d.platform.builder.datastorage.dbtablebuilder.TableBuilederFace;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.exenum.TableTypeEnum;
import com.jbuild4d.platform.builder.datastorage.ITableService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.platform.builder.vo.UpdateTableResolveVo;
import com.jbuild4d.platform.builder.vo.ValidateTableUpdateResultVo;
import com.jbuild4d.platform.system.service.ICodeGenerateService;
import org.apache.commons.lang3.StringUtils;
import org.mybatis.generatorex.api.IntrospectedColumn;
import org.mybatis.generatorex.api.IntrospectedTable;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.beans.PropertyVetoException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public class TableServiceImpl extends BaseServiceImpl<TableEntity> implements ITableService
{
    TableBuilederFace tableBuilederFace;
    TableMapper tableMapper;
    TableFieldMapper tableFieldMapper;

    @Autowired
    ICodeGenerateService codeGenerateService;

    @Autowired
    IMetadataService metadataService;

    @Autowired
    IDbLinkService dbLinkService;

    @Autowired
    ITableGroupService tableGroupService;

    public TableServiceImpl(TableMapper _tableMapper,TableFieldMapper _tableFieldMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) throws JBuild4DGenerallyException {
        super(_tableMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableMapper=_tableMapper;
        tableBuilederFace=TableBuilederFace.getInstance(_sqlBuilderService);
        tableFieldMapper=_tableFieldMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, TableEntity record) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("未实现该方法");
    }

    @Override
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("未实现该方法");
    }

    @Override
    public int deleteByKeyNotValidate(JB4DSession jb4DSession, String id, String warningOperationCode) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("未实现该方法");
    }

    @Override
    public int deleteAll(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("未实现该方法");
    }

    @Override
    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    public void newTable(JB4DSession jb4DSession, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList,String groupId) throws JBuild4DGenerallyException {
        try {
            if (this.existLogicTableName(jb4DSession,tableEntity.getTableName())) {
                throw new JBuild4DGenerallyException("TBUILD_TABLE中已经存在表名为" + tableEntity.getTableName() + "的逻辑表!");
            } else {
                TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DSession,groupId);
                DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,tableGroupEntity.getTableGroupLinkId());

                //创建物理表
                boolean createPhysicalTable = tableBuilederFace.newTable(tableEntity, tableFieldVOList,tableGroupEntity,dbLinkEntity);
                if (createPhysicalTable) {

                    try {
                        //写入逻辑表
                        tableEntity.setTableGroupId(groupId);
                        tableEntity.setTableCode("T_"+ StringUtility.build1W5DCode(tableMapper.nextOrderNum()));
                        tableEntity.setTableCreater(jb4DSession.getUserName());
                        tableEntity.setTableCreateTime(new Date());
                        tableEntity.setTableOrderNum(tableMapper.nextOrderNum());
                        tableEntity.setTableUpdater(jb4DSession.getUserName());
                        tableEntity.setTableUpdateTime(new Date());
                        tableEntity.setTableType(TableTypeEnum.Builder.getText());
                        tableEntity.setTableDbname("JBuild4D");
                        tableEntity.setTableOrganId(jb4DSession.getOrganId());
                        tableEntity.setTableOrganName(jb4DSession.getOrganName());
                        tableEntity.setTableLinkId(dbLinkEntity.getDbId());
                        if(tableEntity.getTableStatus()==null||tableEntity.getTableStatus().equals("")){
                            tableEntity.setTableStatus(EnableTypeEnum.enable.getDisplayName());
                        }
                        tableMapper.insertSelective(tableEntity);
                        //写入字段
                        List<TableFieldEntity> tableFieldEntityList = TableFieldVO.VoListToEntityList(tableFieldVOList);
                        for (TableFieldEntity fieldEntity : tableFieldEntityList) {
                            fieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNumInTable(tableEntity.getTableId()));
                            fieldEntity.setFieldTableId(tableEntity.getTableId());
                            fieldEntity.setFieldCreater(jb4DSession.getUserName());
                            fieldEntity.setFieldCreateTime(new Date());
                            fieldEntity.setFieldUpdater(jb4DSession.getUserName());
                            fieldEntity.setFieldUpdateTime(new Date());
                            tableFieldMapper.insertSelective(fieldEntity);
                        }
                    }
                    catch (Exception ex){
                        //清空数据
                        tableBuilederFace.deleteTable(tableEntity,dbLinkEntity);
                        tableMapper.deleteByPrimaryKey(tableEntity.getTableId());
                        tableFieldMapper.deleteByTableId(tableEntity.getTableId());
                        throw ex;
                    }
                }
            }
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }

    @Override
    public UpdateTableResolveVo updateTableResolve(JB4DSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws IOException, JBuild4DGenerallyException {
        UpdateTableResolveVo resolveVo=new UpdateTableResolveVo();

        TableEntity oldTableEntity=tableMapper.selectByPrimaryKey(newTableEntity.getTableId());

        //计算出新增列,修改列,删除列的列表
        List<TableFieldEntity> oldTableFieldEntityList=tableFieldMapper.selectByTableId(newTableEntity.getTableId());

        //待删除的字段
        List<TableFieldVO> deleteFields=new ArrayList<>();
        for (TableFieldEntity tableFieldEntity : oldTableFieldEntityList) {
            if(!ListUtility.Exist(newTableFieldVOList, new IListWhereCondition<TableFieldVO>() {
                @Override
                public boolean Condition(TableFieldVO item) {
                    return item.getFieldId().equals(tableFieldEntity.getFieldId());
                }
            })){
                try {
                    deleteFields.add(TableFieldVO.parseToVo(tableFieldEntity));
                } catch (IOException ex) {
                    ex.printStackTrace();
                    throw new JBuild4DGenerallyException(ex.getMessage());
                }
            }
        }

        //新增的字段
        List<TableFieldVO> newFields=new ArrayList<>();
        for (TableFieldVO tableFieldVO : newTableFieldVOList) {
            if(!ListUtility.Exist(oldTableFieldEntityList, new IListWhereCondition<TableFieldEntity>() {
                @Override
                public boolean Condition(TableFieldEntity item) {
                    return item.getFieldId().equals(tableFieldVO.getFieldId());
                }
            })){
                newFields.add(tableFieldVO);
            }
        }

        //修改的字段
        List<TableFieldVO> updateFields=new ArrayList<>();
        for (TableFieldEntity tableFieldEntity : oldTableFieldEntityList) {
            TableFieldVO newVo = ListUtility.WhereSingle(newTableFieldVOList, new IListWhereCondition<TableFieldVO>() {
                @Override
                public boolean Condition(TableFieldVO item) {
                    return item.getFieldId().equals(tableFieldEntity.getFieldId());
                }
            });
            try {
                if(newVo!=null) {
                    if (TableFieldVO.isUpdate(TableFieldVO.parseToVo(tableFieldEntity), newVo)) {
                        newVo.setOldFieldName(tableFieldEntity.getFieldName());
                        updateFields.add(newVo);
                    }
                    else if (TableFieldVO.isUpdateLogicOnly(TableFieldVO.parseToVo(tableFieldEntity), newVo)) {
                        newVo.setOldFieldName(tableFieldEntity.getFieldName());
                        newVo.setUpdateLogicOnly(true);
                        updateFields.add(newVo);
                    }
                }
            } catch (IOException ex) {
                ex.printStackTrace();
                throw new JBuild4DGenerallyException(ex.getMessage());
            }
        }

        resolveVo.setNewTableEntity(newTableEntity);
        resolveVo.setOldTableEntity(oldTableEntity);
        resolveVo.setNewFields(newFields);
        resolveVo.setUpdateFields(updateFields);
        resolveVo.setDeleteFields(deleteFields);
        resolveVo.setNewTableFieldVOList(newTableFieldVOList);
        resolveVo.setOldTableFieldVOList(TableFieldVO.EntityListToVoList(newTableEntity.getTableName(),oldTableFieldEntityList));

        return resolveVo;
    }

    @Override
    public ValidateTableUpdateResultVo validateTableUpdateEnable(JB4DSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList) throws JBuild4DGenerallyException, IOException, PropertyVetoException {
        UpdateTableResolveVo updateTableResolveVo=updateTableResolve(jb4DSession,newTableEntity,newTableFieldVOList);
        return validateTableUpdateEnable(jb4DSession,updateTableResolveVo);
    }

    @Override
    public ValidateTableUpdateResultVo validateTableUpdateEnable(JB4DSession jb4DSession,UpdateTableResolveVo resolveVo) throws JBuild4DGenerallyException, PropertyVetoException {
        ValidateTableUpdateResultVo validateTableUpdateResultVo=new ValidateTableUpdateResultVo();

        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,resolveVo.getNewTableEntity().getTableLinkId());

        if(!resolveVo.getOldTableEntity().getTableName().equals(resolveVo.getNewTableEntity().getTableName())){
            validateTableUpdateResultVo.setEnable(false);
            validateTableUpdateResultVo.setMessage("表名不能修改!");
            return validateTableUpdateResultVo;
        }
        int limitNum=1000;
        if(tableBuilederFace.recordCount(resolveVo.getOldTableEntity(),dbLinkEntity)>limitNum){
            if(resolveVo.getUpdateFields().size()>0){
                validateTableUpdateResultVo.setEnable(false);
                validateTableUpdateResultVo.setMessage("表"+resolveVo.getOldTableEntity().getTableName()+"的记录条数>"+limitNum+",不允许进行字段的修改,如需修改,请手动修改!");
                return validateTableUpdateResultVo;
            }
            else if(resolveVo.getDeleteFields().size()>0){
                validateTableUpdateResultVo.setEnable(false);
                validateTableUpdateResultVo.setMessage("表"+resolveVo.getOldTableEntity().getTableName()+"的记录条数>"+limitNum+",不允许进行字段的删除,如需修改,请手动修改!");
                return validateTableUpdateResultVo;
            }
        }

        validateTableUpdateResultVo.setEnable(true);
        validateTableUpdateResultVo.setMessage("");
        return validateTableUpdateResultVo;
    }

    @Override
    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    public List<String> updateTable(JB4DSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList,boolean ignorePhysicalError) throws JBuild4DGenerallyException, IOException, PropertyVetoException {
        List<String> resultMessage=new ArrayList<>();

        UpdateTableResolveVo updateTableResolveVo=updateTableResolve(jb4DSession,newTableEntity,newTableFieldVOList);

        if(newTableEntity.getTableGroupId()==null||newTableEntity.getTableGroupId().equals("")) {
            throw new JBuild4DGenerallyException("newTableEntity中的TableGroupId不能为空!");
        }
        TableGroupEntity tableGroupEntity=tableGroupService.getByPrimaryKey(jb4DSession,newTableEntity.getTableGroupId());
        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,tableGroupEntity.getTableGroupLinkId());

        //判断能否进行表的修改
        ValidateTableUpdateResultVo validateTableUpdateResultVo=this.validateTableUpdateEnable(jb4DSession,updateTableResolveVo);
        if(!validateTableUpdateResultVo.isEnable()){
            throw new JBuild4DGenerallyException(validateTableUpdateResultVo.getMessage());
        }

        try
        {

            //修改物理表结构
            try {
                tableBuilederFace.updateTable(newTableEntity,updateTableResolveVo.getNewFields(),updateTableResolveVo.getUpdateFields(),updateTableResolveVo.getDeleteFields(),tableGroupEntity,dbLinkEntity);
            }
            catch (Exception ex){
                if(ignorePhysicalError){
                    resultMessage.add("修改物理表失败!");
                }
                else{
                    throw ex;
                }
            }
            //修改表的逻辑结构
            tableMapper.updateByPrimaryKeySelective(newTableEntity);
            //写入逻辑表
            newTableEntity.setTableUpdater(jb4DSession.getUserName());
            newTableEntity.setTableUpdateTime(new Date());
            tableMapper.updateByPrimaryKeySelective(newTableEntity);
            //新增字段
            for (TableFieldEntity newfieldEntity : updateTableResolveVo.getNewFields()) {
                newfieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNumInTable(newTableEntity.getTableId()));
                newfieldEntity.setFieldTableId(newTableEntity.getTableId());
                newfieldEntity.setFieldCreater(jb4DSession.getUserName());
                newfieldEntity.setFieldCreateTime(new Date());
                int i;
                newfieldEntity.setFieldUpdater(jb4DSession.getUserName());
                newfieldEntity.setFieldUpdateTime(new Date());
                tableFieldMapper.insertSelective(newfieldEntity);
            }
            //修改字段
            for (TableFieldEntity updateField : updateTableResolveVo.getUpdateFields()) {
                updateField.setFieldUpdater(jb4DSession.getUserName());
                updateField.setFieldUpdateTime(new Date());
                tableFieldMapper.updateByPrimaryKeySelective(updateField);
            }
            //删除字段
            for (TableFieldEntity fieldEntity : updateTableResolveVo.getDeleteFields()) {
                tableFieldMapper.deleteByPrimaryKey(fieldEntity.getFieldId());
            }
            return resultMessage;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }

    @Override
    public boolean existLogicTableName(JB4DSession jb4DSession,String tableName) {
        return tableMapper.selectByTableName(tableName)!=null;
    }

    @Override
    public boolean existPhysicsTableName(JB4DSession jb4DSession,String tableName) throws JBuild4DGenerallyException, PropertyVetoException {
        TableEntity tableEntity=tableMapper.selectByTableName(tableName);
        if(tableEntity==null){
            return false;
        }
        DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,tableEntity.getTableLinkId());
        return tableBuilederFace.isExistTable(tableName,dbLinkEntity);
    }

    @Override
    public boolean deletePhysicsTable(JB4DSession jb4DSession, String tableName, String warningOperationCode) throws JBuild4DSQLKeyWordException, JBuild4DPhysicalTableException, JBuild4DGenerallyException, PropertyVetoException {
        if(JBuild4DProp.getWarningOperationCode().equals(warningOperationCode)) {
            TableEntity tableEntity=tableMapper.selectByTableName(tableName);
            DbLinkEntity dbLinkEntity=dbLinkService.getByPrimaryKey(jb4DSession,tableEntity.getTableLinkId());
            return tableBuilederFace.deleteTable(tableName,dbLinkEntity);
        }
        throw new JBuild4DGenerallyException("删除失败WarningOperationCode错误");
    }

    @Override
    public boolean deleteLogicTableAndFields(JB4DSession jb4DSession, String tableName, String warningOperationCode) throws JBuild4DGenerallyException {
        TableEntity tableEntity=tableMapper.selectByTableName(tableName);
        if(tableEntity!=null){
            tableMapper.deleteByPrimaryKey(tableEntity.getTableId());
            tableFieldMapper.deleteByTableId(tableEntity.getTableId());
            return true;
        }
        return true;
    }

    @Override
    public TableEntity getByTableName(JB4DSession jb4DSession,String newTableName) {
        return tableMapper.selectByTableName(newTableName);
    }

    @Override
    public void registerSystemTableToBuilderToModule(JB4DSession jb4DSession, String tableName, TableGroupEntity tableGroupEntity) throws JBuild4DGenerallyException {
        IntrospectedTable tableInfo=codeGenerateService.getTableInfo(tableName);
        if(tableInfo!=null) {
            //删除旧的逻辑记录.
            this.deleteLogicTableAndFields(jb4DSession, tableName, JBuild4DProp.getWarningOperationCode());
            //写入新的逻辑记录.
            //String tableName=tableInfo.getFullyQualifiedTable().getIntrospectedTableName().toUpperCase();
            String tableComment = tableInfo.getRemarks();
            if (tableComment == null || tableComment.equals("")) {
                tableComment = metadataService.getTableComment(jb4DSession, tableName);
                if(tableComment==null||tableComment.equals("")){
                    tableComment=tableName;
                }
            }
            String tableId=StringUtils.join(tableName.split(""), "_");
            TableEntity tableEntity = new TableEntity();
            tableEntity.setTableId(tableId);
            tableEntity.setTableCode("T_"+StringUtility.build1W5DCode(tableMapper.nextOrderNum()));
            tableEntity.setTableCaption(tableComment.split(":")[0]);
            tableEntity.setTableName(tableName);
            tableEntity.setTableDbname("JBuild4D");
            tableEntity.setTableCreateTime(new Date());
            tableEntity.setTableCreater(jb4DSession.getUserName());
            tableEntity.setTableUpdateTime(new Date());
            tableEntity.setTableUpdater(jb4DSession.getUserName());
            tableEntity.setTableServiceValue("");
            tableEntity.setTableType(TableTypeEnum.DBDesign.getText());
            tableEntity.setTableIssystem(TrueFalseEnum.True.getDisplayName());
            tableEntity.setTableOrderNum(tableMapper.nextOrderNum());
            tableEntity.setTableDesc(tableComment);
            tableEntity.setTableGroupId(tableGroupEntity.getTableGroupId());
            tableEntity.setTableStatus(EnableTypeEnum.enable.getDisplayName());
            tableEntity.setTableLinkId("");
            tableEntity.setTableOrganId(jb4DSession.getOrganId());
            tableEntity.setTableOrganName(jb4DSession.getOrganName());
            tableEntity.setTableLinkId(dbLinkService.getLocationDBLinkId());
            tableMapper.insert(tableEntity);

            for (IntrospectedColumn primaryKeyColumn : tableInfo.getPrimaryKeyColumns()) {
                this.registerSystemTableFieldToBuilderToModule(jb4DSession,tableEntity,primaryKeyColumn,true);
            }

            for (IntrospectedColumn nonPrimaryKeyColumn : tableInfo.getNonPrimaryKeyColumns()) {
                this.registerSystemTableFieldToBuilderToModule(jb4DSession,tableEntity,nonPrimaryKeyColumn,false);
            }

        }
        else {
            throw new JBuild4DGenerallyException("获取不到表:"+tableName+"的信息!");
        }
    }

    @Override
    public List<TableEntity> getTablesByTableIds(JB4DSession session, List<String> tableIds) {
        return tableMapper.selectByTableIds(tableIds);
    }

    @Override
    public boolean testTablesInTheSameDBLink(JB4DSession jb4DSession,List tableList) {
        String sameDBLinkId="";
        for (Object o : tableList) {
            String tableName=o.toString();
            TableEntity tableEntity=tableMapper.selectByTableName(tableName);
            if(sameDBLinkId.equals("")){
                sameDBLinkId=tableEntity.getTableLinkId();
            }
            else{
                if(!sameDBLinkId.equals(tableEntity.getTableLinkId())){
                    return false;
                }
            }
        }
        return true;
    }

    @Override
    public DbLinkEntity getDBLinkByTableName(JB4DSession jb4DSession,String tableName) throws JBuild4DGenerallyException {
        TableEntity tableEntity=tableMapper.selectByTableName(tableName);
        return dbLinkService.getByPrimaryKey(jb4DSession,tableEntity.getTableLinkId());
    }

    private void registerSystemTableFieldToBuilderToModule(JB4DSession jb4DSession,TableEntity tableEntity,IntrospectedColumn column,boolean isKey) throws JBuild4DGenerallyException {
        TableFieldEntity tableFieldEntity=new TableFieldEntity();
        tableFieldEntity.setFieldId(tableEntity.getTableName()+tableFieldMapper.nextOrderNumInTable(tableEntity.getTableId())+column.getActualColumnName());
        tableFieldEntity.setFieldTableId(tableEntity.getTableId());
        tableFieldEntity.setFieldName(column.getActualColumnName());

        String tableCaption=column.getActualColumnName().toUpperCase();
        if(column.getRemarks()!=null&&!column.getRemarks().equals("")){
            tableCaption=column.getRemarks().split(":")[0];
        }

        tableFieldEntity.setFieldCaption(tableCaption);
        tableFieldEntity.setFieldIsPk(isKey?TrueFalseEnum.True.getDisplayName():TrueFalseEnum.False.getDisplayName());
        tableFieldEntity.setFieldAllowNull(column.isNullable()?TrueFalseEnum.True.getDisplayName():TrueFalseEnum.False.getDisplayName());

        String dbFieldType="";
        tableFieldEntity.setFieldDecimalLength(0);
        if(column.getJdbcTypeName().toUpperCase().equals("VARCHAR")||column.getJdbcTypeName().toUpperCase().equals("NVARCHAR")){
            dbFieldType= TableFieldTypeEnum.NVarCharType.getText().trim();
        }
        else if(column.getJdbcTypeName().toUpperCase().equals("INTEGER")||column.getJdbcTypeName().toUpperCase().equals("BIGINT")){
            dbFieldType= TableFieldTypeEnum.IntType.getText().trim();
        }
        else if(column.getJdbcTypeName().toUpperCase().equals("TIMESTAMP")){
            dbFieldType= TableFieldTypeEnum.DataTimeType.getText().trim();
        }
        else if(column.getJdbcTypeName().toUpperCase().equals("LONGVARCHAR")||column.getJdbcTypeName().toUpperCase().equals("LONGVARBINARY")||column.getJdbcTypeName().toUpperCase().equals("VARBINARY")){
            dbFieldType= TableFieldTypeEnum.TextType.getText().trim();
        }
        else if(column.getJdbcTypeName().toUpperCase().equals("DECIMAL")){
            dbFieldType= TableFieldTypeEnum.NumberType.getText().trim();
            tableFieldEntity.setFieldDecimalLength(2);
        }
        else{
            throw new JBuild4DGenerallyException("未知类型:"+column.getJdbcTypeName());
        }
        tableFieldEntity.setFieldDataType(dbFieldType);
        tableFieldEntity.setFieldDataLength(column.getLength());

        tableFieldEntity.setFieldDefaultValue("");
        tableFieldEntity.setFieldDefaultText("");
        tableFieldEntity.setFieldCreateTime(new Date());
        tableFieldEntity.setFieldCreater(jb4DSession.getUserName());
        tableFieldEntity.setFieldUpdateTime(new Date());
        tableFieldEntity.setFieldUpdater(jb4DSession.getUserName());
        tableFieldEntity.setFieldDesc(column.getRemarks());
        tableFieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNumInTable(tableEntity.getTableId()));
        tableFieldEntity.setFieldTemplateName("");
        tableFieldEntity.setFieldDefaultType("");

        tableFieldMapper.insert(tableFieldEntity);
    }
}
