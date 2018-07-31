package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.TableFieldMapper;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.base.tools.common.list.IListWhereCondition;
import com.jbuild4d.base.tools.common.list.ListUtility;
import com.jbuild4d.platform.builder.service.ITableFieldService;
import org.mybatis.spring.SqlSessionTemplate;

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
    public void createGeneralTemplate() {
        String generalTemplateName="GeneralTemplate";
        tableFieldMapper.deleteTemplate(generalTemplateName);
        //
        TableFieldEntity fieldEntity=new TableFieldEntity();
    }

    private TableFieldEntity newFiled(){
        TableFieldEntity fieldEntity=new TableFieldEntity();
        fieldEntity.setFieldFieldId(UUIDUtility.getUUID());
        fieldEntity.set
    }
}
