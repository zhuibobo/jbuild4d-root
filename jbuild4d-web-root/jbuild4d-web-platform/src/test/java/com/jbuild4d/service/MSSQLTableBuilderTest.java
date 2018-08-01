package com.jbuild4d.service;

import com.jbuild4d.base.dbaccess.dao.TableFieldMapper;
import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.builder.dbtablebuilder.BuilderResultMessage;
import com.jbuild4d.platform.builder.dbtablebuilder.MSSQLTableBuilder;
import com.jbuild4d.platform.builder.dbtablebuilder.TableBuilederFace;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.BuildBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.DevDemoBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.OrganBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.SystemBeansConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes= {
        MybatisBeansConfig.class,
        SystemBeansConfig.class,
        DevDemoBeansConfig.class,
        OrganBeansConfig.class,
        BuildBeansConfig.class
})
public class MSSQLTableBuilderTest extends BaseTest {

    @Autowired
    ISQLBuilderService sqlBuilderService;

    @Autowired
    TableFieldMapper tableFieldMapper;

    @Test
    public void testNewTable() throws JBuild4DGenerallyException {
        this.newTable(true);
    }

    String newTableName="Table1";

    public List<TableFieldVO> newTable(boolean autoDeleteTable) throws JBuild4DGenerallyException {
        TableBuilederFace tableBuilederFace= TableBuilederFace.getInstance(sqlBuilderService);
        //mssqlTableBuilder.setSqlBuilderService(sqlBuilderService);
        TableEntity tableEntity=new TableEntity();
        tableEntity.setTableName(newTableName);
        List<TableFieldVO> fieldEntities=new ArrayList<>();

        TableFieldVO idField=newFiled(jb4DSession,"Template","ID","ID",
                TrueFalseEnum.True,TrueFalseEnum.False,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","表主键","");
        TableFieldVO createTimeField=newFiled(jb4DSession,"Tempalte","F_CREATE_TIEE","记录时间",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.DataTimeType,20,0,
                "","","","");

        TableFieldVO intField=newFiled(jb4DSession,"Tempalte","F_INT","F_INT",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.IntType,0,0,
                "","","","");

        TableFieldVO decimalField=newFiled(jb4DSession,"Tempalte","F_DECIMAL","F_DECIMAL",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NumberType,20,2,
                "","","","");

        TableFieldVO nvarcharField=newFiled(jb4DSession,"Tempalte","F_NVARCHAR","F_NVARCHAR",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType,200,0,
                "","","","");

        TableFieldVO ntextField=newFiled(jb4DSession,"Tempalte","F_NTEXT","F_NTEXT",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.TextType,0,0,
                "","","","");

        fieldEntities.add(idField);
        fieldEntities.add(createTimeField);
        fieldEntities.add(intField);
        fieldEntities.add(decimalField);
        fieldEntities.add(nvarcharField);
        fieldEntities.add(ntextField);
        BuilderResultMessage builderResultMessage=tableBuilederFace.newTable(tableEntity,fieldEntities);

        if(builderResultMessage.isSuccess()) {
            String selectSql = "select * from " + newTableName;
            sqlBuilderService.selectList(selectSql);

            if(autoDeleteTable) {
                tableBuilederFace.deleteTable(tableEntity);
                System.out.println("删除表成功!");
            }
        }
        else
        {
            System.out.println(builderResultMessage.getMessage());
        }

        return fieldEntities;
    }

    @Test
    public void testUpdateTable() throws JBuild4DGenerallyException {
        List<TableFieldVO> fieldVos=this.newTable(false);

        //设置新增列
        List<TableFieldVO> newFieldVos=new ArrayList<>();
        TableFieldVO intField1=newFiled(jb4DSession,"Tempalte","F_INT_1","F_INT_1",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.IntType,0,0,
                "","","","");
        newFieldVos.add(intField1);

        //设置修改列
        TableFieldVO intField=fieldVos.get(2);
        intField.setFieldDataType(TableFieldTypeEnum.NumberType.getValue());
        intField.setFieldDataLength(20);
        intField.setFieldDecimalLength(2);
        List<TableFieldVO> updateFieldVos=new ArrayList<>();
        updateFieldVos.add(intField);

        //设置删除列
        TableFieldVO delField=fieldVos.get(3);
        List<TableFieldVO> deleteFieldVos=new ArrayList<>();
        deleteFieldVos.add(delField);

        TableBuilederFace tableBuilederFace= TableBuilederFace.getInstance(sqlBuilderService);
        TableEntity tableEntity=new TableEntity();
        tableEntity.setTableName(newTableName);
        tableBuilederFace.updateTable(tableEntity,newFieldVos,updateFieldVos,deleteFieldVos);
    }

    private TableFieldVO newFiled(JB4DSession jb4DSession, String tableId, String fieldName, String fieldCaption,
                                      TrueFalseEnum pk, TrueFalseEnum allowNull,
                                      TableFieldTypeEnum fieldDataType, int dataLength, int decimalLength,
                                      String fieldDefaultValue, String fieldDefaultText, String fieldDesc, String templateName
    ){
        TableFieldVO fieldVO=new TableFieldVO();
        fieldVO.setFieldFieldId(UUIDUtility.getUUIDNotSplit());
        fieldVO.setFieldTableId(tableId);
        fieldVO.setFieldName(fieldName);
        fieldVO.setFieldCaption(fieldCaption);
        fieldVO.setFieldIsPk(pk.getDisplayName());
        fieldVO.setFieldAllowNull(allowNull.getDisplayName());
        fieldVO.setFieldDataType(fieldDataType.getValue());
        fieldVO.setFieldDataLength(dataLength);
        fieldVO.setFieldDecimalLength(decimalLength);
        fieldVO.setFieldDefaultValue(fieldDefaultValue);
        fieldVO.setFieldDefaultText(fieldDefaultText);
        fieldVO.setFieldCreateTime(new Date());
        fieldVO.setFieldCreater(jb4DSession.getUserName());
        fieldVO.setFieldUpdateTime(new Date());
        fieldVO.setFieldUpdater(jb4DSession.getUserName());
        fieldVO.setFieldDesc(fieldDesc);
        fieldVO.setFieldOrderNum(tableFieldMapper.nextOrderNum());
        fieldVO.setFieldTemplateName(templateName);
        return fieldVO;
    }
}
