package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.TableFieldMapper;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.service.ITableFieldService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public class TableFieldServiceImpl extends BaseServiceImpl<TableFieldEntity> implements ITableFieldService
{
    TableFieldMapper tableFieldMapper;
    public TableFieldServiceImpl(TableFieldMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableFieldMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, TableFieldEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableFieldEntity>() {
            @Override
            public TableFieldEntity run(JB4DSession jb4DSession,TableFieldEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public List<String> getFieldTemplateName() {
        return tableFieldMapper.selectFieldTemplateName();
    }

    @Override
    public List<TableFieldEntity> getTemplateFieldsByName(String templateName) {
        return tableFieldMapper.selectTemplateFieldsByName(templateName);
    }

    @Override
    public void createGeneralTemplate(JB4DSession jb4DSession) {
        String generalTemplateName="GeneralTemplate";
        tableFieldMapper.deleteTemplate(generalTemplateName);
        TableFieldEntity idField=newFiled(jb4DSession,"Template","ID","ID",
                TrueFalseEnum.True,TrueFalseEnum.False,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","表主键",generalTemplateName);
        TableFieldEntity createTimeField=newFiled(jb4DSession,"Tempalte","F_CREATE_TIEE","记录时间",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.DataTimeType,20,0,
                "","","",generalTemplateName);
        tableFieldMapper.insert(idField);
        tableFieldMapper.insert(createTimeField);
    }

    private TableFieldEntity newFiled(JB4DSession jb4DSession, String tableId, String fieldName, String fieldCaption,
                                      TrueFalseEnum pk, TrueFalseEnum allowNull,
                                      TableFieldTypeEnum fieldDataType,int dataLength,int decimalLength,
                                      String fieldDefaultValue,String fieldDefaultText,String fieldDesc,String templateName
    ){
        TableFieldEntity fieldEntity=new TableFieldEntity();
        fieldEntity.setFieldFieldId(UUIDUtility.getUUID());
        fieldEntity.setFieldTableId(tableId);
        fieldEntity.setFieldName(fieldName);
        fieldEntity.setFieldCaption(fieldCaption);
        fieldEntity.setFieldIsPk(pk.getDisplayName());
        fieldEntity.setFieldAllowNull(allowNull.getDisplayName());
        fieldEntity.setFieldDataType(fieldDataType.getValue());
        fieldEntity.setFieldDataLength(dataLength);
        fieldEntity.setFieldDecimalLength(decimalLength);
        fieldEntity.setFieldDefaultValue(fieldDefaultValue);
        fieldEntity.setFieldDefaultText(fieldDefaultText);
        fieldEntity.setFieldCreateTime(new Date());
        fieldEntity.setFieldCreater(jb4DSession.getUserName());
        fieldEntity.setFieldUpdateTime(new Date());
        fieldEntity.setFieldUpdater(jb4DSession.getUserName());
        fieldEntity.setFieldDesc(fieldDesc);
        fieldEntity.setFieldOrderNum(tableFieldMapper.nextOrderNum());
        fieldEntity.setFieldTemplateName(templateName);
        return fieldEntity;
    }
}
