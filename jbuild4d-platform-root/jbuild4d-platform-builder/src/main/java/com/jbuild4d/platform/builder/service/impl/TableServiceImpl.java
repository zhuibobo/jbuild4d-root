package com.jbuild4d.platform.builder.service.impl;

import com.itextpdf.io.image.Jbig2ImageData;
import com.jbuild4d.base.dbaccess.dao.TableFieldMapper;
import com.jbuild4d.base.dbaccess.dao.TableMapper;
import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.list.IListWhereCondition;
import com.jbuild4d.base.tools.common.list.ListUtility;
import com.jbuild4d.platform.builder.dbtablebuilder.TableBuilederFace;
import com.jbuild4d.platform.builder.exenum.TableTypeEnum;
import com.jbuild4d.platform.builder.service.ITableService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.transaction.annotation.Transactional;

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
    public TableServiceImpl(TableMapper _tableMapper,TableFieldMapper _tableFieldMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) throws JBuild4DGenerallyException {
        super(_tableMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableMapper=_tableMapper;
        tableBuilederFace=TableBuilederFace.getInstance(_sqlBuilderService);
        tableFieldMapper=_tableFieldMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, TableEntity record) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("未使用改方法");
    }

    @Override
    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    public void newTable(JB4DSession jb4DSession, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList) throws JBuild4DGenerallyException {
        try {
            if (this.existTableName(tableEntity.getTableName())) {
                throw new JBuild4DGenerallyException("已经存在表名为" + tableEntity.getTableName() + "的表!");
            } else {
                //创建物理表
                boolean createPhysicalTable = tableBuilederFace.newTable(tableEntity, tableFieldVOList);
                if (createPhysicalTable) {

                    try {
                        //写入逻辑表
                        tableEntity.setTableCreater(jb4DSession.getUserName());
                        tableEntity.setTableCreateTime(new Date());
                        tableEntity.setTableOrderNum(tableMapper.nextOrderNum());
                        tableEntity.setTableUpdater(jb4DSession.getUserName());
                        tableEntity.setTableUpdateTime(new Date());
                        tableEntity.setTableType(TableTypeEnum.Builder.getText());
                        tableEntity.setTableDbname("JBuild4D");
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
                        tableBuilederFace.deleteTable(tableEntity);
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
    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    public List<String> updateTable(JB4DSession jb4DSession, TableEntity newTableEntity, List<TableFieldVO> newTableFieldVOList,boolean ignorePhysicalError) throws JBuild4DGenerallyException {
        List<String> resultMessage=new ArrayList<>();

        TableEntity oldTableEntity=tableMapper.selectByPrimaryKey(newTableEntity.getTableId());

        if(!oldTableEntity.getTableName().equals(newTableEntity.getTableName())){
            throw new JBuild4DGenerallyException("表名不能修改!");
        }

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

        try
        {
            //修改物理表结构
            try {
                tableBuilederFace.updateTable(newTableEntity,newFields,updateFields,deleteFields);
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
            for (TableFieldEntity newfieldEntity : newFields) {
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
            for (TableFieldEntity updateField : updateFields) {
                updateField.setFieldUpdater(jb4DSession.getUserName());
                updateField.setFieldUpdateTime(new Date());
                tableFieldMapper.updateByPrimaryKeySelective(updateField);
            }
            //删除字段
            for (TableFieldEntity fieldEntity : deleteFields) {
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
    public boolean existTableName(String tableName) {
        return tableMapper.selectByTableName(tableName)!=null;
    }

    /*@Override
    public void deleteTable(TableEntity tableEntity) {

    }*/

    @Override
    public TableEntity getByTableName(String newTableName) {
        return tableMapper.selectByTableName(newTableName);
    }
}
