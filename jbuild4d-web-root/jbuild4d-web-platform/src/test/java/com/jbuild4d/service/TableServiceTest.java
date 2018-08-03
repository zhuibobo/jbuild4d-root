package com.jbuild4d.service;

import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.service.ITableFieldService;
import com.jbuild4d.platform.builder.service.ITableService;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/2
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
public class TableServiceTest extends BaseTest  {

    @Autowired
    ITableService tableService;

    @Autowired
    ITableFieldService tableFieldService;

    @Autowired
    ISQLBuilderService sqlBuilderService;

    @Test
    public void testUpdateTable() throws JBuild4DGenerallyException, IOException {
        testNewTable();
        TableEntity tableEntity=tableService.getByTableName(newTableName);
        List<TableFieldVO> tableFieldVoList=tableFieldService.getTableFieldsByTableId(tableEntity.getTableId());

        tableEntity.setTableCaption("我叫新表");

        //tableService.updateTable(jb4DSession,tableEntity,tableFieldVoList,false);

        //加入新列
        TableFieldVO nvarcharField = newFiled(jb4DSession, "Tempalte", "F_NVARCHAR_1", "F_NVARCHAR_1",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType, 200, 0,
                "", "", "", "");

        TableFieldVO ntextField = newFiled(jb4DSession, "Tempalte", "F_NTEXT_1", "F_NTEXT_1",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");

        tableFieldVoList.add(nvarcharField);
        tableFieldVoList.add(ntextField);

        //移除列
        tableFieldVoList.remove(2);
        tableFieldVoList.remove(3);

        //修改列
        TableFieldVO updateVo1=tableFieldVoList.get(4);
        updateVo1.setFieldName(updateVo1.getFieldName()+"_UPDATE");

        tableService.updateTable(jb4DSession,tableEntity,tableFieldVoList,false);
    }

    String newTableName="Table2";
    @Test
    public void testNewTable() throws JBuild4DGenerallyException {
        TableEntity tableEntity = new TableEntity();
        tableEntity.setTableName(newTableName);
        tableEntity.setTableGroupId("11");
        tableEntity.setTableCaption(newTableName);
        tableEntity.setTableId("Table2");
        List<TableFieldVO> fieldEntities = new ArrayList<>();

        TableFieldVO idField = newFiled(jb4DSession, "Template", "ID", "ID",
                TrueFalseEnum.True, TrueFalseEnum.False,
                TableFieldTypeEnum.NVarCharType, 50, 0,
                "", "", "表主键", "");
        TableFieldVO createTimeField = newFiled(jb4DSession, "Tempalte", "F_CREATE_TIEE", "记录时间",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.DataTimeType, 20, 0,
                "", "", "", "");

        TableFieldVO intField = newFiled(jb4DSession, "Tempalte", "F_INT", "F_INT",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.IntType, 0, 0,
                "", "", "", "");

        TableFieldVO decimalField = newFiled(jb4DSession, "Tempalte", "F_DECIMAL", "F_DECIMAL",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.NumberType, 20, 2,
                "", "", "", "");

        TableFieldVO nvarcharField = newFiled(jb4DSession, "Tempalte", "F_NVARCHAR", "F_NVARCHAR",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType, 200, 0,
                "", "", "", "");

        TableFieldVO ntextField = newFiled(jb4DSession, "Tempalte", "F_NTEXT", "F_NTEXT",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");

        fieldEntities.add(idField);
        fieldEntities.add(createTimeField);
        fieldEntities.add(intField);
        fieldEntities.add(decimalField);
        fieldEntities.add(nvarcharField);
        fieldEntities.add(ntextField);
        tableService.newTable(jb4DSession, tableEntity, fieldEntities);
        //return fieldEntities;
    }

    private TableFieldVO newFiled(JB4DSession jb4DSession, String tableId, String fieldName, String fieldCaption,
                                  TrueFalseEnum pk, TrueFalseEnum allowNull,
                                  TableFieldTypeEnum fieldDataType, int dataLength, int decimalLength,
                                  String fieldDefaultValue, String fieldDefaultText, String fieldDesc, String templateName
    ){
        TableFieldVO fieldVO=new TableFieldVO();
        fieldVO.setFieldId(UUIDUtility.getUUIDNotSplit());
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
        fieldVO.setFieldTemplateName(templateName);
        return fieldVO;
    }
}
