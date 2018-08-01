package com.jbuild4d.service;

import com.jbuild4d.base.dbaccess.dao.TableFieldMapper;
import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.builder.dbtablebuilder.BuilderResultMessage;
import com.jbuild4d.platform.builder.dbtablebuilder.MSSQLTableBuilder;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
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
    public void testNewTable(){
        String newTableName="Table1";
        MSSQLTableBuilder mssqlTableBuilder=new MSSQLTableBuilder();
        mssqlTableBuilder.setSqlBuilderService(sqlBuilderService);
        TableEntity tableEntity=new TableEntity();
        tableEntity.setTableName(newTableName);
        List<TableFieldEntity> fieldEntities=new ArrayList<>();

        TableFieldEntity idField=newFiled(jb4DSession,"Template","ID","ID",
                TrueFalseEnum.True,TrueFalseEnum.False,
                TableFieldTypeEnum.NVarCharType,50,0,
                "","","表主键","");
        TableFieldEntity createTimeField=newFiled(jb4DSession,"Tempalte","F_CREATE_TIEE","记录时间",
                TrueFalseEnum.False,TrueFalseEnum.True,
                TableFieldTypeEnum.DataTimeType,20,0,
                "","","","");
        fieldEntities.add(idField);
        fieldEntities.add(createTimeField);
        BuilderResultMessage builderResultMessage=mssqlTableBuilder.newTable(tableEntity,fieldEntities);

        if(builderResultMessage.isSuccess()) {
            String selectSql = "select * from " + newTableName;
            sqlBuilderService.selectList(selectSql);

            //mssqlTableBuilder.deleteTable(tableEntity);
            System.out.println("删除表成功!");
        }
        else
        {
            System.out.println(builderResultMessage.getMessage());
        }
    }

    private TableFieldEntity newFiled(JB4DSession jb4DSession, String tableId, String fieldName, String fieldCaption,
                                      TrueFalseEnum pk, TrueFalseEnum allowNull,
                                      TableFieldTypeEnum fieldDataType, int dataLength, int decimalLength,
                                      String fieldDefaultValue, String fieldDefaultText, String fieldDesc, String templateName
    ){
        TableFieldEntity fieldEntity=new TableFieldEntity();
        fieldEntity.setFieldFieldId(UUIDUtility.getUUIDNotSplit());
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
